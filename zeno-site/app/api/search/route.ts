import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/data/articles'
import { resources } from '@/data/resources'
import { services } from '@/data/services'
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
  { title: '从这里开始', href: '/start', type: 'page' },
  { title: 'AI 升级装修行业', href: '/ai', type: 'page', excerpt: '传统装修经验如何接入 AI 工具、方法论、内容系统和服务升级。' },
  { title: '工具中心', href: '/tools', type: 'page' },
  { title: '工具与资料', href: '/resources', type: 'page' },
  { title: '服务', href: '/services', type: 'page' },
  { title: '思考札记', href: '/notes', type: 'page' },
  { title: '关于 Zeno', href: '/about', type: 'page' },
  { title: '联系我', href: '/contact', type: 'page' },
  { title: '报价初筛工具', href: '/tools/quote-check', type: 'tool', excerpt: '不用先懂施工，先做一轮报价风险类型初筛。' },
  { title: '预算分配工具', href: '/tools/budget-structure', type: 'tool', excerpt: '按简约够住、舒适耐用、精致改善三档拆预算。' },
  { title: '超预算原因自测', href: '/tools/budget-risk', type: 'tool', excerpt: '先分清超支更像来自报价、流程还是需求。' },
  { title: '单位换算工具', href: '/tools/unit-converter', type: 'tool', excerpt: '装修常见面积、长度、延米、坪和单方换算。' },
  { title: '瓷砖计算器', href: '/tools/tile-calculator', type: 'tool', excerpt: '输入铺贴面积和瓷砖规格，估算片数、箱数和损耗。' },
  { title: '乳胶漆计算器', href: '/tools/paint-calculator', type: 'tool', excerpt: '估算底漆、面漆升数和桶数。' },
  { title: '验收节点向导', href: '/tools/inspection-guide', type: 'tool', excerpt: '按水电、防水、泥工、木作、油漆、安装和竣工生成验收清单。' },
  { title: 'AI 提示词体验场', href: '/tools/prompts', type: 'tool' },
  { title: 'Markdown 微信排版工具', href: '/tools/md2wechat', type: 'tool' },
  { title: '报价避坑完整指南', href: '/pricing/baojia-guide', type: 'resource', excerpt: '低价数字产品，签约前系统看报价。' },
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

  // Search resources / checklists
  for (const resource of resources) {
    const searchText = `${resource.title} ${resource.subtitle} ${resource.description} ${resource.tag}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: resource.title,
        href: `/resources#${resource.slug}`,
        type: resource.title.includes('清单') || resource.title.includes('表') || resource.title.includes('模板') ? 'checklist' : 'resource',
        excerpt: resource.subtitle,
      })
    }
  }

  // Search services
  for (const service of services) {
    const searchText = `${service.title} ${service.tagline} ${service.description} ${service.solves} ${service.tag}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: service.title,
        href: service.slug === 'ai-neirong-xitong-zixun' ? '/services/ai-workflow' : `/services/renovation#${service.slug}`,
        type: 'service',
        excerpt: `${service.tagline} · ${service.price}`,
      })
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) })
}
