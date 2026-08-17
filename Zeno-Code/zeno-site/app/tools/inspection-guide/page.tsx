import type { Metadata } from 'next'
import StructuredData from '@/components/ui/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/tools/toolSeoAssets'
import InspectionGuideClient from './InspectionGuideClient'

export const metadata: Metadata = {
  title: '装修验收清单｜每个节点该看什么、拍什么',
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
