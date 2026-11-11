import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { chapters } from "@agent-book/shared";
import { AgentLoopSimulator } from "./components/AgentLoopSimulator";
import { CodeBlock } from "./components/CodeBlock";
import { chapterContent, chapterEditorialMeta } from "./content/chapters";
import { minimalLoopCode, productionLoopCode } from "./content/chapter5";

type AvailableChapterId = keyof typeof chapterContent;

const progressKeyPrefix = "agent-book-progress";
const expandedGroupsKey = "agent-book-expanded-groups";
const expandedChaptersKey = "agent-book-expanded-chapters";

const availableChapterOrder: AvailableChapterId[] = [
  "chapter-1",
  "chapter-2",
  "chapter-3",
  "chapter-4",
  "chapter-5",
  "chapter-6",
  "chapter-9"
];

const partGroups = [
  {
    id: "part-1",
    label: "卷一",
    code: "Part 01",
    title: "基础与边界",
    chapters: [
      chapters.find((chapter) => chapter.id === "chapter-1")!,
      chapters.find((chapter) => chapter.id === "chapter-2")!,
      chapters.find((chapter) => chapter.id === "chapter-3")!
    ]
  },
  {
    id: "part-2",
    label: "卷二",
    code: "Part 02",
    title: "执行机制与运行时",
    chapters: [
      chapters.find((chapter) => chapter.id === "chapter-4")!,
      chapters.find((chapter) => chapter.id === "chapter-5")!,
      chapters.find((chapter) => chapter.id === "chapter-6")!
    ]
  },
  {
    id: "part-4",
    label: "卷四",
    code: "Part 04",
    title: "上下文工程",
    chapters: [chapters.find((chapter) => chapter.id === "chapter-9")!]
  }
];

interface SearchHit {
  key: string;
  chapterId: AvailableChapterId;
  chapterNumber: number;
  chapterTitle: string;
  sectionId: string;
  sectionTitle: string;
  snippet: string;
}

function renderFormattedText(text: string): ReactNode {
  const segments = text.split(/(`[^`]+`)/g);
  if (segments.length === 1) return text;
  return segments.map((segment, index) => {
    if (segment.startsWith("`") && segment.endsWith("`") && segment.length > 2) {
      return (
        <code className="inline-code" key={index}>
          {segment.slice(1, -1)}
        </code>
      );
    }
    return segment;
  });
}

function getInitialChapterId(): AvailableChapterId {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.slice(1) as AvailableChapterId;
    if (hash in chapterContent) return hash;
  }
  return "chapter-5";
}

function getInitialHomeState(): boolean {
  if (typeof window === "undefined") return true;
  const hash = window.location.hash.slice(1);
  return hash === "" || hash === "home";
}

function getChapterOutline(chapterId: AvailableChapterId) {
  const sections = chapterContent[chapterId];
  const extraItems =
    chapterId === "chapter-5"
      ? [
          { id: "architecture", title: "可视化循环架构" },
          { id: "code", title: "最小可运行实现" },
          { id: "simulator", title: "交互实验模拟器" },
          { id: "interview", title: "面试官深度追问" }
        ]
      : [];
  const summaryId = chapterId === "chapter-5" ? "chapter-summary" : `${chapterId}-summary`;
  return [
    ...sections.map((section) => ({ id: section.id, title: section.eyebrow })),
    ...extraItems,
    { id: summaryId, title: "本章总结" }
  ];
}

function readExpandedState(key: string, fallback: string[]): string[] {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function readProgressMap(): Record<AvailableChapterId, number> {
  const initial = {} as Record<AvailableChapterId, number>;
  for (const id of availableChapterOrder) {
    if (typeof window === "undefined") {
      initial[id] = 0;
    } else {
      const stored = Number(window.localStorage.getItem(`${progressKeyPrefix}-${id}`) ?? 0);
      initial[id] = Number.isFinite(stored) ? Math.max(0, Math.min(100, stored)) : 0;
    }
  }
  return initial;
}

function getInitialTheme(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem("agent-book-theme") === "dark";
}

function buildSnippet(paragraphs: string[], keyword: string): string {
  const full = paragraphs.join(" ").replace(/`/g, "");
  const lower = full.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx === -1) return full.slice(0, 72) + (full.length > 72 ? "…" : "");
  const start = Math.max(0, idx - 22);
  const end = Math.min(full.length, idx + keyword.length + 46);
  return `${start > 0 ? "…" : ""}${full.slice(start, end)}${end < full.length ? "…" : ""}`;
}

function HomePage({ onOpenChapter }: { onOpenChapter: (chapterId: AvailableChapterId) => void }) {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <span className="home-kicker"><i aria-hidden="true" />FIELD GUIDE · 2026 EDITION</span>
          <h1 id="home-title">攀登 Agent 的<br /><em>技术高山</em></h1>
          <p>
            一本可以探索的 Agent 工程书。沿着主线山路理解模型、工具、上下文与运行时，
            在每个 checkpoint 亲手把概念变成可运行的代码。
          </p>
          <div className="home-actions">
            <button className="button button--primary" type="button" onClick={() => onOpenChapter("chapter-1")}>
              从第一座山开始
            </button>
            <button className="button button--ghost" type="button" onClick={() => onOpenChapter("chapter-5")}>
              进入 Agent Loop 实验
            </button>
          </div>
          <div className="home-stats" aria-label="全书信息">
            <span><b>07</b> 个可探索章节</span>
            <span><b>01</b> 个交互实验</span>
            <span><b>∞</b> 条工程路线</span>
          </div>
        </div>

        <div className="home-hero__map" aria-hidden="true">
          <span className="home-map__star home-map__star--one">✦</span>
          <span className="home-map__star home-map__star--two">✦</span>
          <span className="home-map__marker home-map__marker--base">01</span>
          <span className="home-map__marker home-map__marker--peak">05</span>
          <svg className="home-mountain-art" viewBox="0 0 560 420" fill="none">
            <path d="M20 372L168 128L234 214L326 48L540 372H20Z" fill="var(--home-mountain-back)" />
            <path d="M110 372L260 166L326 254L400 150L540 372H110Z" fill="var(--home-mountain-front)" />
            <path d="M20 372L168 128L234 214L326 48L540 372" stroke="var(--home-mountain-line)" strokeWidth="3" />
            <path d="M168 128L190 166L234 214M326 48L360 116L400 150" stroke="var(--home-snow)" strokeWidth="7" strokeLinejoin="bevel" />
            <path d="M78 330C150 282 170 322 232 278C294 234 348 266 404 220C446 186 478 214 526 178" stroke="var(--accent)" strokeWidth="3" strokeDasharray="7 10" />
            <path d="M78 330L78 282M526 178L526 130" stroke="var(--tool)" strokeWidth="3" />
          </svg>
        </div>
      </section>

      <section className="home-route" aria-labelledby="route-title">
        <div className="home-section-heading">
          <div>
            <span className="home-kicker"><i aria-hidden="true" />THE ASCENT MAP</span>
            <h2 id="route-title">选择一条路线，开始向上</h2>
          </div>
          <p>主线从基础边界出发，经过执行机制，最终抵达上下文工程的高处。</p>
        </div>

        <div className="home-route__groups">
          {partGroups.map((group) => (
            <section className="home-route__group" key={group.id}>
              <div className="home-route__group-label">
                <span>{group.label}</span>
                <strong>{group.title}</strong>
                <i aria-hidden="true" />
              </div>
              <div className="home-chapter-grid">
                {group.chapters.map((chapter) => (
                  <button
                    className={`home-chapter-card ${chapter.id === "chapter-5" ? "home-chapter-card--featured" : ""}`}
                    type="button"
                    onClick={() => onOpenChapter(chapter.id as AvailableChapterId)}
                    key={chapter.id}
                  >
                    <span className="home-chapter-card__number">{String(chapter.number).padStart(2, "0")}</span>
                    <span className="home-chapter-card__icon" aria-hidden="true">{chapter.id === "chapter-5" ? "✦" : "◇"}</span>
                    <span className="home-chapter-card__body">
                      <small>{chapter.section} · {chapter.duration}</small>
                      <strong>{chapter.title}</strong>
                      <span>{chapter.summary}</span>
                    </span>
                    <span className="home-chapter-card__arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>AGENT BOOK</span>
        <span>学习 Agent 开发，就像攀登一座技术高山。</span>
      </footer>
    </main>
  );
}

export function App() {
  const [dark, setDark] = useState(getInitialTheme);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedHitIndex, setSelectedHitIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isHome, setIsHome] = useState(getInitialHomeState);

  const [activeChapterId, setActiveChapterId] = useState<AvailableChapterId>(getInitialChapterId);
  const [progressMap, setProgressMap] = useState<Record<AvailableChapterId, number>>(readProgressMap);
  const [activeSection, setActiveSection] = useState(
    () => chapterContent[getInitialChapterId()][0]?.id ?? "opening"
  );
  const [expandedGroups, setExpandedGroups] = useState(() =>
    readExpandedState(expandedGroupsKey, ["part-1", "part-2", "part-4"])
  );
  const [expandedChapters, setExpandedChapters] = useState(() =>
    readExpandedState(expandedChaptersKey, [getInitialChapterId()])
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionNavigationRef = useRef<{ targetId: string; timeoutId: number } | null>(null);

  const activeChapter =
    chapters.find((chapter) => chapter.id === activeChapterId) ??
    chapters.find((chapter) => chapter.id === "chapter-5")!;
  const activeSections = chapterContent[activeChapterId];
  const editorial = chapterEditorialMeta[activeChapterId];
  const activeChapterOutline = useMemo(() => getChapterOutline(activeChapterId), [activeChapterId]);
  const activePart =
    partGroups.find((group) => group.chapters.some((chapter) => chapter.id === activeChapterId)) ??
    partGroups[1];

  const currentChapterProgress = progressMap[activeChapterId] ?? 0;
  const completedChaptersCount = availableChapterOrder.filter((id) => (progressMap[id] ?? 0) >= 100).length;

  const activeOrderIndex = availableChapterOrder.indexOf(activeChapterId);
  const prevChapterId = activeOrderIndex > 0 ? availableChapterOrder[activeOrderIndex - 1] : undefined;
  const nextChapterId =
    activeOrderIndex >= 0 && activeOrderIndex < availableChapterOrder.length - 1
      ? availableChapterOrder[activeOrderIndex + 1]
      : undefined;
  const prevChapter = prevChapterId ? chapters.find((item) => item.id === prevChapterId) : undefined;
  const nextChapter = nextChapterId ? chapters.find((item) => item.id === nextChapterId) : undefined;

  const updateChapterProgress = (chapterId: AvailableChapterId, nextValue: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextValue)));
    setProgressMap((prev) => {
      const updated = Math.max(prev[chapterId] ?? 0, clamped);
      if (updated === prev[chapterId]) return prev;
      window.localStorage.setItem(`${progressKeyPrefix}-${chapterId}`, String(updated));
      return { ...prev, [chapterId]: updated };
    });
  };

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem("agent-book-theme", dark ? "dark" : "light");
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", dark ? "#081522" : "#e7eef4");
    }
  }, [dark]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "" || hash === "home") {
        setIsHome(true);
        setMobileNavOpen(false);
        setMobileOutlineOpen(false);
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      const hashTarget = hash as AvailableChapterId;
      if (hashTarget in chapterContent) {
        setIsHome(false);
        setActiveChapterId(hashTarget);
        setActiveSection(chapterContent[hashTarget][0]?.id ?? "opening");
        setMobileOutlineOpen(false);
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    setExpandedGroups((groups) => (groups.includes(activePart.id) ? groups : [...groups, activePart.id]));
    setExpandedChapters((chapterIds) =>
      chapterIds.includes(activeChapterId) ? chapterIds : [...chapterIds, activeChapterId]
    );
  }, [activePart.id, activeChapterId]);

  useEffect(() => {
    window.localStorage.setItem(expandedGroupsKey, JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  useEffect(() => {
    window.localStorage.setItem(expandedChaptersKey, JSON.stringify(expandedChapters));
  }, [expandedChapters]);

  useEffect(() => {
    const computeScroll = () => {
      if (isHome) {
        setScrollPercent(0);
        return;
      }
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setScrollPercent(0);
        return;
      }
      const ratio = Math.max(0, Math.min(100, (window.scrollY / scrollable) * 100));
      setScrollPercent(ratio);
      if (ratio > 12) {
        updateChapterProgress(activeChapterId, Math.min(95, ratio));
      }
    };
    computeScroll();
    window.addEventListener("scroll", computeScroll, { passive: true });
    window.addEventListener("resize", computeScroll);
    return () => {
      window.removeEventListener("scroll", computeScroll);
      window.removeEventListener("resize", computeScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapterId, isHome]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileNavOpen(false);
        setMobileOutlineOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setSelectedHitIndex(0);
      window.setTimeout(() => searchInputRef.current?.focus(), 20);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  useEffect(() => {
    if (isHome) return;
    const sectionNodes = activeChapterOutline
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const navigation = sectionNavigationRef.current;
        if (navigation) {
          const targetReached = entries.some(
            (entry) => entry.target.id === navigation.targetId && entry.isIntersecting
          );
          if (!targetReached) return;

          window.clearTimeout(navigation.timeoutId);
          sectionNavigationRef.current = null;
          setActiveSection(navigation.targetId);
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-16% 0px -66% 0px", threshold: [0, 0.25, 0.7] }
    );
    sectionNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activeChapterOutline, isHome]);

  useEffect(() => {
    document.querySelector<HTMLElement>(`[data-nav-section="${activeSection}"]`)?.scrollIntoView({
      block: "nearest"
    });
  }, [activeSection]);

  const searchHits = useMemo<SearchHit[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return availableChapterOrder.map((chapterId) => {
        const meta = chapters.find((item) => item.id === chapterId)!;
        const firstSection = chapterContent[chapterId][0]!;
        return {
          key: chapterId,
          chapterId,
          chapterNumber: meta.number,
          chapterTitle: meta.title,
          sectionId: chapterId,
          sectionTitle: meta.section,
          snippet: meta.summary
        };
      });
    }

    const lower = trimmed.toLowerCase();
    const hits: SearchHit[] = [];

    for (const chapterId of availableChapterOrder) {
      const meta = chapters.find((item) => item.id === chapterId)!;
      const sections = chapterContent[chapterId];
      for (const section of sections) {
        const haystack = `${meta.title} ${section.eyebrow} ${section.title} ${section.paragraphs.join(" ")}`
          .replace(/`/g, "")
          .toLowerCase();
        if (haystack.includes(lower)) {
          hits.push({
            key: `${chapterId}-${section.id}`,
            chapterId,
            chapterNumber: meta.number,
            chapterTitle: meta.title,
            sectionId: section.id,
            sectionTitle: `${section.eyebrow} · ${section.title}`,
            snippet: buildSnippet(section.paragraphs, trimmed)
          });
        }
      }
    }
    return hits.slice(0, 12);
  }, [query]);

  useEffect(() => {
    setSelectedHitIndex(0);
  }, [query]);

  const clearSectionNavigation = () => {
    const navigation = sectionNavigationRef.current;
    if (navigation) {
      window.clearTimeout(navigation.timeoutId);
      sectionNavigationRef.current = null;
    }
  };

  const beginSectionNavigation = (targetId: string) => {
    clearSectionNavigation();
    const timeoutId = window.setTimeout(() => {
      if (sectionNavigationRef.current?.targetId !== targetId) return;
      sectionNavigationRef.current = null;
      setActiveSection(targetId);
    }, 1500);
    sectionNavigationRef.current = { targetId, timeoutId };
    setActiveSection(targetId);
  };

  const scrollToSection = (targetId: string) => {
    beginSectionNavigation(targetId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const navigateToHome = () => {
    clearSectionNavigation();
    setMobileNavOpen(false);
    setMobileOutlineOpen(false);
    setSearchOpen(false);
    setIsHome(true);
    window.history.pushState(null, "", "#home");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const navigateToChapter = (chapterId: AvailableChapterId, targetSectionId?: string) => {
    setMobileNavOpen(false);
    setMobileOutlineOpen(false);
    setSearchOpen(false);
    setIsHome(false);

    if (chapterId !== activeChapterId) {
      window.history.pushState(null, "", `#${chapterId}`);
      setActiveChapterId(chapterId);
      const fallbackSection = targetSectionId && targetSectionId !== chapterId
        ? targetSectionId
        : chapterContent[chapterId][0]?.id ?? "opening";
      beginSectionNavigation(fallbackSection);
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          if (targetSectionId && targetSectionId !== chapterId) {
            document.getElementById(targetSectionId)?.scrollIntoView({ behavior: "auto", block: "start" });
          } else {
            window.scrollTo({ top: 0, behavior: "auto" });
          }
        }, 40);
      });
    } else if (targetSectionId && targetSectionId !== chapterId) {
      scrollToSection(targetSectionId);
    } else {
      clearSectionNavigation();
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const toggleGroup = (groupId: string) =>
    setExpandedGroups((groups) =>
      groups.includes(groupId) ? groups.filter((id) => id !== groupId) : [...groups, groupId]
    );

  const toggleChapter = (chapterId: string) =>
    setExpandedChapters((chapterIds) =>
      chapterIds.includes(chapterId)
        ? chapterIds.filter((id) => id !== chapterId)
        : [...chapterIds, chapterId]
    );

  const activeOutlineLabel =
    activeChapterOutline.find((item) => item.id === activeSection)?.title ?? activeChapterOutline[0]?.title;
  const summarySectionId = activeChapterId === "chapter-5" ? "chapter-summary" : `${activeChapterId}-summary`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__leading">
          {!isHome && (
            <button
              className="mobile-nav-toggle"
              type="button"
              onClick={() => setMobileNavOpen((value) => !value)}
              aria-label="打开全书目录"
              aria-expanded={mobileNavOpen}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2.5 4.25H13.5M2.5 8H13.5M2.5 11.75H10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <a
            className="brand-mark"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              navigateToHome();
            }}
            aria-label="打开 Agent Book 首页"
          >
            <span className="brand-mark__glyph" aria-hidden="true">▲</span>
            <span className="brand-mark__text">
              <span className="brand-mark__name">AGENT BOOK</span>
              <span className="brand-mark__sub">从零实现 AI Agent</span>
            </span>
          </a>

          <div className="topbar__running-head" aria-hidden="true">
            <span className="topbar__divider" />
            <span className="topbar__part">{activePart.code}</span>
            <span className="topbar__sep">/</span>
            <strong className="topbar__chapter">
              第 {String(activeChapter.number).padStart(2, "0")} 章 · {activeChapter.title}
            </strong>
          </div>
        </div>

        <div className="topbar__actions">
          <button
            className="search-trigger"
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="全局搜索书本内容"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.6 10.6L13.8 13.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="search-trigger__placeholder">检索全书章节…</span>
            <kbd>⌘K</kbd>
          </button>

          <a
            className="topbar-link"
            href="https://github.com/thosewhoyoulove/agent-book"
            target="_blank"
            rel="noreferrer"
            aria-label="访问 GitHub 源码仓库"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0.2A7.8 7.8 0 0 0 5.53 15.4c.39.07.53-.17.53-.38v-1.36c-2.17.47-2.63-1.05-2.63-1.05-.35-.9-.87-1.14-.87-1.14-.71-.49.05-.48.05-.48.79.06 1.2.81 1.2.81.7 1.2 1.83.85 2.28.65.07-.51.27-.85.5-1.05-1.73-.2-3.55-.87-3.55-3.85 0-.85.3-1.55.8-2.1-.08-.2-.35-1 .08-2.07 0 0 .66-.21 2.15.8a7.44 7.44 0 0 1 3.92 0c1.49-1.01 2.15-.8 2.15-.8.43 1.07.16 1.87.08 2.07.5.55.8 1.25.8 2.1 0 2.99-1.82 3.65-3.56 3.84.28.24.53.72.53 1.46v2.16c0 .21.14.46.54.38A7.8 7.8 0 0 0 8 0.2Z" />
            </svg>
            <span>源码仓库</span>
          </a>

          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDark((value) => !value)}
            aria-label={dark ? "切换为晨雾阅读主题" : "切换为夜峰阅读主题"}
          >
            {dark ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.5 4.5M11.5 11.5L12.6 12.6M12.6 3.4L11.5 4.5M4.5 11.5L3.4 12.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span>晨雾</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13.2 10.1A5.5 5.5 0 0 1 5.9 2.8a5.6 5.6 0 1 0 7.3 7.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                <span>夜峰</span>
              </>
            )}
          </button>
        </div>

        <div className="topbar__progress-track" aria-hidden="true">
          <div className="topbar__progress-bar" style={{ width: `${scrollPercent}%` }} />
        </div>
      </header>

      {!isHome && (
        <div className="mobile-outline-bar">
          <button
          className="mobile-outline-bar__trigger"
          type="button"
          onClick={() => setMobileOutlineOpen((open) => !open)}
          aria-expanded={mobileOutlineOpen}
        >
          <span className="mobile-outline-bar__chapter">
            第 {String(activeChapter.number).padStart(2, "0")} 章
          </span>
          <span className="mobile-outline-bar__section">{activeOutlineLabel}</span>
          <span className={`mobile-outline-bar__chevron ${mobileOutlineOpen ? "is-open" : ""}`} aria-hidden="true">
            ⌄
          </span>
        </button>
        {mobileOutlineOpen && (
          <div className="mobile-outline-bar__menu">
            {activeChapterOutline.map((item, idx) => (
              <a
                className={activeSection === item.id ? "is-active" : ""}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  setMobileOutlineOpen(false);
                  scrollToSection(item.id);
                }}
                key={item.id}
              >
                <i>{String(idx + 1).padStart(2, "0")}</i>
                <span>{item.title}</span>
              </a>
            ))}
          </div>
          )}
        </div>
      )}

      {searchOpen && (
        <div
          className="search-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="全书章节检索"
          onClick={() => setSearchOpen(false)}
        >
          <div className="search-modal" onClick={(event) => event.stopPropagation()}>
            <div className="search-modal__input-row">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.6 10.6L13.8 13.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setSelectedHitIndex((idx) => (searchHits.length ? (idx + 1) % searchHits.length : 0));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setSelectedHitIndex((idx) =>
                      searchHits.length ? (idx - 1 + searchHits.length) % searchHits.length : 0
                    );
                  } else if (event.key === "Enter" && searchHits[selectedHitIndex]) {
                    event.preventDefault();
                    const hit = searchHits[selectedHitIndex];
                    navigateToChapter(hit.chapterId, hit.sectionId);
                  }
                }}
                placeholder="输入关键词检索全书（如：AbortSignal、幂等、Schema、Token）…"
                aria-label="输入搜索词"
              />
              <button className="search-modal__esc" type="button" onClick={() => setSearchOpen(false)}>
                ESC
              </button>
            </div>

            <div className="search-modal__caption">
              {query.trim()
                ? `共检索到 ${searchHits.length} 处相关章节段落`
                : "书目速览 · 选择任意章节直达阅读"}
            </div>

            <div className="search-modal__list" role="listbox">
              {searchHits.length === 0 ? (
                <div className="search-modal__empty">未找到包含“{query}”的段落，请尝试搜索协议名或章节概念。</div>
              ) : (
                searchHits.map((hit, idx) => (
                  <button
                    className={`search-hit ${idx === selectedHitIndex ? "is-selected" : ""}`}
                    type="button"
                    role="option"
                    aria-selected={idx === selectedHitIndex}
                    onMouseEnter={() => setSelectedHitIndex(idx)}
                    onClick={() => navigateToChapter(hit.chapterId, hit.sectionId)}
                    key={hit.key}
                  >
                    <div className="search-hit__top">
                      <span className="search-hit__badge">
                        第 {String(hit.chapterNumber).padStart(2, "0")} 章 · {hit.chapterTitle}
                      </span>
                      <span className="search-hit__section">{hit.sectionTitle}</span>
                    </div>
                    <p className="search-hit__snippet">{hit.snippet}</p>
                  </button>
                ))
              )}
            </div>

            <div className="search-modal__footer">
              <span><kbd>↑</kbd> <kbd>↓</kbd> 移动选择</span>
              <span><kbd>↵</kbd> 跳转阅读</span>
              <span><kbd>ESC</kbd> 关闭面板</span>
            </div>
          </div>
        </div>
      )}

      {!isHome && mobileNavOpen && (
        <button className="nav-scrim" type="button" onClick={() => setMobileNavOpen(false)} aria-label="关闭目录抽屉" />
      )}

      {isHome ? (
        <HomePage onOpenChapter={navigateToChapter} />
      ) : (
        <div className="reading-layout">
        <aside className={`sidebar ${mobileNavOpen ? "sidebar--open" : ""}`} aria-label="全书卷目导航">
          <div className="sidebar__mobile-head">
            <span>全书目录</span>
            <button type="button" onClick={() => setMobileNavOpen(false)} aria-label="关闭目录">
              ×
            </button>
          </div>

          <div className="sidebar__bookplate">
            <span className="sidebar__edition">SOURCE-DRIVEN EDITION</span>
            <strong>从零实现 AI Agent</strong>
            <p>原理、架构、TypeScript 源码与生产级工程边界实践。</p>
          </div>

          <nav className="nav-tree" aria-label="章节树">
            {partGroups.map((group) => {
              const groupExpanded = expandedGroups.includes(group.id);
              return (
                <section className="nav-tree__group" key={group.id}>
                  <button
                    className="nav-tree__part"
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={groupExpanded}
                  >
                    <span className="nav-tree__chevron" aria-hidden="true">⌄</span>
                    <span className="nav-tree__part-meta">
                      <b>{group.label}</b>
                      <em>{group.title}</em>
                    </span>
                  </button>

                  <div className={`nav-tree__chapters ${groupExpanded ? "is-expanded" : ""}`}>
                    {group.chapters.map((chapter) => {
                      const chapterId = chapter.id as AvailableChapterId;
                      const chapterIsActive = chapterId === activeChapterId;
                      const chapterAvailable = chapter.status === "available" && chapter.id in chapterContent;
                      const chapterExpanded = expandedChapters.includes(chapter.id) && chapterAvailable;
                      const isCompleted = chapterAvailable && (progressMap[chapterId] ?? 0) >= 100;

                      return (
                        <div className="nav-tree__chapter-wrap" key={chapter.id}>
                          <div className={`nav-tree__chapter-row ${chapterIsActive ? "is-active" : ""}`}>
                            <button
                              className="nav-tree__chapter-toggle"
                              type="button"
                              onClick={() => chapterAvailable && toggleChapter(chapter.id)}
                              aria-expanded={chapterAvailable ? chapterExpanded : undefined}
                              aria-label={`${chapter.title}${chapterAvailable ? (chapterExpanded ? "，收起小节" : "，展开小节") : "，暂未开放"}`}
                              disabled={!chapterAvailable}
                            >
                              <span className="nav-tree__chevron" aria-hidden="true">⌄</span>
                            </button>

                            {chapterAvailable ? (
                              <a
                                className="nav-tree__chapter-link"
                                href={`#${chapter.id}`}
                                onClick={(event) => {
                                  event.preventDefault();
                                  navigateToChapter(chapterId);
                                }}
                                aria-current={chapterIsActive ? "page" : undefined}
                              >
                                <span className="nav-tree__number">
                                  {String(chapter.number).padStart(2, "0")}
                                </span>
                                <span className="nav-tree__title">{chapter.title}</span>
                                {isCompleted && (
                                  <span className="nav-tree__done" title="已读完本章" aria-label="已读完">
                                    ✓
                                  </span>
                                )}
                              </a>
                            ) : (
                              <button className="nav-tree__chapter-link nav-tree__chapter-link--locked" type="button" disabled>
                                <span className="nav-tree__number">
                                  {String(chapter.number).padStart(2, "0")}
                                </span>
                                <span className="nav-tree__title">{chapter.title}</span>
                                <span className="nav-tree__status">撰稿中</span>
                              </button>
                            )}
                          </div>

                          {chapterAvailable && chapterIsActive && (
                            <div className={`nav-tree__children ${chapterExpanded ? "is-expanded" : ""}`}>
                              {activeChapterOutline.map((item, index) => (
                                <a
                                  data-nav-section={item.id}
                                  className={`nav-tree__child ${activeSection === item.id ? "is-active" : ""}`}
                                  href={`#${item.id}`}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    setMobileNavOpen(false);
                                    scrollToSection(item.id);
                                  }}
                                  aria-current={activeSection === item.id ? "location" : undefined}
                                  key={item.id}
                                >
                                  <span>{item.title}</span>
                                  <small>{String(index + 1).padStart(2, "0")}</small>
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
            <div className="progress-ring">
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" />
                <path
                  className="progress-ring__value"
                  strokeDasharray={`${currentChapterProgress}, 100`}
                  d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"
                />
              </svg>
              <strong>{currentChapterProgress}%</strong>
            </div>
            <div className="sidebar__footer-meta">
              <strong>本章阅读进度</strong>
              <span>
                全书已完成 {completedChaptersCount} / {availableChapterOrder.length} 章
              </span>
            </div>
          </div>
        </aside>

        <main className="article" id={activeChapter.id}>
          <nav className="breadcrumb" aria-label="面包屑">
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                navigateToHome();
              }}
            >
              Agent Book
            </a>
            <span aria-hidden="true">/</span>
            <span>{activeChapter.section}</span>
            <span aria-hidden="true">/</span>
            <strong>第 {String(activeChapter.number).padStart(2, "0")} 章</strong>
          </nav>

          <header className="chapter-header">
            <div className="article__meta">
              <span className="article__chapter-no">CHAPTER {String(activeChapter.number).padStart(2, "0")}</span>
              <span className="meta-line" aria-hidden="true" />
              <span>预计精读 {activeChapter.duration}</span>
              <span className={`meta-status ${activeChapterId === "chapter-5" ? "meta-status--interactive" : ""}`}>
                <i aria-hidden="true" />
                {editorial.badge}
              </span>
            </div>

            <h1>{activeChapter.title}</h1>
            <p className="article__lead">{activeChapter.summary}</p>

            <div className="hero-note">
              <span className="hero-note__line" aria-hidden="true" />
              <div>
                <strong>本章核心命题</strong>
                <p>{editorial.goal}</p>
              </div>
            </div>
          </header>

          <div className="chapter-flow" aria-label="本章阅读脉络">
            {editorial.flowSteps.map((stepLabel, idx) => (
              <div className="chapter-flow__group" key={stepLabel}>
                <div className={`flow-step ${idx === 0 ? "flow-step--active" : ""}`}>
                  <b>0{idx + 1}</b>
                  <span>{stepLabel}</span>
                </div>
                {idx < editorial.flowSteps.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>

          {activeSections.map((section, index) => (
            <section className="content-section" id={section.id} key={section.id}>
              <div className="section-number" aria-hidden="true">
                §0{index + 1}
              </div>
              <div className="section-body">
                <span className="section-kicker">{section.eyebrow}</span>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={`${section.id}-${pIndex}`}>{renderFormattedText(paragraph)}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="concept-grid" aria-label="核心工程原则">
            {editorial.principles.map((item) => (
              <div
                className={`concept-card ${item.tone === "accent" ? "concept-card--accent" : ""}`}
                key={item.tag}
              >
                <span>{item.tag}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </section>

          {activeChapterId === "chapter-5" && (
            <>
              <section className="diagram-block" id="architecture">
                <div className="diagram-block__heading">
                  <span className="section-kicker">可视化架构图</span>
                  <h2>模型与宿主程序轮流推进任务</h2>
                  <p>
                    闭环发生在“工具结果序列化回消息历史”之后。每一次模型调用只负责观察当前历史并提出下一步意图，最终回答与硬边界熔断都在这里收口。
                  </p>
                </div>

                <div className="execution-diagram">
                  <div className="diagram-stage">
                    <div className="diagram-node diagram-node--user">
                      <span>STEP 01 · INPUT</span>
                      <strong>User Message</strong>
                      <small>用户提交自然语言目标</small>
                    </div>
                    <div className="diagram-connector" aria-hidden="true">
                      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                        <path d="M10 2V24M10 24L5 19M10 24L15 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="diagram-node">
                      <span>STEP 02 · STATE</span>
                      <strong>Assemble Message History</strong>
                      <small>汇聚 system / user / 历史观察</small>
                    </div>
                    <div className="diagram-connector" aria-hidden="true">
                      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                        <path d="M10 2V24M10 24L5 19M10 24L15 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="diagram-node diagram-node--model">
                      <span>STEP 03 · REASONING</span>
                      <strong>Call LLM Provider</strong>
                      <small>模型决策：直接回答或提出 ToolCall</small>
                    </div>
                  </div>

                  <div className="diagram-split">
                    <div className="diagram-branch">
                      <span className="diagram-branch__tag">分支 A · 无工具调用</span>
                      <div className="diagram-node diagram-node--done">
                        <span>TERMINAL</span>
                        <strong>Return Final Answer</strong>
                        <small>循环正常收敛，返回最终答复</small>
                      </div>
                    </div>

                    <div className="diagram-branch">
                      <span className="diagram-branch__tag diagram-branch__tag--tool">分支 B · 包含 ToolCall</span>
                      <div className="diagram-node diagram-node--tool">
                        <span>EXECUTION BOUNDARY</span>
                        <strong>Validate Schema → Execute Tool</strong>
                        <small>参数校验、权限守卫与异常捕获</small>
                      </div>
                      <div className="diagram-loopback">
                        <span>↺ 封装为 tool 消息追加回 Message History，进入下一轮 STEP 02</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="code-section" id="code">
                <span className="section-kicker">最小可运行实现</span>
                <h2>先把循环骨架写出来，再收紧每一道工程边界</h2>
                <p>
                  第一段代码刻意剥离网络重试、流式分片与持久化，只呈现 Agent Loop 最纯粹的控制关系：工具返回结果必须追加回{" "}
                  <code className="inline-code">messages</code>，下一轮模型推理才具备新的外部观察。
                </p>

                <CodeBlock
                  label="examples/mini-agent.ts"
                  highlightLines={[7, 8, 13, 14, 15, 16, 17]}
                  caption="清单 5-1：二十行代码表达 Agent Loop 的核心终止条件与观察回填。"
                >
                  {minimalLoopCode}
                </CodeBlock>

                <div className="code-explain">
                  <div>
                    <strong>为什么需要 while / for 循环？</strong>
                    <span>单次工具调用只能换回一次观察。循环赋予模型根据新结果继续检索、修正参数或收敛作答的机会。</span>
                  </div>
                  <div>
                    <strong>为什么必须追加 tool message？</strong>
                    <span>LLM 本身无状态，下一轮推理只读取传入的 messages。不写回历史，模型就不知道工具刚才返回了什么。</span>
                  </div>
                  <div>
                    <strong>为什么绝不能裸信 arguments？</strong>
                    <span>模型产出的 JSON 属于不可信外部输入，必须经过 Zod Schema 校验与权限检查才能进入业务函数。</span>
                  </div>
                </div>

                <CodeBlock
                  label="packages/agent-core/src/run-agent.ts"
                  highlightLines={[4, 5, 13, 14, 19, 20]}
                  caption="清单 5-2：加入 maxSteps 硬上限、AbortSignal 取消检查与结构化执行器的工程实现。"
                >
                  {productionLoopCode}
                </CodeBlock>
              </section>

              <AgentLoopSimulator />

              <section className="interview-section" id="interview">
                <span className="section-kicker">面试官深度追问</span>
                <h2>从“能写出来”进阶到“能讲清架构权衡”</h2>
                <div className="interview-question">
                  <span className="interview-question__badge">Q</span>
                  <div className="interview-question__body">
                    <strong>Agent Loop 与传统编排式 Workflow 的本质区别是什么？</strong>
                    <p>
                      Workflow 的控制流与分支跳转由工程师在开发期预先写死；Agent Loop 则将“下一步调用哪个工具或直接结束”的局部决策权交给模型，再由宿主程序完成验证与副作用执行。成熟生产系统往往将二者融合：确定性主干采用 Workflow，局部开放探索节点内嵌受控的 Agent Loop。
                    </p>
                    <details>
                      <summary>追问 01 · Tool Calling 究竟是在哪里被执行的？</summary>
                      <p>
                        模型端从未执行任何外部函数——模型仅仅输出了一段符合约定的工具名与 JSON 参数建议。真正的函数寻址、Schema 校验、权限拦截与网络请求全部发生在宿主应用侧的{" "}
                        <code className="inline-code">ToolExecutor</code> 中。
                      </p>
                    </details>
                    <details>
                      <summary>追问 02 · 线上如何防止 Agent 陷入死循环或打爆账单？</summary>
                      <p>
                        在 Runtime 层设置多维硬护栏：单任务最大循环步数（<code className="inline-code">maxSteps</code>）、全局超时{" "}
                        <code className="inline-code">AbortSignal</code>、累计 Token 预算上限，以及连续相同参数重复调用熔断检测。触碰硬边界后立即转入明确的{" "}
                        <code className="inline-code">failed</code> 状态交由上层兜底。
                      </p>
                    </details>
                    <details>
                      <summary>追问 03 · 流式连接（SSE）中途断开，后台如何优雅恢复？</summary>
                      <p>
                        将每次模型响应、工具开始、工具结果与状态迁移持久化为有序领域事件与 Checkpoint。客户端断线重连时携带{" "}
                        <code className="inline-code">Last-Event-ID</code> 增量回放，副作用工具配合幂等键防止重试产生重复扣款或重复通知。
                      </p>
                    </details>
                  </div>
                </div>
              </section>
            </>
          )}

          <section className="chapter-summary" id={summarySectionId}>
            <div className="chapter-summary__lead">
              <span className="section-kicker">本章结语</span>
              <h2>{editorial.summaryHeading}</h2>
            </div>
            <div className="summary-list">
              {editorial.summaryItems.map((item) => (
                <p key={item.label}>
                  <b>{item.label}：</b>
                  {item.text}
                </p>
              ))}
            </div>
            <div className="chapter-summary__actions">
              <button
                className={`button ${currentChapterProgress >= 100 ? "button--completed" : "button--primary"}`}
                type="button"
                onClick={() => updateChapterProgress(activeChapterId, 100)}
              >
                {currentChapterProgress >= 100 ? "✓ 已标记本章完成" : "标记本章已读完"}
              </button>
            </div>
          </section>

          <nav className="chapter-pager" aria-label="前后章节翻页">
            {prevChapter && prevChapterId ? (
              <a
                className="chapter-pager__card"
                href={`#${prevChapter.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToChapter(prevChapterId);
                }}
              >
                <span className="chapter-pager__dir">← 上一章</span>
                <strong>
                  第 {String(prevChapter.number).padStart(2, "0")} 章 · {prevChapter.title}
                </strong>
                <small>{prevChapter.section} · 预计 {prevChapter.duration}</small>
              </a>
            ) : (
              <div className="chapter-pager__spacer" aria-hidden="true" />
            )}

            {nextChapter && nextChapterId ? (
              <a
                className="chapter-pager__card chapter-pager__card--next"
                href={`#${nextChapter.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToChapter(nextChapterId);
                }}
              >
                <span className="chapter-pager__dir">下一章 →</span>
                <strong>
                  第 {String(nextChapter.number).padStart(2, "0")} 章 · {nextChapter.title}
                </strong>
                <small>{nextChapter.section} · 预计 {nextChapter.duration}</small>
              </a>
            ) : (
              <div className="chapter-pager__spacer" aria-hidden="true" />
            )}
          </nav>
        </main>

        <aside className="outline" aria-label="本章小节大纲">
          <div className="outline__title">
            <span>本章小节</span>
            <code>CH.{String(activeChapter.number).padStart(2, "0")}</code>
          </div>
          <nav>
            {activeChapterOutline.map((item, index) => (
              <a
                className={activeSection === item.id ? "is-active" : ""}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.id);
                }}
                aria-current={activeSection === item.id ? "location" : undefined}
                key={item.id}
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
                <span>{item.title}</span>
              </a>
            ))}
          </nav>

          <div className="outline__tip">
            <span>{editorial.marginTipTitle}</span>
            <p>{editorial.marginTipBody}</p>
          </div>
        </aside>
        </div>
      )}
    </div>
  );
}
