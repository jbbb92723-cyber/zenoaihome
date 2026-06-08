/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠️ 重要：已移除 output: 'export'（静态导出）
  // 原因：Auth.js v5 需要服务端运行时才能处理 OAuth 回调和 Session
  //       API Routes（/api/auth, /api/comments, /api/orders, /api/payments）
  //       也需要 Node.js/Edge 运行时，无法在静态导出中使用。
  // 部署：继续使用 Vercel，Vercel 原生支持 Next.js 服务端功能。
  // 如需静态页面优化，可以在具体页面添加 export const dynamic = 'force-static'
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/ai',
        destination: '/living-diagnosis',
        permanent: true,
      },
      {
        source: '/services/ai-workflow',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/renovation',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/pricing/baojia-guide',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/en/pricing',
        destination: '/en/services',
        permanent: true,
      },
      {
        source: '/en/pricing/baojia-guide',
        destination: '/en/services',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
