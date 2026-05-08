import type { Metadata } from 'next'
import TileCalculatorClient from './TileCalculatorClient'

export const metadata: Metadata = {
  title: '瓷砖计算器 | ZenoAIHome',
  description: '输入铺贴面积和瓷砖规格，估算瓷砖片数、箱数和损耗，帮助普通业主先看清材料数量。',
}

export default function TileCalculatorPage() {
  return <TileCalculatorClient />
}
