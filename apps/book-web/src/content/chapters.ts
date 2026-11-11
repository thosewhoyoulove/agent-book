import { chapterFiveSections } from "./chapter5";
import type { ChapterEditorialMeta, ChapterSection } from "./chapter5";

export const chapterOneSections: ChapterSection[] = [
  {
    id: "three-models",
    eyebrow: "三个执行模型",
    title: "先分清 Chatbot、Workflow 和 Agent",
    paragraphs: [
      "`Chatbot` 主要负责对话和生成文本。它可以有很好的上下文能力，但每一次响应通常仍然是一次输入到输出的映射。只要任务不需要外部行动，`Chatbot` 就已经足够。",
      "`Workflow` 把步骤和分支写在程序里。它适合审批、同步、报表等路径稳定的业务，因为每一个节点都可以被测试、重试和审计。模型可以参与某一个节点，但不会决定整个流程的方向。",
      "`Agent` 把部分下一步决策交给模型，再由运行时检查和执行。它适合目标明确、路径开放的问题，例如研究资料、排查故障或组合多个工具完成任务。开放式决策也意味着更高的成本和更严格的边界要求。"
    ]
  },
  {
    id: "agent-anatomy",
    eyebrow: "组成部分",
    title: "一个可用的 Agent 至少需要四个边界",
    paragraphs: [
      "第一是模型接口（`LlmProvider`）：负责把目标、上下文和可用工具描述发送给模型，并把响应转换为统一的数据结构。Provider 可以替换，但上层不应该依赖某一家模型的原始响应格式。",
      "第二是工具注册表（`ToolRegistry`）：它描述工具名称、参数 `schema` 和执行函数。工具注册表是模型建议和程序副作用之间的门面，所有输入都必须在这里经过检查。",
      "第三是运行时（`AgentRuntime`）：它负责循环、状态、`maxSteps`、取消、超时和事件。运行时把一次不确定的模型响应放进确定的程序边界，确保任务可以观察和停止。",
      "第四是消息历史（`Message History`）：它记录用户目标、模型决策、工具调用和工具结果。没有这份历史，Agent 只能反复猜测，无法解释自己为什么走到当前状态。"
    ]
  },
  {
    id: "autonomy-boundary",
    eyebrow: "自主性与边界",
    title: "自主性应该被限制在可审计的范围内",
    paragraphs: [
      "把下一步交给模型，并不等于把权限交给模型。模型只能提出工具名和参数，真正的权限判断、参数校验和副作用执行仍然属于应用程序。",
      "低风险的只读工具可以自动执行；修改数据、发送通知、付款或删除资源等操作应该进入人工审批（`waiting_for_human`）或更严格的策略检查。不同工具需要不同的预算、超时和重试规则。",
      "设计 Agent 时，先写出它不能做什么，再决定它可以做什么。明确的拒绝路径、`maxSteps` 和失败状态，会比一句宽泛的系统提示词更可靠。"
    ]
  },
  {
    id: "choose-agent",
    eyebrow: "工程判断",
    title: "什么时候不应该使用 Agent？",
    paragraphs: [
      "当流程可以用有限状态机完整描述时，优先使用普通 `Workflow`。确定性流程更容易测试、估算成本，也更容易向业务和运维人员解释。",
      "当任务需要访问多个工具、存在多个合理路径，而且输入信息无法在开发阶段完全枚举时，`Agent` 才有明显价值。此时仍然应该把工具和硬边界设计成确定性的。",
      "一个成熟系统通常会混合两种方式：用 `Workflow` 固定高风险和高价值的主路径，在少数开放式节点使用 `Agent`。这样既保留灵活性，也不会让整个系统变成不可预测的黑盒。"
    ]
  }
];

export const chapterTwoSections: ChapterSection[] = [
  {
    id: "request-response",
    eyebrow: "请求与响应",
    title: "先把一次模型调用看成稳定的函数",
    paragraphs: [
      "模型接口可以抽象成一个纯契约函数：输入是 `messages`、`tools` 描述和运行参数，输出是文本、`toolCalls` 或错误。Provider 负责把这个统一接口翻译成具体厂商的 HTTP 请求，业务代码不应该到处拼接厂商字段。",
      "一次请求至少需要明确模型名称、消息历史、随机性参数、最大输出长度和取消信号 `AbortSignal`。把这些参数集中在请求对象里，之后替换模型或增加 Token 统计时才不会修改整个 Agent Loop。",
      "响应也应该先归一化。无论原始 API 返回 `content` 数组、工具调用列表还是 `finish_reason`，上层只需要处理统一的 `assistant` 消息和 `ToolCall` 结构。"
    ]
  },
  {
    id: "message-roles",
    eyebrow: "消息角色",
    title: "角色和顺序决定模型能看到什么",
    paragraphs: [
      "`system` 消息描述长期规则和安全边界，`user` 消息表达当前目标，`assistant` 消息记录模型的回复或工具调用，`tool` 消息携带程序执行后的观察。角色不是装饰，而是协议的一部分。",
      "工具结果必须紧跟对应的工具请求，并保留稳定的 `toolCallId`。这样模型才能把多个工具结果和同一轮决策关联起来，也让日志系统可以逐步重建一次运行。",
      "消息历史应该被视为不可随意改写的 `Append-Only` 执行记录。摘要、裁剪和脱敏可以生成新的上下文视图，但原始事件最好单独保留，便于调试和审计。"
    ]
  },
  {
    id: "provider-boundary",
    eyebrow: "Provider 边界",
    title: "把供应商差异关在适配层里",
    paragraphs: [
      "不同模型对工具调用、流式响应、Token 统计和错误码的表示并不完全一致。`Provider` 适配层应该负责格式转换、重试分类和错误归一化，Runtime 只接收自己的领域对象。",
      "错误需要区分可重试和不可重试。网络断开、`429` 限流和临时服务异常可以按照预算重试；认证失败、参数不合法和上下文超限则应该立即返回清晰错误。",
      "在本地测试时使用确定性的 `MockProvider`，可以验证循环和状态变化而无需调用真实模型。真实 Provider 的集成测试再单独覆盖协议映射和限流行为。"
    ]
  },
  {
    id: "streaming",
    eyebrow: "流式输出",
    title: "流式传输改变显示方式，不改变执行边界",
    paragraphs: [
      "流式响应把一条 `assistant` 消息拆成多个增量片段，界面可以更早显示文字，但运行时仍要等到消息完成后才能判断是否存在完整的工具调用。",
      "工具调用的增量 `arguments` 片段不能直接执行。应用需要先收集完整的名称和参数，完成 `JSON.parse`、schema 校验和权限检查，再交给执行器。",
      "客户端断开连接也不等于任务取消。后台 Runtime 应该根据明确的取消信号决定是否停止，并通过事件流或 `checkpoint` 让客户端稍后恢复查看。"
    ]
  }
];

export const chapterThreeSections: ChapterSection[] = [
  {
    id: "tool-contract",
    eyebrow: "工具契约",
    title: "工具首先是一份给程序和模型共同阅读的契约",
    paragraphs: [
      "一个工具至少包含稳定名称 `name`、用途说明 `description`、输入 `schema` 和执行函数 `execute`。描述要告诉模型什么时候使用它，schema 要告诉执行器怎样验证它，函数则承担真正的业务动作。",
      "工具名称和参数字段一旦进入 `Message History`，就会成为可观测协议的一部分。随意改名会让旧任务无法恢复，也会让评估结果失去可比性。",
      "工具描述应该短而具体。把所有业务背景塞进 `description` 会增加上下文成本；与安全和选择直接相关的限制才应该进入模型可见的说明。"
    ]
  },
  {
    id: "schema-validation",
    eyebrow: "Schema 校验",
    title: "模型输出永远要经过不可信输入处理",
    paragraphs: [
      "模型生成的 `arguments` 只是字符串或 JSON 候选值，不能因为格式看起来正确就直接传给业务函数。解析失败、缺少字段、类型错误和超出范围都应该产生结构化的校验结果。",
      "校验层（如 `Zod` schema）可以把字符串日期转换为内部类型，也可以拒绝未知字段和过大的分页参数。转换规则应该明确记录，避免同一个工具在不同入口得到不同结果。",
      "参数错误可以作为 `ToolResult` 返回给模型，让它修正调用；权限错误和高风险动作则应该进入拒绝或人工审批状态。错误类型不同，恢复策略也不同。"
    ]
  },
  {
    id: "executor-boundary",
    eyebrow: "执行器边界",
    title: "执行器是模型建议进入真实世界前的最后一道门",
    paragraphs: [
      "执行器 `ToolExecutor` 先按名称查找注册表，再校验参数、检查权限、设置超时和幂等键，最后才调用工具函数。每一步都应该可以产生事件，便于知道动作停在哪个边界。",
      "读取工具通常可以自动执行，写入、删除、支付和发送通知等副作用工具需要更严格的策略。策略可以根据用户、资源、环境和风险等级决定是否放行。",
      "工具函数的异常必须转换成安全的结构化结果。不要把内部堆栈或凭据泄露给模型；日志记录足够的诊断信息，模型只收到能够帮助它恢复的错误说明。"
    ]
  },
  {
    id: "testing-tools",
    eyebrow: "测试与观察",
    title: "工具要脱离模型单独测试",
    paragraphs: [
      "工具的核心行为应该使用固定输入直接测试，包括成功、参数错误、权限拒绝、超时和外部服务失败。这样可以把业务问题和模型选择问题分开定位。",
      "执行器测试要验证调用顺序和边界：无效工具不会执行函数，失败会生成对应 `ToolResult`，取消信号会在副作用发生前生效，重复幂等键不会再次造成动作。",
      "模型评估（Evals）可以关注工具选择和参数质量，但不能替代执行器单元测试。模型可能改变，程序边界必须保持可靠。"
    ]
  }
];

export const chapterFourSections: ChapterSection[] = [
  {
    id: "tool-calling",
    eyebrow: "Tool Calling",
    title: "Function Calling 是结构化的行动建议",
    paragraphs: [
      "`Function Calling` 让模型在文本之外返回工具名称和参数。它解决的是输出格式问题，让应用可以稳定识别“模型想调用什么”，但它不会替应用执行函数。",
      "一次响应可能只包含最终文本，也可能包含一个或多个 `toolCalls`。Runtime 先记录 `assistant` 消息，再按策略执行每个调用，并把结果追加到下一轮上下文。",
      "工具调用协议越清晰，模型越容易选择正确动作。工具名称、参数 `schema` 和返回结果格式都应该保持稳定，并在日志中保存原始 `toolCallId`。"
    ]
  },
  {
    id: "argument-validation",
    eyebrow: "参数校验",
    title: "先解析，再校验，最后决定能否执行",
    paragraphs: [
      "调用参数通常以 JSON 字符串到达。第一步是安全解析，第二步是 `schema` 校验和必要的类型转换，第三步是业务规则检查，例如资源是否属于当前用户。",
      "校验失败时可以返回包含错误字段和修正提示的 `ToolResult`。模型有机会重新生成调用，但重试次数必须受 Runtime 的 `maxSteps` 和工具预算限制。",
      "成功校验不代表一定有权限执行。权限、审批和环境限制属于执行前策略，应该与参数 `schema` 分开表达，避免模型通过修改参数绕过权限判断。"
    ]
  },
  {
    id: "execution-boundary",
    eyebrow: "执行边界",
    title: "工具调用把 Agent Loop 和外部系统连接起来",
    paragraphs: [
      "执行器应该统一处理超时、取消、重试、幂等和错误转换。这样每个工具只实现自己的业务动作，循环本身也不会被某个外部 SDK 的异常行为污染。",
      "只读工具可以在满足条件时并行执行，存在写入关系的工具则应保持顺序。并行不是默认优化，而是需要根据副作用、速率限制和数据一致性做出的明确选择。",
      "当动作需要人工确认时，Runtime 停在 `waiting_for_human`，并保存完整调用快照。审批通过后从该状态继续，拒绝则写入可解释的 `tool` 消息，避免把审批过程伪装成异常。"
    ]
  },
  {
    id: "loop-connection",
    eyebrow: "连接 Agent Loop",
    title: "工具结果回到消息历史，下一轮才有意义",
    paragraphs: [
      "执行器返回的结果要带上对应的 `toolCallId`，并以 `tool` 消息追加到 `Message History`。下一次模型调用会看到自己的请求和程序观察，才有机会修正策略或给出最终回答。",
      "结果应当区分成功、业务失败和系统失败。成功结果提供事实，业务失败给出可恢复原因，系统失败则交由 Runtime 决定重试或结束任务。",
      "第 05 章会把这些协议组合成完整的循环。`Function Calling` 本身只是连接模型和工具的消息机制，真正的可靠性来自校验、执行器和 Runtime 的共同约束。"
    ]
  }
];

export const chapterSixSections: ChapterSection[] = [
  {
    id: "runtime-boundary",
    eyebrow: "Runtime 边界",
    title: "Runtime 负责让循环可以被控制",
    paragraphs: [
      "Agent Loop 只描述模型和工具如何轮流工作，`AgentRuntime` 则负责把这段循环变成可以启动、暂停、取消、恢复和观察的任务。它需要拥有独立于模型 Provider 的生命周期。",
      "一次运行应该有稳定的 `runId`、当前 `state`、步数 `step`、消息数量和更新时间。状态变化通过事件记录下来，界面和日志系统都从同一份事实中读取，而不是各自猜测。",
      "Runtime 还要提供硬边界：`maxSteps`、总耗时、单工具超时和成本预算。任何一个边界被触发，都应该产生明确的 `failed` 或 `cancelled` 状态。"
    ]
  },
  {
    id: "state-machine",
    eyebrow: "状态转换",
    title: "状态机把开放式循环变成可读的生命周期",
    paragraphs: [
      "一个最小生命周期可以从 `idle` 开始，进入 `running`，等待工具时进入 `waiting_for_tool`，最终到达 `completed`、`failed` 或 `cancelled`。状态名称本身就是运维和调试的重要信息。",
      "每一次转换都应该有原因和时间戳。例如从 `running` 转到 `failed` 时，事件需要说明是参数校验失败、工具异常还是达到了最大步数。这样重放任务时才能解释发生了什么。",
      "状态机也会阻止非法操作。已经 `completed` 的任务不能再次执行工具，`cancelled` 的任务不能悄悄恢复到旧循环。把这些约束写成显式转换表，比依赖多个布尔值更容易维护。"
    ]
  },
  {
    id: "events",
    eyebrow: "事件驱动",
    title: "事件是恢复、回放和实时界面的共同基础",
    paragraphs: [
      "`model-request`、`model-response`、`tool-call-start`、`tool-call-result` 和状态转换都可以成为领域事件。事件按顺序追加后，系统就能重建一次运行的消息历史和当前状态。",
      "前端通过事件流可以实时展示 Agent 正在做什么，后台任务也可以在客户端断开后继续执行。重连时只需要从最后确认的 Event ID 继续读取。",
      "副作用工具必须配合幂等键（`idempotencyKey`）。重试可能再次收到同一个工具事件，执行器需要先检查幂等记录，再决定返回旧结果还是执行一次新的动作。"
    ]
  },
  {
    id: "recovery",
    eyebrow: "取消与恢复",
    title: "恢复不是重新开始，而是从已确认的位置继续",
    paragraphs: [
      "取消信号 `AbortSignal` 应该在模型请求前、工具调用前和长时间工具内部被检查。取消发生后，Runtime 记录最后一个已确认事件，并向调用方返回 `cancelled`，而不是把它伪装成普通错误。",
      "恢复时要区分可重试和不可重试的步骤。查询天气可以安全重试，发送邮件或扣款则必须根据幂等键和外部系统状态决定是否继续。",
      "把 `checkpoint` 设计成消息历史、状态和执行游标的组合，就能让恢复逻辑保持简单。每个步骤都在完成后提交 `checkpoint`，进程崩溃时最多重做最后一个未确认步骤。"
    ]
  }
];

export const chapterNineSections: ChapterSection[] = [
  {
    id: "context-window",
    eyebrow: "Context Window",
    title: "上下文不是越多越好，而是要能支持下一步决策",
    paragraphs: [
      "模型看到的上下文包括 `system` 指令、`user` 消息、历史消息、工具描述和外部资料。它们共同占用有限的 Token 预算，过长的上下文会增加成本，也会降低关键信息被注意到的概率。",
      "每一段上下文都应该回答一个问题：模型下一步是否需要它？已经完成的大段工具原始输出、重复的系统说明和与当前任务无关的检索内容，都可以被压缩或归档。",
      "上下文工程（`Context Engineering`）的目标是让模型获得足够的事实、约束和最近行动，同时保留结构清晰的消息边界。内容选择比单纯扩大窗口更重要。"
    ]
  },
  {
    id: "token-budget",
    eyebrow: "Token Budget",
    title: "把预算分配给任务、工具和回答",
    paragraphs: [
      "可以把一次调用的预算拆成固定部分和可变部分。系统规则和工具 `schema` 占用固定预算，任务历史、检索结果和最终回答占用可变预算。预算应该在请求模型前被明确计算。",
      "工具描述尤其容易被忽略。十几个包含大量示例的工具会比用户问题更早耗尽上下文。只挂载当前任务可能用到的工具子集，或者把工具说明压缩成稳定的精简契约。",
      "当预算不足时，系统应该先压缩低价值历史，再减少检索分片，最后才考虑截断用户目标。目标和安全约束是不可牺牲的核心上下文。"
    ]
  },
  {
    id: "retrieval",
    eyebrow: "检索与压缩",
    title: "检索结果需要经过筛选才能进入 Prompt",
    paragraphs: [
      "向量检索返回的是候选资料，不是模型必须采信的答案。应用层应该根据相关性、来源、时效和权限筛选结果，并保留引用标识，方便模型和用户核查。",
      "对长对话进行摘要压缩时，优先保留已达成决策、未完成子目标、硬约束和关键事实，删除寒暄与已闭环的中间试错。摘要本身也应标记来源区间，避免演变成无出处的幻觉。",
      "检索和压缩都应当是可观测的步骤。记录输入 Token、输出 Token、命中的文档块与被裁剪的内容，才能用数据验证上下文策略是否真正改善了任务表现。"
    ]
  },
  {
    id: "prompt-assembly",
    eyebrow: "Prompt Assembly",
    title: "用分层组装替代一段不断增长的字符串",
    paragraphs: [
      "将上下文组装拆成规则层、任务层、状态层、工具层和参考资料层。每层都有清晰的来源和生命周期，更新某一层时不会意外污染其他层。",
      "消息历史应保持角色和事件边界，检索内容要带上来源元数据，工具结果要保留 `toolCallId`。结构化组装能让模型推理更稳定，也让日志回放和快照测试更容易比对。",
      "最后一步才是序列化为具体 `Provider` 所需的请求格式。这样可以在本地纯函数环境测试上下文筛选与预算计算，而无需每次都发起真实模型调用。"
    ]
  }
];

export const chapterContent = {
  "chapter-1": chapterOneSections,
  "chapter-2": chapterTwoSections,
  "chapter-3": chapterThreeSections,
  "chapter-4": chapterFourSections,
  "chapter-5": chapterFiveSections,
  "chapter-6": chapterSixSections,
  "chapter-9": chapterNineSections
} as const;

export const chapterEditorialMeta: Record<keyof typeof chapterContent, ChapterEditorialMeta> = {
  "chapter-1": {
    badge: "基础精读",
    goal: "厘清 Chatbot、Workflow 与 Agent 的决策归属，在立项阶段划定可靠的系统自主性边界。",
    flowSteps: ["辨析模型", "拆解四界", "约束权限", "架构选型"],
    principles: [
      { tag: "判断 01", title: "决策与执行分离", description: "模型只负责提出下一步意图，权限核验与副作用执行永远归属确定性程序。", tone: "accent" },
      { tag: "判断 02", title: "优先确定性流程", description: "能用有限状态机写清的主干业务用 Workflow，只在路径开放节点引入 Agent。" },
      { tag: "判断 03", title: "先定禁区再放权", description: "明确最大步数、超时与人工审批门槛，比单纯优化提示词更能保障生产安全。" }
    ],
    summaryHeading: "Agent 的本质不是自由发挥，而是受控的开放式决策。",
    summaryItems: [
      { label: "核心边界", text: "模型接口、工具注册表、运行时状态机与消息历史构成最小闭环。" },
      { label: "选型准则", text: "固定路径选 Workflow，多工具动态组合选 Agent，生产系统常将二者混编。" },
      { label: "下一章预告", text: "进入 LLM 接口与消息协议，把模型调用抽象成稳定的类型化契约。" }
    ],
    marginTipTitle: "阅读批注",
    marginTipBody: "在评审 Agent 需求时，先问“如果改成固定三步 Workflow 会损失什么”，答案往往就是 Agent 真正该承担的节点。"
  },
  "chapter-2": {
    badge: "协议设计",
    goal: "设计不耦合具体模型厂商的请求/响应接口，理解四类消息角色如何构成可审计上下文。",
    flowSteps: ["归一化接口", "定义角色", "隔离厂商", "处理流式"],
    principles: [
      { tag: "协议 01", title: "收拢供应商差异", description: "在 Provider 适配层完成字段映射与错误分类，不让厂商格式渗透进核心循环。", tone: "accent" },
      { tag: "协议 02", title: "严守角色契约", description: "system、user、assistant、tool 顺序与 toolCallId 配对决定模型能否正确推理。" },
      { tag: "协议 03", title: "流式不改边界", description: "流式增量只优化首字延迟，工具调用必须等参数完整汇聚并校验后才能执行。" }
    ],
    summaryHeading: "稳定的消息协议，是让 Agent 可替换、可回放的前提。",
    summaryItems: [
      { label: "接口契约", text: "统一输入 messages、tools 与 AbortSignal，输出标准化的文本或 ToolCall。" },
      { label: "测试策略", text: "用确定性 MockProvider 测试状态流转，用独立集成测试覆盖厂商限流与映射。" },
      { label: "下一章预告", text: "构建 Tool Registry 与执行器，为模型生成的参数建立严格校验门面。" }
    ],
    marginTipTitle: "工程提示",
    marginTipBody: "永远保留原始未裁剪的事件序列用于审计，将发送给模型的消息列表视为由事件投影出的只读视图。"
  },
  "chapter-3": {
    badge: "架构边界",
    goal: "实现兼顾模型可读性与程序安全性的 Tool Registry，用 Schema 校验拦截不可信模型输出。",
    flowSteps: ["声明契约", "校验输入", "守卫副作用", "独立单测"],
    principles: [
      { tag: "门面 01", title: "参数默认不可信", description: "模型产出的 JSON 视为外部不可信输入，必须经 Schema 解析转型后才可入参。", tone: "accent" },
      { tag: "门面 02", title: "安全吞吐异常", description: "捕获工具内部异常并转为脱敏的结构化说明，绝不向模型暴露系统堆栈与密钥。" },
      { tag: "门面 03", title: "脱离模型测工具", description: "用确定性单元测试覆盖工具超时、越权与幂等逻辑，不把业务缺陷混入提示词调优。" }
    ],
    summaryHeading: "Tool Executor 是模型意图进入真实世界前的最后一道闸门。",
    summaryItems: [
      { label: "工具三要素", text: "精炼准确的 description、严格闭合的输入 schema 与幂等安全的 execute 函数。" },
      { label: "分级管控", text: "只读查询自动放行，写入、通知与资金操作强制挂载策略检查或人工审批。" },
      { label: "下一章预告", text: "串联 Function Calling 完整数据流，打通从模型提议到结果回填的闭环。" }
    ],
    marginTipTitle: "命名约束",
    marginTipBody: "工具名称与字段一旦写入持久化消息历史便成为数据契约，重命名工具时务必准备向后兼容映射。"
  },
  "chapter-4": {
    badge: "机制衔接",
    goal: "掌握 Function Calling 从意图解析、权限拦截到结果回填的完整闭环，为编写核心循环铺平道路。",
    flowSteps: ["识别意图", "三级校验", "受控执行", "结果回填"],
    principles: [
      { tag: "闭环 01", title: "建议而非执行", description: "Function Calling 只解决结构化意图表达，何时执行与能否执行完全由宿主程序裁决。", tone: "accent" },
      { tag: "闭环 02", title: "区分错误性质", description: "参数校验错误可交回模型自愈，权限拒绝与系统故障则由 Runtime 接管决策。" },
      { tag: "闭环 03", title: "保留关联凭证", description: "用稳定的 toolCallId 将每次调用与观察结果严密缝合，支撑多工具并发与审计。" }
    ],
    summaryHeading: "只有当工具结果回到消息历史，下一轮模型推理才具备新的事实。",
    summaryItems: [
      { label: "执行管线", text: "JSON 解析 → Schema 类型校验 → 业务权限与审批检查 → 幂等执行 → 序列化回填。" },
      { label: "并发权衡", text: "无副作用只读工具可按预算并行提速，状态变更工具必须遵循因果顺序。" },
      { label: "下一章预告", text: "进入全书核心实验章节，亲手从零编写并单步调试完整的 TypeScript Agent Loop。" }
    ],
    marginTipTitle: "实战准备",
    marginTipBody: "读完本章后建议直接进入第 05 章的交互模拟器，亲眼观察 toolCallId 如何在多轮消息间传递。"
  },
  "chapter-5": {
    badge: "可交互实验",
    goal: "不依赖任何黑盒框架，亲手写出带工具校验、停止条件与故障恢复能力的 TypeScript Agent Loop。",
    flowSteps: ["看见问题", "建立循环", "运行实验", "工程化"],
    principles: [
      { tag: "模型", title: "决定下一步", description: "输出最终文本或结构化 Tool Call。它只提出行动建议，不直接触碰外部系统。", tone: "accent" },
      { tag: "Runtime", title: "守住程序边界", description: "控制循环步进、校验参数、记录事件，并强制执行取消、超时与最大步数约束。" },
      { tag: "Tool", title: "改变外部世界", description: "真正访问外部 API 与数据库的程序能力，拥有明确的输入契约与权限边界。" }
    ],
    summaryHeading: "循环本身只有二十行代码，边界设计决定它能否成为生产级 Runtime。",
    summaryItems: [
      { label: "核心机制", text: "模型提出下一步动作，程序校验并执行工具，结构化结果追加回上下文开启下一轮。" },
      { label: "可见状态", text: "Append-Only 的 Message History 忠实记录每轮观察与行动，天然支持回放与排障。" },
      { label: "工程护栏", text: "最大步数、Schema 校验、异常转译、AbortSignal 与超时共同构成确定性安全网。" }
    ],
    marginTipTitle: "实验提示",
    marginTipBody: "在下方模拟器中先点击“下一步”观察正常闭环，再勾选“模拟工具错误”，对比错误消息如何进入上下文。"
  },
  "chapter-6": {
    badge: "运行时架构",
    goal: "在裸循环外层构建显式状态机与事件总线，支持任务观察、优雅取消、断点恢复与幂等保护。",
    flowSteps: ["独立生命周期", "显式状态机", "事件溯源", "断点恢复"],
    principles: [
      { tag: "状态 01", title: "显式转换表", description: "用清晰的生命周期枚举替代散落的布尔标记，杜绝已完成或已取消任务发生幽灵执行。", tone: "accent" },
      { tag: "状态 02", title: "事件即单一事实", description: "UI 渲染、日志监控与断点续跑共同消费同一条有序领域事件流，消除状态分叉。" },
      { tag: "状态 03", title: "检查点与幂等", description: "每步落盘 Checkpoint 并为副作用操作绑定幂等键，让崩溃恢复安全可预测。" }
    ],
    summaryHeading: "状态机与事件流，让一段函数调用升级为可运维的后台工程系统。",
    summaryItems: [
      { label: "核心快照", text: "runId、state、step、messageCount 与时间戳共同描述任意时刻的运行切面。" },
      { label: "取消语义", text: "AbortSignal 贯穿模型请求与工具内部，主动取消应归档为 cancelled 而非系统异常。" },
      { label: "后续进阶", text: "有了可靠的 Runtime 骨架后，下一阶段将聚焦 Context Engineering 精细管理上下文质量。" }
    ],
    marginTipTitle: "架构权衡",
    marginTipBody: "即使首版只跑在单进程内存中，先抽离出 Event 与 Snapshot 数据结构，日后接入队列与持久化也无需重写核心。"
  },
  "chapter-9": {
    badge: "上下文工程",
    goal: "在有限 Token 预算内分层组装高信噪比上下文，让模型始终看见支撑下一步决策的关键事实。",
    flowSteps: ["评估窗口", "划分预算", "筛选压缩", "分层组装"],
    principles: [
      { tag: "上下文 01", title: "高信噪比优于求全", description: "冗长过期的工具原始输出会稀释注意力，只保留支撑下一步推理的必要事实与约束。", tone: "accent" },
      { tag: "上下文 02", title: "预算前置计算", description: "在发起请求前核定固定开销与动态配额，按优先级优雅降级而非任由 API 报错截断。" },
      { tag: "上下文 03", title: "五层结构化组装", description: "将规则、任务、状态、工具与参考资料解耦管理，独立演进且支持纯函数快照测试。" }
    ],
    summaryHeading: "Context Engineering 决定了 Agent 在复杂长程任务中的推理上限与成本曲线。",
    summaryItems: [
      { label: "裁剪顺序", text: "优先归档陈旧工具明细与寒暄，其次精简低相关检索片段，严守用户目标与安全底线。" },
      { label: "可观测性", text: "持续度量每轮输入/输出 Token 占比与检索命中率，用实测指标驱动上下文调优。" },
      { label: "全书串联", text: "将本章的分层组装器接入第 05–06 章的 Runtime，即可获得兼顾可靠性与长程记忆的完整架构。" }
    ],
    marginTipTitle: "调优经验",
    marginTipBody: "许多看似“模型变笨或幻觉”的线上故障，根源往往是十几个冗长的工具 Schema 挤占了关键历史消息。"
  }
};
