import { describe, expect, it } from "vitest";
import { ScriptedMockProvider } from "../src/mock";
import { ToolRegistry, runAgent } from "../src";
import { z } from "zod";

describe("runAgent", () => {
  it("executes a tool, appends its result, and returns the final answer", async () => {
    const registry = new ToolRegistry().register({
      name: "get_weather",
      description: "weather",
      inputSchema: z.object({ city: z.string() }),
      execute: ({ city }) => ({ city, temperature: 18 })
    });
    const provider = new ScriptedMockProvider([
      { toolCalls: [{ id: "call-1", name: "get_weather", arguments: { city: "北京" } }] },
      { content: "北京今天 18°C，适合跑步。" }
    ]);
    const events: string[] = [];

    const result = await runAgent({
      provider,
      registry,
      input: "查北京天气并给出建议",
      onEvent: (event) => events.push(event.type)
    });

    expect(result.answer).toContain("18°C");
    expect(result.steps).toBe(2);
    expect(result.messages.some((message) => message.role === "tool")).toBe(true);
    expect(events).toContain("tool-call-result");
    expect(events.at(-1)).toBe("completed");
  });

  it("turns invalid arguments into a tool result for the model", async () => {
    const registry = new ToolRegistry().register({
      name: "get_weather",
      description: "weather",
      inputSchema: z.object({ city: z.string().min(1) }),
      execute: () => ({ temperature: 18 })
    });
    const provider = new ScriptedMockProvider([
      { toolCalls: [{ id: "call-invalid", name: "get_weather", arguments: { city: "" } }] },
      { content: "参数校验失败后，模型可以根据错误重新决策。" }
    ]);

    const result = await runAgent({ provider, registry, input: "测试参数校验" });
    expect(result.messages.at(-2)?.content).toContain("Invalid arguments");
    expect(result.answer).toContain("重新决策");
  });

  it("stops an agent that keeps requesting tools", async () => {
    const registry = new ToolRegistry().register({
      name: "loop_tool",
      description: "loop",
      inputSchema: z.object({}),
      execute: () => ({ ok: true })
    });
    const provider = new ScriptedMockProvider([
      { toolCalls: [{ id: "loop", name: "loop_tool", arguments: {} }] }
    ]);

    await expect(runAgent({ provider, registry, input: "循环", maxSteps: 2 })).rejects.toThrow("max steps");
  });
});
