import type { Metadata } from 'next'
import BudgetStructureClient from './BudgetStructureClient'

export const metadata: Metadata = {
  title: '预算结构工具 | ZenoAIHome',
  description: '输入总预算和房屋面积，把装修预算拆成硬装、主材、定制、设备、软装和缓冲，先看钱该怎么分。',
}

export default function BudgetStructurePage() {
  return <BudgetStructureClient />
}
