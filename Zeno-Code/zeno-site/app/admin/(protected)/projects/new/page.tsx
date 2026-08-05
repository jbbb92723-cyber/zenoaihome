import type { Metadata } from 'next'
import Link from 'next/link'
import { createManualProjectAction } from '@/lib/actions/projects'

export const metadata: Metadata = { title: '新建施工项目 · Admin' }

const INPUT = 'mt-2 w-full border border-[#3A3530] bg-[#252320] px-3 py-2.5 text-sm text-[#E8E2DA] outline-none focus:border-[#C4A882]'
const LABEL = 'text-xs font-semibold text-[#A09890]'

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <Link href="/admin/projects" className="text-xs text-[#706860] hover:text-[#C4A882]">
          ← 项目总览
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-[#E8E2DA]">新建施工项目</h1>
        <p className="mt-1 text-xs text-[#706860]">手动项目使用施工验收节点；其他服务项目应从商机协议创建。</p>
      </div>

      <form action={createManualProjectAction} className="border border-[#3A3530] bg-[#1f1d1a] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${LABEL} sm:col-span-2`}>项目名称
            <input name="name" required minLength={2} maxLength={200} placeholder="如：张先生 · 南宁 120㎡" className={INPUT} />
          </label>
          <label className={LABEL}>客户姓名
            <input name="clientName" maxLength={100} className={INPUT} />
          </label>
          <label className={LABEL}>开工日期
            <input name="startedAt" type="date" className={INPUT} />
          </label>
          <label className={LABEL}>电话
            <input name="clientPhone" type="tel" maxLength={50} className={INPUT} />
          </label>
          <label className={LABEL}>微信
            <input name="clientWechat" maxLength={100} className={INPUT} />
          </label>
          <label className={LABEL}>城市
            <input name="city" maxLength={100} defaultValue="南宁" className={INPUT} />
          </label>
          <label className={LABEL}>面积（㎡）
            <input name="area" type="number" min="0.01" step="0.01" className={INPUT} />
          </label>
          <label className={LABEL}>预算（元）
            <input name="budgetYuan" type="number" min="0" step="1" className={INPUT} />
          </label>
          <label className={LABEL}>户型 / 改造类型
            <input name="homeType" maxLength={100} placeholder="毛坯 / 旧房翻新 / 精装修改造" className={INPUT} />
          </label>
          <label className={LABEL}>风格
            <input name="style" maxLength={100} className={INPUT} />
          </label>
          <label className={LABEL}>来源
            <input name="source" maxLength={100} placeholder="微信 / 转介绍 / 线下" className={INPUT} />
          </label>
          <label className={`${LABEL} sm:col-span-2`}>项目地址
            <input name="address" maxLength={500} className={INPUT} />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3 border-t border-[#3A3530] pt-5">
          <Link href="/admin/projects" className="border border-[#504840] px-4 py-2.5 text-xs font-semibold text-[#A09890] hover:border-[#C4A882]">
            取消
          </Link>
          <button type="submit" className="bg-[#C4A882] px-4 py-2.5 text-xs font-semibold text-[#1C1A17] hover:bg-[#d2bb98]">
            创建项目
          </button>
        </div>
      </form>
    </div>
  )
}
