import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: '装修报价避坑完整指南｜即将开放',
  description:
    '拿到报价单后，逐行对照检查。六张核心清单，把签合同前 30 分钟该看的事写清楚。本产品即将开放，欢迎先了解内容。',
  alternates: {
    canonical: 'https://zenoaihome.com/pricing/baojia-guide',
  },
}

const painPoints = [
  '拿到报价单一头雾水，不知道该先看哪里、问什么',
  '知道大概率有坑，但不确定坑在哪一行',
  '看过零散的避坑文章，但没有可以直接对照检查的工具',
  '不想花 ¥699 做一对一审核，但需要一份能落地的清单',
]

const willGet = [
  'PDF 完整版（约 28-32 页）',
  '六张核心检查表（PDF 表格 + 可填写版）',
  '三类常见陷阱的识别方法 + 应对话术',
  '合同关键条款查漏清单',
  '升级到报价审核服务的优先通道',
]

const tableOfContents = [
  '01　怎么用这份指南（30 分钟自查路径）',
  '02　装修报价单的真实结构：你看到的和没看到的',
  '03　报价单完整度检查表',
  '04　漏项风险检查表',
  '05　模糊描述识别表',
  '06　增项风险记录表',
  '07　水电报价检查表',
  '08　合同条款检查表',
  '09　三类常见陷阱与应对话术',
  '10　自查后还不放心怎么办（升级路径）',
]

const checklists = [
  { name: '表 1 · 报价单完整度检查表', use: '判断该有的项目是否都列了' },
  { name: '表 2 · 漏项风险检查表', use: '识别"应该有但没写"的项目' },
  { name: '表 3 · 模糊描述识别表', use: '标记看似详细实际模糊的描述' },
  { name: '表 4 · 增项风险记录表', use: '集中记录所有另计/甲供/暂估项' },
  { name: '表 5 · 水电报价检查表', use: '隐蔽工程的专项检查' },
  { name: '表 6 · 合同条款检查表', use: '签合同前最后一次自查' },
]

const forWho = [
  '正在收集装修报价、即将签合同的人',
  '担心合同里有条款看不懂的人',
  '需要一份能落地工具、不想做一对一审核的人',
  '不在南宁、暂时不能走线下服务的人',
]

const notForWho = [
  '完全不打算自己看报价的人',
  '已经装修到中后期、想挽回损失的人',
  '期望"读完就能省一半钱"的人——这份指南帮你避坑，不替你砍价',
]

export default function BaojiaGuidePage() {
  return (
    <>
      <PageHero
        label="低价产品｜即将开放"
        title="装修报价避坑完整指南"
        subtitle="拿到报价单后，逐行对照检查。六张核心清单，把签合同前 30 分钟该看的事写清楚。"
        size="content"
      />

      <Container size="content" className="py-12 sm:py-16 space-y-16">

        {/* Hero 状态条 */}
        <div className="flex flex-wrap items-center gap-3 border border-stone/30 bg-stone/5 px-5 py-4">
          <span className="text-[0.65rem] text-stone border border-stone/40 px-2 py-0.5 uppercase tracking-wider">
            即将开放
          </span>
          <p className="text-sm text-ink-muted">
            预计定价 ¥29-49 · 数字产品 · 一次购买，小版本更新免费
          </p>
        </div>

        {/* 用户痛点 */}
        <section>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">用户痛点</p>
          <h2 className="text-lg font-semibold text-ink mb-5">如果你正在准备签装修合同</h2>
          <ul className="space-y-2.5">
            {painPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0 mt-1">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 这份指南解决什么 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">这份指南解决什么</p>
          <h2 className="text-lg font-semibold text-ink mb-5">不替你砍价，帮你看清楚</h2>
          <div className="space-y-4 text-sm text-ink leading-[1.85]">
            <p>
              这不是课程，也不是文章合集。它是一份你拿到装修报价单后可以直接对照检查的实用 PDF 指南。
            </p>
            <p className="text-ink-muted">
              文章是"读完理解"，这份指南是"边看边对照"。每张表都标注了风险等级判定标准，配套话术模板告诉你怎么向施工方追问，
              全部按"拿到报价单 → 签合同前"的真实使用顺序排好。
            </p>
          </div>
        </section>

        {/* 你会得到什么 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你会得到什么</p>
          <h2 className="text-lg font-semibold text-ink mb-5">完整交付物</h2>
          <ul className="space-y-2.5">
            {willGet.map((g) => (
              <li key={g} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0">✓</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 目录预览 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">目录预览</p>
          <h2 className="text-lg font-semibold text-ink mb-5">10 章，约 28-32 页</h2>
          <ol className="space-y-2 border border-border p-6 bg-surface-warm/40">
            {tableOfContents.map((t) => (
              <li key={t} className="text-sm text-ink leading-relaxed font-mono tracking-tight">
                {t}
              </li>
            ))}
          </ol>
        </section>

        {/* 六张检查表 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">核心检查表</p>
          <h2 className="text-lg font-semibold text-ink mb-5">六张可直接对照的清单</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklists.map((c) => (
              <div key={c.name} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink leading-snug">{c.name}</p>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{c.use}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 适合谁 / 不适合谁 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">适合谁</p>
          <h2 className="text-lg font-semibold text-ink mb-5">先确认是不是你想要的</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-stone font-semibold uppercase tracking-widest mb-3">适合</p>
              <ul className="space-y-2">
                {forWho.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-ink leading-relaxed">
                    <span className="text-stone shrink-0">+</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">不适合</p>
              <ul className="space-y-2">
                {notForWho.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-ink-muted leading-relaxed">
                    <span className="text-ink-faint shrink-0">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 即将开放提示 + 下一步引导 */}
        <section className="border border-stone/30 bg-stone/5 p-7 sm:p-9">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone mb-3">即将开放</p>
          <h2 className="text-lg font-semibold text-ink mb-3">还在做最后校对，预计 5 月内开放购买</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-prose">
            如果你手里已经有报价单、不想等，可以先用免费的报价审核清单做一次自查；
            或者直接看报价诊断服务，让我帮你看一遍。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/resources"
              className="inline-flex items-center text-sm font-medium bg-stone text-white px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              先领取报价审核清单 →
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              查看报价诊断服务 →
            </Link>
          </div>
        </section>

        {/* 售后说明 */}
        <section className="border-t border-border pt-8 text-xs text-ink-muted leading-relaxed space-y-1.5">
          <p>· 数字产品，售出后不支持退款</p>
          <p>· 一次购买，后续小版本更新免费</p>
          <p>· 个人使用授权，不可二次分发</p>
        </section>

      </Container>
    </>
  )
}
