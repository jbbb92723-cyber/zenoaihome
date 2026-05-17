import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { renovationProjectRisks } from '@/data/renovation-project-risks'

export const metadata: Metadata = {
  title: '施工项目风险库 | 装修报价风险判断 | ZenoAIHome',
  description:
    '按拆除、水电、防水、找平、瓷砖等施工项目，查看装修报价里应该写清什么、哪些地方容易漏项和增项。',
  alternates: {
    canonical: 'https://zenoaihome.com/project-risks',
  },
}

export default function ProjectRisksPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '施工项目风险库',
            url: 'https://zenoaihome.com/project-risks',
            description: '按施工项目整理装修报价签约前应写清的范围、漏项和增项风险。',
            inLanguage: 'zh-CN',
            hasPart: renovationProjectRisks.map((project) => ({
              '@type': 'WebPage',
              name: `${project.name}报价风险`,
              description: project.oneLine,
              url: `https://zenoaihome.com/project-risks/${project.slug}`,
            })),
          },
        ]}
      />

      <PageHero
        label="施工项目风险库"
        title="施工项目风险库"
        subtitle="按拆除、水电、防水、找平、瓷砖等项目，查看报价里应该写清什么、哪些地方容易漏项和增项。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/tools/quote-check" label="先做报价初筛" variant="primary" />
          <CTA href="/risk-dictionary" label="查风险词典" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">怎么用</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先按报价单上的项目找，不要泛泛看装修知识。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            你拿到报价单后，通常会看到拆除、水电、防水、找平、瓷砖、吊顶、安装这些项目。
            这里每一页只回答一件事：签约前，这个项目的报价必须写清什么，哪些词会留下增项口子。
          </p>
        </section>

        <section>
          <div className="mb-6 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">20 个施工项目</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">每张卡片先看常见增项风险，再进入项目页逐条核对。</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renovationProjectRisks.map((project) => (
              <article key={project.id} className="border border-border bg-surface p-5">
                <h2 className="text-base font-semibold text-ink">{project.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{project.oneLine}</p>
                <div className="mt-4 space-y-2">
                  {project.addOnRisks.slice(0, 2).map((risk) => (
                    <p key={risk} className="border-l-2 border-stone-light pl-3 text-xs leading-relaxed text-stone">
                      {risk}
                    </p>
                  ))}
                </div>
                <Link
                  href={`/project-risks/${project.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-stone underline-offset-4 hover:underline"
                >
                  查看项目风险
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">项目页只能帮你看单项风险，最终还要回到整份报价。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果一份报价里多个项目都没说清，先做一次免费报价初筛，把漏项、模糊项、增项口子和付款风险一起筛出来。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="做免费报价初筛" variant="primary" />
            <CTA href="/risk-dictionary" label="查风险词典" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
