import type {
  ToolCall,
  ToolExecutionContext,
  ToolExecutionResult,
  ToolRegistry
} from "./types";

export async function executeToolCall(
  registry: ToolRegistry,
  toolCall: ToolCall,
  context: ToolExecutionContext = {}
): Promise<ToolExecutionResult> {
  const tool = registry.get(toolCall.name);

  if (!tool) {
    return {
      ok: false,
      toolCallId: toolCall.id,
      name: toolCall.name,
      error: `Unknown tool: ${toolCall.name}`
    };
  }

  const parsed = tool.inputSchema.safeParse(toolCall.arguments);
  if (!parsed.success) {
    return {
      ok: false,
      toolCallId: toolCall.id,
      name: toolCall.name,
      error: `Invalid arguments: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`
    };
  }

  try {
    const output = await tool.execute(parsed.data, context);
    return { ok: true, toolCallId: toolCall.id, name: toolCall.name, output };
  } catch (error) {
    return {
      ok: false,
      toolCallId: toolCall.id,
      name: toolCall.name,
      error: error instanceof Error ? error.message : "Tool execution failed"
    };
  }
}
