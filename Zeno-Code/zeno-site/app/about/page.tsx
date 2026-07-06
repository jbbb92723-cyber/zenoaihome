import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: '关于赞诺｜17年装修老兵，传统行业 × AI 实战',
  description:
    '在装修和床垫行业干了17年。现在不卖货了，用AI把自己重做了一遍。这是我全部过程和方法的公开记录。',
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
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
            <div className="shrink-0">
              {/* 替换 src 为你的照片路径，建议放在 public/images/brand/ */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-stone/10 border border-border flex items-center justify-center text-ink-faint text-xs">
                你的照片
              </div>
            </div>
            <div>
              <h1 className="page-title mb-5">我叫赞诺</h1>
              <div className="max-w-3xl text-base leading-[1.85] text-ink-muted sm:text-lg">
                <p>
                  在装修和床垫行业，干了17年。卖过床垫，干过装修，当过经销商，带过团队。
                  见过这个行业最真实、最脏、也最赚钱的一面。
                </p>
                <p className="mt-4">
                  这两年，我用 AI 把自己重做了一遍。不是转行做技术——是把17年的经验，用 AI 整理成结构化的判断、内容和工具。
                  现在我把这套方法做成培训，讲给同样在传统行业的人听。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">

        {/* ── 我能帮你什么 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-5">我能帮你什么</h2>
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">
            三种来意，三个出口。找到适合你的那个。
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-border bg-surface p-6">
              <p className="text-lg font-semibold text-ink mb-2">请我来培训</p>
              <p className="text-sm leading-relaxed text-ink-muted mb-3">
                传统行业经营者怎么用 AI 把自己重做一遍——从真实案例到通用方法。面向商会、企业内训、创业社群。
              </p>
              <Link href="/training" className="text-xs text-stone font-medium hover:underline">
                查看培训模块 →
              </Link>
            </div>
            <div className="border border-border bg-surface p-6">
              <p className="text-lg font-semibold text-ink mb-2">我有装修需求</p>
              <p className="text-sm leading-relaxed text-ink-muted mb-3">
                先看装修全案判断里的文章和工具。拿不准的，加微信把情况说清楚，简单问题免费帮你看。
              </p>
              <Link href="/blog?category=renovation" className="text-xs text-stone font-medium hover:underline">
                看装修全案判断 →
              </Link>
            </div>
            <div className="border border-border bg-surface p-6">
              <p className="text-lg font-semibold text-ink mb-2">我想加入同行社群</p>
              <p className="text-sm leading-relaxed text-ink-muted mb-3">
                OPC·同行有你——一群传统行业的人在一起重新做一遍生意。去OPC版块看看，觉得合适再来。
              </p>
              <Link href="/blog?category=opc" className="text-xs text-stone font-medium hover:underline">
                看 OPC 社群 →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 邀请我分享 / 培训 ── */}
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-3">邀请我分享 / 培训</h2>
          <p className="text-sm leading-relaxed text-ink-muted mb-4 max-w-xl">
            三个培训模块——传统行业 × AI 实战、AI 工具实操、装修全案判断方法论。面向商会、企业内训、创业社群。
          </p>
          <Link
            href="/training"
            className="inline-flex items-center text-sm font-medium border border-border text-ink px-4 py-2 hover:border-stone transition-colors"
          >
            查看培训与企业服务 →
          </Link>
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
              { title: 'AI 落地判断', desc: '哪些能用、哪些是坑——传统行业×AI实战、工作流、真实案例', href: '/blog?category=ai' },
              { title: '装修全案判断', desc: '空间审美、材料工艺、施工管控、合同风险、床垫选购', href: '/blog?category=renovation' },
              { title: 'AI 工具', desc: '报价初筛、预算结构、居住诊断——免费使用', href: '/tools' },
              { title: '把自己重做一遍', desc: '一个传统行业的人怎么用内容把自己重做一遍', href: '/blog?category=ip' },
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
              <strong className="text-ink">简单问题，免费帮你看。</strong>把你的情况说清楚，我有空就回。
            </p>
            <p>
              <strong className="text-ink">需要完整判断，这是我的付费服务。</strong>装修方案判断、报价合同审查、床垫选购——加微信后我发具体流程给你。
            </p>
            <p>
              <strong className="text-ink">想请我去培训/分享，</strong>去培训与企业服务页面看模块和案例，加微信备注「培训」，我把详细提纲发你。
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-ink">
              微信：<span className="font-semibold">zanxiansheng2025</span>
            </p>
            <p className="text-sm text-ink">
              邮箱：<span className="font-semibold">zenoaihome@qq.com</span>
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
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
            赞诺，17年装修行业老兵。不卖货，只说真话。这个网站是他用 AI 把自己重做一遍的全部过程记录——AI 落地判断、装修全案判断、OPC·同行有你、AI 培训与企业服务。
          </p>
        </section>

      </Container>
    </>
  )
}
