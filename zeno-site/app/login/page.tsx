/**
 * app/login/page.tsx
 *
 * 登录页面 — 四种登录方式占位 + IDC Flare 真实接入
 */

import type { Metadata } from 'next'
import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '登录',
  description: '登录 Zeno 赞诺，领取资料、查看提交记录、发表评论。公开内容不需要登录。',
  robots: { index: false },
}

const isIdcFlareConfigured =
  !!process.env.IDCFLARE_CLIENT_ID &&
  !!process.env.IDCFLARE_CLIENT_SECRET &&
  !!process.env.IDCFLARE_AUTHORIZATION_URL

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  const session = await auth()
  if (session?.user) {
    redirect(searchParams.callbackUrl ?? '/account')
  }

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'OAuth 登录初始化失败，请重试。',
    OAuthCallback: '登录回调出错，请检查 IDC Flare 回调地址配置。',
    OAuthCreateAccount: '创建账号时出错，请联系管理员。',
    Callback: '回调处理出错，请重试。',
    AccessDenied: '登录被拒绝。',
    Configuration: '认证配置错误，请联系管理员。',
    Default: '登录时发生未知错误，请重试。',
  }

  const errorMsg = searchParams.error
    ? (errorMessages[searchParams.error] ?? errorMessages.Default)
    : null

  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto">
        {/* 标题区 */}
        <div className="mb-10">
          <p className="page-label mb-3">登录</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            登录 Zeno 赞诺
          </h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            登录后可以领取资料、查看提交记录、发表评论，未来也可以访问会员内容。
            公开文章和网站内容不需要登录。
          </p>
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* 登录方式 */}
        <div className="space-y-4">

          {/* 微信登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-ink-faint shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.253 2 11.5c0 2.756 1.214 5.23 3.145 6.95L4.5 21.5l3.45-1.725A10.93 10.93 0 0 0 12 21c5.523 0 10-4.253 10-9.5S17.523 2 12 2zm0 17a8.93 8.93 0 0 1-3.775-.83l-.225-.112-2.3 1.15.59-2.065-.19-.183C4.443 15.57 3.5 13.63 3.5 11.5 3.5 6.806 7.262 3 12 3s8.5 3.806 8.5 8.5S16.738 19 12 19z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm font-semibold text-ink">微信登录</p>
              <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              适合微信生态用户，后续可用于小程序、公众号和资料领取。
            </p>
          </div>

          {/* 邮箱登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-ink-faint shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
              <p className="text-sm font-semibold text-ink">邮箱登录</p>
              <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              适合长期阅读和资料领取，后续可用于接收资料链接和通知。
            </p>
          </div>

          {/* 手机号登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-ink-faint shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <p className="text-sm font-semibold text-ink">手机号登录</p>
              <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              适合国内用户快速登录，后续用于服务申请和进度通知。
            </p>
          </div>

          {/* 分隔线 */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-faint">社区账号</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* IDC Flare 登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-stone font-semibold text-sm shrink-0">IDC</span>
              <p className="text-sm font-semibold text-ink">IDC Flare 登录</p>
              {!isIdcFlareConfigured && (
                <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
              )}
            </div>
            <p className="text-xs text-ink-muted leading-relaxed mb-3">
              如果你来自 IDC Flare / IF 社区，后续可以直接用社区账号进入本站。
            </p>
            {isIdcFlareConfigured ? (
              <form
                action={async () => {
                  'use server'
                  await signIn('idcflare', {
                    redirectTo: searchParams.callbackUrl ?? '/account',
                  })
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
                >
                  使用 IDC Flare 登录
                </button>
              </form>
            ) : (
              <p className="text-xs text-amber-600">IDC Flare OAuth 尚未配置</p>
            )}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-10 pt-6 border-t border-border space-y-3">
          <p className="text-xs text-ink-faint leading-relaxed">
            网站公开内容可以直接阅读，不需要登录。登录只是为了资料领取、评论等增强功能。
          </p>
          <p className="text-xs text-ink-faint leading-relaxed">
            我不会要求你重新注册一套账号，也不会向第三方出售你的信息。
          </p>
        </div>
      </div>
    </Container>
  )
}
