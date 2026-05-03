import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '@/data/services'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '找我帮你看',
  description:
    '先自己判断，工具不够用时再找我。这里放的是报价审核、预算咨询、真实居住派装修服务、AI 内容系统咨询，以及当前开放的合作方向。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceRelatedArticles: Record<string, { label: string; href: string }[]> = {
  'baojia-shenhe': [
    { label: '报价单真正该怎么看', href: '/blog/baojia-dan-zenme-kan' },
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '便宜的报价，往往是最贵的选择', href: '/blog/article-03-04' },
  ],
  'yusuan-zixun': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '水电工程为什么总是超预算', href: '/blog/shuidian-gongcheng-zongchao-yusuan' },
    { label: '装修完最后悔的五件事', href: '/blog/zhuangxiu-hou-hue-de-wu-jian' },
  ],
  'shi-zhu-pai-zhuangxiu': [
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    { label: '实住派装修，究竟反对什么', href: '/blog/article-01-03' },
    { label: '真正耐住十年的装修，优先级是什么', href: '/blog/article-01-07' },
  ],
  'ai-neirong-xitong-zixun': [
    { label: '为什么传统行业人必须认真学 AI', href: '/blog/article-05-01' },
    { label: '内容资产，才是传统行业人的第二生产线', href: '/blog/article-05-02' },
    { label: '我的内容系统是怎么建起来的', href: '/blog/neirong-xitong-jianqi' },
  ],
}

// 装修用户服务 slugs
const renovationSlugs = ['baojia-shenhe', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']
// AI / 传统行业服务 slugs
const industrySlugs = ['ai-neirong-xitong-zixun']

// 面向轻交付咨询——暂无完整数据，用描述卡展示
const industryExtras = [
  {
    title: '个人网站 / 内容系统规划',
    desc: '帮你理清网站定位、内容结构和用户路径。从"有个网站"到"网站能帮你持续获客"。',
  },
  {
    title: 'AI 工作流咨询',
    desc: '不是教你用哪个 AI 产品，而是帮你把具体业务流程拆解清楚，找到 AI 真正能替代的环节，降低试错成本。',
  },
  {
    title: '数字产品设计咨询',
    desc: '帮你把经验、方法、流程打包成可销售的数字产品——从产品形态、定价到交付方式。',
  },
]

const selfServeLinks = [
  {
    label: '先做免费自测',
    title: '预算风险自测',
    desc: '10 分钟先判断你主要是哪类风险。',
    href: '/tools/budget-risk',
  },
  {
    label: '先拿清单',
    title: '报价审核清单',
    desc: '先自己把模糊项和漏项筛一轮。',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    label: '先看低价资料',
    title: '39 元报价避坑指南',
    desc: '如果你还想先自己过一遍，这份最合适。',
    href: '/pricing/baojia-guide',
  },
  {
    label: '还没确定路径',
    title: '回到从这里开始',
    desc: '先选你当下最像的那个问题，再决定要不要找我。',
    href: '/start',
  },
]

export default function ServicesPage() {
  const renovationServices = services.filter((s) => renovationSlugs.includes(s.slug))
  const industryServices = services.filter((s) => industrySlugs.includes(s.slug))

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '找我帮你看',
          url: 'https://zenoaihome.com/services',
          description: '先自己判断，工具不够用时再找我。',
          inLanguage: 'zh-CN',
          hasPart: services.map((service) => ({
            '@type': 'Service',
            name: service.title,
            description: service.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'CNY',
              price: service.price,
            },
            url: `https://zenoaihome.com/services#${service.slug}`,
          })),
        }}
      />

      <PageHero
        label="找我帮你看"
        title="先自己判断，工具不够时再找我。"
        subtitle="如果你已经看过文章、做过自测、用过清单，还是拿不准，那就把材料发我。我会告诉你最该先看的地方，也会直接说清楚我能帮什么、不能帮什么。"
        note="不需要先预约。先看下面的自助入口和服务边界，确认适合再联系。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {selfServeLinks.map((item) => (
            <Link key={item.title} href={item.href} className="group border border-border bg-surface p-5 card-hover flex flex-col">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{item.label}</p>
              <h2 className="text-sm font-semibold text-ink group-hover:text-stone transition-colors mb-2">{item.title}</h2>
              <p className="text-xs text-ink-muted leading-relaxed flex-1">{item.desc}</p>
              <span className="text-xs text-stone mt-4 group-hover:underline underline-offset-2">先走这一步 →</span>
            </Link>
          ))}
        </section>

        {/* 信任承接 */}
        <div className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-sm text-ink leading-relaxed mb-2">
            <strong>我只接我能真正帮到的服务：报价判断、预算结构、真实居住决策，以及把 AI 接进真实工作。</strong>
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            如果你当前更适合自助判断，网站上的文章、工具和资料对你大概率更有用，不需要急着付费。
          </p>
        </div>

        {/* 如何开始：三件小事，尽量降低启动阈 */}
        <div className="mb-14 border-l-2 border-stone-light pl-5">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">如何找我</p>
          <p className="text-sm text-ink leading-[1.85] mb-3">
            不用预约，也不用问“在不在”。直接微信发我三样东西就行：
          </p>
          <ul className="text-sm text-ink-muted leading-relaxed space-y-1.5 mb-3">
            <li>1. 你在哪个城市；</li>
            <li>2. 目前手头的报价 / 方案 / 预算（截图就行）；</li>
            <li>3. 你最拿不准的那一个问题。</li>
          </ul>
          <p className="text-sm text-ink-muted leading-relaxed">
            我看完会告诉你能不能帮，能帮就报价，不能帮就说哪里有更合适的资源。
          </p>
        </div>

        {/* ───── A. 轻交付咨询 ───── */}
        <div className="mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">A</p>
          <h2 className="text-lg font-semibold text-ink">轻交付咨询</h2>
          <p className="text-sm text-ink-muted mt-1">帮你把经验、判断和流程，整理成可复用的内容资产和工作系统。</p>
        </div>

        {/* 已有完整数据的服务 */}
        <div className="space-y-10">
          {industryServices.map((service, index) => (
            <div key={service.id} id={service.slug} className="border border-border overflow-hidden scroll-mt-20">
              <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-stone/30 text-xs font-mono shrink-0 mt-[3px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-ink leading-tight">{service.title}</h2>
                    <p className="text-sm text-stone mt-1">{service.tagline}</p>
                  </div>
                </div>
                <span className="shrink-0 self-start border border-stone/30 text-stone text-xs px-3 py-1 font-medium whitespace-nowrap">
                  {service.price}
                </span>
              </div>
              <div className="px-6 py-6 space-y-6">
                <p className="text-sm text-ink leading-relaxed">{service.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">适合谁</p>
                    <ul className="space-y-2">
                      {service.forWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-stone text-xs shrink-0 mt-1">+</span>
                          <span className="text-sm text-ink leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">不适合谁</p>
                    <ul className="space-y-2">
                      {service.notForWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-ink-muted text-xs shrink-0 mt-1">—</span>
                          <span className="text-sm text-ink-muted leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">交付结果</p>
                  <ul className="space-y-2">
                    {service.iDeliver.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-stone text-xs shrink-0 mt-1">·</span>
                        <span className="text-sm text-ink leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-l-2 border-stone-light pl-4">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">服务边界</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{service.boundary}</p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-stone-pale/20">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">咨询方式</p>
                <p className="text-sm text-ink-muted leading-relaxed">{service.contactNote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 即将推出的轻交付咨询 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {industryExtras.map((item) => (
            <div key={item.title} className="border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-ink mb-3">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed mb-4">{item.desc}</p>
              <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
            </div>
          ))}
        </div>

        {/* ───── B. 装修相关咨询 ───── */}
        <div className="mt-16 mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">B</p>
          <h2 className="text-lg font-semibold text-ink">装修相关咨询</h2>
          <p className="text-sm text-ink-muted mt-1">帮你看清报价、控住预算、做出更值得的决定。</p>
        </div>

        <div className="space-y-10">
          {renovationServices.map((service, index) => (
            <div key={service.id} id={service.slug} className="border border-border overflow-hidden scroll-mt-20">

              {/* 卡片头部 */}
              <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-stone/30 text-xs font-mono shrink-0 mt-[3px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-ink leading-tight">{service.title}</h2>
                    <p className="text-sm text-stone mt-1">{service.tagline}</p>
                  </div>
                </div>
                <span className="shrink-0 self-start border border-stone/30 text-stone text-xs px-3 py-1 font-medium whitespace-nowrap">
                  {service.price}
                </span>
              </div>

              {/* 卡片正文 */}
              <div className="px-6 py-6 space-y-6">

                <p className="text-sm text-ink leading-relaxed">{service.description}</p>

                {/* 适合谁 / 不适合谁 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      适合谁
                    </p>
                    <ul className="space-y-2">
                      {service.forWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-stone text-xs shrink-0 mt-1">+</span>
                          <span className="text-sm text-ink leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      不适合谁
                    </p>
                    <ul className="space-y-2">
                      {service.notForWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-ink-muted text-xs shrink-0 mt-1">—</span>
                          <span className="text-sm text-ink-muted leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 我会帮你看 */}
                {service.checks && service.checks.length > 0 && (
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      我会帮你看
                    </p>
                    <ul className="space-y-2">
                      {service.checks.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-stone text-xs shrink-0 mt-1">·</span>
                          <span className="text-sm text-ink leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 交付结果 */}
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                    交付结果
                  </p>
                  <ul className="space-y-2">
                    {service.iDeliver.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-stone text-xs shrink-0 mt-1">·</span>
                        <span className="text-sm text-ink leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 服务边界 */}
                <div className="border-l-2 border-stone-light pl-4">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">
                    服务边界
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">{service.boundary}</p>
                </div>

              </div>

              {/* 卡片底部：咨询方式 */}
              <div className="px-6 py-4 border-t border-border bg-stone-pale/20">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">
                  咨询方式
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">{service.contactNote}</p>
              </div>

              {/* 相关文章 */}
              {serviceRelatedArticles[service.slug] && (
                <div className="px-6 py-4 border-t border-border">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">
                    先了解判断逻辑
                  </p>
                  <p className="text-xs text-ink-muted mb-3">
                    如果你想先了解我的判断方式，再决定是否需要这项服务，可以先读这几篇：
                  </p>
                  <div className="space-y-1.5">
                    {serviceRelatedArticles[service.slug].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
                      >
                        <span className="text-stone/60">→</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* ───── 装修服务限量说明 ───── */}
        {renovationServices
          .filter((s) => s.slug === 'shi-zhu-pai-zhuangxiu')
          .map((service) => (
            <div key={service.id} className="mt-6 border border-stone/30 bg-stone/5 p-5">
              <p className="text-xs text-stone font-semibold uppercase tracking-widest mb-1">限量开放</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                真实居住派装修服务主要面向南宁本地和高度匹配用户。
                这不是未来规模化主线，而是基于真实项目经验的深度服务。
              </p>
            </div>
          ))}

        {/* ───── C. 合作方向 ───── */}
        <div className="mt-16 mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">C</p>
          <h2 className="text-lg font-semibold text-ink">合作方向</h2>
        </div>
        <div className="border border-border p-6 sm:p-8">
          <p className="text-sm text-ink leading-relaxed mb-3">
            如果你是传统行业从业者、小老板、内容创作者、工具开发者或品牌方，想一起探索 AI 工具、内容产品、数字资料和轻交付服务，可以联系我。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            我对这些方向感兴趣：AI 工具共建、内容系统合作、数字产品联名、传统行业升级案例、一人公司经验交流。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        {/* 底部说明 */}
        <div className="mt-12 border border-border p-6 sm:p-8">
          <p className="text-sm text-ink leading-relaxed mb-3">
            我不接所有咨询，只接我能真正帮到的。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            如果你的需求不在范围内，或读完之后觉得匹配度不高，不用勉强——文章和资料库对你可能更有用。
            如果读完觉得「好像说的就是我的问题」，可以发一条简短的背景说明，我会评估是否能帮到你。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        <div className="mt-6 border border-border bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div>
            <p className="text-sm font-medium text-ink">还没想好？先从判断工具开始。</p>
            <p className="text-xs text-ink-muted mt-1 max-w-md">
              报价避坑指南、预算风险自测、报价审核清单都可以免费使用。先建立判断，再决定是否需要服务。
            </p>
          </div>
          <CTA href="/tools" label="按问题找工具" variant="primary" />
        </div>

        {/* 关联内容入口 */}
        <div className="mt-10">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            更多参考
          </p>
          <div className="space-y-2">
            {[
              { label: '所有文章', href: '/blog' },
              { label: '工具与资料库', href: '/resources' },
              { label: 'AI 提示词体验场', href: '/tools/prompts' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
              >
                <span className="text-stone">→</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </Container>
    </>
  )
}
