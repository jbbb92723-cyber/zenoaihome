import Link from 'next/link'

/**
 * 文章底部 CTA 组件
 *
 * 设计原则：
 * - 一篇文章只给"一个主动作 + 一个文字链"。多按钮稀释注意力。
 * - 按新版块分类提供对应的下一步行动建议。
 * - foodnote 文案跨版块一致（信任复利），但主动作因版块而异。
 */

type CTAConfig = {
  title: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

// 装修全案判断 → 报价初筛 / 服务
const RENO_CTA: CTAConfig = {
  title: '看完这篇，下一步可以——',
  description: '如果你手里已经有报价或合同，先做免费初筛看风险；还没定方案，先看服务路径选对入口。',
  primary: { label: '已有报价，做免费初筛', href: '/tools/quote-check' },
  secondary: { label: '查看服务路径', href: '/services' },
}

// 床垫选购判断 → 咨询服务
const MATTRESS_CTA: CTAConfig = {
  title: '看完这篇，还是拿不准？',
  description: '如果你正在几款床垫之间纠结，或者不确定自己的判断对不对——可以找我聊聊。',
  primary: { label: '看咨询服务', href: '/consulting' },
  secondary: { label: '先看更多床垫文章', href: '/blog?category=mattress' },
}

// 生活方式 → 关于页 / 联系
const LIFESTYLE_CTA: CTAConfig = {
  title: '如果这些让你有了新的想法——',
  description: '关于居住、关于生活、关于你想怎么过每一天。想深入聊聊你的情况，可以找我。',
  primary: { label: '了解我是谁', href: '/about' },
  secondary: { label: '联系我', href: '/contact' },
}

// 把自己重做一遍 / AI 落地判断 / OPC → 咨询服务 / OPC 版块
const AI_CTA: CTAConfig = {
  title: '如果你想看更多实战内容——',
  description: 'AI 知识库、IP 孵化和一人公司案例都在持续更新。OPC 社群里有一群和你一样的人。',
  primary: { label: '看 OPC 社群', href: '/blog?category=opc' },
  secondary: { label: '回到文章库', href: '/blog' },
}

// 默认（暂无分类匹配）
const DEFAULT_CTA: CTAConfig = {
  title: '如果还想继续看——',
  description: '去文章库按你关心的版块找，或者直接联系我聊聊你的具体情况。',
  primary: { label: '浏览文章库', href: '/blog' },
  secondary: { label: '联系我', href: '/contact' },
}

/**
 * 根据 parentCategory slug 匹配 CTA
 * 兼容旧 category 字段的中文名
 */
function pickCTA(parentCategory?: string, legacyCategory?: string): CTAConfig {
  const slug = parentCategory ?? ''
  if (slug === 'renovation' || legacyCategory === '真实居住' || legacyCategory === '工具与产品') return RENO_CTA
  if (slug === 'mattress') return MATTRESS_CTA
  if (slug === 'lifestyle' || legacyCategory === '判断与生活') return LIFESTYLE_CTA
  if (slug === 'ai' || slug === 'ip' || slug === 'opc' || legacyCategory === 'AI 实践' || legacyCategory === '一人公司') return AI_CTA
  return DEFAULT_CTA
}

interface Props {
  /** @deprecated 旧文章分类中文名（保留兼容），新文章应使用 parentCategorySlug */
  category?: string
  /** 新分类体系的一级分类 slug */
  parentCategorySlug?: string
}

export default function ArticleCTA({ category, parentCategorySlug }: Props) {
  const cfg = pickCTA(parentCategorySlug, category)

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
