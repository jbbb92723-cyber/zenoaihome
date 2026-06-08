'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import PasswordInput from '@/components/ui/PasswordInput'

export default function EnRegisterPage() {
  const router = useRouter()
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [code, setCode]             = useState('')
  const [codeSent, setCodeSent]     = useState(false)
  const [countdown, setCountdown]   = useState(0)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [emailDown, setEmailDown]   = useState(false)

  async function sendCode() {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setError('')

    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), type: 'register' }),
    })
    const data = await res.json()

    if (res.status === 503) {
      setEmailDown(true)
      return
    }
    if (!res.ok) {
      setError(data.error || 'Failed to send code.')
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password, code }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Registration failed.')
      setLoading(false)
      return
    }

    setSuccess('Account created! Redirecting to sign in…')
    setTimeout(() => router.push('/en/login'), 1500)
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-[28rem] mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">Register</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Create an account</h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            Register to download resources and leave comments.
          </p>
        </div>

        {emailDown && (
          <div className="mb-6 border border-stone-light bg-stone-pale/70 px-4 py-4 text-sm leading-relaxed text-ink">
            <p className="font-medium mb-1">Registration temporarily unavailable</p>
            <p className="text-xs opacity-80">
              The email verification service is currently under maintenance. Please try again later or{' '}
              <Link href="/en/about" className="underline underline-offset-2">contact Zeno</Link>.
            </p>
          </div>
        )}
        {error && (
          <div className="mb-4 border border-ink/25 bg-stone-pale/70 px-4 py-3 text-sm text-ink">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 border border-stone-light bg-stone-pale/70 px-4 py-3 text-sm text-ink">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Password</label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters, letters + numbers"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Confirm password</label>
            <PasswordInput
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="Type your password again"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Verification code</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="flex-1 text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
                placeholder="6-digit code"
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={countdown > 0 || emailDown}
                className="shrink-0 text-sm text-stone border border-stone/30 px-3 py-2 hover:bg-stone-pale/50 disabled:opacity-50 transition-colors"
              >
                {countdown > 0 ? `${countdown}s` : codeSent ? 'Resend' : 'Send code'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || emailDown}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-ink-muted">
            Already have an account?{' '}
            <Link href="/en/login" className="text-stone hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Container>
  )
}
