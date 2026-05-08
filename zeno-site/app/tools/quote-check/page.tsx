import type { Metadata } from 'next'
import QuoteCheckClient from '@/components/quote-check/QuoteCheckClient'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'

export const metadata: Metadata = {
  title: '装修报价初筛工具 | 漏项、增项、付款节点检查',
  description: '装修报价单怎么看？签合同前先检查漏项、工艺模糊、材料边界、增项流程和付款节点，全国业主都能用。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/quote-check',
  },
}

export default function QuoteCheckPage() {
  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.quoteCheck)} />
      <QuoteCheckClient />
    </>
  )
}
