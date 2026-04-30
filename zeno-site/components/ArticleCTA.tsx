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
    title: '签合同前，先看懂你的报价单',
    description:
      '装修最容易踩坑的地方，不是选错材料，而是报价单里藏的模糊项和增项陷阱。用检查表逐项对照，10 分钟可能帮你省下几万块。',
    buttons: [
      { label: '领取《报价避坑指南》', href: '/pricing/baojia-guide', variant: 'primary' },
      { label: '下载报价审核清单', href: '/resources#zhuangxiu-qian', variant: 'secondary' },
    ],
  },
  'AI 实践': {
    title: '用 AI 帮你做装修判断',
    description:
      'AI 提示词包覆盖报价分析、施工沟通、选材方案生成——不需要懂 AI，只需要知道你要解决什么问题。',
    buttons: [
      { label: '免费体验 AI 提示词包', href: '/tools/prompts', variant: 'primary' },
      { label: '查看 AI 工作流服务', href: '/services#ai-neirong-xitong-zixun', variant: 'secondary' },
    ],
  },
  工具与产品: {
    title: '装修判断工具，免费用',
    description:
      '预算模板、报价清单、验收清单、AI 提示词——把判断力变成可操作的工具。',
    buttons: [
      { label: '进入工具与资料库', href: '/resources', variant: 'primary' },
      { label: '查看报价避坑指南', href: '/pricing/baojia-guide', variant: 'secondary' },
    ],
  },
  一人公司: {
    title: '想了解 Zeno 怎么做一人公司？',
    description:
      '从装修现场到线上系统，记录一个传统行业人如何用 AI、内容和产品化摆脱重交付。',
    buttons: [
      { label: '了解 Zeno', href: '/about', variant: 'primary' },
      { label: '查看服务与合作', href: '/services', variant: 'secondary' },
    ],
  },
  判断与生活: {
    title: '装修前，先建立判断力',
    description:
      '看懂报价、控住预算、识别风险——这些判断力比选哪个品牌的瓷砖重要一百倍。',
    buttons: [
      { label: '领取《报价避坑指南》', href: '/pricing/baojia-guide', variant: 'primary' },
      { label: '预算风险自测', href: '/resources#zhuangxiu-qian', variant: 'secondary' },
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
