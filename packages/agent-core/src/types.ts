import { z } from "zod";

export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  arguments: unknown;
}

export interface Message {
  role: MessageRole;
  content: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface LlmResponse {
  content?: string;
  toolCalls?: ToolCall[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ModelTool {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
}

export interface LlmProvider {
  chat(input: {
    messages: readonly Message[];
    tools: readonly ModelTool[];
    signal?: AbortSignal;
  }): Promise<LlmResponse>;
}

export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  execute(input: TInput, context: ToolExecutionContext): Promise<TOutput> | TOutput;
}

export interface ToolExecutionContext {
  signal?: AbortSignal;
  runId?: string;
}

export interface ToolExecutionResult {
  ok: boolean;
  toolCallId: string;
  name: string;
  output?: unknown;
  error?: string;
}

export type AgentEvent =
  | { type: "step-start"; step: number; messageCount: number }
  | { type: "model-request"; step: number; messageCount: number }
  | { type: "model-response"; step: number; response: LlmResponse }
  | { type: "tool-call-start"; step: number; toolCall: ToolCall }
  | { type: "tool-call-result"; step: number; result: ToolExecutionResult }
  | { type: "message-added"; message: Message }
  | { type: "completed"; step: number; answer: string; messages: Message[] }
  | { type: "failed"; step: number; error: string }
  | { type: "cancelled"; step: number };

export interface RunAgentOptions {
  provider: LlmProvider;
  registry: ToolRegistry;
  input: string;
  systemPrompt?: string;
  maxSteps?: number;
  signal?: AbortSignal;
  runId?: string;
  onEvent?: (event: AgentEvent) => void;
}

export interface AgentResult {
  answer: string;
  messages: Message[];
  steps: number;
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition<unknown, unknown>>();

  register<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>): this {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool already registered: ${tool.name}`);
    }
    this.tools.set(tool.name, tool as ToolDefinition<unknown, unknown>);
    return this;
  }

  get(name: string): ToolDefinition<unknown, unknown> | undefined {
    return this.tools.get(name);
  }

  list(): ModelTool[] {
    return [...this.tools.values()].map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema
    }));
  }
}
