/**
 * app/resources/page.tsx
 *
 * 工具与资料库（四层结构）
 * 1. 免费工具
 * 2. 免费资料
 * 3. 低价产品（即将开放）
 * 4. 服务入口
 *
 * 本轮不接支付、不做下载权限。先把"免费 → 低价 → 服务"的路径展示出来。
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { resources } from '@/data/resources'
import type { ResourceAccessLevel } from '@/data/resources'
import { auth } from '@/auth'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '工具与资料库',
  description:
    '资料库不是下载站，而是 Zeno 把经验产品化的第一批资产。从预算表、报价清单，到提示词、工作流和在线工具，这里会逐步沉淀可复用的内容产品。',
}

const tagColors: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI:   'bg-[#EAE8F0] text-[#5B4E8A] border border-[#5B4E8A]/20',
}

const lowTierProducts = [
  {
    title: '装修报价避坑完整指南',
    desc: '签合同前的对照检查 PDF。覆盖报价漏项、模糊描述、增项陷阱、合同条款、水电报价六张核心检查表。',
    href: '/pricing/baojia-guide',
    price: '¥39',
    ready: true,
  },
  {
    title: 'AI 内容工作流提示词包 Pro',
    desc: '从选题、写作、排版到多平台分发，一套完整的 AI 辅助内容生产系统提示词。',
    href: '#',
    price: '即将定价',
    ready: false,
  },
  {
    title: '传统行业 AI 内容系统模板',
    desc: '帮传统行业从业者搭建自己的内容生产系统，从 0 到持续输出。',
    href: '#',
    price: '即将定价',
    ready: false,
  },
  {
    title: '一人公司启动清单',
    desc: '从定位、内容、工具、服务到变现，一个人启动事业的完整检查清单。',
    href: '#',
    price: '即将定价',
    ready: false,
  },
]

const serviceEntries = [
  {
    title: '装修报价诊断',
    desc: '拿到报价单不知道哪里有坑？签合同前我帮你做一次专业审查。',
    href: '/services#baojia-shenhe',
  },
  {
    title: 'AI 工作流咨询',
    desc: '针对你的具体行业场景，设计可落地的 AI 切入路径，而不是通用建议。',
    href: '/services#ai-neirong-xitong-zixun',
  },
  {
    title: '个人网站 / 内容系统咨询',
    desc: '帮你把零散内容沉淀成自己的阵地，从 0 搭建可持续的内容资产。',
    href: '/services',
  },
]

export default async function ResourcesPage() {
  await auth()

  return (
    <>
      <PageHero
        label="工具与资料"
        title="把经验产品化的第一批资产"
        subtitle="资料库不是下载站，而是 Zeno 把经验产品化的第一批资产。从预算表、报价清单，到提示词、工作流和在线工具，这里会逐步沉淀可复用的内容产品。"
        size="content"
      />

      <Container size="content" className="py-section">

        {/* 路径示意 */}
        <div className="mb-12 border-l-2 border-stone-light pl-4">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
            使用顺序
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            免费工具 / 资料 → 低价数字产品 → 一对一服务。
            建议先用免费的建立判断，再决定是否需要更深入的合作。
          </p>
        </div>

        {/* ───── 第一层：免费工具 ───── */}
        <section className="mb-16">
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">第一层</p>
            <h2 className="text-lg font-semibold text-ink">免费工具</h2>
            <p className="text-sm text-ink-muted mt-1">即开即用，不需要登录。</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/tools/prompts"
              className="group border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                AI 提示词体验场
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                选场景、填情况、一键生成可直接用的提示词。覆盖写作、装修沟通、报价分析、选题、AI 升级。
              </p>
            </Link>

            <Link
              href="/tools/md2wechat"
              className="group border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                Markdown 微信排版工具
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                把 Markdown 文稿一键转成微信公众号排版，可直接复制 HTML 粘贴到公众号后台。
              </p>
            </Link>

            <div className="border border-border bg-surface p-5 opacity-75">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-semibold text-ink">装修预算风险自测</p>
                <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                回答几个问题，快速判断你的装修预算是否存在超支风险。
              </p>
            </div>

            <div className="border border-border bg-surface p-5 opacity-75">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-semibold text-ink">报价单风险自查</p>
                <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                对照清单检查你的装修报价单，发现常见模糊项和风险项。
              </p>
            </div>
          </div>
        </section>

        {/* ───── 第二层：免费资料 ───── */}
        <section className="mb-16">
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">第二层</p>
            <h2 className="text-lg font-semibold text-ink">免费资料</h2>
            <p className="text-sm text-ink-muted mt-1">关注公众号「Zeno AI装修笔记」回复对应关键词领取。</p>
          </header>

          <div className="space-y-8">
            {resources.map((resource) => {
              const level: ResourceAccessLevel = resource.accessLevel ?? 'login'
              if (level === 'admin') return null

              return (
                <div
                  key={resource.id}
                  id={resource.slug}
                  className="border border-border overflow-hidden scroll-mt-20"
                >
                  <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 font-medium ${
                            tagColors[resource.tag] ?? 'bg-stone-pale text-stone border border-stone/20'
                          }`}
                        >
                          {resource.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-ink leading-tight">{resource.title}</h3>
                      <p className="text-sm text-stone mt-1">{resource.subtitle}</p>
                    </div>
                    {resource.previewImage && resource.previewImage.length > 0 ? (
                      <div className="relative shrink-0 w-20 h-14 overflow-hidden border border-border/60">
                        <Image
                          src={resource.previewImage}
                          alt={resource.previewAlt || resource.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <span className="text-3xl text-stone/15 font-light shrink-0 leading-none select-none">↓</span>
                    )}
                  </div>

                  <div className="px-6 py-6 space-y-5">
                    <p className="text-sm text-ink-muted leading-relaxed">{resource.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">适合谁</p>
                        <p className="text-sm text-ink leading-relaxed">{resource.forWho}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">解决什么问题</p>
                        <p className="text-sm text-ink leading-relaxed">{resource.solves}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">怎么用</p>
                      <ol className="space-y-1.5">
                        {resource.howToUse.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">{i + 1}.</span>
                            <span className="text-sm text-ink-muted leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-surface-warm border border-border px-4 py-3">
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">注意事项</p>
                      <p className="text-xs text-ink-muted leading-relaxed">{resource.caveats}</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border bg-stone-pale/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">领取方式</p>
                      <p className="text-sm text-ink-muted">{resource.howToGet}</p>
                    </div>
                    <span className="text-xs text-stone shrink-0">公众号回复关键词领取</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ───── 第三层：低价产品（即将开放） ───── */}
        <section className="mb-16">
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">第三层</p>
            <h2 className="text-lg font-semibold text-ink">低价产品｜即将开放</h2>
            <p className="text-sm text-ink-muted mt-1">把深度经验打包成可直接使用的工具包和系统模板。</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lowTierProducts.map((p) =>
              p.ready ? (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                      {p.title}
                    </p>
                    <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">
                      预告页
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed mb-2">{p.desc}</p>
                  <p className="text-xs text-stone font-medium">{p.price}</p>
                </Link>
              ) : (
                <div
                  key={p.title}
                  className="border border-border bg-surface p-5 opacity-75 block"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink">{p.title}</p>
                    <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">
                      即将开放
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed mb-2">{p.desc}</p>
                  <p className="text-xs text-ink-faint">{p.price}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* ───── 第四层：服务入口 ───── */}
        <section className="mb-12">
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">第四层</p>
            <h2 className="text-lg font-semibold text-ink">服务入口</h2>
            <p className="text-sm text-ink-muted mt-1">资料和工具不够时，可以直接和我合作。</p>
          </header>

          <div className="space-y-3">
            {serviceEntries.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex items-start justify-between gap-4 border border-border bg-surface p-5 hover:bg-surface-warm transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">{s.title}</p>
                  <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
                <span className="text-stone text-sm shrink-0 mt-0.5">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 底部 CTA */}
        <div className="pt-8 border-t border-border flex flex-wrap gap-3">
          <p className="w-full text-sm text-ink-muted mb-2">
            资料是辅助，不替代你的现场判断。先用一遍，再回来看对应文章，会更有感觉。
          </p>
          <CTA href="/services" label="查看服务" variant="secondary" />
          <CTA href="/blog" label="看文章" variant="ghost" />
          <CTA href="/topics" label="看专题" variant="ghost" />
        </div>

      </Container>
    </>
  )
}
