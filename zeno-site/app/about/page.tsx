import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于我',
  description:
    '我是 Zeno。装修行业 16 年，从工地现场走出来。现在把报价、预算、施工、验收和居住场景里的判断，整理成文章、清单、工具和服务。',
}

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="border-b border-border pt-12 pb-10 sm:pt-16 sm:pb-12">
        <Container size="content">
          <div className="grid items-end gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="page-label mb-4">关于我</p>
              <h1 className="page-title mb-5">我是 Zeno</h1>
              <p className="max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">
                从工地走出来的现实派生活建造者。把普通业主真正会遇到的报价、预算、合同、施工和验收问题讲清楚。
              </p>
            </div>
            <div className="flex shrink-0 items-end gap-3">
              <div className="border-l-[3px] border-[#9a5424] pl-4">
                <p className="text-[3.5rem] font-bold leading-none tracking-tight text-[#272421]">16</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#9a5424]">年装修现场</p>
              </div>
              <div className="mb-1 h-8 w-px bg-[#e7ded3]" />
              <div>
                <p className="text-sm font-medium text-[#272421]">报价 · 预算 · 施工</p>
                <p className="text-xs text-[#7b6d5d]">经验做成工具和服务</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="content" className="py-14 sm:py-16">
        {/* 段 1：为什么专注装修判断 */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">为什么专注装修判断</h2>
          <p className="text-base text-ink leading-[1.85]">
            装修是普通人这辈子第一次为一件十万到百万级的事做长期决策。流程长、信息不对称、决策点又集中在签约前后那两周。
            一旦签下去，钱、时间、关系都很难再回头。
          </p>
          <p className="mt-4 text-base text-ink leading-[1.85]">
            我做的事很窄：只服务签约前后的判断。不教你审美、不卖材料、不接施工。把这一段做透，比铺开做所有事更值得。
          </p>
        </section>

        {/* 段 2：16 年现场 */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">16 年现场积累</h2>
          <p className="text-base text-ink leading-[1.85]">
            装修行业 16 年。跑过工地、盯过施工、审过无数报价单、处理过数不清的客户分歧。
            这些年教会我一件事：传统行业最大的消耗不在技术，在信息差、在信任成本、在好经验没被记下来。
          </p>
          <p className="mt-4 text-base text-ink leading-[1.85]">
            所以这个网站不是装修公司官网，也不是单纯的博客。
            它是我把过去 16 年攒下的现场判断，一件一件做成你能直接用的东西的地方——一篇文章、一张表、一个工具、一次咨询。
          </p>
          <div className="mt-5">
            <Link
              href="/blog/zeno-from-renovation-to-opc"
              className="text-sm text-stone hover:underline underline-offset-2"
            >
              阅读完整文章：从装修现场到一人公司 →
            </Link>
          </div>
        </section>

        {/* 段 3：为什么开始用 AI */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">为什么开始用 AI</h2>
          <p className="text-base text-ink leading-[1.85]">
            我不是技术出身。从客户沟通、报价审核、项目管理里走出来，知道传统行业真正痛的不是「不努力」，而是信息太散、沟通太慢、经验太难沉淀。
          </p>
          <p className="mt-4 text-base text-ink leading-[1.85]">
            所以我用 AI 做的不是炫技，是把客户问题、报价判断、施工经验、内容创作和服务流程，整理成可复用、可交易的工具和产品。
            AI 是让经验走得更远的工具，不是目的本身。
          </p>
        </section>

        {/* 段 4：经验 → 方法体系 */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">经验如何变成方法体系</h2>
          <p className="text-base text-ink leading-[1.85]">
            我把签约前后的判断拆成 6 个阶段：先看人、再看钱、再看合同、再看施工、再看验收、再看居住。
            每个阶段都对应一组文章、一份清单、一个工具，以及——如果你需要更直接的判断——一档服务。
          </p>
          <p className="mt-4 text-base text-ink leading-[1.85]">
            <strong>从 ¥0 到 ¥9800+</strong>，按你现在的情况选：免费工具自查 → ¥39 指南自学 → ¥399 / ¥699 / ¥1499 人工判断 → ¥9800+ 居住场景服务。
            不追求每个人都买，追求每个买的人都不后悔。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTA href="/start" label="去看 6 步判断系统" variant="primary" />
            <CTA href="/services" label="看服务边界" variant="secondary" />
            <CTA href="/contact" label="联系我" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}
