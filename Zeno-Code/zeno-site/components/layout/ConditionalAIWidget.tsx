'use client'

import { usePathname } from 'next/navigation'
import AIChatWidget from './AIChatWidget'

/**
 * AI 悬浮窗在中文公开页面开放。
 *
 * 英文站、后台、账号与订单等私密流程不挂载助手，避免把敏感业务路径
 * 作为页面上下文发送给聊天接口。公开内容、工具、服务和共同体介绍页保留入口。
 */
const BLOCK_PREFIXES = [
  '/en',
  '/admin',
  '/account',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/order',
  '/community/apply',
]

function matchesPathPrefix(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`)
}

export default function ConditionalAIWidget() {
  const path = usePathname() ?? ''
  if (BLOCK_PREFIXES.some((prefix) => matchesPathPrefix(path, prefix))) return null
  return <AIChatWidget />
}
