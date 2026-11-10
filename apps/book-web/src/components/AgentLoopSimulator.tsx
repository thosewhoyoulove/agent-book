import { useEffect, useMemo, useState } from "react";
import { ScriptedMockProvider, ToolRegistry, runAgent, weatherTool } from "@agent-book/agent-core";
import type { AgentEvent, Message } from "@agent-book/agent-core";

type SimulatorEvent = AgentEvent & { id: number };

const eventLabels: Record<AgentEvent["type"], string> = {
  "message-added": "消息追加",
  "step-start": "循环开始",
  "model-request": "请求模型",
  "model-response": "模型响应",
  "tool-call-start": "工具调用",
  "tool-call-result": "工具结果",
  completed: "完成",
  failed: "失败",
  cancelled: "取消"
};

function eventDetail(event: AgentEvent): string {
  switch (event.type) {
    case "message-added":
      return `${event.message.role} message${event.message.toolCallId ? ` · ${event.message.toolCallId}` : ""}`;
    case "step-start":
      return `step ${event.step} · ${event.messageCount} messages`;
    case "model-request":
      return `把 ${event.messageCount} 条消息发送给模型`;
    case "model-response":
      return event.response.toolCalls?.length
        ? `模型提出 ${event.response.toolCalls.length} 个工具调用`
        : `模型返回最终文本：${event.response.content ?? "（空）"}`;
    case "tool-call-start":
      return `${event.toolCall.name}(${JSON.stringify(event.toolCall.arguments)})`;
    case "tool-call-result":
      return event.result.ok ? `${event.result.name} 执行成功` : `${event.result.name} · ${event.result.error}`;
    case "completed":
      return event.answer;
    case "failed":
      return event.error;
    case "cancelled":
      return "执行被 AbortSignal 终止";
  }
}

function getVisibleMessages(events: SimulatorEvent[]): Message[] {
  return events.filter((event): event is SimulatorEvent & { type: "message-added" } => event.type === "message-added").map((event) => event.message);
}

async function collectEvents(simulateError: boolean, maxSteps: number): Promise<SimulatorEvent[]> {
  const registry = new ToolRegistry().register({
    ...weatherTool,
    async execute(input) {
      if (simulateError) throw new Error("Weather service unavailable");
      return weatherTool.execute(input);
    }
  });
  const provider = new ScriptedMockProvider([
    {
      toolCalls: [{
        id: "weather-call-1",
        name: "get_weather",
        arguments: { city: "北京", date: "2026-11-11" }
      }]
    },
    {
      content: simulateError
        ? "天气工具暂时失败。Agent 应把错误说明给用户，或在有策略时重试。"
        : "北京今天 18°C，晴，北风 2 级。天气适合轻装跑步，建议带一件薄外套。"
    }
  ]);
  const events: SimulatorEvent[] = [];
  try {
    await runAgent({
      registry,
      provider,
      input: "查询今天北京的天气，并告诉我适不适合跑步。",
      systemPrompt: "你是一个严谨的天气助手。需要实时信息时先调用天气工具。",
      maxSteps,
      onEvent: (event) => events.push({ ...event, id: events.length })
    });
  } catch {
    // 模拟器把失败作为可观察事件展示。
  }
  return events;
}

export function AgentLoopSimulator() {
  const [maxSteps, setMaxSteps] = useState(4);
  const [simulateError, setSimulateError] = useState(false);
  const [events, setEvents] = useState<SimulatorEvent[]>([]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setPlaying(false);
    setLoading(true);
    const nextEvents = await collectEvents(simulateError, maxSteps);
    setEvents(nextEvents);
    setCursor(0);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
    // 只在用户改变实验参数时重新生成确定性事件序列。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateError, maxSteps]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCursor((current) => {
        if (current >= events.length) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 700);
    return () => window.clearInterval(timer);
  }, [playing, events.length]);

  const visibleEvents = events.slice(0, cursor);
  const visibleMessages = useMemo(() => getVisibleMessages(visibleEvents), [visibleEvents]);
  const currentEvent = visibleEvents.at(-1);
  const hasFinished = cursor >= events.length && !loading;
  const status = currentEvent?.type === "completed"
    ? "completed"
    : currentEvent?.type === "failed"
      ? "failed"
      : currentEvent?.type === "tool-call-start"
        ? "waiting_for_tool"
        : visibleEvents.length > 0
          ? "running"
          : "idle";

  return (
    <section className="simulator" id="simulator" aria-labelledby="simulator-title">
      <div className="simulator__header">
        <div>
          <span className="section-kicker">动手实验 · 01</span>
          <h2 id="simulator-title">Agent Loop Simulator</h2>
          <p>让每一次模型请求、工具执行和消息追加都变成可暂停的执行记录。</p>
        </div>
        <div className="simulator__live-badge"><span /> deterministic mock</div>
      </div>

      <div className="simulator__controls">
        <button className="button button--primary" onClick={() => setPlaying((value) => !value)} disabled={loading || hasFinished}>
          {playing ? "暂停" : "自动播放"}
        </button>
        <button className="button" onClick={() => setCursor((value) => Math.min(value + 1, events.length))} disabled={loading || hasFinished}>
          单步执行
        </button>
        <button className="button" onClick={() => void reload()} disabled={loading}>
          重置
        </button>
        <label className="control-field">
          <span>Max Steps</span>
          <select value={maxSteps} onChange={(event) => setMaxSteps(Number(event.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </label>
        <label className="toggle-field">
          <input type="checkbox" checked={simulateError} onChange={(event) => setSimulateError(event.target.checked)} />
          <span>模拟工具错误</span>
        </label>
      </div>

      <div className="simulator__grid">
        <div className="timeline-panel">
          <div className="panel-heading"><span>执行时间线</span><strong>{cursor}/{events.length}</strong></div>
          {loading ? <div className="loading-state">正在生成确定性执行记录…</div> : (
            <ol className="timeline">
              {events.map((event, index) => {
                const visible = index < cursor;
                const active = index === cursor - 1;
                return (
                  <li key={event.id} className={`timeline__item ${visible ? "is-visible" : "is-pending"} ${active ? "is-active" : ""}`}>
                    <span className="timeline__marker">{String(index + 1).padStart(2, "0")}</span>
                    <div className="timeline__content">
                      <strong>{eventLabels[event.type]}</strong>
                      <span>{visible ? eventDetail(event) : "等待执行"}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="state-panel">
          <div className="panel-heading"><span>当前状态</span><code>step {visibleEvents.filter((event) => event.type === "step-start").length}</code></div>
          <div className={`state-chip state-chip--${status}`}><span className="state-chip__dot" />{status}</div>
          <div className="state-facts">
            <div><span>消息数量</span><strong>{visibleMessages.length}</strong></div>
            <div><span>工具调用</span><strong>{visibleEvents.filter((event) => event.type === "tool-call-start").length}</strong></div>
            <div><span>循环上限</span><strong>{maxSteps}</strong></div>
          </div>
          <div className="state-copy">
            <span className="state-copy__label">现在发生了什么</span>
            <p>{currentEvent ? eventDetail(currentEvent) : "点击单步执行，观察第一条用户消息如何进入上下文。"}</p>
          </div>
        </div>

        <div className="messages-panel">
          <div className="panel-heading"><span>Message History</span><code>append-only</code></div>
          <div className="message-stack">
            {visibleMessages.length === 0 ? <div className="empty-message">消息尚未进入模型上下文。</div> : visibleMessages.map((message, index) => (
              <div className={`message-row message-row--${message.role}`} key={`${message.role}-${index}`}>
                <span className="message-role">{message.role}</span>
                <pre>{message.content || (message.toolCalls ? JSON.stringify(message.toolCalls, null, 2) : "")}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
