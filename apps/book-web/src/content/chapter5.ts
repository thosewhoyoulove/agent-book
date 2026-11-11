export interface ChapterSection {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export interface ChapterPrinciple {
  tag: string;
  title: string;
  description: string;
  tone?: "accent" | "default";
}

export interface ChapterEditorialMeta {
  badge: string;
  goal: string;
  flowSteps: [string, string, string, string];
  principles: [ChapterPrinciple, ChapterPrinciple, ChapterPrinciple];
  summaryHeading: string;
  summaryItems: Array<{ label: string; text: string }>;
  marginTipTitle: string;
  marginTipBody: string;
}

export const chapterFiveSections: ChapterSection[] = [
  {
    id: "opening",
    eyebrow: "问题导入",
    title: "一次回答，为什么会变成一段执行过程？",
    paragraphs: [
      "用户说：“查询今天北京的天气，再告诉我适不适合跑步。”如果只调用一次 LLM，模型最多只能根据已经写进上下文的信息生成文字。它没有实时天气数据，也没有能力直接访问气象服务。",
      "Agent 的变化发生在边界上：模型负责提出下一步动作，程序负责验证并执行动作，执行结果再回到模型可见的 `Message History`。模型与程序轮流推进任务，直到模型给出最终回答或运行时主动停止。",
      "因此，Agent 不是“更聪明的 Chatbot”。它是一套把模型决策放进受控循环的运行机制。循环的每一轮都必须留下可检查的数据：模型看到了什么、提出了什么 `toolCalls`、工具返回了什么、下一轮为什么继续。"
    ]
  },
  {
    id: "mental-model",
    eyebrow: "最小心智模型",
    title: "Agent Loop 只有三个关键动作",
    paragraphs: [
      "先把最小模型压缩成三个动作：请求模型、执行模型提出的工具调用、把结果追加回 `messages` 上下文。只要响应没有 `toolCalls`，就可以把文本当成最终答案。",
      "`while` 循环本身不是 Agent 的智能来源。它只是给模型多次观察和行动的机会。真正的控制边界来自确定性的程序代码：`ToolRegistry`、参数校验、`maxSteps`、`AbortSignal` 和错误转换。",
      "教学版会省略真实 Provider 的网络协议、Token 统计和流式增量解析，使用确定性的 `ScriptedMockProvider` 表现两次模型响应。这个假设只为了让执行过程可复现，不代表真实模型一定按脚本行动。"
    ]
  },
  {
    id: "messages",
    eyebrow: "数据结构",
    title: "消息历史就是循环的可见状态",
    paragraphs: [
      "每次循环都围绕同一个 `Message History` 展开：`user` 消息告诉模型目标，`assistant` 消息记录模型刚才的回答或工具调用，`tool` 消息记录程序执行结果。下一次模型调用会同时看到这些信息。",
      "`toolCallId` 用来把一次模型请求和对应结果关联起来。`name` 告诉执行器要找哪个工具，`arguments` 是不可信的输入，必须经过 schema 校验。工具执行器返回结构化结果后，运行时再把它序列化成 `tool` 消息。",
      "如果同一轮返回多个工具调用，执行器可以按策略串行或并行执行。首个实现使用串行执行，便于展示状态变化；并发策略、幂等键和副作用控制会在生产章节展开。"
    ]
  },
  {
    id: "failure",
    eyebrow: "失败路径",
    title: "错误也必须回到循环，而不是消失",
    paragraphs: [
      "工具不存在、参数格式错误、外部服务失败，都不能直接把异常吞掉。执行器会把错误包装成结构化 `ToolResult`，再让模型决定是否修正参数、选择另一个工具或向用户说明无法完成。",
      "与此同时，运行时保留硬边界。`maxSteps` 防止模型持续调用工具，`AbortSignal` 支持用户取消，超时机制保护外部请求。模型可以建议下一步，但不能绕过这些程序约束。",
      "如果工具具有付款、删除或发送消息等外部副作用，还需要在执行前进入人工审批状态，并使用幂等键防止重试造成重复操作。Agent Loop 只是执行骨架，安全策略必须由 Runtime 和 `ToolExecutor` 共同提供。"
    ]
  }
];

export const minimalLoopCode = `async function runAgent(input: string) {
  const messages = [{ role: "user", content: input }];

  while (true) {
    const response = await llm.chat(messages);

    if (!response.toolCalls?.length) {
      return response.content;
    }

    for (const call of response.toolCalls) {
      const result = await executeTool(call);
      messages.push({
        role: "tool",
        toolCallId: call.id,
        content: JSON.stringify(result)
      });
    }
  }
}`;

export const productionLoopCode = `export async function runAgent(options: RunAgentOptions) {
  const messages = createInitialMessages(options);

  for (let step = 1; step <= options.maxSteps; step += 1) {
    throwIfAborted(options.signal);
    const response = await options.provider.chat({
      messages,
      tools: options.registry.list(),
      signal: options.signal
    });

    messages.push({ role: "assistant", ...response });
    if (!response.toolCalls?.length) {
      return { answer: response.content ?? "", messages, steps: step };
    }

    for (const toolCall of response.toolCalls) {
      const result = await executeToolCall(options.registry, toolCall);
      messages.push(toToolMessage(toolCall, result));
    }
  }

  throw new Error("Agent stopped after reaching max steps");
}`;
