import { describe, expect, it, vi } from "vitest";
import { ScriptedMockProvider, ToolRegistry } from "@agent-book/agent-core";
import { z } from "zod";
import { AgentRuntime } from "../src";

describe("AgentRuntime", () => {
  it("publishes lifecycle states around a tool call", async () => {
    const registry = new ToolRegistry().register({
      name: "weather",
      description: "weather",
      inputSchema: z.object({ city: z.string() }),
      execute: ({ city }) => ({ city, temperature: 18 })
    });
    const runtime = new AgentRuntime({
      registry,
      provider: new ScriptedMockProvider([
        { toolCalls: [{ id: "weather-1", name: "weather", arguments: { city: "北京" } }] },
        { content: "完成" }
      ])
    });
    const states: string[] = [];
    runtime.subscribe((event) => {
      if (event.type === "state-changed") states.push(event.snapshot.state);
    });

    await runtime.run("查天气");

    expect(states).toContain("waiting_for_tool");
    expect(runtime.getSnapshot().state).toBe("completed");
  });

  it("can cancel an in-flight model request", async () => {
    const provider = {
      chat: vi.fn(({ signal }: { signal?: AbortSignal }) =>
        new Promise<never>((_, reject) => {
          signal?.addEventListener("abort", () => reject(new DOMException("cancelled", "AbortError")), { once: true });
        })
      )
    };
    const runtime = new AgentRuntime({ provider, registry: new ToolRegistry() });
    const pending = runtime.run("取消我");
    await Promise.resolve();
    runtime.cancel();

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(runtime.getSnapshot().state).toBe("cancelled");
  });
});
