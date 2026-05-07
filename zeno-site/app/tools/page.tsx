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
    title: '报价初筛工具',
    category: '签约前',
    status: '已上线',
    price: '免费',
    persona: '手上已有报价单，但看不清风险的人。',
    description: '上传材料留在浏览器本地，对照报价单勾选关键边界，生成风险类型、追问话术和下一步入口。',
    href: '/tools/quote-check',
    cta: '上传报价单',
    next: [
      { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
      { label: '报价单审核服务', href: '/services/renovation#baojia-shenhe' },
    ],
  },
  {
    title: '装修预算风险自测',
    category: '预算结构',
    status: '已上线',
    price: '免费',
    persona: '预算有上限，但不知道钱该怎么分的人。',
    description: '用 8 个问题先分清你当前更像是报价风险、预算结构风险、施工流程风险，还是真实居住需求没厘清。',
    href: '/tools/budget-risk',
    cta: '开始自测',
    next: [
      { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
      { label: '预算结构诊断', href: '/services/renovation#yusuan-zixun' },
    ],
  },
  {
    title: 'AI 提示词体验场',
    category: 'AI 工作流',
    status: '已上线',
    price: '免费',
    persona: '有真实任务，不想先陷进工具堆的人。',
    description: '给真实工作场景生成可以直接用的提示词。适合传统行业人先跑一个任务，而不是先听抽象概念。',
    href: '/tools/prompts',
    cta: '去体验场',
    next: [
      { label: 'AI 工作流文章', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' },
      { label: 'AI 工作流咨询', href: '/services/ai-workflow' },
    ],
  },
  {
    title: 'Markdown 微信排版工具',
    category: '内容发布',
    status: '已上线',
    price: '免费',
    persona: '需要把文章稳定发布到公众号的人。',
    description: '把 Markdown 文稿转成微信公众号可直接粘贴的排版结果。适合写作和发布这一段工作流。',
    href: '/tools/md2wechat',
    cta: '打开工具',
    next: [
      { label: '内容资产 SOP', href: '/resources#content-system-sop' },
      { label: '关于 Zeno', href: '/about' },
    ],
  },
]

const categories = ['全部', '签约前', '预算结构', 'AI 工作流', '内容发布']

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
        subtitle="工具不负责制造更多页面，它只做一件事：把一个真实问题压缩到能被判断、能被执行。"
        note="如果工具已经让你看清问题，就去拿对应清单；如果工具看不明白的地方，可以找我帮你判断。"
        size="content"
      />

      <Container size="content" className="py-section">
        <div className="mb-7 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted">
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-5">
          {tools.map((tool) => (
            <article key={tool.title} className="border border-border bg-surface p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-widest">
                    <span className="text-stone">{tool.category}</span>
                    <span className="text-ink-faint">{tool.status}</span>
                    <span className="text-ink-faint">{tool.price}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-ink">{tool.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{tool.description}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    <span className="font-semibold text-ink">适合谁：</span>{tool.persona}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link href={tool.href} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-medium text-paper transition-colors hover:bg-stone/85">
                    {tool.cta}
                  </Link>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">工具之后</p>
                <div className="flex flex-wrap gap-3">
                  {tool.next.map((item) => (
                    <Link key={item.href + item.label} href={item.href} className="text-sm font-medium text-stone underline decoration-stone-light underline-offset-4 hover:decoration-stone">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">下一步</p>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            工具负责第一轮判断，资源负责把判断落实成清单和模板；服务只在问题已经足够具体，但你还需要人直接判断时再进入。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/resources" label="去资源页" variant="secondary" />
            <CTA href="/services#service-form" label="提交服务需求" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
