import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'
import TagCloud from '@/components/features/content/TagCloud'
import {
  Brain,
  Compass,
  UsersThree,
  HouseLine,
  Lightning,
  BookOpenText,
  ArrowRight,
  Briefcase,
  PenNib,
} from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: '知识体系｜装修·一人公司·AI 的认知地图',
  description:
    '把17年工地经验、一人公司实践和AI工具探索做成三层认知地图。见自己（底层逻辑）→见天地（规律本质）→见众生（关系连接）。不堆资料，只放经过验证的判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/knowledge',
  },
}

/* ── 三层认知结构 ── */
const layers = [
  {
    id: 'self',
    title: '见自己',
    subtitle: '底层逻辑',
    desc: '先搞清楚自己卡在哪。产品、获客、交付——多数人的问题不是不够努力，是方向不对。',
    accent: 'border-l-stone',
    items: [
      {
        icon: Compass,
        title: '一人公司诊断',
        desc: '10 个问题，看看你卡在哪一步。',
        href: '/ai-tools/opc-diagnosis',
        tag: '免费工具',
      },
      {
        icon: BookOpenText,
        title: 'OPC 实战框架',
        desc: '一人公司的 5 个关键判断 + 87 页方法论。',
        href: '/opc-knowledge',
        tag: '知识库',
      },
      {
        icon: Brain,
        title: 'AI 时代认知升级',
        desc: '传统行业人怎么理解 AI、怎么开始用。',
        href: '/blog?category=ai',
        tag: '文章',
      },
      {
        icon: PenNib,
        title: '内容策略生成',
        desc: '找到什么值得写——不是替你写稿。',
        href: '/ai-tools/content-strategy',
        tag: '免费工具',
      },
    ],
  },
  {
    id: 'world',
    title: '见天地',
    subtitle: '规律本质',
    desc: '看懂游戏规则。装修的坑有固定模式，商业的底层逻辑不会变，AI 的能力边界有迹可循。',
    accent: 'border-l-amber-600',
    items: [
      {
        icon: HouseLine,
        title: '装修 13 边界框架',
        desc: '17 年工地提炼的报价审核方法论。完全开源。',
        href: '/zeno-os',
        tag: '开源方法论',
      },
      {
        icon: HouseLine,
        title: '装修判断工具',
        desc: '居住诊断、报价初筛、风险词典、检查清单。',
        href: '/tools',
        tag: '免费工具',
      },
      {
        icon: Lightning,
        title: 'AI 实战与工具',
        desc: '选型、工作流、企业知识库——真实案例。',
        href: '/blog?category=ai',
        tag: '文章',
      },
      {
        icon: Briefcase,
        title: '商业模式与变现',
        desc: '一人公司怎么定价、怎么获客、怎么搭产品梯子。',
        href: '/blog?category=opc',
        tag: '文章',
      },
    ],
  },
  {
    id: 'others',
    title: '见众生',
    subtitle: '关系连接',
    desc: '一个人可以开始，但很难独自走远。找到正在做同样事的人，在边界清楚的前提下一起协作。',
    accent: 'border-l-emerald-600',
    items: [
      {
        icon: UsersThree,
        title: '星火者共同体',
        desc: '不是围观群——每个进来的人都在做事。',
        href: '/community',
        tag: '社群',
      },
      {
        icon: UsersThree,
        title: '火种读书会',
        desc: '隔周一次。带真实问题来，不是泛读。',
        href: '/community#reading',
        tag: '社群活动',
      },
      {
        icon: UsersThree,
        title: '引火连接 · 共燃项目',
        desc: '两个星火者彼此需要时有人牵线。有合适的项目一起做。',
        href: '/community#collaborate',
        tag: '协作',
      },
      {
        icon: Brain,
        title: 'AI 转型专家智库',
        desc: 'OPC 圈 × 智联招聘。入库 = 平台背书 + 客户资源。',
        href: '/community',
        tag: '资源',
      },
    ],
  },
]

export default function KnowledgePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '知识体系',
          description: '装修·一人公司·AI 的认知地图：见自己→见天地→见众生',
          url: 'https://zenoaihome.com/knowledge',
          inLanguage: 'zh-CN',
        }}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <Container size="content" className="motion-hero relative py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">知识体系</p>
          <h1 className="editorial-display mb-5 max-w-3xl text-[2.35rem] leading-[1.12] text-ink sm:text-[3.35rem]">
            认知税我们替你交了。这是蒸馏器。
          </h1>
          <p className="max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            书、课程、文章和实践，不该只停在收藏夹里。这里把它们蒸馏成三层认知地图——见自己、见天地、见众生。不堆资料，只放经过验证的判断。
          </p>
        </Container>
      </div>

      <Container size="layout" className="py-14 sm:py-20">
        {/* ── 三层认知地图 ── */}
        <div className="grid gap-8 lg:grid-cols-3">
          {layers.map((layer) => (
            <section
              key={layer.id}
              className={`border-l-2 ${layer.accent} bg-surface-warm p-6 sm:p-7`}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                {layer.subtitle}
              </p>
              <h2 className="editorial-display mt-2 text-2xl text-ink">{layer.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{layer.desc}</p>

              <div className="mt-6 space-y-4">
                {layer.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group block border border-border bg-surface p-4 transition-colors hover:border-stone"
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          size={20}
                          weight="duotone"
                          className="mt-0.5 shrink-0 text-stone"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-ink">
                              {item.title}
                            </h3>
                            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                              {item.tag}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                            {item.desc}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          className="mt-1 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                          aria-hidden
                        />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── 价值标签：按标签探索 ── */}
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-2">按价值标签探索</h2>
          <p className="text-sm text-ink-muted mb-5">
            未来的搜索不是按分类，是按标签。点一个你关心的，直接看相关文章。
          </p>
          <TagCloud limit={40} />
        </div>

        {/* ── 底部：还没找到？ ── */}
        <div className="mt-14 border-2 border-stone bg-surface-warm p-6 text-center sm:p-8">
          <h2 className="text-xl font-semibold text-ink">还没找到你要的？</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
            这里的每一条都经过真实项目验证。如果你关心的话题这里没有——
            说明我还没做过。但也许下一个就是。
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <CTA href="/blog" label="看全部文章 →" variant="primary" />
            <CTA href="/community" label="来星火者聊聊 →" variant="secondary" />
          </div>
        </div>
      </Container>
    </>
  )
}
