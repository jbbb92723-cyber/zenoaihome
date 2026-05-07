import type { Metadata } from 'next'
import QuoteCheckClient from '@/components/quote-check/QuoteCheckClient'

export const metadata: Metadata = {
  title: '报价初筛工具 | ZenoAIHome',
  description: '上传装修报价单，先做一轮风险类型初筛，分清漏项、工艺模糊、增项边界和下一步追问。',
}

export default function QuoteCheckPage() {
  return <QuoteCheckClient />
}
