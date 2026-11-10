import { z } from "zod";
import type { LlmProvider, Message, ModelTool } from "./types";

export class ScriptedMockProvider implements LlmProvider {
  private callCount = 0;

  constructor(private readonly script: Array<{ content?: string; toolCalls?: Array<{ id: string; name: string; arguments: unknown }> }>) {}

  async chat(input: { messages: readonly Message[]; tools: readonly ModelTool[]; signal?: AbortSignal }) {
    if (input.signal?.aborted) {
      throw new DOMException("The model request was cancelled", "AbortError");
    }
    const response = this.script[Math.min(this.callCount, this.script.length - 1)];
    this.callCount += 1;
    return response ?? { content: "Mock LLM 没有更多响应。" };
  }

  reset(): void {
    this.callCount = 0;
  }
}

export const weatherInputSchema = z.object({
  city: z.string().min(1),
  date: z.string().min(1)
});

export const weatherTool = {
  name: "get_weather",
  description: "查询指定城市某一天的天气，只返回教学用的确定性数据。",
  inputSchema: weatherInputSchema,
  async execute(input: z.infer<typeof weatherInputSchema>) {
    if (input.city === "北京") {
      return { city: input.city, date: input.date, temperature: 18, condition: "晴", wind: "北风 2 级" };
    }
    return { city: input.city, date: input.date, temperature: 22, condition: "多云", wind: "微风" };
  }
};
