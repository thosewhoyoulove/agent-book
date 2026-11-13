import type { AvailableChapterId, GameWorldId } from "../content/gameWorlds";

export function WorldEmblemIcon({ worldId, size = 18 }: { worldId: GameWorldId; size?: number }) {
  if (worldId === "stardew") {
    // 像素祝尼魔精灵 (Junimo)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect x="5" y="0" width="2" height="1" fill="#3a8442" />
        <rect x="6" y="1" width="2" height="1" fill="#5ec269" />
        <rect x="5" y="2" width="1" height="1" fill="#3a8442" />
        <rect x="3" y="3" width="6" height="1" fill="#76d46b" />
        <rect x="2" y="4" width="8" height="5" fill="#76d46b" />
        <rect x="1" y="5" width="10" height="3" fill="#76d46b" />
        <rect x="3" y="9" width="6" height="2" fill="#52b34c" />
        <rect x="3" y="11" width="1" height="1" fill="#326e35" />
        <rect x="8" y="11" width="1" height="1" fill="#326e35" />
        <rect x="4" y="5" width="1" height="2" fill="#231912" />
        <rect x="7" y="5" width="1" height="2" fill="#231912" />
        <rect x="3" y="7" width="1" height="1" fill="#f5989d" />
        <rect x="8" y="7" width="1" height="1" fill="#f5989d" />
      </svg>
    );
  }

  if (worldId === "celeste") {
    // 像素红草莓 (Celeste Strawberry)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect x="5" y="1" width="2" height="1" fill="#2e8b57" />
        <rect x="3" y="2" width="6" height="1" fill="#46b878" />
        <rect x="3" y="3" width="6" height="2" fill="#e45567" />
        <rect x="2" y="4" width="8" height="4" fill="#e45567" />
        <rect x="3" y="8" width="6" height="2" fill="#d13b50" />
        <rect x="4" y="10" width="4" height="1" fill="#b52d40" />
        <rect x="5" y="11" width="2" height="1" fill="#b52d40" />
        <rect x="4" y="4" width="1" height="1" fill="#fff5d6" />
        <rect x="7" y="5" width="1" height="1" fill="#fff5d6" />
        <rect x="5" y="7" width="1" height="1" fill="#fff5d6" />
        <rect x="7" y="8" width="1" height="1" fill="#fff5d6" />
      </svg>
    );
  }

  // 像素小骑士面具 (Hollow Knight Mask)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="2" y="1" width="2" height="2" fill="#f2efe9" />
      <rect x="8" y="1" width="2" height="2" fill="#f2efe9" />
      <rect x="2" y="3" width="3" height="2" fill="#f2efe9" />
      <rect x="7" y="3" width="3" height="2" fill="#f2efe9" />
      <rect x="2" y="5" width="8" height="5" fill="#f2efe9" />
      <rect x="3" y="10" width="6" height="1" fill="#d6d0c4" />
      <rect x="3" y="6" width="2" height="3" fill="#121621" />
      <rect x="7" y="6" width="2" height="3" fill="#121621" />
    </svg>
  );
}

export function CollectibleSprite({
  worldId,
  unlocked,
  size = 16
}: {
  worldId: GameWorldId;
  unlocked: boolean;
  size?: number;
}) {
  if (worldId === "stardew") {
    // 星之果实 / 杨桃金星
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        shapeRendering="crispEdges"
        className={unlocked ? "collectible-svg is-unlocked" : "collectible-svg is-locked"}
        aria-hidden="true"
      >
        <rect x="5" y="1" width="2" height="2" fill={unlocked ? "#f5b92a" : "currentColor"} />
        <rect x="1" y="4" width="10" height="2" fill={unlocked ? "#f7cb45" : "currentColor"} />
        <rect x="3" y="3" width="6" height="5" fill={unlocked ? "#f7cb45" : "currentColor"} />
        <rect x="2" y="8" width="3" height="2" fill={unlocked ? "#e09819" : "currentColor"} />
        <rect x="7" y="8" width="3" height="2" fill={unlocked ? "#e09819" : "currentColor"} />
        <rect x="2" y="10" width="1" height="1" fill={unlocked ? "#c77c10" : "currentColor"} />
        <rect x="9" y="10" width="1" height="1" fill={unlocked ? "#c77c10" : "currentColor"} />
        {unlocked && <rect x="4" y="4" width="2" height="2" fill="#fff9db" />}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        shapeRendering="crispEdges"
        className={unlocked ? "collectible-svg is-unlocked" : "collectible-svg is-locked"}
        aria-hidden="true"
      >
        <rect x="4" y="1" width="4" height="2" fill={unlocked ? "#42b87c" : "currentColor"} />
        <rect x="2" y="3" width="8" height="5" fill={unlocked ? "#e45567" : "currentColor"} />
        <rect x="3" y="8" width="6" height="2" fill={unlocked ? "#cc3b4e" : "currentColor"} />
        <rect x="5" y="10" width="2" height="1" fill={unlocked ? "#ad2b3d" : "currentColor"} />
        {unlocked && (
          <>
            <rect x="4" y="4" width="1" height="1" fill="#fff5d6" />
            <rect x="7" y="6" width="1" height="1" fill="#fff5d6" />
          </>
        )}
      </svg>
    );
  }

  // 空洞圣巢护符
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className={unlocked ? "collectible-svg is-unlocked" : "collectible-svg is-locked"}
      aria-hidden="true"
    >
      <rect x="4" y="1" width="4" height="1" fill={unlocked ? "#d6c598" : "currentColor"} />
      <rect x="2" y="2" width="8" height="2" fill={unlocked ? "#e6d8b5" : "currentColor"} />
      <rect x="1" y="4" width="10" height="4" fill={unlocked ? "#c4b082" : "currentColor"} />
      <rect x="2" y="8" width="8" height="2" fill={unlocked ? "#9e8b60" : "currentColor"} />
      <rect x="4" y="10" width="4" height="1" fill={unlocked ? "#7d6c47" : "currentColor"} />
      {unlocked && <rect x="4" y="4" width="4" height="4" fill="#5fc4eb" />}
      {unlocked && <rect x="5" y="5" width="2" height="2" fill="#e8f8ff" />}
    </svg>
  );
}

export function HeroWorldScene({
  worldId,
  onSelectChapter
}: {
  worldId: GameWorldId;
  onSelectChapter: (chapterId: AvailableChapterId) => void;
}) {
  if (worldId === "stardew") {
    return (
      <div className="hero-diorama hero-diorama--stardew">
        <button
          type="button"
          className="diorama-pin diorama-pin--start"
          onClick={() => onSelectChapter("chapter-1")}
          title="前往第 01 章：爷爷的农舍木屋"
        >
          <span>CH.01</span>
          <strong>农舍开荒</strong>
        </button>
        <button
          type="button"
          className="diorama-pin diorama-pin--peak"
          onClick={() => onSelectChapter("chapter-5")}
          title="前往第 05 章：祝尼魔温室核心实验"
        >
          <span>CH.05 ★</span>
          <strong>祝尼魔温室</strong>
        </button>

        <svg className="hero-scene-svg" viewBox="0 0 560 400" fill="none" aria-hidden="true">
          {/* 暖阳与云朵 */}
          <circle cx="468" cy="74" r="34" fill="var(--scene-sun)" opacity="0.92" />
          <circle cx="468" cy="74" r="46" fill="var(--scene-sun)" opacity="0.22" />
          <rect x="84" y="62" width="66" height="14" rx="7" fill="var(--scene-cloud)" />
          <rect x="102" y="52" width="38" height="14" rx="7" fill="var(--scene-cloud)" />
          <rect x="290" y="46" width="54" height="12" rx="6" fill="var(--scene-cloud)" />

          {/* 远景青山与松林 */}
          <path d="M0 272C92 214 190 218 286 258C374 220 468 206 560 256V380H0V272Z" fill="var(--scene-hill-back)" />
          <path d="M0 302C128 262 256 276 382 304C446 286 508 284 560 298V388H0V302Z" fill="var(--scene-hill-front)" />

          {/* 针叶松树群 */}
          {[48, 82, 492, 524].map((x, idx) => (
            <g key={x}>
              <rect x={x - 4} y={248 + (idx % 2) * 8} width="8" height="24" fill="#6b4226" />
              <polygon points={`${x},${198 + (idx % 2) * 10} ${x - 20},${234 + (idx % 2) * 10} ${x + 20},${234 + (idx % 2) * 10}`} fill="var(--scene-tree)" />
              <polygon points={`${x},${218 + (idx % 2) * 10} ${x - 24},${254 + (idx % 2) * 10} ${x + 24},${254 + (idx % 2) * 10}`} fill="var(--scene-tree-dark)" />
            </g>
          ))}

          {/* 星露谷红顶木屋 (CH.01) */}
          <g transform="translate(106, 178)">
            {/* 烟囱与炊烟 */}
            <rect x="86" y="-8" width="14" height="28" fill="#8f4636" />
            <circle cx="95" cy="-18" r="6" fill="var(--scene-cloud)" opacity="0.75" />
            <circle cx="103" cy="-30" r="8" fill="var(--scene-cloud)" opacity="0.55" />
            {/* 屋顶 */}
            <polygon points="-10,38 56,-6 122,38" fill="#c84b31" stroke="#5c2c16" strokeWidth="3" />
            {/* 墙体 */}
            <rect x="4" y="38" width="104" height="68" fill="#f5deb3" stroke="#5c2c16" strokeWidth="3" />
            <line x1="4" y1="56" x2="108" y2="56" stroke="#d9b77c" strokeWidth="2" />
            <line x1="4" y1="74" x2="108" y2="74" stroke="#d9b77c" strokeWidth="2" />
            {/* 木门与暖窗 */}
            <rect x="20" y="62" width="26" height="44" fill="#8b5428" stroke="#5c2c16" strokeWidth="2.5" />
            <circle cx="40" cy="85" r="2.5" fill="#f5c542" />
            <rect x="62" y="56" width="28" height="26" fill="#ffd97d" stroke="#5c2c16" strokeWidth="2.5" />
            <line x1="76" y1="56" x2="76" y2="82" stroke="#5c2c16" strokeWidth="2" />
            <line x1="62" y1="69" x2="90" y2="69" stroke="#5c2c16" strokeWidth="2" />
          </g>

          {/* 玻璃温室工坊 (CH.05) */}
          <g transform="translate(336, 162)">
            <path d="M12 44C12 16 116 16 116 44H12Z" fill="var(--scene-glass)" stroke="#5c381e" strokeWidth="3" />
            <rect x="12" y="44" width="104" height="68" fill="var(--scene-glass)" stroke="#5c381e" strokeWidth="3" />
            <line x1="38" y1="24" x2="38" y2="112" stroke="#7c502d" strokeWidth="2.5" />
            <line x1="64" y1="20" x2="64" y2="112" stroke="#7c502d" strokeWidth="2.5" />
            <line x1="90" y1="24" x2="90" y2="112" stroke="#7c502d" strokeWidth="2.5" />
            <line x1="12" y1="76" x2="116" y2="76" stroke="#7c502d" strokeWidth="2.5" />
            {/* 温室内发光星之果实与绿植 */}
            <circle cx="64" cy="60" r="10" fill="#f7cb45" opacity="0.45" />
            <polygon points="64,50 67,57 75,57 69,62 71,69 64,65 57,69 59,62 53,57 61,57" fill="#f5b92a" />
            <rect x="22" y="92" width="84" height="16" fill="#4da353" />
          </g>

          {/* 田垄小径与开垦菜畦 */}
          <path d="M148 286C208 318 286 318 378 276" stroke="#d9a76a" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 14" />
          <g transform="translate(194, 314)">
            <rect x="0" y="0" width="176" height="42" rx="4" fill="#8c552b" stroke="#5c3518" strokeWidth="2.5" />
            {[20, 52, 84, 116, 148].map((cx, i) => (
              <g key={cx}>
                <path d={`M${cx} 26 C${cx - 8} 14, ${cx - 10} 8, ${cx - 4} 6 C${cx} 12, ${cx} 12, ${cx + 5} 6 C${cx + 10} 10, ${cx + 8} 16, ${cx} 26Z`} fill="#49a84f" />
                <circle cx={cx} cy="28" r="5.5" fill={i % 2 === 0 ? "#f5b82e" : "#e35d44"} />
              </g>
            ))}
          </g>

          {/* 像素祝尼魔在田埂跳跃 */}
          <g transform="translate(268, 266) scale(2.3)" shapeRendering="crispEdges">
            <rect x="5" y="0" width="2" height="1" fill="#3a8442" />
            <rect x="6" y="1" width="2" height="1" fill="#5ec269" />
            <rect x="3" y="3" width="6" height="1" fill="#76d46b" />
            <rect x="2" y="4" width="8" height="5" fill="#76d46b" />
            <rect x="3" y="9" width="6" height="2" fill="#52b34c" />
            <rect x="4" y="5" width="1" height="2" fill="#231912" />
            <rect x="7" y="5" width="1" height="2" fill="#231912" />
          </g>
        </svg>
      </div>
    );
  }

  if (worldId === "celeste") {
    return (
      <div className="hero-diorama hero-diorama--celeste">
        <button
          type="button"
          className="diorama-pin diorama-pin--start"
          onClick={() => onSelectChapter("chapter-1")}
          title="前往第 01 章：海拔 400m 山脚营地"
        >
          <span>400M · CP01</span>
          <strong>山脚断桥</strong>
        </button>
        <button
          type="button"
          className="diorama-pin diorama-pin--peak"
          onClick={() => onSelectChapter("chapter-5")}
          title="前往第 05 章：海拔 2200m 核心机关"
        >
          <span>2200M · CP05</span>
          <strong>峰顶机关台</strong>
        </button>

        <svg className="hero-scene-svg" viewBox="0 0 560 400" fill="none" aria-hidden="true">
          {/* 极光弧线与星点 */}
          <path d="M52 108C166 54 316 86 488 42" stroke="var(--model)" strokeWidth="14" strokeLinecap="round" opacity="0.14" />
          <rect x="116" y="64" width="6" height="6" fill="var(--tool)" />
          <rect x="436" y="72" width="6" height="6" fill="var(--accent)" />
          <rect x="242" y="48" width="5" height="5" fill="var(--model)" />
          <rect x="498" y="138" width="5" height="5" fill="var(--success)" />

          {/* 双子雪峰 */}
          <path d="M24 364L168 124L236 210L334 44L536 364H24Z" fill="var(--scene-hill-back)" />
          <path d="M108 364L258 164L324 248L406 144L536 364H108Z" fill="var(--scene-hill-front)" />
          <path d="M24 364L168 124L236 210L334 44L536 364" stroke="var(--scene-line)" strokeWidth="3" />

          {/* 峰顶积雪切面 */}
          <polygon points="334,44 294,112 318,104 336,126 356,102 378,116" fill="var(--scene-snow)" />
          <polygon points="168,124 140,170 158,164 172,180 194,162" fill="var(--scene-snow)" />

          {/* 冲刺轨迹与充能水晶 */}
          <path
            d="M88 326C148 282 178 310 232 266C286 222 308 176 334 118"
            stroke="var(--accent)"
            strokeWidth="3.5"
            strokeDasharray="7 9"
          />
          <g transform="translate(224, 248)">
            <polygon points="12,0 24,12 12,24 0,12" fill="var(--success)" stroke="var(--ink)" strokeWidth="2" />
            <polygon points="12,5 19,12 12,19 5,12" fill="#e8fff7" />
          </g>

          {/* 峰顶飘浮红草莓像素精灵 */}
          <g transform="translate(320, 14) scale(2.2)" shapeRendering="crispEdges">
            <rect x="4" y="1" width="4" height="1" fill="#42b87c" />
            <rect x="2" y="2" width="8" height="5" fill="#e45567" />
            <rect x="3" y="7" width="6" height="2" fill="#cc3b4e" />
            <rect x="5" y="9" width="2" height="1" fill="#ad2b3d" />
            <rect x="4" y="3" width="1" height="1" fill="#fff5d6" />
            <rect x="7" y="5" width="1" height="1" fill="#fff5d6" />
          </g>
        </svg>
      </div>
    );
  }

  // Hollow Knight 圣巢石碑与长椅街灯场景
  return (
    <div className="hero-diorama hero-diorama--hollow">
      <button
        type="button"
        className="diorama-pin diorama-pin--start"
        onClick={() => onSelectChapter("chapter-1")}
        title="前往第 01 章：德特茅斯长椅"
      >
        <span>BENCH · 01</span>
        <strong>小镇长椅</strong>
      </button>
      <button
        type="button"
        className="diorama-pin diorama-pin--peak"
        onClick={() => onSelectChapter("chapter-5")}
        title="前往第 05 章：灵魂圣所高塔"
      >
        <span>SANCTUM · 05</span>
        <strong>灵魂圣所</strong>
      </button>

      <svg className="hero-scene-svg" viewBox="0 0 560 400" fill="none" aria-hidden="true">
        {/* 洞窟穹顶与泪水之城尖塔剪影 */}
        <path d="M0 110C110 24 450 24 560 110V0H0V110Z" fill="var(--scene-hill-back)" />
        <polygon points="348,356 368,92 388,356" fill="var(--scene-hill-front)" />
        <polygon points="392,356 420,62 448,356" fill="var(--scene-hill-front)" stroke="var(--scene-line)" strokeWidth="2" />
        <polygon points="454,356 472,128 490,356" fill="var(--scene-hill-back)" />

        {/* 尖塔发光雕花圆窗 */}
        <circle cx="420" cy="148" r="14" fill="var(--model)" opacity="0.32" />
        <circle cx="420" cy="148" r="8" stroke="var(--scene-snow)" strokeWidth="2" />

        {/* 泪水细雨线 */}
        {[120, 196, 274, 342, 488].map((rx, idx) => (
          <line
            key={rx}
            x1={rx}
            y1={56 + (idx % 3) * 28}
            x2={rx}
            y2={98 + (idx % 3) * 28}
            stroke="var(--model)"
            strokeWidth="1.5"
            opacity="0.38"
          />
        ))}

        {/* 德特茅斯铁艺路灯与存档长椅 */}
        <g transform="translate(108, 198)">
          {/* 光晕 */}
          <circle cx="24" cy="24" r="42" fill="var(--scene-sun)" opacity="0.2" />
          <circle cx="24" cy="24" r="18" fill="var(--scene-sun)" opacity="0.55" />
          {/* 灯柱 */}
          <path d="M24 148V28C24 12 42 12 42 24" stroke="var(--scene-line)" strokeWidth="3.5" fill="none" />
          <circle cx="24" cy="24" r="7" fill="#fff8e6" stroke="var(--scene-line)" strokeWidth="2" />
          {/* 铁艺长椅 */}
          <rect x="44" y="122" width="76" height="6" fill="var(--scene-line)" />
          <rect x="48" y="106" width="68" height="12" rx="2" fill="none" stroke="var(--scene-line)" strokeWidth="2.5" />
          <line x1="54" y1="128" x2="50" y2="148" stroke="var(--scene-line)" strokeWidth="3" />
          <line x1="110" y1="128" x2="114" y2="148" stroke="var(--scene-line)" strokeWidth="3" />
        </g>

        {/* 地面石板与灵魂轨迹 */}
        <path d="M36 348H524" stroke="var(--scene-line)" strokeWidth="3" />
        <path
          d="M196 312C258 292 318 248 404 176"
          stroke="var(--model)"
          strokeWidth="2.5"
          strokeDasharray="5 8"
        />

        {/* 漂浮生命血微粒与灵魂光球 */}
        <circle cx="268" cy="248" r="6" fill="var(--model)" opacity="0.85" />
        <circle cx="322" cy="208" r="4" fill="var(--accent)" opacity="0.85" />
        <circle cx="236" cy="186" r="3.5" fill="var(--tool)" opacity="0.8" />
      </svg>
    </div>
  );
}
