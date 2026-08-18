/** @type {import('next').NextConfig} */
const pausedMattressArticlePaths = [
  '/blog/chuangdian-bu-shi-yue-gui-yue-hao',
  '/blog/chuangdian-hangye-zhuangxiu-taolu',
  '/blog/shishui-shifenzhong-pianju',
  '/blog/chuangdian-cailiao-zhenxiang',
  '/blog/chuangdian-yong-sannian-ta',
  '/blog/chuangdian-xuangou-wu-ge-wenti',
  '/blog/duli-daizhuang-zhengtan-tanhuang',
  '/blog/chuangdian-chai-jie-limian',
  '/blog/chuangdian-tuihuo-zhengce',
  '/en/blog/mattress-not-about-price',
  '/en/blog/mattress-renovation-same-pricing-tricks',
  '/en/blog/ten-minute-sleep-trial-lie',
  '/en/blog/mattress-materials-marketing-vs-reality',
  '/en/blog/mattress-sags-after-three-years',
]

const nextConfig = {
  // ⚠️ 重要：已移除 output: 'export'（静态导出）
  // 原因：Auth.js v5 需要服务端运行时才能处理 OAuth 回调和 Session
  //       API Routes（/api/auth, /api/comments, /api/orders, /api/payments）
  //       也需要 Node.js/Edge 运行时，无法在静态导出中使用。
  // 部署：继续使用 Vercel，Vercel 原生支持 Next.js 服务端功能。
  // 如需静态页面优化，可以在具体页面添加 export const dynamic = 'force-static'
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      ...pausedMattressArticlePaths.map((source) => ({
        source,
        destination: '/mattress',
        permanent: true,
      })),
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
        source: '/consulting',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/services/quote-standard',
        destination: '/services/quote-review',
        permanent: true,
      },
      {
        source: '/knowledge',
        destination: '/opc-knowledge',
        permanent: true,
      },
      {
        source: '/pricing/baojia-guide',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/tools/content-brain',
        destination: '/tools/quote-check',
        permanent: true,
      },
      {
        source: '/tools/prompts',
        destination: '/tools/quote-check',
        permanent: true,
      },
      {
        source: '/en/tools/prompts',
        destination: '/en/tools',
        permanent: true,
      },
      {
        source: '/en/articles/why-i-started-learning-ai',
        destination: '/en/blog/why-i-started-taking-ai-seriously',
        permanent: true,
      },
      {
        source: '/en/resources',
        destination: '/en/tools',
        permanent: true,
      },
      {
        source: '/en/topics',
        destination: '/en/tools',
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
      {
        source: '/blog/article-02-03',
        destination: '/blog/article-04-02',
        permanent: true,
      },
      {
        source: '/blog/gongdi-guanlike',
        destination: '/blog/03-cong-gongdi-kan-shijie',
        permanent: true,
      },
      {
        source: '/blog/yiren-gongsi-shijian-guanli',
        destination: '/blog/yiren-gongsi-bu-shi-yigeren-ganhuo',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
