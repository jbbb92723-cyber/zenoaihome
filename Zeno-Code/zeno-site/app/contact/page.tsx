import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: '联系赞诺｜培训、AI项目与星火者共同体',
  description: '联系赞诺。适用于AI培训、工作流、企业知识库、智能体、网站开发、星火者共同体和装修判断相关沟通。',
  alternates: { canonical: 'https://zenoaihome.com/contact' },
}

const directions = [
  {
    title: 'AI 培训',
    body: '请说明行业、人数、形式、团队使用过的工具，以及最希望解决的三个工作场景。',
    note: '微信备注：培训',
    href: '/training',
  },
  {
    title: 'AI 项目',
    body: '请说明现在怎么做、卡在哪里、已有资料和希望交付的结果。知识库、智能体和网站需求都适用。',
    note: '微信备注：AI项目',
    href: '/services',
  },
  {
    title: '星火者共同体',
    body: '请先介绍你是谁、正在做什么、能提供什么、目前需要什么。共同体仍处于发起阶段。',
    note: '微信备注：星火者',
    href: '/community',
  },
  {
    title: '装修判断',
    body: '请提供城市、面积、装修阶段，以及已有的户型、报价或合同材料。也可以先使用站内免费工具。',
    note: '微信备注：装修',
    href: '/tools',
  },
]

const messageTemplate = [
  '我是谁 / 所在企业或项目',
  '现在具体怎么做，卡在哪一步',
  '已经有哪些材料、工具或人员',
  '希望赞诺帮助交付什么结果',
  '期望时间，以及需要提前说明的边界',
]

export default function ContactPage() {
  return (
    <main className="bg-canvas text-ink">
      <PageHero
        label="联系赞诺"
        title="先把来意和真实问题说清楚。"
        subtitle="信息越具体，越容易判断是否适合继续。不能做的项目，我会直接说明；能做的，先确认范围和交付边界。"
      />

      <Container className="py-16 sm:py-20 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold text-stone">四种来意</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">找到对应入口，再发消息。</h2>
          </div>
          <div className="border-t border-border">
            {directions.map((item, index) => (
              <article key={item.title} className="grid gap-4 border-b border-border py-6 sm:grid-cols-[3rem_10rem_1fr_auto] sm:items-center">
                <span className="text-xs font-semibold tabular-nums text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-stone">{item.note}</p>
                </div>
                <p className="text-sm leading-7 text-ink-muted">{item.body}</p>
                <Link href={item.href} className="text-sm font-semibold text-ink hover:text-stone">了解 →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 border-y border-border py-12 sm:mt-24 sm:py-16 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-sm font-semibold text-stone">联系方式</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">优先使用微信沟通具体事项。</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border-l-2 border-stone pl-5">
              <p className="text-xs font-semibold text-ink-faint">微信</p>
              <p className="mt-2 text-xl font-semibold text-ink">zanxiansheng2025</p>
              <p className="mt-2 text-sm leading-7 text-ink-muted">适合培训、项目、共同体和装修相关沟通。请务必备注来意。</p>
            </div>
            <div className="border-l-2 border-stone pl-5">
              <p className="text-xs font-semibold text-ink-faint">邮箱</p>
              <p className="mt-2 break-all text-xl font-semibold text-ink">zenoaihome@qq.com</p>
              <p className="mt-2 text-sm leading-7 text-ink-muted">适合正式合作说明、较长背景资料或需要保留完整记录的沟通。</p>
            </div>
            <div className="border-l-2 border-stone pl-5">
              <p className="text-xs font-semibold text-ink-faint">公众号</p>
              <p className="mt-2 text-xl font-semibold text-ink">Zeno AI装修笔记</p>
              <p className="mt-2 text-sm leading-7 text-ink-muted">当前主要内容发布渠道，后续会随个人品牌定位逐步更新。</p>
            </div>
            <div className="border-l-2 border-stone pl-5">
              <p className="text-xs font-semibold text-ink-faint">所在城市</p>
              <p className="mt-2 text-xl font-semibold text-ink">广西南宁</p>
              <p className="mt-2 text-sm leading-7 text-ink-muted">培训和项目可根据实际情况沟通线上或线下形式。</p>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-10 bg-surface-warm p-7 sm:mt-24 sm:p-10 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="text-sm font-semibold text-stone">消息模板</p>
            <h2 className="editorial-display mt-4 text-[2.4rem] leading-[1.12] sm:text-[3.3rem]">五句话，说清一个合作问题。</h2>
          </div>
          <ol className="border-t border-border">
            {messageTemplate.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr] border-b border-border py-4 text-sm leading-7 text-ink-muted">
                <span className="font-semibold tabular-nums text-stone">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 border-t border-border pt-10 sm:mt-20">
          <p className="max-w-3xl text-sm leading-7 text-ink-muted">不适合的情况：只问“AI 能做什么”但不提供场景；希望免费获得完整方案；把高风险决策完全交给 AI；需求范围持续变化却不愿重新确认交付。</p>
        </section>
      </Container>
    </main>
  )
}
