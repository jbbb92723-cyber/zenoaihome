import Link from 'next/link'
import type { Service } from '@/data/services'

interface RelatedArticle {
  label: string
  href: string
}

interface ServiceCardProps {
  service: Service
  index: number
  relatedArticles?: RelatedArticle[]
}

export default function ServiceCard({ service, index, relatedArticles = [] }: ServiceCardProps) {
  return (
    <div id={service.slug} className="border border-border overflow-hidden scroll-mt-20 bg-surface">
      <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-stone/30 text-xs font-mono shrink-0 mt-[3px]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink leading-tight">{service.title}</h2>
            <p className="text-sm text-stone mt-1">{service.tagline}</p>
          </div>
        </div>
        <span className="shrink-0 self-start border border-stone/30 text-stone text-xs px-3 py-1 font-medium whitespace-nowrap">
          {service.price}
        </span>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">这项服务解决什么</p>
          <p className="text-sm text-ink leading-relaxed">{service.solves}</p>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">{service.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">适合谁</p>
            <ul className="space-y-2">
              {service.forWho.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-stone text-xs shrink-0 mt-1">+</span>
                  <span className="text-sm text-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">不适合谁</p>
            <ul className="space-y-2">
              {service.notForWho.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-ink-muted text-xs shrink-0 mt-1">-</span>
                  <span className="text-sm text-ink-muted leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你需要提供什么</p>
            <ul className="space-y-2">
              {service.youProvide.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-stone text-xs shrink-0 mt-1">-</span>
                  <span className="text-sm text-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {service.checks && service.checks.length > 0 ? (
              <>
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">我会帮你看</p>
                <ul className="space-y-2">
                  {service.checks.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-stone text-xs shrink-0 mt-1">-</span>
                      <span className="text-sm text-ink leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你会得到什么</p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  这项服务更偏向判断路径和工作流拆解，不是模板打包，不是一次性交钥匙。
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">交付结果</p>
          <ul className="space-y-2">
            {service.iDeliver.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-stone text-xs shrink-0 mt-1">-</span>
                <span className="text-sm text-ink leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l-2 border-stone-light pl-4">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">服务边界</p>
          <p className="text-sm text-ink-muted leading-relaxed">{service.boundary}</p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border bg-stone-pale/20 space-y-3">
        <div>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">咨询方式</p>
          <p className="text-sm text-ink-muted leading-relaxed">{service.contactNote}</p>
        </div>

        {relatedArticles.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">先了解判断逻辑</p>
            <div className="space-y-1.5">
              {relatedArticles.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
                >
                  <span className="text-stone/60">→</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}