import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { updateLivingDiagnosisStatus } from '@/lib/actions/admin'
import { livingDiagnosisQuestions } from '@/data/diagnosis/living-diagnosis'
import type { LivingDiagnosisResult } from '@/lib/living-diagnosis'

export const metadata: Metadata = { title: '居住诊断详情 · Admin' }

const STATUS_LABEL: Record<string, string> = {
  submitted:    '已提交',
  reviewing:    '审核中',
  report_draft: '报告草稿',
  completed:    '已完成',
  archived:     '已归档',
}

const RISK_LABEL: Record<string, string> = {
  low:    '低优先级',
  medium: '中优先级',
  high:   '高优先级',
}

type AnswerRecord = {
  questionId: string
  value: string
}

function parseResult(value: unknown): Partial<LivingDiagnosisResult> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Partial<LivingDiagnosisResult>
}

function parseAnswers(value: unknown): AnswerRecord[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null
      const record = item as Record<string, unknown>
      if (typeof record.questionId !== 'string' || typeof record.value !== 'string') return null
      return { questionId: record.questionId, value: record.value }
    })
    .filter((item): item is AnswerRecord => Boolean(item))
}

function getAnswerLabel(answer: AnswerRecord) {
  const question = livingDiagnosisQuestions.find((item) => item.id === answer.questionId)
  const option = question?.options.find((item) => item.value === answer.value)
  return {
    title: question?.title ?? answer.questionId,
    helper: question?.helper ?? '',
    value: option?.label ?? answer.value,
  }
}

export default async function LivingDiagnosisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const diagnosis = await prisma.livingDiagnosis.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      report: true,
    },
  })

  if (!diagnosis) notFound()

  const result = parseResult(diagnosis.result)
  const answers = parseAnswers(diagnosis.answers)
  const priorities = Array.isArray(result.priorities) ? result.priorities : []
  const nextSteps = Array.isArray(result.nextSteps) ? result.nextSteps : []

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/living-diagnoses" className="text-xs text-[#706860] hover:text-[#A09890]">
            ← 返回居住诊断
          </Link>
          <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">Living Diagnosis</p>
          <h1 className="mt-1 text-xl font-semibold text-[#E8E2DA]">{result.primaryType ?? '居住诊断详情'}</h1>
          <p className="mt-2 text-xs text-[#706860]">
            {diagnosis.createdAt.toLocaleString('zh-CN')} · {diagnosis.user?.email ?? '未登录用户'}
          </p>
        </div>

        <form action={async (formData: FormData) => {
          'use server'
          const status = formData.get('status') as string
          await updateLivingDiagnosisStatus(diagnosis.id, status)
        }} className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={diagnosis.status}
            className="border border-[#3A3530] bg-[#1C1A17] px-3 py-2 text-xs text-[#A09890]"
          >
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button type="submit" className="border border-[#C4A882]/30 bg-[#C4A882]/15 px-4 py-2 text-xs font-semibold text-[#C4A882]">
            更新状态
          </button>
        </form>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.36fr_0.64fr]">
        <aside className="space-y-5">
          <section className="border border-[#3A3530] bg-[#252320] p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">基础信息</p>
            <div className="mt-4 grid gap-px bg-[#3A3530]">
              {[
                ['状态', STATUS_LABEL[diagnosis.status] ?? diagnosis.status],
                ['城市', diagnosis.city || '—'],
                ['房屋类型', diagnosis.homeType || '—'],
                ['面积', diagnosis.area || '—'],
                ['预算', diagnosis.budgetRange || '—'],
                ['阶段', diagnosis.stage || '—'],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[5rem_1fr] bg-[#1C1A17]">
                  <span className="border-r border-[#3A3530] px-3 py-2 text-xs text-[#706860]">{label}</span>
                  <span className="px-3 py-2 text-xs text-[#E8E2DA]">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#3A3530] bg-[#252320] p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">联系方式</p>
            <div className="mt-4 space-y-2 text-xs">
              <p><span className="text-[#706860]">称呼：</span><span className="text-[#E8E2DA]">{diagnosis.contactName || '—'}</span></p>
              <p><span className="text-[#706860]">微信：</span><span className="text-[#E8E2DA]">{diagnosis.contactWechat || '—'}</span></p>
              <p><span className="text-[#706860]">邮箱：</span><span className="text-[#E8E2DA]">{diagnosis.contactEmail || '—'}</span></p>
              <p><span className="text-[#706860]">登录账号：</span><span className="text-[#E8E2DA]">{diagnosis.user?.email ?? '未登录'}</span></p>
            </div>
          </section>

          <section className="border border-[#3A3530] bg-[#252320] p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">快速入口</p>
            <div className="mt-4 grid gap-2">
              <Link href="/admin/services" className="border border-[#3A3530] px-3 py-2 text-xs text-[#A09890] hover:border-[#C4A882]/50 hover:text-[#C4A882]">
                查看服务申请
              </Link>
              <Link href="/tools/quote-check" className="border border-[#3A3530] px-3 py-2 text-xs text-[#A09890] hover:border-[#C4A882]/50 hover:text-[#C4A882]">
                前台报价风险初筛
              </Link>
              <Link href="/services" className="border border-[#3A3530] px-3 py-2 text-xs text-[#A09890] hover:border-[#C4A882]/50 hover:text-[#C4A882]">
                前台服务页
              </Link>
            </div>
          </section>
        </aside>

        <div className="space-y-5">
          <section className="border border-[#3A3530] bg-[#252320] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">系统判断</p>
                <h2 className="mt-2 text-lg font-semibold text-[#E8E2DA]">{result.primaryType ?? '暂无结果'}</h2>
              </div>
              <span className="w-fit border border-[#C4A882]/30 bg-[#C4A882]/10 px-3 py-1 text-xs font-semibold text-[#C4A882]">
                {RISK_LABEL[result.riskLevel ?? ''] ?? result.riskLevel ?? '未分级'} · {result.totalScore ?? '—'} 分
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#A09890]">
              {result.summary ?? '这条诊断暂时没有生成摘要。'}
            </p>
            {priorities.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {priorities.map((item) => (
                  <span key={item} className="border border-[#3A3530] bg-[#1C1A17] px-3 py-1.5 text-xs font-semibold text-[#C4A882]">
                    {item}
                  </span>
                ))}
              </div>
            )}
            {nextSteps.length > 0 && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {nextSteps.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className="border border-[#3A3530] bg-[#1C1A17] px-3 py-3 text-xs text-[#A09890] hover:border-[#C4A882]/50 hover:text-[#C4A882]"
                  >
                    {item.label} →
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="border border-[#3A3530] bg-[#252320] p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">用户回答</p>
            <div className="mt-4 grid gap-3">
              {answers.map((answer) => {
                const item = getAnswerLabel(answer)
                return (
                  <div key={answer.questionId} className="border border-[#3A3530] bg-[#1C1A17] p-4">
                    <p className="text-sm font-semibold text-[#E8E2DA]">{item.title}</p>
                    {item.helper && <p className="mt-1 text-xs leading-6 text-[#706860]">{item.helper}</p>}
                    <p className="mt-3 border-l-2 border-[#C4A882]/40 pl-3 text-sm leading-7 text-[#C4A882]">{item.value}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="border border-[#3A3530] bg-[#252320] p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">原始 Answers JSON</p>
              <pre className="mt-4 max-h-96 overflow-auto border border-[#3A3530] bg-[#1C1A17] p-4 text-xs leading-6 text-[#A09890]">
                {JSON.stringify(diagnosis.answers, null, 2)}
              </pre>
            </div>
            <div className="border border-[#3A3530] bg-[#252320] p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">Result JSON</p>
              <pre className="mt-4 max-h-96 overflow-auto border border-[#3A3530] bg-[#1C1A17] p-4 text-xs leading-6 text-[#A09890]">
                {JSON.stringify(diagnosis.result, null, 2)}
              </pre>
            </div>
          </section>

          {diagnosis.report && (
            <section className="border border-[#3A3530] bg-[#252320] p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">报告草稿</p>
              <h2 className="mt-2 text-lg font-semibold text-[#E8E2DA]">{diagnosis.report.title}</h2>
              <p className="mt-2 text-xs text-[#706860]">{diagnosis.report.status}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
