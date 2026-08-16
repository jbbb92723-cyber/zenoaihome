'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Link from 'next/link'

// ---- 方法论模板数据 ----

interface PlanStep {
  title: string
  completionCriteria: string
  estimateMinutes: number
}

interface MethodologyTemplate {
  id: string
  icon: string
  name: string
  description: string
  useCase: string
  totalMinutes: number
  steps: PlanStep[]
}

const templates: MethodologyTemplate[] = [
  {
    id: 'renovation-quote-review',
    icon: '🏗️',
    name: '装修报价核对七步样本',
    description: '把装修报价核对拆成七个待执行步骤：材料规格、工艺说明、面积数量、漏项、价格依据、付款节点和责任边界。这里展示任务结构，不会自动审核报价单。',
    useCase: '适合正在对比报价单的业主，或者帮客户审核报价的独立设计师。',
    totalMinutes: 22,
    steps: [
      { title: '收集报价信息', completionCriteria: '获取完整的报价单文件或图片，确认报价日期和施工地址', estimateMinutes: 2 },
      { title: '材料品牌与规格核对', completionCriteria: '逐项列出报价中标注的材料品牌、系列、规格——未标注的标记为"待确认"', estimateMinutes: 4 },
      { title: '工艺标准比对', completionCriteria: '对比国标和行业惯例，标记工艺描述不完整或低于标准的项目', estimateMinutes: 3 },
      { title: '面积与数量复核', completionCriteria: '用 CAD 或户型图交叉验证报价中的面积数据，偏差 >5% 的标红', estimateMinutes: 5 },
      { title: '漏项检测', completionCriteria: '对照标准施工工序清单，标记报价中缺失的必要项目', estimateMinutes: 3 },
      { title: '单价与付款节点分析', completionCriteria: '对比当地市场参考价，标记溢价 >15% 的项目；评估付款比例是否合理', estimateMinutes: 3 },
      { title: '生成审核报告', completionCriteria: '输出一份结构化审核报告：红/黄/绿三级风险标注 + 谈判建议 + 签约注意事项', estimateMinutes: 2 },
    ],
  },
  {
    id: 'content-strategy-ai',
    icon: '✍️',
    name: '一人公司内容策略工作流',
    description: '把内容选题、结构、发布节奏和复盘指标拆成一组可执行任务，适合作为人与 AI 继续协作的起点。',
    useCase: '适合独立咨询师、设计师、开发者等一人公司，需要持续输出内容但不知道从哪里开始。',
    totalMinutes: 35,
    steps: [
      { title: '个人能力盘点', completionCriteria: '列出你的三项核心能力和五项专业经验，按"市场需要"和"你擅长"两个维度交叉打分', estimateMinutes: 5 },
      { title: '目标客户画像', completionCriteria: '明确 1-2 个目标客户画像：他们最常问你的三个问题是什么？最头疼的三个问题是什么？', estimateMinutes: 5 },
      { title: '选题矩阵构建', completionCriteria: '生成一个 3×3 选题矩阵（能力×痛点），填出 9 个具体的文章/视频选题', estimateMinutes: 8 },
      { title: '内容结构模板化', completionCriteria: '为每个选题设计标准结构（问题→分析→方案→行动清单），确保每篇内容都有可执行结论', estimateMinutes: 5 },
      { title: '发布节奏规划', completionCriteria: '制定 4 周发布计划：每周 1-2 篇，主题轮换，首尾呼应，并标注每篇的引流和转化目标', estimateMinutes: 7 },
      { title: '效果衡量标准', completionCriteria: '确定 3 个核心指标（如咨询量、订阅量、转发量），设置 30 天后的复盘节点', estimateMinutes: 5 },
    ],
  },
  {
    id: 'opc-business-diagnosis',
    icon: '🧭',
    name: '一人公司经营诊断框架',
    description: '从产品、获客、定价、交付、现金流五个维度，系统性地诊断一人公司的经营状态。不是给答案——是帮你问对问题。',
    useCase: '适合年收入在 10-100 万之间的一人公司经营者，感觉"忙但不确定方向对不对"。',
    totalMinutes: 25,
    steps: [
      { title: '产品线梳理', completionCriteria: '列出所有在售产品/服务，标注每个的利润率、交付时长、复购率，识别"吃时间但利润低"的产品', estimateMinutes: 5 },
      { title: '客户来源分析', completionCriteria: '统计过去三个月的客户来源渠道和转化率，找出最高 ROI 的渠道和最大的客户流失点', estimateMinutes: 5 },
      { title: '定价结构诊断', completionCriteria: '对比你的定价与交付成本（含隐性时间成本），计算每个产品的真实时薪', estimateMinutes: 4 },
      { title: '交付流程标准化评估', completionCriteria: '画出当前交付流程的每个环节，标记哪些可以标准化、哪些依赖你本人', estimateMinutes: 5 },
      { title: '现金流压力测试', completionCriteria: '模拟"三个月零收入"和"最大客户流失"两种场景下的现金流状况', estimateMinutes: 3 },
      { title: '优先级排序', completionCriteria: '根据诊断结果，排出接下来 30 天的三项优先行动和一项要停止的事', estimateMinutes: 3 },
    ],
  },
  {
    id: 'ai-agent-design',
    icon: '🤖',
    name: 'AI Agent 设计蓝图样本',
    description: '把“我想用 AI 做什么”拆成输入输出、步骤流程、权限边界和验收标准，形成一份仍需用真实样本测试的设计草案。',
    useCase: '适合想做 AI Agent 但不知道从哪里开始的传统行业老板或团队负责人。',
    totalMinutes: 40,
    steps: [
      { title: '业务场景定义', completionCriteria: '用一段话描述"AI 要帮你做什么"——输入是什么、输出是什么、在什么情况下算成功', estimateMinutes: 5 },
      { title: '工作流拆解', completionCriteria: '把人的工作流程拆成 3-8 个独立步骤，每步有明确的输入、处理和输出', estimateMinutes: 8 },
      { title: '知识注入设计', completionCriteria: '列出 AI 需要的领域知识清单：模板、规范、案例库、术语表、常见问题及标准答案', estimateMinutes: 7 },
      { title: '权限边界设定', completionCriteria: '明确 AI 的"可以做"和"必须确认"清单：哪些操作自动执行、哪些需要人工审批', estimateMinutes: 5 },
      { title: '验收标准制定', completionCriteria: '为每一步定义可量化的验收标准：正确率、耗时、用户满意度等指标的目标值', estimateMinutes: 5 },
      { title: '迭代计划', completionCriteria: '制定"先跑通再优化"的三阶段计划：MVP 版（只做最核心的）、增强版（加入高频场景）、完整版（覆盖长尾）', estimateMinutes: 10 },
    ],
  },
]

// ---- 组件 ----

function StepRow({ step, index, isLast }: { step: PlanStep; index: number; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      {/* 时间线 */}
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-lime/15 border border-lime/30 flex items-center justify-center text-xs font-semibold text-lime flex-shrink-0">
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/40 my-1" />}
      </div>

      {/* 内容 */}
      <div className="pb-6 flex-1">
        <h4 className="text-[15px] font-semibold text-ink mb-1">{step.title}</h4>
        <p className="text-sm text-ink-muted mb-1.5 leading-relaxed">{step.completionCriteria}</p>
        <span className="text-xs text-ink-muted/70">预计 {step.estimateMinutes} 分钟</span>
      </div>
    </div>
  )
}

export default function TaskPlannerPage() {
  const [selectedId, setSelectedId] = useState<string>(templates[0].id)
  const [stepStatus, setStepStatus] = useState<Record<string, 'pending' | 'done'>>({})
  const [showExport, setShowExport] = useState(false)

  const template = templates.find((t) => t.id === selectedId) ?? templates[0]
  const completedCount = template.steps.filter((_, i) => stepStatus[`${template.id}-${i}`] === 'done').length
  const progressPercent = Math.round((completedCount / template.steps.length) * 100)

  const toggleStep = (stepIndex: number) => {
    const key = `${template.id}-${stepIndex}`
    setStepStatus((prev) => ({
      ...prev,
      [key]: prev[key] === 'done' ? 'pending' : 'done',
    }))
  }

  const exportJSON = () => {
    const data = {
      title: template.name,
      steps: template.steps.map((s) => ({
        title: s.title,
        completionCriteria: s.completionCriteria,
        estimateSeconds: s.estimateMinutes * 60,
      })),
      exportedAt: new Date().toISOString(),
      source: 'ZenoAI Workflow Planner',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.id}-task-plan.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExport(true)
    setTimeout(() => setShowExport(false), 3000)
  }

  return (
    <Container size="content" className="py-12 sm:py-16">
      <Link href="/ai-tools" className="text-xs font-semibold text-stone hover:text-ink mb-8 inline-block">
        ← 回到 AI 工具
      </Link>

      {/* 页头 */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
          工作流任务拆解器
        </h1>
        <p className="text-ink-muted leading-relaxed max-w-2xl">
          选择一个预设方法模板，查看专业工作可以怎样拆成可执行、可检查的步骤。
          当前版本不调用模型，也不会替你完成任务；时间只是模板预估，需要按真实情况调整。
        </p>
      </div>

      {/* 模板选择 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedId(t.id)
              setStepStatus({})
              setShowExport(false)
            }}
            className={`text-left p-4 rounded-xl border transition-colors ${
              selectedId === t.id
                ? 'border-lime/60 bg-lime/[0.04]'
                : 'border-border/40 hover:border-border/70 bg-white'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-lg">{t.icon}</span>
              <span className="text-[15px] font-semibold text-ink">{t.name}</span>
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-2">{t.description}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-muted/70">
              <span>{t.steps.length} 个步骤</span>
              <span>约 {t.totalMinutes} 分钟</span>
            </div>
          </button>
        ))}
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-ink">执行进度</span>
          <span className="text-sm text-ink-muted">
            {completedCount}/{template.steps.length} 步 · {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-lime rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 步骤列表 */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-ink-muted mb-5 uppercase tracking-wide">
          {template.name} · 执行步骤
        </h3>
        <div className="bg-white border border-border/50 rounded-xl p-5 sm:p-6">
          {template.steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              {/* 勾选框 */}
              <div className="flex flex-col items-center pt-0.5">
                <button
                  onClick={() => toggleStep(index)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    stepStatus[`${template.id}-${index}`] === 'done'
                      ? 'bg-lime border-lime text-white'
                      : 'border-border/50 hover:border-lime/50 bg-white'
                  }`}
                >
                  {stepStatus[`${template.id}-${index}`] === 'done' && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                {index < template.steps.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 ${
                    stepStatus[`${template.id}-${index}`] === 'done' ? 'bg-lime/40' : 'bg-border/30'
                  }`} />
                )}
              </div>

              {/* 步骤内容 */}
              <div className={`pb-5 flex-1 ${index === template.steps.length - 1 ? '!pb-0' : ''}`}>
                <h4 className={`text-[15px] font-semibold mb-1 ${
                  stepStatus[`${template.id}-${index}`] === 'done' ? 'text-ink-muted line-through' : 'text-ink'
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-ink-muted mb-1.5 leading-relaxed">{step.completionCriteria}</p>
                <span className="text-xs text-ink-muted/60">预计 {step.estimateMinutes} 分钟</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-muted/60 mb-6">
        {template.useCase}
      </p>

      {/* 操作区 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <button
          onClick={exportJSON}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-lime text-ink font-semibold text-sm rounded-lg hover:brightness-95 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出为 JSON 任务文件
        </button>

        {showExport && (
          <span className="text-sm text-lime inline-flex items-center gap-1.5 self-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            已导出任务文件
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="bg-soft border border-border/30 rounded-xl p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold text-ink mb-2">
          想把自己的方法整理成可测试的工作流？
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed max-w-lg mx-auto mb-5">
          项目会从真实任务、输入样本和合格输出开始，把隐性经验整理成结构化工作流，
          再通过人工复核和样本测试判断哪些步骤适合交给 AI。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/services"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-ink text-white font-semibold text-sm rounded-lg hover:bg-ink/90 transition-colors"
          >
            了解 AI Agent 定制服务
          </a>
          <a
            href="/training"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-border font-semibold text-sm rounded-lg hover:bg-white transition-colors text-ink"
          >
            查看 AI 培训课程
          </a>
        </div>
      </div>
    </Container>
  )
}
