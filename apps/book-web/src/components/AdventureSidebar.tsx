import type { ChapterMeta } from "@agent-book/shared";
import { CollectibleSprite, WorldEmblemIcon } from "./GameWorldArt";
import {
  ChapterMarkIcon,
  ChevronIcon,
  PartMarkIcon,
  SectionArrowIcon
} from "./NavIcons";
import {
  gameWorldOrder,
  gameWorlds,
  type AvailableChapterId,
  type GameWorldConfig,
  type GameWorldId
} from "../content/gameWorlds";

type PartGroupId = "part-1" | "part-2" | "part-4";

export interface SidebarPartGroup {
  id: PartGroupId;
  chapters: ChapterMeta[];
}

export interface SidebarPlayerStats {
  level: number;
  rankTitle: string;
  worldMetric: string;
  totalExp: number;
  maxExp: number;
  completedCount: number;
}

export interface AdventureSidebarProps {
  worldId: GameWorldId;
  world: GameWorldConfig;
  mobileNavOpen: boolean;
  onCloseMobile: () => void;
  playerStats: SidebarPlayerStats;
  partGroups: SidebarPartGroup[];
  expandedGroups: string[];
  expandedChapters: string[];
  activeChapterId: AvailableChapterId;
  activeSection: string;
  getChapterOutline: (chapterId: AvailableChapterId) => Array<{ id: string; title: string }>;
  progressMap: Record<AvailableChapterId, number>;
  availableChapterCount: number;
  currentChapterProgress: number;
  chapterContentIds: Set<string>;
  onSelectWorld: (id: GameWorldId) => void;
  onToggleGroup: (groupId: string) => void;
  onToggleChapter: (chapterId: string) => void;
  onNavigateChapter: (chapterId: AvailableChapterId, targetSectionId?: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateHome: () => void;
}

function SidebarAtmosphere({ worldId }: { worldId: GameWorldId }) {
  if (worldId === "stardew") {
    return (
      <div className="sidebar__atmosphere sidebar__atmosphere--stardew" aria-hidden="true">
        <span className="sidebar__deco sidebar__deco--plank" />
        <span className="sidebar__deco sidebar__deco--seed" />
      </div>
    );
  }
  if (worldId === "celeste") {
    return (
      <div className="sidebar__atmosphere sidebar__atmosphere--celeste" aria-hidden="true">
        <svg className="sidebar__deco-svg" viewBox="0 0 120 320" preserveAspectRatio="none">
          <path
            className="sidebar__ridge"
            d="M0 220 L28 170 L48 196 L72 132 L96 168 L120 110 L120 320 L0 320 Z"
          />
          <g className="sidebar__stars">
            <circle cx="18" cy="36" r="1.2" />
            <circle cx="54" cy="22" r="0.9" />
            <circle cx="86" cy="48" r="1.1" />
            <circle cx="34" cy="78" r="0.7" />
            <circle cx="102" cy="88" r="0.8" />
          </g>
          <path className="sidebar__wind" d="M16 112 C40 104, 58 118, 84 108" />
          <path className="sidebar__wind" d="M28 148 C52 140, 74 152, 98 142" />
        </svg>
      </div>
    );
  }
  return (
    <div className="sidebar__atmosphere sidebar__atmosphere--hollow" aria-hidden="true">
      <svg className="sidebar__deco-svg" viewBox="0 0 120 320" preserveAspectRatio="none">
        <path className="sidebar__ruin" d="M18 40 V120 M18 40 H42 M102 56 V148 M102 56 H78" />
        <path className="sidebar__ruin" d="M30 210 C48 190, 72 190, 90 210" />
        <circle className="sidebar__soul" cx="60" cy="70" r="18" />
        <circle className="sidebar__soul sidebar__soul--inner" cx="60" cy="70" r="6" />
      </svg>
    </div>
  );
}

export function AdventureSidebar({
  worldId,
  world,
  mobileNavOpen,
  onCloseMobile,
  playerStats,
  partGroups,
  expandedGroups,
  expandedChapters,
  activeChapterId,
  activeSection,
  getChapterOutline,
  progressMap,
  availableChapterCount,
  currentChapterProgress,
  chapterContentIds,
  onSelectWorld,
  onToggleGroup,
  onToggleChapter,
  onNavigateChapter,
  onNavigateSection,
  onNavigateHome
}: AdventureSidebarProps) {
  const xpRatio = Math.max(0, Math.min(1, playerStats.totalExp / playerStats.maxExp));

  return (
    <aside
      className={`sidebar sidebar--${worldId}${mobileNavOpen ? " sidebar--open" : ""}`}
      aria-label="全书冒险地图与状态栏"
      data-sidebar-theme={worldId}
    >
      <SidebarAtmosphere worldId={worldId} />

      <div className="sidebar__mobile-head">
        <span>冒险地图 · {world.shortName}</span>
        <button type="button" onClick={onCloseMobile} aria-label="关闭目录">
          ×
        </button>
      </div>

      <div className="sidebar__player-card">
        <div className="player-card__frame" aria-hidden="true" />
        <div className="player-card__top">
          <span className="player-card__avatar">
            <WorldEmblemIcon worldId={worldId} size={22} />
          </span>
          <div className="player-card__info">
            <span className="player-card__level">
              LV.{playerStats.level} · {world.metricLabel} {playerStats.worldMetric}
            </span>
            <strong>{playerStats.rankTitle}</strong>
          </div>
        </div>

        <div className="player-card__xp">
          <div className="player-card__xp-labels">
            <span>探索熟练度 (EXP)</span>
            <code>
              {playerStats.totalExp}/{playerStats.maxExp}
            </code>
          </div>
          <div
            className="player-card__xp-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={playerStats.maxExp}
            aria-valuenow={playerStats.totalExp}
            aria-label="探索熟练度"
          >
            <i style={{ width: `${xpRatio * 100}%` }} />
          </div>
        </div>

        <div className="player-card__worlds" role="group" aria-label="侧栏切换世界">
          {gameWorldOrder.map((id) => (
            <button
              key={id}
              type="button"
              className={id === worldId ? "is-active" : ""}
              onClick={() => onSelectWorld(id)}
              aria-pressed={id === worldId}
            >
              <WorldEmblemIcon worldId={id} size={12} />
              <span>{gameWorlds[id].shortName}</span>
            </button>
          ))}
        </div>
      </div>

      <nav className="nav-tree" aria-label="关卡章节树">
        {partGroups.map((group, groupIndex) => {
          const groupExpanded = expandedGroups.includes(group.id);
          const partMeta = world.partTitles[group.id];
          return (
            <section className={`nav-tree__group${groupExpanded ? " is-expanded" : ""}`} key={group.id}>
              <button
                className={`nav-tree__part${groupExpanded ? " is-expanded" : ""}`}
                type="button"
                onClick={() => onToggleGroup(group.id)}
                aria-expanded={groupExpanded}
              >
                <span className="nav-tree__chevron nav-tree__chevron--part" aria-hidden="true">
                  <ChevronIcon worldId={worldId} open={groupExpanded} size={12} />
                </span>
                <span className="nav-tree__part-badge" aria-hidden="true">
                  <PartMarkIcon worldId={worldId} partIndex={groupIndex} size={28} />
                </span>
                <span className="nav-tree__part-meta">
                  <b>{partMeta.label}</b>
                  <em>{partMeta.title}</em>
                </span>
              </button>

              <div className={`nav-tree__chapters${groupExpanded ? " is-expanded" : ""}`}>
                {group.chapters.map((chapter, chapterIndex) => {
                  const chapterId = chapter.id as AvailableChapterId;
                  const chapterIsActive = chapterId === activeChapterId;
                  const chapterAvailable =
                    chapter.status === "available" && chapterContentIds.has(chapter.id);
                  const chapterExpanded = expandedChapters.includes(chapter.id) && chapterAvailable;
                  const isCompleted = chapterAvailable && (progressMap[chapterId] ?? 0) >= 100;
                  const chapterOutline = chapterAvailable ? getChapterOutline(chapterId) : [];

                  return (
                    <div
                      className={`nav-tree__chapter-wrap${chapterIsActive ? " is-current" : ""}${
                        !chapterAvailable ? " is-locked" : ""
                      }`}
                      key={chapter.id}
                    >
                      <div
                        className={`nav-tree__chapter-row${chapterIsActive ? " is-active" : ""}${
                          !chapterAvailable ? " is-disabled" : ""
                        }`}
                      >
                        <button
                          className="nav-tree__chapter-toggle"
                          type="button"
                          onClick={() => chapterAvailable && onToggleChapter(chapter.id)}
                          aria-expanded={chapterAvailable ? chapterExpanded : undefined}
                          aria-label={`${chapter.title}${
                            chapterAvailable
                              ? chapterExpanded
                                ? "，收起小节"
                                : "，展开小节"
                              : "，暂未开放"
                          }`}
                          disabled={!chapterAvailable}
                        >
                          <span className="nav-tree__chapter-lead" aria-hidden="true">
                            <span className="nav-tree__chevron nav-tree__chevron--chapter">
                              <ChevronIcon worldId={worldId} open={chapterExpanded} size={10} dense />
                            </span>
                            <ChapterMarkIcon
                              worldId={worldId}
                              index={chapterIndex + groupIndex * 3}
                              completed={isCompleted}
                              size={18}
                            />
                          </span>
                        </button>

                        {chapterAvailable ? (
                          <a
                            className="nav-tree__chapter-link"
                            href={`#${chapter.id}`}
                            onClick={(event) => {
                              event.preventDefault();
                              onNavigateChapter(chapterId);
                            }}
                            aria-current={chapterIsActive ? "page" : undefined}
                          >
                            <span className="nav-tree__number">
                              {String(chapter.number).padStart(2, "0")}
                            </span>
                            <span className="nav-tree__title">{chapter.title}</span>
                            <CollectibleSprite worldId={worldId} unlocked={isCompleted} size={14} />
                          </a>
                        ) : (
                          <button
                            className="nav-tree__chapter-link nav-tree__chapter-link--locked"
                            type="button"
                            disabled
                          >
                            <span className="nav-tree__number">
                              {String(chapter.number).padStart(2, "0")}
                            </span>
                            <span className="nav-tree__title">{chapter.title}</span>
                            <span className="nav-tree__status">未开放</span>
                          </button>
                        )}
                      </div>

                      {chapterAvailable && (
                        <div className={`nav-tree__children${chapterExpanded ? " is-expanded" : ""}`}>
                          {chapterOutline.map((item, index) => {
                            const sectionIsActive = chapterIsActive && activeSection === item.id;
                            return (
                              <a
                                data-nav-section={item.id}
                                className={`nav-tree__child${sectionIsActive ? " is-active" : ""}`}
                                href={`#${item.id}`}
                                onClick={(event) => {
                                  event.preventDefault();
                                  if (chapterIsActive) {
                                    onNavigateSection(item.id);
                                  } else {
                                    onNavigateChapter(chapterId, item.id);
                                  }
                                }}
                                aria-current={sectionIsActive ? "location" : undefined}
                                key={item.id}
                              >
                                <span className="nav-tree__child-label">
                                  {sectionIsActive ? (
                                    <SectionArrowIcon worldId={worldId} />
                                  ) : (
                                    <span className="nav-tree__child-dot" aria-hidden="true" />
                                  )}
                                  <span>{item.title}</span>
                                </span>
                                <small>{String(index + 1).padStart(2, "0")}</small>
                              </a>
                            );
                          })}
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
        <div className="progress-ring" aria-hidden="true">
          <svg viewBox="0 0 36 36">
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
          <strong>
            已集齐 {playerStats.completedCount} / {availableChapterCount} {world.collectibleUnit}
            {world.collectibleName}
          </strong>
          <button type="button" className="sidebar__home-return" onClick={onNavigateHome}>
            ← 返回世界地图大厅
          </button>
        </div>
      </div>
    </aside>
  );
}
