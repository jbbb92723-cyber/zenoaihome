import Link from 'next/link'
import { categoryNameToSlug, mapLegacyCategoryToSlug } from '@/data/content/categories'

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

// 装修全案判断 → 免费初筛 → 旗舰审查
const RENO_CTA: CTAConfig = {
  title: '已经拿到报价？先做一轮规则初筛。',
  description: '按问题勾选已经写清的边界，先整理待确认项。工具不会自动读懂报价，也不替代结合原文的人工审查。',
  primary: { label: '免费初筛 →', href: '/tools/quote-check' },
  secondary: { label: '看装修方法 →', href: '/renovation' },
}

// 床垫产品已押后，只引导到公开文章和装修判断。
const MATTRESS_CTA: CTAConfig = {
  title: '把睡眠需求写成可比较的条件。',
  description: '先记录常用睡姿、软硬偏好、同睡干扰、尺寸和售后要求，再回到具体型号、试睡条件与书面条款核对。',
  primary: { label: '查看资料复核状态', href: '/mattress' },
  secondary: { label: '返回公开实践', href: '/blog' },
}

// 生活方式 → 关于页 / 联系
const LIFESTYLE_CTA: CTAConfig = {
  title: '如果这些让你有了新的想法——',
  description: '关于居住、关于生活、关于你想怎么过每一天。想深入聊聊你的情况，可以找我。',
  primary: { label: '了解我是谁', href: '/about' },
  secondary: { label: '联系我', href: '/contact' },
}

// AI 落地判断 / 一人公司 / 把自己重做一遍 → 星火者共同体
const AI_CTA: CTAConfig = {
  title: '如果你也在重新搭建自己的工作方式——',
  description: '赞诺·星火者共同体正在连接一群用 AI 重做产品、内容和业务的独立实践者。先了解共同体，再判断彼此是否适合。',
  primary: { label: '了解星火者共同体', href: '/community' },
  secondary: { label: '查看 AI 服务', href: '/services' },
}

// 默认（暂无分类匹配）
const DEFAULT_CTA: CTAConfig = {
  title: '拿不准下一步该做什么？',
  description: '先用自检工具整理需求和材料；仍需结合具体文件判断时，再联系 Zeno 确认范围。',
  primary: { label: '免费居住需求自检 →', href: '/living-diagnosis' },
  secondary: { label: '联系 Zeno', href: '/contact' },
}

/**
 * 根据 parentCategory slug 匹配 CTA
 * 兼容旧 category 字段的中文名
 */
function pickCTA(parentCategory?: string, legacyCategory?: string): CTAConfig {
  const slug = parentCategory?.trim()
    || categoryNameToSlug[legacyCategory ?? '']
    || mapLegacyCategoryToSlug(legacyCategory ?? '')

  if (slug === 'renovation') return RENO_CTA
  if (['mattress', 'buying', 'material', 'insider', 'care'].includes(slug)) return MATTRESS_CTA
  if (slug === 'lifestyle' || slug === 'about') return LIFESTYLE_CTA
  if (['ai', 'ip', 'opc', 'solo-method', 'projects', 'community', 'ai-school'].includes(slug)) return AI_CTA
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
