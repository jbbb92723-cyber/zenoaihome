import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'
import { getArticleBySlug } from '@/data/content/articles'

type JudgmentSample = {
  code: string
  title: string
  scene: string
  livingGoal: string
  judgment: string[]
  questions: string[]
  articleSlugs: string[]
  tool: { label: string; href: string }
  service: { label: string; href: string }
}

export const metadata: Metadata = {
  title: '判断样张库：从生活目标到报价合同追问',
  description:
    'ZenoAIHome 判断样张库。用脱敏样张展示如何把生活方式、美学取舍、空间方案、预算边界、报价合同和交付风险放在一起判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/cases',
  },
}

const judgmentSamples: JudgmentSample[] = [
  {
    code: 'Sample 01',
    title: '“想要温馨耐看”，最后要落到哪些空间和预算边界？',
    scene: '还没定方案，收藏了很多灵感图，但说不清真正喜欢什么。',
    livingGoal: '希望家更放松、更有秩序，同时不要几年后看起来过时。',
    judgment: [
      '先把温馨拆成光线、材质触感、色彩密度和收纳露出比例。',
      '把客厅、餐厨、卧室按陪伴、独处和家务频率重新排序。',
      '预算优先给灯光、柜体系统、长期接触面和维护成本更低的材料。',
    ],
    questions: [
      '哪些效果图元素只是好看，实际会增加清洁和维护压力？',
      '报价里有没有写清柜体板材、灯光回路、五金型号和安装边界？',
      '哪些需求可以后置，哪些必须在水电和柜体阶段一次想清？',
    ],
    articleSlugs: ['jia-bu-shi-yangban-jian', 'article-01-01', 'article-01-02'],
    tool: { label: '先做 AI 居住诊断', href: '/living-diagnosis' },
    service: { label: '看居住需求洞察报告', href: '/services#living-insight-beta' },
  },
  {
    code: 'Sample 02',
    title: '报价看起来便宜，为什么仍然不能直接签？',
    scene: '已经比较 2-3 家装修公司，有一份总价明显更低的报价。',
    livingGoal: '希望在预算可控的前提下，把材料、工艺、付款和售后责任说清。',
    judgment: [
      '低价本身不一定有问题，先看范围、数量、品牌型号和计量规则。',
      '把暂估、另计、不含、按实结算逐项转成追问清单。',
      '让口头承诺、材料替换、增项确认和验收标准进入合同或附件。',
    ],
    questions: [
      '水电、防水、找平、拆除是否存在按实结算或未计入项目？',
      '材料只写品牌，还是写到了型号、规格、系列和替换规则？',
      '付款节点是否走在阶段验收和整改确认之前？',
    ],
    articleSlugs: ['baojia-dan-zenme-kan', 'article-03-04', 'article-03-02'],
    tool: { label: '做免费报价初筛', href: '/tools/quote-check' },
    service: { label: '看报价 / 合同快审', href: '/services#quote-standard' },
  },
  {
    code: 'Sample 03',
    title: '方案、预算、报价和合同都在手，应该怎么一起判断？',
    scene: '方案基本确定，报价和合同也有了，但仍然担心后期返工、增项和交付扯皮。',
    livingGoal: '不只是怕被坑，还想确认这套方案是否适合长期居住和家庭关系。',
    judgment: [
      '先看方案是否回应真实生活，而不是只看效果图表达。',
      '再看预算是否投向高频使用、长期接触和难返工的部分。',
      '最后把报价、合同、付款、验收和售后责任与方案一一对齐。',
    ],
    questions: [
      '这个方案解决的是长期生活问题，还是只解决了照片好看？',
      '预算超支来自真实需求，还是来自没排序的伪需求？',
      '施工边界、验收标准和售后责任是否能承接方案里的关键选择？',
    ],
    articleSlugs: ['zhuangxiu-yusuan-weishenme-zongchao', 'shuidian-gongcheng-zongchao-yusuan', 'zhuangxiu-hou-hue-de-wu-jian'],
    tool: { label: '看签约前检查模板', href: '/checklists' },
    service: { label: '看居住方案综合判断', href: '/services#quote-deep' },
  },
]

export default function CasesPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '判断样张库',
          url: 'https://zenoaihome.com/cases',
          description: metadata.description,
          inLanguage: 'zh-CN',
        }}
      />

      <main className="bg-canvas text-ink">
        <section className="relative overflow-hidden border-b border-border bg-canvas system-grid">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,252,0.94),rgba(247,247,243,0.82)),radial-gradient(circle_at_82%_18%,rgba(63,98,88,0.14),transparent_34%)]" aria-hidden />
          <Container size="layout" className="relative py-16 sm:py-20">
            <div className="max-w-4xl">
              <p className="system-label">Judgment Samples</p>
              <h1 className="mt-4 max-w-4xl text-[2.35rem] font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
                先看判断过程，再决定怎么做。
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">
                这里不把复杂现实讲成一句口号，也不编造客户隐私案例。样张展示的是 ZenoAIHome 的判断方式：从生活目标和美学取舍出发，一直落到预算边界、报价合同追问和下一步动作。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href="/living-diagnosis" label="先做居住诊断" variant="primary" />
                <CTA href="/tools/quote-check" label="已有报价，做初筛" variant="secondary" />
              </div>
            </div>
          </Container>
        </section>

        <Container size="layout" className="py-section">
          <div className="space-y-10">
            {judgmentSamples.map((sample) => {
              const articles = sample.articleSlugs
                .map((slug) => getArticleBySlug(slug))
                .filter((article): article is NonNullable<ReturnType<typeof getArticleBySlug>> => Boolean(article))

              return (
                <section key={sample.code} className="report-sheet overflow-hidden">
                  <div className="grid gap-px bg-border lg:grid-cols-[0.42fr_0.58fr]">
                    <div className="bg-surface p-6 sm:p-8">
                      <p className="system-label">{sample.code}</p>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-ink">{sample.title}</h2>
                      <div className="mt-6 space-y-4 text-sm leading-7 text-ink-muted">
                        <div className="border border-border bg-canvas p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">场景</p>
                          <p>{sample.scene}</p>
                        </div>
                        <div className="border border-border bg-canvas p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">生活目标</p>
                          <p>{sample.livingGoal}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
                        <CTA href={sample.tool.href} label={sample.tool.label} variant="primary" />
                        <CTA href={sample.service.href} label={sample.service.label} variant="secondary" />
                      </div>
                    </div>

                    <div className="bg-canvas p-6 sm:p-8">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                          <p className="system-label">判断过程</p>
                          <ol className="decision-rail mt-5 space-y-4">
                            {sample.judgment.map((item, index) => (
                              <li key={item} className="relative grid grid-cols-[2.5rem_1fr] gap-3">
                                <span className="relative z-10 flex h-10 w-10 items-center justify-center bg-stone text-xs font-semibold text-white">0{index + 1}</span>
                                <p className="pt-1 text-sm leading-7 text-ink-muted">{item}</p>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <p className="system-label">签约前追问</p>
                          <div className="mt-5 space-y-3">
                            {sample.questions.map((item) => (
                              <div key={item} className="border border-border bg-surface p-4 text-sm leading-7 text-ink-muted">
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {articles.length > 0 && (
                        <div className="mt-8 border-t border-border pt-6">
                          <p className="system-label">相关复盘</p>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            {articles.map((article) => (
                              <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="group border border-border bg-surface p-4 transition-colors hover:border-stone hover:bg-surface-warm"
                              >
                                <p className="text-[0.7rem] uppercase tracking-widest text-ink-faint">{article.category}</p>
                                <h3 className="mt-2 text-sm font-semibold leading-6 text-ink group-hover:text-stone">{article.title}</h3>
                                <p className="mt-3 text-xs font-semibold text-stone">阅读复盘 -&gt;</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )
            })}
          </div>

          <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
            <p className="system-label">下一步</p>
            <h2 className="mt-3 section-heading">如果你不是来看样张，而是想先解决手头问题</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
              不需要先看完所有内容。还没定方向，先做居住诊断；已经拿到报价，先做报价初筛；方案、报价、合同都复杂，再进入人工判断。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <CTA href="/living-diagnosis" label="开始 AI 居住诊断" variant="primary" />
              <CTA href="/tools/quote-check" label="做报价初筛" variant="secondary" />
              <CTA href="/services" label="查看服务边界" variant="ghost" />
            </div>
          </section>
        </Container>
      </main>
    </>
  )
}
