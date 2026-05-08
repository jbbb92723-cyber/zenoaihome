import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import InspectionGuideClient from './InspectionGuideClient'

export const metadata: Metadata = {
  title: '装修验收节点向导 | 水电、防水、泥工、油漆、竣工清单',
  description: '装修验收看什么？按水电、防水、泥工、木作、油漆、安装和竣工生成检查项、拍照点和风险信号。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/inspection-guide',
  },
}

export default function InspectionGuidePage() {
  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.inspectionGuide)} />
      <InspectionGuideClient />
    </>
  )
}
