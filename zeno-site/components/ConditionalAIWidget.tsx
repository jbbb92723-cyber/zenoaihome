'use client'

import { usePathname } from 'next/navigation'
import AIChatWidget from './AIChatWidget'

/**
 * 路径级懒挂载——只在以下页面渲染 AI 助手悬浮窗：
 * - /ai 及其子路径
 * - /services/ai-workflow 及其子路径
 * - /notes 笔记区
 * - /blog/04-* AI 主题文章
 * - /tools/prompts 等 AI 相关工具
 *
 * 业主主线（首页/装修工具/价格/服务/blog 大部分）保持干净，
 * 不出现"我对一个 AI 助手失去信任"的副作用。
 */
const ALLOW_PREFIXES = [
  '/ai',
  '/services/ai-workflow',
  '/notes',
  '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai',
  '/tools/prompts',
  '/tools/content-brain',
]

export default function ConditionalAIWidget() {
  const path = usePathname() ?? ''
  // /en 英文站全部屏蔽（widget 内部仅中文 quick entries）
  if (path.startsWith('/en')) return null
  const allowed = ALLOW_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))
  if (!allowed) return null
  return <AIChatWidget />
}
