/**
 * app/resources/page.tsx
 *
 * 资料库页面（权限改造版）
 * - 每张资料卡片显示 accessLevel 标签
 * - 按钮根据权限状态变化
 * - 第一阶段：前端展示权限逻辑，不做真实下载
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
    '把经验产品化的第一批资产——免费工具、免费资料、数字产品。包括 AI 提示词体验场、Markdown 微信排版工具、装修预算模板、报价审核清单等。',
}

const tagColors: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI:   'bg-[#EAE8F0] text-[#5B4E8A] border border-[#5B4E8A]/20',
}

export default async function ResourcesPage() {
  await auth()  // 保留 auth 调用，未来扩展权限时使用

  return (
    <>
      <PageHero
        label="工具与资料"
        title="把经验产品化的第一批资产"
        subtitle="资料库不是下载站，而是 Zeno 把经验产品化的第一批资产。每份资料都对应一个具体场景，每个工具都解决一个真实问题。"
        size="content"
      />


      <Container size="content" className="py-section">

        {/* ───── 免费工具 ───── */}
        <div className="mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">免费工具</p>
          <h2 className="text-lg font-semibold text-ink">在线工具</h2>
          <p className="text-sm text-ink-muted mt-1">即开即用，不需要登录。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {/* AI 提示词体验场 */}
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

          {/* Markdown 微信排版工具 */}
          <Link
            href="/tools/md2wechat"
            className="group border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors"
          >
            <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
              Markdown 微信排版工具
            </p>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              把 Markdown 文稿一键转成微信公众号排版，可以直接复制 HTML 粘贴到公众号后台。
            </p>
          </Link>

          {/* 装修预算风险自测 — 即将开放 */}
          <div className="border border-border bg-surface p-5 opacity-75">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-sm font-semibold text-ink">装修预算风险自测</p>
              <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              回答几个问题，快速判断你的装修预算是否存在超支风险。
            </p>
          </div>

          {/* 报价单风险自查 — 即将开放 */}
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

        {/* ───── 免费资料 ───── */}
        <div className="mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">免费资料</p>
          <h2 className="text-lg font-semibold text-ink">可直接使用的资料</h2>
          <p className="text-sm text-ink-muted mt-1">关注公众号「Zeno AI装修笔记」，回复对应关键词即可获取。</p>
        </div>

        {/* 资料卡片列表 */}
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
              {/* 卡片头部 */}
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
                  <h2 className="text-lg font-semibold text-ink leading-tight">{resource.title}</h2>
                  <p className="text-sm text-stone mt-1">{resource.subtitle}</p>
                </div>
                {/* 预览图（有图才显示） */}
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

              {/* 卡片内容 */}
              <div className="px-6 py-6 space-y-5">
                <p className="text-sm text-ink-muted leading-relaxed">{resource.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                      适合谁
                    </p>
                    <p className="text-sm text-ink leading-relaxed">{resource.forWho}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                      解决什么问题
                    </p>
                    <p className="text-sm text-ink leading-relaxed">{resource.solves}</p>
                  </div>
                </div>

                {/* 怎么用 */}
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                    怎么用
                  </p>
                  <ol className="space-y-1.5">
                    {resource.howToUse.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">
                          {i + 1}.
                        </span>
                        <span className="text-sm text-ink-muted leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 注意事项 */}
                <div className="bg-surface-warm border border-border px-4 py-3">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">
                    注意事项
                  </p>
                  <p className="text-xs text-ink-muted leading-relaxed">{resource.caveats}</p>
                </div>
              </div>

              {/* 卡片底部：领取方式 */}
              <div className="px-6 py-4 border-t border-border bg-stone-pale/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">
                    领取方式
                  </p>
                  <p className="text-sm text-ink-muted">{resource.howToGet}</p>
                </div>
                <div className="shrink-0">
                  {/* 改了什么：“领取”不再跳 /contact，直接显示公众号关键词 */}
                  {/* 为什么改：跳转 contact 路径断裂，用户迷路 */}
                  <span className="text-xs text-stone">
                    公众号回复关键词领取
                  </span>
                </div>
              </div>

              {/* 服务 cross-sell：仅装修类资料显示 */}
              {(resource.slug === 'baojia-shenhe-qingdan' ||
                resource.slug === 'zhuangxiu-yusuan-moban' ||
                resource.slug === 'shizhu-pai-zijian-biao') && (
                <div className="px-6 py-3.5 border-t border-border bg-surface-warm/50">
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {resource.slug === 'baojia-shenhe-qingdan'
                      ? '如果你手里已经有报价单，想让人直接帮你看，审核服务会比清单更直接。'
                      : resource.slug === 'zhuangxiu-yusuan-moban'
                      ? '如果你的预算已经理不清了，具体的判断通常比再看一份模板更有效。'
                      : '先用资料建立判断，再决定是否需要我直接帮你看。'}
                    <Link
                      href="/services"
                      className="text-stone hover:underline underline-offset-2 decoration-stone/40 ml-1"
                    >
                      查看服务 →
                    </Link>
                  </p>
                </div>
              )}
            </div>
            )
          })}
        </div>

        {/* ───── 付费资料 / 即将开放 ───── */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">付费资料 / 即将开放</p>
            <h2 className="text-lg font-semibold text-ink">数字产品</h2>
            <p className="text-sm text-ink-muted mt-1">把深度经验打包成可直接使用的工具包和系统模板。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: '装修前 12 张避坑表', desc: '覆盖预算、合同、报价、材料、水电、验收等 12 个关键节点，每张一页，逐项自查。' },
              { title: 'AI 内容工作流提示词包 Pro', desc: '从选题、写作、排版到多平台分发，一套完整的 AI 辅助内容生产系统提示词。' },
              { title: '传统行业 AI 内容系统模板', desc: '帮传统行业从业者搭建自己的内容生产系统，从 0 到持续输出。' },
              { title: '一人公司启动清单', desc: '从定位、内容、工具、服务到变现，一个人启动事业的完整检查清单。' },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-surface p-5 opacity-75">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 在线工具入口 */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-5">
            更多在线工具
          </p>
          <Link
            href="/tools/md2wechat"
            className="group flex items-start justify-between gap-4 border border-border bg-surface p-5 hover:bg-surface-warm transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                Markdown 微信排版工具
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                把 Markdown 文稿一键转成微信公众号排版，可以直接复制 HTML 粘贴到公众号后台。免费使用，无需登录。
              </p>
            </div>
            <span className="text-stone text-sm shrink-0 mt-0.5">→</span>
          </Link>
        </div>

        {/* 底部 CTA */}
        <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-3">
          <p className="w-full text-sm text-ink-muted mb-2">
            资料是辅助，不替代你的现场判断。先用一遍，再回来看对应文章，会更有感觉。
            如果需要更具体的帮助，可以看服务页。
          </p>
          <CTA href="/services" label="查看服务" variant="secondary" />
          <CTA href="/blog" label="看文章" variant="ghost" />
          <CTA href="/topics" label="看专题" variant="ghost" />
        </div>

      </Container>
    </>
  )
}
