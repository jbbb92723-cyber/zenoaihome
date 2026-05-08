import Link from 'next/link'
import type { ToolSeoAsset } from '@/data/toolSeoAssets'

interface ToolSeoAssetSectionProps {
  asset: ToolSeoAsset
}

export default function ToolSeoAssetSection({ asset }: ToolSeoAssetSectionProps) {
  return (
    <section className="border-t border-border bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">SEO / GEO Asset</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{asset.scenarioTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{asset.searchIntent}</p>
            <div className="mt-5 border border-border bg-surface-warm p-5">
              <p className="text-sm font-semibold text-ink">Zeno 的判断口径</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{asset.zenoNote}</p>
            </div>
            <div className="mt-3 border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-ink">全国使用提醒</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{asset.nationalNote}</p>
            </div>
          </div>

          <div className="space-y-6">
            <article className="border border-border bg-surface p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-ink">案例式说明</h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-muted">
                {asset.scenario.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <article className="border border-border bg-surface p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-ink">常见问题</h3>
              <div className="mt-4 divide-y divide-border">
                {asset.faqs.map((faq) => (
                  <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-ink">{faq.question}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">Next Step</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">看完工具以后，按结果继续走</h3>
            </div>
            <Link href="/tools" className="text-sm font-semibold text-stone underline decoration-stone-light underline-offset-4 hover:decoration-stone">
              返回工具工作台
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {asset.links.map((item) => (
              <Link key={item.href + item.label} href={item.href} className="border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm">
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
