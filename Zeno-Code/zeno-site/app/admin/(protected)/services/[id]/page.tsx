/**
 * app/admin/(protected)/services/[id]/page.tsx
 * 服务申请详情 — AI 分类 + 模板匹配 + 确认发出
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { classify, suggestArticles } from '@/lib/classifier'
import { matchTemplate, getTemplatesByCategory } from '@/lib/template-matcher'
import { ActionPanel } from './actions'
import ReviewPanel from '@/components/admin/ReviewPanel'
import { REVIEW_PANEL } from '@/lib/review-panel'

export const metadata: Metadata = { title: '服务详情 · Admin' }
export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  submitted: '待处理', reviewing: '处理中', completed: '已完成', rejected: '已拒绝',
}

const CATEGORY_COLORS: Record<string, string> = {
  quote_review: 'bg-[#C4A882]/15 text-[#C4A882]',
  contract_review: 'bg-[#68aeb0]/15 text-[#68aeb0]',
  living_diagnosis: 'bg-green-400/15 text-green-400',
  budget: 'bg-yellow-400/15 text-yellow-400',
  general: 'bg-[#706860]/15 text-[#706860]',
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await prisma.serviceRequest.findUnique({ where: { id } })
  if (!request) notFound()

  // 执行分类
  const classification = classify(request.serviceType, request.message ?? '')

  // 匹配模板
  const { filledContent, template } = matchTemplate(
    request.aiCategory ?? classification.category,
    {
      name: request.name ?? undefined,
      phone: request.phone ?? undefined,
      wechat: request.wechat ?? undefined,
      message: request.message ?? undefined,
      serviceType: request.serviceType,
    }
  )

  // 备选模板
  const alternatives = getTemplatesByCategory(request.aiCategory ?? classification.category)

  // 相关文章
  const articleIds = suggestArticles(request.aiCategory ?? classification.category)

  return (
    <div className="max-w-[1400px] space-y-5">
      {/* 标题 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">
            Service Request · {id.slice(0, 8)}
          </p>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">
            服务申请详情
          </h1>
        </div>
        <span className={`text-xs px-3 py-1 rounded-sm font-semibold ${
          request.status === 'submitted' ? 'bg-[#d2846f]/15 text-[#d2846f]' :
          request.status === 'completed' ? 'bg-green-400/15 text-green-400' :
          'bg-[#706860]/15 text-[#706860]'
        }`}>
          {STATUS_LABEL[request.status] ?? request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── 左栏：业主信息 ──────────────────── */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">业主信息</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="姓名" value={request.name ?? '—'} />
            <InfoRow label="电话" value={request.phone ?? '—'} />
            <InfoRow label="微信" value={request.wechat ?? '—'} />
            <InfoRow label="邮箱" value={request.email ?? '—'} />
            <InfoRow label="服务类型" value={request.serviceType} />
            <InfoRow label="提交时间" value={new Date(request.createdAt).toLocaleString('zh-CN')} />
          </div>

          {request.message && (
            <div className="mt-4 pt-4 border-t border-[#3A3530]">
              <p className="text-xs text-[#706860] mb-2">业主留言</p>
              <p className="text-sm text-[#A09890] whitespace-pre-wrap leading-relaxed">
                {request.message}
              </p>
            </div>
          )}
        </div>

        {/* ── 右栏：AI 分析 ──────────────────── */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">AI 分类</h2>

          {/* 分类结果 */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2 py-1 rounded-sm font-semibold ${CATEGORY_COLORS[classification.category] ?? CATEGORY_COLORS.general}`}>
              {classification.categoryLabel}
            </span>
            <span className="text-xs text-[#706860]">
              置信度 {Math.round(classification.confidence * 100)}% · {classification.source === 'serviceType' ? '用户选择' : classification.source === 'keywords' ? '关键词匹配' : '兜底'}
            </span>
          </div>

          {classification.matchedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {classification.matchedKeywords.map((kw) => (
                <span key={kw} className="text-[0.6rem] text-[#504840] bg-[#252320] px-1.5 py-0.5 rounded">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* 匹配模板 */}
          {template && (
            <div className="mt-4 pt-4 border-t border-[#3A3530]">
              <p className="text-xs text-[#706860] mb-2">
                匹配模板：<span className="text-[#C4A882]">{template.title}</span>
                <span className="text-[#504840] ml-2">({template.scenario})</span>
              </p>
            </div>
          )}

          {/* 备选模板 */}
          {alternatives.length > 1 && (
            <div className="mt-3">
              <p className="text-xs text-[#706860] mb-1.5">备选模板：</p>
              <div className="space-y-1">
                {alternatives.filter((a) => a.id !== template?.id).map((a) => (
                  <p key={a.id} className="text-[0.65rem] text-[#504840]">
                    {a.title} · {a.scenario}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 相关文章 */}
          <div className="mt-4 pt-4 border-t border-[#3A3530]">
            <p className="text-xs text-[#706860] mb-1.5">相关文章素材：</p>
            <div className="flex flex-wrap gap-1.5">
              {articleIds.map((aid) => (
                <span key={aid} className="text-[0.6rem] text-[#68aeb0] bg-[#68aeb0]/10 px-1.5 py-0.5 rounded">
                  #{aid}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 八人评审团 ──────────────────────── */}
      <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
        <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">
          八人评审团 · 逐一审视
        </h2>
        <ReviewPanel reviewers={REVIEW_PANEL} />
      </div>

      {/* ── 回复编辑区 ──────────────────────── */}
      <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
        <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">回复编辑</h2>
        <ActionPanel
          requestId={id}
          initialText={request.responseText ?? filledContent}
          isCompleted={request.status === 'completed'}
        />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-[#2A2825] last:border-0">
      <span className="text-xs text-[#706860]">{label}</span>
      <span className="text-xs text-[#E8E2DA] text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
}
