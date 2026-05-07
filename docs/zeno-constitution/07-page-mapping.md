# 页面映射宪法

## 1. 当前主页面映射

| 页面 / 资产 | 现在的作用 | 对应哪条宪法 | 保留什么 | 应移动什么 | 应重写什么 |
| --- | --- | --- | --- | --- | --- |
| zeno-site/app/page.tsx | 首页总入口 | 00、01、04、05 | 问题分流、证据卡、双服务入口 | “更自由的个人事业系统”一类表达移到 About 或 AI 层下半区 | Hero 第一屏进一步收紧到“帮业主建立装修判断力” |
| zeno-site/app/start/page.tsx | 问题入口页 | 00、02、04、05 | 按问题和阶段分流的结构 | 无需承载品牌长文 | 每条入口标题继续向报价/预算/合同/验收/居住场景靠拢 |
| zeno-site/app/resources/page.tsx | 资料与清单分流页 | 02、04、05 | 先看样例、再按问题拿资料的结构 | AI 入口保持靠后，不抢装修前台 | “真实居住”文案更多改成“居住场景”“家里真正怎么住” |
| zeno-site/app/tools/page.tsx | 自助工具总入口 | 04、05、06 | “先把问题缩小”这个定位 | 无 | 未来补上低价指南或深度资料去向 |
| zeno-site/app/tools/budget-risk/page.tsx | 风险分型工具 | 02、05、06 | 风险分型思路和结果导流 | 无 | 问题文案继续往装修本土表达收紧 |
| zeno-site/app/tools/budget-risk/result/page.tsx | 自测结果页 | 02、05 | 风险重心、下一步顺序、资源跳转 | 无 | 结果页后续可补 39 元指南与 1499 决策包支线 |
| zeno-site/app/services/page.tsx | 总服务分流页 | 01、04、05 | 装修判断和 AI 工作流分开 | “合作方向”可弱化或移到 Contact | 顶部承诺继续强调先分场景，不是展示所有业务 |
| zeno-site/app/services/renovation/page.tsx | 装修服务主入口 | 01、02、05 | 证据、边界、FAQ、先自查再付费 | 无 | 服务卡里的居住表达从“真实居住”往“居住场景”收一点 |
| zeno-site/app/services/ai-workflow/page.tsx | AI 咨询并行入口 | 01、04、06 | “先跑通一个真实场景”这句核心判断 | 与装修业主主路径切得更清 | 少用泛“系统”，多写具体任务类型 |
| zeno-site/app/about/page.tsx | 信任页 | 00、01、03、04 | “不是标准官网”“我相信什么”“我不做什么” | OPC、一人公司、自由事业系统等内容移到后半段或 AI 专题 | 第一屏先证明为什么这个人值得听，再谈更大的职业实验 |
| zeno-site/app/blog/page.tsx | 文章总表 | 02、04 | 按分类看文章和“不按流量排序”的气质 | 无 | 分类名和引导文案持续围绕判断力，而不是泛博客感 |
| zeno-site/app/blog/[slug]/page.tsx | 文章详情模板 | 02、03、05 | 作者说明、分类型 CTA、继续阅读 | 无 | CTA 继续按问题而不是按大类泛跳转 |
| zeno-site/app/topics/page.tsx | 连续阅读入口 | 01、02、04 | “连续问题的连续回答”这句定位 | 无 | 专题命名与说明继续往前台问题和同频读者层过渡 |
| zeno-site/app/contact/page.tsx | 联系过滤页 | 01、04、05 | 先判断再联系、适合/不适合场景 | 可把更细的产品入口留给服务页 | 联系页避免再解释太多品牌世界观 |

## 2. 导航与公共组件映射

| 资产 | 处理判断 |
| --- | --- |
| zeno-site/lib/navigation.ts | 保留“按问题进入”“工具与资料”“AI 工作流”“找我帮你看”的骨架，继续坚持问题分流型导航 |
| zeno-site/components/Footer.tsx | 保留页脚简洁结构；品牌一句话应更贴近主站主叙事，而不是泛“自由事业系统” |
| CTA、PageHero、ArticleCard、ServiceCard | 保留组件风格，但具体文案必须服从 03 写作风格和 05 产品路径 |

## 3. 英文页映射

| 页面 | 判断 | 处理建议 |
| --- | --- | --- |
| zeno-site/app/en/page.tsx | 保留 | 作为精选版首页，继续讲 Zeno 的 front-line origin 和判断气质 |
| zeno-site/app/en/services/page.tsx | 重写优先级高 | 现在太像 generic services catalog，需要改成“front-line renovation judgment + AI-enabled practice”的精选入口 |
| zeno-site/app/en/resources/page.tsx | 重写 | 不要像普通资源清单页，应更清楚地区分 homeowner tools 和 AI workflow assets |
| zeno-site/app/en/blog、/en/topics、/en/about | 保留但持续精选 | 英文页不求全，只求准 |

## 4. 旧 Markdown 资产映射

| 资产 | 判断 | 说明 |
| --- | --- | --- |
| website/content/home.md | 保留但换位置 | 是旧首页骨架，可继续作为首页文案素材库 |
| website/content/about.md | 保留但换位置 | About 页方向准，但现在要让“为什么值得信任”更靠前 |
| website/content/resources.md | 保留观点，重写表达 | 资料说明有用，但仍偏说明文口气 |
| website/content/contact.md | 暂时归档 | 占位信息太多，不再作为现行标准 |
| 赞诺内容资产系统/09_网站母站/首页.md | 保留 | 早期首页结构清楚，是很好的内容种子 |
| 赞诺内容资产系统/09_网站母站/关于我.md | 保留但换位置 | 很多段落适合 About 后半部分、专题页或 AI 文章 |
| 赞诺内容资产系统/09_网站母站/服务页.md | 保留 | 服务边界写得扎实，可作为服务说明母稿 |
| 赞诺内容资产系统/09_网站母站/资料库.md | 保留观点，重写表达 | “拿来就能用”很好，但现在要更按问题分流 |
| docs/服务转化链路说明.md | 保留观点，重写表达 | 转化链路有用，但邮箱和若干路径已过时 |

## 5. 内容库存映射

| 资产 | 判断 | 说明 |
| --- | --- | --- |
| zeno-site/data/articles.ts | 保留 | 当前已上线文章是主站信任资产 |
| zeno-site/data/articles-new.ts | 保留但待接入 | 是后续扩容的重要库存 |
| zeno-site/data/articles-additional.ts | 保留但待接入 | 需要按前台问题优先级重新排发布顺序 |
| 赞诺内容资产系统/09_网站母站/网站文章/01_居住与装修 | 重点保留 | 是前台主线最重要的内容矿脉 |
| 赞诺内容资产系统/09_网站母站/网站文章/05_AI与个体升级 | 重点保留 | 是底层 AI 叙事的主矿脉，但不能抢首页主叙事 |

## 6. 一句话结论

当前站点不是没内容，而是内容已经很多，问题在于主副叙事还没有被彻底分层。页面改版不是从零写，而是把已经有价值的资产放回更对的位置。