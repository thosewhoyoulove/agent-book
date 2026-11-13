import type { chapterContent } from "./chapters";

export type GameWorldId = "stardew" | "celeste" | "hollow";
export type AvailableChapterId = keyof typeof chapterContent;

export interface ChapterQuestMeta {
  zone: string;
  questTitle: string;
  itemName: string;
  rewardText: string;
  glyph: string;
}

export interface WorldSimulatorPreset {
  consoleTitle: string;
  consoleSubtitle: string;
  badgeText: string;
  questName: string;
  systemPrompt: string;
  userPrompt: string;
  toolCity: string;
  toolDate: string;
  toolSuccessOutput: Record<string, unknown>;
  toolErrorMessage: string;
  finalSuccessAnswer: string;
  finalErrorAnswer: string;
}

export interface GameWorldConfig {
  id: GameWorldId;
  cartridgeCode: string;
  shortName: string;
  title: string;
  tagline: string;
  genreTag: string;
  lightModeLabel: string;
  darkModeLabel: string;
  lightThemeColor: string;
  darkThemeColor: string;
  heroKicker: string;
  heroHeadlineTop: string;
  heroHeadlineAccent: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  mapSectionKicker: string;
  mapSectionTitle: string;
  mapSectionSubtitle: string;
  footerMotto: string;
  collectibleName: string;
  collectibleUnit: string;
  metricLabel: string;
  formatMetric: (totalExp: number, completedCount: number) => string;
  ranks: [string, string, string, string, string];
  npcGuide: {
    name: string;
    role: string;
    dialogTitle: string;
  };
  bossSectionKicker: string;
  bossSectionTitle: string;
  bossBadge: string;
  completionActionText: string;
  completionDoneText: string;
  partTitles: {
    "part-1": { code: string; label: string; title: string };
    "part-2": { code: string; label: string; title: string };
    "part-4": { code: string; label: string; title: string };
  };
  chapters: Record<AvailableChapterId, ChapterQuestMeta>;
  simulator: WorldSimulatorPreset;
}

export const gameWorldOrder: GameWorldId[] = ["stardew", "celeste", "hollow"];

export const gameWorlds: Record<GameWorldId, GameWorldConfig> = {
  stardew: {
    id: "stardew",
    cartridgeCode: "CART · 01",
    shortName: "星露谷物语",
    title: "鹈鹕镇 · 代码工坊日志",
    tagline: "暖木公告栏 · 四季耕耘与祝尼魔收集包",
    genreTag: "COZY FARM RPG",
    lightModeLabel: "晴昼牧场",
    darkModeLabel: "篝火木屋",
    lightThemeColor: "#f5ebd2",
    darkThemeColor: "#1b140e",
    heroKicker: "PELICAN VALLEY · ARTISAN AGENT ALMANAC",
    heroHeadlineTop: "在星露谷亲手耕耘",
    heroHeadlineAccent: "你的第一座 Agent 工坊",
    heroDescription:
      "就像接手爷爷留下的老牧场：从开垦第一块消息田垄、去克林特铁匠铺锻造趁手工具，到点亮社区中心的自动祝尼魔循环。按自己的节奏翻开木质委托栏，每一章都是一份可收获的工程果实。",
    primaryCta: "推开牧场木门 (CH.01)",
    secondaryCta: "前往祝尼魔温室实验 (CH.05)",
    mapSectionKicker: "COMMUNITY CENTER BUNDLES · 社区中心收集包",
    mapSectionTitle: "点亮三间工坊收集室，唤醒发条祝尼魔",
    mapSectionSubtitle: "每完成一章委托即可收获一枚【星之果实】与牧场工坊金币，存档自动保存在本地。",
    footerMotto: "写好可靠的 Agent 架构，就像经营一座四季常青的手工牧场。",
    collectibleName: "星之果实",
    collectibleUnit: "枚",
    metricLabel: "牧场金库",
    formatMetric: (totalExp, completedCount) => `${totalExp * 5 + completedCount * 250} G`,
    ranks: ["新晋农夫", "熟手园丁", "工坊巧匠", "祝尼魔挚友", "星露谷大师"],
    npcGuide: {
      name: "森林祝尼魔 · 苹果",
      role: "社区中心守护精灵",
      dialogTitle: "木屋信箱里的委托便签"
    },
    bossSectionKicker: "GRANDPA'S SHRINE EVALUATION · 爷爷神龛终极试炼",
    bossSectionTitle: "点亮四根神龛蜡烛：从“种出作物”到“读懂四季规律”",
    bossBadge: "★",
    completionActionText: "交付本章收集包 · 摘取星之果实",
    completionDoneText: "★ 已交付收集包 · 获得本章星之果实 (+750G)",
    partTitles: {
      "part-1": { code: "春季工坊", label: "耕作卷", title: "开垦田垄与锻造工具" },
      "part-2": { code: "夏季温室", label: "机关卷", title: "自动喷灌与祝尼魔循环" },
      "part-4": { code: "秋收窖藏", label: "酿造卷", title: "陈酿记忆与上下文粮仓" }
    },
    chapters: {
      "chapter-1": {
        zone: "爷爷的农舍木屋",
        questTitle: "开荒委托：辨认种子与围栏边界",
        itemName: "春季防风草图鉴",
        rewardText: "+500G · 星之果实 #01",
        glyph: "🌱"
      },
      "chapter-2": {
        zone: "皮埃尔杂货店信箱",
        questTitle: "通信委托：订立镇民往来信件格式",
        itemName: "鹈鹕镇邮差号角",
        rewardText: "+600G · 星之果实 #02",
        glyph: "✉"
      },
      "chapter-3": {
        zone: "克林特铁匠铺",
        questTitle: "锻造委托：升级铱金水壶与安全栓",
        itemName: "铱金工具纹章",
        rewardText: "+700G · 星之果实 #03",
        glyph: "⚒"
      },
      "chapter-4": {
        zone: "罗宾的木匠工坊",
        questTitle: "建造委托：连接风车齿轮与出货箱",
        itemName: "红木联动图纸",
        rewardText: "+750G · 星之果实 #04",
        glyph: "⚙"
      },
      "chapter-5": {
        zone: "社区中心 · 温室核心",
        questTitle: "主线高光：唤醒自动采收祝尼魔循环",
        itemName: "金色发条祝尼魔",
        rewardText: "+1200G · 星之果实 #05",
        glyph: "★"
      },
      "chapter-6": {
        zone: "矿洞升降梯与农场钟楼",
        questTitle: "守护委托：雷雨避雷针与体力回溯",
        itemName: "黄金农场大钟",
        rewardText: "+900G · 星之果实 #06",
        glyph: "⏳"
      },
      "chapter-9": {
        zone: "法师塔地下藏书室",
        questTitle: "秘术委托：精选地窖橡木桶酿造配方",
        itemName: "远古杨桃陈酿谱",
        rewardText: "+1000G · 星之果实 #07",
        glyph: "🏺"
      }
    },
    simulator: {
      consoleTitle: "发条祝尼魔工坊台 · Agent Loop Workbench",
      consoleSubtitle: "模拟农场小助手如何收看电视天气预报、核验工具结果并规划今日农事。",
      badgeText: "JUNIMO CLOCKWORK · 确定性沙盒",
      questName: "星露谷农事剧本 · 春季第 15 日",
      systemPrompt: "你是鹈鹕镇严谨的牧场管家祝尼魔。安排农事前必须先调用天气频道工具核实今日天气。",
      userPrompt: "帮我看看今天鹈鹕镇电视天气预报怎么说？需要给蓝莓田浇水吗，还是直接下矿洞？",
      toolCity: "鹈鹕镇 · 星露谷",
      toolDate: "春季 第15日",
      toolSuccessOutput: {
        region: "鹈鹕镇 · 星露谷",
        date: "春季 第15日 (星期一)",
        condition: "连绵春雨",
        temperature: 16,
        farmEffect: "全农场作物自动浇灌",
        dailyLuck: "精灵今天非常开心 (+0.08)"
      },
      toolErrorMessage: "电视天气频道受雷暴静电干扰：TV signal static (503)",
      finalSuccessAnswer:
        "今天鹈鹕镇全天春雨（16°C），雨水已自动浇灌整片蓝莓田，无需消耗水壶体力！加上今日运势极佳，强烈建议带上铱金十字镐与奶酪直奔矿洞第 40 层采集铁矿。",
      finalErrorAnswer:
        "农舍电视天气频道暂时雪花屏（503），无法确认全天降雨情况。稳妥起见，请先推门查看农田土壤湿度再决定是否留存体力下矿。"
    }
  },

  celeste: {
    id: "celeste",
    cartridgeCode: "CART · 02",
    shortName: "蔚蓝山峰",
    title: "塞莱斯特山 · 攀登手册",
    tagline: "冰川像素切角 · 冲刺水晶与红草莓收集",
    genreTag: "PRECISION PLATFORMER",
    lightModeLabel: "晨雾山脊",
    darkModeLabel: "夜峰星海",
    lightThemeColor: "#e7eef4",
    darkThemeColor: "#081522",
    heroKicker: "MOUNT CELESTE · FIELD GUIDE EDITION",
    heroHeadlineTop: "攀登 Agent 的",
    heroHeadlineAccent: "三千米技术高山",
    heroDescription:
      "一本可以单步冲刺的 Agent 工程书。沿着风雪山路依次突破模型协议、工具校验与运行时护栏，在每座营地篝火旁亲手把概念写成可运行的代码。",
    primaryCta: "从山脚营地出发 (CH.01)",
    secondaryCta: "挑战峰顶核心机关 (CH.05)",
    mapSectionKicker: "THE ASCENT MAP · 登山路线全图",
    mapSectionTitle: "选择一段山脊路线，向上冲刺",
    mapSectionSubtitle: "每抵达一座海拔营地即可点亮冲刺水晶并收集一枚【红草莓】，记录你的登顶海拔。",
    footerMotto: "构建生产级 Agent Runtime，就像在陡峭冰壁上寻找每一次确定的落脚点。",
    collectibleName: "红草莓",
    collectibleUnit: "颗",
    metricLabel: "当前海拔",
    formatMetric: (totalExp, completedCount) => `${400 + totalExp * 3 + completedCount * 180} m`,
    ranks: ["山脚旅人", "岩壁攀登者", "双冲刺行者", "金色羽毛大师", "塞莱斯特登顶者"],
    npcGuide: {
      name: "登山向导 · Theo",
      role: "营地篝火旅伴",
      dialogTitle: "营地篝火旁的速写备忘"
    },
    bossSectionKicker: "B-SIDE CASSETTE CHALLENGE · B面磁带高难试炼",
    bossSectionTitle: "解锁 B 面关卡：从“能跑通”进阶到“守住极端风雪边界”",
    bossBadge: "B",
    completionActionText: "点亮营地水晶 · 收集本章红草莓",
    completionDoneText: "♥ 已点亮营地检查点 · 收集本章红草莓 (+300m)",
    partTitles: {
      "part-1": { code: "海拔 700M", label: "山麓卷", title: "被遗弃的城市与基础边界" },
      "part-2": { code: "海拔 2100M", label: "山脊卷", title: "金色山脊与核心执行循环" },
      "part-4": { code: "海拔 3000M", label: "峰顶卷", title: "风暴核心与上下文工程" }
    },
    chapters: {
      "chapter-1": {
        zone: "海拔 400m · 序章断桥",
        questTitle: "起跳教学：看清落脚点与深渊边界",
        itemName: "首颗飞行草莓",
        rewardText: "+200m · 红草莓 #01",
        glyph: "▲"
      },
      "chapter-2": {
        zone: "海拔 850m · 旧址电台",
        questTitle: "信号校准：收发稳定的山谷电报协议",
        itemName: "蓝鸟信号水晶",
        rewardText: "+280m · 红草莓 #02",
        glyph: "♥"
      },
      "chapter-3": {
        zone: "海拔 1300m · 天空度假山庄",
        questTitle: "机关清理：校验每一块移动踏板",
        itemName: "守门人钥匙卡",
        rewardText: "+320m · 红草莓 #03",
        glyph: "✦"
      },
      "chapter-4": {
        zone: "海拔 1750m · 金色山脊索道",
        questTitle: "借风滑翔：衔接冲刺气泡与机关门",
        itemName: "金色漂浮羽毛",
        rewardText: "+360m · 红草莓 #04",
        glyph: "◇"
      },
      "chapter-5": {
        zone: "海拔 2200m · 镜之寺庙核心",
        questTitle: "主线高光：突破双冲刺 Agent Loop 机关房",
        itemName: "寺庙水晶之心",
        rewardText: "+500m · 红草莓 #05",
        glyph: "▣"
      },
      "chapter-6": {
        zone: "海拔 2600m · 反思湖畔营地",
        questTitle: "安全绳索：存档检查点与坠落恢复",
        itemName: "B面秘藏磁带",
        rewardText: "+420m · 红草莓 #06",
        glyph: "⚑"
      },
      "chapter-9": {
        zone: "海拔 3000m · 塞莱斯特峰顶",
        questTitle: "终极登顶：轻装精简行囊冲破云海",
        itemName: "峰顶金色草莓",
        rewardText: "+520m · 红草莓 #07",
        glyph: "⌁"
      }
    },
    simulator: {
      consoleTitle: "峰顶机关控制台 · Agent Loop Simulator",
      consoleSubtitle: "像逐帧拆解速通路线一样，单步查看模型决策、风速探测与状态回放。",
      badgeText: "SUMMIT CORE · 确定性回放",
      questName: "塞莱斯特山剧本 · 金色山脊横渡",
      systemPrompt: "你是塞莱斯特山路线领航员。规划高空冲刺前必须先调用山脊气象信标工具确认风速。",
      userPrompt: "探测塞莱斯特山 2200m 金色山脊的实时风向，判断现在能否启动双冲刺横渡峡谷？",
      toolCity: "塞莱斯特山 · 金色山脊",
      toolDate: "海拔 2200m",
      toolSuccessOutput: {
        sector: "金色山脊 · 2200m",
        checkpoint: "CP-05",
        condition: "晴朗微雪",
        temperature: -4,
        wind: "顺风 3 级 · 上升气流稳定",
        dashCrystal: "已充能就绪"
      },
      toolErrorMessage: "山脊气象信标结冰离线：Ridge beacon frozen (503)",
      finalSuccessAnswer:
        "金色山脊当前顺风 3 级（-4°C），视野通透且峡谷中段冲刺水晶已充能。可以起跳借顺风接右上斜冲（Up-Right Dash）安全抵达对岸营地。",
      finalErrorAnswer:
        "2200m 气象信标暂时结冰离线（503），无法确认峡谷横风强度。请留在当前营地篝火旁等待信标恢复，切勿盲目起跳。"
    }
  },

  hollow: {
    id: "hollow",
    cartridgeCode: "CART · 03",
    shortName: "空洞圣巢",
    title: "圣巢王国 · 制图师古卷",
    tagline: "哥特雕花石碑 · 灵魂容器与护符槽构筑",
    genreTag: "METROIDVANIA ARCHIVE",
    lightModeLabel: "柯尼法古卷",
    darkModeLabel: "圣巢深渊",
    lightThemeColor: "#eae6dd",
    darkThemeColor: "#0a0d14",
    heroKicker: "HALLOWNEST ARCHIVES · CORNIFER'S ATLAS",
    heroHeadlineTop: "深入幽邃圣巢铭刻",
    heroHeadlineAccent: "不灭的灵魂循环护符",
    heroDescription:
      "手持骨钉与羽毛笔潜入庞大的地下王国。在长椅旁调配模型接口、工具契约与状态机护符槽，用严谨的边界在复杂虫道中开辟确定性的通路。",
    primaryCta: "在德特茅斯长椅落座 (CH.01)",
    secondaryCta: "开启泪水之城核心仪轨 (CH.05)",
    mapSectionKicker: "CHARM NOTCHES & STAG STATIONS · 护符图鉴与驿站地图",
    mapSectionTitle: "收集散落王国的七枚工程护符，构筑完整流派",
    mapSectionSubtitle: "每探索完一片区域即可铭刻一枚【圣巢护符】并积攒吉欧（Geo），点亮你的护符面板。",
    footerMotto: "真正的工程护符不靠侥幸生效，每一格护符槽都对应清晰的程序边界。",
    collectibleName: "圣巢护符",
    collectibleUnit: "枚",
    metricLabel: "持有吉欧",
    formatMetric: (totalExp, completedCount) => `${totalExp * 2 + completedCount * 150} Geo`,
    ranks: ["无名小骑士", "十字路制图学徒", "螳螂部落受勋者", "守望者尖塔学者", "圣巢纯净容器"],
    npcGuide: {
      name: "制图师 · 柯尼法",
      role: "皇家测绘师",
      dialogTitle: "长椅旁哼着小曲留下的羊皮手绘稿"
    },
    bossSectionKicker: "COLOSSEUM OF FOOLS · 愚人斗兽场三阶试炼",
    bossSectionTitle: "直面高阶审问：验证你的护符构筑能否承受真实流量高压",
    bossBadge: "❖",
    completionActionText: "在长椅上铭刻地图 · 装备本章护符",
    completionDoneText: "❖ 已铭刻区域石碑 · 装备本章圣巢护符 (+300 Geo)",
    partTitles: {
      "part-1": { code: "遗忘十字路", label: "骨钉卷", title: "剑术边界与信使契约" },
      "part-2": { code: "泪水之城", label: "灵魂卷", title: "法术释放与灵魂循环仪轨" },
      "part-4": { code: "白色宫殿", label: "梦境卷", title: "梦之钉记忆筛选与容量槽" }
    },
    chapters: {
      "chapter-1": {
        zone: "德特茅斯 · 衰败小镇长椅",
        questTitle: "初入地下：分辨迷途虫影与清晰路标",
        itemName: "任性的指南针",
        rewardText: "+150 Geo · 护符 #01",
        glyph: "❖"
      },
      "chapter-2": {
        zone: "遗忘十字路 · 鹿角虫驿站",
        questTitle: "铃铛召唤：建立跨区域驿站传讯石板",
        itemName: "蜂群集结纹章",
        rewardText: "+180 Geo · 护符 #02",
        glyph: "◈"
      },
      "chapter-3": {
        zone: "苍绿之径 · 骨钉锻造师茅屋",
        questTitle: "纯粹淬炼：为每记挥砍加上精准鞘锁",
        itemName: "骄傲印记护符",
        rewardText: "+220 Geo · 护符 #03",
        glyph: "⚔"
      },
      "chapter-4": {
        zone: "真菌荒地 · 螳螂村落议会",
        questTitle: "攻防协同：礼敬信号与受控反击时机",
        itemName: "萨满之石护符",
        rewardText: "+240 Geo · 护符 #04",
        glyph: "✧"
      },
      "chapter-5": {
        zone: "泪水之城 · 灵魂圣所高塔",
        questTitle: "主线高光：驱动生生不息的灵魂汇聚循环",
        itemName: "灵魂捕手核心",
        rewardText: "+400 Geo · 护符 #05",
        glyph: "◉"
      },
      "chapter-6": {
        zone: "水晶山峰 · 矿道长椅存档点",
        questTitle: "躯壳守护：生命血护盾与暗影重聚",
        itemName: "乔尼的祝福护符",
        rewardText: "+280 Geo · 护符 #06",
        glyph: "⛨"
      },
      "chapter-9": {
        zone: "安息之地 · 先知梦境圣殿",
        questTitle: "梦境提纯：用梦之钉萃取高纯度记忆精华",
        itemName: "虚空之心护符",
        rewardText: "+350 Geo · 护符 #07",
        glyph: "☽"
      }
    },
    simulator: {
      consoleTitle: "灵魂圣所仪轨台 · Soul Loop Conduit",
      consoleSubtitle: "在长椅旁逐步推演一次法术探查、驿站反馈与灵魂容器状态流转。",
      badgeText: "SANCTUM CONDUIT · 确定性推演",
      questName: "圣巢探险剧本 · 泪水之城雨势勘测",
      systemPrompt: "你是圣巢皇家制图司向导。规划前往守望者尖塔路线前，必须调用测绘石碑工具确认洞顶雨势与升降梯状态。",
      userPrompt: "勘测泪水之城东侧尖塔当前的洞顶降雨与井道状态，判断能否出发前往守望者尖塔？",
      toolCity: "圣巢 · 泪水之城东区",
      toolDate: "守望者纪元",
      toolSuccessOutput: {
        region: "泪水之城 · 东侧尖塔",
        stagStation: "国王驿站已解锁",
        condition: "蓝湖渗水细雨（无酸液腐蚀）",
        temperature: 12,
        elevatorShaft: "主升降梯配重正常"
      },
      toolErrorMessage: "测绘石碑受灵魂扭曲干扰：Tablet inscription faded (503)",
      finalSuccessAnswer:
        "泪水之城东侧目前维持温和的蓝湖细雨，无酸水威胁且主升降梯井道畅通。建议在国王驿站长椅装备【任性的指南针】与【灵魂捕手】后沿尖塔走廊前进。",
      finalErrorAnswer:
        "前方测绘石碑受干扰暂时无法读取（503），尖塔升降梯状态未知。建议先退回最近的长椅休整存档，待视野恢复后再继续探图。"
    }
  }
};
