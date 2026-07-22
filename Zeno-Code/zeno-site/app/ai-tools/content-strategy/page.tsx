'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Link from 'next/link'

const suggestions: Record<string, { directions: { title: string; topics: string[] }[] }> = {
  '装修|施工': {
    directions: [
      { title: '传统行业人怎么用 AI', topics: ['装修公司上 AI 搞错了顺序', '一个工地佬的 AI 工具清单', '用 AI 写报价说明，客户秒懂'] },
      { title: '装修避坑指南', topics: ['报价单上最危险的七个字', '水电验收你该看什么（不是看走线）', '合同里没写这句话等于白签'] },
      { title: '一人公司怎么做装修', topics: ['一个人接装修项目，怎么不崩', '装修不是卖方案——是卖判断', '我为什么不招工人'] },
    ],
  },
  '设计|设计': {
    directions: [
      { title: '设计师的 AI 工具箱', topics: ['用 AI 出 10 版方案只要 30 分钟', '设计提案怎么写客户才会买单', 'AI 时代设计师的核心能力变了'] },
      { title: '独立设计师怎么活', topics: ['不做平台、不接低价单——我的获客方法', '从接单到产品化：一个设计模板卖 100 次', '设计师转型一人公司的三个坑'] },
      { title: '审美与商业之间', topics: ['好设计为什么不等于好生意', '客户说"不好看"——你怎么回应', '设计不是艺术——是解决问题'] },
    ],
  },
  '教育|培训': {
    directions: [
      { title: '知识付费怎么做', topics: ['录播课和直播课，哪个值得做', '从 1v1 咨询到 1vN 课程：我的产品化之路', '学员不交作业怎么办'] },
      { title: 'AI + 教育', topics: ['用 AI 给学员做个性化学习路径', 'AI 批改作业到底靠不靠谱', '教育者不需要变成程序员——需要变成 AI 使用者'] },
      { title: '从打工到独立', topics: ['什么时候从机构出来单干', '第一个 100 个学员怎么来的', '教育的本质不是教知识——是帮人做决策'] },
    ],
  },
  '技术|开发': {
    directions: [
      { title: '独立开发者的生意经', topics: ['从接外包到做产品：我走了三年弯路', '一个 SaaS 从 0 到 100 个付费用户的真实过程', '独立开发者要不要写内容'] },
      { title: 'AI 时代的程序员', topics: ['Cursor + Copilot——我不再写代码了', '提示词工程师是伪需求吗', '什么项目值得自己写、什么该用 AI'] },
      { title: '技术人的表达', topics: ['为什么好程序员写不出好文章', '技术博客怎么写到圈外人也能看懂', '你的 GitHub 就是你的简历——但还不够'] },
    ],
  },
  '营销|运营': {
    directions: [
      { title: '一人公司的获客方法', topics: ['不做投放——靠内容获客的完整路径', '朋友圈就是你的最小 MVP', '客户转介绍不是靠求——是靠系统'] },
      { title: 'AI 降本增效', topics: ['用 AI 写小红书文案，一个月 30 篇不重样', '客服 AI 帮我省掉一个人', '数据分析不需要学 Python——用 AI 就够了'] },
      { title: '从执行到策略', topics: ['运营不是发帖子——是设计增长系统', '小品牌的定价策略：不要跟大公司比便宜', '怎么判断一个渠道值不值得做'] },
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
          <p className="text-sm font-semibold text-stone">内容策略生成</p>
          <h1 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem] text-ink">输入两样东西——</h1>
          <p className="mt-4 text-base leading-8 text-ink-muted max-w-xl">
            告诉我你的行业和你擅长的事，帮你找到值得写的东西。
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
              生成内容策略 →
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-stone">你的内容策略</p>
          <h1 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem] text-ink">三个方向，九个选题。</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted max-w-xl mb-8">
            基于 <strong className="text-ink">{industry || '你的行业'}</strong> 和 <strong className="text-ink">{skills || '你擅长的事'}</strong> 生成。
            不是替你写——是告诉你什么值得写。
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
            <button onClick={() => setResult(null)} className="text-sm font-semibold text-stone hover:text-ink">← 重新生成</button>
            <Link href="/community" className="inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
              去星火者和同行聊聊 →
            </Link>
          </div>
        </>
      )}
    </Container>
  )
}
