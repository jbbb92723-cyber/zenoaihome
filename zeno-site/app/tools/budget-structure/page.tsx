import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import BudgetStructureClient from './BudgetStructureClient'

export const metadata: Metadata = {
  title: '装修预算分配工具 | 简约、舒适、精致三档拆预算',
  description: '装修预算怎么分配？按简约够住、舒适耐用、精致改善三种取向，输入总预算和面积，拆出基础施工、主材、收纳、设备、软装和预留机动。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/budget-structure',
  },
}

export default function BudgetStructurePage() {
  return (
    <>
      <StructuredData data={buildToolStructuredData(toolSeoAssets.budgetStructure)} />
      <BudgetStructureClient />
    </>
  )
}
