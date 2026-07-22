'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Link from 'next/link'

const questions = [
  { id: 'product', q: '你有一个明确的产品或服务吗？', options: ['有，很清晰', '大概知道，但说不清楚', '还在摸索中', '就是接单干活'] },
  { id: 'paid', q: '有人为你的产品或服务付过钱吗？', options: ['是的，持续付费', '有过一两次', '还没有，刚起步', '免费阶段'] },
  { id: 'audience', q: '你知道你的客户是谁、在哪能找到吗？', options: ['很清楚，有固定渠道', '大概知道', '不太确定', '靠运气或朋友介绍'] },
  { id: 'revenue', q: '你现在主要收入来源？', options: ['自己的一人公司', '主业+副业', '只有主业', '还没有稳定收入'] },
  { id: 'time', q: '你每周花在产品/获客/交付的时间比例？', options: ['产品为主', '获客为主', '交付为主', '都很少，还在想'] },
  { id: 'stuck', q: '最让你卡住的一件事？', options: ['不知道做什么产品', '有产品但没客户', '有客户但交付不过来', '一切都还行，但想放大'] },
  { id: 'team', q: '你现在一个人，还是有团队？', options: ['一个人，全职做', '一个人，业余做', '有合作伙伴', '有小团队'] },
  { id: 'growth', q: '过去三个月最大的变化？', options: ['收入增长了', '方向更清晰了', '遇到了瓶颈', '刚开始，还没数据'] },
  { id: 'tools', q: '你在用 AI 工具吗？', options: ['每天都在用', '偶尔用一下', '想用但不知道怎么用', '不太关心'] },
  { id: 'community', q: '你现在有同行圈子吗？', options: ['有，经常交流', '有几个朋友聊聊', '没有，全靠自己', '想找，不知道去哪'] },
]

const stageMap: Record<string, { stage: string; title: string; what: string; next: string }> = {
  'explore': { stage: '探索期', title: '你还在找方向', what: '产品不清晰、没收入、不知道客户在哪。这是最难的阶段——但也最自由。你现在需要的不是执行力，是需要一个可以试的小切口。', next: '找一个最小的事做。去 /ai-tools/content-strategy 生成几个方向，挑一个花两周试。试完再来做一次诊断。' },
  'build': { stage: '构建期', title: '你在搭产品', what: '有方向了，但还没有客户。或者有客户但产品不成熟。你现在需要的是「让人知道你的产品存在」和「快速获得第一次真实反馈」。', next: '去 /ai-tools/content-strategy 生成内容策略，开始写。写的过程就是你打磨产品的过程。' },
  'grow': { stage: '成长期', title: '你在找放大', what: '有产品、有客户、有收入。现在的问题是「怎么放大」——交付跟不上、获客不稳定、时间不够用。', next: '你需要系统化和找人。来星火者——找能协作的人、学别人的流程、把你的方法变成可复用的系统。' },
  'stable': { stage: '稳定期', title: '你在维持', what: '收入稳定、方向清晰。但你可能在问：下一步是什么？要不要放大？要不要带人？', next: '你是星火者要找的那种人——有东西可以分享、有能力可以协作。来星火者，把你的经验变成别人的跳板。' },
}

function computeStage(answers: Record<string, string>): string {
  const paid = answers['paid'] || ''
  const revenue = answers['revenue'] || ''
  const product = answers['product'] || ''
  const stuck = answers['stuck'] || ''

  if (paid.includes('持续') && revenue.includes('一人公司')) return 'stable'
  if ((paid.includes('有过') || paid.includes('持续')) && product.includes('清晰')) return 'grow'
  if (product.includes('大概') || product.includes('清晰')) return 'build'
  return 'explore'
}

export default function OPCDiagnosisPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)

  const handleAnswer = (option: string) => {
    const newAnswers = { ...answers, [questions[step].id]: option }
    setAnswers(newAnswers)
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setResult(computeStage(newAnswers))
    }
  }

  if (result && stageMap[result]) {
    const s = stageMap[result]
    return (
      <Container size="content" className="py-16 sm:py-20">
        <Link href="/ai-tools" className="text-xs font-semibold text-stone hover:text-ink mb-8 inline-block">← 回到 AI 工具</Link>
        <p className="text-sm font-semibold text-stone">{s.stage}</p>
        <h1 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem] text-ink">{s.title}</h1>
        <div className="mt-8 max-w-2xl space-y-6">
          <div className="border-l-2 border-stone pl-5">
            <p className="text-base leading-8 text-ink-muted">{s.what}</p>
          </div>
          <div className="border border-stone bg-surface-warm p-5">
            <p className="text-sm font-semibold text-ink mb-2">下一步</p>
            <p className="text-sm leading-relaxed text-ink-muted">{s.next}</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/ai-tools/content-strategy" className="inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">生成内容策略 →</Link>
            <Link href="/community" className="inline-flex min-h-11 items-center rounded-[7px] border border-border px-5 py-3 text-sm font-semibold text-ink hover:border-stone">了解星火者 →</Link>
          </div>
        </div>
      </Container>
    )
  }

  const q = questions[step]
  const progress = Math.round(((step) / questions.length) * 100)

  return (
    <Container size="content" className="py-16 sm:py-20">
      <Link href="/ai-tools" className="text-xs font-semibold text-stone hover:text-ink mb-8 inline-block">← 回到 AI 工具</Link>
      <p className="text-sm font-semibold text-stone">一人公司诊断 · 第 {step + 1}/{questions.length} 题</p>
      <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
        <div className="h-full bg-stone transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <h2 className="mt-8 text-xl font-semibold text-ink sm:text-2xl">{q.q}</h2>
      <div className="mt-6 grid gap-3 max-w-lg">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="text-left border border-border bg-surface p-4 text-sm text-ink-muted hover:border-stone hover:text-ink transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </Container>
  )
}
