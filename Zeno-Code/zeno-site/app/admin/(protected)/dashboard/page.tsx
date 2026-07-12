/**
 * app/admin/(protected)/dashboard/page.tsx
 * Zeno 数字资产大屏 — 全貌控制室
 */

import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import { getDashboardStats } from '@/lib/dashboard-stats'
import StatCard from '@/components/admin/StatCard'
import BarList from '@/components/admin/BarList'

// recharts 依赖浏览器 API，禁用 SSR
const ArticleChart = dynamicImport(() => import('./charts').then((m) => ({ default: m.ArticleChart })), { ssr: false })
const RevenueChart = dynamicImport(() => import('./charts').then((m) => ({ default: m.RevenueChart })), { ssr: false })

export const metadata: Metadata = { title: '数字资产大屏 · Admin' }
export const dynamic = 'force-dynamic'

function yuan(cents: number) {
  return `¥${(cents / 100).toFixed(0)}`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function statusDot(ok: boolean) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${ok ? 'text-green-400' : 'text-[#d2846f]'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-400' : 'bg-[#d2846f]'}`} />
      {ok ? '在线' : '离线'}
    </span>
  )
}

function section(title: string, children: React.ReactNode) {
  return (
    <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
      <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const { website, content, business, code, git, pipeline, platforms, generatedAt } = stats

  return (
    <div className="max-w-[1400px] space-y-5">
      {/* ── 标题栏 ──────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">
            Admin · Digital Asset Control Room
          </p>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">
            数字资产大屏
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#706860] shrink-0">
          <span>刷新 {formatTime(generatedAt)}</span>
          <span className="text-[#504840]">|</span>
          <span>飞书 {statusDot(pipeline.feishuConnected)}</span>
        </div>
      </div>

      {/* ── 顶部 KPI 行 ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="网站文章"
          value={website.articles.total}
          subtitle={`${website.categories} 个分类`}
          tone="gold"
        />
        <StatCard
          label="内容素材"
          value={content.rawMaterials}
          subtitle="原始素材区"
          tone="teal"
        />
        <StatCard
          label="内容单元"
          value={content.contentUnits.total}
          subtitle={`SOL ${content.contentUnits.byType['SOL-方案'] ?? 0} · OPI ${content.contentUnits.byType['OPI-观点'] ?? 0}`}
          tone="green"
        />
        <StatCard
          label="选题装配"
          value={content.assemblies}
          subtitle="待发布/已发布"
          tone="coral"
        />
        <StatCard
          label="Obsidian MD"
          value={content.totalMdFiles}
          subtitle="全部 Markdown 资产"
          tone="neutral"
        />
        <StatCard
          label="总用户"
          value={business.users.total}
          subtitle={`今日 +${business.users.today}`}
          tone="gold"
        />
      </div>

      {/* ── 第二行 KPI ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="活跃会员"
          value={business.members.active}
          subtitle={`创作者 ${business.members.creator} · 免费 ${business.members.free}`}
          tone="teal"
        />
        <StatCard
          label="今日订单"
          value={business.orders.today}
          subtitle={business.revenue.today > 0 ? `收入 ${yuan(business.revenue.today)}` : '暂无收入'}
          tone="green"
        />
        <StatCard
          label="本月收入"
          value={yuan(business.revenue.thisMonth)}
          subtitle={`${business.orders.thisMonth} 笔订单`}
          tone="gold"
        />
        <StatCard
          label="网站页面"
          value={code.pages}
          subtitle={`${code.components} 组件 · ${code.apiRoutes} API`}
          tone="neutral"
        />
        <StatCard
          label="Git 提交"
          value={git.commitsThisYear}
          subtitle={`${git.activeDays} 个活跃日`}
          tone="coral"
        />
        <StatCard
          label="待审批草稿"
          value={pipeline.pendingDrafts}
          subtitle={pipeline.totalDrafts > 0 ? `共 ${pipeline.totalDrafts} 篇` : '暂无管道数据'}
          tone={pipeline.pendingDrafts > 0 ? 'coral' : 'neutral'}
        />
      </div>

      {/* ── 文章分类分布 ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {section(
          '📊 网站文章分类分布',
          <div>
            <div className="h-[260px]">
              <ArticleChart data={website.articles.byCategory} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {website.articles.byCategory.slice(0, 8).map((cat) => (
                <div key={cat.name} className="flex justify-between text-xs">
                  <span className="text-[#A09890] truncate mr-2">{cat.name}</span>
                  <span className="text-[#E8E2DA] font-mono">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {section(
          '📈 商业趋势（近 30 天）',
          <div className="h-[260px]">
            <RevenueChart />
          </div>
        )}
      </div>

      {/* ── 内容资产明细 + 商业汇总 ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {section(
          '📁 Obsidian 内容资产明细',
          <BarList
            items={[
              { label: '原始素材', value: content.rawMaterials, tone: 'teal' },
              { label: '方案单元 SOL', value: content.contentUnits.byType['SOL-方案'] ?? 0, tone: 'green', indent: true },
              { label: '观点单元 OPI', value: content.contentUnits.byType['OPI-观点'] ?? 0, tone: 'gold', indent: true },
              { label: '概念单元 CON', value: content.contentUnits.byType['CON-概念'] ?? 0, tone: 'neutral', indent: true },
              { label: '案例单元 CAS', value: content.contentUnits.byType['CAS-案例'] ?? 0, tone: 'coral', indent: true },
              { label: '问题单元 QUE', value: content.contentUnits.byType['QUE-问题'] ?? 0, tone: 'neutral', indent: true },
              { label: '选题装配', value: content.assemblies, tone: 'coral' },
              { label: '模板', value: content.templates, tone: 'neutral' },
              { label: '外部知识 EXT', value: content.externalKnowledge, tone: 'teal' },
              { label: '脚本', value: content.scripts, tone: 'neutral' },
              { label: '方法卡', value: content.methodCards, tone: 'gold' },
              { label: '主题地图', value: content.themeMaps, tone: 'green' },
              { label: '归档', value: content.archive, tone: 'neutral' },
            ]}
          />
        )}
        {section(
          '💼 商业与服务',
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3">
                <p className="text-xs text-[#706860]">本月新增用户</p>
                <p className="text-xl font-semibold text-[#E8E2DA]">{business.users.thisMonth}</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3">
                <p className="text-xs text-[#706860]">累计订单</p>
                <p className="text-xl font-semibold text-[#C4A882]">{business.orders.total}</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3">
                <p className="text-xs text-[#706860]">累计收入</p>
                <p className="text-xl font-semibold text-green-400">{yuan(business.revenue.total)}</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3">
                <p className="text-xs text-[#706860]">今日资料领取</p>
                <p className="text-xl font-semibold text-[#68aeb0]">{business.resources.claimsToday}</p>
              </div>
            </div>
            <BarList
              title="待处理"
              items={[
                { label: '服务申请', value: business.services.pending, tone: business.services.pending > 0 ? 'coral' : 'neutral' },
                { label: '居住诊断', value: business.diagnoses.pending, tone: business.diagnoses.pending > 0 ? 'coral' : 'neutral' },
                { label: '管道待审批', value: pipeline.pendingDrafts, tone: pipeline.pendingDrafts > 0 ? 'coral' : 'neutral' },
              ]}
            />
            <div className="text-xs text-[#706860] space-y-1">
              <div className="flex justify-between">
                <span>判断笔记</span>
                <span>{business.notes.total} 篇（{business.notes.published} 已发布）</span>
              </div>
              <div className="flex justify-between">
                <span>服务申请总数</span>
                <span>{business.services.total}</span>
              </div>
              <div className="flex justify-between">
                <span>居住诊断总数</span>
                <span>{business.diagnoses.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 代码资产 + 管道状态 ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {section(
          '🏗️ 代码资产',
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-[#E8E2DA]">{code.pages}</p>
                <p className="text-xs text-[#706860] mt-0.5">页面路由</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-[#C4A882]">{code.components}</p>
                <p className="text-xs text-[#706860] mt-0.5">组件</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-[#68aeb0]">{code.apiRoutes}</p>
                <p className="text-xs text-[#706860] mt-0.5">API 路由</p>
              </div>
            </div>
            <BarList
              items={[
                { label: 'TypeScript 文件', value: code.tsFiles, tone: 'teal' },
                { label: '数据文件', value: code.dataFiles, tone: 'gold' },
                { label: 'MJS 脚本', value: code.mjsFiles, tone: 'coral' },
                { label: 'Markdown 文档', value: code.mdFiles, tone: 'neutral' },
                { label: 'Prisma 模型', value: code.prismaModels, tone: 'green' },
              ]}
            />
            <div className="mt-4 text-xs text-[#706860] space-y-1">
              <div className="flex justify-between">
                <span>Git 提交 (2026)</span>
                <span className="text-[#E8E2DA]">{git.commitsThisYear}</span>
              </div>
              <div className="flex justify-between">
                <span>活跃天数</span>
                <span className="text-[#E8E2DA]">{git.activeDays}</span>
              </div>
              <div className="flex justify-between">
                <span>平均每次活跃提交</span>
                <span className="text-[#E8E2DA]">
                  {git.activeDays > 0 ? Math.round(git.commitsThisYear / git.activeDays) : 0}
                </span>
              </div>
            </div>
          </div>
        )}
        {section(
          '🔄 内容管道',
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-[#C4A882]">{pipeline.pendingDrafts}</p>
                <p className="text-xs text-[#706860] mt-0.5">待审批</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-green-400">{pipeline.approvedDrafts}</p>
                <p className="text-xs text-[#706860] mt-0.5">已审批</p>
              </div>
              <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-[#68aeb0]">{pipeline.publishedDrafts}</p>
                <p className="text-xs text-[#706860] mt-0.5">已发布</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#A09890]">飞书连接</span>
                {statusDot(pipeline.feishuConnected)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A09890]">草稿总数</span>
                <span className="text-[#E8E2DA]">{pipeline.totalDrafts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A09890]">待处理队列</span>
                <span className="text-[#E8E2DA]">{content.processingQueue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A09890]">已处理</span>
                <span className="text-[#E8E2DA]">{content.processed}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#3A3530]">
              <p className="text-xs text-[#706860] mb-2">处理进度</p>
              <div className="h-2 bg-[#141410] border border-[#2A2825] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C4A882] rounded-full min-w-[2px]"
                  style={{
                    width: `${content.processingQueue + content.processed > 0
                      ? Math.round((content.processed / (content.processingQueue + content.processed)) * 100)
                      : 0}%`,
                  }}
                />
              </div>
              <p className="text-[0.6rem] text-[#504840] mt-1 text-right">
                {content.processingQueue + content.processed > 0
                  ? Math.round((content.processed / (content.processingQueue + content.processed)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── SEO + 平台 ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {section(
          '🌐 SEO / GEO 健康度',
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
              <p className="text-2xl font-semibold text-[#E8E2DA]">{website.seo.totalSlugs}</p>
              <p className="text-xs text-[#706860] mt-0.5">可索引页面</p>
            </div>
            <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
              <p className="text-2xl font-semibold text-[#C4A882]">{website.articles.total}</p>
              <p className="text-xs text-[#706860] mt-0.5">文章页</p>
            </div>
            <div className="border border-[#3A3530] bg-[#252320] px-4 py-3 text-center">
              <p className="text-2xl font-semibold text-green-400">{website.seo.articlesLast30Days}</p>
              <p className="text-xs text-[#706860] mt-0.5">近 30 天新增</p>
            </div>
            <div className="col-span-3 mt-1 text-xs text-[#504840]">
              Google Search Console 暂未接入 · 显示的是站内 SEO 元数据健康度
            </div>
          </div>
        )}
        {section(
          '📱 平台账号',
          <div className="grid grid-cols-4 gap-3">
            <div className="border border-[#3A3530] bg-[#252320] px-3 py-3 text-center">
              <p className="text-lg mb-0.5">🏠</p>
              <p className="text-xs text-[#E8E2DA] font-semibold">网站</p>
              <p className="text-[0.6rem] text-green-400 mt-0.5">{platforms.website.status === 'live' ? '● 在线' : platforms.website.status}</p>
            </div>
            <div className="border border-[#3A3530] bg-[#252320] px-3 py-3 text-center">
              <p className="text-lg mb-0.5">📰</p>
              <p className="text-xs text-[#E8E2DA] font-semibold">公众号</p>
              <p className="text-[0.6rem] text-[#706860] mt-0.5">{platforms.wechatOA.status === 'manual' ? '手动' : platforms.wechatOA.status}</p>
            </div>
            <div className="border border-[#3A3530] bg-[#252320] px-3 py-3 text-center">
              <p className="text-lg mb-0.5">📕</p>
              <p className="text-xs text-[#E8E2DA] font-semibold">小红书</p>
              <p className="text-[0.6rem] text-[#706860] mt-0.5">{platforms.xiaohongshu.status === 'manual' ? '手动' : platforms.xiaohongshu.status}</p>
            </div>
            <div className="border border-[#3A3530] bg-[#252320] px-3 py-3 text-center">
              <p className="text-lg mb-0.5">🎵</p>
              <p className="text-xs text-[#E8E2DA] font-semibold">抖音</p>
              <p className="text-[0.6rem] text-[#706860] mt-0.5">{platforms.douyin.status === 'manual' ? '手动' : platforms.douyin.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── 最近文章 ────────────────────────────── */}
      {section(
        '📰 最近 10 篇文章',
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3530]">
                <th className="px-3 py-2 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold w-12">#</th>
                <th className="px-3 py-2 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">标题</th>
                <th className="px-3 py-2 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold w-28">分类</th>
                <th className="px-3 py-2 text-right text-xs text-[#706860] uppercase tracking-widest font-semibold w-28">日期</th>
              </tr>
            </thead>
            <tbody>
              {website.latestArticles.map((article, index) => (
                <tr
                  key={article.id}
                  className="border-b border-[#3A3530] last:border-0 hover:bg-[#2A2825] transition-colors"
                >
                  <td className="px-3 py-2.5 text-xs text-[#504840] font-mono">{article.id}</td>
                  <td className="px-3 py-2.5 text-xs text-[#E8E2DA] max-w-[420px] truncate">
                    {article.title}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[0.6rem] text-[#C4A882] bg-[#C4A882]/10 px-1.5 py-0.5">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-[#706860] text-right font-mono whitespace-nowrap">
                    {article.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 页脚 ────────────────────────────────── */}
      <p className="text-[0.6rem] text-[#504840] border-t border-[#3A3530] pt-4">
        数据来源：本地 articles.ts + Prisma 数据库 + Obsidian 文件系统 + Git 日志。
        文件系统统计缓存 5 分钟。飞书状态反映 manifest.json 是否存在。
      </p>
    </div>
  )
}
