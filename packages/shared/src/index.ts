export type ChapterId = `chapter-${number}`;

export interface ChapterMeta {
  id: ChapterId;
  number: number;
  title: string;
  section: string;
  summary: string;
  duration: string;
  status: "available" | "upcoming";
  outline: string[];
}

export const chapters: ChapterMeta[] = [
  {
    id: "chapter-1",
    number: 1,
    title: "AI Agent 究竟是什么？",
    section: "Part 1 · 基础",
    summary: "从 Chatbot、Workflow 和 Agent 的边界开始。",
    duration: "25 分钟",
    status: "available",
    outline: ["三个执行模型", "Agent 的四个组成部分", "自主性与边界"]
  },
  {
    id: "chapter-2",
    number: 2,
    title: "LLM 接口与消息协议",
    section: "Part 1 · 基础",
    summary: "理解模型请求、响应与消息历史的稳定边界。",
    duration: "30 分钟",
    status: "available",
    outline: ["请求与响应", "消息角色", "Provider 边界"]
  },
  {
    id: "chapter-3",
    number: 3,
    title: "Tool Registry 与执行器",
    section: "Part 1 · 基础",
    summary: "把工具描述、参数校验和副作用执行拆成清晰边界。",
    duration: "35 分钟",
    status: "available",
    outline: ["工具契约", "Schema 校验", "执行器边界"]
  },
  {
    id: "chapter-4",
    number: 4,
    title: "Function Calling 与 Tool Use",
    section: "Part 2 · 执行机制",
    summary: "把模型提出的工具调用转换成可验证的程序动作。",
    duration: "30 分钟",
    status: "available",
    outline: ["Tool Calling", "参数校验", "执行边界"]
  },
  {
    id: "chapter-5",
    number: 5,
    title: "从零实现 Agent Loop",
    section: "Part 2 · 执行机制",
    summary: "把一次模型调用变成可观察、可控制的执行循环。",
    duration: "45 分钟",
    status: "available",
    outline: ["问题导入", "最小心智模型", "Agent Loop", "工具调用", "失败路径", "动手实验", "面试追问"]
  },
  {
    id: "chapter-6",
    number: 6,
    title: "Agent Runtime 与状态机",
    section: "Part 2 · 执行机制",
    summary: "为循环加入生命周期、事件、取消与恢复。",
    duration: "40 分钟",
    status: "available",
    outline: ["Runtime 边界", "状态转换", "事件驱动"]
  },
  {
    id: "chapter-9",
    number: 9,
    title: "Context Engineering",
    section: "Part 4 · 上下文",
    summary: "让模型看到恰到好处的上下文。",
    duration: "35 分钟",
    status: "available",
    outline: ["Context Window", "Token Budget", "上下文压缩"]
  }
];

export type SharedAgentState =
  | "idle"
  | "running"
  | "waiting_for_tool"
  | "waiting_for_human"
  | "completed"
  | "failed"
  | "cancelled";

export interface RuntimeSnapshot {
  runId: string;
  state: SharedAgentState;
  step: number;
  messageCount: number;
  updatedAt: number;
  error?: string;
}
