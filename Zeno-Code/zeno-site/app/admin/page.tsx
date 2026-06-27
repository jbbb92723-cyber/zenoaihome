/**
 * app/admin/page.tsx
 * 管理入口 → 直接跳转数据看板
 */

import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/dashboard')
}
