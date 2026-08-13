import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Compass, Users, Shield, Cube, Sparkle } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'OPC 公开实践｜把真实经验变成可复用资产',
  description: 'Zeno 以 OPC 一人公司为起点，公开记录如何把传统行业经验变成判断、案例、内容、工具和服务，并在真实实践中验证。',
}

const modules = [
  {
    icon: Shield,
    title: '传统行业经验迁移',
    subtitle: '模块① 经验如何重新使用',
    cards: '卡 01-06',
    desc: '从 17 年经营和项目经历中，分辨哪些判断可以迁移到一人公司，哪些只能作为个案，并为每个结论补上来源和适用边界。',
    anchor: '经历证据 · 可以追溯',
  },
  {
    icon: Compass,
    title: '城市 OPC 在地验证',
    subtitle: '模块② 从南宁开始试验',
    cards: '卡 07-12',
    desc: '以南宁为当前实践场，记录本地需求、关系建立、小项目和交付过程。涉及东盟与跨境的内容，只收录已经核验的事实和实际案例。',
    anchor: '在地实践 · 持续验证',
  },
  {
    icon: Cube,
    title: '一人公司 AI 工作流',
    subtitle: '模块③ 工具如何进入工作',
    cards: '卡 13-18',
    desc: '围绕具体任务选择模型、整理上下文、搭建自动化并核算成本。判断标准不是工具数量，而是输出能否验收、流程能否维护。',
    anchor: '工具工作流 · 按结果验收',
  },
]

const cards = [
  { id: '01-06', vol: '经验迁移', items: '身份变化 · 可迁移经验盘点 · 资源边界 · 小步验证 · 服务边界 · 转型复盘' },
  { id: '07-12', vol: '城市实践', items: '需求观察 · 本地关系地图 · 线索记录 · 小项目验证 · 协作约定 · 交付回流' },
  { id: '13-18', vol: 'AI 工作流', items: '任务选择 · 模型与工具矩阵 · 上下文整理 · 自动化流程 · 数据边界 · 成本与质量' },
]

const practicePath = [
  { stage: '01', name: '公开记录', output: '短视频、文章和实践日志', desc: '把真实问题、判断过程和暂时无解的部分留下来。' },
  { stage: '02', name: '提炼方法', output: '方法卡、清单和任务模板', desc: '从具体案例中提炼可复用的步骤，同时标明适用边界。' },
  { stage: '03', name: '小范围试用', output: '交流、工作坊或一次具体交付', desc: '让他人用一次，记录哪里能用、哪里需要改，不预先承诺结果。' },
  { stage: '04', name: '共同实践', output: '星火者成员关系与协作记录', desc: '围绕真实项目建立反馈和连接，是否继续由双方实际情况决定。' },
  { stage: '05', name: '结果回流', output: '脱敏案例、复盘和下一版知识', desc: '把交付后的证据回流到内容和角色知识体系，持续修正方法。' },
]

const knowledgeSources = [
  { layer: '第一层', name: '长期经历', when: '过去', desc: '17 年传统行业经历提供了大量问题样本，但年限本身不等于方法；每个判断仍需回到案例和证据。', evidence: '履历、项目与复盘' },
  { layer: '第二层', name: '在地实践', when: '现在', desc: '以南宁作为当前观察样本，持续区分本地条件和可迁移机制，避免把个案包装成普遍答案。', evidence: '访谈、需求与交付记录' },
  { layer: '第三层', name: '跨角色翻译', when: '现在', desc: '把经营问题翻译成 AI 可以协助的任务，再把技术输出翻译成业务可验收的结果。', evidence: '输入、输出与验收标准' },
  { layer: '第四层', name: '知识回流', when: '持续', desc: '为方法保留来源、版本、适用条件和失效记录，让每次内容与交付都能修正下一版。', evidence: '版本、案例与失败条件' },
]

export default function OPCKnowledgePage() {
  return (
    <main className="bg-canvas text-ink">
      {/* Hero */}
      <section className="border-b border-border bg-ink px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-white/60">OPC 公开实践 · 一人公司经验资产化</p>
          <h1 className="editorial-display mt-4 max-w-[18ch] text-[2.4rem] leading-[1.1] text-white sm:text-[3.2rem]">
            以你的真实经验为起点，做出别人能使用的职业资产。
          </h1>
          <p className="mt-5 max-w-[42rem] text-base leading-8 text-white/70">
            这不是一套先写好的课程承诺，而是一个正在运行的实践档案：从真实问题出发，留下证据，制作最小交付，再用他人试用和复盘修正。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/55">
            <span>作者：陈国赞（Zeno）</span>
            <span aria-hidden>·</span>
            <span>传统行业经验资产化实践者</span>
            <span aria-hidden>·</span>
            <span>星火者共同体发起人</span>
          </div>
        </div>
      </section>

      {/* 三个实践模块 */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">实践模块</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            三条经验线，放进真实问题里验证。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            三条线分别对应我已经走过、正在做和持续验证的工作。它们不是预先包装完成的课程，而是会随着案例和复盘更新的实践档案。
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
            每张卡都从具体素材或实践问题出发，独立说明一个判断、步骤或边界。它既可以成为公开内容的骨架，也可以在试用和复盘后继续修订。
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

      {/* 实践路径 */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">从内容到交付</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            不是价格列表，是验证路径。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            公开内容负责让你看见判断过程，工具和小交付负责让你亲自验证。只有被真实使用、验收和复盘过的部分，才会进入下一版体系。
          </p>
          <div className="mt-10 space-y-2">
            {practicePath.map((item) => (
              <div key={item.stage} className="grid gap-2 border border-border bg-surface p-4 sm:grid-cols-[3rem_10rem_14rem_1fr] sm:items-center sm:gap-4">
                <span className="text-xs font-semibold tabular-nums text-stone">{item.stage}</span>
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="text-xs font-semibold text-stone">{item.output}</span>
                <span className="text-xs leading-relaxed text-ink-muted">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 知识来源 */}
      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-stone">知识来源</p>
          <h2 className="editorial-display mt-3 text-[2.2rem] leading-[1.15] sm:text-[3rem]">
            角色知识不是整理出来的，是验证出来的。
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            时间、地点和身份构成实践背景，持续记录与复盘让经验逐渐形成可复用资产。
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {knowledgeSources.map((m) => (
              <div key={m.layer} className="border border-border bg-canvas p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{m.layer} · {m.when}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold text-stone">证据：{m.evidence}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 公开实践边界 */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px] grid gap-10 lg:grid-cols-[0.55fr_0.45fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-stone">
              <Users size={24} aria-hidden />
              <span className="text-sm font-semibold">公开实践边界</span>
            </div>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">
              把方法放进你的真实工作里，先确认它是否适合你。
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-ink-muted">
              赞诺可以提供公开内容、免费工具、具体项目沟通和星火者共同体等不同入口。它们都不承诺收入、客户、项目结果或合伙资格；涉及付费服务时，会在开始前单独确认范围、交付物、周期和退款边界。
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
              这套内部方法不是先在书房里宣布完成，而是在真实问题、小交付、他人试用和复盘中逐步修正。与其用评审票数证明方法成立，不如留下谁用过、改了什么和哪里失效。
            </p>
            <p className="mt-3 text-xs text-ink-muted">不卖 OPC 的梦想，卖 OPC 的伤疤和地图。</p>
          </div>
        </div>
      </section>
    </main>
  )
}
