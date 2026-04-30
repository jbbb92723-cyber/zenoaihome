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
import SectionHeader from '@/components/SectionHeader'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '装修判断工具库 — 按你的装修阶段，找到对的工具',
  description:
    '不是下载站，是帮你做出更清醒装修决策的判断工具库。按装修前判断、装修中落地、真实居住选择、AI 辅助四个阶段组织，每个工具都解决一个具体问题。',
}

const tagColors: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI:   'bg-[#EAE8F0] text-[#5B4E8A] border border-[#5B4E8A]/20',
}

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
        label="判断工具库"
        title="签合同前，先帮自己做一次风险体检"
        subtitle="按你的装修阶段，找到对应的判断工具。每一个都来自 16 年一线经验，不是拼凑内容。"
        size="content"
      />

      <Container size="content" className="py-section">

        {/* 阶段导航 */}
        <div className="mb-12 flex flex-wrap gap-3">
          <a href="#zhuangxiu-qian" className="text-xs font-medium text-stone border border-stone/30 px-3 py-1.5 hover:bg-stone-pale transition-colors">① 装修前判断</a>
          <a href="#zhuangxiu-zhong" className="text-xs font-medium text-stone border border-stone/30 px-3 py-1.5 hover:bg-stone-pale transition-colors">② 装修中落地</a>
          <a href="#zhenshi-juzhu" className="text-xs font-medium text-stone border border-stone/30 px-3 py-1.5 hover:bg-stone-pale transition-colors">③ 真实居住选择</a>
          <a href="#ai-fuzhu" className="text-xs font-medium text-stone border border-stone/30 px-3 py-1.5 hover:bg-stone-pale transition-colors">④ AI 辅助装修</a>
        </div>

        {/* ───── 阶段一：装修前判断 ───── */}
        <section id="zhuangxiu-qian" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段一"
            title="装修前判断 — 签合同之前的风险排查"
            subtitle="预算怎么定、报价单怎么看、合同怎么签——在花钱之前，先把判断力建立起来。"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/pricing/baojia-guide"
              className="group sm:col-span-2 border border-stone/30 bg-stone/5 p-6 sm:p-7 hover:bg-stone/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-2">核心推荐 · 最多人领取</p>
                  <p className="text-base font-semibold text-ink group-hover:text-stone transition-colors">
                    《装修报价避坑完整指南》
                  </p>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed max-w-lg">
                    覆盖报价漏项、模糊描述、增项陷阱、合同条款、水电报价六张核心检查表。签合同之前看一遍，可能帮你省下几万块。
                  </p>
                  <p className="text-xs text-stone font-medium mt-3">¥39 · 立即查看 →</p>
                </div>
                <span className="text-stone text-xl shrink-0 mt-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-semibold text-ink">装修预算风险自测</p>
                <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                回答几个问题，快速判断你的装修预算是否存在超支风险。
              </p>
              <p className="text-xs text-ink-faint mt-2">免费</p>
            </div>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-semibold text-ink">报价单风险自查清单</p>
                <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                对照清单检查报价单，发现常见模糊项和风险项。
              </p>
              <p className="text-xs text-ink-faint mt-2">免费</p>
            </div>
          </div>
        </section>

        {/* ───── 阶段二：装修中落地 ───── */}
        <section id="zhuangxiu-zhong" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段二"
            title="装修中落地 — 施工过程的质量保障"
            subtitle="工地开工之后，用这些工具确保关键节点不出问题。"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border bg-surface p-5 sm:p-6">
              <p className="text-sm font-semibold text-ink">装修验收清单</p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                从水电隐蔽工程到竣工交付，每个施工节点的验收要点。
              </p>
              <p className="text-xs text-ink-faint mt-2">公众号回复「验收」领取</p>
            </div>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <p className="text-sm font-semibold text-ink">装修预算模板</p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                把"感觉花钱"变成"有结构地花钱"。帮你按分类控制每一笔支出。
              </p>
              <p className="text-xs text-ink-faint mt-2">公众号回复「预算」领取</p>
            </div>
          </div>
        </section>

        {/* ───── 阶段三：真实居住选择 ───── */}
        <section id="zhenshi-juzhu" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段三"
            title="真实居住选择 — 住进去之后的判断"
            subtitle="装修不是终点，住得舒服才是。这些资料帮你做出更适合真实生活的选择。"
          />

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

        {/* ───── 阶段四：AI 辅助装修 ───── */}
        <section id="ai-fuzhu" className="mb-16 scroll-mt-20">
          <SectionHeader
            label="阶段四"
            title="AI 辅助装修 — 让 AI 帮你做判断"
            subtitle="不需要懂 AI，只需要知道你要解决什么问题。提示词帮你分析报价、生成沟通话术、整理选材方案。"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/tools/prompts"
              className="group sm:col-span-2 border border-stone/30 bg-stone/5 p-6 sm:p-7 hover:bg-stone/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-2">核心推荐</p>
                  <p className="text-base font-semibold text-ink group-hover:text-stone transition-colors">
                    AI 提示词体验场
                  </p>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed max-w-lg">
                    选场景、填情况、一键生成可直接用的提示词。覆盖报价分析、施工沟通、选材方案、装修预算——不需要懂 AI，只需要知道你要解决什么问题。
                  </p>
                </div>
                <span className="text-stone text-xl shrink-0 mt-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link
              href="/tools/md2wechat"
              className="group border border-border bg-surface p-5 sm:p-6 card-hover"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                Markdown 微信排版工具
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                把 Markdown 文稿一键转成微信公众号排版，可直接复制粘贴。
              </p>
              <p className="text-xs text-stone mt-3">立即使用 →</p>
            </Link>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-semibold text-ink">AI 内容工作流提示词包 Pro</p>
                <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将定价</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                从选题、写作、排版到多平台分发，一套完整的 AI 辅助内容生产系统提示词。
              </p>
            </div>
          </div>
        </section>

        {/* ───── 需要更深入帮助？ ───── */}
        <section className="mb-12">
          <SectionHeader
            label="需要更深入的帮助"
            title="工具不够时，可以直接找我"
            subtitle="先用免费工具建立判断，再决定是否需要更深入的合作。"
          />

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
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-ink-muted mb-4">
            工具是辅助，不替代你的现场判断。先用一遍，再回来看对应文章，会更有感觉。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/pricing/baojia-guide" label="领取报价避坑指南" variant="primary" />
            <CTA href="/services" label="查看服务" variant="secondary" />
            <CTA href="/blog" label="看文章" variant="ghost" />
          </div>
        </div>

      </Container>
    </>
  )
}
