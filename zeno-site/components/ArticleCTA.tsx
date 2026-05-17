import Link from 'next/link'

/**
 * 文章底部 CTA 组件
 *
 * 设计原则：
 * - 一篇文章只给"一个主动作 + 一个文字链"。多按钮稀释注意力。
 * - 把原来 5 套按分类的版本收成 2 套：装修类 / AI·一人公司类。
 *   入参仍然是 article.category，避免改动调用方。
 * - 文案严格遵循 Zeno 文字心率规则：动词、不夸张、不说教。
 */

type CTAConfig = {
  title: string
  description: string
  /** 主按钮 */
  primary: { label: string; href: string }
  /** 次链接（文字链，不是按钮） */
  secondary: { label: string; href: string }
}

// 装修相关分类（包含真实居住、工具、判断与生活）
const RENO_CTA: CTAConfig = {
  title: '你这篇看完了，下一步可以——',
  description:
    '如果你手里已经有报价，先用免费初筛把风险缩小，再决定要不要进入人工快审。',
  primary: { label: '先做免费报价初筛', href: '/tools/quote-check' },
  secondary: { label: '查看签约前检查模板', href: '/checklists' },
}

// AI / 一人公司相关分类
const AI_CTA: CTAConfig = {
  title: '如果你想先看当前主线——',
  description:
    'AI 现在只做辅助层。网站主线已经收窄为签约前报价风险判断。',
  primary: { label: '进入报价初筛', href: '/tools/quote-check' },
  secondary: { label: '查看风险词典', href: '/risk-dictionary' },
}

// 分类映射：哪些归装修、哪些归 AI / 一人公司
function pickCTA(category: string): CTAConfig {
  if (category === 'AI 实践' || category === '一人公司') return AI_CTA
  return RENO_CTA
}

interface Props {
  category: string
}

export default function ArticleCTA({ category }: Props) {
  const cfg = pickCTA(category)

  return (
    <section
      aria-label="继续阅读 / 下一步"
      className="border border-border bg-surface-warm/60 px-6 sm:px-8 py-7 sm:py-8 my-12"
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone mb-3">
        下一步
      </p>
      <h3 className="text-base sm:text-lg font-semibold text-ink leading-snug mb-2">
        {cfg.title}
      </h3>
      <p className="text-sm text-ink-muted leading-relaxed mb-5 max-w-prose">
        {cfg.description}
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          href={cfg.primary.href}
          className="inline-flex items-center text-sm font-medium bg-stone text-paper px-4 py-2 hover:bg-stone/85 transition-colors"
        >
          {cfg.primary.label} <span className="ml-1.5">→</span>
        </Link>
        <Link
          href={cfg.secondary.href}
          className="text-sm text-stone hover:underline underline-offset-2"
        >
          {cfg.secondary.label} →
        </Link>
      </div>
    </section>
  )
}
