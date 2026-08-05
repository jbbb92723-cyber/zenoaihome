import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  createProposalAction,
  setProposalStatusAction,
  signAgreementAction,
  updateOpportunityAction,
} from '@/lib/actions/opportunities'
import {
  OPPORTUNITY_PRIORITIES,
  OPPORTUNITY_STAGES,
  PRIORITY_LABELS,
  PROPOSAL_STATUS_LABELS,
  STAGE_LABELS,
  type OpportunityPriority,
  type OpportunityStage,
  type ProposalStatus,
} from '@/lib/domains/opportunities/constants'

export const metadata: Metadata = { title: '商机详情 · Admin' }
export const dynamic = 'force-dynamic'

const INPUT = 'mt-2 w-full border border-[#3A3530] bg-[#252320] px-3 py-2.5 text-sm text-[#E8E2DA] outline-none focus:border-[#C4A882]'
const LABEL = 'text-xs font-semibold text-[#A09890]'

function formatMoney(value: number | null) {
  return value === null ? '待定' : `¥${(value / 100).toLocaleString('zh-CN')}`
}
function jsonStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      serviceRequest: { select: { id: true, status: true, createdAt: true } },
      proposals: { orderBy: { version: 'desc' } },
      agreement: true,
      project: { select: { id: true, name: true, status: true } },
      activities: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  })
  if (!opportunity) notFound()

  const updateAction = updateOpportunityAction.bind(null, opportunity.id)
  const proposalAction = createProposalAction.bind(null, opportunity.id)
  const signAction = signAgreementAction.bind(null, opportunity.id)

  return (
    <div className="max-w-[1500px] space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/opportunities" className="text-xs text-[#706860] hover:text-[#C4A882]">← 商机工作台</Link>
          <h1 className="mt-3 text-xl font-semibold text-[#E8E2DA]">{opportunity.title}</h1>
          <p className="mt-1 text-xs text-[#706860]">{opportunity.serviceType} · {opportunity.source || '来源未记录'}</p>
        </div>
        <span className="border border-[#C4A882]/30 bg-[#C4A882]/10 px-3 py-1.5 text-xs font-semibold text-[#C4A882]">
          {STAGE_LABELS[opportunity.stage as OpportunityStage] ?? opportunity.stage}
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
        <div className="space-y-5">
          <form action={updateAction} className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#E8E2DA]">判断与跟进</h2>
              <button type="submit" className="bg-[#C4A882] px-4 py-2 text-xs font-semibold text-[#1C1A17] hover:bg-[#d2bb98]">保存</button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={LABEL}>阶段
                <select name="stage" defaultValue={opportunity.stage} className={INPUT}>
                  {OPPORTUNITY_STAGES.map((stage) => <option key={stage} value={stage}>{STAGE_LABELS[stage]}</option>)}
                </select>
              </label>
              <label className={LABEL}>优先级
                <select name="priority" defaultValue={opportunity.priority} className={INPUT}>
                  {OPPORTUNITY_PRIORITIES.map((priority) => <option key={priority} value={priority}>{PRIORITY_LABELS[priority]}</option>)}
                </select>
              </label>
              <label className={LABEL}>预计金额（元）
                <input name="expectedAmountYuan" type="number" min="0" step="1" defaultValue={opportunity.expectedAmount === null ? '' : opportunity.expectedAmount / 100} className={INPUT} />
              </label>
              <label className={LABEL}>下一次跟进日期
                <input name="nextActionAt" type="date" defaultValue={opportunity.nextActionAt?.toISOString().slice(0, 10) ?? ''} className={INPUT} />
              </label>
              <label className={`${LABEL} sm:col-span-2`}>下一动作
                <input name="nextAction" defaultValue={opportunity.nextAction ?? ''} className={INPUT} />
              </label>
              <label className={`${LABEL} sm:col-span-2`}>需求与边界
                <textarea name="needSummary" rows={8} defaultValue={opportunity.needSummary ?? ''} className={INPUT} />
              </label>
            </div>
          </form>

          <section className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">方案版本</h2>
            <div className="mt-4 space-y-3">
              {opportunity.proposals.map((proposal) => {
                const statusAction = setProposalStatusAction.bind(null, opportunity.id, proposal.id)
                const deliverables = jsonStringList(proposal.deliverables)
                return (
                  <article key={proposal.id} className="border border-[#3A3530] bg-[#252320] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#E8E2DA]">v{proposal.version} · {proposal.title}</p>
                        <p className="mt-1 text-xs text-[#C4A882]">{formatMoney(proposal.amount)} · {PROPOSAL_STATUS_LABELS[proposal.status as ProposalStatus] ?? proposal.status}</p>
                      </div>
                      <form action={statusAction} className="flex gap-2">
                        <select name="status" defaultValue={proposal.status} className="border border-[#3A3530] bg-[#1C1A17] px-2 py-1.5 text-xs text-[#A09890]">
                          {Object.entries(PROPOSAL_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <button type="submit" className="border border-[#504840] px-3 py-1.5 text-xs text-[#A09890] hover:border-[#C4A882]">更新</button>
                      </form>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-xs leading-6 text-[#A09890]">{proposal.scope}</p>
                    {deliverables.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-[#3A3530] pt-3 text-xs text-[#706860]">
                        {deliverables.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    )}
                  </article>
                )
              })}
              {opportunity.proposals.length === 0 && <p className="text-xs text-[#706860]">暂无方案</p>}
            </div>

            <form action={proposalAction} className="mt-5 border-t border-[#3A3530] pt-5">
              <h3 className="text-xs font-semibold text-[#A09890]">新建方案版本</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className={`${LABEL} sm:col-span-2`}>方案标题
                  <input name="title" required defaultValue={`${opportunity.title} · 服务方案`} className={INPUT} />
                </label>
                <label className={`${LABEL} sm:col-span-2`}>工作范围
                  <textarea name="scope" required rows={5} className={INPUT} />
                </label>
                <label className={`${LABEL} sm:col-span-2`}>交付物（每行一项）
                  <textarea name="deliverables" required rows={5} className={INPUT} />
                </label>
                <label className={LABEL}>报价（元）
                  <input name="amountYuan" type="number" min="0" step="1" className={INPUT} />
                </label>
                <label className={LABEL}>有效期
                  <input name="validUntil" type="date" className={INPUT} />
                </label>
              </div>
              <button type="submit" className="mt-4 bg-[#C4A882] px-4 py-2 text-xs font-semibold text-[#1C1A17] hover:bg-[#d2bb98]">创建方案</button>
            </form>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">客户</h2>
            <dl className="mt-4 space-y-3 text-xs">
              {[
                ['姓名', opportunity.customerName],
                ['微信', opportunity.contactWechat],
                ['电话', opportunity.contactPhone],
                ['邮箱', opportunity.contactEmail],
                ['预计金额', formatMoney(opportunity.expectedAmount)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-[#2A2825] pb-2 last:border-0">
                  <dt className="text-[#706860]">{label}</dt><dd className="text-right text-[#A09890]">{value || '—'}</dd>
                </div>
              ))}
            </dl>
            {opportunity.serviceRequest && <Link href={`/admin/services/${opportunity.serviceRequest.id}`} className="mt-4 block text-xs text-[#C4A882]">查看原始服务申请 →</Link>}
          </section>

          <section className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">协议与项目</h2>
            {!opportunity.agreement ? (
              <p className="mt-3 text-xs leading-6 text-[#706860]">方案被客户接受后生成协议。</p>
            ) : (
              <div className="mt-4 space-y-3 text-xs">
                <p className="font-semibold text-[#E8E2DA]">{opportunity.agreement.title}</p>
                <p className="text-[#A09890]">{formatMoney(opportunity.agreement.amount)} · {opportunity.agreement.status}</p>
                <p className="whitespace-pre-wrap leading-6 text-[#706860]">{opportunity.agreement.scope}</p>
                {opportunity.project ? (
                  <Link href={`/admin/projects/${opportunity.project.id}`} className="block border border-[#C4A882]/40 px-3 py-2 text-center font-semibold text-[#C4A882]">进入交付项目</Link>
                ) : (
                  <form action={signAction}>
                    <button type="submit" className="w-full bg-[#C4A882] px-3 py-2.5 font-semibold text-[#1C1A17]">确认签署并创建项目</button>
                  </form>
                )}
              </div>
            )}
          </section>

          <section className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">业务记录</h2>
            <div className="mt-4 space-y-4">
              {opportunity.activities.map((activity) => (
                <div key={activity.id} className="border-l border-[#504840] pl-3">
                  <p className="text-xs text-[#A09890]">{activity.content}</p>
                  <p className="mt-1 text-[0.65rem] text-[#504840]">{activity.createdAt.toLocaleString('zh-CN')}</p>
                </div>
              ))}
              {opportunity.activities.length === 0 && <p className="text-xs text-[#706860]">暂无记录</p>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
