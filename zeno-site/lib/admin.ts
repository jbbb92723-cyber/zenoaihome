/**
 * lib/admin.ts
 *
 * 管理员身份判断
 *
 * 支持两种识别方式：
 *   1. ADMIN_EMAILS  — 按邮箱识别（逗号分隔，不区分大小写）
 *   2. ADMIN_USER_IDS — 按用户 ID 识别（逗号分隔）
 *      适用于 OAuth 返回隐私邮箱的情况
 *
 * 用法：
 *   import { isAdminUser } from '@/lib/admin'
 *   const isAdmin = await isAdminUser()
 */

import { auth } from '@/auth'

/**
 * 判断当前请求的登录用户是否为管理员。
 *
 * 规则：
 * 1. 必须已登录（session 存在）
 * 2. user.email 匹配 ADMIN_EMAILS（任一条件满足即可）
 *    OR user.id 匹配 ADMIN_USER_IDS
 * 3. ADMIN_EMAILS 和 ADMIN_USER_IDS 均未配置 → 永远返回 false
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user) return false

    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    const adminUserIds = (process.env.ADMIN_USER_IDS ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)

    // 两个名单都为空时，拒绝所有人
    if (adminEmails.length === 0 && adminUserIds.length === 0) return false

    // 按邮箱匹配
    if (session.user.email && adminEmails.includes(session.user.email.toLowerCase())) {
      return true
    }

    // 按用户 ID 匹配（适用于 OAuth 返回隐私邮箱的情况）
    if (session.user.id && adminUserIds.includes(session.user.id)) {
      return true
    }

    return false
  } catch {
    // 登录系统未配置或出错时，默认非管理员
    return false
  }
}
