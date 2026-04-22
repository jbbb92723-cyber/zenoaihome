/**
 * lib/admin.ts
 *
 * 管理员身份判断
 * 根据当前登录用户邮箱与 ADMIN_EMAILS 环境变量对比。
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
 * 1. 必须已登录（session 存在且 user.email 不为空）
 * 2. 用户邮箱必须在 ADMIN_EMAILS 环境变量中（逗号分隔）
 * 3. 如果 ADMIN_EMAILS 未配置 → 永远返回 false，不开放管理员权限
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.email) return false

    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    // ADMIN_EMAILS 未配置时，拒绝所有人
    if (adminEmails.length === 0) return false

    return adminEmails.includes(session.user.email.toLowerCase())
  } catch {
    // 登录系统未配置或出错时，默认非管理员
    return false
  }
}
