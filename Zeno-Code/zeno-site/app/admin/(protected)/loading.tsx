/**
 * admin/(protected)/loading.tsx
 * 所有后台页面共用的骨架屏
 */

export default function AdminLoading() {
  return (
    <div className="max-w-5xl space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-[#252320] rounded" />
        <div className="h-6 w-36 bg-[#252320] rounded" />
      </div>

      {/* 模拟表格 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#3A3530]">
          <div className="h-4 w-48 bg-[#1f1d1a] rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-[#3A3530] last:border-0 flex items-center gap-4">
            <div className="h-4 w-20 bg-[#1f1d1a] rounded" />
            <div className="h-4 w-32 bg-[#1f1d1a] rounded" />
            <div className="h-4 w-24 bg-[#1f1d1a] rounded" />
            <div className="h-4 w-16 bg-[#1f1d1a] rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
