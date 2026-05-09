import type { Metadata } from 'next'
import { auth } from '@/auth'
import ContentBrainClient from './ContentBrainClient'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import { canAccessServer } from '@/lib/permissions'

export const metadata: Metadata = {
  title: '内容诊断大脑 | 创作会员发布前审稿台',
  description:
    '面向创作会员的内容诊断工具：检查选题、文字洁癖、表达效率、认知落差和站内转化路径，把经验沉淀成网站资产。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/content-brain',
  },
}

export default async function ContentBrainPage() {
  const session = await auth()
  const canUseTool = await canAccessServer(session?.user, 'creator_member')

  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.contentBrain)} />
      <ContentBrainClient canUseTool={canUseTool} isLoggedIn={!!session?.user} />
    </>
  )
}
