'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail]           = useState('')
  const [codeSent, setCodeSent]     = useState(false)
  const [countdown, setCountdown]   = useState(0)
  const [error, setError]           = useState('')
  const [emailDown, setEmailDown]   = useState(false)

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError('请输入邮箱')
      return
    }
    setError('')

    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), type: 'reset_password' }),
    })
    const data = await res.json()

    if (res.status === 503) {
      setEmailDown(true)
      return
    }
    if (!res.ok) {
      setError(data.error || '发送失败')
      return
    }

    setCodeSent(true)
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)

    // 跳转到重置页面
    setTimeout(() => {
      router.push(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`)
    }, 1500)
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-sm mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">忘记密码</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">找回密码</h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            输入注册邮箱，我们会发送验证码到你的邮箱。
          </p>
        </div>

        {emailDown && (
          <div className="mb-6 border border-stone-light bg-stone-pale/70 px-4 py-4 text-sm leading-relaxed text-ink">
            <p className="font-medium mb-1">邮件服务暂时不可用</p>
            <p className="text-xs opacity-80">邮箱验证服务正在维护中，暂时无法发送验证码。请稍后再试。</p>
          </div>
        )}
        {error && (
          <div className="mb-4 border border-ink/25 bg-stone-pale/70 px-4 py-3 text-sm text-ink">
            {error}
          </div>
        )}

        {codeSent && (
          <div className="mb-4 border border-stone-light bg-stone-pale/70 px-4 py-3 text-sm text-ink">
            验证码已发送，正在跳转...
          </div>
        )}

        <form onSubmit={sendCode} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={countdown > 0}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {countdown > 0 ? `已发送 (${countdown}s)` : '发送验证码'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-stone hover:underline underline-offset-2">
            ← 返回登录
          </Link>
        </div>
      </div>
    </Container>
  )
}
