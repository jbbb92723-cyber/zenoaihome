import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { buildToolStructuredData, toolSeoAssets } from '@/data/toolSeoAssets'
import BudgetStructureClient from './BudgetStructureClient'

export const metadata: Metadata = {
  title: '装修预算结构工具 | 预算分配比例与缓冲金规划',
  description: '装修预算怎么分配？输入总预算和房屋面积，把钱拆成硬装、主材、定制、设备、软装和缓冲金。',
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
