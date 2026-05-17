import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/data/articles'
import { checklistTemplates } from '@/data/checklist-templates'
import { renovationProjectRisks } from '@/data/renovation-project-risks'
import { quoteRiskRules } from '@/data/quote-risk-rules'
import { serviceLadder } from '@/data/commercial-ladder'
import { prisma } from '@/lib/prisma'

interface SearchResult {
  title: string
  href: string
  type: 'article' | 'note' | 'resource' | 'page' | 'tool' | 'checklist' | 'service'
  excerpt?: string
}

// Static pages for search
const staticPages: SearchResult[] = [
  { title: '首页', href: '/', type: 'page' },
  { title: '报价初筛工具', href: '/tools/quote-check', type: 'tool', excerpt: '签约前先看报价里哪些地方没写清。' },
  { title: '装修报价风险词典', href: '/risk-dictionary', type: 'resource', excerpt: '解释报价里容易引发增项和扯皮的风险词。' },
  { title: '签约前检查模板', href: '/checklists', type: 'checklist', excerpt: '报价、合同、付款节点可以逐项对照。' },
  { title: '施工项目风险库', href: '/project-risks', type: 'resource', excerpt: '按水电、防水、拆除等项目看报价里该写清什么。' },
  { title: '服务价格', href: '/services/renovation', type: 'service', excerpt: '免费初筛、¥99 初查、¥299 快审、¥699 深度判断。' },
  { title: '关于 Zeno', href: '/about', type: 'page' },
  { title: '联系我', href: '/contact', type: 'page' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase()

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] })
  }

  const results: SearchResult[] = []

  // Search articles
  for (const article of articles) {
    const searchText = `${article.title} ${article.excerpt ?? ''} ${article.tags?.join(' ') ?? ''} ${article.category ?? ''}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: article.title,
        href: `/blog/${article.slug}`,
        type: 'article',
        excerpt: article.excerpt ?? undefined,
      })
    }
    if (results.length >= 10) break
  }

  // Search notes from database
  if (results.length < 10) {
    try {
      const notes = await prisma.note.findMany({
        where: {
          visibility: 'PUBLIC',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { title: true, slug: true, excerpt: true },
        take: 5,
      })
      for (const note of notes) {
        results.push({
          title: note.title,
          href: `/notes/${note.slug}`,
          type: 'note',
          excerpt: note.excerpt ?? undefined,
        })
      }
    } catch {
      // DB unavailable, skip notes
    }
  }

  // Search static pages
  for (const page of staticPages) {
    const searchText = `${page.title} ${page.excerpt ?? ''}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push(page)
    }
  }

  // Search risk dictionary
  for (const rule of quoteRiskRules) {
    const searchText = `${rule.name} ${rule.category} ${rule.oneLine} ${rule.triggerTerms.join(' ')} ${rule.commonItems.join(' ')}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: rule.name,
        href: `/risk-dictionary/${rule.slug}`,
        type: 'resource',
        excerpt: rule.oneLine,
      })
    }
  }

  // Search checklist templates
  for (const template of checklistTemplates) {
    const searchText = `${template.title} ${template.subtitle} ${template.suitableFor.join(' ')}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: template.title,
        href: `/checklists/${template.slug}`,
        type: 'checklist',
        excerpt: template.subtitle,
      })
    }
  }

  // Search project risks
  for (const project of renovationProjectRisks) {
    const searchText = `${project.name} ${project.oneLine} ${project.vagueWords.join(' ')} ${project.addOnRisks.join(' ')}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: `${project.name}报价风险`,
        href: `/project-risks/${project.slug}`,
        type: 'resource',
        excerpt: project.oneLine,
      })
    }
  }

  // Search main commercial ladder
  for (const service of serviceLadder) {
    const searchText = `${service.title} ${service.whoFor} ${service.delivers} ${service.price}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: service.title,
        href: service.href,
        type: 'service',
        excerpt: `${service.price} · ${service.delivers}`,
      })
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) })
}
