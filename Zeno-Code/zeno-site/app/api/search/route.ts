import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/data/content/articles'
import { checklistTemplates } from '@/data/risk-control/checklist-templates'
import { renovationProjectRisks } from '@/data/risk-control/renovation-project-risks'
import { quoteRiskRules } from '@/data/risk-control/quote-risk-rules'
import { prisma } from '@/lib/prisma'

interface SearchResult {
  title: string
  href: string
  type: 'article' | 'note' | 'resource' | 'page' | 'tool' | 'checklist' | 'service'
  excerpt?: string
}

// Static pages for search
const staticPages: SearchResult[] = [
  { title: '首页', href: '/', type: 'page', excerpt: '赞诺的个人品牌与商业入口。传统行业经验与 AI 实战。' },
  { title: 'AI 培训与企业内训', href: '/training', type: 'service', excerpt: '面向企业、商会和创业社群的 AI 实战培训。' },
  { title: 'AI 工具与工作流', href: '/services#ai-workflow', type: 'service', excerpt: '把重复工作整理成可执行的 AI 工作流。' },
  { title: '企业 AI 知识库', href: '/services#knowledge-base', type: 'service', excerpt: '整理内部资料、规则和经验，建立可检索入口。' },
  { title: 'AI 智能体', href: '/services#ai-agent', type: 'service', excerpt: '围绕明确任务设计、测试和交接智能体。' },
  { title: '网站开发', href: '/services#website', type: 'service', excerpt: '个人品牌与小型业务网站的信息架构、开发和上线。' },
  { title: '赞诺·星火者共同体', href: '/community', type: 'page', excerpt: 'AI 时代的一人公司协作网络。' },
  { title: 'AI 居住诊断', href: '/living-diagnosis', type: 'tool', excerpt: '先看生活方式、审美取舍、家庭场景和空间优先级。' },
  { title: '报价初筛工具', href: '/tools/quote-check', type: 'tool', excerpt: '已有报价时，看它有没有承接方案边界。' },
  { title: '装修报价风险词典', href: '/risk-dictionary', type: 'resource', excerpt: '解释报价里容易引发增项和扯皮的风险词。' },
  { title: '签约前检查模板', href: '/checklists', type: 'checklist', excerpt: '报价、合同、付款节点可以逐项对照。' },
  { title: '施工项目风险库', href: '/project-risks', type: 'resource', excerpt: '按水电、防水、拆除等项目看报价里该写清什么。' },
  { title: '服务合作', href: '/services', type: 'service', excerpt: 'AI 培训、工作流、知识库、智能体和网站开发。' },
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

  return NextResponse.json({ results: results.slice(0, 12) })
}
