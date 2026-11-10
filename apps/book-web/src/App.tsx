import { useEffect, useMemo, useState } from "react";
import { chapters } from "@agent-book/shared";
import { AgentLoopSimulator } from "./components/AgentLoopSimulator";
import { CodeBlock } from "./components/CodeBlock";
import { chapterFiveSections, minimalLoopCode, productionLoopCode } from "./content/chapter5";

const progressKey = "agent-book-progress-chapter-5";

function getInitialProgress(): number {
  if (typeof window === "undefined") return 18;
  return Number(window.localStorage.getItem(progressKey) ?? 18);
}

export function App() {
  const [dark, setDark] = useState(true);
  const [progress, setProgress] = useState(getInitialProgress);
  const [query, setQuery] = useState("");
  const availableChapters = useMemo(() => chapters.filter((chapter) => chapter.status === "available"), []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    window.localStorage.setItem(progressKey, String(progress));
  }, [progress]);

  const searchMatches = query.trim().length > 1
    ? chapterFiveSections.filter((section) => `${section.title} ${section.paragraphs.join(" ")}`.includes(query.trim()))
    : [];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-label="Agent Book home">
          <span className="brand-mark__glyph">∿</span>
          <span>AGENT BOOK <small>01 / 09</small></span>
        </div>
        <div className="topbar__actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索本章内容" aria-label="搜索本章内容" />
            <kbd>⌘ K</kbd>
          </label>
          <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={dark ? "切换到浅色主题" : "切换到深色主题"}>
            {dark ? "☼" : "◐"}
          </button>
          <div className="progress-indicator"><span>阅读进度</span><strong>{progress}%</strong></div>
        </div>
      </header>

      {searchMatches.length > 0 && (
        <div className="search-results" role="status">
          <span>找到 {searchMatches.length} 个匹配段落</span>
          {searchMatches.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
        </div>
      )}

      <div className="reading-layout">
        <aside className="sidebar">
          <div className="sidebar__intro">
            <span className="sidebar__label">学习路径</span>
            <p>从一次 LLM 调用，到完整 Agent Runtime 的设计与实现。</p>
          </div>
          <nav aria-label="章节目录">
            <div className="nav-section-label">Part 1 · 理解基础</div>
            <button className="chapter-link chapter-link--locked"><span>01</span><em>AI Agent 究竟是什么？</em><i>锁定</i></button>
            <button className="chapter-link chapter-link--locked"><span>02</span><em>理解 LLM 的工作机制</em><i>锁定</i></button>
            <button className="chapter-link chapter-link--locked"><span>03</span><em>第一次调用 LLM</em><i>锁定</i></button>
            <div className="nav-section-label">Part 2 · 执行机制</div>
            <button className="chapter-link chapter-link--locked"><span>04</span><em>Function Calling 与 Tool Use</em><i>锁定</i></button>
            {availableChapters.map((chapter) => (
              <a className="chapter-link chapter-link--active" href="#chapter-5" key={chapter.id}>
                <span>{String(chapter.number).padStart(2, "0")}</span><em>{chapter.title}</em><i>当前</i>
              </a>
            ))}
            <button className="chapter-link chapter-link--locked"><span>06</span><em>Agent Runtime 与状态机</em><i>锁定</i></button>
            <div className="nav-section-label">Part 4 · 上下文</div>
            <button className="chapter-link chapter-link--locked"><span>09</span><em>Context Engineering</em><i>锁定</i></button>
          </nav>
          <div className="sidebar__footer">
            <div className="progress-ring"><svg viewBox="0 0 36 36"><path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" /><path className="progress-ring__value" strokeDasharray={`${progress}, 100`} d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" /></svg><strong>{progress}%</strong></div>
            <div><strong>本章学习进度</strong><span>完成实验以继续</span></div>
          </div>
        </aside>

        <main className="article" id="chapter-5">
          <div className="article__meta"><span>第 05 章</span><span className="meta-line" /><span>预计阅读 45 分钟</span><span className="meta-status"><i />可交互</span></div>
          <h1>从零实现<br /><span>Agent Loop</span></h1>
          <p className="article__lead">一次 LLM 调用只是回答的开始。让模型观察工具结果、修正动作并完成任务，需要一段由程序控制的执行循环。</p>
          <div className="hero-note"><span className="hero-note__line" /><div><strong>本章的承诺</strong><p>读完这一章，你可以不依赖 Agent 框架，写出一个有工具、有停止条件、能处理失败的 TypeScript Agent。</p></div></div>

          <div className="chapter-flow" aria-label="本章学习路径">
            <div className="flow-step flow-step--active"><b>01</b><span>看见问题</span></div><i>→</i><div className="flow-step"><b>02</b><span>建立循环</span></div><i>→</i><div className="flow-step"><b>03</b><span>运行实验</span></div><i>→</i><div className="flow-step"><b>04</b><span>工程化</span></div>
          </div>

          {chapterFiveSections.map((section, index) => (
            <section className="content-section" id={section.id} key={section.id} onMouseEnter={() => setProgress(Math.max(progress, Math.min(18 + index * 16, 82)))}>
              <div className="section-number">0{index + 1}</div>
              <div className="section-body"><span className="section-kicker">{section.eyebrow}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>
          ))}

          <section className="concept-grid">
            <div className="concept-card concept-card--signal"><span>模型</span><strong>决定下一步</strong><p>输出文本或结构化 Tool Call。它只提出建议，不直接执行外部动作。</p></div>
            <div className="concept-card"><span>Runtime</span><strong>守住边界</strong><p>控制循环、校验参数、记录状态，并提供取消、超时和最大步数。</p></div>
            <div className="concept-card"><span>Tool</span><strong>改变世界</strong><p>真正访问外部系统的程序能力，必须拥有清晰的输入、输出和权限边界。</p></div>
          </section>

          <div className="diagram-block">
            <div className="diagram-block__heading"><span className="section-kicker">可视化架构</span><h2>模型与程序轮流推进任务</h2><p>循环发生在“工具结果追加回消息历史”之后。最终回答和失败分支都在这里结束。</p></div>
            <div className="execution-diagram">
              <div className="diagram-node diagram-node--user"><span>01</span><strong>User Message</strong><small>任务目标</small></div><div className="diagram-arrow">↓</div>
              <div className="diagram-node"><span>02</span><strong>Build Context</strong><small>组装消息历史</small></div><div className="diagram-arrow">↓</div>
              <div className="diagram-node diagram-node--model"><span>03</span><strong>Call LLM</strong><small>模型提出下一步</small></div>
              <div className="diagram-split"><div className="diagram-branch"><small>没有工具调用</small><div className="diagram-node diagram-node--done"><strong>Final Answer</strong><small>完成</small></div></div><div className="diagram-branch"><small>存在 Tool Call</small><div className="diagram-node diagram-node--tool"><strong>Validate → Execute</strong><small>程序执行</small></div><span className="diagram-return">↺ 追加 Tool Result，继续循环</span></div></div>
            </div>
          </div>

          <section className="code-section" id="code">
            <div className="section-kicker">最小可运行实现</div><h2>先把循环写出来，再解释每个边界</h2><p>下面的代码刻意省略网络、流式传输和持久化，只保留 Agent Loop 的控制关系。关键是：工具结果必须回到 messages，下一次模型调用才有新的观察。</p>
            <CodeBlock label="mini-agent.ts">{minimalLoopCode}</CodeBlock>
            <div className="code-explain"><div><strong>为什么需要 while？</strong><span>一次工具调用只能得到一次观察。循环让模型基于新结果重新决定是否继续。</span></div><div><strong>为什么追加 tool message？</strong><span>模型下一轮只看输入上下文。没有消息历史，它无法知道工具刚才返回了什么。</span></div><div><strong>为什么不能直接信任 arguments？</strong><span>模型输出是外部输入。schema 校验把不可信 JSON 变成工具可以接收的类型。</span></div></div>
            <CodeBlock label="agent-core/run-agent.ts">{productionLoopCode}</CodeBlock>
          </section>

          <AgentLoopSimulator />

          <section className="interview-section" id="interview">
            <div className="section-kicker">面试官视角</div><h2>把“会写”变成“会解释”</h2>
            <div className="interview-question"><span>Q</span><div><strong>Agent Loop 与普通 Workflow 有什么区别？</strong><p>Workflow 的路径通常由程序预先决定；Agent Loop 把下一步动作交给模型提出，再由程序验证和执行。两者可以组合：稳定的业务路径用 Workflow，存在开放式选择的节点交给 Agent。</p><details><summary>继续追问 01 · Tool Calling 到底是谁执行的？</summary><p>模型只生成工具名称和参数。真正的执行发生在应用侧的 Tool Executor 中，它负责注册表查找、参数校验、权限判断和调用函数。</p></details><details><summary>继续追问 02 · 如何避免 Agent 无限调用工具？</summary><p>运行时设置最大步数，还可以增加总耗时、成本、重复调用检测和工具级预算。达到硬边界时返回失败状态，让上层决定是否恢复。</p></details><details><summary>继续追问 03 · SSE 断开后如何恢复？</summary><p>把模型请求、工具执行和状态转换写入可持久化事件或 checkpoint。客户端重连时从最后确认的 Event ID 继续读取，执行端用幂等键避免重复副作用。</p></details></div></div>
          </section>

          <section className="chapter-summary"><div><span className="section-kicker">本章总结</span><h2>循环很小，边界决定它能否成为 Runtime。</h2></div><div className="summary-list"><p><b>机制：</b>模型决定下一步，程序执行工具，结果回到上下文。</p><p><b>数据：</b>Message History 记录每一轮观察和行动，是可回放的执行状态。</p><p><b>工程：</b>最大步数、参数校验、错误转换、取消和超时把开放式决策放进可控范围。</p></div><button className="button button--primary" onClick={() => setProgress(100)}>标记本章完成</button></section>
        </main>

        <aside className="outline">
          <div className="outline__title">本章目录 <span>05</span></div>
          <nav>{[...chapterFiveSections.map((section) => ({ id: section.id, title: section.eyebrow })), { id: "code", title: "最小可运行实现" }, { id: "simulator", title: "Agent Loop Simulator" }, { id: "interview", title: "面试官视角" }].map((item, index) => <a href={`#${item.id}`} key={item.id}><i>{String(index + 1).padStart(2, "0")}</i>{item.title}</a>)}</nav>
          <div className="outline__tip"><span>实验提示</span><p>先点击“单步执行”，再打开“模拟工具错误”，观察错误如何进入消息历史。</p></div>
        </aside>
      </div>
    </div>
  );
}
