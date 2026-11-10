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
    status: "upcoming",
    outline: ["三个执行模型", "Agent 的四个组成部分", "自主性与边界"]
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
    status: "upcoming",
    outline: ["Runtime 边界", "状态转换", "事件驱动"]
  },
  {
    id: "chapter-9",
    number: 9,
    title: "Context Engineering",
    section: "Part 4 · 上下文",
    summary: "让模型看到恰到好处的上下文。",
    duration: "35 分钟",
    status: "upcoming",
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
