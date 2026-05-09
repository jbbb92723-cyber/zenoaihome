'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Service } from '@/data/services'

interface FormState {
  serviceType: string
  name: string
  phone: string
  wechat: string
  email: string
  materialLink: string
  preferredTime: string
  message: string
}

const emptyForm: FormState = {
  serviceType: 'qianyue-qian-juece-bao',
  name: '',
  phone: '',
  wechat: '',
  email: '',
  materialLink: '',
  preferredTime: '',
  message: '',
}

export default function ServiceRequestForm({ services }: { services: Service[] }) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'login' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const serviceType = new URLSearchParams(window.location.search).get('service')
    if (!serviceType || !services.some((service) => service.slug === serviceType)) return
    setForm((previous) => ({ ...previous, serviceType }))
  }, [services])

  function update(key: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }))
    setStatus('idle')
    setError('')
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('请先填写姓名或称呼。')
      return
    }
    if (!form.phone.trim() && !form.wechat.trim() && !form.email.trim()) {
      setError('请至少填写一个联系方式。')
      return
    }

    const messageParts = [
      form.message.trim(),
      form.materialLink.trim() ? `材料链接或说明：${form.materialLink.trim()}` : '',
      form.preferredTime.trim() ? `希望沟通时间：${form.preferredTime.trim()}` : '',
    ].filter(Boolean)

    setStatus('loading')
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: form.serviceType,
          name: form.name.trim(),
          phone: form.phone.trim(),
          wechat: form.wechat.trim(),
          email: form.email.trim(),
          message: messageParts.join('\n\n').slice(0, 1000),
        }),
      })

      if (response.status === 401) {
        setStatus('login')
        return
      }

      if (!response.ok) {
        setStatus('error')
        setError('提交失败，请检查信息后稍后再试。')
        return
      }

      setStatus('success')
      setForm((previous) => ({ ...emptyForm, serviceType: previous.serviceType }))
    } catch {
      setStatus('error')
      setError('网络异常，请稍后再试。')
    }
  }

  return (
    <form onSubmit={submit} className="border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink sm:col-span-2">
          你想提交哪类服务
          <select
            value={form.serviceType}
            onChange={(event) => update('serviceType', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
          >
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>{service.title} · {service.price}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-ink">
          姓名或称呼
          <input
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="怎么称呼你"
          />
        </label>

        <label className="text-sm font-medium text-ink">
          微信
          <input
            value={form.wechat}
            onChange={(event) => update('wechat', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="优先填写"
          />
        </label>

        <label className="text-sm font-medium text-ink">
          手机
          <input
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="可选"
          />
        </label>

        <label className="text-sm font-medium text-ink">
          邮箱
          <input
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="可选"
          />
        </label>

        <label className="text-sm font-medium text-ink sm:col-span-2">
          材料链接或说明
          <input
            value={form.materialLink}
            onChange={(event) => update('materialLink', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="网盘链接、报价单说明、户型图说明等。暂不做站内文件上传。"
          />
        </label>

        <label className="text-sm font-medium text-ink sm:col-span-2">
          希望沟通时间
          <input
            value={form.preferredTime}
            onChange={(event) => update('preferredTime', event.target.value)}
            className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="例如：工作日晚上 / 周末上午"
          />
        </label>

        <label className="text-sm font-medium text-ink sm:col-span-2">
          你现在最卡的地方
          <textarea
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
            className="mt-2 min-h-32 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none focus:border-stone"
            placeholder="尽量用事实描述：现在处于什么阶段、手里有什么材料、最担心什么。"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {status === 'success' && <p className="mt-4 text-sm text-stone">已提交。你可以在用户中心保留这条服务申请记录。</p>}
      {status === 'login' && (
        <p className="mt-4 text-sm text-ink-muted">
          提交服务需求需要先登录。<Link href="/login" className="text-stone underline underline-offset-4">去登录</Link>
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 disabled:bg-stone/35"
        >
          {status === 'loading' ? '提交中...' : '提交服务需求'}
        </button>
        <p className="text-xs leading-relaxed text-ink-muted">
          不卖材料，不拿返点，只站在业主这一边。
        </p>
      </div>
    </form>
  )
}
