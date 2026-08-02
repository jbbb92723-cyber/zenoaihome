import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Compass, Target, Users, Shield, Cube, Lightning, Sparkle } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'OPC 知识体系 v3.0｜一人公司从理论到实战',
  description: 'Zeno 的 OPC 课程体系：传统行业转型实战 · 城市 OPC 落地实操 · 一人公司 AI 武器库。18 张方法卡 + 三卷作战手册 + 7 层定价阶梯。在南宁，用 17 年的伤疤和 AI 的武器，带你建一个只有你能建的一人公司。',
}

const modules = [
  {
    icon: Shield,
    title: '传统行业转型实战',
    subtitle: '卷① 转型生存算法',
    cards: '卡 01-06',
    desc: '从部门主任到光杆司令的第一天。睡宝集团内斗、城堡项目 3000 万资金管理、转型决策树——17 年伤疤压缩成的生存算法。',
    anchor: '时间纵深 · 无法加速',
  },
  {
    icon: Compass,
    title: '城市 OPC 落地实操',
    subtitle: '卷② 城市通关手册',
    cards: '卡 07-12',
    desc: '二线城市 OPC 生态评估、本地化获客飞轮、东盟跨境合规导航。南宁东盟谷物理驻地——不是线上课，是实地。',
    anchor: '地理锚点 · 无法搬家',
  },
  {
    icon: Cube,
    title: '一人公司 AI 武器库',
    subtitle: '卷③ AI 私有化部署',
    cards: '卡 13-18',
    desc: '大模型选型矩阵、Prompt 军工化、自动化流水线。传统老板 + 真实技术能力的杂交——OPC 圈里找不到第二个。',
    anchor: '杂交稀缺 · 无法速成',
  },
]

const cards = [
  { id: '01-06', vol: '转型生存算法', items: '身份转换罗盘 · 资源断舍离 · 生存算法决策树 · 反脆弱定价法 · 从属到主权 · 转型试错日志' },
  { id: '07-12', vol: '城市通关手册', items: '二线城市评估 · 本地化获客飞轮 · 东盟跨境合规 · 物理护城河搭建 · 城市资源杠杆 · 跨境物流清单' },
  { id: '13-18', vol: 'AI 私有化部署', items: '大模型选型矩阵 · 一人公司 AI 堆栈 · Prompt 军工化 · 自动化流水线 · 平民数据工程 · AI 成本核算' },
]

const pricing = [
  { price: '¥0', product: '转型日记（短视频/公众号）', depth: 'L1→L2', desc: '建立气质认知' },
  { price: '¥9.9', product: '18 张 OPC 方法卡', depth: 'L2→L3', desc: '筛选付费用户' },
  { price: '¥199', product: '三卷作战手册（电子版）', depth: 'L3→L4', desc: '建立体系信任' },
  { price: '¥1,999', product: '季度实战训练营', depth: 'L4', desc: '跟 Zeno 一起做项目' },
  { price: '¥3,999/年', product: '星火者社群年费', depth: 'L4→L5', desc: '长期关系绑定' },
  { price: '¥19,999', product: '南宁 3 天实地陪跑 + 90 天跟进', depth: 'L5', desc: '物理护城河变现' },
  { price: '¥49,999', product: '跨境 OPC 合伙人', depth: 'L5', desc: '高净值合作网络' },
]

const moat = [
  { layer: '第一层', name: '时间护城河', when: '过去时', desc: '17 年传统行业经历。没有人能缩短这 17 年的距离。', level: '★★★★★' },
  { layer: '第二层', name: '地理护城河', when: '现在时', desc: '南宁东盟谷物理驻地。别人可以在线上模仿，没办法说"来南宁，我带你看"。', level: '★★★★☆' },
  { layer: '第三层', name: '身份护城河', when: '现在时', desc: '传统老板 + 真实技术能力。商业讲师学不会技术，技术人讲不了商业。', level: '★★★★☆' },
  { layer: '第四层', name: '知识复利护城河', when: '将来时', desc: '内部 CODE 循环。对手今天抄走所有内容，三个月后你已进化到下一代。', level: '★★★★★' },
]

export default function OPCKnowledgePage() {
  return (
    <main className="bg-canvas text-ink">
      {/* Hero */}
      <section className="border-b border-border bg-ink px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-white/60">OPC 课程体系 v3.0 · 七视角评审终稿</p>
          <h1 className="editorial-display mt-4 max-w-[18ch] text-[2.4rem] leading-[1.1] text-white sm:text-[3.2rem]">
            在南宁，用 17 年的伤疤和 AI 的武器，带你建一个只有你能建的一人公司。
          </h1>
          <p className="mt-5 max-w-[42rem] text-base leading-8 text-white/70">
            不是"最好的 OPC 课程"，是"唯一的跨境 OPC 实战体系"。三层护城河 + 知识复利引擎 + 7 层定价阶梯——从免费内容到 ¥49,999 跨境合伙人，每一层都有对应的知识深度。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/55">
            <span>作者：陈国赞（Zeno）</span>
            <span aria-hidden>·</span>
            <span>南宁 OPC 圈城市主理人</span>
            <span aria-hidden>·</span>
            <span>星火者共同体发起人</span>
          </div>
        </div>
      </section>

      {/* 三个课程模块 */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">课程金字塔</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            三件事。不多不少。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            砍掉了 AI 专项层、产品化层、概念入门课。留下的三板斧，每一件都只有 Zeno 能教。
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <div key={mod.title} className="border border-border bg-surface p-6">
                  <Icon size={28} weight="duotone" className="text-stone" />
                  <span className="mt-3 inline-block text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{mod.anchor}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink">{mod.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{mod.subtitle} · {mod.cards}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{mod.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 18 张方法卡 */}
      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">知识资产</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            18 张方法卡 · 6+6+6 精确归属。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            每张卡 1 页 A4，独立可传播。背后是 87 页原始素材的 L1-L3 提炼。一张卡 = 一周的免费内容素材。
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {cards.map((c) => (
              <div key={c.vol} className="border border-border bg-canvas p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">卡 {c.id}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{c.vol}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{c.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 定价阶梯 */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">定价阶梯</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            不是价格列表，是信任阶梯。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            每一层对应一个渐进式总结深度（L1-L5）。同一套知识资产，不同提炼深度 = 不同产品形态。
          </p>
          <div className="mt-10 space-y-2">
            {pricing.map((p) => (
              <div key={p.price} className="grid grid-cols-[6rem_1fr_5rem_10rem] gap-4 border border-border bg-surface p-4 items-center text-sm">
                <span className="font-semibold text-ink tabular-nums">{p.price}</span>
                <span className="text-ink">{p.product}</span>
                <span className="text-xs font-semibold text-stone">{p.depth}</span>
                <span className="text-xs text-ink-muted">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 护城河 */}
      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">护城河体系</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            3+1 层。三层对外，一层对内。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            前三层防御——让别人追不上你。第四层进攻——让你加速远离别人。知识复利引擎每天只需 10 分钟。
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {moat.map((m) => (
              <div key={m.layer} className="border border-border bg-canvas p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{m.layer} · {m.when}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold text-stone">攻击难度 {m.level}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grand Slam Offer */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px] grid gap-10 lg:grid-cols-[0.55fr_0.45fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-stone">
              <Users size={24} aria-hidden />
              <span className="text-sm font-semibold">Grand Slam Offer</span>
            </div>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">
              用 Zeno 17 年的作战系统 + 南宁 3 天实地陪跑 + 90 天跟进，帮你搭建月入过万的盈利闭环。
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-ink-muted">
              做不到，全额退款，方法卡和三卷你留着。如果做成了，你就是下一个跨境 OPC 合伙人。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/community"
                className="motion-press inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep"
              >
                了解星火者 <ArrowRight size={17} />
              </Link>
              <Link
                href="/ai-tools/opc-diagnosis"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink"
              >
                先做免费诊断 <Sparkle size={16} />
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-stone pl-6">
            <p className="text-sm leading-relaxed text-ink-muted">
              这份知识体系不是书房里写出来的——是 Zeno 在南宁东盟谷做 OPC 圈城市主理人期间，从一个个真实创业者的真实问题里提炼出来的。v3.0 经过了七个视角的交叉评审（don哥/毛选/Dan Koe/Justin Welsh/Alex Hormozi/安先生/Tiago Forte），七票同意，零票反对。
            </p>
            <p className="mt-3 text-xs text-ink-muted">不卖 OPC 的梦想，卖 OPC 的伤疤和地图。</p>
          </div>
        </div>
      </section>
    </main>
  )
}

