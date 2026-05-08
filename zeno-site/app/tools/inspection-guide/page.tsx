import type { Metadata } from 'next'
import InspectionGuideClient from './InspectionGuideClient'

export const metadata: Metadata = {
  title: '验收节点向导 | ZenoAIHome',
  description: '按水电、防水、泥工、木作、油漆、安装和竣工节点，生成普通业主可执行的验收清单。',
}

export default function InspectionGuidePage() {
  return <InspectionGuideClient />
}
