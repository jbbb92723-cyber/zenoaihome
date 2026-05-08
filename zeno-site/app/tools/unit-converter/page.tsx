import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import UnitConverterClient from './UnitConverterClient'

export const metadata: Metadata = {
  title: '装修单位换算工具 | 平方米、延米、坪、单方换算',
  description: '装修单位怎么看？换算平方米、米、延米、坪和单方，帮助业主看懂报价单位和工程量口径。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/unit-converter',
  },
}

export default function UnitConverterPage() {
  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.unitConverter)} />
      <UnitConverterClient />
    </>
  )
}
