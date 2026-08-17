import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import StructuredData from '@/components/ui/StructuredData'
import { currentPractice, humanAiProtocol } from '@/data/practice/experiments'

export const metadata: Metadata = {
  title: '正在验证｜实践、反馈与修订｜赞诺',
  description: '记录赞诺正在验证的问题、使用的依据、真实反馈和方法修订。公开过程，也公开尚未成立的部分。',
  alternates: { canonical: 'https://zenoaihome.com/practice' },
}

const evidenceLevels = [
  { code: '01', title: '公开记录', body: '写清问题、原始判断、依据和仍然未知的部分。' },
  { code: '02', title: '实际试用', body: '有人把工具、清单或方法放进自己的具体情境里使用。' },
  { code: '03', title: '明确交付', body: '交付物、范围和日期可以被确认，不把内部整理当成客户结果。' },
  { code: '04', title: '用户反馈', body: '记录对方采取了什么行动、哪里有效、哪里拒绝或需要重做。' },
  { code: '05', title: '可复用', body: '同类问题反复出现，步骤和边界趋于稳定，才进入下一版方法。' },
]

const evaluationSignals = [
  '输入是否足够清楚，能否让另一个人复现判断过程？',
  '输出是否真的帮助用户做出下一步，而不只是看起来完整？',
  'AI 的候选判断被人工改了什么，为什么要改？',
  '用户之后做了什么，结果是否支持或推翻原来的判断？',
]

export default function PracticePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '实践与证据',
          url: 'https://zenoaihome.com/practice',
          description: metadata.description,
          author: { '@type': 'Person', name: '赞诺', url: 'https://zenoaihome.com/about' },
          inLanguage: 'zh-CN',
        }}
      />

      <main className="bg-canvas text-ink">
        <section className="border-b border-white/10 bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Container>
            <p className="text-sm font-semibold text-white/60">正在验证</p>
            <h1 className="editorial-display mt-5 max-w-[18ch] text-[2.4rem] leading-[1.1] sm:text-[3.2rem]">
              我正在验证什么，结果说明了什么。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              这里记录正在验证的问题、使用的依据、实际交付和方法修订。公开的不只是已经成立的结论，也包括还没有证据支持的部分。
            </p>
          </Container>
        </section>

        <Container className="py-section">
          <section className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div>
              <p className="page-label">当前实验</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">
                {currentPractice.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-ink-muted">{currentPractice.question}</p>
              <p className="mt-5 border-l-2 border-stone pl-4 text-sm leading-7 text-ink-muted">目标：{currentPractice.goal}</p>
            </div>

            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="border border-cinnabar/30 bg-cinnabar/5 px-2.5 py-1 text-cinnabar">{currentPractice.status}</span>
                  <span className="border border-border px-2.5 py-1 text-ink-muted">证据：{currentPractice.evidenceStatus}</span>
                </div>
                <span className="text-xs text-ink-faint">更新于 {currentPractice.updatedAt}</span>
              </div>
              <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
                {currentPractice.metrics.map((metric) => (
                  <div key={metric.label} className="min-h-24 bg-canvas p-4">
                    <p className="text-xs font-semibold text-ink-faint">{metric.label}</p>
                    <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">
                      {metric.current}<span className="mx-1 text-sm font-normal text-ink-faint">/</span>{metric.target}
                      <span className="ml-1 text-sm font-normal text-ink-muted">{metric.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-l-2 border-cinnabar pl-4">
                <p className="text-xs font-semibold text-ink-faint">下一步</p>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{currentPractice.nextAction}</p>
              </div>
            </div>
          </section>

          <section className="mt-20 border-y border-border py-12 sm:mt-24 sm:py-16">
            <div className="max-w-3xl">
              <p className="page-label">证据层级</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">内部有资料，不等于外部已经成立。</h2>
              <p className="mt-5 text-base leading-8 text-ink-muted">一条方法只有经过使用、交付、反馈和重复，才会逐渐获得更高的可信度。点赞、阅读量和自我判断不替代用户结果。</p>
            </div>
            <div className="mt-10 border-t border-border">
              {evidenceLevels.map((item) => (
                <div key={item.code} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_10rem_1fr] sm:items-baseline sm:gap-5">
                  <span className="text-xs font-semibold tabular-nums text-stone">{item.code}</span>
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="text-sm leading-7 text-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
            <div>
              <p className="page-label">人机协作协议</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">AI 可以加快整理，不能替现实承担责任。</h2>
              <p className="mt-5 text-sm leading-7 text-ink-muted">每一次公开实践都尽量保留原始判断、AI 的质疑、人工的取舍和结果的回写。</p>
            </div>
            <ol className="border-t border-border">
              {humanAiProtocol.map((stage) => (
                <li key={stage.code} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_10rem_1fr] sm:items-baseline sm:gap-5">
                  <span className="text-xs font-semibold tabular-nums text-cinnabar">{stage.code}</span>
                  <h3 className="text-base font-semibold text-ink">{stage.title}</h3>
                  <p className="text-sm leading-7 text-ink-muted">{stage.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20 border border-border bg-surface-warm p-6 sm:mt-24 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr]">
              <div>
                <p className="page-label">未来评估</p>
                <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">让每一次使用都能改变下一版。</h2>
              </div>
              <div>
                <ul className="space-y-4">
                  {evaluationSignals.map((signal) => (
                    <li key={signal} className="border-b border-border pb-4 text-sm leading-7 text-ink-muted last:border-0 last:pb-0">{signal}</li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">看方法示例 <span aria-hidden>→</span></Link>
                  <Link href="/community" className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink">进入星火者实践俱乐部 <span aria-hidden>→</span></Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">提出一个真实问题 <span aria-hidden>→</span></Link>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </>
  )
}
