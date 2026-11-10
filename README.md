# 从零实现 AI Agent

《从零实现 AI Agent：原理、架构、源码与工程实践》是一套源码驱动、可运行、可交互的 TypeScript 学习材料。

当前首个增量包含：

- `apps/book-web`：交互式书籍阅读站点
- `packages/agent-core`：原生 TypeScript Agent Loop、Tool Registry 与 Mock LLM
- `packages/agent-runtime`：状态、事件、取消、超时和最大步数边界
- 第 5 章：从零实现 Agent Loop
- Agent Loop Simulator：单步执行、自动播放、错误模拟、状态和消息历史回放

## 开始运行

环境要求：Node.js 20+、pnpm 10+

```bash
pnpm install
pnpm dev
```

打开终端显示的本地地址即可阅读。核心检查命令：

```bash
pnpm typecheck
pnpm test
pnpm build
```

项目默认使用确定性的 Mock LLM，不需要 API Key。真实模型适配将在后续章节加入服务端 Provider 层，浏览器端不会接触模型密钥。

## 目录

```text
apps/book-web       书籍站点与第 5 章实验
packages/agent-core 最小 Agent Loop 与工具执行
packages/agent-runtime 状态机与运行时边界
packages/shared     章节元数据与共享类型
content             章节 Markdown/MDX 内容源
examples             可独立运行的教学示例

docs                 架构和工程决策
```
