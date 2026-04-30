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
    '把你手里的那张报价单（或者你正在算的预算表）发我看看。我会告诉你最该担心的一两个地方，不收费。',
  primary: { label: '把材料发我看', href: '/contact' },
  secondary: { label: '或者先做一次 10 分钟自测', href: '/tools/budget-risk' },
}

// AI / 一人公司相关分类
const AI_CTA: CTAConfig = {
  title: '如果你也想这样用 AI——',
  description:
    '我把现在自己每天在用的提示词放在这里，可以直接拿去改成你的版本。',
  primary: { label: '进入提示词体验场', href: '/tools/prompts' },
  secondary: { label: '或者看看这套系统是怎么搭起来的', href: '/blog/zeno-from-renovation-to-opc' },
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
