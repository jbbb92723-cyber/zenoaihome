import type { Metadata } from 'next'
import PaintCalculatorClient from './PaintCalculatorClient'

export const metadata: Metadata = {
  title: '乳胶漆计算器 | ZenoAIHome',
  description: '输入墙面面积或房屋面积，估算底漆、面漆用量和桶数，避免普通业主只听商家口头估算。',
}

export default function PaintCalculatorPage() {
  return <PaintCalculatorClient />
}
