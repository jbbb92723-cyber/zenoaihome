'use client'

import { usePathname } from 'next/navigation'
import AIChatWidget from './AIChatWidget'

/**
 * 路径级懒挂载。
 *
 * 业主主线保持干净：报价初筛、风险词典、检查模板、服务价格
 * 不再默认出现 AI 悬浮窗。
 */
const ALLOW_PREFIXES = [
  '/notes',
  '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai',
]

export default function ConditionalAIWidget() {
  const path = usePathname() ?? ''
  // /en 英文站全部屏蔽（widget 内部仅中文 quick entries）
  if (path.startsWith('/en')) return null
  const allowed = ALLOW_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))
  if (!allowed) return null
  return <AIChatWidget />
}
