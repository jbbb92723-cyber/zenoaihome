import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'AI 工具｜一人公司诊断 · 内容策略 · 装修判断',
  description:
    '三个免费工具：一人公司诊断（看看你卡在哪一步）、内容策略生成（找到值得写的东西）、装修判断工具（17 年经验做成的公开工具）。不花钱，直接用。',
  alternates: {
    canonical: 'https://zenoaihome.com/ai-tools',
  },
}

const tools = [
  {
    id: 'opc',
    icon: '🧭',
    title: '一人公司诊断',
    tag: '5 分钟 · 免费',
    problem: '不知道现在该优先做什么——产品、获客、还是交付？',
    what: '10 个问题，覆盖你的产品、客户、定价和交付状态。做完拿一份你自己的「一人公司体检报告」。',
    result: '你会得到：你的当前阶段 + 卡在哪一环 + 下一步优先做什么',
    href: '/ai-tools/opc-diagnosis',
    cta: '开始诊断',
  },
  {
    id: 'content',
    icon: '✍️',
    title: '内容策略生成',
    tag: '2 分钟 · 免费',
    problem: '想做内容但不知道写什么？感觉自己没什么值得讲的？',
    what: '输入你的行业和擅长的事，AI 帮你生成 3 个内容方向 + 选题。不是替你写稿——是帮你找到什么值得写。',
    result: '你会得到：3 个内容方向 × 每方向 2-3 个具体选题',
    href: '/ai-tools/content-strategy',
    cta: '生成策略',
  },
  {
    id: 'renovation',
    icon: '🏠',
    title: '装修判断工具',
    tag: '17 年经验 · 免费',
    problem: '手里有报价单但不知道有没有坑？还没定方案不知道怎么开始？',
    what: '居住诊断、报价初筛、风险词典、检查清单——从工地经验变成的公开工具。自己先用，拿不准再来找我。',
    result: '直接使用：诊断 → 初筛 → 词典 → 清单',
    href: '/tools',
    cta: '用装修工具',
  },
]

/* ── 一人公司诊断的问题 ── */
const questions = [
  '你有一个明确的产品或服务吗？',
  '有人为你的产品付过钱吗？（哪怕一块钱）',
  '你知道你的客户是谁、在哪能找到他们吗？',
  '你现在的主要收入来源是什么？',
  '你每周花在产品/获客/交付上的时间比例是多少？',
  '你最想解决的一个问题是什么？',
  '你现在是一个人做，还是有团队？',
  '你过去三个月，最大的一个变化是什么？',
]

export default function AiToolsPage() {
  return (
    <>
      <StructuredData
        data={[{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'AI 工具',
          url: 'https://zenoaihome.com/ai-tools',
          description: '免费 AI 工具：一人公司诊断、内容策略生成、装修判断工具。',
          inLanguage: 'zh-CN',
        }]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(222,210,190,0.18),transparent_45%)]" aria-hidden />
        <Container size="content" className="relative py-16 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold text-white/55">AI 工具</p>
          <h1 className="editorial-display mt-5 max-w-[12ch] text-[2.8rem] leading-[1.05] text-white sm:text-[4.2rem] lg:text-[5.2rem]">
            不花钱。先自己试试。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            三个免费工具——帮你搞清楚自己卡在哪、写什么、怎么判断。不是替你做事——是给你一个方向。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href="#opc" label="先做一人公司诊断 →" variant="primary" />
            <p className="self-center text-sm text-white/50">全免费 · 不用注册</p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-16 sm:py-20">
        {/* ── 三个工具 ── */}
        <div className="space-y-12">
          {tools.map((tool) => (
            <section key={tool.id} id={tool.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-xs font-semibold text-stone uppercase tracking-wider">{tool.tag}</span>
              </div>
              <h2 className="text-[2rem] font-semibold leading-tight text-ink sm:text-[2.5rem]">{tool.title}</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  <div className="border-l-2 border-stone/40 pl-4">
                    <p className="text-xs font-semibold text-stone uppercase tracking-wider">这个问题你熟悉吗</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{tool.problem}</p>
                  </div>
                  <div className="border-l-2 border-stone/40 pl-4">
                    <p className="text-xs font-semibold text-stone uppercase tracking-wider">这个工具做什么</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{tool.what}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">你会得到</p>
                    <p className="text-sm text-ink">{tool.result}</p>
                  </div>
                  <CTA href={tool.href} label={`${tool.cta} →`} variant="primary" />
                </div>

                {/* 一人公司诊断预览：展示问题样例 */}
                {tool.id === 'opc' && (
                  <div className="border border-border bg-surface-warm p-6">
                    <p className="text-xs font-semibold text-stone mb-4">你会被问到的 8 个问题</p>
                    <div className="space-y-2">
                      {questions.map((q, i) => (
                        <div key={i} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
                          <span className="text-xs font-semibold text-ink-faint shrink-0">{i + 1}.</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 内容策略预览：示例输出 */}
                {tool.id === 'content' && (
                  <div className="border border-border bg-surface-warm p-6">
                    <p className="text-xs font-semibold text-stone mb-4">生成结果示例（输入：传统装修 + AI 实践）</p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">方向 1：传统行业人怎么用 AI</p>
                        <p className="text-xs text-ink-muted mt-1">选题：装修公司上 AI 搞错了顺序 / 一个工地佬的 AI 工具清单</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">方向 2：一人公司的坑和解法</p>
                        <p className="text-xs text-ink-muted mt-1">选题：一个人做交付，最容易崩在哪一环 / 我为什么不做定制开发</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">方向 3：从打工到自己干</p>
                        <p className="text-xs text-ink-muted mt-1">选题：什么时候该从公司出来 / 第一个客户是怎么来的</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 装修工具预览：工具列表 */}
                {tool.id === 'renovation' && (
                  <div className="border border-border bg-surface-warm p-6">
                    <p className="text-xs font-semibold text-stone mb-4">可用工具</p>
                    <div className="space-y-3">
                      {[
                        { name: 'AI 居住诊断', desc: '理清生活方式和空间优先级' },
                        { name: '报价初筛', desc: '2 分钟扫一眼报价有没有明显雷' },
                        { name: '风险词典', desc: '把模糊词拆成人话' },
                        { name: '检查清单', desc: '拿到材料逐项对照' },
                      ].map((t) => (
                        <div key={t.name} className="flex gap-2">
                          <span className="text-xs text-stone shrink-0">·</span>
                          <div>
                            <p className="text-sm font-semibold text-ink">{t.name}</p>
                            <p className="text-xs text-ink-muted">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* ── 底部：接不住 → 找人帮 ── */}
        <section className="mt-20 border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">
            工具用完了，还是拿不准？
          </h2>
          <p className="text-sm text-ink-muted mb-5 max-w-lg mx-auto">
            一人公司诊断告诉你卡在哪，但不知道怎么破——来星火者，和正在做同样事的人聊聊。
            内容策略给你选题，但写不出来——来星火者，看看别人怎么写。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTA href="/community" label="了解星火者 →" variant="primary" />
            <CTA href="/contact" label="直接联系我 →" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}

