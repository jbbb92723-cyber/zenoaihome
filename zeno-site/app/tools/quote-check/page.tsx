import type { Metadata } from 'next'
import QuoteCheckClient from '@/components/quote-check/QuoteCheckClient'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'

export const metadata: Metadata = {
  title: '装修报价风险初筛工具｜看报价能不能承接方案边界',
  description:
    '填写装修报价信息，初步判断报价是否承接空间方案、材料工艺、范围边界、付款节点、验收标准和交付责任，并生成签约前追问清单。',
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
