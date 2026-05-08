import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import PaintCalculatorClient from './PaintCalculatorClient'

export const metadata: Metadata = {
  title: '乳胶漆计算器 | 底漆、面漆用量与桶数估算',
  description: '乳胶漆用量怎么算？输入墙面面积、涂布率、桶规格和遍数，估算底漆、面漆升数和桶数。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/paint-calculator',
  },
}

export default function PaintCalculatorPage() {
  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.paintCalculator)} />
      <PaintCalculatorClient />
    </>
  )
}
