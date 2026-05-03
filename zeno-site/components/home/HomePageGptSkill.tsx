'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, HouseLine, Sparkle, Wrench } from '@phosphor-icons/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CTA from '@/components/CTA'
import Container from '@/components/Container'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type HeroFrame = {
  title: string
  caption: string
  image: string
}

type BentoCard = {
  eyebrow: string
  title: string
  body: string
  image: string
  className: string
}

const heroFrames: HeroFrame[] = [
  {
    title: '报价不是一张总价表，而是一连串会在施工里反扑你的决定。',
    caption: '把预算、漏项、工艺顺序和沟通节点拆开看，业主才不会一路被推着走。',
    image: 'https://picsum.photos/seed/zeno-estimate/1200/900',
  },
  {
    title: '经验不是讲给熟人听完就结束，它可以被整理成长期资产。',
    caption: '文章、工具、课程与咨询，不是平行赛道，而是同一套判断力的不同出口。',
    image: 'https://picsum.photos/seed/zeno-system/1200/900',
  },
]

const interestCards: BentoCard[] = [
  {
    eyebrow: 'For Homeowners',
    title: '先拆预算，再决定要不要签。',
    body: '把报价结构、变更风险和验收节点放进同一张判断面板里，看清真正会超支的地方。',
    image: 'https://picsum.photos/seed/zeno-budget/1200/900',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    eyebrow: 'For Builders',
    title: '把做过的事，变成可复用系统。',
    body: '内容、工具和服务不是重新发明自己，而是把原有经验重新包装成更长的时间线。',
    image: 'https://picsum.photos/seed/zeno-builder/900/900',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    eyebrow: 'Knowledge',
    title: '先看三类高损耗问题。',
    body: '报价漏项、验收失焦、合同模糊，是普通业主最容易用时间和钱交学费的入口。',
    image: 'https://picsum.photos/seed/zeno-knowledge/900/900',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    eyebrow: 'Assets',
    title: '内容不是流量堆叠，而是判断的索引。',
    body: '真实案例、工具页、课程和服务页应该互相咬合，而不是一页页孤立堆着。',
    image: 'https://picsum.photos/seed/zeno-assets/900/900',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    eyebrow: 'AI Scope',
    title: 'AI 负责整理，现场判断仍然归你。',
    body: '它擅长压缩信息、对比版本、整理问题，但不能替代你签字前的边界判断。',
    image: 'https://picsum.photos/seed/zeno-ai-scope/900/900',
    className: 'md:col-span-1 md:row-span-1',
  },
]

const accordions = [
  {
    title: '装修判断入口',
    description: '预算、报价、合同、验收，先从高损耗决策切进去。',
    href: '/start',
    image: 'https://picsum.photos/seed/zeno-entry-home/800/1100',
  },
  {
    title: 'AI 一人公司入口',
    description: '从已有经验开始做内容、工具、课程与服务。',
    href: '/services/ai-workflow',
    image: 'https://picsum.photos/seed/zeno-entry-ai/800/1100',
  },
  {
    title: '预算风险工具',
    description: '先用一个工具看清你当前最容易踩的坑。',
    href: '/tools/budget-risk',
    image: 'https://picsum.photos/seed/zeno-entry-tool/800/1100',
  },
]

const marqueeItems = [
  '报价结构',
  '预算顺序',
  '节点留证',
  '验收清单',
  'AI 工作流',
  '内容系统',
  '服务产品化',
]

const scrollCards = [
  {
    title: '你不是缺信息，是缺能压住信息的判断框架。',
    body: '装修里最常见的问题，不是搜不到答案，而是答案太碎、顺序太乱、责任不清。',
    image: 'https://picsum.photos/seed/zeno-scroll-1/1200/900',
  },
  {
    title: '把真实问题做成内容，核心不是表达，而是取舍。',
    body: '哪些经验值得保留，哪些判断该产品化，哪些内容只适合面对面讲清，这决定了长期资产的质量。',
    image: 'https://picsum.photos/seed/zeno-scroll-2/1200/900',
  },
  {
    title: 'AI 的价值，在于让你更快抵达高质量问题。',
    body: '它可以帮你缩短准备时间，但不能替你承担专业责任，也不能替你做最终签字。',
    image: 'https://picsum.photos/seed/zeno-scroll-3/1200/900',
  },
]

const articleLinks = [
  {
    title: '装修预算为什么总超',
    href: '/blog/zhuangxiu-yusuan-weishenme-zongchao',
  },
  {
    title: '家不是样板间',
    href: '/blog/02-jia-bu-shi-yangban-jian',
  },
  {
    title: '为什么我开始认真学 AI',
    href: '/blog/04-wei-shenme-wo-kaishi-renzhen-xue-ai',
  },
]

type Props = {
  fontClassName: string
}

export default function HomePageGptSkill({ fontClassName }: Props) {
  const rootRef = useRef<HTMLElement | null>(null)
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null)
  const pinWrapRef = useRef<HTMLDivElement | null>(null)
  const pinTitleRef = useRef<HTMLDivElement | null>(null)
  const pinCardsRef = useRef<HTMLDivElement | null>(null)
  const textRevealRef = useRef<HTMLParagraphElement | null>(null)

  useGSAP(
    () => {
      if (marqueeTrackRef.current) {
        gsap.to(marqueeTrackRef.current, {
          xPercent: -50,
          duration: 24,
          ease: 'none',
          repeat: -1,
        })
      }

      const cards = pinCardsRef.current?.querySelectorAll<HTMLElement>('[data-scroll-card]')
      const words = textRevealRef.current?.querySelectorAll<HTMLSpanElement>('[data-word]')

      if (pinWrapRef.current && pinTitleRef.current && pinCardsRef.current && cards && cards.length > 0) {
        cards.forEach((card, index) => {
          gsap.set(card, {
            y: index * 64,
            scale: 0.88 + index * 0.04,
            opacity: index === 0 ? 1 : 0.4,
          })
        })

        cards.forEach((card, index) => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 15%',
              scrub: true,
            },
          })
        })

        ScrollTrigger.create({
          trigger: pinWrapRef.current,
          start: 'top top+=96',
          end: 'bottom bottom-=96',
          pin: pinTitleRef.current,
        })
      }

      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: textRevealRef.current,
              start: 'top 80%',
              end: 'bottom 35%',
              scrub: true,
            },
          },
        )
      }
    },
    { scope: rootRef },
  )

  return (
    <main ref={rootRef} className={`w-full max-w-full overflow-x-hidden bg-[#f6f1ea] text-[#16120f] ${fontClassName}`}>
      <section className="relative isolate overflow-hidden border-b border-black/10 bg-[#17120f] text-[#f7f1e8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(196,152,98,0.26),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(112,82,52,0.38),_transparent_36%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

        <Container size="layout">
          <div className="relative grid min-h-[100dvh] grid-cols-1 gap-16 py-10 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center lg:gap-10 lg:py-20">
            <div className="max-w-5xl py-8 lg:py-16">
              <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5 text-[0.74rem] uppercase tracking-[0.22em] text-white/55">
                <span>ZenoAIHome</span>
                <span className="hidden sm:block">Renovation Judgment x AI Asset Systems</span>
              </div>

              <p className="max-w-2xl text-[0.78rem] uppercase tracking-[0.26em] text-[#cfad84]">真实问题，先于任何包装</p>
              <h1 className="mt-6 max-w-5xl text-[clamp(3.15rem,5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[#fffaf2]">
                从工地现场到
                <span
                  className="mx-3 inline-block h-[0.82em] w-28 rounded-full align-[-0.12em] bg-cover bg-center grayscale contrast-125 md:w-40"
                  style={{ backgroundImage: `url(${heroFrames[0].image})` }}
                />
                内容系统，
                <br />
                先把判断力做成你自己的长期资产。
              </h1>
              <p className="mt-8 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                ZenoAIHome 不卖“懂一点就上手”的幻觉。这里一边帮业主看清报价、预算、合同和验收，
                一边示范一个传统行业人怎样把真实经验接进 AI、内容、工具和服务。
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <CTA href="/start" label="我是装修业主，先看判断入口" variant="primary" />
                <CTA href="/services/ai-workflow" label="我是行业从业者，进入 AI 一人公司入口" variant="secondary" />
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/58">
                <span className="inline-flex items-center gap-2"><HouseLine size={18} weight="duotone" />预算与验收</span>
                <span className="inline-flex items-center gap-2"><Wrench size={18} weight="duotone" />经验与系统</span>
                <span className="inline-flex items-center gap-2"><Sparkle size={18} weight="duotone" />AI 与产品化</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {heroFrames.map((frame, index) => (
                <article
                  key={frame.title}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-transform duration-700 ease-out hover:-translate-y-1 ${index === 0 ? 'mt-8' : 'md:mt-28'}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(12,10,9,0.08), rgba(12,10,9,0.76)), url(${frame.image})` }}
                  />
                  <div className="relative flex min-h-[25rem] flex-col justify-end">
                    <p className="max-w-xs text-[0.74rem] uppercase tracking-[0.22em] text-[#f1d4ae]">Scene 0{index + 1}</p>
                    <h2 className="mt-3 text-2xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#fffaf2]">{frame.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-white/72">{frame.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-32 md:py-40 lg:py-48">
        <Container size="layout">
          <div className="mb-16 max-w-4xl">
            <h2 className="max-w-4xl text-[clamp(2.7rem,4.6vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#19120d]">
              一个首页，两个入口，但底层只做同一件事：
              <span
                className="mx-3 inline-block h-[0.8em] w-24 rounded-full align-[-0.12em] bg-cover bg-center grayscale contrast-125 md:w-36"
                style={{ backgroundImage: `url(${heroFrames[1].image})` }}
              />
              把混乱的问题压成清晰判断。
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-black/62">
              这里不做散乱链接墙。首页的兴趣区被收成一块密集而无空洞的判断面板，让人一眼看出应该往哪条路径走。
            </p>
          </div>

          <div className="grid grid-cols-1 grid-flow-dense gap-5 md:grid-cols-4 md:auto-rows-[15rem]">
            {interestCards.map((card) => (
              <article
                key={card.title}
                className={`group relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_60px_rgba(30,18,8,0.08)] transition-transform duration-700 ease-out hover:-translate-y-1 ${card.className}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(246,241,234,0.16), rgba(16,12,9,0.72)), url(${card.image})` }}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <p className="text-[0.74rem] uppercase tracking-[0.2em] text-white/70">{card.eyebrow}</p>
                  <div>
                    <h3 className="max-w-[16ch] text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#fff8f0]">{card.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-white/70">{card.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-full border border-black/10 bg-white py-4 shadow-[0_10px_30px_rgba(15,10,8,0.05)]">
            <div ref={marqueeTrackRef} className="flex min-w-max gap-8 px-6 text-[0.8rem] uppercase tracking-[0.22em] text-black/52 will-change-transform">
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-3 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8e5e33]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 bg-[#efe8df] py-32 md:py-40 lg:py-48">
        <Container size="layout">
          <div className="flex flex-col gap-5 md:flex-row">
            {accordions.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-h-[32rem] overflow-hidden rounded-[2.4rem] border border-black/10 bg-black/80 px-6 py-8 text-[#f8f2e8] transition-[flex,transform] duration-700 ease-out md:min-h-[38rem] md:flex-1 md:hover:flex-[1.3]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(12,10,9,0.16), rgba(12,10,9,0.82)), url(${item.image})` }}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="text-[0.75rem] uppercase tracking-[0.22em] text-[#d9bc97]">Path 0{index + 1}</div>
                  <div>
                    <h3 className="max-w-[10ch] text-[2rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[#fffaf2]">{item.title}</h3>
                    <p className="mt-4 max-w-xs text-sm leading-7 text-white/68">{item.description}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#f2d7b2]">
                      进入路径
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section ref={pinWrapRef} className="border-b border-black/10 bg-[#16110f] py-32 text-[#f7f1e9] md:py-40 lg:py-48">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
            <div ref={pinTitleRef} className="h-fit lg:pr-12">
              <p className="text-[0.76rem] uppercase tracking-[0.24em] text-[#d6b792]">Scroll Study</p>
              <h2 className="mt-6 max-w-xl text-[clamp(2.8rem,4.4vw,4.9rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#fff8f1]">
                先把视线钉住，再看问题一层层往上堆。
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/66">
                这一段按 gpt-skill 的 Desire 区处理。标题固定，内容上移，卡片在滚动里逐渐放大、变亮，让“问题如何压缩成判断”不是一句标语，而是一个被看见的过程。
              </p>
            </div>

            <div ref={pinCardsRef} className="relative min-h-[120vh] space-y-10">
              {scrollCards.map((card, index) => (
                <article
                  key={card.title}
                  data-scroll-card
                  className="sticky top-24 overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/8 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm"
                  style={{ zIndex: scrollCards.length - index }}
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.94fr_1.06fr] md:items-end">
                    <div className="overflow-hidden rounded-[1.8rem]">
                      <div
                        className="aspect-[4/5] w-full bg-cover bg-center grayscale contrast-125 transition-transform duration-700 ease-out hover:scale-105"
                        style={{ backgroundImage: `url(${card.image})` }}
                      />
                    </div>
                    <div className="pb-2 md:pr-4">
                      <p className="text-[0.74rem] uppercase tracking-[0.22em] text-[#d4b28a]">Frame 0{index + 1}</p>
                      <h3 className="mt-4 max-w-[14ch] text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#fff8f1]">{card.title}</h3>
                      <p className="mt-5 max-w-lg text-sm leading-8 text-white/68">{card.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-32 md:py-40 lg:py-48">
        <Container size="content">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[0.76rem] uppercase tracking-[0.24em] text-black/42">Scrub Text</p>
            <p
              ref={textRevealRef}
              className="mt-8 text-[clamp(1.8rem,3vw,3rem)] font-medium leading-[1.55] tracking-[-0.03em] text-black/95"
            >
              {'装修不是靠多看几篇攻略就能放心开工，AI 一人公司也不是换几个工具就自动成立。真正有用的路径，是把你已经见过的真实问题、已经做过的判断、已经服务过的人，重新整理成能被重复调用的系统。'
                .split('')
                .map((word, index) => (
                  <span key={`${word}-${index}`} data-word>
                    {word}
                  </span>
                ))}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-32 md:py-40 lg:py-48">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-end">
            <div>
              <p className="text-[0.76rem] uppercase tracking-[0.24em] text-black/42">Next Step</p>
              <h2 className="mt-6 max-w-4xl text-[clamp(3rem,4.8vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[#18120f]">
                选一个入口，别再把所有问题都堆到同一个下午里处理。
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-black/62">
                业主先去判断入口，行业从业者先去 AI 工作流服务页。如果你还在观望，先看三篇最能代表这个站判断方式的文章。
              </p>
            </div>

            <div className="rounded-[2.2rem] border border-black/10 bg-white p-7 shadow-[0_20px_50px_rgba(22,15,10,0.08)]">
              <div className="space-y-4">
                {articleLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between rounded-[1.35rem] border border-black/10 px-5 py-4 transition-colors duration-300 hover:bg-[#1a1410] hover:text-[#f7f1e8]"
                  >
                    <span className="text-base font-medium tracking-[-0.02em]">{item.title}</span>
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <CTA href="/start" label="进入首页主入口" variant="primary" />
                <CTA href="/services/ai-workflow" label="查看 AI 服务页" variant="ghost" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}