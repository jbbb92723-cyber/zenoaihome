'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Link from 'next/link'

const suggestions: Record<string, { directions: { title: string; topics: string[] }[] }> = {
  '装修|施工': {
    directions: [
      { title: '传统行业人怎么用 AI', topics: ['传统装修团队引入 AI，第一步该解决什么', '一次装修资料整理流程该怎样记录', '怎样把报价说明整理得更容易核对'] },
      { title: '装修签约前的核对问题', topics: ['报价单里的模糊表述怎么问清', '水电验收前要准备哪些可核对资料', '哪些责任边界需要写进合同'] },
      { title: '一人公司做装修如何划边界', topics: ['一个人承接装修项目，哪些工作不能全包', '装修服务中的判断如何变成明确交付', '什么时候应该引入外部协作'] },
    ],
  },
  '设计|设计': {
    directions: [
      { title: '设计师的 AI 工具箱', topics: ['AI 出多版方案前，哪些标准要先写清', '设计提案需要讲清哪些决策', 'AI 进入设计后，人应保留哪些判断'] },
      { title: '独立设计师怎么经营', topics: ['独立设计师的客户从哪里来', '哪些设计工作适合产品化', '转向一人公司前要验证哪三个问题'] },
      { title: '审美与商业之间', topics: ['好设计为什么不等于好生意', '客户说“不好看”时，先核对什么', '设计怎样同时回应审美和具体问题'] },
    ],
  },
  '教育|培训': {
    directions: [
      { title: '知识服务怎么设计', topics: ['录播课和直播课分别适合什么条件', '从一对一咨询到小班课程，交付要改什么', '怎样收集学员没有完成练习的真实原因'] },
      { title: 'AI + 教育', topics: ['怎样用 AI 辅助整理个性化学习路径', 'AI 批改作业需要保留哪些人工复核', '教育者使用 AI 时不能外包哪些责任'] },
      { title: '从机构到独立', topics: ['离开机构前要核对哪些条件', '怎样记录第一个付费学员的真实来源', '教育服务中哪些判断不能交给工具'] },
    ],
  },
  '技术|开发': {
    directions: [
      { title: '独立开发者的经营问题', topics: ['从外包转向产品前要验证什么', 'SaaS 的第一批付费反馈该怎样记录', '独立开发者为什么需要公开表达'] },
      { title: 'AI 时代的程序员', topics: ['使用 AI 编程后，代码审查责任落在谁身上', '提示词能力在哪些任务中真正有用', '什么项目适合自己写，什么适合借助 AI'] },
      { title: '技术人的表达', topics: ['专业能力为什么不自动变成好文章', '技术博客怎样让圈外人也能核对', 'GitHub 之外还需要展示哪些交付证据'] },
    ],
  },
  '营销|运营': {
    directions: [
      { title: '一人公司的获客方法', topics: ['内容获客需要观察哪些真实信号', '朋友圈能否作为最小验证渠道', '怎样把客户转介绍从偶然变成可复盘流程'] },
      { title: 'AI 与运营效率', topics: ['AI 批量生成文案后，质量怎样验收', '客服自动回复在哪些问题上必须转人工', '用 AI 分析数据时怎样核对原始口径'] },
      { title: '从执行到策略', topics: ['运营工作怎样连接到可衡量的结果', '小品牌定价前需要核对哪些成本', '怎样判断一个渠道是否值得继续投入'] },
    ],
  },
  'default': {
    directions: [
      { title: '你的经历就是内容', topics: ['过去三年做对了什么——写下来就是方向一', '踩过最大的一个坑——写下来就是方向二', '如果重新开始会怎么做——写下来就是方向三'] },
      { title: '你帮别人解决过的问题', topics: ['客户最常问你的三个问题是什么', '你做过的项目里最有价值的那个', '你比别人多知道的一件事'] },
      { title: '你在学的、在试的', topics: ['最近在学的一个技能——记录过程', '试过但放弃的一件事——写复盘', '想试但还没开始的事——写计划'] },
    ],
  },
}

function matchSuggestions(industry: string, skills: string): { directions: { title: string; topics: string[] }[] } {
  const key = `${industry}|${skills}`
  for (const [pattern, data] of Object.entries(suggestions)) {
    if (pattern === 'default') continue
    const [ind, sk] = pattern.split('|')
    if (industry.includes(ind) || skills.includes(sk) || industry.includes(sk) || skills.includes(ind)) {
      return data
    }
  }
  return suggestions['default']
}

export default function ContentStrategyPage() {
  const [industry, setIndustry] = useState('')
  const [skills, setSkills] = useState('')
  const [result, setResult] = useState<{ directions: { title: string; topics: string[] }[] } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!industry.trim() && !skills.trim()) return
    setResult(matchSuggestions(industry, skills))
  }

  return (
    <Container size="content" className="py-16 sm:py-20">
      <Link href="/ai-tools" className="text-xs font-semibold text-stone hover:text-ink mb-8 inline-block">← 回到 AI 工具</Link>

      {!result ? (
        <>
          <p className="text-sm font-semibold text-stone">内容选题匹配</p>
          <h1 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem] text-ink">输入两项信息</h1>
          <p className="mt-4 text-base leading-8 text-ink-muted max-w-xl">
            告诉工具你的行业和擅长的事，从预设题库中找几个可以继续核对的选题起点。
          </p>
          <p className="mt-3 max-w-xl border-l-2 border-stone pl-4 text-xs leading-6 text-ink-muted">
            当前版本不调用大模型。匹配结果不能证明选题适合你，也不能替你补写没有发生过的经历。
          </p>
          <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-5">
            <div>
              <label className="text-sm font-semibold text-ink block mb-2">你的行业</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="如：装修、设计、教育、技术开发..."
                className="w-full border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-faint focus:border-stone focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-2">你擅长的事</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="如：施工管理、UI 设计、课程开发、Python..."
                className="w-full border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-faint focus:border-stone focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep"
            >
              匹配内容选题 →
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-stone">匹配结果</p>
          <h1 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem] text-ink">三个方向，九个选题起点。</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted max-w-xl mb-8">
            基于 <strong className="text-ink">{industry || '你的行业'}</strong> 和 <strong className="text-ink">{skills || '你擅长的事'}</strong> 从预设题库匹配。
            发布前请用自己的经历、证据和读者反馈重新筛选。
          </p>
          <div className="grid gap-5 sm:grid-cols-3 max-w-3xl">
            {result.directions.map((d, i) => (
              <div key={i} className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold text-stone mb-3">方向 {i + 1}</p>
                <h3 className="text-sm font-semibold text-ink mb-3">{d.title}</h3>
                <ul className="space-y-2">
                  {d.topics.map((t, j) => (
                    <li key={j} className="text-xs leading-relaxed text-ink-muted flex gap-2">
                      <span className="text-stone shrink-0">·</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => setResult(null)} className="text-sm font-semibold text-stone hover:text-ink">← 重新匹配</button>
            <Link href="/community" className="inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
              去星火者和同行聊聊 →
            </Link>
          </div>
        </>
      )}
    </Container>
  )
}
