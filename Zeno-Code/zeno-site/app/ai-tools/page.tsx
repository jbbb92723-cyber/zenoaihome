import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '实用工具｜一人公司、内容、工作流与装修',
  description:
    '四个免费公开原型：工作流任务拆解、一人公司阶段自检、内容选题匹配和装修判断工具。它们用于整理问题与形成初筛，不代替最终判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/ai-tools',
  },
}

const tools = [
  {
    id: 'opc',
    icon: '🧭',
    title: '一人公司阶段自检',
    tag: '规则自检 · 免费',
    problem: '不知道现在该优先做什么——产品、获客、还是交付？',
    what: '10 个问题，帮助你回看产品、客户、收入和交付状态。结果由预设规则生成，只作为复盘起点。',
    result: '你会得到：一个阶段提示 + 当前需要继续核对的问题 + 可尝试的下一步',
    href: '/ai-tools/opc-diagnosis',
    cta: '开始自检',
  },
  {
    id: 'content',
    icon: '✍️',
    title: '内容选题匹配',
    tag: '规则匹配 · 免费',
    problem: '想做内容但不知道写什么？感觉自己没什么值得讲的？',
    what: '输入你的行业和擅长的事，工具会从预设题库中匹配 3 个内容方向和选题。它不调用大模型，也不替你编造经历。',
    result: '你会得到：3 个方向 × 每个方向 3 个待校正的选题起点',
    href: '/ai-tools/content-strategy',
    cta: '匹配选题',
  },
  {
    id: 'task-planner',
    icon: '🤖',
    title: '工作流任务拆解器',
    tag: '模板演示 · 免费',
    problem: '想把一项专业工作拆成可执行、可检查、可交接的步骤？',
    what: '选择四套预设方法模板，查看每一步的完成标准和时间估算。这里展示的是任务结构，不会自动审核文件，也不是正在运行的 AI Agent。',
    result: '你会看到：结构化任务样本 + 进度追踪 + 可导出的 JSON 任务文件',
    href: '/ai-tools/task-planner',
    cta: '打开规划器',
  },
  {
    id: 'renovation',
    icon: '🏠',
    title: '装修判断工具',
    tag: '长期实践整理 · 免费',
    problem: '手里有报价单但不知道有没有坑？还没定方案不知道怎么开始？',
    what: '居住需求自检、报价初筛、风险词典、检查清单，来自长期家居与装修实践中反复遇到的问题。工具先帮你整理和初筛，不能替代对原始材料的人工核对。',
    result: '直接使用：自检 → 初筛 → 词典 → 清单',
    href: '/tools',
    cta: '用装修工具',
  },
]

/* ── 一人公司自检的问题 ── */
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
          name: '实用工具与方法原型',
          url: 'https://zenoaihome.com/ai-tools',
          description: '免费公开原型：工作流任务拆解、一人公司阶段自检、内容选题匹配和装修判断工具。',
          inLanguage: 'zh-CN',
        }]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink">
        <Container size="content" className="relative py-16 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold text-white/55">实用工具</p>
          <h1 className="editorial-display mt-5 max-w-[12ch] text-[2.4rem] leading-[1.1] text-white sm:text-[3.2rem]">
            先自己看清问题。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            四个免费原型，帮助你整理问题、形成初筛、看见下一步。它们不是最终答案，结果仍要回到真实材料和行动中验证。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href="#opc" label="先做一人公司自检 →" variant="primary" />
            <p className="self-center text-sm text-white/50">全免费 · 不用注册</p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-16 sm:py-20">
        {/* ── 四个工具 ── */}
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

                {/* 一人公司自检预览：展示问题样例 */}
                {tool.id === 'opc' && (
                  <div className="border border-border bg-surface-warm p-6">
                    <p className="text-xs font-semibold text-stone mb-4">部分自检问题</p>
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
                        <p className="text-xs text-ink-muted mt-1">选题：传统装修团队引入 AI，第一步该解决什么 / 怎样把报价说明整理得更容易核对</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">方向 2：一人公司的坑和解法</p>
                        <p className="text-xs text-ink-muted mt-1">选题：一个人做交付，最容易失控的是哪一环 / 什么情况下应该拒绝定制需求</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">方向 3：从打工到自己干</p>
                        <p className="text-xs text-ink-muted mt-1">选题：离开公司前要验证哪些条件 / 怎样验证第一个付费需求</p>
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
                        { name: '居住需求自检', desc: '用预设问题整理生活方式和空间优先级' },
                        { name: '报价初筛', desc: '按规则标记没有写清的报价边界' },
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
          <p className="text-sm text-ink-muted mb-1 max-w-lg mx-auto">
            一人公司自检只提供阶段提示，不能替代对产品、客户和现金流的实际核对。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-lg mx-auto">
            内容选题只提供起点，最终内容必须回到你的经历、证据和真实反馈。
          </p>
          <p className="text-base font-semibold text-ink mb-5">
            需要结合具体材料、明确范围并承担交付责任时，再进入人工合作。
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
