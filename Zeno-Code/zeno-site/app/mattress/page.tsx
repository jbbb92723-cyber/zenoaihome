import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '床垫判断资料｜产品页复核中',
  description:
    '床垫产品的规格、价格、供应链、试用与保修条款仍在复核。本页暂不接受购买，只保留公开的复核边界。',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://zenoaihome.com/mattress',
  },
}

const reopeningChecks = [
  '明确供应方、具体型号、材料规格和可追溯文件',
  '用可重复的方法核对样品尺寸、结构和关键参数',
  '把价格、交付、试用、退换、保修对象与责任写成正式条款',
  '完成真实试用，公开记录反馈、问题和产品修订',
]

export default function MattressPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '床垫判断资料',
          url: 'https://zenoaihome.com/mattress',
          description: '床垫产品资料复核中，当前不接受购买。',
          inLanguage: 'zh-CN',
          isPartOf: {
            '@type': 'WebSite',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com',
          },
        }}
      />

      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-16 sm:py-20">
          <p className="page-label mb-5">资料状态 / 复核中</p>
          <h1 className="page-title max-w-3xl">
            床垫产品页暂不售卖。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            原页面中的价格、材料参数、供应链和长期保修承诺，还没有形成足够完整的公开证据与正式条款。在这些内容核对完成前，不接受购买，也不把判断写成产品保证。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">
        <section className="max-w-3xl">
          <p className="page-label mb-4">重新开放条件</p>
          <h2 className="section-heading">先把产品证据补齐，再谈销售。</h2>
          <ol className="mt-7 border-y border-border">
            {reopeningChecks.map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-5 last:border-b-0"
              >
                <span className="text-sm font-semibold tabular-nums text-stone">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-7 text-ink">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 border-l-2 border-stone pl-5">
          <h2 className="text-lg font-semibold text-ink">当前替代入口</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
            床垫分类的历史文章也已暂停公开，待逐篇核对经历、参数与产品表述后再决定是否恢复。现阶段可以继续查看装修判断和其他公开实践。
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <CTA href="/renovation" label="查看装修判断" variant="primary" />
            <CTA href="/blog" label="返回公开实践" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
