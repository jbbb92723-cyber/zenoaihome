import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '工具页',
  description:
    '先用工具把问题缩小，再决定要不要拿资料或进入服务。这里放的是已经能直接用的中文工具入口。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const tools = [
  {
    title: '装修预算风险自测',
    description: '用 8 个问题先分清你当前更像是报价风险、预算结构风险、施工流程风险，还是真实居住需求没厘清。',
    href: '/tools/budget-risk',
    cta: '开始自测',
  },
  {
    title: 'AI 提示词体验场',
    description: '给真实工作场景生成可以直接用的提示词。适合传统行业人先跑一个任务，而不是先听抽象概念。',
    href: '/tools/prompts',
    cta: '去体验场',
  },
  {
    title: 'Markdown 微信排版工具',
    description: '把 Markdown 文稿转成微信公众号可直接粘贴的排版结果。适合写作和发布这一段工作流。',
    href: '/tools/md2wechat',
    cta: '打开工具',
  },
]

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '工具页',
            url: 'https://zenoaihome.com/tools',
            description: '可直接使用的工具入口。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '工具列表',
            itemListElement: tools.map((tool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: tool.title,
              url: `https://zenoaihome.com${tool.href}`,
            })),
          },
        ]}
      />

      <PageHero
        label="工具页"
        title="先把问题缩小，再决定下一步"
        subtitle="我放在这里的工具，不是为了看起来多，而是为了先把一个真实问题压缩到能被判断、能被执行的程度。"
        note="工具不替代判断，只负责先减少混乱。"
        size="content"
      />

      <Container size="content" className="py-section">
        <div className="space-y-6">
          {tools.map((tool) => (
            <div key={tool.title} className="border border-border bg-surface p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-base font-semibold text-ink mb-2">{tool.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed max-w-xl">{tool.description}</p>
              </div>
              <Link href={tool.href} className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors whitespace-nowrap self-start">
                {tool.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">下一步</p>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            如果工具已经帮你把问题缩到足够具体，就去资源页拿对应清单；如果已经缩到“我知道问题在哪，但需要人直接判断”，再进入服务页。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/resources" label="去资源页" variant="secondary" />
            <CTA href="/services" label="去服务页" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}