import { useEffect, useMemo, useState } from "react";
import { ScriptedMockProvider, ToolRegistry, runAgent, weatherTool } from "@agent-book/agent-core";
import type { AgentEvent, Message } from "@agent-book/agent-core";

type SimulatorEvent = AgentEvent & { id: number };
type InspectorTab = "state" | "messages" | "tool";
type MessageViewMode = "structured" | "json";

const eventLabels: Record<AgentEvent["type"], string> = {
  "message-added": "消息入栈",
  "step-start": "进入新轮次",
  "model-request": "请求模型",
  "model-response": "模型响应",
  "tool-call-start": "调用工具",
  "tool-call-result": "工具返回",
  completed: "完成输出",
  failed: "触发边界停止",
  cancelled: "已取消"
};

const statusLabels: Record<string, string> = {
  idle: "idle · 待启动",
  running: "running · 循环推进中",
  waiting_for_tool: "waiting_for_tool · 执行外部工具",
  completed: "completed · 已得出回答",
  failed: "failed · 异常或步数触顶"
};

const roleLabels: Record<Message["role"], string> = {
  system: "SYSTEM",
  user: "USER",
  assistant: "ASSISTANT",
  tool: "TOOL RESULT"
};

function eventDetail(event: AgentEvent): string {
  switch (event.type) {
    case "message-added":
      return `${event.message.role} 消息写入上下文${event.message.toolCallId ? ` · 关联 ${event.message.toolCallId}` : ""}`;
    case "step-start":
      return `第 ${event.step} 轮循环开始 · 当前携带 ${event.messageCount} 条消息`;
    case "model-request":
      return `携带 ${event.messageCount} 条上下文消息调用 LLM Provider`;
    case "model-response":
      return event.response.toolCalls?.length
        ? `模型未直接作答，提出 ${event.response.toolCalls.length} 个结构化工具调用`
        : `模型给出最终回答：${event.response.content ?? "（空）"}`;
    case "tool-call-start":
      return `${event.toolCall.name}(${JSON.stringify(event.toolCall.arguments)})`;
    case "tool-call-result":
      return event.result.ok
        ? `${event.result.name} 校验并执行成功`
        : `${event.result.name} 执行异常 · ${event.result.error}`;
    case "completed":
      return event.answer;
    case "failed":
      return event.error;
    case "cancelled":
      return "执行被 AbortSignal 终止";
  }
}

function getVisibleMessages(events: SimulatorEvent[]): Message[] {
  return events
    .filter((event): event is SimulatorEvent & { type: "message-added" } => event.type === "message-added")
    .map((event) => event.message);
}

function formatToolContent(raw: string): { isError: boolean; formatted: string } {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const isError = typeof parsed.error === "string";
    return {
      isError,
      formatted: JSON.stringify(parsed, null, 2)
    };
  } catch {
    return { isError: false, formatted: raw };
  }
}

async function collectEvents(simulateError: boolean, maxSteps: number): Promise<SimulatorEvent[]> {
  const registry = new ToolRegistry().register({
    ...weatherTool,
    async execute(input) {
      if (simulateError) throw new Error("Weather service unavailable (503)");
      return weatherTool.execute(input);
    }
  });
  const provider = new ScriptedMockProvider([
    {
      toolCalls: [
        {
          id: "weather-call-1",
          name: "get_weather",
          arguments: { city: "北京", date: "2026-11-11" }
        }
      ]
    },
    {
      content: simulateError
        ? "天气服务暂时不可用（503）。我无法确认北京实时天气，建议稍后重试或查看本地气象预报后再决定跑步计划。"
        : "北京今天 18°C，天气晴朗，北风 2 级。体感舒适，非常适合户外轻装慢跑，早晚温差略大可备一件薄风衣。"
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
    // 模拟器将异常终止同样作为可观察事件序列展示
  }
  return events;
}

export function AgentLoopSimulator() {
  const [maxSteps, setMaxSteps] = useState(4);
  const [simulateError, setSimulateError] = useState(false);
  const [events, setEvents] = useState<SimulatorEvent[]>([]);
  const [cursor, setCursor] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("state");
  const [messageViewMode, setMessageViewMode] = useState<MessageViewMode>("structured");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = async (initialCursor = 1) => {
    setPlaying(false);
    setLoading(true);
    const nextEvents = await collectEvents(simulateError, maxSteps);
    const nextCursor = Math.min(initialCursor, nextEvents.length);
    setEvents(nextEvents);
    setCursor(nextCursor);
    setSelectedIndex(Math.max(0, nextCursor - 1));
    setLoading(false);
  };

  useEffect(() => {
    void reload(1);
    // 只在实验参数变更时重新生成确定性事件流
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
    }, 720);
    return () => window.clearInterval(timer);
  }, [playing, events.length]);

  const visibleEvents = events.slice(0, cursor);
  const visibleMessages = useMemo(() => getVisibleMessages(visibleEvents), [visibleEvents]);
  const currentEvent = visibleEvents.at(-1);
  const selectedEvent = events[selectedIndex] ?? currentEvent;
  const hasFinished = cursor >= events.length && !loading;
  const canStepBack = cursor > 1 && !loading;

  const status =
    currentEvent?.type === "completed"
      ? "completed"
      : currentEvent?.type === "failed"
        ? "failed"
        : currentEvent?.type === "tool-call-start"
          ? "waiting_for_tool"
          : visibleEvents.length > 0
            ? "running"
            : "idle";

  const graphEventTypes = new Set<AgentEvent["type"]>([
    "message-added",
    "model-request",
    "tool-call-start",
    "tool-call-result",
    "completed",
    "failed"
  ]);
  const graphEvents = events
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => graphEventTypes.has(event.type));

  const latestToolCall = useMemo(() => {
    if (selectedEvent?.type === "tool-call-start") return selectedEvent.toolCall;
    const found = [...visibleEvents]
      .reverse()
      .find((item): item is SimulatorEvent & { type: "tool-call-start" } => item.type === "tool-call-start");
    return found?.toolCall;
  }, [selectedEvent, visibleEvents]);

  const latestToolResult = useMemo(() => {
    if (selectedEvent?.type === "tool-call-result") return selectedEvent.result;
    const found = [...visibleEvents]
      .reverse()
      .find((item): item is SimulatorEvent & { type: "tool-call-result" } => item.type === "tool-call-result");
    return found?.result;
  }, [selectedEvent, visibleEvents]);

  const stepBackward = () => {
    setPlaying(false);
    setCursor((current) => {
      const next = Math.max(1, current - 1);
      setSelectedIndex(next - 1);
      return next;
    });
  };

  const stepForward = () => {
    setPlaying(false);
    setCursor((current) => {
      const next = Math.min(events.length, current + 1);
      setSelectedIndex(next - 1);
      return next;
    });
  };

  const jumpToEnd = () => {
    setPlaying(false);
    setCursor(events.length);
    setSelectedIndex(Math.max(0, events.length - 1));
  };

  return (
    <section className="simulator" id="simulator" aria-labelledby="simulator-title">
      <div className="simulator__header">
        <div>
          <span className="section-kicker">交互实验台 · 01</span>
          <h2 id="simulator-title">Agent Loop Simulator</h2>
          <p>单步回放一次完整的工具调用循环，观察模型决策、参数校验与消息历史如何协同演进。</p>
        </div>
        <div className="simulator__live-badge">
          <span />
          deterministic mock
        </div>
      </div>

      <div className="simulator__controls">
        <div className="simulator__button-group" role="group" aria-label="运行步进控制">
          <button
            className="button button--primary"
            type="button"
            onClick={() => {
              if (hasFinished) {
                setCursor(1);
                setSelectedIndex(0);
              }
              setPlaying((value) => !value);
            }}
            disabled={loading}
          >
            {playing ? "暂停播放" : hasFinished ? "重新播放" : "自动播放"}
          </button>
          <button className="button" type="button" onClick={stepBackward} disabled={!canStepBack}>
            上一步
          </button>
          <button className="button" type="button" onClick={stepForward} disabled={loading || hasFinished}>
            下一步
          </button>
          <button className="button button--ghost" type="button" onClick={jumpToEnd} disabled={loading || hasFinished}>
            展开全程
          </button>
          <button className="button button--ghost" type="button" onClick={() => void reload(1)} disabled={loading}>
            重置
          </button>
        </div>

        <div className="simulator__options">
          <label className="control-field">
            <span>最大步数 (Max Steps)</span>
            <select value={maxSteps} onChange={(event) => setMaxSteps(Number(event.target.value))}>
              <option value={1}>1（触发步数上限）</option>
              <option value={2}>2</option>
              <option value={4}>4（默认）</option>
              <option value={8}>8</option>
            </select>
          </label>
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(event) => setSimulateError(event.target.checked)}
            />
            <span>模拟工具异常</span>
          </label>
        </div>
      </div>

      <div className="simulator__workspace">
        <div className="execution-graph">
          <div className="panel-heading">
            <span>执行轨迹 (Execution Trace)</span>
            <strong>
              已推进 {cursor} / {events.length} 事件
            </strong>
          </div>
          <div className="graph-list">
            {loading ? (
              <div className="loading-state">正在生成确定性执行快照…</div>
            ) : (
              graphEvents.map(({ event, index }, graphIndex) => {
                const visible = index < cursor;
                const active = index === selectedIndex;
                return (
                  <div className="graph-row" key={event.id}>
                    {graphIndex > 0 && (
                      <span className="graph-edge" aria-hidden="true">
                        ↓
                      </span>
                    )}
                    <button
                      className={`graph-node graph-node--${event.type} ${visible ? "is-visible" : "is-pending"} ${active ? "is-active" : ""}`}
                      type="button"
                      onClick={() => {
                        if (visible) {
                          setSelectedIndex(index);
                          if (event.type.startsWith("tool")) {
                            setInspectorTab("tool");
                          }
                        }
                      }}
                      disabled={!visible}
                    >
                      <span className="graph-node__index">{String(graphIndex + 1).padStart(2, "0")}</span>
                      <span className="graph-node__body">
                        <strong>{eventLabels[event.type]}</strong>
                        <small>{visible ? eventDetail(event) : "尚未执行 · 点击“下一步”推进"}</small>
                      </span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="inspector-panel">
          <div className="panel-heading">
            <span>运行检查器 (Runtime Inspector)</span>
            <code>Event #{String((selectedEvent?.id ?? 0) + 1).padStart(2, "0")}</code>
          </div>
          <div className="inspector-tabs" role="tablist" aria-label="执行检查器">
            <button
              className={inspectorTab === "state" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={inspectorTab === "state"}
              onClick={() => setInspectorTab("state")}
            >
              运行状态
            </button>
            <button
              className={inspectorTab === "messages" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={inspectorTab === "messages"}
              onClick={() => setInspectorTab("messages")}
            >
              消息历史 <b>{visibleMessages.length}</b>
            </button>
            <button
              className={inspectorTab === "tool" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={inspectorTab === "tool"}
              onClick={() => setInspectorTab("tool")}
            >
              工具契约 {latestToolCall ? <b>1</b> : null}
            </button>
          </div>

          {inspectorTab === "state" && (
            <div className="inspector-content">
              <div className={`state-chip state-chip--${status}`}>
                <span className="state-chip__dot" />
                {statusLabels[status] ?? status}
              </div>
              <div className="state-facts">
                <div>
                  <span>当前循环轮次</span>
                  <strong>{visibleEvents.filter((event) => event.type === "step-start").length}</strong>
                </div>
                <div>
                  <span>上下文消息数</span>
                  <strong>{visibleMessages.length}</strong>
                </div>
                <div>
                  <span>硬边界上限</span>
                  <strong>{maxSteps}</strong>
                </div>
              </div>
              <div className="inspector-detail">
                <span>当前聚焦事件详情</span>
                <strong>{selectedEvent ? eventLabels[selectedEvent.type] : "等待执行"}</strong>
                <pre>{selectedEvent ? eventDetail(selectedEvent) : "点击左侧执行轨迹节点查看详情。"}</pre>
              </div>
              <div className="inspector-hint">
                <span>观察要点</span>
                <p>
                  试着将 <code>Max Steps</code> 调为 <code>1</code> 或勾选“模拟工具异常”，对比硬边界熔断与工具级错误回填的差异。
                </p>
              </div>
            </div>
          )}

          {inspectorTab === "messages" && (
            <div className="inspector-content inspector-content--scroll">
              <div className="inspector-subbar">
                <span className="json-label">APPEND-ONLY MESSAGE HISTORY</span>
                <div className="view-toggle" role="group" aria-label="消息展示格式">
                  <button
                    className={messageViewMode === "structured" ? "is-active" : ""}
                    type="button"
                    onClick={() => setMessageViewMode("structured")}
                  >
                    卡片视图
                  </button>
                  <button
                    className={messageViewMode === "json" ? "is-active" : ""}
                    type="button"
                    onClick={() => setMessageViewMode("json")}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              {visibleMessages.length === 0 ? (
                <div className="empty-message">消息尚未进入模型上下文。</div>
              ) : (
                <div className="message-stack">
                  {visibleMessages.map((message, index) => {
                    const toolParsed = message.role === "tool" ? formatToolContent(message.content) : null;
                    return (
                      <div
                        className={`message-row message-row--${message.role} ${toolParsed?.isError ? "message-row--error" : ""}`}
                        key={`${message.role}-${index}`}
                      >
                        <div className="message-row__meta">
                          <span className="message-role">{roleLabels[message.role]}</span>
                          {message.toolCallId && <code className="message-call-id">{message.toolCallId}</code>}
                        </div>

                        {messageViewMode === "json" ? (
                          <pre>{JSON.stringify(message, null, 2)}</pre>
                        ) : (
                          <div className="message-structured">
                            {message.content && message.role !== "tool" && <p>{message.content}</p>}
                            {message.toolCalls?.map((call) => (
                              <div className="message-toolcall-box" key={call.id}>
                                <span>调用意图 · {call.id}</span>
                                <code>
                                  {call.name}({JSON.stringify(call.arguments)})
                                </code>
                              </div>
                            ))}
                            {toolParsed && <pre>{toolParsed.formatted}</pre>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {inspectorTab === "tool" && (
            <div className="inspector-content inspector-content--scroll">
              {!latestToolCall && !latestToolResult ? (
                <div className="empty-message">当前游标尚未到达工具调用阶段，请点击“下一步”推进循环。</div>
              ) : (
                <div className="tool-payload-stack">
                  {latestToolCall && (
                    <div className="tool-payload-card">
                      <span className="json-label">01 · 模型提出的调用请求 (ToolCall)</span>
                      <pre className="json-view">{JSON.stringify(latestToolCall, null, 2)}</pre>
                    </div>
                  )}
                  {latestToolResult && (
                    <div className={`tool-payload-card ${!latestToolResult.ok ? "tool-payload-card--error" : ""}`}>
                      <span className="json-label">
                        02 · 执行器校验与返回结果 ({latestToolResult.ok ? "ok: true" : "ok: false"})
                      </span>
                      <pre className="json-view">{JSON.stringify(latestToolResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="simulator__timeline">
        <div className="panel-heading">
          <span>有序事件时间轴 (Event Log)</span>
          <code>点击已解锁节点可随时回溯切面</code>
        </div>
        <div className="timeline-strip">
          {events.map((event, index) => (
            <button
              className={`timeline-cell timeline-cell--${event.type} ${index < cursor ? "is-visible" : "is-pending"} ${index === selectedIndex ? "is-active" : ""}`}
              type="button"
              onClick={() => {
                if (index < cursor) {
                  setSelectedIndex(index);
                  if (event.type.startsWith("tool")) {
                    setInspectorTab("tool");
                  }
                }
              }}
              disabled={index >= cursor}
              key={event.id}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span>{eventLabels[event.type]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
