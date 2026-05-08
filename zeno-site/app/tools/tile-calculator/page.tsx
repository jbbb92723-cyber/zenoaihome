import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import TileCalculatorClient from './TileCalculatorClient'

export const metadata: Metadata = {
  title: '瓷砖计算器 | 瓷砖片数、箱数、损耗率估算',
  description: '瓷砖用量怎么算？输入铺贴面积、瓷砖规格和每箱片数，估算瓷砖片数、箱数和损耗。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/tile-calculator',
  },
}

export default function TileCalculatorPage() {
  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.tileCalculator)} />
      <TileCalculatorClient />
    </>
  )
}
