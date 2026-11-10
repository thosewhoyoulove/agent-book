import { executeToolCall } from "./executor";
import type {
  AgentResult,
  Message,
  RunAgentOptions,
  ToolCall
} from "./types";

function emit(options: RunAgentOptions, event: Parameters<NonNullable<RunAgentOptions["onEvent"]>>[0]): void {
  options.onEvent?.(event);
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw new DOMException("The agent run was cancelled", "AbortError");
  }
}

export async function runAgent(options: RunAgentOptions): Promise<AgentResult> {
  const maxSteps = options.maxSteps ?? 8;
  const messages: Message[] = [];
  if (options.systemPrompt) {
    messages.push({ role: "system", content: options.systemPrompt });
  }
  messages.push({ role: "user", content: options.input });
  emit(options, { type: "message-added", message: messages.at(-1)! });

  for (let step = 1; step <= maxSteps; step += 1) {
    try {
      throwIfAborted(options.signal);
      emit(options, { type: "step-start", step, messageCount: messages.length });
      emit(options, { type: "model-request", step, messageCount: messages.length });

      const response = await options.provider.chat({
        messages,
        tools: options.registry.list(),
        signal: options.signal
      });
      emit(options, { type: "model-response", step, response });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.content ?? "",
        toolCalls: response.toolCalls
      };
      messages.push(assistantMessage);
      emit(options, { type: "message-added", message: assistantMessage });

      if (!response.toolCalls?.length) {
        const answer = response.content ?? "";
        emit(options, { type: "completed", step, answer, messages: [...messages] });
        return { answer, messages, steps: step };
      }

      for (const toolCall of response.toolCalls) {
        throwIfAborted(options.signal);
        emit(options, { type: "tool-call-start", step, toolCall });
        const result = await executeToolCall(options.registry, toolCall, {
          signal: options.signal,
          runId: options.runId
        });
        emit(options, { type: "tool-call-result", step, result });
        const toolMessage: Message = {
          role: "tool",
          content: JSON.stringify(result.ok ? result.output : { error: result.error }),
          toolCallId: toolCall.id
        };
        messages.push(toolMessage);
        emit(options, { type: "message-added", message: toolMessage });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        emit(options, { type: "cancelled", step });
        throw error;
      }
      const message = error instanceof Error ? error.message : "Agent run failed";
      emit(options, { type: "failed", step, error: message });
      throw error;
    }
  }

  const error = new Error(`Agent stopped after reaching max steps (${maxSteps})`);
  emit(options, { type: "failed", step: maxSteps, error: error.message });
  throw error;
}
