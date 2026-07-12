'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type ServiceRequest = {
  id: string
  serviceType: string
  name: string | null
  phone: string | null
  wechat: string | null
  email: string | null
  message: string | null
  status: string
  aiCategory: string | null
  responseText: string | null
  createdAt: string
  user: { email: string; name: string | null } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  quote_review: '报价审查',
  contract_review: '合同审查',
  budget: '预算咨询',
  construction: '施工咨询',
  living_diagnosis: '居住诊断',
  general: '综合',
}

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'submitted', label: '待处理' },
  { key: 'reviewing', label: '处理中' },
  { key: 'completed', label: '已完成' },
]

export default function ServiceDeskClient({
  initialRequests,
  counts,
}: {
  initialRequests: ServiceRequest[]
  counts: { submitted: number; reviewing: number; completed: number; total: number }
}) {
  const router = useRouter()
  const [requests] = useState<ServiceRequest[]>(initialRequests)
  const [activeTab, setActiveTab] = useState('submitted')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [classifying, setClassifying] = useState<Record<string, boolean>>({})

  const filtered = useMemo(
    () => (activeTab === 'all' ? requests : requests.filter((r) => r.status === activeTab)),
    [activeTab, requests]
  )

  const selected = useMemo(
    () => requests.find((r) => r.id === selectedId) || null,
    [selectedId, requests]
  )

  async function classifyRequest(req: ServiceRequest) {
    setClassifying((prev) => ({ ...prev, [req.id]: true }))
    try {
      const res = await fetch('/api/admin/ai-classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: req.message, serviceType: req.serviceType }),
      })
      const data = await res.json()
      await fetch('/api/admin/services/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: req.id, aiCategory: data.category }),
      })
      router.refresh()
    } catch {
      // ignore
    } finally {
      setClassifying((prev) => ({ ...prev, [req.id]: false }))
    }
  }

  async function generateReply() {
    if (!selected?.message) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/admin/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: selected.message }),
      })
      const data = await res.json()
      setReplyText(data.reply || '')
    } catch {
      // ignore
    } finally {
      setAiLoading(false)
    }
  }

  async function saveReply() {
    if (!selectedId || !replyText.trim()) return
    setSaving(true)
    try {
      await fetch('/api/admin/services/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedId,
          responseText: replyText,
          status: 'completed',
        }),
      })
      router.refresh()
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  async function markReviewing() {
    if (!selectedId) return
    await fetch('/api/admin/services/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedId, status: 'reviewing' }),
    })
    router.refresh()
  }

  return (
    <div className="max-w-[1600px] space-y-4">
      {/* Header */}
      <div>
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Service Desk · 服务待办</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">线索→成交</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {STATUS_TABS.map((tab) => {
          const count = tab.key === 'all' ? counts.total
            : tab.key === 'submitted' ? counts.submitted
            : tab.key === 'reviewing' ? counts.reviewing
            : counts.completed
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedId(null) }}
              className={`border p-3 text-left transition-colors ${
                activeTab === tab.key
                  ? 'border-[#C4A882] bg-[#C4A882]/5'
                  : 'border-[#3A3530] bg-[#1f1d1a] hover:border-[#504840]'
              }`}
            >
              <p className={`text-2xl font-semibold ${activeTab === tab.key ? 'text-[#C4A882]' : 'text-[#E8E2DA]'}`}>
                {count}
              </p>
              <p className="text-xs text-[#706860] mt-1">{tab.label}</p>
            </button>
          )
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        {/* Left: list */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] max-h-[calc(100vh-260px)] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#706860]">暂无 {STATUS_TABS.find(t => t.key === activeTab)?.label} 的服务申请</div>
          ) : (
            filtered.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedId(req.id)}
                className={`w-full text-left p-3 border-b border-[#3A3530] transition-colors ${
                  selectedId === req.id ? 'bg-[#252320] border-l-2 border-l-[#C4A882]' : 'hover:bg-[#252320]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-[#E8E2DA] font-medium truncate">{req.name || req.user?.name || req.user?.email || '匿名'}</span>
                  <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-sm font-semibold shrink-0 ${
                    req.status === 'submitted' ? 'bg-[#C4A882]/15 text-[#C4A882]' :
                    req.status === 'reviewing' ? 'bg-yellow-400/15 text-yellow-400' :
                    req.status === 'completed' ? 'bg-green-400/15 text-green-400' :
                    'bg-[#504840]/30 text-[#706860]'
                  }`}>
                    {req.status === 'submitted' ? '待处理' : req.status === 'reviewing' ? '处理中' : '已完成'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#706860]">{req.serviceType}</span>
                  {req.aiCategory && (
                    <span className="text-[0.6rem] text-[#68aeb0] bg-[#68aeb0]/10 px-1 rounded-sm">
                      {CATEGORY_LABELS[req.aiCategory] || req.aiCategory}
                    </span>
                  )}
                  {!req.aiCategory && (
                    <button
                      onClick={(e) => { e.stopPropagation(); classifyRequest(req) }}
                      disabled={classifying[req.id]}
                      className="text-[0.6rem] text-[#504840] hover:text-[#C4A882] transition-colors"
                    >
                      {classifying[req.id] ? '分类中...' : 'AI分类'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#706860] mt-1 line-clamp-2">{req.message?.slice(0, 100) || '无留言'}</p>
                <p className="text-[0.6rem] text-[#504840] mt-1.5">{new Date(req.createdAt).toLocaleString('zh-CN')}</p>
              </button>
            ))
          )}
        </div>

        {/* Right: detail panel */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 min-h-[500px]">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-sm text-[#706860]">
              选择左侧一条服务申请查看详情
            </div>
          ) : (
            <div className="space-y-4">
              {/* Client info */}
              <div>
                <h2 className="text-lg font-semibold text-[#E8E2DA]">{selected.name || '未留姓名'}</h2>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#A09890]">
                  {selected.phone && <span>📞 {selected.phone}</span>}
                  {selected.wechat && <span>💬 {selected.wechat}</span>}
                  {selected.email && <span>✉️ {selected.email}</span>}
                  {selected.user?.email && <span>👤 {selected.user.email}</span>}
                </div>
              </div>

              {/* Service info */}
              <div className="border border-[#3A3530] bg-[#252320] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#706860]">服务类型</span>
                  <span className="text-sm text-[#E8E2DA] font-medium">{selected.serviceType}</span>
                  <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-sm font-semibold ${
                    selected.status === 'submitted' ? 'bg-[#C4A882]/15 text-[#C4A882]' :
                    selected.status === 'reviewing' ? 'bg-yellow-400/15 text-yellow-400' :
                    'bg-green-400/15 text-green-400'
                  }`}>
                    {selected.status === 'submitted' ? '待处理' : selected.status === 'reviewing' ? '处理中' : '已完成'}
                  </span>
                  {selected.aiCategory && (
                    <span className="text-[0.6rem] text-[#68aeb0] bg-[#68aeb0]/10 px-1.5 py-0.5 rounded-sm font-semibold">
                      AI: {CATEGORY_LABELS[selected.aiCategory] || selected.aiCategory}
                    </span>
                  )}
                </div>
                {selected.message && (
                  <div>
                    <p className="text-xs text-[#706860] mb-1">业主留言</p>
                    <p className="text-sm text-[#A09890] leading-relaxed whitespace-pre-wrap bg-[#141410] p-3 border border-[#3A3530]">{selected.message}</p>
                  </div>
                )}
                <p className="text-[0.6rem] text-[#504840]">
                  提交时间：{new Date(selected.createdAt).toLocaleString('zh-CN')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {selected.status === 'submitted' && (
                  <button onClick={markReviewing} className="px-4 py-2 text-xs font-semibold bg-[#C4A882] text-[#1C1A17] hover:bg-[#C4A882]/85 transition-colors">
                    标记处理中
                  </button>
                )}
                {selected.status !== 'completed' && (
                  <>
                    <button
                      onClick={generateReply}
                      disabled={aiLoading}
                      className="px-4 py-2 text-xs font-semibold border border-[#68aeb0] text-[#68aeb0] hover:bg-[#68aeb0]/10 transition-colors disabled:opacity-40"
                    >
                      {aiLoading ? '生成中...' : '🤖 AI 生成回复'}
                    </button>
                  </>
                )}
              </div>

              {/* Reply editor */}
              {(selected.status === 'reviewing' || selected.status === 'submitted') && (
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={8}
                    placeholder="编写回复...（或点击「AI 生成回复」先草拟一个）"
                    className="w-full bg-[#141410] border border-[#3A3530] text-sm text-[#E8E2DA] p-4 resize-y outline-none focus:border-[#C4A882] placeholder:text-[#504840] leading-relaxed"
                  />
                  <button
                    onClick={saveReply}
                    disabled={saving || !replyText.trim()}
                    className="px-6 py-2 text-xs font-semibold bg-green-600 text-white hover:bg-green-600/85 transition-colors disabled:opacity-40"
                  >
                    {saving ? '保存中...' : '✓ 保存回复并标记完成'}
                  </button>
                </div>
              )}

              {/* Saved reply */}
              {selected.responseText && selected.status === 'completed' && (
                <div>
                  <p className="text-xs text-[#706860] mb-1">已保存回复</p>
                  <p className="text-sm text-[#A09890] leading-relaxed whitespace-pre-wrap bg-[#141410] p-4 border border-green-400/20">{selected.responseText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
