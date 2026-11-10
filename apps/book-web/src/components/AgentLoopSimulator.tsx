import { useEffect, useMemo, useState } from "react";
import { ScriptedMockProvider, ToolRegistry, runAgent, weatherTool } from "@agent-book/agent-core";
import type { AgentEvent, Message } from "@agent-book/agent-core";

type SimulatorEvent = AgentEvent & { id: number };
type InspectorTab = "state" | "messages" | "tool";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("state");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setPlaying(false);
    setLoading(true);
    const nextEvents = await collectEvents(simulateError, maxSteps);
    setEvents(nextEvents);
    setSelectedIndex(0);
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
        setSelectedIndex(current);
        return current + 1;
      });
    }, 700);
    return () => window.clearInterval(timer);
  }, [playing, events.length]);

  const visibleEvents = events.slice(0, cursor);
  const visibleMessages = useMemo(() => getVisibleMessages(visibleEvents), [visibleEvents]);
  const currentEvent = visibleEvents.at(-1);
  const selectedEvent = events[selectedIndex] ?? currentEvent;
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
  const graphEventTypes = new Set<AgentEvent["type"]>(["message-added", "model-request", "tool-call-start", "tool-call-result", "completed", "failed"]);
  const graphEvents = events.map((event, index) => ({ event, index })).filter(({ event }) => graphEventTypes.has(event.type));
  const selectedTool = selectedEvent?.type === "tool-call-start" ? selectedEvent.toolCall : undefined;
  const selectedResult = selectedEvent?.type === "tool-call-result" ? selectedEvent.result : undefined;

  return (
    <section className="simulator" id="simulator" aria-labelledby="simulator-title">
      <div className="simulator__header">
        <div>
          <span className="section-kicker">动手实验 · 01</span>
          <h2 id="simulator-title">Agent Loop Simulator</h2>
          <p>像调试 Runtime 一样查看模型请求、工具调用和消息状态。</p>
        </div>
        <div className="simulator__live-badge"><span /> deterministic mock</div>
      </div>

      <div className="simulator__controls">
        <span className="toolbar-label">RUN CONTROL</span>
        <button className="button button--primary" onClick={() => setPlaying((value) => !value)} disabled={loading || hasFinished}>{playing ? "暂停" : "自动播放"}</button>
        <button className="button" onClick={() => { setSelectedIndex(cursor); setCursor((value) => Math.min(value + 1, events.length)); }} disabled={loading || hasFinished}>单步执行</button>
        <button className="button" onClick={() => void reload()} disabled={loading}>重置</button>
        <label className="control-field"><span>Max Steps</span><select value={maxSteps} onChange={(event) => setMaxSteps(Number(event.target.value))}><option value={1}>1</option><option value={2}>2</option><option value={4}>4</option><option value={8}>8</option></select></label>
        <label className="toggle-field"><input type="checkbox" checked={simulateError} onChange={(event) => setSimulateError(event.target.checked)} /><span>模拟工具错误</span></label>
      </div>

      <div className="simulator__workspace">
        <div className="execution-graph">
          <div className="panel-heading"><span>执行图</span><strong>{cursor}/{events.length} events</strong></div>
          <div className="graph-list">
            {loading ? <div className="loading-state">正在生成执行记录…</div> : graphEvents.map(({ event, index }, graphIndex) => {
              const visible = index < cursor;
              const active = index === selectedIndex;
              return (
                <div className="graph-row" key={event.id}>
                  {graphIndex > 0 && <span className="graph-edge" aria-hidden="true">↓</span>}
                  <button className={`graph-node graph-node--${event.type} ${visible ? "is-visible" : "is-pending"} ${active ? "is-active" : ""}`} onClick={() => { if (visible) { setSelectedIndex(index); setInspectorTab(event.type.startsWith("tool") ? "tool" : "state"); } }} disabled={!visible}>
                    <span className="graph-node__index">{String(graphIndex + 1).padStart(2, "0")}</span><span><strong>{eventLabels[event.type]}</strong><small>{visible ? eventDetail(event) : "等待执行"}</small></span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="inspector-panel">
          <div className="panel-heading"><span>Inspector</span><code>event {String((selectedEvent?.id ?? 0) + 1).padStart(2, "0")}</code></div>
          <div className="inspector-tabs" role="tablist" aria-label="执行检查器">
            <button className={inspectorTab === "state" ? "is-active" : ""} onClick={() => setInspectorTab("state")}>State</button>
            <button className={inspectorTab === "messages" ? "is-active" : ""} onClick={() => setInspectorTab("messages")}>Messages <b>{visibleMessages.length}</b></button>
            <button className={inspectorTab === "tool" ? "is-active" : ""} onClick={() => setInspectorTab("tool")}>Tool Call</button>
          </div>
          {inspectorTab === "state" && <div className="inspector-content">
            <div className={`state-chip state-chip--${status}`}><span className="state-chip__dot" />{status}</div>
            <div className="state-facts"><div><span>当前 Step</span><strong>{visibleEvents.filter((event) => event.type === "step-start").length}</strong></div><div><span>消息数量</span><strong>{visibleMessages.length}</strong></div><div><span>循环上限</span><strong>{maxSteps}</strong></div></div>
            <div className="inspector-detail"><span>SELECTED EVENT</span><strong>{selectedEvent ? eventLabels[selectedEvent.type] : "等待执行"}</strong><pre>{selectedEvent ? eventDetail(selectedEvent) : "点击执行图中的节点查看详情。"}</pre></div>
          </div>}
          {inspectorTab === "messages" && <div className="inspector-content inspector-content--scroll"><div className="json-label">MESSAGE HISTORY · APPEND ONLY</div>{visibleMessages.length === 0 ? <div className="empty-message">消息尚未进入模型上下文。</div> : visibleMessages.map((message, index) => <div className={`message-row message-row--${message.role}`} key={`${message.role}-${index}`}><span className="message-role">{message.role}</span><pre>{JSON.stringify(message, null, 2)}</pre></div>)}</div>}
          {inspectorTab === "tool" && <div className="inspector-content inspector-content--scroll"><div className="json-label">TOOL PAYLOAD</div>{selectedTool ? <pre className="json-view">{JSON.stringify(selectedTool, null, 2)}</pre> : selectedResult ? <pre className="json-view">{JSON.stringify(selectedResult, null, 2)}</pre> : <div className="empty-message">点击执行图中的工具节点查看参数和返回值。</div>}</div>}
        </div>
      </div>

      <div className="simulator__timeline">
        <div className="panel-heading"><span>事件时间线</span><code>ordered execution log</code></div>
        <div className="timeline-strip">
          {events.map((event, index) => <button className={`timeline-cell ${index < cursor ? "is-visible" : "is-pending"} ${index === selectedIndex ? "is-active" : ""}`} onClick={() => { if (index < cursor) { setSelectedIndex(index); setInspectorTab(event.type.startsWith("tool") ? "tool" : "state"); } }} disabled={index >= cursor} key={event.id}><i>{String(index + 1).padStart(2, "0")}</i><span>{eventLabels[event.type]}</span></button>)}
        </div>
      </div>
    </section>
  );
}
