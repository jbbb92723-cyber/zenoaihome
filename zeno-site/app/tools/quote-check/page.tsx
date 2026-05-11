import type { Metadata } from 'next'
import QuoteCheckClient from '@/components/quote-check/QuoteCheckClient'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'

export const metadata: Metadata = {
  title: '签约前报价风险初筛工具 | 装修报价追问清单',
  description: '装修报价单别急着签。签约前先检查项目完整性、材料边界、工艺说明、增项流程和付款节点，生成风险等级和追问清单。',
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
