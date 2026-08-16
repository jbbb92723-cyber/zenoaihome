'use client'

import { usePathname } from 'next/navigation'
import AIChatWidget from './AIChatWidget'

/**
 * AI 悬浮窗全站开放（2026-07-14）。
 *
 * 之前只允许 /notes 和一个博客页，注释写「业主主线保持干净」——
 * 装修工具页保留问答入口，用于帮助用户找到对应材料和服务边界。
 * 仅屏蔽 /admin 和 /en（英文站无中文 quick entries）。
 */
const BLOCK_PREFIXES = ['/admin']

export default function ConditionalAIWidget() {
  const path = usePathname() ?? ''
  // 英文站全部屏蔽（widget 内部仅中文 quick entries）
  if (path.startsWith('/en')) return null
  // 后台不显示
  if (BLOCK_PREFIXES.some((p) => path.startsWith(p))) return null
  return <AIChatWidget />
}
