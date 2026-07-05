from __future__ import annotations

from copy import deepcopy
from pathlib import Path
import shutil
import textwrap


ROOT = Path(r"E:\zeno skill 弹药库")
INSTALLABLE_ROOT = ROOT / "installable"
DIST = ROOT / "dist"
TODAY = "2026-06-28"


def clean(text: str) -> str:
    text = textwrap.dedent(text).strip()
    lines = [(line[4:] if line.startswith("    ") else line) for line in text.splitlines()]
    return "\n".join(lines).strip() + "\n"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(clean(text), encoding="utf-8")


def bullets(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def numbered(items: list[str]) -> str:
    return "\n".join(f"{idx}. {item}" for idx, item in enumerate(items, 1))


def glossary(items: list[tuple[str, str]]) -> str:
    return "\n".join(f"- **{term}** — {definition}" for term, definition in items)


def chapter_md(ch: dict) -> str:
    methods = "\n".join(
        f"- **{m['name']}**: {m['use']}\n  - 怎么做: {m['how']}"
        for m in ch.get("methods", [])
    )
    concepts = "\n".join(f"- **{term}**: {definition}" for term, definition in ch.get("concepts", {}).items())
    cases = bullets(ch.get("cases", []))
    anti = bullets(ch.get("anti", []))
    actions = numbered(ch.get("actions", []))
    connects = bullets(ch.get("connects", []))
    return f"""
    # {ch['label']}: {ch['title']}

    ## 核心用途

    {ch['core']}

    ## 可调用方法

    {methods}

    ## 关键术语

    {concepts}

    ## 案例与素材

    {cases}

    ## 误用提醒

    {anti}

    ## 行动指南

    {actions}

    ## Connects To

    {connects}
    """


def skill_md(book: dict) -> str:
    routes = "\n".join(f"   - {item}" for item in book["workflow"])
    refs = "\n".join(f"- {item}" for item in book["routing"])
    triggers = "\n".join(f"- \"{item}\"" for item in book["triggers"])
    principles = "\n".join(f"- {item}" for item in book["principles"])
    return f"""---
name: {book['slug']}
description: "{book['description']}"
---

# {book['display_title']}

这是《{book['title']}》的 AI 行动指南。使用本 skill 时，不要只复述书本，而要把书中的框架、术语、案例和判断规则转成可执行的分析、创作、决策或学习动作。

## 执行流程

1. 先判断用户的问题属于哪类:
{routes}

2. 先读路由文件:
   - 快速判断: `references/cheatsheet.md`
   - 方法调用: `references/patterns.md`
   - 概念解释: `references/glossary.md`
   - 章节定位: `references/chapter-index.md`
   - 来源边界: `references/source-card.md`

3. 输出时用这个格式:
   - `问题归类`: 用户的问题对应书中哪个核心框架。
   - `关键判断`: 这本书会如何看这个问题。
   - `可调用方法`: 选 1-3 个方法，不堆砌概念。
   - `案例映射`: 引用书中案例或重构一个同构案例。
   - `下一步行动`: 给出一个具体动作、检查表或创作模板。

## 按需读取

{refs}

## 常用触发问题

{triggers}

## 使用原则

{principles}
"""


def source_card(book: dict) -> str:
    return f"""
    # Source Card

    ## Basic Info

    - Book: 《{book['title']}》
    - Original: {book.get('original', book['title'])}
    - Author: {book['author']}
    - Type: {book['type']}
    - Skill: `{book['slug']}`
    - Generated: {TODAY}
    - Source: `{book['source']}`
    - Extraction Note: {book['extract_note']}

    ## What This Skill Solves

    {book['what_solves']}

    ## Good For

    {bullets(book['good_for'])}

    ## Not For

    {bullets(book['not_for'])}

    ## Limits

    This skill only covers the source content and extracted method layer. For live facts, laws, market data, platform rules, or safety-critical claims, add current sources.
    """


def chapter_index(book: dict) -> str:
    rows = "\n".join(
        f"| {ch['label']} | [{ch['title']}](chapters/{ch['file']}) | {ch['route']} |"
        for ch in book["chapters"]
    )
    topics = "\n".join(f"- **{k}** -> {v}" for k, v in book["topics"].items())
    return f"""
    # Chapter Index

    ## Chapter Routes

    | # | Chapter | Use When |
    |---|---|---|
    {rows}

    ## Topic Routes

    {topics}

    ## Reading Order

    - For fast answers, read `cheatsheet.md` first, then the most relevant chapter.
    - For learning, read `overview.md -> chapter-index.md -> chapters/ -> patterns.md -> glossary.md`.
    - For content production, read `patterns.md` and then load the chapter whose case style matches the task.
    """


def overview(book: dict) -> str:
    return f"""
    # Overview

    {book['overview']}

    ## 核心框架

    {bullets(book['core_frameworks'])}

    ## 最适合转化成的能力

    {bullets(book['capabilities'])}
    """


def patterns(book: dict) -> str:
    sections = []
    for item in book["patterns"]:
        sections.append(
            f"""## {item['name']}

**什么时候用**: {item['when']}

**怎么做**:
{numbered(item['steps'])}

**权衡**: {item['tradeoff']}"""
        )
    return "# Patterns\n\n" + "\n\n".join(sections)


def cheatsheet(book: dict) -> str:
    rules = "\n".join(f"| {r['when']} | {r['do']} | {r['why']} |" for r in book["decision_rules"])
    smells = bullets(book["smells"])
    defaults = bullets(book["defaults"])
    return f"""
    # Cheatsheet

    ## Decision Rules

    | When | Do | Why |
    |---|---|---|
    {rules}

    ## Fast Smells

    {smells}

    ## Defaults

    {defaults}
    """


BOOKS: list[dict] = [
    {
        "slug": "zeno-mckee-story",
        "title": "故事",
        "display_title": "zeno-故事-罗伯特麦基",
        "original": "Story: Substance, Structure, Style, and the Principles of Screenwriting",
        "author": "罗伯特·麦基（Robert McKee）",
        "type": "故事结构、编剧、叙事设计、场景分析、人物弧光、冲突、高潮",
        "source": r"I:\赞诺【电子书】\电子书库 A\skill封装中\《故事》罗伯特麦基-着.pdf",
        "extract_note": "Source PDF is a 517-page scanned image book. Plain text extraction returned almost no usable text; RapidOCR sample pages worked and confirmed chapter text, but full-book OCR was not completed in this batch. This is a framework-first skill based on the book's canonical structure and OCR spot checks; deepen with full OCR before quote-level or page-level claims.",
        "description": "Apply Robert McKee's Story frameworks. Use when designing screenplay or narrative structure, diagnosing story problems, building inciting incidents, progressive complications, turning points, crisis, climax, resolution, scene value shifts, character arcs, exposition, antagonistic forces, genre expectations, or rewriting content into dramatic story.",
        "what_solves": "把《故事》转成叙事创作和故事诊断工具箱：从故事问题、结构光谱、类型、人物、价值转化、激励事件、幕设计、场景设计、危机、高潮到改写方法。",
        "good_for": [
            "诊断一个故事为什么平、散、假或没有推进。",
            "设计短视频、文章、案例、课程或品牌故事的戏剧结构。",
            "把事件堆砌改成有价值转化的场景。",
            "为人物建立欲望、冲突、选择和弧光。",
            "设计激励事件、进展纠葛、危机、高潮和结局。",
        ],
        "not_for": [
            "把麦基当公式套模板。",
            "替代完整剧本创作训练和行业反馈。",
            "在未完成全书 OCR 前做页码级、逐字级引用。",
        ],
        "workflow": [
            "故事整体诊断: 先读 `references/cheatsheet.md`，再读 ch01、ch02。",
            "结构/类型/世界观: 读 ch03、ch04、ch05。",
            "人物和意义: 读 ch06、ch07。",
            "设计剧情推进: 读 ch08-ch13。",
            "改写和表达: 读 ch14-ch19。",
        ],
        "routing": [
            "`references/overview.md` - 麦基故事系统总览。",
            "`references/source-card.md` - 来源、扫描件限制和 OCR 状态。",
            "`references/chapter-index.md` - 19 个章节/主题路由。",
            "`references/cheatsheet.md` - 故事诊断、场景设计和改写决策规则。",
            "`references/patterns.md` - 激励事件、场景价值转化、危机高潮等可调用方法。",
            "`references/glossary.md` - 叙事术语表。",
            "`references/chapters/` - 按创作问题加载。",
        ],
        "triggers": [
            "帮我用麦基《故事》诊断这个故事。",
            "这个故事为什么没有吸引力？",
            "帮我设计激励事件和高潮。",
            "把这个案例写成有戏剧张力的故事。",
            "这个场景有没有价值转化？",
        ],
        "principles": [
            "麦基讲的是原理，不是公式。",
            "故事不是事件堆砌，而是价值在压力下发生转化。",
            "每个场景都应该改变人物处境或价值状态。",
            "人物通过压力下的选择显露真相。",
            "高潮必须兑现故事提出的核心价值冲突。",
        ],
        "overview": "《故事》是编剧与叙事设计的经典方法书。它强调故事艺术的核心不是套规则，而是理解经时间验证的叙事原理：人物有欲望，世界有阻力，事件改变价值，选择暴露人物，结构组织压力，高潮兑现意义。对 Zeno 弹药库来说，本 skill 可把商业案例、个人品牌故事、课程开场、短视频脚本和长文叙事，从“信息说明”改造成“有欲望、有冲突、有转化、有余味”的故事。",
        "core_frameworks": [
            "原理而非规则: 不照搬公式，而理解故事为何有效。",
            "故事价值: 自由/奴役、爱/恨、真相/谎言等价值在场景中转化。",
            "激励事件: 打破生活平衡，迫使主人公行动的事件。",
            "进展纠葛: 冲突逐步升级，每一步都比上一层更困难。",
            "危机-高潮-结局: 在不可兼得的选择中暴露人物并完成意义。",
            "场景设计: 每个场景必须从一个价值状态转到另一个价值状态。",
            "对抗力量原则: 故事强度取决于阻力的深度和层次。",
        ],
        "capabilities": [
            "故事结构诊断。",
            "场景价值转化检查。",
            "人物欲望与冲突设计。",
            "商业案例故事化。",
            "短视频/长文/课程开场脚本改写。",
        ],
        "topics": {
            "故事问题": "ch01",
            "结构光谱": "ch02",
            "背景设定": "ch03",
            "类型": "ch04",
            "人物": "ch05, ch16",
            "意义": "ch06",
            "故事材质": "ch07",
            "激励事件": "ch08",
            "幕设计": "ch09",
            "场景设计": "ch10",
            "场景分析": "ch11",
            "危机": "ch13",
            "高潮": "ch14",
            "对抗力量": "ch16",
            " exposition": "ch17",
            "改写方法": "ch19",
        },
        "glossary": [
            ("故事原理", "经时间验证的叙事有效性机制，不等于固定公式。"),
            ("故事价值", "人物生活中可正负转化的核心价值，如爱/恨、自由/奴役、真相/谎言。"),
            ("激励事件", "打破主人公平衡并启动主要欲望线的事件。"),
            ("欲望对象", "主人公显性或隐性追求的目标。"),
            ("进展纠葛", "阻力不断升级，使人物必须付出更大代价。"),
            ("转折点", "让行动方向、信息状态或价值状态发生改变的事件。"),
            ("危机", "高潮前的终极两难选择。"),
            ("高潮", "主人公在最大压力下做出不可逆选择并兑现核心冲突。"),
            ("结局", "高潮后的价值余波和世界新状态。"),
            ("场景", "一个有目标、冲突和价值转化的最小戏剧单元。"),
            ("非事件", "没有价值变化、只传递信息的场景。"),
            ("对抗力量", "阻碍主人公欲望实现的内在、人际、社会或环境力量。"),
            ("人物弧光", "人物在压力选择中暴露或改变的轨迹。"),
            (" exposition", "必须被观众知道的背景信息，应被戏剧化嵌入行动。"),
        ],
        "patterns": [
            {
                "name": "场景价值转化检查",
                "when": "一个场景看起来有对白和动作，但读者觉得无聊。",
                "steps": [
                    "写出场景开始时的价值状态。",
                    "写出场景结束时的价值状态。",
                    "判断价值是否从正到负、负到正，或发生更复杂转向。",
                    "如果没有转化，删除场景或把信息嵌入其他场景。",
                ],
                "tradeoff": "会删掉很多说明性内容，但故事会更紧。",
            },
            {
                "name": "激励事件设计",
                "when": "故事开头没有启动感。",
                "steps": [
                    "确定主人公原本的生活平衡。",
                    "设计一个无法忽视的扰动。",
                    "让扰动制造欲望对象或暴露缺失。",
                    "让主人公必须行动，而不是可以旁观。",
                ],
                "tradeoff": "启动越强，后续承诺越大，必须在高潮兑现。",
            },
            {
                "name": "危机-高潮-结局三连",
                "when": "故事结尾乏力或像总结。",
                "steps": [
                    "把核心价值冲突压缩成不可兼得的选择。",
                    "让人物在最大压力下做出选择。",
                    "用行动而不是解释完成高潮。",
                    "用结局展示选择后的新世界状态。",
                ],
                "tradeoff": "强高潮需要前文持续铺设对抗力量。",
            },
            {
                "name": "对抗力量加深",
                "when": "故事冲突太轻。",
                "steps": [
                    "列出外部阻碍。",
                    "加入人际阻碍。",
                    "加入社会/制度阻碍。",
                    "加入人物内在矛盾。",
                    "让阻力逐层升级，而不是重复同一种麻烦。",
                ],
                "tradeoff": "阻力越深，人物选择越真实，但结构复杂度也上升。",
            },
        ],
        "decision_rules": [
            {"when": "场景没有价值变化", "do": "删掉或重写成有转化的事件", "why": "没有转化就是非事件"},
            {"when": "开头拖沓", "do": "提前或强化激励事件", "why": "故事需要打破平衡"},
            {"when": "人物扁平", "do": "让人物在压力下选择", "why": "选择显露真实性格"},
            {"when": "结尾像说教", "do": "把主题放进高潮行动", "why": "故事意义应由行动证明"},
            {"when": "冲突重复", "do": "升级对抗力量层次", "why": "进展纠葛需要越来越难"},
        ],
        "smells": [
            "一场戏只是在解释背景，没有价值转化。",
            "人物想要什么不清楚。",
            "冲突只是争吵，不改变行动代价。",
            "高潮靠旁白总结，而不是人物选择。",
            "主题先行，人物像观点传声筒。",
        ],
        "defaults": [
            "默认每个故事先找主人公、欲望对象、对抗力量和核心价值。",
            "默认每个场景检查开始/结束价值状态。",
            "默认让信息通过冲突和行动呈现。",
            "默认高潮必须回应激励事件提出的问题。",
        ],
        "chapters": [
            {
                "label": "ch01",
                "file": "ch01-story-problem.md",
                "title": "故事问题",
                "route": "故事整体无力、观众不在乎、开头没有启动。",
                "core": "故事问题通常不是缺素材，而是缺少能够组织欲望、冲突和价值转化的结构。",
                "methods": [{"name": "故事四问", "use": "整体诊断", "how": "谁想要什么？为什么现在？阻力是什么？价值如何改变？"}],
                "concepts": {"故事问题": "故事无法持续吸引注意的根本结构缺陷。"},
                "cases": ["OCR 样本显示麦基强调故事是人生设备，而不是单纯娱乐。"],
                "anti": ["用更多事件掩盖没有核心冲突。"],
                "actions": ["写出主人公、欲望、阻力、核心价值。"],
                "connects": ["激励事件", "故事价值"],
            },
            {
                "label": "ch02",
                "file": "ch02-structure-spectrum.md",
                "title": "结构光谱",
                "route": "选择经典设计、迷你情节或反情节。",
                "core": "结构不是唯一模板，而是从经典故事到实验叙事的一条光谱；选择结构要服务观众体验和作品目标。",
                "methods": [{"name": "结构选择", "use": "开项目前", "how": "判断故事更适合因果清晰、开放结局、内心化还是反传统。"}],
                "concepts": {"结构光谱": "不同叙事结构的连续范围。"},
                "cases": ["商业案例通常更适合清晰因果和强转化结构。"],
                "anti": ["为了高级感故意让结构混乱。"],
                "actions": ["为故事选择一种结构倾向。"],
                "connects": ["类型", "观众期待"],
            },
            {
                "label": "ch03",
                "file": "ch03-structure-and-setting.md",
                "title": "结构与背景",
                "route": "搭建世界观、规则、时代和空间边界。",
                "core": "背景不是装饰，而是决定哪些行动可能、哪些冲突可信、哪些价值有代价。",
                "methods": [{"name": "世界规则表", "use": "设定故事世界", "how": "写时代、地点、制度、社会规则、禁忌和资源限制。"}],
                "concepts": {"背景": "故事发生的时间、空间、社会和规则系统。"},
                "cases": ["装修案例故事的背景包括预算、合同、工地、家庭关系和信任环境。"],
                "anti": ["背景像旅游介绍，不影响冲突。"],
                "actions": ["写出 5 条世界规则。"],
                "connects": ["类型", "对抗力量"],
            },
            {
                "label": "ch04",
                "file": "ch04-genre.md",
                "title": "类型",
                "route": "处理类型承诺和观众期待。",
                "core": "类型是与观众的契约。创作者要理解类型期待，再决定满足、变化或反转。",
                "methods": [{"name": "类型契约", "use": "定位故事", "how": "写出观众期待的情绪、冲突、节奏和结局承诺。"}],
                "concepts": {"类型": "一组叙事期待和惯例。"},
                "cases": ["商业逆袭故事、避坑案例、转型故事都有类型期待。"],
                "anti": ["不知道自己在承诺什么体验。"],
                "actions": ["定义故事类型和反类型点。"],
                "connects": ["观众期待", "结构"],
            },
            {
                "label": "ch05",
                "file": "ch05-character.md",
                "title": "人物",
                "route": "人物扁平、动机不明、选择无力。",
                "core": "人物不是标签，而是在压力下通过选择显露出来的欲望与价值系统。",
                "methods": [{"name": "压力选择", "use": "塑造人物", "how": "把人物放在不可兼得的选择中，看他愿意牺牲什么。"}],
                "concepts": {"人物": "在选择中显露的价值结构。"},
                "cases": ["客户案例中，人物真正吸引人的不是身份，而是他如何选择。"],
                "anti": ["用履历替代人物。"],
                "actions": ["设计一个两难选择。"],
                "connects": ["危机", "人物弧光"],
            },
            {
                "label": "ch06",
                "file": "ch06-structure-and-meaning.md",
                "title": "结构与意义",
                "route": "主题空泛或说教。",
                "core": "故事意义不是作者喊出来的，而是由结构中的选择、代价和结果生成。",
                "methods": [{"name": "主题行动化", "use": "避免说教", "how": "把主题转成高潮中的具体选择和后果。"}],
                "concepts": {"意义": "故事结构最终让观众感到的价值判断。"},
                "cases": ["不要说“诚信重要”，让人物为诚信付出代价。"],
                "anti": ["先写观点，再让人物配合观点。"],
                "actions": ["把主题改写成一个选择。"],
                "connects": ["高潮", "价值"],
            },
            {
                "label": "ch07",
                "file": "ch07-story-substance.md",
                "title": "故事材质",
                "route": "素材很多但组织不成故事。",
                "core": "故事材质来自人物生活中的价值、欲望、冲突和变化，而不是事实清单。",
                "methods": [{"name": "素材转事件", "use": "处理真实案例", "how": "把事实改写成目标、阻力、行动、结果和价值变化。"}],
                "concepts": {"故事材质": "可被戏剧化组织的生活材料。"},
                "cases": ["一段装修维权经历要转成故事，必须找到欲望、阻力和选择。"],
                "anti": ["把时间线当故事。"],
                "actions": ["从素材中挑 5 个价值变化点。"],
                "connects": ["场景", "案例写作"],
            },
            {
                "label": "ch08",
                "file": "ch08-inciting-incident.md",
                "title": "激励事件",
                "route": "开头弱、故事迟迟不启动。",
                "core": "激励事件打破主人公平衡，让他无法回到原状，并启动主要欲望线。",
                "methods": [{"name": "平衡破坏", "use": "设计开头", "how": "先写原状，再写一个迫使行动的扰动。"}],
                "concepts": {"激励事件": "启动故事的平衡破坏。"},
                "cases": ["收到超预算报价、合同漏洞暴露、客户投诉爆发都可成为商业故事激励事件。"],
                "anti": ["开头只是背景介绍。"],
                "actions": ["把激励事件放到故事前 20%。"],
                "connects": ["欲望对象", "进展纠葛"],
            },
            {
                "label": "ch09",
                "file": "ch09-act-design.md",
                "title": "幕设计",
                "route": "长故事结构松散。",
                "core": "幕是价值运动的大段落，每一幕都应以重大转折改变故事方向。",
                "methods": [{"name": "幕转折设计", "use": "长文/剧本结构", "how": "每一幕设置一个不可逆转折，提升代价和难度。"}],
                "concepts": {"幕": "由一组场景构成的大结构单元。"},
                "cases": ["一篇长案例可按发现问题、尝试解决、危机升级、最终选择分幕。"],
                "anti": ["章节只是分段，没有转折。"],
                "actions": ["写出 3-5 个幕转折。"],
                "connects": ["进展纠葛", "高潮"],
            },
            {
                "label": "ch10",
                "file": "ch10-scene-design.md",
                "title": "场景设计",
                "route": "单场戏或段落没有张力。",
                "core": "场景是故事最小戏剧单元，必须包含目标、冲突、转折和价值变化。",
                "methods": [{"name": "场景四件套", "use": "写任意场景", "how": "目标、阻力、转折、价值变化。"}],
                "concepts": {"场景": "有价值转化的戏剧单元。", "非事件": "没有价值变化的段落。"},
                "cases": ["OCR 样本中麦基强调没有不转化的场景，若不是真正事件就删掉。"],
                "anti": ["场景只为了传达信息。"],
                "actions": ["为每场写开始/结束价值。"],
                "connects": ["场景分析", " exposition"],
            },
            {
                "label": "ch11",
                "file": "ch11-scene-analysis.md",
                "title": "场景分析",
                "route": "改写场景、找节奏问题。",
                "core": "分析场景要看人物欲望、冲突策略、节拍变化和最终转折，而不只是对白好不好。",
                "methods": [{"name": "节拍拆解", "use": "精修场景", "how": "按行动/反应拆节拍，找每次策略变化。"}],
                "concepts": {"节拍": "人物行动策略的微小变化。"},
                "cases": ["争吵场景如果每句只是重复情绪，就缺少节拍推进。"],
                "anti": ["只润色句子，不改变戏剧行动。"],
                "actions": ["把场景拆成 5-10 个节拍。"],
                "connects": ["对白", "改写"],
            },
            {
                "label": "ch12",
                "file": "ch12-composition.md",
                "title": "布局谋篇",
                "route": "安排信息、节奏、反复和对比。",
                "core": "故事组合要管理节奏、对比、重复、递进和信息释放，让观众持续期待。",
                "methods": [{"name": "递进布局", "use": "结构调整", "how": "让同类冲突每次更难、信息每次改变判断。"}],
                "concepts": {"布局": "事件和信息的整体安排。"},
                "cases": ["内容文章也要安排钩子、升级、反转和余味。"],
                "anti": ["所有段落同等重要。"],
                "actions": ["标出每段功能。"],
                "connects": ["节奏", "信息释放"],
            },
            {
                "label": "ch13",
                "file": "ch13-crisis.md",
                "title": "危机",
                "route": "结尾前缺少真正选择。",
                "core": "危机是高潮前的终极两难，让主人公必须在不可兼得的价值之间选择。",
                "methods": [{"name": "两难压缩", "use": "设计结尾", "how": "把问题压缩成两个都有代价的选择。"}],
                "concepts": {"危机": "高潮前的终极选择。"},
                "cases": ["品牌故事中的危机可以是短期赚钱与长期信任之间的选择。"],
                "anti": ["高潮前没有代价。"],
                "actions": ["写出 A/B 两个都有损失的选择。"],
                "connects": ["高潮", "人物"],
            },
            {
                "label": "ch14",
                "file": "ch14-climax.md",
                "title": "高潮",
                "route": "结尾乏力、没有兑现。",
                "core": "高潮是核心冲突的不可逆行动兑现，必须让故事价值完成最大转化。",
                "methods": [{"name": "高潮兑现", "use": "改结尾", "how": "让人物用行动回答故事从激励事件提出的问题。"}],
                "concepts": {"高潮": "最终不可逆转折。"},
                "cases": ["案例故事中高潮不是总结经验，而是关键决策发生。"],
                "anti": ["用解释代替行动。"],
                "actions": ["把结尾改成一个不可逆行动。"],
                "connects": ["危机", "结局"],
            },
            {
                "label": "ch15",
                "file": "ch15-resolution.md",
                "title": "结局",
                "route": "高潮之后如何收束。",
                "core": "结局展示高潮后的新平衡，让观众感到价值后果，而不是继续解释。",
                "methods": [{"name": "余波收束", "use": "写结尾", "how": "展示人物、关系或世界如何因选择改变。"}],
                "concepts": {"结局": "高潮后的新状态。"},
                "cases": ["商业案例结局可展示客户之后如何改变判断方式。"],
                "anti": ["高潮后再讲一堆道理。"],
                "actions": ["写一个新世界状态画面。"],
                "connects": ["高潮", "主题"],
            },
            {
                "label": "ch16",
                "file": "ch16-principle-of-antagonism.md",
                "title": "对抗力量原则",
                "route": "冲突太弱、阻力不够。",
                "core": "故事能量取决于对抗力量的深度。阻力越有层次，人物选择越有意义。",
                "methods": [{"name": "四层阻力", "use": "加深冲突", "how": "内在、人际、社会、环境四层逐步升级。"}],
                "concepts": {"对抗力量": "阻碍欲望实现的一切力量。"},
                "cases": ["一个业主的装修故事不只和工长冲突，也和预算、家庭、合同和自己的幻想冲突。"],
                "anti": ["只有表面敌人，没有内在矛盾。"],
                "actions": ["列出四层阻力。"],
                "connects": ["进展纠葛", "危机"],
            },
            {
                "label": "ch17",
                "file": "ch17-exposition.md",
                "title": "解说",
                "route": "背景信息太硬、信息倾倒。",
                "core": "解说必须被戏剧化，嵌入冲突、行动和发现，而不是停下来讲资料。",
                "methods": [{"name": "信息戏剧化", "use": "处理背景", "how": "让信息在人物想要某物、遭遇阻力时被迫显露。"}],
                "concepts": {"解说": "观众理解故事所需的背景信息。"},
                "cases": ["不要介绍合同条款，写人物因为条款付出代价。"],
                "anti": ["开篇堆设定。"],
                "actions": ["把一个说明段改成冲突场景。"],
                "connects": ["场景设计", "信息释放"],
            },
            {
                "label": "ch18",
                "file": "ch18-problems-and-solutions.md",
                "title": "问题与解决方案",
                "route": "改写卡住、结构漏洞。",
                "core": "故事问题要回到结构层解决，而不是只靠润色语言。",
                "methods": [{"name": "结构性改写", "use": "故事不好看", "how": "先查欲望、阻力、转折、价值，再改对白和风格。"}],
                "concepts": {"改写": "重新组织故事力量线。"},
                "cases": ["如果读者不关心，不是句子不美，而是价值和代价不清。"],
                "anti": ["只修辞，不修结构。"],
                "actions": ["按四问重诊故事。"],
                "connects": ["场景分析", "高潮"],
            },
            {
                "label": "ch19",
                "file": "ch19-writers-method.md",
                "title": "作家的方法",
                "route": "建立创作流程和改写习惯。",
                "core": "创作不是等灵感，而是持续研究、设计、写作、分析和改写的工作方法。",
                "methods": [{"name": "从内到外写作", "use": "创作流程", "how": "先理解人物欲望和价值，再写外部行动。"}],
                "concepts": {"作家方法": "把灵感转成作品的工作流。"},
                "cases": ["商业写作也需要先设计结构，再追求语言漂亮。"],
                "anti": ["没有结构就追求金句。"],
                "actions": ["建立故事卡片和场景表。"],
                "connects": ["写作流程", "改写"],
            },
        ],
    },
    {
        "slug": "zeno-yang-startup-complete-guide",
        "title": "从零开始学创业大全集",
        "display_title": "zeno-从零开始学创业大全集-阳飞扬",
        "original": "0120从零开始学创业大全集超值白金版阳飞扬(1).txt",
        "author": "阳飞扬",
        "type": "创业准备、团队、商机、商业模式、融资、经营、营销、危机管理",
        "source": r"I:\赞诺【电子书】\00-Inbox\0120从零开始学创业大全集超值白金版阳飞扬(1).txt",
        "extract_note": "Use local plain-text source plus existing AI notes. The source has explicit ten-part structure and repeated ToC.",
        "description": "Apply Yang Feiyang's startup complete-guide frameworks. Use when planning a new business, validating opportunities, building teams, choosing business models, writing business plans, raising funds, managing operations, marketing products, handling crises, or designing a small-business action checklist.",
        "what_solves": "把一本创业全流程手册转成创业前检查、机会判断、商业模式设计、现金流管理、团队制度、营销增长和危机处理的可调用工具箱。",
        "good_for": [
            "普通人从想法进入可验证生意前做系统准备。",
            "一人公司用低成本方式做市场调研、定位和现金流预演。",
            "创业者梳理团队、合伙、融资、营销和危机管理。",
            "把创业冲动转成计划、表格、访谈和行动清单。",
        ],
        "not_for": [
            "把创业当成热血冒险或追逐风口。",
            "替代法律、税务、融资协议和行业合规建议。",
            "直接照搬传统企业流程到极小型项目。",
        ],
        "workflow": [
            "创业准备/适合做什么: 先读 `references/cheatsheet.md` 的能力圈和现金流规则。",
            "找机会/定位市场: 读 `references/chapters/ch03-opportunity-capture.md` 和 `patterns.md`。",
            "设计商业模式/计划书: 读 ch04、ch05，再输出一页商业计划。",
            "团队/合伙/管理: 读 ch02、ch07，先做权责和退出机制。",
            "营销/成长/危机: 读 ch08、ch09，给出可执行干预方案。",
        ],
        "routing": [
            "`references/overview.md` - 快速理解本书作为创业全流程地图的价值。",
            "`references/source-card.md` - 来源、适用边界和抽取说明。",
            "`references/chapter-index.md` - 十篇结构和主题路由。",
            "`references/cheatsheet.md` - 创业前决策规则、现金流默认值和风险嗅觉。",
            "`references/patterns.md` - 市场调研、商业模式、计划书、融资和危机处理方法。",
            "`references/glossary.md` - 创业术语表。",
            "`references/chapters/` - 十篇拆解，按问题加载。",
        ],
        "triggers": [
            "我想创业，但不知道适不适合。",
            "帮我做一个低成本创业验证计划。",
            "这个项目商业模式怎么设计？",
            "合伙创业要注意什么？",
            "帮我写一页商业计划书。",
        ],
        "principles": [
            "先熟悉领域，再谈风口。",
            "先现金流压力测试，再扩张。",
            "先市场事实，再产品想象。",
            "先制度化合伙，再讲情义。",
            "先活下来，再追求规模。",
        ],
        "overview": "《从零开始学创业大全集》不是单点技巧书，而是一张创业全流程地图。它从创业准备、团队建设、商机捕捉、商业模式、商业计划书、融资、经营管理、营销成长、危机干预到企业继承扩张，提醒创业者把生意当作可设计、可验证、可管理的系统。对一人公司尤其重要的是：不要用激情替代市场调研，不要用账面利润替代现金流，不要用亲友情义替代制度。",
        "core_frameworks": [
            "不熟不做: 先在能力圈、资源圈和客户理解交集里找项目。",
            "现金为王: 利润不是生存，现金流断裂才是死亡。",
            "市场调研: 用访谈、竞品、价格、渠道和环境事实替代脑补。",
            "目标市场定位: 明确服务谁、解决什么痛点、凭什么选择你。",
            "商业计划书: 把公司先在纸上开一遍，提前暴露风险。",
            "合伙制度化: 权责利、退出、财务和保密先写清楚。",
        ],
        "capabilities": [
            "创业前可行性体检。",
            "一页商业计划书生成。",
            "90 天现金流压力测试。",
            "合伙人风险清单。",
            "营销与危机处理行动方案。",
        ],
        "topics": {
            "不熟不做": "ch01, ch03",
            "现金流": "ch01, ch07, ch09",
            "市场调研": "ch03, ch04",
            "商业模式": "ch04, ch05",
            "商业计划书": "ch05, ch06",
            "融资": "ch06",
            "团队合伙": "ch02, ch07",
            "营销成长": "ch08",
            "危机管理": "ch09",
            "继承扩张": "ch10",
        },
        "glossary": [
            ("创业准备", "进入项目前对动机、能力、资源、风险和现金流的系统盘点。"),
            ("不熟不做", "优先选择自己有经验、客户理解、人脉或供应链认知的领域。"),
            ("能力圈", "创业者真正理解并能持续行动的知识、技能和资源边界。"),
            ("市场调研", "通过客户、竞品、价格、渠道和环境信息验证需求真实性。"),
            ("目标市场定位", "明确服务对象、场景、痛点、差异和心智位置。"),
            ("商业模式", "创造价值、传递价值、获得收入并控制风险的结构。"),
            ("商业计划书", "把战略、产品、市场、团队、财务和风险写成可讨论方案。"),
            ("融资", "用外部资金换取项目发展速度，但同时承担约束和稀释。"),
            ("现金为王", "企业生死首先取决于现金流能否覆盖支出和不确定性。"),
            ("合伙人管理", "用权责利、退出机制和制度保护合作关系。"),
            ("危机干预", "在经营风险暴露时快速识别原因、止血并重建信任。"),
        ],
        "patterns": [
            {
                "name": "能力圈创业筛选",
                "when": "用户有多个创业想法，不知道先做哪个。",
                "steps": [
                    "列出自己熟悉的三个行业、三类客户、三种可出售能力。",
                    "标记每个想法需要的供应链、获客、交付和合规能力。",
                    "删除完全陌生且需要重资产试错的项目。",
                    "优先选择能在 30 天内访谈客户、做样品或预售的方向。",
                ],
                "tradeoff": "熟悉领域未必性感，但能减少信息差学费。",
            },
            {
                "name": "一页商业计划预演",
                "when": "项目还停留在想法，需要快速判断是否值得推进。",
                "steps": [
                    "写清客户、痛点、产品、价格、渠道、成本、收入、风险。",
                    "把最不确定的三项标红。",
                    "为每项不确定性设计一个最低成本验证动作。",
                    "只在验证通过后投入更大预算。",
                ],
                "tradeoff": "一页计划不追求完美，只用于暴露关键假设。",
            },
            {
                "name": "90 天现金流压力测试",
                "when": "准备投入、扩张、招聘或进货。",
                "steps": [
                    "列出未来 90 天固定支出、变动支出和最低生活费。",
                    "估计保守收入而不是乐观收入。",
                    "计算没有新增收入时能撑多久。",
                    "设置停止线: 现金低于安全垫就暂停扩张。",
                ],
                "tradeoff": "会让扩张更慢，但能避免账面赚钱、现金断裂。",
            },
        ],
        "decision_rules": [
            {"when": "一个项目你完全不懂行业", "do": "先做访谈和小额试单，不先重投入", "why": "避免用外行身份给内行交学费"},
            {"when": "现金只能撑不到 3 个月", "do": "优先收款、压成本、延迟扩张", "why": "现金流断裂比增长慢更危险"},
            {"when": "合伙人只谈愿景不谈退出", "do": "暂停合作，先写权责利和退出条款", "why": "制度保护信任"},
            {"when": "用户说喜欢但不付钱", "do": "降低样品成本并做预售测试", "why": "购买行为比口头好评更真实"},
        ],
        "smells": [
            "只说市场很大，不知道第一批客户是谁。",
            "只算利润，不算回款周期。",
            "合伙靠感情，财务靠口头。",
            "一上来租办公室、招团队、囤库存。",
            "把营销理解为吆喝，而不是定位和信任。",
        ],
        "defaults": [
            "默认先做 10 个客户访谈。",
            "默认先做最小可售版本，不做完美产品。",
            "默认保留 90 天生存现金。",
            "默认合伙先写退出机制。",
        ],
        "chapters": [
            {
                "label": "ch01",
                "file": "ch01-startup-preparation.md",
                "title": "创业的准备",
                "route": "判断是否适合创业、做什么、如何准备资源。",
                "core": "创业不是冲动开局，而是先评估动机、能力、资源、风险和现金流。小白最该先问的不是“什么最赚钱”，而是“我在哪个领域少交学费”。",
                "methods": [
                    {"name": "创业前五问", "use": "决定是否启动项目前", "how": "问动机、能力圈、客户、现金安全垫、失败承受力。"},
                    {"name": "不熟不做", "use": "筛选行业和项目", "how": "优先选择有经验、有人脉、有客户理解或能快速学习的方向。"},
                ],
                "concepts": {"创业准备": "项目启动前的系统盘点。", "能力圈": "你真正懂并能执行的边界。"},
                "cases": ["适合一人公司的例子: 从自己服务过的客户问题中找产品，而不是追逐陌生风口。"],
                "anti": ["把辞职、租办公室、注册公司误当成创业本身。", "只看行业利润，不看自身资源。"],
                "actions": ["列出三个熟悉行业。", "访谈 10 个潜在客户。", "做 90 天现金安全表。"],
                "connects": ["ch03 商机捕捉", "ch04 商业模式", "能力圈"],
            },
            {
                "label": "ch02",
                "file": "ch02-startup-team.md",
                "title": "创业团队：一个好汉三个帮",
                "route": "处理合伙人、员工、顾问和外部资源。",
                "core": "创业者不能靠一个人补齐所有短板，但团队不是越多人越好，而是权责利清楚、能力互补、目标一致。",
                "methods": [
                    {"name": "合伙人四项检查", "use": "合伙前", "how": "查价值观、能力互补、出资出力、退出机制。"},
                    {"name": "制度替代情义", "use": "亲友合伙或早期团队", "how": "把财务、岗位、决策权和分红写成文档。"},
                ],
                "concepts": {"创业团队": "补足能力短板的合作系统。", "合伙人管理": "用规则保护关系。"},
                "cases": ["亲友合伙最容易在赚钱或亏钱时暴露分歧，所以要提前写清退出。"],
                "anti": ["因为关系好就默认适合合伙。", "只按股份分配，不按贡献和责任约束。"],
                "actions": ["写一页合伙协议草案。", "列出每个人的不可替代贡献。", "设定决策机制。"],
                "connects": ["ch07 日常经营", "契约精神", "组织管理"],
            },
            {
                "label": "ch03",
                "file": "ch03-opportunity-capture.md",
                "title": "捕捉商机：只要用心，无处不在",
                "route": "发现需求、做市场调研、判断机会。",
                "core": "商机不是灵感，而是需求、支付能力、时机、竞争和自身资源匹配后的结果。",
                "methods": [
                    {"name": "需求事实五维", "use": "判断商机真假", "how": "看痛点频率、付费意愿、替代方案、触达渠道、趋势时机。"},
                    {"name": "先访谈后产品", "use": "防止闭门造车", "how": "访谈客户真实场景，记录原话和购买顾虑。"},
                ],
                "concepts": {"市场调研": "用事实替代想象。", "时机": "市场教育和基础设施是否成熟。"},
                "cases": ["正确的事太早做也会失败，先进理念需要成熟环境承接。"],
                "anti": ["把自己的痛点当所有人的痛点。", "只问朋友喜不喜欢，不问是否付费。"],
                "actions": ["访谈 10 人。", "整理 3 个竞品。", "写出客户购买前的替代方案。"],
                "connects": ["ch04 商业模式", "定位理论", "MVP"],
            },
            {
                "label": "ch04",
                "file": "ch04-business-model.md",
                "title": "商业模式：挖掘创业成功的利润种子",
                "route": "设计价值、收入、成本和资源整合方式。",
                "core": "商业模式不是赚钱口号，而是价值创造、传递、收费和风险控制的结构。",
                "methods": [
                    {"name": "商业模式四格", "use": "梳理项目结构", "how": "客户价值、交付资源、收费方式、风险约束各写一句。"},
                    {"name": "小生意复利检查", "use": "判断能否长期做", "how": "看是否可复购、可推荐、可标准化、可积累资产。"},
                ],
                "concepts": {"商业模式": "持续获利的结构。", "资源整合": "把人、货、钱、渠道组织成价值链。"},
                "cases": ["小生意不是低级生意，低成本验证和口碑复利是优势。"],
                "anti": ["只会卖一次，没有复购和信任积累。", "收入模型依赖单一大客户。"],
                "actions": ["画出客户-产品-渠道-收入链路。", "找出最高风险假设。", "设计一次小额成交测试。"],
                "connects": ["ch05 商业计划书", "系统思维", "现金流"],
            },
            {
                "label": "ch05",
                "file": "ch05-business-plan.md",
                "title": "商业计划书：把公司在纸上开起来",
                "route": "需要计划书、项目路演或内部战略梳理。",
                "core": "商业计划书的价值不是装饰，而是把公司先在纸上运行一遍，发现逻辑漏洞。",
                "methods": [
                    {"name": "一页计划书", "use": "小项目快速预演", "how": "写客户、问题、方案、竞争、价格、渠道、成本、收入、风险、下一步。"},
                    {"name": "投资人视角审查", "use": "融资或合作前", "how": "检查市场规模、团队能力、财务假设和退出路径。"},
                ],
                "concepts": {"商业计划书": "项目的纸面模拟器。", "财务假设": "收入、成本、毛利和现金周期的前提。"},
                "cases": ["计划书不是越厚越好，越能暴露关键假设越有用。"],
                "anti": ["只写愿景，不写现金、渠道和风险。", "用漂亮 PPT 遮住验证不足。"],
                "actions": ["写一页计划。", "把三项最不确定假设标红。", "为每项设计验证动作。"],
                "connects": ["ch06 融资", "预演思维", "项目管理"],
            },
            {
                "label": "ch06",
                "file": "ch06-financing.md",
                "title": "融资有道：获得投资人的青睐",
                "route": "需要融资、找投资人或判断是否该拿钱。",
                "core": "融资不是免费资源，而是用未来约束换当前速度。先证明项目值得钱，再决定是否需要钱。",
                "methods": [
                    {"name": "融资必要性判断", "use": "想融资时", "how": "判断资金是否解决关键瓶颈，而不是掩盖商业模式不成立。"},
                    {"name": "投资人关切表", "use": "准备路演", "how": "回答市场、团队、产品、增长、财务、风险、退出。"},
                ],
                "concepts": {"融资": "外部资金与约束的交换。", "投资人": "用风险收益逻辑评估项目的人。"},
                "cases": ["能自我造血的小项目不一定要融资，融资会改变节奏和目标。"],
                "anti": ["把融到钱当成功。", "没有验证就讲宏大市场。"],
                "actions": ["写清资金用途。", "计算不融资能否活下去。", "准备 10 个投资人会问的问题。"],
                "connects": ["ch05 商业计划书", "现金流", "风险投资"],
            },
            {
                "label": "ch07",
                "file": "ch07-operations-management.md",
                "title": "日常经营：完善的管理策略",
                "route": "处理日常管理、制度、财务、人事和流程。",
                "core": "经营不是开张后的杂事，而是让企业每天稳定创造价值的系统。",
                "methods": [
                    {"name": "经营四账", "use": "小公司管理", "how": "客户账、现金账、交付账、风险账每周更新。"},
                    {"name": "流程化交付", "use": "服务质量不稳定时", "how": "把获客、成交、交付、回访、复购写成步骤。"},
                ],
                "concepts": {"日常经营": "企业持续运转的管理活动。", "流程": "降低个人依赖的步骤化系统。"},
                "cases": ["一人公司也需要经营账，不是只有大公司才需要管理。"],
                "anti": ["只关注新增客户，不跟踪交付和回款。", "所有事情都靠老板记忆。"],
                "actions": ["建立四账表。", "每周复盘一次现金和交付。", "写出一个标准交付流程。"],
                "connects": ["ch02 团队", "ch09 危机", "运营管理"],
            },
            {
                "label": "ch08",
                "file": "ch08-growth-and-sales.md",
                "title": "成长有道：成功的企业就是把产品卖出去",
                "route": "做营销、销售、品牌、渠道和增长。",
                "core": "企业成长离不开销售，但销售不是单纯吆喝，而是定位、信任、渠道和持续交付共同作用。",
                "methods": [
                    {"name": "定位一句话", "use": "用户听不懂你做什么", "how": "我帮助谁，在什么场景，解决什么痛点，为什么选我。"},
                    {"name": "销售漏斗检查", "use": "增长卡住时", "how": "看曝光、信任、咨询、成交、复购哪个环节断了。"},
                ],
                "concepts": {"营销": "让目标客户理解并信任价值。", "销售": "促成价值交换。"},
                "cases": ["小公司不一定要大广告，先让目标客户清楚知道你解决什么问题。"],
                "anti": ["内容很多但没有指向一个明确产品。", "只追流量，不追成交和复购。"],
                "actions": ["写一句话定位。", "列出 3 个获客渠道。", "设计一个复购或转介绍动作。"],
                "connects": ["定位理论", "ch04 商业模式", "内容营销"],
            },
            {
                "label": "ch09",
                "file": "ch09-crisis-intervention.md",
                "title": "危机干预：扭转大败局",
                "route": "现金流、客户投诉、团队冲突、经营下滑时。",
                "core": "危机处理的顺序是先止血、再找因、再恢复信任、再重建系统。",
                "methods": [
                    {"name": "危机四步", "use": "经营出问题时", "how": "止血、诊断、沟通、重建。"},
                    {"name": "现金优先级", "use": "资金紧张时", "how": "先保交付、保核心团队、保回款，再谈扩张。"},
                ],
                "concepts": {"危机干预": "对风险暴露后的快速修复。", "止血": "先阻止损失继续扩大。"},
                "cases": ["账面利润无法解决现金断裂，危机时优先看账户和回款。"],
                "anti": ["危机时继续扩张。", "只安抚情绪，不改系统。"],
                "actions": ["列出最急的 3 个风险。", "设计 72 小时止血动作。", "向关键客户/伙伴沟通计划。"],
                "connects": ["ch07 经营", "现金流", "反脆弱"],
            },
            {
                "label": "ch10",
                "file": "ch10-succession-and-expansion.md",
                "title": "企业的继承与扩大",
                "route": "考虑扩张、复制、传承或长期经营。",
                "core": "扩张不是把规模做大，而是让产品、团队、流程、品牌和现金流能承受更大复杂度。",
                "methods": [
                    {"name": "扩张承载力检查", "use": "准备开新渠道、新门店或新产品", "how": "检查现金、团队、流程、供应链和质量控制。"},
                    {"name": "可复制资产清单", "use": "想让业务摆脱个人依赖", "how": "沉淀 SOP、案例、品牌、客户库、培训材料。"},
                ],
                "concepts": {"扩张": "复杂度上升的经营阶段。", "继承": "企业能力从个人转移到系统。"},
                "cases": ["能复制的不只是产品，还有信任、流程和人才培养。"],
                "anti": ["单点成功后立刻复制，忽略质量和现金。", "老板能力没有系统化就盲目招人。"],
                "actions": ["列出可复制资产。", "做扩张风险评分。", "先试一个小范围复制点。"],
                "connects": ["ch07 经营", "流程化", "长期主义"],
            },
        ],
    },
    {
        "slug": "zeno-value-online-course-business",
        "title": "价值：把你的价值打造成破亿的线上事业",
        "display_title": "zeno-价值-线上课程事业-小船",
        "original": "《價值》把你的價值打造成破僟的網路事業.txt",
        "author": "小船",
        "type": "知识付费、线上课程、个人品牌、预售测试、高单价、长青流量",
        "source": r"I:\赞诺【电子书】\00-Inbox\《價值》把你的價值打造成破僟的網路事業.txt",
        "extract_note": "Use local plain-text source plus existing AI notes. The source is short and ToC is partially noisy, so chapters are normalized by the author's course-building workflow.",
        "description": "Apply Xiao Chuan's online-course business frameworks. Use when turning personal skills into paid knowledge products, choosing course positioning, validating via presale, pricing high-ticket courses, writing sales content, screening students, building evergreen traffic, or designing a solo knowledge-business funnel.",
        "what_solves": "把个人经验、技能和认知差转成可售课程/数字产品，并用预售、高单价、销售内容和长青流量形成一人公司现金流。",
        "good_for": [
            "把可教能力包装成线上课程。",
            "做知识付费选题、定位、预售和定价。",
            "从粉丝少、经验少的状态启动第一门课。",
            "设计高信任、高筛选、高交付的知识产品。",
        ],
        "not_for": [
            "割韭菜式承诺暴富。",
            "把课程时长当价值。",
            "没有验证就闷头录完整课程。",
            "替代平台政策、广告合规或税务建议。",
        ],
        "workflow": [
            "想做知识付费但不知道教什么: 读 `cheatsheet.md` 的价值公式和问题筛选。",
            "需要课程定位: 读 ch03 和 `patterns.md` 的课程定位画布。",
            "担心没人买: 读 ch04 的预售测试。",
            "不会定价/销售: 读 ch05、ch06。",
            "想长期增长: 读 ch08 的长青流量和单一爆品。",
        ],
        "routing": [
            "`references/overview.md` - 快速理解价值公式和线上课程路径。",
            "`references/source-card.md` - 来源、适用边界和抽取说明。",
            "`references/chapter-index.md` - 从价值挖掘到长期发展的话题路由。",
            "`references/cheatsheet.md` - 课程定位、预售、定价、销售内容决策表。",
            "`references/patterns.md` - 可直接套用的做课卖课 SOP。",
            "`references/glossary.md` - 知识付费术语表。",
            "`references/chapters/` - 按具体问题加载章节。",
        ],
        "triggers": [
            "我有什么可以做成课？",
            "帮我设计一门高单价课程。",
            "怎么先卖课再做课？",
            "粉丝少能不能做知识付费？",
            "帮我写课程销售页。",
        ],
        "principles": [
            "收入 = 价值 × 数量。",
            "先卖课验证，再制作完整课程。",
            "你不需要是顶尖专家，只需比目标用户领先一步并能带来结果。",
            "价格按问题价值定，不按课时长短定。",
            "长期只围绕一个单一爆品积累长青流量。",
        ],
        "overview": "《价值》把线上课程视为普通人突破时间换钱的一种数字产品路径。它的核心不是“人人都去卖课”，而是先识别自己能解决的高价值问题，再通过定位、预售、定价、销售内容、课程制作和长青流量建立可持续知识业务。对一人公司而言，本书提供了从技能到现金流的低成本路径。",
        "core_frameworks": [
            "价值公式: 收入来自问题价值与触达人数的乘积。",
            "领先一步原则: 不必成为行业第一，只要能帮助更早阶段的人。",
            "课程定位: 我帮助谁，从什么状态到什么结果。",
            "预售测试: 正式制作前先验证成交意愿。",
            "高单价定价: 按用户结果、损失避免和承诺度定价。",
            "长青流量: 用持续可搜索、可推荐、可复利的内容积累信任。",
        ],
        "capabilities": [
            "课程选题诊断。",
            "预售页/销售页结构生成。",
            "高单价定价评估。",
            "知识付费产品漏斗设计。",
            "长青内容选题规划。",
        ],
        "topics": {
            "价值公式": "ch01",
            "知识付费": "ch02, ch03",
            "课程定位": "ch03",
            "预售测试": "ch04",
            "课程定价": "ch05",
            "成交学员": "ch06",
            "制作课程": "ch07",
            "长青流量": "ch08",
            "常见疑问": "ch09",
        },
        "glossary": [
            ("价值公式", "收入 = 可解决问题的价值 × 能触达和成交的人数。"),
            ("知识付费", "把经验、知识、技能和方法包装成帮助用户更快解决问题的产品。"),
            ("线上课程", "可低成本复制交付的知识型数字产品。"),
            ("课程定位", "明确目标用户、当前痛点、期望结果和差异化承诺。"),
            ("预售测试", "在完整制作前用最小销售材料验证付费意愿。"),
            ("高单价定价", "按用户收益、损失避免和交付价值定价，而非按课时定价。"),
            ("销售内容", "回答用户是谁、问题是什么、为什么可信、为什么现在买、风险如何降低。"),
            ("长青流量", "长期持续带来搜索、推荐和信任积累的内容资产。"),
            ("用户筛选", "通过价格、文案和门槛选择更适合交付成功的人。"),
            ("单一爆品", "先把一门核心课程打透，再扩展产品线。"),
        ],
        "patterns": [
            {
                "name": "课程定位一句话",
                "when": "用户想做课但表达模糊。",
                "steps": [
                    "写出目标用户: 他们是谁、处在哪个阶段。",
                    "写出痛点: 他们现在卡在哪里。",
                    "写出结果: 学完后能达成什么具体改变。",
                    "写出差异: 为什么你更懂这一类人。",
                    "合成句式: 我帮助 A 从 B 状态到 C 结果，靠 D 方法。",
                ],
                "tradeoff": "定位越窄，早期成交越容易；但要避免窄到没有支付能力。",
            },
            {
                "name": "先卖课再做课",
                "when": "担心花几个月录课后没人买。",
                "steps": [
                    "写一页课程说明，包含对象、结果、模块、价格、名额。",
                    "找 10-30 个潜在用户一对一沟通。",
                    "用定金、早鸟价或小班直播验证成交。",
                    "根据首批学员反馈制作课程。",
                ],
                "tradeoff": "交付压力更高，但避免闭门造课。",
            },
            {
                "name": "高单价价值证明",
                "when": "用户不敢定高价。",
                "steps": [
                    "计算课程帮助用户赚到、节省或避免损失的价值。",
                    "展示路径、案例、陪跑、反馈和风险逆转。",
                    "用价格筛选执行力和承诺度。",
                    "如果无法证明结果，先降低承诺或改成小产品。",
                ],
                "tradeoff": "高价会缩小客群，但提高承诺、交付空间和案例质量。",
            },
        ],
        "decision_rules": [
            {"when": "你还没验证需求", "do": "先做预售或访谈，不录完整课程", "why": "真实付费比口头兴趣可靠"},
            {"when": "你担心自己不够专家", "do": "选择比你早一阶段的人群", "why": "他们需要路径和陪伴，不一定需要权威"},
            {"when": "价格只能按课时解释", "do": "重写结果和价值证明", "why": "知识付费卖的是效率和结果"},
            {"when": "内容吸粉但不成交", "do": "把内容统一指向单一爆品和同一痛点", "why": "泛流量难以承接收入"},
        ],
        "smells": [
            "课程主题像百科，不像解决一个痛点。",
            "先录几十节课，没有一个人付定金。",
            "低价吸引来大量不执行用户。",
            "销售页只写模块，不写结果和信任。",
            "每天换主题，无法积累长青流量。",
        ],
        "defaults": [
            "默认先做一门单一爆品。",
            "默认先预售，再录制。",
            "默认用案例、陪跑和反馈提高客单价。",
            "默认内容连续 10 条指向同一痛点。",
        ],
        "chapters": [
            {
                "label": "ch01",
                "file": "ch01-value-formula.md",
                "title": "你永远不知道你多有价值",
                "route": "挖掘个人价值、理解收入公式。",
                "core": "赚钱不是神秘能力，而是提供价值后的结果。你能解决的问题越痛、能帮助的人越多，收入天花板越高。",
                "methods": [
                    {"name": "价值资产盘点", "use": "不知道自己能卖什么", "how": "列技能、经验、踩坑、案例、资源、认知差。"},
                    {"name": "痛点价值排序", "use": "筛选课程主题", "how": "按痛苦强度、频率、付费意愿、结果价值排序。"},
                ],
                "concepts": {"价值": "帮助别人解决问题的能力。", "收入": "价值与触达人群的乘积。"},
                "cases": ["比目标用户领先一步的人，往往更懂他们现在卡在哪里。"],
                "anti": ["低估自己的经验。", "把知识点当产品，而不是把问题解决当产品。"],
                "actions": ["列 10 个你解决过的问题。", "标出最痛、最愿付费的 3 个。", "选择一个做访谈。"],
                "connects": ["课程定位", "一人公司", "杠杆"],
            },
            {
                "label": "ch02",
                "file": "ch02-knowledge-business-track.md",
                "title": "认识知识付费赛道",
                "route": "判断是否适合做知识付费。",
                "core": "知识付费长期存在，因为用户买的不是信息，而是路径、筛选、反馈和效率。",
                "methods": [
                    {"name": "适配度检查", "use": "判断是否适合做课", "how": "看是否有可复用方法、真实案例、目标人群和交付意愿。"},
                    {"name": "效率产品化", "use": "解释课程价值", "how": "把课程定义为减少试错成本的路径。"},
                ],
                "concepts": {"知识付费": "购买被整理过的解决路径。", "超级个体": "用数字产品和流量杠杆放大个人价值。"},
                "cases": ["学员不是不会搜索，而是缺路径、反馈和判断。"],
                "anti": ["把知识付费等同割韭菜。", "没有结果承诺却包装成万能课。"],
                "actions": ["写出课程能节省用户什么成本。", "定义不适合购买的人。", "列出交付成功条件。"],
                "connects": ["ch01 价值公式", "个人品牌", "数字产品"],
            },
            {
                "label": "ch03",
                "file": "ch03-course-positioning.md",
                "title": "课程定位",
                "route": "确定教谁、教什么、到什么结果。",
                "core": "定位是知识付费的地基。没有清晰用户和结果，流量、课程和销售页都会发散。",
                "methods": [
                    {"name": "从 A 到 B 定位", "use": "写课程卖点", "how": "我帮助谁，从什么痛苦状态，到什么具体结果。"},
                    {"name": "对标市场扫描", "use": "判断主题是否有需求", "how": "看已有课程、用户评论、价格带、差评和空白点。"},
                ],
                "concepts": {"课程定位": "目标用户、痛点、结果和差异化。", "对标": "从已有市场中找需求证据。"},
                "cases": ["小而精准的课，比大而全的知识合集更容易成交。"],
                "anti": ["面向所有人。", "课程名只有知识领域，没有结果承诺。"],
                "actions": ["写 3 个定位句。", "找 5 个对标产品。", "提炼差异化切口。"],
                "connects": ["ch04 预售", "定位理论", "市场细分"],
            },
            {
                "label": "ch04",
                "file": "ch04-presale-test.md",
                "title": "测试产品",
                "route": "正式制作前验证是否有人买。",
                "core": "最安全的做课方式不是先做完再卖，而是先用最小销售材料测试真实成交。",
                "methods": [
                    {"name": "预售测试", "use": "验证课程需求", "how": "用一页说明、早鸟名额、定金和沟通验证购买。"},
                    {"name": "首批学员共创", "use": "课程内容不确定", "how": "用直播/小班交付，根据反馈完善录播和资料。"},
                ],
                "concepts": {"预售": "完整制作前的付费验证。", "最小可售产品": "能让用户理解并愿意付费的最小方案。"},
                "cases": ["先卖课再做课，可以避免花几个月做没人买的内容。"],
                "anti": ["把完美录制当启动条件。", "只用点赞收藏判断需求。"],
                "actions": ["写一页预售说明。", "找 10 个潜在用户沟通。", "收定金或预约名额。"],
                "connects": ["MVP", "ch05 定价", "ch06 成交"],
            },
            {
                "label": "ch05",
                "file": "ch05-course-pricing.md",
                "title": "课程定价",
                "route": "设计高单价、价格带和价值证明。",
                "core": "课程价格不由时长决定，而由用户结果、损失避免、交付深度和承诺度决定。",
                "methods": [
                    {"name": "价值锚定", "use": "解释高价格", "how": "把课程价值与用户收益、节省时间、避免损失连接。"},
                    {"name": "价格筛选", "use": "减少低质量学员", "how": "用价格和申请门槛筛选执行力。"},
                ],
                "concepts": {"高单价": "用高价值结果支撑的价格策略。", "用户筛选": "选择更能成功的人。"},
                "cases": ["低价可能带来低承诺学员，反而提高交付成本。"],
                "anti": ["因为不自信就低价。", "只卖课时，不卖结果。"],
                "actions": ["计算结果价值。", "写出价格理由。", "设计风险逆转或保障。"],
                "connects": ["ch06 成交", "高客单价销售", "信任"],
            },
            {
                "label": "ch06",
                "file": "ch06-enroll-students.md",
                "title": "成交学员",
                "route": "写销售页、成交话术、筛选学员。",
                "core": "销售内容要回答用户为什么是我、为什么是这个问题、为什么现在、为什么你可信、风险如何降低。",
                "methods": [
                    {"name": "销售页六问", "use": "写销售页", "how": "用户、痛点、结果、方法、证据、行动。"},
                    {"name": "异议处理", "use": "用户犹豫时", "how": "分别处理不信你、不信自己、不信方法、不信现在。"},
                ],
                "concepts": {"销售内容": "把价值、信任和行动理由组织起来。", "成交": "用户愿意承担成本换结果。"},
                "cases": ["强销售不是压迫，而是帮适合的人做决定，同时劝退不适合的人。"],
                "anti": ["只罗列模块。", "承诺过度，无法交付。"],
                "actions": ["写销售页首屏。", "列 10 个异议。", "设计筛选问题。"],
                "connects": ["ch05 定价", "文案", "销售漏斗"],
            },
            {
                "label": "ch07",
                "file": "ch07-make-the-course.md",
                "title": "制作课程",
                "route": "搭建课程结构、交付体验和学员成果。",
                "core": "课程不是知识堆叠，而是把用户从当前状态带到目标状态的一条路径。",
                "methods": [
                    {"name": "结果倒推课程大纲", "use": "设计课程模块", "how": "从最终结果倒推关键里程碑、作业、反馈和案例。"},
                    {"name": "行动型交付", "use": "提高完课和成果", "how": "每节课配一个动作、模板或检查点。"},
                ],
                "concepts": {"课程交付": "帮助用户产生实际改变的过程。", "作业反馈": "把知道变成做到的机制。"},
                "cases": ["好课程像治疗方案，不像资料仓库。"],
                "anti": ["课程越长越好。", "只有录播没有行动和反馈。"],
                "actions": ["写 5-8 个模块。", "每模块设计一个作业。", "安排反馈节点。"],
                "connects": ["教学设计", "ch08 长期发展", "案例库"],
            },
            {
                "label": "ch08",
                "file": "ch08-evergreen-growth.md",
                "title": "长远发展",
                "route": "做长青流量、个人品牌和单一爆品。",
                "core": "知识业务的长期增长来自持续围绕同一痛点输出，让内容、案例、口碑和产品形成复利。",
                "methods": [
                    {"name": "长青内容飞轮", "use": "做持续获客", "how": "围绕同一用户痛点持续发布可搜索、可转发、可复用内容。"},
                    {"name": "单一爆品深挖", "use": "防止产品线发散", "how": "先把一门课打磨到案例和转介绍稳定，再扩展。"},
                ],
                "concepts": {"长青流量": "长期持续产生信任的内容资产。", "单一爆品": "一个打透的核心产品。"},
                "cases": ["小而精准的长期内容，比泛娱乐大流量更适合一人公司变现。"],
                "anti": ["频繁换赛道。", "粉丝多但没有承接产品。"],
                "actions": ["制定 10 条内容选题。", "每条指向同一课程痛点。", "收集学员案例。"],
                "connects": ["个人品牌", "内容营销", "飞轮效应"],
            },
            {
                "label": "ch09",
                "file": "ch09-common-objections.md",
                "title": "知识变现常见疑问",
                "route": "处理不够专业、拖延、怕割韭菜等心理阻碍。",
                "core": "做知识付费的关键不是假装完美，而是诚实界定适合人群、承诺边界和可验证结果。",
                "methods": [
                    {"name": "领先一步自信", "use": "担心不够专业", "how": "选择你真实走过且能帮早期用户跨过的阶段。"},
                    {"name": "反割韭菜边界", "use": "担心伦理问题", "how": "写清不适合谁、不能保证什么、需要学员做什么。"},
                ],
                "concepts": {"承诺边界": "你能负责和不能负责的范围。", "拖延": "常由过度完美和缺乏反馈造成。"},
                "cases": ["透明边界比夸张承诺更能积累长期信任。"],
                "anti": ["为了成交承诺人人有效。", "因为怕批评永远不发布。"],
                "actions": ["写适合/不适合人群。", "做一个 7 天小班测试。", "公开课程边界。"],
                "connects": ["信任", "伦理销售", "ch04 预售"],
            },
        ],
    },
    {
        "slug": "zeno-calvino-invisible-cities",
        "title": "看不见的城市",
        "display_title": "zeno-看不见的城市-卡尔维诺",
        "original": "Le città invisibili",
        "author": "伊塔洛·卡尔维诺",
        "type": "文学、隐喻写作、城市想象、叙事系统、符号学、认知模型",
        "source": r"I:\赞诺【电子书】\00-Inbox\《看不见的城市》-意大利-伊塔洛·卡尔维诺.txt",
        "extract_note": "Use local plain-text source plus existing AI notes. The file appears to include extra appended text after the novel; only Invisible Cities structure is used.",
        "description": "Apply Italo Calvino's Invisible Cities as a metaphor and narrative-design skill. Use when building brand worlds, interpreting cities as mental models, designing symbolic content, using memory/desire/signs/eyes/names/dead/sky/continuous/hidden city lenses, or turning abstract strategy into literary spatial metaphors.",
        "what_solves": "把《看不见的城市》转成叙事、隐喻、品牌世界、内容空间和认知模型设计工具，而不是只讲文学赏析。",
        "good_for": [
            "为个人品牌、产品或社群设计“可进入的世界”。",
            "把抽象观点转成城市、空间、标记和关系隐喻。",
            "分析用户心中的品牌印象和叙事结构。",
            "训练文学化、哲学化、留白式表达。",
        ],
        "not_for": [
            "把小说当作城市规划手册。",
            "强行提炼商业公式，抹掉文学复杂性。",
            "长篇照搬原文。",
        ],
        "workflow": [
            "用户要做品牌/产品叙事: 读 `patterns.md` 的城市即心智模型。",
            "用户要文学化表达: 读 ch01-ch05 的记忆、欲望、标记。",
            "用户要分析不可见结构: 读 ch06-ch09。",
            "用户要处理混乱与希望: 读 ch11 的地狱中的非地狱。",
            "用户问具体概念: 先读 `glossary.md` 和 `chapter-index.md`。",
        ],
        "routing": [
            "`references/overview.md` - 作为叙事系统和隐喻工具的总览。",
            "`references/source-card.md` - 来源、边界和抽取说明。",
            "`references/chapter-index.md` - 城市主题组路由。",
            "`references/cheatsheet.md` - 品牌世界、隐喻写作和内容系统决策规则。",
            "`references/patterns.md` - 城市即心智模型、符号系统、非地狱识别等方法。",
            "`references/glossary.md` - 文学与认知术语表。",
            "`references/chapters/` - 按主题组加载。",
        ],
        "triggers": [
            "帮我把品牌写成一个世界。",
            "用看不见的城市分析我的内容系统。",
            "帮我写一个有隐喻感的产品介绍。",
            "什么是地狱中的非地狱？",
            "如何让用户记住我的个人品牌？",
        ],
        "principles": [
            "不要急着解释一切，保留可进入的空间。",
            "城市不是建筑，是关系、记忆、符号和欲望。",
            "品牌不是信息堆砌，是用户心中的可导航世界。",
            "语言不是现实本身，但会改变现实被看见的方式。",
            "在混乱里识别非地狱，并给它空间。",
        ],
        "overview": "《看不见的城市》通过马可·波罗向忽必烈讲述一座座虚构城市，呈现记忆、欲望、标记、眼睛、名字、亡灵、天空、连续和隐藏结构如何塑造世界。它真正有用的不是城市描写本身，而是让我们学会把现实看成由关系、符号、叙事和不可见结构组成的系统。对内容创作者和一人公司而言，它是一套高级隐喻与品牌世界设计方法。",
        "core_frameworks": [
            "城市即心智模型: 每座城市是一种观察世界的方式。",
            "记忆的城市: 体验由痕迹、事件和回忆构成。",
            "欲望的城市: 人追逐城市，也被欲望塑造。",
            "符号的城市: 用户看见的是意义标记，不只是物品。",
            "不可见结构: 支撑系统的常是关系、规则和秩序。",
            "地狱中的非地狱: 在坏系统里识别并保护尚未被污染的东西。",
        ],
        "capabilities": [
            "品牌世界观设计。",
            "隐喻型文案创作。",
            "内容资产空间化整理。",
            "复杂系统的文学化表达。",
            "希望/混乱主题的深度写作。",
        ],
        "topics": {
            "记忆": "ch01",
            "欲望": "ch02",
            "标记": "ch03",
            "眼睛": "ch04",
            "名字": "ch05",
            "亡灵": "ch06",
            "天空": "ch07",
            "连续": "ch08",
            "隐藏": "ch09",
            "马可与忽必烈": "ch10",
            "地狱中的非地狱": "ch11",
        },
        "glossary": [
            ("看不见的城市", "由虚构城市组成的认知与叙事迷宫。"),
            ("城市即心智模型", "把城市视为观察现实的一种结构，而非地理地点。"),
            ("记忆的城市", "由痕迹、事件和回忆关系组成的空间。"),
            ("欲望的城市", "被追求、幻象和匮乏塑造的城市。"),
            ("符号的城市", "事物作为标记和意义网络存在。"),
            ("名字的城市", "命名如何遮蔽或重塑经验。"),
            ("不可见结构", "真正支撑系统的关系、规则和秩序。"),
            ("叙事即现实", "讲述方式会改变倾听者所理解的世界。"),
            ("地图不是疆域", "模型、语言和地图不等于现实，但会指导行动。"),
            ("地狱中的非地狱", "在糟糕环境中识别并保护仍然有生命力的部分。"),
        ],
        "patterns": [
            {
                "name": "品牌城市地图",
                "when": "用户想让品牌不只是卖点，而是一个可记忆世界。",
                "steps": [
                    "把产品、内容、案例、社群、服务分别映射为城市街区。",
                    "为每个街区定义入口、情绪、标记和用户行动。",
                    "检查街区之间是否形成可游走路径。",
                    "删掉无法贡献世界感的散乱内容。",
                ],
                "tradeoff": "世界感会提升记忆，但过度隐喻会降低购买清晰度。",
            },
            {
                "name": "符号系统审计",
                "when": "用户的品牌资产很多但不统一。",
                "steps": [
                    "列出头像、标题、颜色、口头禅、案例、视觉风格。",
                    "写出每个符号在用户心中指向什么意义。",
                    "删除互相冲突或没有识别度的标记。",
                    "保留能重复出现并承载价值的核心符号。",
                ],
                "tradeoff": "统一符号会增强识别，但需要避免机械模板化。",
            },
            {
                "name": "非地狱识别",
                "when": "用户处在混乱行业、低信任环境或内容焦虑中。",
                "steps": [
                    "承认环境中的地狱部分，而不是美化。",
                    "找出仍然带来清醒、连接、行动和希望的人/事/方法。",
                    "为这些部分建立空间、资源和表达。",
                    "持续扩大非地狱的可见度。",
                ],
                "tradeoff": "不是逃避现实，而是有选择地保护生命力。",
            },
        ],
        "decision_rules": [
            {"when": "品牌只剩功能描述", "do": "加入记忆、场景、符号和关系", "why": "用户记住的是意义空间"},
            {"when": "表达过度解释", "do": "保留留白、图像和隐喻", "why": "参与感来自未被说尽的空间"},
            {"when": "内容散乱像文件夹", "do": "把内容组织成城市地图", "why": "路径比堆积更能形成复访"},
            {"when": "环境像地狱", "do": "识别并保护非地狱部分", "why": "希望需要具体载体"},
        ],
        "smells": [
            "只有概念，没有画面。",
            "只有信息，没有可进入的空间。",
            "符号太多但互不相连。",
            "文案解释完一切，用户没有参与余地。",
            "把混乱写成绝望，没有指出非地狱。",
        ],
        "defaults": [
            "默认先问: 这座城市由什么关系组成？",
            "默认用一个具象空间承载一个抽象观点。",
            "默认保留 20% 留白。",
            "默认为品牌建立 3-5 个可重复符号。",
        ],
        "chapters": [
            {
                "label": "ch01",
                "file": "ch01-cities-and-memory.md",
                "title": "城市和记忆",
                "route": "处理记忆、痕迹、路径依赖和品牌回忆。",
                "core": "城市由记忆的痕迹构成。用户记住的不是事实全集，而是某些反复出现的场景、细节和关系。",
                "methods": [
                    {"name": "记忆锚点", "use": "设计品牌记忆", "how": "选择一个具体画面、物件或场景反复承载核心意义。"},
                    {"name": "痕迹复盘", "use": "分析用户体验", "how": "列出用户接触你后留下的可记忆痕迹。"},
                ],
                "concepts": {"记忆": "经验留下的痕迹和重新组织。", "城市": "由关系和回忆构成的意义空间。"},
                "cases": ["个人品牌可用一个稳定场景、口头禅或案例成为用户记忆入口。"],
                "anti": ["试图让用户记住所有信息。"],
                "actions": ["设计一个记忆锚点。", "整理 5 个用户最可能记住的细节。"],
                "connects": ["符号", "品牌资产", "路径依赖"],
            },
            {
                "label": "ch02",
                "file": "ch02-cities-and-desire.md",
                "title": "城市和欲望",
                "route": "处理用户欲望、投射、消费动机。",
                "core": "欲望让城市变得有吸引力，也会让人被幻象牵引。好的叙事要看见用户真正想成为什么。",
                "methods": [
                    {"name": "欲望反推", "use": "写销售/内容", "how": "从用户想避免的痛苦和想成为的样子反推表达。"},
                    {"name": "幻象校正", "use": "避免虚假承诺", "how": "区分真实结果、身份投射和不切实际幻想。"},
                ],
                "concepts": {"欲望": "用户对结果、身份和逃离痛苦的投射。", "幻象": "未被现实约束的期待。"},
                "cases": ["课程卖点不只是学知识，而是成为更有掌控感的人。"],
                "anti": ["操纵欲望却不给真实路径。"],
                "actions": ["写出用户想逃离什么。", "写出用户想成为谁。"],
                "connects": ["身份叙事", "销售文案", "用户洞察"],
            },
            {
                "label": "ch03",
                "file": "ch03-cities-and-signs.md",
                "title": "城市和标记",
                "route": "处理符号、标识、品牌识别和意义网络。",
                "core": "人看到的不是事物本身，而是事物作为标记指向的意义。品牌资产必须成为稳定符号。",
                "methods": [
                    {"name": "符号盘点", "use": "品牌识别混乱时", "how": "列出所有符号，标注它们指向的意义。"},
                    {"name": "标记压缩", "use": "提高传播效率", "how": "把复杂理念压缩进一个短语、画面或动作。"},
                ],
                "concepts": {"标记": "指向意义的可识别元素。", "符号系统": "多个标记之间的关系网络。"},
                "cases": ["一个稳定标题格式可能比十篇散乱爆文更能建立认知。"],
                "anti": ["符号频繁变化，用户无法识别。"],
                "actions": ["选 3 个核心符号。", "删掉冲突符号。"],
                "connects": ["超级符号", "定位", "内容资产"],
            },
            {
                "label": "ch04",
                "file": "ch04-cities-and-eyes.md",
                "title": "城市和眼睛",
                "route": "处理观看方式、视角、观察力。",
                "core": "同一座城市会因观看方式不同而成为不同现实。创作者的任务是改变用户的看法。",
                "methods": [
                    {"name": "换眼睛写作", "use": "观点平淡时", "how": "从新手、专家、外人、未来自己四个视角重看同一对象。"},
                    {"name": "观察差异化", "use": "内容同质化时", "how": "写别人看不到但用户一看就懂的细节。"},
                ],
                "concepts": {"视角": "观察现实的角度。", "看见": "把被忽略的结构显影。"},
                "cases": ["同一个装修报价，新手看价格，高手看风险结构。"],
                "anti": ["只复述公共观点。"],
                "actions": ["用四个视角重写同一主题。", "找一个被忽略细节。"],
                "connects": ["洞察", "框架效应", "观察力"],
            },
            {
                "label": "ch05",
                "file": "ch05-cities-and-names.md",
                "title": "城市和名字",
                "route": "处理命名、标签、概念遮蔽。",
                "core": "名字能让经验被传播，也会遮蔽真实经验。越熟悉的标签越需要重新观看。",
                "methods": [
                    {"name": "去标签复看", "use": "概念套话太多时", "how": "暂时拿掉行业术语，只描述具体行为和感受。"},
                    {"name": "命名测试", "use": "创造概念或栏目", "how": "看名字是否能准确唤起场景、问题和行动。"},
                ],
                "concepts": {"名字": "把复杂经验固定成可传播对象。", "遮蔽": "标签替代真实观察。"},
                "cases": ["“高端装修”这个名字可能遮蔽真实的预算、生活和交付问题。"],
                "anti": ["用流行词替代洞察。"],
                "actions": ["把一个术语翻译成用户原话。", "为核心方法命名。"],
                "connects": ["命名", "概念设计", "语言校准"],
            },
            {
                "label": "ch06",
                "file": "ch06-cities-and-the-dead.md",
                "title": "城市和亡灵",
                "route": "处理历史、损失、遗留问题和看不见的过去。",
                "core": "城市里有过去的亡灵。任何系统都带着历史债务、遗留叙事和未完成的关系。",
                "methods": [
                    {"name": "历史债务检查", "use": "项目被旧问题拖住", "how": "找出过去承诺、失败案例、客户记忆和组织惯性。"},
                    {"name": "遗留叙事改写", "use": "品牌或个人转型", "how": "承认过去，再解释新的选择。"},
                ],
                "concepts": {"亡灵": "过去仍在影响现在的痕迹。", "历史债务": "旧选择留下的限制。"},
                "cases": ["一个账号转型时，老粉丝的期待就是城市里的亡灵。"],
                "anti": ["假装历史不存在。"],
                "actions": ["列出三个历史债务。", "写一段转型解释。"],
                "connects": ["路径依赖", "转型", "信任修复"],
            },
            {
                "label": "ch07",
                "file": "ch07-cities-and-the-sky.md",
                "title": "城市和天空",
                "route": "处理理想、秩序、模型和现实之间的距离。",
                "core": "天空代表理想秩序，但城市总会偏离模型。好的系统要允许现实中的偏差。",
                "methods": [
                    {"name": "理想-现实张力", "use": "规划内容或产品", "how": "写理想状态、当前现实和允许偏差。"},
                    {"name": "模型降落", "use": "概念过高时", "how": "把抽象模型转成一个场景、一个动作、一个例子。"},
                ],
                "concepts": {"天空": "理想模型和秩序。", "偏差": "现实对模型的抵抗。"},
                "cases": ["再美的品牌愿景，也要落到一次咨询、一次交付、一次售后。"],
                "anti": ["只有世界观，没有落地路径。"],
                "actions": ["为一个愿景写落地场景。", "定义允许偏差。"],
                "connects": ["结构性张力", "系统设计", "落地"],
            },
            {
                "label": "ch08",
                "file": "ch08-continuous-cities.md",
                "title": "连续的城市",
                "route": "处理重复、蔓延、现代生活和内容系统。",
                "core": "连续的城市提醒我们，系统会蔓延并复制自身。内容和产品也会形成惯性。",
                "methods": [
                    {"name": "重复模式识别", "use": "内容越来越同质化", "how": "找出反复出现的主题、形式、情绪和盲点。"},
                    {"name": "断裂点设计", "use": "打破惯性", "how": "引入一个新的观察角度、案例类型或表达结构。"},
                ],
                "concepts": {"连续": "系统自我复制和蔓延。", "惯性": "重复带来的稳定与麻木。"},
                "cases": ["账号越做越像行业平均值，就是连续城市吞没了差异。"],
                "anti": ["为了稳定而无限复制旧模板。"],
                "actions": ["复盘最近 20 条内容。", "设计一个断裂式新栏目。"],
                "connects": ["反同质化", "内容策略", "创新"],
            },
            {
                "label": "ch09",
                "file": "ch09-hidden-cities.md",
                "title": "隐藏的城市",
                "route": "处理不可见结构、潜在关系和系统底层。",
                "core": "真正重要的城市往往隐藏在表面之下。高手看到关系、规则、路径和未说出口的意义。",
                "methods": [
                    {"name": "不可见结构图", "use": "分析复杂问题", "how": "画出表面对象背后的关系、动机、约束和反馈。"},
                    {"name": "隐藏入口", "use": "设计产品/内容体验", "how": "给用户一个进入深层世界的小入口。"},
                ],
                "concepts": {"隐藏结构": "表面现象背后的关系和规则。", "入口": "让用户进入复杂系统的简单点。"},
                "cases": ["装修报价表背后隐藏的是预算、合同、施工、信任和风险分配。"],
                "anti": ["只看可见元素，不看关系。"],
                "actions": ["画一个关系图。", "找一个隐藏入口。"],
                "connects": ["系统思维", "洞察", "风险分析"],
            },
            {
                "label": "ch10",
                "file": "ch10-marco-kublai-dialogue.md",
                "title": "马可与忽必烈的对话",
                "route": "处理讲述者、倾听者、权力和想象。",
                "core": "马可讲述城市，忽必烈重组帝国。叙事不是单向表达，而是在讲述者与倾听者之间生成现实。",
                "methods": [
                    {"name": "双主体叙事", "use": "写给特定用户", "how": "同时写讲述者的经验和倾听者的焦虑。"},
                    {"name": "帝国地图重绘", "use": "帮用户理解复杂业务", "how": "用故事让对方重新看见自己的系统。"},
                ],
                "concepts": {"讲述者": "组织经验的人。", "倾听者": "在自身问题中重构故事的人。"},
                "cases": ["咨询不是给答案，而是让用户重新看见自己的地图。"],
                "anti": ["只顾表达，不理解倾听者处境。"],
                "actions": ["写出听众的焦虑。", "用一个城市隐喻重绘问题。"],
                "connects": ["咨询", "叙事设计", "共创"],
            },
            {
                "label": "ch11",
                "file": "ch11-non-hell-in-hell.md",
                "title": "地狱中的非地狱",
                "route": "处理混乱、绝望、希望和选择。",
                "core": "活人的地狱是我们每天共同形成的环境。成熟的行动不是假装没有地狱，而是识别并保护非地狱的部分。",
                "methods": [
                    {"name": "非地狱识别", "use": "面对糟糕系统", "how": "找出仍有生命力、清醒、连接和行动可能的部分。"},
                    {"name": "微光扩张", "use": "建立长期方向", "how": "持续为非地狱分配时间、注意力、内容和资源。"},
                ],
                "concepts": {"地狱": "人们共同制造并习惯的坏环境。", "非地狱": "尚未被污染且值得保护的部分。"},
                "cases": ["在低信任行业中，真实案例、透明边界和慢交付就是非地狱。"],
                "anti": ["犬儒地接受一切。", "幻想完全逃离现实。"],
                "actions": ["列出三个非地狱。", "为其中一个设计保护动作。"],
                "connects": ["反脆弱", "希望", "长期主义"],
            },
        ],
    },
]


GLADWELL_BASE = {
    "author": "马尔科姆·格拉德威尔",
    "source": r"I:\赞诺【电子书】\00-Inbox\格拉德威尔经典系列：异类 眨眼之间 引爆点 逆转 大开眼界（套装共5册）.txt",
    "extract_note": "Use local bundled plain-text source plus existing AI notes. The bundled source contains five books; this skill is split out as one book = one zeno skill.",
    "not_for": [
        "把故事案例当成严格因果证明。",
        "忽略统计、实验和当代研究更新。",
        "用单一故事替代具体行业数据。",
    ],
}


BOOKS.extend(
    [
        {
            **GLADWELL_BASE,
            "slug": "zeno-gladwell-what-the-dog-saw",
            "title": "大开眼界",
            "display_title": "zeno-大开眼界-格拉德威尔",
            "original": "What the Dog Saw",
            "type": "观察力、人物故事、产品演示、用户洞察、风险判断、身份叙事",
            "description": "Apply Malcolm Gladwell's What the Dog Saw observation frameworks. Use when mining hidden stories, interviewing overlooked operators, designing product demos, interpreting consumer preferences, analyzing fat-tail risk, writing identity-based copy, or turning odd cases into sharp business insights.",
            "what_solves": "训练从中层人物、边缘行业、日常产品和被忽视细节中提炼用户洞察、商业故事和风险判断。",
            "good_for": [
                "做深度选题和人物故事。",
                "设计产品演示和销售叙事。",
                "分析用户偏好分群和身份冲突。",
                "用黑天鹅/肥尾思维审视个人商业风险。",
            ],
            "workflow": [
                "找选题/故事: 读 ch01 和 `patterns.md` 的天才型小人物访谈。",
                "做产品演示: 读 ch02。",
                "分析偏好与市场细分: 读 ch03、ch04。",
                "做风险判断: 读 ch05。",
                "写身份文案: 读 ch06。",
            ],
            "routing": [
                "`references/overview.md` - 观察力和故事提炼总览。",
                "`references/source-card.md` - 来源和套装拆分说明。",
                "`references/chapter-index.md` - 案例主题路由。",
                "`references/cheatsheet.md` - 选题、演示、风险和文案决策规则。",
                "`references/patterns.md` - 人物洞察、产品即明星、偏好分群等方法。",
                "`references/glossary.md` - 概念表。",
                "`references/chapters/` - 按案例类型加载。",
            ],
            "triggers": ["帮我找一个有格拉德威尔味道的选题。", "这个产品怎么演示才有说服力？", "怎么挖用户真实偏好？", "帮我写身份叙事文案。"],
            "principles": [
                "有价值的故事常在中层人物和具体现场。",
                "产品最好被设计成天然适合演示。",
                "消费者未必知道自己想要什么，要构造选择并观察反应。",
                "风险管理不是预测未来，而是不被极端事件击穿。",
                "好文案替用户说出身份冲突。",
            ],
            "overview": "《大开眼界》是一组《纽约客》文章合集，价值在于训练读者换一双眼睛看世界。格拉德威尔把推销员、食品研究员、广告人、风险交易者、诊断系统等看似边缘的人和事写成观察世界的入口。对一人公司来说，它是选题、用户洞察、产品演示、风险意识和身份文案的工具箱。",
            "core_frameworks": [
                "天才型小人物: 真正知道系统如何运转的常是中层行动者。",
                "产品即明星: 销售不是销售员表演，而是让产品自己完成说服。",
                "偏好多元化: 市场不存在唯一完美答案，而有多个未命名偏好区块。",
                "融合度: 大众产品的强大来自完整、稳定和低认知成本。",
                "黑天鹅/肥尾风险: 小概率高冲击事件会摧毁过度自信系统。",
                "身份叙事: 广告最强时是在命名用户内心冲突。",
            ],
            "capabilities": ["深度选题挖掘", "人物采访提纲", "产品演示脚本", "偏好实验设计", "身份文案改写", "风险清单"],
            "topics": {"天才型小人物": "ch01", "产品即明星": "ch02", "偏好多元化": "ch03", "融合度": "ch04", "黑天鹅": "ch05", "身份叙事": "ch06"},
            "glossary": [
                ("天才型小人物", "掌握一线隐性知识但不处在权力顶层的人。"),
                ("产品即明星", "通过产品设计和演示让产品自己完成说服。"),
                ("转折点销售", "从吸引注意力切换到促成付款的关键心理时刻。"),
                ("偏好多元化", "消费者有多个偏好群，而不是一个标准答案。"),
                ("融合度", "产品各要素形成难以拆分的完整体验。"),
                ("黑天鹅", "低概率、高冲击、事后被解释为合理的事件。"),
                ("肥尾风险", "极端事件概率高于常规直觉的风险结构。"),
                ("身份叙事", "消费者借产品解释自己是谁和自己值得什么。"),
            ],
            "patterns": [
                {
                    "name": "天才型小人物选题法",
                    "when": "选题太宏大、缺少具体故事。",
                    "steps": ["找系统中真正动手的人。", "采访他们每天处理的细节。", "提炼一个反常识观察。", "用人物带出系统逻辑。"],
                    "tradeoff": "故事更生动，但需要防止以偏概全。",
                },
                {
                    "name": "产品即明星演示",
                    "when": "用户听不懂产品价值。",
                    "steps": ["找出产品最可视化的价值。", "设计 3 分钟演示。", "让结果先出现，解释后出现。", "把演示动作变成传播素材。"],
                    "tradeoff": "演示强会提升成交，但产品必须真实承接。",
                },
                {
                    "name": "偏好分群实验",
                    "when": "用户说不清想要什么。",
                    "steps": ["做 3-5 个差异版本。", "让用户选择而不是口头描述。", "按选择聚类人群。", "为每类偏好命名。"],
                    "tradeoff": "比问卷更真实，但需要样本和迭代。",
                },
            ],
            "decision_rules": [
                {"when": "故事太抽象", "do": "去找中层行动者", "why": "他们拥有具体细节"},
                {"when": "产品难卖", "do": "先改演示结构", "why": "看见价值比听懂价值更快"},
                {"when": "用户意见分裂", "do": "做偏好分群", "why": "可能不是一个市场"},
                {"when": "策略收益稳定但偶尔巨亏", "do": "检查肥尾风险", "why": "一次极端事件会吞掉长期收益"},
            ],
            "smells": ["只采访老板，不采访一线。", "销售靠解释，产品无法展示。", "把平均偏好当所有人偏好。", "风险模型没有最坏情形。"],
            "defaults": ["默认从一个具体人物进入故事。", "默认把产品价值做成可视化演示。", "默认检查极端失败场景。"],
            "chapters": [
                {
                    "label": "ch01",
                    "file": "ch01-hidden-operators.md",
                    "title": "天才型小人物与隐藏现场",
                    "route": "找故事、做采访、挖系统细节。",
                    "core": "真正有价值的洞察常藏在系统中层和边缘人物身上，他们知道事情如何运转。",
                    "methods": [{"name": "中层人物采访", "use": "选题缺现场", "how": "问具体流程、异常、窍门和失败。"}],
                    "concepts": {"天才型小人物": "拥有隐性经验的一线高手。"},
                    "cases": ["罗恩·波佩尔、雪莉·波利考夫等人物让边缘行业显露系统逻辑。"],
                    "anti": ["只追逐名人和顶层叙事。"],
                    "actions": ["列出 5 个被忽视的从业者。", "写 10 个现场问题。"],
                    "connects": ["用户洞察", "采访", "内容选题"],
                },
                {
                    "label": "ch02",
                    "file": "ch02-product-as-star.md",
                    "title": "产品即明星",
                    "route": "设计演示、销售页、直播成交。",
                    "core": "好的销售让产品成为主角，演示本身就是价值证明。",
                    "methods": [{"name": "演示嵌入设计", "use": "产品还在设计阶段", "how": "让关键效果可见、可重复、可截图。"}],
                    "concepts": {"产品即明星": "产品自己完成说服。"},
                    "cases": ["罗恩·波佩尔的产品被设计成天然适合电视演示。"],
                    "anti": ["产品无亮点，只靠销售员口才。"],
                    "actions": ["写 3 分钟演示脚本。", "找出一个可视化瞬间。"],
                    "connects": ["销售", "短视频", "产品设计"],
                },
                {
                    "label": "ch03",
                    "file": "ch03-preference-diversity.md",
                    "title": "偏好多元化",
                    "route": "用户研究、产品定位、市场细分。",
                    "core": "消费者没有唯一正确口味，市场常由多个尚未被命名的偏好组成。",
                    "methods": [{"name": "多版本测试", "use": "不知道用户想要什么", "how": "给选择而不是问想象。"}],
                    "concepts": {"偏好多元化": "多个用户群各自有不同最优解。"},
                    "cases": ["霍华德·莫斯科维茨发现酱料市场存在多个偏好簇。"],
                    "anti": ["寻找平均用户。"],
                    "actions": ["做 3 个版本测试。", "按反应给人群命名。"],
                    "connects": ["市场细分", "定位", "MVP"],
                },
                {
                    "label": "ch04",
                    "file": "ch04-integration-and-mainstream-products.md",
                    "title": "融合度与大众产品",
                    "route": "分析大众产品护城河。",
                    "core": "大众产品的强大可能来自完整、稳定和熟悉，而不是单点高级。",
                    "methods": [{"name": "融合度审计", "use": "挑战成熟产品", "how": "分析对手如何同时满足多个基础维度。"}],
                    "concepts": {"融合度": "要素水乳交融的整体体验。"},
                    "cases": ["亨氏番茄酱满足酸甜苦咸鲜和熟悉感。"],
                    "anti": ["误以为更独特必然能赢。"],
                    "actions": ["列出用户依赖成熟产品的 5 个理由。"],
                    "connects": ["产品体验", "大众市场", "竞争分析"],
                },
                {
                    "label": "ch05",
                    "file": "ch05-fat-tail-risk.md",
                    "title": "黑天鹅与肥尾风险",
                    "route": "商业模式、投资、个人收入风险检查。",
                    "core": "真正的勇敢不是孤注一掷，而是长期承受小亏，避免一次毁灭。",
                    "methods": [{"name": "极端事件清单", "use": "策略看似稳定", "how": "列出收入归零、平台封禁、关键客户流失等极端事件。"}],
                    "concepts": {"黑天鹅": "低概率高冲击事件。", "肥尾风险": "极端事件概率高于直觉。"},
                    "cases": ["塔勒布策略强调不预测未来，而是避免被未来击穿。"],
                    "anti": ["用平均收益掩盖毁灭风险。"],
                    "actions": ["列 3 个极端风险。", "设计现金和渠道备份。"],
                    "connects": ["反脆弱", "现金流", "风险管理"],
                },
                {
                    "label": "ch06",
                    "file": "ch06-identity-copywriting.md",
                    "title": "身份叙事与广告",
                    "route": "写品牌文案、销售页和广告语。",
                    "core": "优秀文案不是描述产品，而是命名用户心中尚未被清晰表达的身份冲突。",
                    "methods": [{"name": "身份冲突命名", "use": "文案没有穿透力", "how": "写出用户在社会期待和自我价值之间的矛盾。"}],
                    "concepts": {"身份叙事": "购买背后的自我解释。"},
                    "cases": ["染发广告和欧莱雅口号捕捉了女性身份转型。"],
                    "anti": ["只写功能，不写用户想成为什么人。"],
                    "actions": ["写出用户的身份矛盾。", "把卖点改成自我叙事。"],
                    "connects": ["文案", "品牌", "用户心理"],
                },
            ],
        },
        {
            **GLADWELL_BASE,
            "slug": "zeno-gladwell-david-and-goliath",
            "title": "逆转：弱者如何找到优势，反败为胜？",
            "display_title": "zeno-逆转-格拉德威尔",
            "original": "David and Goliath",
            "type": "弱者策略、倒U曲线、值得经历的困难、权力合法性、逆势竞争",
            "description": "Apply Malcolm Gladwell's David and Goliath frameworks. Use when analyzing underdog strategy, hidden disadvantages of strength, inverted-U effects, desirable difficulties, dyslexia and compensation, legitimacy of authority, punishment backfire, or how small players can beat giants.",
            "what_solves": "帮助用户重新判断优势与劣势，设计弱者避开正面战场、利用规则漏洞、把限制转成独特能力的策略。",
            "good_for": ["小团队对抗大公司。", "弱势项目找差异化打法。", "分析资源过剩反而失效。", "把困难转成能力补偿。"],
            "workflow": [
                "遇到强敌: 读 ch01 大卫策略。",
                "资源优势不灵: 读 ch02 倒U曲线。",
                "个人困难/缺陷: 读 ch03 值得经历的困难。",
                "制度/权力问题: 读 ch04-ch05 合法性。",
            ],
            "routing": [
                "`references/overview.md` - 弱者策略总览。",
                "`references/source-card.md` - 来源和套装拆分说明。",
                "`references/chapter-index.md` - 主题路由。",
                "`references/cheatsheet.md` - 强弱逆转决策表。",
                "`references/patterns.md` - 弱者打法、倒U检查、困难补偿等方法。",
                "`references/glossary.md` - 术语表。",
                "`references/chapters/` - 按案例加载。",
            ],
            "triggers": ["我怎么用弱者策略打强者？", "资源多一定是优势吗？", "这个困难能不能变成优势？", "权力为什么越强越失效？"],
            "principles": ["不要按巨人的规则打。", "优势会过度，资源有倒U曲线。", "某些困难能逼出补偿能力。", "权力必须有合法性，否则会反噬。"],
            "overview": "《逆转》挑战我们对优势和劣势的直觉。强者的体量、资源和权威未必总是优势；弱者若改变战场、利用速度、非常规策略和心理补偿，可能获得反常胜利。它适合小团队、个人品牌、低资源项目和制度分析。",
            "core_frameworks": ["大卫策略: 不按巨人规则打。", "倒U曲线: 资源一旦过量会产生反作用。", "值得经历的困难: 某些缺陷逼出补偿能力。", "权力合法性: 权威要被认为公平、可预测、可被听见。", "惩罚反噬: 过度威慑可能失效。"],
            "capabilities": ["弱者竞争策略", "资源过量诊断", "困难补偿分析", "制度合法性审计"],
            "topics": {"弱者策略": "ch01", "倒U曲线": "ch02", "值得经历的困难": "ch03", "权力合法性": "ch04", "惩罚反噬": "ch05"},
            "glossary": [
                ("弱者策略", "避开强者优势战场，用速度、非常规和聚焦获胜。"),
                ("倒U曲线", "某项资源从有益到边际递减再到有害的曲线。"),
                ("值得经历的困难", "虽然痛苦但能训练补偿能力的困难。"),
                ("补偿学习", "因短板而发展出的替代能力。"),
                ("合法性", "权力被服从者认为公平、可听见、可预测。"),
                ("惩罚反噬", "威慑过度导致抵抗、失信或无效。"),
            ],
            "patterns": [
                {"name": "弱者换战场", "when": "资源远弱于对手。", "steps": ["列出对手优势依赖的规则。", "找出你能改变的战场。", "把速度、专注、亲近客户做成优势。", "拒绝正面对耗。"], "tradeoff": "非常规打法会牺牲体面和稳定。"},
                {"name": "倒U检查", "when": "资源越多效果却越差。", "steps": ["确定目标指标。", "列出资源投入。", "判断是否进入边际递减或反作用区。", "减少复杂度。"], "tradeoff": "少即是多，但需要承认过量投入的沉没成本。"},
                {"name": "困难补偿", "when": "用户有明显短板或限制。", "steps": ["承认真实困难。", "找出它迫使你练出的能力。", "把补偿能力用到合适场景。", "避免浪漫化痛苦。"], "tradeoff": "困难不是自动变优势，必须有训练和场景匹配。"},
            ],
            "decision_rules": [
                {"when": "对手更大更有资源", "do": "换规则、换速度、换战场", "why": "正面竞争会放大对手优势"},
                {"when": "投入越多效果越差", "do": "检查倒U右侧", "why": "资源过量会制造复杂度"},
                {"when": "你有明显短板", "do": "寻找补偿能力而非否认短板", "why": "短板可迫使差异能力形成"},
                {"when": "权力越压越乱", "do": "修复合法性", "why": "缺合法性的权威会被抵抗"},
            ],
            "smells": ["小团队模仿大公司打法。", "资源很多但决策更慢。", "把困难浪漫化却没有能力补偿。", "只加重惩罚不改善信任。"],
            "defaults": ["默认先问: 我能否换战场？", "默认检查资源是否过量。", "默认不把痛苦本身当优势。"],
            "chapters": [
                {"label": "ch01", "file": "ch01-underdog-strategy.md", "title": "大卫与歌利亚：弱者换战场", "route": "小玩家对抗强者。", "core": "大卫获胜不是奇迹，而是没有按歌利亚的规则近身肉搏。", "methods": [{"name": "换战场", "use": "面对强者", "how": "避开对方优势，把竞争改成速度、距离、聚焦或非常规。"}], "concepts": {"弱者策略": "改变规则的竞争方式。"}, "cases": ["大卫用投石器对抗重装巨人。"], "anti": ["为了证明自己而打正面战。"], "actions": ["列出对手优势。", "找出可改变规则。"], "connects": ["定位", "游击营销"]},
                {"label": "ch02", "file": "ch02-inverted-u.md", "title": "倒U曲线：优势中的劣势", "route": "资源过量、规模过大、管理过度。", "core": "资源从不足到适量有帮助，但超过临界点后会边际递减甚至伤害结果。", "methods": [{"name": "临界点识别", "use": "效果不随投入增长", "how": "寻找过度投入带来的复杂度、依赖或迟钝。"}], "concepts": {"倒U曲线": "优势过量后的反作用。"}, "cases": ["教育资源、班级规模、财富都可能出现倒U。"], "anti": ["默认更多一定更好。"], "actions": ["画投入-结果曲线。", "找过量点。"], "connects": ["边际收益递减"]},
                {"label": "ch03", "file": "ch03-desirable-difficulties.md", "title": "值得经历的困难", "route": "短板、逆境、补偿能力。", "core": "某些困难会迫使人发展出替代能力，但这不是自动发生的励志鸡汤。", "methods": [{"name": "补偿能力提取", "use": "分析个人经历", "how": "从限制中找出被迫训练出的能力。"}], "concepts": {"值得经历的困难": "痛苦但可能训练能力的限制。"}, "cases": ["部分阅读障碍者发展出口头、谈判和委托能力。"], "anti": ["把所有痛苦都说成财富。"], "actions": ["写困难。", "写补偿能力。", "找适用场景。"], "connects": ["反脆弱"]},
                {"label": "ch04", "file": "ch04-legitimacy-of-authority.md", "title": "权力的合法性", "route": "管理、制度、教育、执法。", "core": "权力要有效，必须让人觉得规则公平、自己被听见、执行可预测。", "methods": [{"name": "合法性三问", "use": "制度失灵时", "how": "问是否公平、是否能发声、是否稳定一致。"}], "concepts": {"合法性": "权力被认可的基础。"}, "cases": ["课堂、社区和执法都受合法性影响。"], "anti": ["只靠强制，不建立信任。"], "actions": ["审计三项合法性。"], "connects": ["组织管理", "信任"]},
                {"label": "ch05", "file": "ch05-punishment-backfire.md", "title": "惩罚反噬与巨人失灵", "route": "严厉处罚、权威压制、冲突升级。", "core": "提高惩罚并不总能减少问题，如果对象不相信系统或不按理性模型行动，威慑会失效。", "methods": [{"name": "威慑有效性检查", "use": "想加重惩罚时", "how": "检查对方是否感知概率、是否信任规则、是否有替代路径。"}], "concepts": {"惩罚反噬": "过度威慑导致失效或抵抗。"}, "cases": ["三振出局法等案例显示惩罚并非总按理性预期工作。"], "anti": ["问题一出现就加码惩罚。"], "actions": ["先修复规则信任。", "再设计后果。"], "connects": ["行为经济学", "治理"]},
            ],
        },
        {
            **GLADWELL_BASE,
            "slug": "zeno-gladwell-outliers",
            "title": "异类：不一样的成功启示录",
            "display_title": "zeno-异类-格拉德威尔",
            "original": "Outliers",
            "type": "成功因素、机会结构、10000小时、文化传承、教育公平、积累优势",
            "description": "Apply Malcolm Gladwell's Outliers frameworks. Use when analyzing success beyond individual talent, cumulative advantage, 10,000-hour practice, opportunity timing, cultural legacy, birth-date effects, elite thresholds, KIPP-style learning time, or how systems create outliers.",
            "what_solves": "把成功从个人神话还原为机会、时机、文化、练习、家庭和制度共同作用的结构分析。",
            "good_for": ["分析个人成长路径。", "设计学习和训练系统。", "拆解成功案例背后的机会结构。", "反思公平和环境设计。"],
            "workflow": ["分析成功案例: 读 ch01-ch03。", "设计学习路径: 读 ch04、ch07。", "看文化影响: 读 ch05-ch06。", "教育/机会公平: 读 ch07。"],
            "routing": ["`references/overview.md` - 成功结构总览。", "`references/source-card.md` - 来源和拆分说明。", "`references/chapter-index.md` - 主题路由。", "`references/cheatsheet.md` - 成功结构决策规则。", "`references/patterns.md` - 机会审计、练习系统、文化脚本方法。", "`references/glossary.md` - 术语表。", "`references/chapters/` - 按主题加载。"],
            "triggers": ["为什么有人成功不是只靠努力？", "帮我设计10000小时练习系统。", "我的机会结构是什么？", "文化传承怎么影响行为？"],
            "principles": ["成功不是孤立个人的产物。", "机会、出生时间、家庭和制度会累积。", "练习需要足量、反馈和机会窗口。", "文化脚本会进入高压场景。"],
            "overview": "《异类》拆解成功神话：所谓天才不是凭空出现，而是站在机会、家庭、文化、时代和制度给出的路径上。它不是否认努力，而是提醒我们努力要有入口、时间、反馈和社会条件。",
            "core_frameworks": ["累积优势: 初始小差异会被制度放大。", "10000小时: 高水平表现需要长时间刻意练习和机会。", "机会窗口: 出生年代和技术周期决定能否进入新赛道。", "文化传承: 历史形成的行为脚本会影响当下。", "阈值效应: 智力等优势过阈值后差异未必继续决定结果。"],
            "capabilities": ["成功案例结构分析", "学习系统设计", "机会地图", "文化脚本诊断"],
            "topics": {"累积优势": "ch01", "10000小时": "ch02", "机会窗口": "ch03", "阈值效应": "ch04", "文化传承": "ch05", "沟通脚本": "ch06", "教育时间": "ch07"},
            "glossary": [("异类", "看似异常成功但实际由结构条件造就的人。"), ("累积优势", "初始优势被制度持续放大的过程。"), ("10000小时", "高水平能力需要长期大量练习的经验法则。"), ("机会窗口", "时代、技术和年龄共同打开的进入机会。"), ("阈值效应", "能力超过某个门槛后，更多能力不再线性决定结果。"), ("文化传承", "历史环境留下并延续的行为模式。")],
            "patterns": [
                {"name": "成功结构拆解", "when": "分析一个成功者。", "steps": ["列个人努力。", "列家庭和资源。", "列时代机会。", "列制度入口。", "列文化脚本。"], "tradeoff": "会削弱英雄叙事，但更接近可复制条件。"},
                {"name": "10000小时练习系统", "when": "设计长期能力训练。", "steps": ["确定核心技能。", "安排高频练习。", "建立反馈回路。", "争取真实场景。"], "tradeoff": "时间重要，但没有反馈只是重复。"},
                {"name": "机会窗口扫描", "when": "选择赛道或学习方向。", "steps": ["看新技术周期。", "看进入门槛。", "看你是否有早期入口。", "看能否积累练习时间。"], "tradeoff": "机会窗口无法完全控制，但可提前识别。"},
            ],
            "decision_rules": [
                {"when": "你想复制成功者", "do": "先复制条件而非表面动作", "why": "成功依赖结构"},
                {"when": "能力还没突破", "do": "增加反馈密度和真实练习", "why": "时长不等于有效练习"},
                {"when": "你羡慕天才", "do": "找他的机会窗口", "why": "天才常站在特殊入口上"},
                {"when": "团队反复沟通失误", "do": "检查文化脚本", "why": "行为不只是个人性格"},
            ],
            "smells": ["只讲努力不讲入口。", "只模仿作息不模仿机会结构。", "练习很多但没有反馈。", "把文化影响说成个人缺陷。"],
            "defaults": ["默认分析五层: 个人、家庭、时代、制度、文化。", "默认把练习和反馈绑定。", "默认寻找初始优势被放大的机制。"],
            "chapters": [
                {"label": "ch01", "file": "ch01-cumulative-advantage.md", "title": "累积优势与出生日期", "route": "分析小差异如何放大。", "core": "初始差异在制度排序中被持续放大，最终看起来像天赋差距。", "methods": [{"name": "初始优势追踪", "use": "成功差异分析", "how": "找最早的分组、筛选和资源倾斜。"}], "concepts": {"累积优势": "小优势被放大的过程。"}, "cases": ["加拿大冰球选拔中的出生月份效应。"], "anti": ["把结果全归因天赋。"], "actions": ["找你的初始优势和劣势。"], "connects": ["马太效应"]},
                {"label": "ch02", "file": "ch02-ten-thousand-hours.md", "title": "10000小时与刻意练习", "route": "设计技能成长路径。", "core": "高水平能力需要大量练习，但关键是机会、反馈和真实场景。", "methods": [{"name": "练习飞轮", "use": "学习系统", "how": "练习-反馈-修正-真实任务循环。"}], "concepts": {"10000小时": "长期高强度练习的象征。"}, "cases": ["甲壳虫乐队汉堡演出、比尔·盖茨早期计算机机会。"], "anti": ["机械重复。"], "actions": ["设计每周练习表。"], "connects": ["刻意练习"]},
                {"label": "ch03", "file": "ch03-opportunity-window.md", "title": "机会窗口与时代位置", "route": "选择行业、赛道、技术周期。", "core": "出生年代和技术周期会决定谁能在正确时间进入正确赛道。", "methods": [{"name": "时代入口扫描", "use": "职业/创业选择", "how": "找新工具出现但竞争尚未饱和的窗口。"}], "concepts": {"机会窗口": "时代提供的进入点。"}, "cases": ["软件企业家群体受益于特定年代和计算机入口。"], "anti": ["只说个人选择。"], "actions": ["列出当前三个机会窗口。"], "connects": ["趋势判断"]},
                {"label": "ch04", "file": "ch04-threshold-effect.md", "title": "阈值效应与聪明够用", "route": "判断能力、学历、智力是否继续决定结果。", "core": "某些能力超过门槛后，更多优势不再线性带来成功。", "methods": [{"name": "够用门槛", "use": "招聘/学习焦虑", "how": "定义完成任务所需最低能力，再看创造力、资源和实践。"}], "concepts": {"阈值效应": "超过门槛后差异下降。"}, "cases": ["高智商不必然带来更高成就。"], "anti": ["迷信单一指标。"], "actions": ["找任务真正门槛。"], "connects": ["招聘", "教育"]},
                {"label": "ch05", "file": "ch05-cultural-legacy.md", "title": "文化传承", "route": "解释行为模式和群体差异。", "core": "历史环境形成的文化脚本会长期影响当下行为。", "methods": [{"name": "文化脚本追踪", "use": "理解团队/用户行为", "how": "找历史生计、权力距离、荣誉观和沟通习惯。"}], "concepts": {"文化传承": "历史留下的行为模式。"}, "cases": ["荣誉文化、稻作文化等影响现代行为。"], "anti": ["把文化解释变成刻板印象。"], "actions": ["写出一个行为背后的历史脚本。"], "connects": ["社会心理"]},
                {"label": "ch06", "file": "ch06-communication-and-power-distance.md", "title": "沟通脚本与权力距离", "route": "高压团队、飞行安全、跨文化沟通。", "core": "在高压场景中，含蓄沟通和权力距离可能造成严重后果。", "methods": [{"name": "降权沟通检查", "use": "团队沟通", "how": "把暗示改成明确请求和复述确认。"}], "concepts": {"权力距离": "下级是否敢直接表达问题。"}, "cases": ["大韩航空案例显示文化脚本影响驾驶舱沟通。"], "anti": ["把沉默当没问题。"], "actions": ["建立明确反馈句式。"], "connects": ["团队安全"]},
                {"label": "ch07", "file": "ch07-learning-time-and-kipp.md", "title": "学习时间与机会再分配", "route": "教育、训练营、长期成长。", "core": "机会可以被重新设计，更多有效学习时间能改变弱势学生路径。", "methods": [{"name": "机会再分配", "use": "设计训练项目", "how": "增加有效时间、反馈、期待和环境支持。"}], "concepts": {"学习时间": "可被制度设计的机会资源。"}, "cases": ["KIPP 通过延长学习时间改变学生积累。"], "anti": ["只责备学生不努力。"], "actions": ["增加稳定练习时间。"], "connects": ["教育公平"]},
            ],
        },
        {
            **GLADWELL_BASE,
            "slug": "zeno-gladwell-tipping-point",
            "title": "引爆点",
            "display_title": "zeno-引爆点-格拉德威尔",
            "original": "The Tipping Point",
            "type": "传播、流行、病毒营销、个别人物法则、附着力、环境威力",
            "description": "Apply Malcolm Gladwell's Tipping Point frameworks. Use when designing viral spread, word-of-mouth campaigns, social epidemics, connector/maven/salesman roles, sticky messages, context changes, small interventions with large effects, or diagnosing why an idea/product has not tipped.",
            "what_solves": "用流行三法则分析观念、产品、内容和行为如何从小变化到突然扩散。",
            "good_for": ["内容传播设计。", "口碑营销和社群增长。", "产品冷启动。", "诊断为什么传播没有引爆。"],
            "workflow": ["找传播节点: 读 ch01。", "改信息附着力: 读 ch02。", "调环境与触发: 读 ch03。", "做传播诊断: 读 cheatsheet 和 patterns。"],
            "routing": ["`references/overview.md` - 引爆点总览。", "`references/source-card.md` - 来源和拆分说明。", "`references/chapter-index.md` - 三法则路由。", "`references/cheatsheet.md` - 引爆诊断表。", "`references/patterns.md` - 传播设计方法。", "`references/glossary.md` - 术语表。", "`references/chapters/` - 按法则加载。"],
            "triggers": ["怎么让这个内容传播起来？", "我的产品为什么没有引爆？", "谁是联系员/内行/推销员？", "怎么提高附着力？"],
            "principles": ["流行像传染病，有临界点。", "少数关键人物会放大传播。", "信息必须有附着力。", "环境小变化会改变行为。"],
            "overview": "《引爆点》把社会流行看成一种类似传染病的扩散现象。它提出个别人物法则、附着力因素法则和环境威力法则，说明小变化如何产生巨大效果。对内容和产品增长来说，它是传播诊断与设计工具。",
            "core_frameworks": ["引爆点: 变化突然跨过临界点。", "个别人物法则: 联系员、内行、推销员推动扩散。", "附着力因素: 信息要被记住并促进行动。", "环境威力: 行为受场景线索强烈影响。", "小变化大效果: 找关键杠杆而非平均用力。"],
            "capabilities": ["传播诊断", "口碑节点设计", "内容附着力改写", "环境触发设计"],
            "topics": {"引爆点": "ch01", "联系员": "ch02", "内行": "ch02", "推销员": "ch02", "附着力": "ch03", "环境威力": "ch04", "流行诊断": "ch05"},
            "glossary": [("引爆点", "流行突然爆发的临界点。"), ("个别人物法则", "少数关键人物决定传播速度和范围。"), ("联系员", "拥有跨圈层社交连接的人。"), ("内行", "收集信息并乐于帮助别人做选择的人。"), ("推销员", "擅长说服和感染他人的人。"), ("附着力", "信息被记住并促进行动的能力。"), ("环境威力", "场景细节对行为产生的巨大影响。")],
            "patterns": [
                {"name": "三法则传播诊断", "when": "内容/产品没有扩散。", "steps": ["是否找到联系员、内行、推销员。", "信息是否可记住、可复述、可行动。", "环境是否降低行动成本。", "找到最弱一环优化。"], "tradeoff": "传播不是只靠内容好，也不是只靠渠道。"},
                {"name": "附着力改写", "when": "信息没人记得住。", "steps": ["压缩核心承诺。", "加入具体场景。", "让用户能复述。", "增加行动触发。"], "tradeoff": "越附着越需要牺牲复杂解释。"},
                {"name": "关键人物地图", "when": "做冷启动。", "steps": ["找跨圈联系员。", "找可信内行。", "找高说服推销员。", "为三类人设计不同材料。"], "tradeoff": "依赖关键节点会提高传播效率，也带来节点风险。"},
            ],
            "decision_rules": [
                {"when": "内容没人转发", "do": "检查关键人物而非只改标题", "why": "传播需要节点"},
                {"when": "用户看完不行动", "do": "增强附着力和行动触发", "why": "记住不等于行动"},
                {"when": "行为改变困难", "do": "改环境线索和摩擦成本", "why": "环境常比意志更强"},
                {"when": "增长慢但反馈好", "do": "寻找临界小杠杆", "why": "流行可能是非线性的"},
            ],
            "smells": ["只追大号投放，不找内行和推销员。", "卖点复杂，用户无法一句话复述。", "行动路径太长。", "环境线索和目标行为冲突。"],
            "defaults": ["默认先做三法则诊断。", "默认让信息可复述。", "默认降低行为摩擦。"],
            "chapters": [
                {"label": "ch01", "file": "ch01-what-is-tipping-point.md", "title": "什么是引爆点", "route": "理解临界点和非线性传播。", "core": "流行不是线性增长，而是在某个临界点突然爆发。", "methods": [{"name": "临界点寻找", "use": "增长停滞", "how": "找人数、频率、可信度或环境中的关键阈值。"}], "concepts": {"引爆点": "流行爆发临界点。"}, "cases": ["暇步士鞋从低销量突然流行。"], "anti": ["用线性思维看传播。"], "actions": ["写出可能的三个阈值。"], "connects": ["网络效应"]},
                {"label": "ch02", "file": "ch02-law-of-the-few.md", "title": "个别人物法则", "route": "找传播关键人物。", "core": "传播常由少数联系员、内行和推销员推动。", "methods": [{"name": "三类人地图", "use": "传播冷启动", "how": "分别找连接广、信息强、说服强的人。"}], "concepts": {"联系员": "跨圈层连接者。", "内行": "信息专家。", "推销员": "说服者。"}, "cases": ["保罗·里维尔夜奔能传播，因为他是联系员。"], "anti": ["把所有用户当同等传播节点。"], "actions": ["列出三类关键人。"], "connects": ["社群", "口碑"]},
                {"label": "ch03", "file": "ch03-stickiness-factor.md", "title": "附着力因素法则", "route": "提高内容记忆和行动。", "core": "信息必须被记住并改变行为，否则传播只是曝光。", "methods": [{"name": "附着力测试", "use": "改内容", "how": "问用户能否复述、是否知道下一步、是否想行动。"}], "concepts": {"附着力": "信息留在脑中并驱动行动。"}, "cases": ["《芝麻街》和《蓝狗线索》通过细节调整提高学习效果。"], "anti": ["只追曝光，不追记忆。"], "actions": ["重写一句可复述口号。"], "connects": ["教育内容", "文案"]},
                {"label": "ch04", "file": "ch04-power-of-context.md", "title": "环境威力法则", "route": "通过场景改变行为。", "core": "小环境线索会显著改变人的行为，不能只靠说服。", "methods": [{"name": "环境摩擦审计", "use": "用户不行动", "how": "找路径、提示、默认选项和社会线索。"}], "concepts": {"环境威力": "场景对行为的影响。"}, "cases": ["破窗理论和地铁治理案例强调环境线索。"], "anti": ["只责备用户不自律。"], "actions": ["降低一个行动摩擦。"], "connects": ["行为设计"]},
                {"label": "ch05", "file": "ch05-real-world-application.md", "title": "真实世界中的引爆点", "route": "综合设计传播方案。", "core": "引爆需要人物、信息和环境同时配合，不能只靠单点技巧。", "methods": [{"name": "引爆方案", "use": "推广项目", "how": "设计关键人、附着信息、环境触发和反馈指标。"}], "concepts": {"社会流行": "行为/观念像传染病扩散。"}, "cases": ["青少年吸烟、犯罪率、教育节目等案例体现三法则组合。"], "anti": ["把引爆当玄学。"], "actions": ["写一页传播方案。"], "connects": ["增长", "营销"]},
            ],
        },
        {
            **GLADWELL_BASE,
            "slug": "zeno-gladwell-blink",
            "title": "眨眼之间",
            "display_title": "zeno-眨眼之间-格拉德威尔",
            "original": "Blink",
            "type": "快速认知、薄片撷取、直觉判断、无意识偏见、决策设计",
            "description": "Apply Malcolm Gladwell's Blink frameworks. Use when analyzing first impressions, rapid cognition, thin-slicing, intuitive expertise, implicit bias, decision overload, snap judgments under pressure, or designing conditions where fast decisions help rather than harm.",
            "what_solves": "帮助用户判断什么时候该信直觉、什么时候直觉会被偏见和环境污染，以及如何设计更好的快速决策条件。",
            "good_for": ["快速判断训练。", "面试/销售/设计评审中的第一印象分析。", "偏见和误判审计。", "高压决策流程优化。"],
            "workflow": ["要信直觉吗: 读 ch01、cheatsheet。", "专家判断: 读 ch02。", "偏见误判: 读 ch03-ch04。", "决策设计: 读 ch05。"],
            "routing": ["`references/overview.md` - 快速认知总览。", "`references/source-card.md` - 来源和拆分说明。", "`references/chapter-index.md` - 主题路由。", "`references/cheatsheet.md` - 直觉可信度判断表。", "`references/patterns.md` - 薄片撷取、偏见审计、决策环境设计。", "`references/glossary.md` - 术语表。", "`references/chapters/` - 按场景加载。"],
            "triggers": ["这个第一印象可靠吗？", "什么时候该相信直觉？", "怎么避免无意识偏见？", "信息太多怎么快速决策？"],
            "principles": ["直觉既强大也危险。", "专家直觉来自长期反馈训练。", "薄片撷取可以抓住关键模式。", "偏见会污染快速判断。", "少量正确变量胜过过量信息。"],
            "overview": "《眨眼之间》讨论快速认知：人能在极短时间内从少量线索做出判断，但这种能力既可能是专家经验，也可能是偏见、情境和压力的误导。它适合用于面试、用户判断、设计评审、销售沟通和高压决策。",
            "core_frameworks": ["薄片撷取: 从少量关键线索判断模式。", "快速认知: 无意识在瞬间整合信息。", "专家直觉: 经过反馈训练的模式识别。", "无意识偏见: 快速判断被社会标签污染。", "决策瘫痪: 信息过多会伤害判断。"],
            "capabilities": ["直觉可信度判断", "偏见审计", "快速评审流程", "高压决策简化"],
            "topics": {"薄片撷取": "ch01", "专家直觉": "ch02", "无意识偏见": "ch03", "压力误判": "ch04", "决策设计": "ch05"},
            "glossary": [("快速认知", "人在极短时间内做出的无意识判断。"), ("薄片撷取", "用少量高信号线索判断整体模式。"), ("专家直觉", "由长期练习和反馈形成的快速模式识别。"), ("无意识偏见", "不自觉受标签、外貌、种族、性别等影响。"), ("决策瘫痪", "信息过多导致判断变差。"), ("第一印象", "初始线索触发的快速判断。")],
            "patterns": [
                {"name": "直觉可信度测试", "when": "用户想凭感觉做决定。", "steps": ["判断是否有长期反馈训练。", "判断环境是否稳定。", "判断线索是否高信号。", "检查偏见污染。"], "tradeoff": "直觉快，但需要适用条件。"},
                {"name": "薄片变量选择", "when": "信息太多。", "steps": ["找少数真正预测结果的变量。", "删除噪音指标。", "用样例验证。", "建立简短评分卡。"], "tradeoff": "简化提高速度，但可能漏掉异常。"},
                {"name": "偏见遮蔽", "when": "面试或评审可能受外貌/身份影响。", "steps": ["先匿名看作品或数据。", "统一评价标准。", "延迟主观印象。", "复盘误判。"], "tradeoff": "降低偏见，但可能减少整体感知信息。"},
            ],
            "decision_rules": [
                {"when": "你有大量相似场景反馈", "do": "可以参考直觉", "why": "专家直觉来自训练"},
                {"when": "环境陌生且情绪强", "do": "放慢判断", "why": "直觉容易被压力污染"},
                {"when": "信息过多", "do": "只保留高预测变量", "why": "噪音会降低准确率"},
                {"when": "涉及身份标签", "do": "匿名化或标准化评估", "why": "无意识偏见会介入"},
            ],
            "smells": ["把偏见说成直觉。", "新手过度相信第一印象。", "评分指标太多。", "高压下没有复核机制。"],
            "defaults": ["默认问: 这个直觉从哪里训练出来？", "默认检查偏见变量。", "默认用少数高信号变量。"],
            "chapters": [
                {"label": "ch01", "file": "ch01-thin-slicing.md", "title": "薄片撷取", "route": "快速判断和第一印象。", "core": "少量高质量线索有时能揭示整体模式。", "methods": [{"name": "高信号线索", "use": "快速评估", "how": "找真正预测结果的少数行为或指标。"}], "concepts": {"薄片撷取": "用少量线索判断整体。"}, "cases": ["婚姻互动研究等案例说明少量行为能预测关系模式。"], "anti": ["线索少但质量低。"], "actions": ["列出 3 个高信号线索。"], "connects": ["模式识别"]},
                {"label": "ch02", "file": "ch02-expert-intuition.md", "title": "专家直觉", "route": "判断直觉是否可信。", "core": "可信直觉来自长期练习、清晰反馈和稳定环境。", "methods": [{"name": "专家直觉四问", "use": "信不信感觉", "how": "是否训练足够、反馈及时、环境稳定、情绪不过载。"}], "concepts": {"专家直觉": "训练后的快速识别。"}, "cases": ["艺术鉴定、消防指挥等案例体现专家直觉。"], "anti": ["把没训练过的冲动当直觉。"], "actions": ["判断你的直觉训练史。"], "connects": ["刻意练习"]},
                {"label": "ch03", "file": "ch03-implicit-bias.md", "title": "无意识偏见", "route": "面试、评审、第一印象偏差。", "core": "快速判断会被社会标签和刻板印象污染。", "methods": [{"name": "偏见变量遮蔽", "use": "评审作品/候选人", "how": "先隐藏身份信息，统一标准。"}], "concepts": {"无意识偏见": "不自觉的判断污染。"}, "cases": ["身高、种族、性别等因素影响判断。"], "anti": ["认为自己完全客观。"], "actions": ["匿名评审一次。"], "connects": ["公平", "招聘"]},
                {"label": "ch04", "file": "ch04-stress-and-misread.md", "title": "压力下的误读", "route": "高压决策、冲突、销售谈判。", "core": "压力会缩窄注意力，让人误读线索并快速升级错误。", "methods": [{"name": "降压复核", "use": "高风险快速判断", "how": "加入暂停、复述和第二观察者。"}], "concepts": {"误读": "错误解释他人意图或情境。"}, "cases": ["警务和高压冲突案例说明快速误判的危险。"], "anti": ["越紧张越加速。"], "actions": ["设计一个暂停口令。"], "connects": ["冲突管理"]},
                {"label": "ch05", "file": "ch05-designing-fast-decisions.md", "title": "设计快速决策条件", "route": "流程、评分卡、信息筛选。", "core": "好决策不是信息越多越好，而是让正确线索在正确时间出现。", "methods": [{"name": "少变量评分卡", "use": "信息过载", "how": "保留少数高预测变量，删除噪音。"}], "concepts": {"决策瘫痪": "信息过多导致判断变差。"}, "cases": ["急诊和消费选择都可能因过量信息变差。"], "anti": ["为了严谨收集无限信息。"], "actions": ["把评分表压到 5 项内。"], "connects": ["决策设计"]},
            ],
        },
    ]
)


def build_book(book: dict, root: Path) -> None:
    target = root / book["slug"]
    if target.exists():
        shutil.rmtree(target)
    write(target / "SKILL.md", skill_md(book))
    refs = target / "references"
    write(refs / "source-card.md", source_card(book))
    write(refs / "chapter-index.md", chapter_index(book))
    write(refs / "overview.md", overview(book))
    write(refs / "glossary.md", "# Glossary\n\n" + glossary(book["glossary"]))
    write(refs / "patterns.md", patterns(book))
    write(refs / "cheatsheet.md", cheatsheet(book))
    for ch in book["chapters"]:
        write(refs / "chapters" / ch["file"], chapter_md(ch))


def build_installable(book: dict) -> None:
    machine = deepcopy(book)
    machine["display_title"] = book["slug"]
    build_book(machine, INSTALLABLE_ROOT)


def append_index(books: list[dict]) -> None:
    index = ROOT / "弹药库索引.md"
    text = index.read_text(encoding="utf-8") if index.exists() else "# 弹药库索引\n"
    additions = []
    for book in books:
        if f"`{book['slug']}`" in text:
            continue
        additions.append(
            f"""
            ## {book['title']}

            - skill: `{book['slug']}`
            - author: {book['author']}
            - source: {Path(book['source']).name}
            - use: {book['what_solves']}
            """
        )
    if additions:
        index.write_text(text.rstrip() + "\n\n" + "\n".join(clean(a) for a in additions), encoding="utf-8")


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    INSTALLABLE_ROOT.mkdir(parents=True, exist_ok=True)
    DIST.mkdir(parents=True, exist_ok=True)
    for book in BOOKS:
        build_book(book, ROOT)
        build_installable(book)
    append_index(BOOKS)
    print("generated", len(BOOKS), "skills")
    for book in BOOKS:
        print(book["slug"])


if __name__ == "__main__":
    main()
