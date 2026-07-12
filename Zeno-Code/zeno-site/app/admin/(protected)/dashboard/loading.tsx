/**
 * dashboard/loading.tsx
 * 骨架屏 — 点击瞬间显示，数据到了自动替换
 */

export default function DashboardLoading() {
  return (
    <div className="max-w-[1400px] space-y-5 animate-pulse">
      {/* 标题栏骨架 */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-[#252320] rounded" />
          <div className="h-6 w-40 bg-[#252320] rounded" />
        </div>
        <div className="h-4 w-48 bg-[#252320] rounded" />
      </div>

      {/* KPI 行骨架 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-[#3A3530] bg-[#252320] px-5 py-4 space-y-2">
            <div className="h-3 w-16 bg-[#1f1d1a] rounded" />
            <div className="h-7 w-12 bg-[#1f1d1a] rounded" />
          </div>
        ))}
      </div>

      {/* 第二行 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-[#3A3530] bg-[#252320] px-5 py-4 space-y-2">
            <div className="h-3 w-16 bg-[#1f1d1a] rounded" />
            <div className="h-7 w-12 bg-[#1f1d1a] rounded" />
          </div>
        ))}
      </div>

      {/* 图表区骨架 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 h-[260px] flex items-center justify-center">
          <span className="text-sm text-[#504840]">加载中...</span>
        </div>
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 h-[260px] flex items-center justify-center">
          <span className="text-sm text-[#504840]">加载中...</span>
        </div>
      </div>

      {/* 明细区骨架 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 h-[400px]" />
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 h-[400px]" />
      </div>
    </div>
  )
}
