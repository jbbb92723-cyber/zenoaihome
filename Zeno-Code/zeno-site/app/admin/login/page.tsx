'use client'

import { useState } from 'react'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Container from '@/components/ui/Container'
import PasswordInput from '@/components/ui/PasswordInput'

function mapAuthError(error: string | null): string {
  if (!error) return ''
  switch (error) {
    case 'CredentialsSignin':
      return '邮箱或密码不正确，请重试。'
    case 'SessionRequired':
      return '请先登录后再访问该页面。'
    case 'Configuration':
      return '服务端配置异常，请稍后重试。'
    default:
      return '登录失败，请重试。'
  }
}

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [legacyPassword, setLegacyPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [legacyLoading, setLegacyLoading] = useState(false)

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('请输入管理员邮箱。')
      return
    }
    if (!password) {
      setError('请输入管理员密码。')
      return
    }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(mapAuthError(result.error))
        return
      }

      if (!result?.ok) {
        setError('登录失败，请重试。')
        return
      }

      const session = await getSession()
      const role = session?.user?.role?.toUpperCase()
      if (role !== 'ADMIN' && role !== 'OPERATOR') {
        await signOut({ redirect: false })
        setError('账号已登录，但还不是管理员角色。请先执行 `npm run admin:grant -- 你的邮箱`。')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('网络错误，请重试。')
    } finally {
      setLoading(false)
    }
  }

  async function handleLegacyLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!legacyPassword) {
      setError('请输入应急密码。')
      return
    }

    setLegacyLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: legacyPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '应急登录失败')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('网络错误，请重试。')
    } finally {
      setLegacyLoading(false)
    }
  }

  return (
    <Container size="content" className="py-section">
      <div className="mx-auto max-w-md">
        <div className="mb-10">
          <p className="page-label mb-3">管理后台</p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">管理员登录</h1>
          <p className="mt-3 text-sm text-ink-muted">
            优先使用管理员账户登录；旧共享密码只作为应急入口。
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <section className="mb-8 border border-border bg-surface/40 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-ink">管理员账户登录</h2>
            <p className="mt-1 text-xs text-ink-muted">
              先注册普通账号，再执行 `npm run admin:grant -- 邮箱` 授权为 ADMIN / OPERATOR。
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-ink-muted">管理员邮箱</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-stone focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-muted">管理员密码</label>
              <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="输入账号密码"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone/85 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录管理员账户'}
            </button>
          </form>
        </section>

        <section className="border border-border bg-surface/20 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-ink">应急入口</h2>
            <p className="mt-1 text-xs text-ink-muted">
              仅当 `ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET` 都已配置时可用，12 小时有效。
            </p>
          </div>

          <form onSubmit={handleLegacyLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-ink-muted">应急密码</label>
              <PasswordInput
                value={legacyPassword}
                onChange={e => setLegacyPassword(e.target.value)}
                placeholder="输入 ADMIN_PASSWORD"
              />
            </div>
            <button
              type="submit"
              disabled={legacyLoading}
              className="w-full border border-stone bg-transparent px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-warm disabled:opacity-50"
            >
              {legacyLoading ? '验证中...' : '使用应急密码登录'}
            </button>
          </form>
        </section>
      </div>
    </Container>
  )
}
