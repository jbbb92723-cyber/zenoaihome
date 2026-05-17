import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于我 | Zeno',
  description:
    '我是 Zeno。装修行业 16 年，从工地现场走出来。现在专注把签约前报价风险判断整理成文章、清单、工具和服务。',
}

export default function AboutPage() {
  return (
    <>
      <div className="border-b border-border py-12 sm:py-16">
        <Container size="content">
          <div className="grid items-end gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="page-label mb-4">关于我</p>
              <h1 className="page-title mb-5">我是 Zeno</h1>
              <p className="max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">
                从装修现场走出来的人。现在只做一件很窄的事：帮准备签约的业主看清报价里没说清的风险。
              </p>
            </div>
            <div className="flex shrink-0 items-end gap-3">
              <div className="border-l-[3px] border-[#9a5424] pl-4">
                <p className="text-[3.5rem] font-bold leading-none tracking-tight text-[#272421]">16</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#9a5424]">年装修现场</p>
              </div>
              <div className="mb-1 h-8 w-px bg-[#e7ded3]" />
              <div>
                <p className="text-sm font-medium text-[#272421]">报价 · 预算 · 合同</p>
                <p className="text-xs text-[#7b6d5d]">经验做成工具和服务</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="content" className="py-14 sm:py-16">
        <section className="mb-12">
          <h2 className="section-heading mb-5">为什么专注签约前判断</h2>
          <p className="text-base leading-[1.85] text-ink">
            装修最难的地方，不只是施工本身，而是业主在信息不对称的情况下，要连续做很多高成本、低容错的判断。
          </p>
          <p className="mt-4 text-base leading-[1.85] text-ink">
            我现在只把入口收在一个点上：签约前报价风险初筛。先看清漏项、模糊项、增项口子、付款节点和合同边界，再决定能不能继续签。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="section-heading mb-5">16 年现场积累</h2>
          <p className="text-base leading-[1.85] text-ink">
            这些年我跑过工地、盯过施工、看过很多报价单，也处理过不少业主和施工方之间的分歧。
            现场经验最后沉淀成一种模式识别能力：哪里没写清，后面大概率会出问题。
          </p>
          <p className="mt-4 text-base leading-[1.85] text-ink">
            这个网站不是装修公司官网，也不是泛装修百科。它更像一个签约前判断工作台：文章讲方法，清单帮你对照，工具帮你初筛，服务处理具体材料。
          </p>
          <div className="mt-5">
            <Link href="/blog/zeno-from-renovation-to-opc" className="text-sm text-stone hover:underline underline-offset-2">
              阅读完整文章：从装修现场到一人公司 →
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-heading mb-5">AI 在这里是什么位置</h2>
          <p className="text-base leading-[1.85] text-ink">
            AI 是辅助层，不是品牌主叙事。它适合整理资料、生成追问清单、把经验变成可复用的检查流程，但最后的边界判断仍然需要人的经验和克制。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="section-heading mb-5">你可以怎么开始</h2>
          <p className="text-base leading-[1.85] text-ink">
            <strong>从 ¥0 到 ¥1499</strong>，按你现在的情况选：免费报价初筛 → ¥39 风险自查指南 → ¥399 / ¥699 / ¥1499 三档人工判断。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="primary" />
            <CTA href="/pricing/baojia-guide" label="看 ¥39 指南" variant="secondary" />
            <CTA href="/services/renovation" label="看人工服务" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}
