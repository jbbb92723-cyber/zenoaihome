/**
 * pipeline/loading.tsx
 */

export default function PipelineLoading() {
  return (
    <div className="max-w-[1400px] space-y-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-[#252320] rounded" />
          <div className="h-6 w-32 bg-[#252320] rounded" />
        </div>
      </div>

      {/* 漏斗骨架 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 border border-[#3A3530] bg-[#1f1d1a] p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-16 bg-[#252320] rounded" />
              <div className="flex-1 h-7 bg-[#252320] rounded" />
            </div>
          ))}
        </div>
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#252320] rounded" />
          ))}
        </div>
      </div>

      {/* 表数据骨架 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border border-[#3A3530] bg-[#252320] px-5 py-4 space-y-2">
            <div className="h-3 w-12 bg-[#1f1d1a] rounded" />
            <div className="h-7 w-8 bg-[#1f1d1a] rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
