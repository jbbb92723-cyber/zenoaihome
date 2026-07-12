/**
 * lib/dashboard-stats.ts
 *
 * 数字资产大屏 — 数据聚合层
 *
 * 数据来源：
 *  ① data/content/articles.ts + categories.ts → 网站内容统计
 *  ② Prisma DB → 商业指标
 *  ③ fs.readdirSync 递归 → Obsidian 内容库 + 代码文件统计
 *  ④ child_process.execSync('git log ...') → Git 统计
 *
 * 文件系统统计使用内存缓存，5 分钟过期。
 * Prisma 查询每次实时。
 */

import { articles } from '@/data/content/articles'
import { primaryCategories } from '@/data/content/categories'
import { prisma } from '@/lib/prisma'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

// ─── 类型定义 ───────────────────────────────────────────────

export interface DashboardStats {
  generatedAt: string

  website: {
    articles: {
      total: number
      byCategory: { name: string; count: number; slug: string }[]
    }
    latestArticles: { id: string; title: string; date: string; category: string }[]
    categories: number
    seo: {
      totalSlugs: number
      articlesLast30Days: number
    }
  }

  content: {
    totalMdFiles: number
    rawMaterials: number
    contentUnits: {
      total: number
      byType: Record<string, number>
    }
    methodCards: number
    themeMaps: number
    assemblies: number
    templates: number
    scripts: number
    processingQueue: number
    processed: number
    externalKnowledge: number
    archive: number
  }

  business: {
    users: { total: number; today: number; thisMonth: number }
    members: { active: number; free: number; creator: number }
    orders: { today: number; thisMonth: number; total: number }
    revenue: { today: number; thisMonth: number; total: number }
    services: { pending: number; total: number }
    diagnoses: { pending: number; total: number }
    resources: { claimsToday: number }
    notes: { total: number; published: number }
    projects: { active: number; total: number }
  }

  code: {
    pages: number
    components: number
    apiRoutes: number
    prismaModels: number
    dataFiles: number
    tsFiles: number
    mjsFiles: number
    mdFiles: number
  }

  git: {
    commitsThisYear: number
    activeDays: number
  }

  pipeline: {
    feishuConnected: boolean
    pendingDrafts: number
    approvedDrafts: number
    publishedDrafts: number
    totalDrafts: number
  }

  platforms: {
    website: { status: string; url: string }
    wechatOA: { status: string }
    xiaohongshu: { status: string }
    douyin: { status: string }
  }
}

// ─── 缓存 ──────────────────────────────────────────────────

const cache = new Map<string, { value: unknown; ts: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 分钟

function cached<T>(key: string, compute: () => T): T {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL_MS) {
    return entry.value as T
  }
  const value = compute()
  cache.set(key, { value, ts: Date.now() })
  return value
}

// ─── 辅助 ──────────────────────────────────────────────────

function projectRoot(): string {
  return path.resolve(process.cwd())
}

function obsidianRoot(): string {
  return path.resolve(projectRoot(), '../../Zeno-Content/赞诺内容资产库/内容结构化系统')
}

function countFilesRecursive(dir: string): number {
  try {
    if (!fs.existsSync(dir)) return 0
    let count = 0
    const stack = [dir]
    while (stack.length) {
      const current = stack.pop()!
      let entries: fs.Dirent[]
      try {
        entries = fs.readdirSync(current, { withFileTypes: true })
      } catch {
        continue
      }
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (entry.name.startsWith('.') && entry.name !== '.') continue
          stack.push(path.join(current, entry.name))
        } else {
          count += 1
        }
      }
    }
    return count
  } catch {
    return 0
  }
}

function countMdFilesRecursive(dir: string): number {
  try {
    if (!fs.existsSync(dir)) return 0
    let count = 0
    const stack = [dir]
    while (stack.length) {
      const current = stack.pop()!
      let entries: fs.Dirent[]
      try {
        entries = fs.readdirSync(current, { withFileTypes: true })
      } catch {
        continue
      }
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (entry.name.startsWith('.') && entry.name !== '.') continue
          stack.push(path.join(current, entry.name))
        } else if (entry.name.endsWith('.md')) {
          count += 1
        }
      }
    }
    return count
  } catch {
    return 0
  }
}

// ─── 日期 ──────────────────────────────────────────────────

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(): Date {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d
}

// ─── 各部分数据 ────────────────────────────────────────────

function getWebsiteStats() {
  // 有效的文章条目
  const validArticles = articles.filter((a) => a.id && a.title && a.date)

  // 按新分类体系（primaryCategories 的 name）分组
  const byCategoryMap = new Map<string, number>()
  for (const a of validArticles) {
    // 尝试匹配主分类名
    const cat = primaryCategories.find(
      (c) =>
        c.name === a.category ||
        c.slug === a.parentCategory
    )
    const label = cat?.name ?? a.category ?? '未分类'
    byCategoryMap.set(label, (byCategoryMap.get(label) ?? 0) + 1)
  }
  const byCategory = Array.from(byCategoryMap.entries())
    .map(([name, count]) => ({ name, count, slug: '' }))
    .sort((a, b) => b.count - a.count)

  // 最新 10 篇
  const sorted = [...validArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const latestArticles = sorted.slice(0, 10).map((a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    category: a.category,
  }))

  // SEO
  const thirtyDaysAgo = daysAgo(30)
  const articlesLast30Days = validArticles.filter(
    (a) => new Date(a.date) >= thirtyDaysAgo
  ).length

  return {
    articles: {
      total: validArticles.length,
      byCategory,
    },
    latestArticles,
    categories: primaryCategories.length,
    seo: {
      totalSlugs: validArticles.length,
      articlesLast30Days,
    },
  }
}

function getContentStats() {
  const base = obsidianRoot()

  const rawMaterials = cached('content-rawMaterials', () =>
    countFilesRecursive(path.join(base, '01-原始素材区'))
  )

  // 内容单元按类型
  const unitBase = path.join(base, '02-内容单元库')
  const contentUnitsByType: Record<string, number> = {}
  const typeDirs: Record<string, string> = {
    'CAS-案例': 'CAS-案例单元',
    'CON-概念': 'CON-概念单元',
    'OPI-观点': 'OPI-观点单元',
    'QUE-问题': 'QUE-问题单元',
    'SOL-方案': 'SOL-方案单元',
  }
  let contentUnitsTotal = 0
  for (const [key, dir] of Object.entries(typeDirs)) {
    const count = cached(`content-unit-${key}`, () =>
      countFilesRecursive(path.join(unitBase, dir))
    )
    contentUnitsByType[key] = count
    contentUnitsTotal += count
  }

  const assemblies = cached('content-assemblies', () =>
    countFilesRecursive(path.join(base, '06-选题装配'))
  )
  const templates = cached('content-templates', () =>
    countFilesRecursive(path.join(base, '04-模板'))
  )
  const scripts = cached('content-scripts', () =>
    countFilesRecursive(path.join(base, '07-脚本与工具'))
  )
  const processingFiles = cached('content-processing', () =>
    countFilesRecursive(path.join(base, '03-处理状态'))
  )
  const archive = cached('content-archive', () =>
    countFilesRecursive(path.join(base, '90_归档'))
  )
  const methodCards = cached('content-methodCards', () =>
    countFilesRecursive(path.join(base, '02-方法卡'))
  )
  const themeMaps = cached('content-themeMaps', () =>
    countFilesRecursive(path.join(base, '05-主题地图'))
  )
  const externalKnowledge = cached('content-extKnowledge', () =>
    countFilesRecursive(path.join(base, '01-原始素材区', '外部知识'))
  )

  // 总的 md 文件数
  const totalMdFiles = cached('content-totalMd', () =>
    countMdFilesRecursive(path.resolve(projectRoot(), '../../Zeno-Content'))
  )

  return {
    totalMdFiles,
    rawMaterials,
    contentUnits: {
      total: contentUnitsTotal,
      byType: contentUnitsByType,
    },
    methodCards,
    themeMaps,
    assemblies,
    templates,
    scripts,
    processingQueue: 70, // 来自处理状态 CSV
    processed: 5,        // 来自处理状态 CSV
    externalKnowledge,
    archive,
  }
}

async function getBusinessStats() {
  const today = startOfToday()
  const monthStart = startOfMonth()

  try {
    const [
      totalUsers,
    usersToday,
    usersThisMonth,
    activeMembersFree,
    activeMembersCreator,
    ordersToday,
    ordersThisMonth,
    ordersTotal,
    revenueTodayResult,
    revenueThisMonthResult,
    revenueTotalResult,
    pendingServices,
    totalServices,
    pendingDiagnoses,
    totalDiagnoses,
    claimsToday,
    totalNotes,
    publishedNotes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.membership.count({ where: { status: 'active', plan: 'free' } }),
    prisma.membership.count({ where: { status: 'active', plan: { not: 'free' } } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { paidAmount: true },
      where: { createdAt: { gte: today }, status: { in: ['paid', 'completed'] } },
    }),
    prisma.order.aggregate({
      _sum: { paidAmount: true },
      where: { createdAt: { gte: monthStart }, status: { in: ['paid', 'completed'] } },
    }),
    prisma.order.aggregate({
      _sum: { paidAmount: true },
      where: { status: { in: ['paid', 'completed'] } },
    }),
    prisma.serviceRequest.count({ where: { status: 'submitted' } }),
    prisma.serviceRequest.count(),
    prisma.livingDiagnosis.count({ where: { status: 'submitted' } }),
    prisma.livingDiagnosis.count(),
    prisma.resourceClaim.count({ where: { claimedAt: { gte: today } } }),
    prisma.note.count(),
    prisma.note.count({ where: { visibility: 'PUBLIC' } }),
    prisma.project.count({ where: { status: 'active' } }),
    prisma.project.count(),
  ])

  return {
    users: {
      total: totalUsers,
      today: usersToday,
      thisMonth: usersThisMonth,
    },
    members: {
      active: activeMembersFree + activeMembersCreator,
      free: activeMembersFree,
      creator: activeMembersCreator,
    },
    orders: {
      today: ordersToday,
      thisMonth: ordersThisMonth,
      total: ordersTotal,
    },
    revenue: {
      today: revenueTodayResult._sum.paidAmount ?? 0,
      thisMonth: revenueThisMonthResult._sum.paidAmount ?? 0,
      total: revenueTotalResult._sum.paidAmount ?? 0,
    },
    services: {
      pending: pendingServices,
      total: totalServices,
    },
    diagnoses: {
      pending: pendingDiagnoses,
      total: totalDiagnoses,
    },
    resources: {
      claimsToday,
    },
    notes: {
      total: totalNotes,
      published: publishedNotes,
    },
    projects: {
      active: activeProjects,
      total: totalProjects,
    },
  }
  } catch {
    // Prisma 数据库不可用时返回空
    return {
      users: { total: 0, today: 0, thisMonth: 0 },
      members: { active: 0, free: 0, creator: 0 },
      orders: { today: 0, thisMonth: 0, total: 0 },
      revenue: { today: 0, thisMonth: 0, total: 0 },
      services: { pending: 0, total: 0 },
      diagnoses: { pending: 0, total: 0 },
      resources: { claimsToday: 0 },
      notes: { total: 0, published: 0 },
      projects: { active: 0, total: 0 },
    }
  }
}

function getCodeStats() {
  const root = projectRoot()

  const pages = cached('code-pages', () => {
    const appDir = path.join(root, 'app')
    if (!fs.existsSync(appDir)) return 0
    let count = 0
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const e of entries) {
        if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'api' && e.name !== 'admin') {
          const full = path.join(dir, e.name)
          if (fs.existsSync(path.join(full, 'page.tsx'))) count += 1
          walk(full)
        }
      }
    }
    walk(appDir)
    return count
  })

  const components = cached('code-components', () =>
    countFilesRecursive(path.join(root, 'components'))
  )
  const apiRoutes = cached('code-apiRoutes', () =>
    countFilesRecursive(path.join(root, 'app', 'api'))
  )
  const dataFiles = cached('code-dataFiles', () =>
    countFilesRecursive(path.join(root, 'data'))
  )

  // Prisma 模型数
  const prismaModels = cached('code-prismaModels', () => {
    try {
      const schemaPath = path.join(root, 'prisma', 'schema.prisma')
      if (!fs.existsSync(schemaPath)) return 0
      const content = fs.readFileSync(schemaPath, 'utf8')
      return (content.match(/^model\s+\w+/gm) || []).length
    } catch {
      return 0
    }
  })

  // 项目级文件统计
  const tsFiles = cached('code-tsFiles', () => countTsFiles(root))
  const mjsFiles = cached('code-mjsFiles', () => {
    try {
      const result = execSync(
        `find "${root}" -name "*.mjs" -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null | wc -l`,
        { encoding: 'utf8', timeout: 5000 }
      )
      return parseInt(result.trim(), 10) || 0
    } catch {
      return 0
    }
  })
  const mdFiles = cached('code-mdFiles', () => {
    try {
      const result = execSync(
        `find "${root}" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null | wc -l`,
        { encoding: 'utf8', timeout: 5000 }
      )
      return parseInt(result.trim(), 10) || 0
    } catch {
      return 0
    }
  })

  return {
    pages,
    components,
    apiRoutes,
    prismaModels,
    dataFiles,
    tsFiles,
    mjsFiles,
    mdFiles,
  }
}

function countTsFiles(root: string): number {
  try {
    let count = 0
    const walk = (dir: string) => {
      let entries: fs.Dirent[]
      try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
      for (const e of entries) {
        if (e.isDirectory()) {
          if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue
          walk(path.join(dir, e.name))
        } else if (e.name.endsWith('.ts') || e.name.endsWith('.tsx')) {
          count += 1
        }
      }
    }
    walk(root)
    return count
  } catch {
    return 0
  }
}

function getGitStats() {
  return cached('git-stats', () => {
    try {
      const root = projectRoot()
      const commits = execSync(
        `cd "${root}" && git log --oneline --since="2026-01-01" 2>/dev/null | wc -l`,
        { encoding: 'utf8', timeout: 10000 }
      )
      const days = execSync(
        `cd "${root}" && git log --format="%ad" --date=short --since="2026-01-01" 2>/dev/null | sort | uniq | wc -l`,
        { encoding: 'utf8', timeout: 10000 }
      )
      return {
        commitsThisYear: parseInt(commits.trim(), 10) || 0,
        activeDays: parseInt(days.trim(), 10) || 0,
      }
    } catch {
      return { commitsThisYear: 0, activeDays: 0 }
    }
  })
}

async function getPipelineStats() {
  // 检查飞书连接状态
  const feishuConnected = cached('pipeline-feishu', () => {
    const manifestPath = path.join(projectRoot(), 'ops', 'zeno-lark', 'manifest.json')
    return fs.existsSync(manifestPath)
  })

  let drafts = {
    pendingDrafts: 0,
    approvedDrafts: 0,
    publishedDrafts: 0,
    totalDrafts: 0,
  }

  try {
    const [
      pendingDrafts,
      approvedDrafts,
      publishedDrafts,
      totalDrafts,
    ] = await Promise.all([
      prisma.websiteContentDraft.count({ where: { approvalStatus: 'pending' } }),
      prisma.websiteContentDraft.count({ where: { approvalStatus: 'approved' } }),
      prisma.websiteContentDraft.count({ where: { status: 'published' } }),
      prisma.websiteContentDraft.count(),
    ])
    drafts = {
      pendingDrafts,
      approvedDrafts,
      publishedDrafts,
      totalDrafts,
    }
  } catch {
    // Prisma 不可用时返回空
  }

  return {
    feishuConnected,
    ...drafts,
  }
}

// ─── 主入口 ────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [business, pipeline] = await Promise.all([
      getBusinessStats(),
      getPipelineStats(),
    ])

    const website = getWebsiteStats()
    const content = getContentStats()
    const code = getCodeStats()
    const git = getGitStats()

    return {
      generatedAt: new Date().toISOString(),
      website,
      content,
      business,
      code,
      git,
      pipeline,
      platforms: {
        website: { status: 'live', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zenoaihome.com' },
        wechatOA: { status: 'manual' },
        xiaohongshu: { status: 'manual' },
        douyin: { status: 'manual' },
      },
    }
  } catch (error) {
    // 任何一个数据源崩溃都不影响页面渲染
    console.error('Dashboard stats failed:', error)
    return {
      generatedAt: new Date().toISOString(),
      website: {
        articles: { total: 0, byCategory: [] },
        latestArticles: [],
        categories: 0,
        seo: { totalSlugs: 0, articlesLast30Days: 0 },
      },
      content: {
        totalMdFiles: 0, rawMaterials: 0,
        contentUnits: { total: 0, byType: {} },
        methodCards: 0, themeMaps: 0, assemblies: 0,
        templates: 0, scripts: 0,
        processingQueue: 0, processed: 0,
        externalKnowledge: 0, archive: 0,
      },
      business: {
        users: { total: 0, today: 0, thisMonth: 0 },
        members: { active: 0, free: 0, creator: 0 },
        orders: { today: 0, thisMonth: 0, total: 0 },
        revenue: { today: 0, thisMonth: 0, total: 0 },
        services: { pending: 0, total: 0 },
        diagnoses: { pending: 0, total: 0 },
        resources: { claimsToday: 0 },
        notes: { total: 0, published: 0 },
      },
      code: {
        pages: 0, components: 0, apiRoutes: 0,
        prismaModels: 0, dataFiles: 0,
        tsFiles: 0, mjsFiles: 0, mdFiles: 0,
      },
      git: { commitsThisYear: 0, activeDays: 0 },
      pipeline: {
        feishuConnected: false,
        pendingDrafts: 0, approvedDrafts: 0, publishedDrafts: 0, totalDrafts: 0,
      },
      platforms: {
        website: { status: 'unknown', url: '' },
        wechatOA: { status: 'unknown' },
        xiaohongshu: { status: 'unknown' },
        douyin: { status: 'unknown' },
      },
    }
  }
}
