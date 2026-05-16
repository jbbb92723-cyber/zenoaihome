/**
 * app/resources/page.tsx
 *
 * 资源页承担“按问题找入口”的角色：
 * 1. 先让业主定位自己卡在哪
 * 2. 再给对应清单、工具和低价指南
 * 3. 最后引导到合适的人工判断服务
 *
 * 资源领取走网页端记录。文件直链/下载权限可在后台配置后继续接入。
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { resources, type ResourceAccessLevel } from '@/data/resources'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import CTA from '@/components/CTA'
import ResourceClaimButton from '@/components/resources/ResourceClaimButton'

export const metadata: Metadata = {
  title: '装修判断力资源入口 | 按问题拿清单和工具',
  description:
    '按报价风险、签约前判断、预算分配、施工验收和居住需求拿清单、模板和工具，先解决当前问题，再进入更深入服务。',
  alternates: {
    canonical: 'https://zenoaihome.com/resources',
  },
}

const tagColors: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI: 'bg-surface-warm text-stone border border-stone/20',
}

const serviceEntries = [
  {
    title: '报价风险快审',
    desc: '手上已经有报价单，但看不清漏项、模糊项和异常价格时，先把重点风险挑出来。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    title: '预算取舍诊断',
    desc: '还没到逐行看报价，但总预算越算越乱时，先判断哪些钱要守住、哪些可以晚点花。',
    href: '/services/renovation#yusuan-zixun',
  },
  {
    title: '签约前决策包',
    desc: '报价、预算、合同和付款节点一起卡住时，把签字前的关键判断一次看全。',
    href: '/services/renovation#qianyue-qian-juece-bao',
  },
  {
    title: 'AI 工作流咨询',
    desc: '想把个人经验、内容生产或行业流程接入 AI，先拿免费工具跑一个场景再决定。',
    href: '/services/ai-workflow',
  },
]

const problemEntryCards = [
  {
    title: '我正在看报价单',
    description: '先不要只比总价。把漏项、模糊项、单位不清和后期增项口子筛一遍。',
    primary: { label: '拿报价风险清单', href: '/resources#baojia-shenhe-qingdan' },
    secondary: { label: '看 ¥39 报价指南', href: '/pricing/baojia-guide' },
    fallback: { label: '直接看报价风险快审 ->', href: '/services/renovation#baojia-shenhe' },
  },
  {
    title: '我快要签合同了',
    description: '报价、预算、合同和付款节点一起看，别只听口头承诺和优惠期限。',
    primary: { label: '先做报价初筛', href: '/tools/quote-check' },
    secondary: { label: '看签约前怎么选服务', href: '/services/renovation#choose' },
    fallback: { label: '直接看签约前决策包 ->', href: '/services/renovation#qianyue-qian-juece-bao' },
  },
  {
    title: '我怕装修超预算',
    description: '先看你的钱更像简约够住、舒适耐用，还是精致改善，再查为什么会超。',
    primary: { label: '拿装修预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
    secondary: { label: '拆预算分配', href: '/tools/budget-structure' },
    fallback: { label: '直接看预算取舍诊断 ->', href: '/services/renovation#yusuan-zixun' },
  },
  {
    title: '我已经开工，不知道怎么验收',
    description: '按施工节点看该检查什么、该拍什么、哪些问题要先留证据。',
    primary: { label: '拿验收清单', href: '/resources#yanshou-qingdan' },
    secondary: { label: '生成验收节点向导', href: '/tools/inspection-guide' },
    fallback: { label: '看装修服务边界 ->', href: '/services/renovation' },
  },
  {
    title: '我不想把家装成样板间',
    description: '先把真实生活需求写清楚，再谈风格、材料和预算分配。',
    primary: { label: '拿居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' },
    secondary: { label: '看居住场景专题', href: '/topics#shi-zhu-pai-zhuangxiu' },
    fallback: { label: '看居住场景装修服务 ->', href: '/services/renovation#shi-zhu-pai-zhuangxiu' },
  },
]

const extensionEntryCard = {
  title: '我想把 AI 用进内容或工作流',
  description: '适合已经有真实任务，想用 AI 放大经验的人。',
  primary: { label: '拿 AI 工作流提示词包', href: '/resources#ai-neirong-gongzuoliu-tishici-bao' },
  secondary: { label: '去提示词体验场', href: '/tools/prompts' },
  fallback: { label: '看 AI 工作流咨询 ->', href: '/services/ai-workflow' },
}

const pathwayCards = [
  {
    title: '先定位问题',
    desc: '你是看不懂报价、快签合同、怕超预算，还是已经开工要验收。',
  },
  {
    title: '再拿对应工具',
    desc: '用清单、模板和网页工具，把模糊担心变成能核对的具体问题。',
  },
  {
    title: '需要时进服务',
    desc: '材料已经具体、时间也临近时，再进入报价快审、预算取舍或决策包。',
  },
]

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        label="装修判断力资源入口"
        title="按你卡住的问题，拿对应清单和工具"
        subtitle="先找到你现在最难判断的那一步，再拿清单、模板或工具。材料已经具体的，再进人工服务。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 border border-stone/30 bg-stone/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">签约前优先</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">如果你手上已经有报价，先别从资料库乱翻。</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            先走报价初筛，再拿报价审核清单；如果要自己系统看，进 ¥39 指南；如果已经临近签约，再看人工快审或决策包。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/tools/quote-check" className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white transition-colors hover:bg-stone/90">先做报价初筛</Link>
            <Link href="/resources#baojia-shenhe-qingdan" className="inline-flex h-10 items-center border border-stone/40 px-4 text-sm font-semibold text-stone transition-colors hover:bg-stone-pale">拿报价审核清单</Link>
            <Link href="/pricing/baojia-guide" className="inline-flex h-10 items-center border border-stone/40 px-4 text-sm font-semibold text-stone transition-colors hover:bg-stone-pale">看 ¥39 指南</Link>
          </div>
        </section>

        <section className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">内容路径</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先把问题找准，再拿资料。</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {pathwayCards.map((card) => (
              <div key={card.title} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <SectionHeader
            label="先按问题找"
            title="你现在更像哪一种？"
            subtitle="每一格先给一个资料或工具入口，再给一条补充路径。装修签约前判断放在最前面，AI 放在延伸入口。"
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {problemEntryCards.map((card) => (
              <div key={card.title} className="border border-border bg-surface p-5 sm:p-6">
                <h2 className="mb-2 text-base font-semibold text-ink">{card.title}</h2>
                <p className="mb-4 text-sm leading-relaxed text-ink-muted">{card.description}</p>
                <div className="space-y-2.5">
                  <Link href={card.primary.href} className="block text-sm text-ink transition-colors hover:text-stone">
                    {card.primary.label}
                  </Link>
                  <Link href={card.secondary.href} className="block text-sm text-ink-muted transition-colors hover:text-stone">
                    {card.secondary.label}
                  </Link>
                  <Link href={card.fallback.href} className="block text-sm text-stone underline-offset-2 hover:underline">
                    {card.fallback.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border border-border bg-surface-warm p-5 sm:p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">延伸入口</p>
            <div className="grid gap-4 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
              <div>
                <h2 className="text-base font-semibold text-ink">{extensionEntryCard.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{extensionEntryCard.description}</p>
              </div>
              <div className="space-y-2.5">
                <Link href={extensionEntryCard.primary.href} className="block text-sm text-ink transition-colors hover:text-stone">
                  {extensionEntryCard.primary.label}
                </Link>
                <Link href={extensionEntryCard.secondary.href} className="block text-sm text-ink-muted transition-colors hover:text-stone">
                  {extensionEntryCard.secondary.label}
                </Link>
                <Link href={extensionEntryCard.fallback.href} className="block text-sm text-stone underline-offset-2 hover:underline">
                  {extensionEntryCard.fallback.label}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">
            如果你更习惯按阶段补充找
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#zhuangxiu-qian" className="border border-stone/30 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-stone-pale">① 签约前判断</a>
            <a href="#zhuangxiu-zhong" className="border border-stone/30 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-stone-pale">② 施工中验收</a>
            <a href="#zhenshi-juzhu" className="border border-stone/30 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-stone-pale">③ 居住需求</a>
            <a href="#ziliaolingqu" className="border border-stone/30 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-stone-pale">资料领取区</a>
            <a href="#ai-fuzhu" className="border border-stone/30 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-stone-pale">AI 延伸</a>
          </div>
        </div>

        <section id="zhuangxiu-qian" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段一"
            title="还没签合同的时候"
            subtitle="这一阶段最容易把问题签进合同里。先看报价，再看预算，再看超预算原因，不要只盯总价。"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/tools/quote-check"
              className="group border border-stone/30 bg-stone/5 p-6 transition-colors hover:bg-stone/10 sm:col-span-2 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">免费 · 网页端 · 报价初筛</p>
                  <p className="text-base font-semibold text-ink transition-colors group-hover:text-stone">
                    报价初筛工具
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
                    上传材料留在浏览器本地，对照报价单勾选关键边界，生成风险类型和追问话术。
                  </p>
                  <p className="mt-3 text-xs font-medium text-stone">上传报价单 -&gt;</p>
                </div>
                <span className="mt-1 shrink-0 text-xl text-stone transition-transform group-hover:translate-x-1">-&gt;</span>
              </div>
            </Link>

            <Link
              href="/tools/budget-structure"
              className="group border border-stone/30 bg-stone/5 p-6 transition-colors hover:bg-stone/10 sm:p-7"
            >
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">免费 · 5 分钟 · 预算分配</p>
              <p className="text-base font-semibold text-ink transition-colors group-hover:text-stone">
                预算分配工具
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                先看总预算更像简约够住、舒适耐用，还是精致改善，再拆成几份业主能看懂的钱。
              </p>
              <p className="mt-3 text-xs font-medium text-stone">拆预算分配 -&gt;</p>
            </Link>

            <Link
              href="/tools/budget-risk"
              className="group border border-stone/30 bg-stone/5 p-6 transition-colors hover:bg-stone/10 sm:p-7"
            >
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">免费 · 10 分钟 · 不需注册</p>
              <p className="text-base font-semibold text-ink transition-colors group-hover:text-stone">
                超预算原因自测
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                回答 8 个问题，先分清更像报价没说清、预算没分好、流程没控住，还是需求太散。
              </p>
              <p className="mt-3 text-xs font-medium text-stone">开始自测 -&gt;</p>
            </Link>

            <Link
              href="/pricing/baojia-guide"
              className="group border border-border bg-surface p-6 transition-colors hover:bg-surface-warm sm:col-span-2 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">付费 · ¥39 · 6 张检查表</p>
                  <p className="text-base font-semibold text-ink transition-colors group-hover:text-stone">
                    ¥39 报价指南
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
                    覆盖报价漏项、模糊描述、增项、合同、水电报价六张检查表。适合签合同前自己系统过一遍。
                  </p>
                  <p className="mt-3 text-xs font-medium text-stone">看详情 -&gt;</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-5 border border-border bg-surface-warm p-5 sm:p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">看完还不确定？</p>
            <h3 className="mb-2 text-base font-semibold text-ink">人工判断分三档，不要一上来就看最高客单</h3>
            <p className="mb-4 text-sm leading-relaxed text-ink-muted">
              只是不确定报价重点风险，进报价快审；预算取舍本身没想清楚，进预算取舍诊断；临近签字，报价、合同和付款节点都要一起看，再进签约前决策包。
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA href="/services/renovation#baojia-shenhe" label="看报价风险快审" variant="secondary" />
              <CTA href="/services/renovation#yusuan-zixun" label="看预算取舍诊断" variant="ghost" />
              <CTA href="/services/renovation#qianyue-qian-juece-bao" label="看签约前决策包" variant="primary" />
            </div>
          </div>
        </section>

        <section id="zhuangxiu-zhong" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段二"
            title="已经开工，就按节点验收"
            subtitle="施工阶段不是当前主线，但已经开工的人需要清楚入口。重点是按节点检查、拍照留证、把整改说清楚。"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/resources#yanshou-qingdan" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">验收清单</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                从水电隐蔽到竣工交付，每个节点知道该看什么。
              </p>
              <p className="mt-3 text-xs text-stone">领取清单 -&gt;</p>
            </Link>

            <Link href="/tools/inspection-guide" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">验收节点向导</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                选择当前工序，生成更贴近现场的检查顺序。
              </p>
              <p className="mt-3 text-xs text-stone">打开工具 -&gt;</p>
            </Link>

            <Link href="/start#construction" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">施工阶段路径</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                不知道现在该看预算、材料还是工序时，回到装修路径里定位。
              </p>
              <p className="mt-3 text-xs text-stone">回到路径 -&gt;</p>
            </Link>
          </div>
        </section>

        <section id="zhenshi-juzhu" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段三"
            title="不想装成样板间，就先写清真实生活"
            subtitle="审美不是先选风格图，而是先把每天怎么住、哪些东西必须方便、哪些地方值得克制说清楚。"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/resources#shizhu-pai-zijian-biao" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">居住场景自查表</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                方案确定前，把家里真实的动线、收纳、清洁和使用习惯写下来。
              </p>
              <p className="mt-3 text-xs text-stone">领取自查表 -&gt;</p>
            </Link>

            <Link href="/topics#shi-zhu-pai-zhuangxiu" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">居住场景专题</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                看看“住得舒服”如何影响材料、收纳、灯光和预算取舍。
              </p>
              <p className="mt-3 text-xs text-stone">看专题 -&gt;</p>
            </Link>

            <Link href="/services/renovation#shi-zhu-pai-zhuangxiu" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">居住场景装修服务</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                这是后续延伸服务，不是当前最窄入口，适合匹配度更高的项目。
              </p>
              <p className="mt-3 text-xs text-stone">看服务 -&gt;</p>
            </Link>
          </div>
        </section>

        <section id="ziliaolingqu" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="资料领取区"
            title="所有清单和模板"
            subtitle="如果你已经知道要找哪一份，直接从这里领取。前面的阶段入口负责帮你判断先用哪一份。"
          />

          <div className="space-y-8">
            {resources.map((resource) => {
              const level: ResourceAccessLevel = resource.accessLevel ?? 'login'
              if (level === 'admin') return null

              return (
                <div
                  key={resource.id}
                  id={resource.slug}
                  className="scroll-mt-20 overflow-hidden border border-border"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-border bg-surface-warm px-6 py-5">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium ${
                            tagColors[resource.tag] ?? 'bg-stone-pale text-stone border border-stone/20'
                          }`}
                        >
                          {resource.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold leading-tight text-ink">{resource.title}</h3>
                      <p className="mt-1 text-sm text-stone">{resource.subtitle}</p>
                    </div>
                    {resource.previewImage && resource.previewImage.length > 0 ? (
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-border/60">
                        <Image
                          src={resource.previewImage}
                          alt={resource.previewAlt || resource.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <span className="select-none text-3xl font-light leading-none text-stone/15">↓</span>
                    )}
                  </div>

                  <div className="space-y-5 px-6 py-6">
                    <p className="text-sm leading-relaxed text-ink-muted">{resource.description}</p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">适合谁</p>
                        <p className="text-sm leading-relaxed text-ink">{resource.forWho}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">解决什么问题</p>
                        <p className="text-sm leading-relaxed text-ink">{resource.solves}</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">怎么用</p>
                      <ol className="space-y-1.5">
                        {resource.howToUse.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 w-4 shrink-0 text-xs font-semibold text-stone">{i + 1}.</span>
                            <span className="text-sm leading-relaxed text-ink-muted">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="border border-border bg-surface-warm px-4 py-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-faint">注意事项</p>
                      <p className="text-xs leading-relaxed text-ink-muted">{resource.caveats}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-4 border-t border-border bg-stone-pale/20 px-6 py-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-faint">领取方式</p>
                      <p className="text-sm text-ink-muted">{resource.howToGet}</p>
                    </div>
                    <ResourceClaimButton resourceId={resource.slug} resourceTitle={resource.title} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="ai-fuzhu" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="AI 延伸入口"
            title="AI 只能放大你的判断，不能替你做判断"
            subtitle="如果你的主问题是装修签约前判断，先用前面的报价和预算工具。这里适合内容生产、提示词和个人工作流。"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/tools/prompts"
              className="group border border-stone/30 bg-stone/5 p-6 transition-colors hover:bg-stone/10 sm:col-span-2 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">延伸工具</p>
                  <p className="text-base font-semibold text-ink transition-colors group-hover:text-stone">
                    AI 提示词体验场
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
                    选场景、填情况、一键生成可直接用的提示词。重点不是炫技，而是让真实任务更容易推进。
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-xl text-stone transition-transform group-hover:translate-x-1">-&gt;</span>
              </div>
            </Link>

            <Link
              href="/tools/md2wechat"
              className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6"
            >
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">
                Markdown 微信排版工具
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                把 Markdown 文稿转成微信公众号排版，用于内容中台的日常发布。
              </p>
              <p className="mt-3 text-xs text-stone">立即使用 -&gt;</p>
            </Link>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="mb-1.5 flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">AI 内容工作流提示词包 Pro</p>
                <span className="border border-stone/30 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-stone">即将定价</span>
              </div>
              <p className="text-xs leading-relaxed text-ink-muted">
                从选题、写作、排版到复盘，把个人经验沉淀成可反复使用的内容流程。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            label="需要更深入的帮助"
            title="工具不够时，再进入人工判断"
            subtitle="先用免费工具建立基本判断，再决定是否需要更具体的报价、预算或签约前服务。"
          />

          <div className="space-y-3">
            {serviceEntries.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex items-start justify-between gap-4 border border-border bg-surface p-5 transition-colors hover:bg-surface-warm"
              >
                <div>
                  <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">{s.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{s.desc}</p>
                </div>
                <span className="mt-0.5 shrink-0 text-sm text-stone">-&gt;</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-border pt-8">
          <p className="mb-4 text-sm text-ink-muted">
            工具是辅助，不替代你的现场判断。先用一遍，再回来看对应文章或服务，会更容易分清下一步。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/pricing/baojia-guide" label="看 ¥39 报价指南" variant="primary" />
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="secondary" />
            <CTA href="/blog" label="看文章" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
