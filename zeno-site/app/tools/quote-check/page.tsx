import type { Metadata } from 'next'
import QuoteCheckClient from '@/components/quote-check/QuoteCheckClient'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'

export const metadata: Metadata = {
  title: '装修报价风险初筛工具｜检查漏项、暂估、按实结算和增项风险',
  description:
    '上传或填写装修报价信息，初步判断报价中是否存在漏项、材料型号不清、暂估、按实结算、另计和后期增项风险，并生成签约前追问清单。',
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
