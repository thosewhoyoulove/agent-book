import { runAgent } from "@agent-book/agent-core";
import type {
  AgentEvent,
  AgentResult,
  LlmProvider,
  ToolRegistry
} from "@agent-book/agent-core";
import type { RuntimeSnapshot, SharedAgentState } from "@agent-book/shared";

export type RuntimeEvent =
  | { type: "state-changed"; snapshot: RuntimeSnapshot }
  | { type: "agent"; event: AgentEvent };

export interface AgentRuntimeOptions {
  provider: LlmProvider;
  registry: ToolRegistry;
  systemPrompt?: string;
  maxSteps?: number;
  timeoutMs?: number;
}

const transitions: Record<SharedAgentState, SharedAgentState[]> = {
  idle: ["running"],
  running: ["running", "waiting_for_tool", "completed", "failed", "cancelled"],
  waiting_for_tool: ["running", "failed", "cancelled"],
  waiting_for_human: ["running", "failed", "cancelled"],
  completed: ["running"],
  failed: ["running"],
  cancelled: ["running"]
};

export class AgentRuntime {
  private readonly listeners = new Set<(event: RuntimeEvent) => void>();
  private controller: AbortController | undefined;
  private timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  private snapshot: RuntimeSnapshot;

  constructor(private readonly options: AgentRuntimeOptions) {
    this.snapshot = {
      runId: "idle",
      state: "idle",
      step: 0,
      messageCount: 0,
      updatedAt: Date.now()
    };
  }

  getSnapshot(): RuntimeSnapshot {
    return { ...this.snapshot };
  }

  subscribe(listener: (event: RuntimeEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async run(input: string): Promise<AgentResult> {
    this.transition("running", { runId: `run-${Date.now()}` });
    this.controller = new AbortController();
    if (this.options.timeoutMs) {
      this.timeoutHandle = setTimeout(() => this.controller?.abort(), this.options.timeoutMs);
    }

    try {
      return await runAgent({
        provider: this.options.provider,
        registry: this.options.registry,
        input,
        systemPrompt: this.options.systemPrompt,
        maxSteps: this.options.maxSteps,
        signal: this.controller?.signal,
        runId: this.snapshot.runId,
        onEvent: (event) => this.handleAgentEvent(event)
      });
    } catch (error) {
      if (this.snapshot.state !== "cancelled" && this.snapshot.state !== "failed") {
        this.transition("failed", { error: error instanceof Error ? error.message : "Agent run failed" });
      }
      throw error;
    } finally {
      if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
      this.controller = undefined;
    }
  }

  cancel(): void {
    if (this.snapshot.state === "running" || this.snapshot.state === "waiting_for_tool") {
      this.controller?.abort();
      this.transition("cancelled");
    }
  }

  private handleAgentEvent(event: AgentEvent): void {
    this.emit({ type: "agent", event });
    if (event.type === "step-start") {
      this.transition("running", { step: event.step, messageCount: event.messageCount });
    } else if (event.type === "tool-call-start") {
      this.transition("waiting_for_tool", { step: event.step });
    } else if (event.type === "tool-call-result") {
      this.transition("running", { step: event.step });
    } else if (event.type === "message-added") {
      this.patch({ messageCount: this.snapshot.messageCount + 1 });
    } else if (event.type === "completed") {
      this.transition("completed", { step: event.step, messageCount: event.messages.length });
    } else if (event.type === "failed") {
      this.transition("failed", { step: event.step, error: event.error });
    } else if (event.type === "cancelled") {
      this.transition("cancelled", { step: event.step });
    }
  }

  private transition(nextState: SharedAgentState, patch: Partial<RuntimeSnapshot> = {}): void {
    if (nextState !== this.snapshot.state && !transitions[this.snapshot.state].includes(nextState)) {
      throw new Error(`Invalid runtime transition: ${this.snapshot.state} -> ${nextState}`);
    }
    this.snapshot = {
      ...this.snapshot,
      ...patch,
      state: nextState,
      updatedAt: Date.now()
    };
    this.emit({ type: "state-changed", snapshot: this.getSnapshot() });
  }

  private patch(patch: Partial<RuntimeSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...patch, updatedAt: Date.now() };
    this.emit({ type: "state-changed", snapshot: this.getSnapshot() });
  }

  private emit(event: RuntimeEvent): void {
    for (const listener of this.listeners) listener(event);
  }
}
