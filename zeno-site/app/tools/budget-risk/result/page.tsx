/**
 * 装修预算风险自测 — 结果页
 *
 * 渲染策略：
 * - server component，从 URL search params 读答案，调用 scoreAnswers 出结果
 * - 答案不存数据库；用户刷新/分享链接得到同样的结果
 * - 三档 CTA 对应三种付费意愿：付钱买工具 / 付钱买服务 / 暂不付费继续读
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import RiskDimensionCard from '@/components/budget-risk/RiskDimensionCard'
import {
  scoreAnswers,
  DIMENSION_META,
  HEADLINE,
  NEXT_STEP,
  type Answers,
} from '../scoring'
import { questions } from '../questions'

export const metadata: Metadata = {
  title: '你的装修预算风险报告',
  description:
    '基于 Zeno 16 年装修一线经验整理的预算风险自测结果。',
}

interface Props {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function BudgetRiskResultPage({ searchParams }: Props) {
  const params = await searchParams

  // 把 URL 里的字符串还原成 Answers
  const answers: Answers = {}
  for (const q of questions) {
    const raw = params[q.id]
    if (!raw) continue
    answers[q.id] = q.type === 'multi' ? raw.split(',').filter(Boolean) : raw
  }

  const answeredCount = Object.keys(answers).length

  // 没答任何题，直接劝回
  if (answeredCount === 0) {
    return (
      <>
        <PageHero label="结果" title="还没拿到答案" subtitle="这页需要你的回答才能生成。" size="content" />
        <Container size="content" className="py-section">
          <p className="text-sm text-ink-muted leading-relaxed">
            这页需要你的回答才能生成。
          </p>
          <Link
            href="/tools/budget-risk"
            className="inline-block mt-6 text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
          >
            去做自测 →
          </Link>
        </Container>
      </>
    )
  }

  const { levels, dominant } = scoreAnswers(answers)
  const dims = (['R1', 'R2', 'R3', 'R4'] as const)

  return (
    <>
      <PageHero
        label="自测结果"
        title="你这次装修，最该先盯的是这一块"
        subtitle="下面的判断只用作参考——它不替你做决定，只帮你看清几个数字。"
        size="content"
      />

      <Container size="content" className="py-section">
        {/* 主导风险一句话 */}
        <div className="border-l-2 border-stone pl-5 mb-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">
            主要风险 · {DIMENSION_META[dominant].label}
          </p>
          <p className="text-base sm:text-lg text-ink leading-[1.85]">
            {HEADLINE[dominant]}
          </p>
        </div>

        {/* 四个维度 */}
        <div className="mb-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            四个维度
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dims.map((d) => (
              <RiskDimensionCard
                key={d}
                label={DIMENSION_META[d].label}
                level={levels[d]}
                description={DIMENSION_META[d].oneLine[levels[d]]}
                emphasized={d === dominant}
              />
            ))}
          </div>
        </div>

        {/* 如果是我，下一步会做这件事 */}
        <div className="mb-12 border border-border bg-surface-warm p-7 sm:p-9">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
            如果是我，下一步会做这一件事
          </p>
          <p className="text-base text-ink leading-[1.85]">
            {NEXT_STEP[dominant]}
          </p>
        </div>

        {/* 三档 CTA */}
        <div className="mb-10">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-5">
            接下来你可以——
          </p>
          <div className="space-y-3">
            <Link
              href="/pricing/baojia-guide"
              className="group flex items-start justify-between gap-4 border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                  花 39 元，自己继续优化
                </p>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  《装修报价避坑指南》6 张检查表，对照着把上面提到的几个口子一个一个堵上。
                </p>
              </div>
              <span className="text-stone shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/contact"
              className="group flex items-start justify-between gap-4 border border-border bg-surface p-5 hover:bg-surface-warm transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                  把材料发我，我帮你看一遍
                </p>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  微信发我三样东西：你在哪个城市、目前的报价 / 预算（截图就行）、你最拿不准的一个问题。
                </p>
              </div>
              <span className="text-stone shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <div className="border border-border p-5">
              <p className="text-sm font-semibold text-ink mb-2">先不付费，再读两篇</p>
              <div className="space-y-1.5">
                <Link
                  href="/blog/zhuangxiu-yusuan-weishenme-zongchao"
                  className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
                >
                  <span className="text-stone/60">→</span>
                  装修预算为什么总超？
                </Link>
                <Link
                  href="/blog/baojia-dan-zenme-kan"
                  className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
                >
                  <span className="text-stone/60">→</span>
                  报价单真正该怎么看
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <Link
            href="/tools/budget-risk"
            className="text-xs text-ink-muted hover:text-stone transition-colors"
          >
            ← 重新做一次
          </Link>
        </div>
      </Container>
    </>
  )
}
