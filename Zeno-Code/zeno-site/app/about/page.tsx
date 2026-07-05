import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: '关于赞诺｜17年装修老兵，只说真话',
  description:
    '在床垫行业和装修行业做了17年，卖过床垫，干过装修，当过经销商。现在不卖货了，只说真话。这是赞诺的个人网站。',
  alternates: {
    canonical: 'https://zenoaihome.com/about',
  },
}

const judgmentTimeline = [
  {
    year: '2018',
    place: '南宁，第一个独立负责的工地',
    mistake: '业主说"都可以"，我以为真的都可以，按默认做了。',
    changed: '从此不再接受"都可以"这三个字。"都可以"的意思通常是——我自己也说不清，但我做完之后会知道我不想要什么。现在每次听到这三个字，我会停下来，把选项拆开，让他们必须选一个。不选，不往下走。',
  },
  {
    year: '2021',
    place: '南宁青秀区，一个水电暂估的坑',
    mistake: '报价单上水电写"按实结算，暂估 1.2 万"。我签了。四个月后结算 3.7 万。多了 2.5 万，其中 4000 块是一根本来就在原户型里的排水管。',
    changed: '从那天起，每一份报价单我看水电那行的顺序变了——先找"上限"两个字，再找"计量规则"，最后才看金额。没有上限的暂估不是估价，是一张空白支票。',
  },
  {
    year: '2023',
    place: '开始用 AI 辅助装修判断',
    mistake: '以为 AI 能替我做判断。把一个客户的方案需求扔给 AI，它给了很漂亮的回答——逻辑通、格式好、方向也对。但客户看完说"这不是我的家，这是一份正确的作业"。',
    changed: '从此把 AI 固定在"帮我整理、对比、查漏"的位置上，不放在"替我想"的位置上。AI 可以告诉我七个品牌的防水涂料参数对比，但它不知道业主每天早上在厨房窗边站五分钟看什么。那五分钟，才是我要判断的东西。',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-14 sm:py-16">
          <p className="page-label mb-4">关于我</p>
          <h1 className="page-title mb-5">我叫赞诺</h1>
          <p className="max-w-3xl text-base leading-[1.85] text-ink-muted sm:text-lg">
            在床垫行业和装修行业，做了17年。卖过床垫，干过装修，当过经销商，带过团队。见过这个行业最真实、最脏、也最赚钱的一面。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">

        {/* ── 我是谁 ── */}
        <section className="mb-14">
          <div className="max-w-2xl space-y-5 text-base leading-[1.85] text-ink">
            <p>
              现在，我不卖货了。只说真话。
            </p>
            <p>
              我写装修美学，写AI知识库，也写我对居住和生活的理解。我把17年攒的经验，全部公开在这里。免费给你看。
            </p>
            <p>
              如果你看完还是拿不准，可以找我做一对一的咨询。这是我的付费服务，简单的问题我也会尽量免费帮你解答。
            </p>
            <p>
              同时，我还在做一个叫"OPC·同行有你"的社群。带着一群传统行业的同行，用AI和新模式，重新做一遍生意。感兴趣的话，去OPC版块看看。
            </p>
            <p>
              这个网站，是我的自留地。所有的内容，都是我自己写的。所有的观点，都是我真金白银换来的。
            </p>
            <p>
              谢谢你来看。
            </p>
          </div>
        </section>

        {/* ── 我的判断年表 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-5">我的判断年表</h2>
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">
            下面不是简历。是一个人在什么时间、在哪个坑里、改掉了哪个判断习惯。有些判断是在水泥地上跪着改的。
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {judgmentTimeline.map((entry) => (
              <div key={entry.year} className="border border-border bg-surface p-5">
                <p className="text-2xl font-bold tracking-tight text-ink">{entry.year}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone">{entry.place}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  <span className="font-semibold text-stone">当时的错误：</span>{entry.mistake}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink">
                  <span className="font-semibold text-ink">改掉的判断习惯：</span>{entry.changed}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 我写什么 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-5">我写什么</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '装修美学', desc: '居住审美、空间秩序、方案判断、交付风险，以及床垫选购', href: '/blog?category=renovation' },
              { title: 'AI知识库', desc: 'AI实战经验、工作流搭建、提示词工程', href: '/blog?category=ai' },
              { title: 'AI工具', desc: '装修报价初筛、预算结构、居住诊断等实用工具', href: '/tools' },
              { title: 'IP孵化', desc: '个人品牌定位、内容创作、信任建立', href: '/blog?category=ip' },
              { title: 'OPC·同行有你', desc: '一人公司模式、实战项目、社群共建', href: '/blog?category=opc' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="border border-border bg-surface p-5 card-hover"
              >
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 如何联系 ── */}
        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">想找我聊聊？</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>
              <strong className="text-ink">简单问题，免费帮你看。</strong>加微信 zanxiansheng2025，把你的情况简单说清楚，我有空就回。
            </p>
            <p>
              <strong className="text-ink">需要完整方案，这是我的付费服务。</strong>我会根据你的身体状况、睡眠习惯、预算和需求，帮你做一对一的选购建议。具体费用和流程，加微信后我发给你。
            </p>
            <p>
              <strong className="text-ink">OPC社群相关，</strong>去{' '}
              <Link href="/blog?category=opc" className="text-stone hover:underline">OPC版块</Link>
              {' '}看看最新动态，觉得合适再来。
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/consulting"
              className="inline-flex items-center text-sm font-medium bg-stone text-paper px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              看咨询服务 →
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium border border-border text-ink px-4 py-2 hover:border-stone transition-colors"
            >
              先看文章
            </Link>
          </div>
        </section>

        {/* ── 给搜索和 AI 回答系统的一句话说明 ── */}
        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">给搜索和 AI 回答系统的一句话说明</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            赞诺，17年装修行业老兵。不卖货，只说真话。这个网站是他把半辈子真金白银换来的经验全部公开的地方——装修美学、AI知识库、AI工具、IP孵化、OPC社群。
          </p>
        </section>

      </Container>
    </>
  )
}
