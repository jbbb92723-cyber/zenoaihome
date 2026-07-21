'use client'

import { useState } from 'react'
import { UI_CATEGORIES, getTemplatesByCategory } from '@/lib/templates'
import type { Template } from '@/lib/templates'

export default function AiReplyClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [matchedKnowledge, setMatchedKnowledge] = useState<Array<{ id: string; title: string; category: string; relevance: string }>>([])
  const [seeding, setSeeding] = useState(false)

  const filteredTemplates = getTemplatesByCategory(activeCategory)

  function copyTemplate(content: string) {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function generateAiDraft() {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResult('')
    setMatchedKnowledge([])
    try {
      const res = await fetch('/api/admin/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      setAiResult(data.reply || '生成失败，请重试')
      if (data.matchedKnowledge?.length > 0) {
        setMatchedKnowledge(data.matchedKnowledge)
      }
    } catch {
      setAiResult('网络错误，请重试')
    } finally {
      setAiLoading(false)
    }
  }

  async function seedKnowledge() {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/knowledge/seed', { method: 'POST' })
      const data = await res.json()
      alert(`已预置 ${data.seeded} 条知识条目`)
    } catch {
      alert('预置失败')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] gap-5">
      {/* 左侧：分类 + 模板列表 */}
      <div className="space-y-4">
        {/* 分类标签 */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setActiveCategory('all'); setSelectedTemplate(null) }}
            className={`text-xs px-3 py-1.5 border font-semibold transition-colors ${activeCategory === 'all' ? 'border-[#C4A882] bg-[#C4A882]/10 text-[#C4A882]' : 'border-[#3A3530] text-[#706860] hover:border-[#504840]'}`}
          >
            全部
          </button>
          {UI_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSelectedTemplate(null) }}
              className={`text-xs px-3 py-1.5 border font-semibold transition-colors ${activeCategory === cat.key ? 'border-[#C4A882] bg-[#C4A882]/10 text-[#C4A882]' : 'border-[#3A3530] text-[#706860] hover:border-[#504840]'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 模板列表 */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] divide-y divide-[#3A3530] max-h-[calc(100vh-280px)] overflow-y-auto">
          {filteredTemplates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`w-full text-left p-3 transition-colors ${selectedTemplate?.id === tpl.id ? 'bg-[#252320] border-l-2 border-[#C4A882]' : 'hover:bg-[#252320]'}`}
            >
              <p className="text-sm text-[#E8E2DA] font-medium">{tpl.title}</p>
              <p className="text-xs text-[#706860] mt-0.5">{tpl.scenario}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 中间：模板预览 */}
      <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 min-h-[600px]">
        {selectedTemplate ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#E8E2DA]">{selectedTemplate.title}</h2>
                <p className="text-xs text-[#706860] mt-1">场景：{selectedTemplate.scenario}</p>
              </div>
              <button
                onClick={() => copyTemplate(selectedTemplate.content)}
                className="shrink-0 px-4 py-2 text-xs font-semibold bg-[#C4A882] text-[#1C1A17] hover:bg-[#C4A882]/85 transition-colors"
              >
                {copied ? '已复制 ✓' : '复制全文'}
              </button>
            </div>
            <div className="border border-[#3A3530] bg-[#141410] p-5 overflow-y-auto max-h-[calc(100vh-380px)]">
              <pre className="text-sm text-[#A09890] leading-relaxed whitespace-pre-wrap font-sans">{selectedTemplate.content}</pre>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[#706860]">
            选择一个模板查看内容
          </div>
        )}
      </div>

      {/* 右侧：AI 草稿 */}
      <div className="space-y-4">
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">AI 草稿</h2>
            <button
              onClick={seedKnowledge}
              disabled={seeding}
              className="text-xs px-2 py-1 border border-[#504840] text-[#706860] hover:border-[#C4A882] hover:text-[#C4A882] transition-colors disabled:opacity-40"
            >
              {seeding ? '预置中...' : '预置知识库'}
            </button>
          </div>
          <p className="text-xs text-[#706860] mb-3">
            输入业主的问题或场景，AI 自动匹配知识库 + 生成回复草稿。
          </p>
          <textarea
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            rows={4}
            placeholder="例如：业主问「装了中央空调还需要装新风吗？预算不太够了」"
            className="w-full bg-[#141410] border border-[#3A3530] text-sm text-[#E8E2DA] p-3 resize-y outline-none focus:border-[#C4A882] placeholder:text-[#504840]"
          />
          <button
            onClick={generateAiDraft}
            disabled={aiLoading || !aiPrompt.trim()}
            className="mt-3 w-full py-2 text-xs font-semibold bg-[#C4A882] text-[#1C1A17] hover:bg-[#C4A882]/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {aiLoading ? '生成中...' : '生成回复'}
          </button>
        </div>

        {aiResult && (
          <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#706860] uppercase tracking-widest">AI 草稿</h3>
              <button
                onClick={() => copyTemplate(aiResult)}
                className="text-xs text-[#C4A882] hover:underline"
              >
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            <div className="text-sm text-[#A09890] leading-relaxed whitespace-pre-wrap">{aiResult}</div>

            {matchedKnowledge.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#3A3530]">
                <h4 className="text-xs font-semibold text-[#68aeb0] uppercase tracking-widest mb-2">
                  📚 匹配知识库 · {matchedKnowledge.length} 条
                </h4>
                <div className="space-y-2">
                  {matchedKnowledge.map(k => (
                    <div key={k.id} className="border border-[#3A3530] bg-[#252320] p-2 flex items-center gap-2">
                      <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-sm font-semibold ${
                        k.relevance === '高' ? 'bg-green-400/15 text-green-400' :
                        k.relevance === '中' ? 'bg-[#C4A882]/15 text-[#C4A882]' :
                        'bg-[#504840]/30 text-[#706860]'
                      }`}>{k.relevance}</span>
                      <span className="text-xs text-[#A09890]">{k.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
