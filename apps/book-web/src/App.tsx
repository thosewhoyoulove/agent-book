import { useEffect, useState } from "react";
import { chapters } from "@agent-book/shared";
import { AgentLoopSimulator } from "./components/AgentLoopSimulator";
import { CodeBlock } from "./components/CodeBlock";
import { chapterContent } from "./content/chapters";
import { chapterFiveSections, minimalLoopCode, productionLoopCode } from "./content/chapter5";

const progressKeyPrefix = "agent-book-progress";

function getInitialChapterId(): keyof typeof chapterContent {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.slice(1) as keyof typeof chapterContent;
    if (hash in chapterContent) return hash;
  }
  return "chapter-5";
}

function getChapterOutline(chapterId: keyof typeof chapterContent) {
  const sections = chapterContent[chapterId];
  const extraItems = chapterId === "chapter-5"
    ? [
      { id: "code", title: "最小可运行实现" },
      { id: "simulator", title: "Agent Loop Simulator" },
      { id: "interview", title: "面试官视角" }
    ]
    : [];
  return [...sections.map((section) => ({ id: section.id, title: section.eyebrow })), ...extraItems, { id: chapterId === "chapter-5" ? "chapter-summary" : `${chapterId}-summary`, title: "本章总结" }];
}

const partGroups = [
  {
    id: "part-1",
    label: "Part 1",
    title: "基础",
    chapters: [
      chapters.find((chapter) => chapter.id === "chapter-1")!,
      chapters.find((chapter) => chapter.id === "chapter-2")!,
      chapters.find((chapter) => chapter.id === "chapter-3")!
    ]
  },
  {
    id: "part-2",
    label: "Part 2",
    title: "执行机制",
    chapters: [
      chapters.find((chapter) => chapter.id === "chapter-4")!,
      chapters.find((chapter) => chapter.id === "chapter-5")!,
      chapters.find((chapter) => chapter.id === "chapter-6")!
    ]
  },
  {
    id: "part-4",
    label: "Part 4",
    title: "上下文",
    chapters: [chapters.find((chapter) => chapter.id === "chapter-9")!]
  }
];

const expandedGroupsKey = "agent-book-expanded-groups";
const expandedChaptersKey = "agent-book-expanded-chapters";

function readExpandedState(key: string, fallback: string[]): string[] {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function getInitialProgress(chapterId: keyof typeof chapterContent): number {
  if (typeof window === "undefined") return 18;
  return Number(window.localStorage.getItem(`${progressKeyPrefix}-${chapterId}`) ?? 18);
}

function getInitialTheme(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem("agent-book-theme") === "dark";
}

function GenericChapterDocument({ chapter, sections, progress, onProgressChange }: {
  chapter: typeof chapters[number];
  sections: typeof chapterContent[keyof typeof chapterContent];
  progress: number;
  onProgressChange: (value: number) => void;
}) {
  return (
    <main className="article" id={chapter.id}>
      <div className="breadcrumb"><a href="#chapter-5">Agent Book</a><span>/</span><span>{chapter.section}</span><span>/</span><strong>第 {String(chapter.number).padStart(2, "0")} 章</strong></div>
      <header className="chapter-header">
        <div className="article__meta"><span>第 {String(chapter.number).padStart(2, "0")} 章</span><span className="meta-line" /><span>预计阅读 {chapter.duration}</span><span className="meta-status"><i />可阅读</span></div>
        <h1>{chapter.title}</h1>
        <p className="article__lead">{chapter.summary}</p>
        <div className="hero-note"><span className="hero-note__line" /><div><strong>本章目标</strong><p>建立可以解释、可以测试、可以逐步扩展的 Agent 工程基础。</p></div></div>
      </header>
      <div className="chapter-flow" aria-label="本章学习路径"><div className="flow-step flow-step--active"><b>01</b><span>理解概念</span></div><i>→</i><div className="flow-step"><b>02</b><span>拆解边界</span></div><i>→</i><div className="flow-step"><b>03</b><span>形成判断</span></div><i>→</i><div className="flow-step"><b>04</b><span>工程落地</span></div></div>
      {sections.map((section, index) => (
        <section className="content-section" id={section.id} key={section.id} onMouseEnter={() => onProgressChange(Math.max(progress, Math.min(20 + index * 18, 84)))}>
          <div className="section-number">0{index + 1}</div>
          <div className="section-body"><span className="section-kicker">{section.eyebrow}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
      ))}
      <section className="concept-grid">
        <div className="concept-card"><span>原则 01</span><strong>先定边界</strong><p>把模型的建议放进可验证、可停止的程序流程。</p></div>
        <div className="concept-card"><span>原则 02</span><strong>保留状态</strong><p>每次行动都留下可以观察、回放和恢复的数据。</p></div>
        <div className="concept-card"><span>原则 03</span><strong>逐步演进</strong><p>先实现小而确定的骨架，再增加模型、工具和持久化能力。</p></div>
      </section>
      <section className="chapter-summary" id={`${chapter.id}-summary`}><div><span className="section-kicker">本章总结</span><h2>把概念变成下一步可以验证的工程决策。</h2></div><div className="summary-list"><p><b>主题：</b>{chapter.summary}</p><p><b>章节：</b>{chapter.outline.join("、")}</p><p><b>进度：</b>完成阅读后可以继续下一章的实现。</p></div><button className="button button--primary" onClick={() => onProgressChange(100)}>标记本章完成</button></section>
    </main>
  );
}

export function App() {
  const [dark, setDark] = useState(getInitialTheme);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<keyof typeof chapterContent>(getInitialChapterId);
  const [progress, setProgress] = useState(() => getInitialProgress(getInitialChapterId()));
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(() => chapterContent[getInitialChapterId()][0]?.id ?? "opening");
  const [expandedGroups, setExpandedGroups] = useState(() => readExpandedState(expandedGroupsKey, ["part-2"]));
  const [expandedChapters, setExpandedChapters] = useState(() => readExpandedState(expandedChaptersKey, ["chapter-5"]));
  const activeChapter = chapters.find((chapter) => chapter.id === activeChapterId) ?? chapters.find((chapter) => chapter.id === "chapter-5")!;
  const activeSections = chapterContent[activeChapterId];
  const activeChapterOutline = getChapterOutline(activeChapterId);
  const activePartId = partGroups.find((group) => group.chapters.some((chapter) => chapter.id === activeChapterId))?.id ?? "part-2";

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem("agent-book-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    window.localStorage.setItem(`${progressKeyPrefix}-${activeChapterId}`, String(progress));
  }, [activeChapterId, progress]);

  useEffect(() => {
    const onHashChange = () => {
      const nextChapterId = window.location.hash.slice(1) as keyof typeof chapterContent;
      if (nextChapterId in chapterContent) {
        setActiveChapterId(nextChapterId);
        setActiveSection(chapterContent[nextChapterId][0]?.id ?? "opening");
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    setProgress(getInitialProgress(activeChapterId));
  }, [activeChapterId]);

  useEffect(() => {
    setExpandedGroups((groups) => groups.includes(activePartId) ? groups : [...groups, activePartId]);
  }, [activePartId]);

  useEffect(() => {
    setExpandedChapters((chapterIds) => chapterIds.includes(activeChapterId) ? chapterIds : [...chapterIds, activeChapterId]);
  }, [activeChapterId]);

  useEffect(() => {
    window.localStorage.setItem(expandedGroupsKey, JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  useEffect(() => {
    window.localStorage.setItem(expandedChaptersKey, JSON.stringify(expandedChapters));
  }, [expandedChapters]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>("[data-search]")?.focus();
      }
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const sections = getChapterOutline(activeChapterId).map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-18% 0px -65% 0px", threshold: [0, 0.25, 0.7] });
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [activeChapterId]);

  useEffect(() => {
    if (window.location.hash === `#${activeChapterId}`) {
      document.getElementById(activeChapterId)?.scrollIntoView({ block: "start" });
    }
  }, [activeChapterId]);

  useEffect(() => {
    document.querySelector<HTMLElement>(`[data-nav-section="${activeSection}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeSection]);

  const searchMatches = query.trim().length > 1
    ? activeSections.filter((section) => `${section.title} ${section.paragraphs.join(" ")}`.includes(query.trim()))
    : [];

  const closeMobileNav = () => setMobileNavOpen(false);
  const toggleGroup = (groupId: string) => setExpandedGroups((groups) => groups.includes(groupId) ? groups.filter((id) => id !== groupId) : [...groups, groupId]);
  const toggleChapter = (chapterId: string) => setExpandedChapters((chapterIds) => chapterIds.includes(chapterId) ? chapterIds.filter((id) => id !== chapterId) : [...chapterIds, chapterId]);
  const focusSearch = () => document.querySelector<HTMLInputElement>("[data-search]")?.focus();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__leading">
          <button className="mobile-nav-toggle" onClick={() => setMobileNavOpen((value) => !value)} aria-label="打开章节目录" aria-expanded={mobileNavOpen}>
            <span /><span /><span />
          </button>
          <a className="brand-mark" href="#chapter-5" aria-label="返回 Agent Book 章节首页">
            <span className="brand-mark__glyph">∿</span>
            <span className="brand-mark__name">AGENT BOOK</span>
          </a>
          <nav className="topbar__nav" aria-label="全局导航">
            <a href="#chapter-5">章节 <span>⌄</span></a>
            <a href="#simulator">实验 <span>⌄</span></a>
            <a href="#code">源码</a>
            <a href="#interview">学习路径</a>
          </nav>
        </div>
        <div className="topbar__actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input data-search value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文档" aria-label="搜索本章内容" />
            <kbd>⌘ K</kbd>
          </label>
          <button className="ask-ai-button" onClick={() => document.querySelector<HTMLInputElement>("[data-search]")?.focus()}>问 AI</button>
          <a className="topbar__source" href="#code">源码</a>
          <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={dark ? "切换到浅色主题" : "切换到深色主题"}>
            <span aria-hidden="true">{dark ? "☼" : "◐"}</span>
          </button>
          <button className="profile-button" aria-label="打开账户菜单">◎</button>
          <div className="progress-indicator"><span>进度</span><strong>{progress}%</strong></div>
        </div>
      </header>

      {searchMatches.length > 0 && (
        <div className="search-results" role="status">
          <span>找到 {searchMatches.length} 个匹配段落</span>
          {searchMatches.map((section) => <a href={`#${section.id}`} onClick={() => setQuery("")} key={section.id}>{section.title}</a>)}
        </div>
      )}

      {mobileNavOpen && <button className="nav-scrim" onClick={closeMobileNav} aria-label="关闭章节目录" />}

      <div className="reading-layout">
        <aside className={`sidebar ${mobileNavOpen ? "sidebar--open" : ""}`}>
          <div className="sidebar__mobile-head"><span>章节目录</span><button type="button" onClick={closeMobileNav} aria-label="关闭章节目录">×</button></div>
          <div className="sidebar__header">
            <a className="sidebar__brand" href="#chapter-5" onClick={closeMobileNav}>
              <span className="sidebar__brand-mark">∿</span>
              <span><strong>Agent Book</strong><small>从零实现 AI Agent</small></span>
            </a>
            <button className="sidebar__search" type="button" onClick={focusSearch} aria-label="搜索文档">
              <span className="sidebar__search-icon" aria-hidden="true">⌕</span><span>搜索文档</span><kbd>⌘ K</kbd>
            </button>
          </div>
          <div className="sidebar__intro">
            <span className="sidebar__label">学习路径</span>
            <p>从一次 LLM 调用，到完整 Agent Runtime 的设计与实现。</p>
          </div>
          <nav className="nav-tree" aria-label="章节目录">
            {partGroups.map((group) => {
              const groupExpanded = expandedGroups.includes(group.id);
              return (
                <section className="nav-tree__group" key={group.id}>
                  <button className="nav-tree__part" type="button" onClick={() => toggleGroup(group.id)} aria-expanded={groupExpanded}>
                    <span className="nav-tree__chevron" aria-hidden="true">⌄</span>
                    <span><b>{group.label}</b><em>{group.title}</em></span>
                  </button>
                  <div className={`nav-tree__chapters ${groupExpanded ? "is-expanded" : ""}`}>
                    {group.chapters.map((chapter) => {
                      const chapterIsActive = chapter.id === activeChapterId;
                      const chapterAvailable = chapter.status === "available" && chapter.id in chapterContent;
                      const chapterExpanded = expandedChapters.includes(chapter.id) && chapterAvailable;
                      return (
                        <div className="nav-tree__chapter-wrap" key={chapter.id}>
                          <div className={`nav-tree__chapter-row ${chapterIsActive ? "is-active" : ""}`}>
                            <button className="nav-tree__chapter-toggle" type="button" onClick={() => chapterAvailable && toggleChapter(chapter.id)} aria-expanded={chapterAvailable ? chapterExpanded : undefined} aria-label={`${chapter.title}${chapterAvailable ? (chapterExpanded ? "，收起小节" : "，展开小节") : "，暂未开放"}`} disabled={!chapterAvailable}>
                              <span className="nav-tree__chevron" aria-hidden="true">⌄</span>
                            </button>
                            {chapterAvailable ? (
                              <a className="nav-tree__chapter-link" href={`#${chapter.id}`} onClick={closeMobileNav} aria-current={chapterIsActive ? "page" : undefined}>
                                <span className="nav-tree__number">{String(chapter.number).padStart(2, "0")}</span><span className="nav-tree__title">{chapter.title}</span>
                              </a>
                            ) : (
                              <button className="nav-tree__chapter-link nav-tree__chapter-link--locked" type="button" disabled>
                                <span className="nav-tree__number">{String(chapter.number).padStart(2, "0")}</span><span className="nav-tree__title">{chapter.title}</span><span className="nav-tree__status">即将</span>
                              </button>
                            )}
                          </div>
                          {chapterAvailable && chapterIsActive && (
                            <div className={`nav-tree__children ${chapterExpanded ? "is-expanded" : ""}`}>
                              {activeChapterOutline.map((item, index) => (
                                <a data-nav-section={item.id} className={`nav-tree__child ${activeSection === item.id ? "is-active" : ""}`} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); closeMobileNav(); }} aria-current={activeSection === item.id ? "location" : undefined} key={item.id}>
                                  <span>{item.title}</span><small>{String(index + 1).padStart(2, "0")}</small>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </nav>
          <div className="sidebar__footer">
            <div className="progress-ring"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" /><path className="progress-ring__value" strokeDasharray={`${progress}, 100`} d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" /></svg><strong>{progress}%</strong></div>
            <div><strong>本章学习进度</strong><span>完成实验以继续</span></div>
          </div>
        </aside>

        {activeChapterId === "chapter-5" ? (
        <main className="article" id="chapter-5">
          <div className="breadcrumb"><a href="#chapter-5">Agent Book</a><span>/</span><span>Part 02 · 执行机制</span><span>/</span><strong>第 05 章</strong></div>
          <header className="chapter-header">
            <div className="article__meta"><span>第 05 章</span><span className="meta-line" /><span>预计阅读 45 分钟</span><span className="meta-status"><i />可交互</span></div>
            <h1>从零实现<br /><span>Agent Loop</span></h1>
            <p className="article__lead">一次 LLM 调用只是回答的开始。让模型观察工具结果、修正动作并完成任务，需要一段由程序控制的执行循环。</p>
            <div className="hero-note"><span className="hero-note__line" /><div><strong>本章目标</strong><p>不依赖 Agent 框架，写出一个有工具、有停止条件、能处理失败的 TypeScript Agent。</p></div></div>
          </header>

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

          <section className="chapter-summary" id="chapter-summary"><div><span className="section-kicker">本章总结</span><h2>循环很小，边界决定它能否成为 Runtime。</h2></div><div className="summary-list"><p><b>机制：</b>模型决定下一步，程序执行工具，结果回到上下文。</p><p><b>数据：</b>Message History 记录每一轮观察和行动，是可回放的执行状态。</p><p><b>工程：</b>最大步数、参数校验、错误转换、取消和超时把开放式决策放进可控范围。</p></div><button className="button button--primary" onClick={() => setProgress(100)}>标记本章完成</button></section>
        </main>
        ) : (
          <GenericChapterDocument chapter={activeChapter} sections={activeSections} progress={progress} onProgressChange={setProgress} />
        )}

        <aside className="outline">
          <div className="outline__title">本章目录 <span>{String(activeChapter.number).padStart(2, "0")}</span></div>
          <nav>{activeChapterOutline.filter((item) => item.id !== "chapter-summary" && item.id !== `${activeChapterId}-summary`).map((item, index) => <a className={activeSection === item.id ? "is-active" : ""} href={`#${item.id}`} onClick={() => setActiveSection(item.id)} aria-current={activeSection === item.id ? "location" : undefined} key={item.id}><i>{String(index + 1).padStart(2, "0")}</i>{item.title}</a>)}</nav>
          <div className="outline__tip"><span>实验提示</span><p>先点击“单步执行”，再打开“模拟工具错误”，观察错误如何进入消息历史。</p></div>
        </aside>
      </div>
    </div>
  );
}
