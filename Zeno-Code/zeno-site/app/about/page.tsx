import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: '关于赞诺｜陈国赞的传统行业与AI实践',
  description:
    '陈国赞，赞诺，南宁创业者。17年传统行业经营与项目经验，正在推进AI培训、工作流、企业知识库、智能体、网站开发和星火者共同体。',
  alternates: {
    canonical: 'https://zenoaihome.com/about',
  },
}

const experience = [
  {
    years: '2009—2017',
    role: '睡宝集团 · 南宁总经理',
    detail: '负责南宁市场经营与团队管理。2014 年推动销售端使用 iPad，并与仓库数据管理打通，提高协同效率与品牌呈现；任职期间累计服务南宁 20 万+客户。',
  },
  {
    years: '2017—2025',
    role: '家装行业 · 创始人',
    detail: '独立签下 1 万㎡+城堡装修总承包项目，装修合同金额 3000 万+，从前端洽谈、施工管理、审美判断到后端服务完成全链路推进。',
  },
  {
    years: '近两年',
    role: '一人公司与 AI 实践',
    detail: '持续研究一人公司，自学自媒体、AI 工具和氛围编程。正在推进社群网站、智能体、AI 内容工厂、培训与项目交付。',
  },
]

const currentWork = [
  { title: 'AI 培训', body: '面向传统行业团队、商会和创业社群，从真实工作场景出发做工具实操。', href: '/training' },
  { title: 'AI 项目服务', body: '围绕工作流、企业知识库、智能体和网站开发，先明确范围再交付。', href: '/services' },
  { title: '装修垂直实践', body: '把 17 年行业经验继续沉淀为内容、判断工具、风险资料和案例样张。', href: '/tools' },
  { title: '星火者共同体', body: '发起一个能够逐步脱离发起人、围绕学习与项目协作运转的成员共同体。', href: '/community' },
]

export default function AboutPage() {
  return (
    <main className="bg-canvas text-ink">
      <section className="border-b border-border bg-surface-warm">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.36fr_0.64fr] lg:items-center lg:py-20">
          <div className="relative aspect-[4/5] max-w-sm overflow-hidden bg-ink">
            <Image
              src="/images/brand/zeno-portrait.jpg"
              alt="赞诺，陈国赞"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover object-center"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone">关于赞诺</p>
            <h1 className="editorial-display mt-5 max-w-[12ch] text-[3.2rem] leading-[1.03] sm:text-[4.8rem]">我叫陈国赞，也叫 Zeno 赞诺。</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">
              我在南宁创业。前 17 年主要做家居、销售管理和大型装修项目；现在把 AI 用进内容生产、知识管理、智能体、网站和一人公司的实际工作。
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">
              我不把传统行业经历当作要摆脱的过去。它让我知道客户、团队、合同、现金流和交付分别意味着什么，也是我判断 AI 能否真正落地的底盘。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="motion-press inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">查看合作方式</Link>
              <Link href="/blog" className="motion-press inline-flex min-h-11 items-center rounded-[7px] border border-border px-5 py-3 text-sm font-semibold text-ink hover:border-stone">先看公开内容</Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20 lg:py-24">
        <section className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr]">
          <div>
            <p className="text-sm font-semibold text-stone">经历</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">先在现实世界里，把事情做成。</h2>
          </div>
          <div className="border-l border-border pl-6 sm:pl-10">
            {experience.map((item) => (
              <article key={item.years} className="relative border-b border-border py-7 first:pt-0 last:border-b-0 last:pb-0">
                <span className="absolute -left-[1.72rem] top-2 h-2 w-2 bg-stone sm:-left-[2.72rem]" aria-hidden />
                <p className="text-xs font-semibold text-stone">{item.years}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{item.role}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 border-y border-border py-12 sm:mt-24 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr]">
            <div>
              <p className="text-sm font-semibold text-stone">为什么开始研究 AI</p>
              <h2 className="editorial-display mt-4 text-[2.4rem] leading-[1.12] sm:text-[3.4rem]">这一次，我不想再站在技术浪潮外面。</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-ink-muted">
              <p>我很早就意识到重资产经营正在变难，也研究过轻量化团队和合作模式。但在 PC 互联网、移动互联网、短视频和直播阶段，我都因为技术门槛和认知不足错过了真正进场的机会。</p>
              <p>AI 改变了这件事。通过自学工具、内容生产和氛围编程，我第一次能够自己搭建网站、整理知识、制作内容，并把线下经验变成线上可交付的系统。</p>
              <p className="font-semibold text-ink">所以我研究 AI，不是为了换一个热门身份，而是为了重新获得进入下一阶段的能力。</p>
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">现在正在做</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">把能力放进真实产品、项目和关系里。</h2>
          </div>
          <div className="mt-10 grid border-y border-border sm:grid-cols-2">
            {currentWork.map((item, index) => (
              <Link key={item.title} href={item.href} className={`group p-6 sm:p-8 ${index < 2 ? 'border-b border-border' : ''} ${index % 2 === 0 ? 'sm:border-r' : ''}`}>
                <p className="text-xl font-semibold text-ink">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-stone group-hover:text-ink">查看 →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 bg-ink p-7 text-white sm:mt-24 sm:p-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-white/60">为什么发起星火者共同体</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">一人公司不是一个人扛下所有事情。</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">很多独立创业者缺的不是更多课程，而是持续学习、展示能力、建立信用和共同完成项目的关系。我能贡献的是传统行业锻炼出的组织能力、项目经验和把人连接起来的耐心。</p>
          </div>
          <div className="lg:text-right">
            <Link href="/community" className="motion-press inline-flex min-h-11 items-center rounded-[7px] bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-[#DED2BE]">了解星火者共同体</Link>
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-10 sm:mt-20">
          <h2 className="text-xl font-semibold text-ink">联系赞诺</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">请先说明你的身份、当前问题和希望合作的方向。信息越具体，越容易判断是否适合继续。</p>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink">
            <p>微信：<span className="font-semibold">zanxiansheng2025</span></p>
            <p>邮箱：<span className="font-semibold">zenoaihome@qq.com</span></p>
            <p>城市：<span className="font-semibold">广西南宁</span></p>
          </div>
        </section>
      </Container>
    </main>
  )
}
