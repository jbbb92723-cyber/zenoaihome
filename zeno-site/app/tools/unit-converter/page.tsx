import type { Metadata } from 'next'
import UnitConverterClient from './UnitConverterClient'

export const metadata: Metadata = {
  title: '单位换算工具 | ZenoAIHome',
  description: '装修常见面积、长度、单价换算，帮助普通业主看懂报价里的㎡、米、延米、坪和单方。',
}

export default function UnitConverterPage() {
  return <UnitConverterClient />
}
