import type { Metadata } from 'next'
import QuoteCheckClient from '@/components/quote-check/QuoteCheckClient'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'

export const metadata: Metadata = {
  title: '装修报价风险初筛 | ZenoAIHome',
  description: '不用懂装修术语。回答几个问题，判断这份报价里可能存在的漏项、模糊项和增项风险，并生成签约前追问清单。',
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
