import Link from 'next/link'

/**
 * 文章底部 CTA 组件
 *
 * 根据 article.category 显示不同 CTA。
 * 设计原则：克制、不像硬广，与全站直角设计语言一致，移动端友好。
 */

type CTAConfig = {
  title: string
  description: string
  buttons: { label: string; href: string; variant?: 'primary' | 'secondary' }[]
}

const ctaByCategory: Record<string, CTAConfig> = {
  真实居住: {
    title: '装修前，先看懂预算和报价',
    description:
      '如果你正在准备装修，先从预算、报价和合同风险开始，把最容易失控的地方看清楚。',
    buttons: [
      { label: '领取报价审核清单', href: '/resources', variant: 'primary' },
      { label: '查看报价诊断服务', href: '/services', variant: 'secondary' },
    ],
  },
  'AI 实践': {
    title: '把 AI 接进真实工作流',
    description:
      '我会持续整理自己正在使用的 AI 提示词、内容流程和工具实践。',
    buttons: [
      { label: '体验 AI 提示词场', href: '/resources', variant: 'primary' },
      { label: '查看 AI 工作流咨询', href: '/services', variant: 'secondary' },
    ],
  },
  工具与产品: {
    title: '把经验变成可复用工具',
    description:
      '这里会逐步沉淀模板、清单、提示词和数字产品，不只是文章。',
    buttons: [
      { label: '进入工具与资料库', href: '/resources', variant: 'primary' },
      { label: '查看服务与合作', href: '/services', variant: 'secondary' },
    ],
  },
  一人公司: {
    title: '从重交付，走向轻系统',
    description:
      '我正在记录如何用网站、内容、AI、产品和自动化，搭建更自由的个人事业系统。',
    buttons: [
      { label: '查看服务与合作', href: '/services', variant: 'primary' },
      { label: '了解 Zeno', href: '/about', variant: 'secondary' },
    ],
  },
  判断与生活: {
    title: '在复杂现实里，保持清醒判断',
    description:
      '这些文章不急着成交，它们记录的是判断力、克制、长期选择和真实生活。',
    buttons: [
      { label: '了解 Zeno', href: '/about', variant: 'primary' },
      { label: '进入文章列表', href: '/blog', variant: 'secondary' },
    ],
  },
}

const fallback: CTAConfig = ctaByCategory['判断与生活']

interface Props {
  category: string
}

export default function ArticleCTA({ category }: Props) {
  const cfg = ctaByCategory[category] ?? fallback

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
      <div className="flex flex-wrap gap-3">
        {cfg.buttons.map((btn) => (
          <Link
            key={btn.href + btn.label}
            href={btn.href}
            className={
              btn.variant === 'primary'
                ? 'inline-flex items-center text-sm font-medium bg-stone text-white px-4 py-2 hover:bg-stone/85 transition-colors'
                : 'inline-flex items-center text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors'
            }
          >
            {btn.label} <span className="ml-1.5">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
