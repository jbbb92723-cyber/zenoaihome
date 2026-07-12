'use client'

/**
 * app/admin/(protected)/dashboard/charts.tsx
 * 数字资产大屏 — recharts 图表组件
 * 独立文件（'use client'）避免污染服务端组件
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// ─── 文章分类分布柱状图 ──────────────────────────────────

interface CategoryDatum {
  name: string
  count: number
}

const CAT_COLORS = [
  '#C4A882', // gold
  '#68aeb0', // teal
  '#78b57b', // green
  '#d2846f', // coral
  '#9d978b', // muted
  '#6f6a61', // soft
  '#C4A882', // gold (repeat for 7th)
]

export function ArticleChart({ data }: { data: CategoryDatum[] }) {
  if (!data.length) {
    return <p className="text-sm text-[#706860] py-8 text-center">暂无文章数据</p>
  }

  // Sort descending, take top 7
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 7)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2825" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#706860', fontSize: 11 }}
          axisLine={{ stroke: '#3A3530' }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#A09890', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f1d1a',
            border: '1px solid #3A3530',
            borderRadius: 6,
            color: '#E8E2DA',
            fontSize: 12,
          }}
          cursor={{ fill: '#252320' }}
          formatter={(value) => [`${value} 篇`, '文章数']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
          {sorted.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CAT_COLORS[index % CAT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── 月度收入趋势（占位：当前无 DailyMetric 数据，展示空状态） ──

export function RevenueChart() {
  // 当前 DailyMetric 表为空，展示提示
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-3xl mb-2">📊</p>
        <p className="text-sm text-[#706860]">收入趋势图</p>
        <p className="text-xs text-[#504840] mt-1 max-w-[220px]">
          需要配置每日指标采集后自动生成。
          <br />
          当前 DailyMetric 表已就绪，等待数据写入。
        </p>
      </div>
    </div>
  )
}
