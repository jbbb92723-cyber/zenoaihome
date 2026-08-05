'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdminActor } from '@/lib/admin'
import { createManualConstructionProject } from '@/lib/domains/projects/service'

const manualProjectSchema = z.object({
  name: z.string().trim().min(2).max(200),
  clientName: z.string().trim().max(100).optional(),
  clientPhone: z.string().trim().max(50).optional(),
  clientWechat: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  address: z.string().trim().max(500).optional(),
  area: z.coerce.number().positive().max(100_000).optional(),
  budgetYuan: z.coerce.number().min(0).max(100_000_000).optional(),
  homeType: z.string().trim().max(100).optional(),
  style: z.string().trim().max(100).optional(),
  source: z.string().trim().max(100).optional(),
  startedAt: z.string().trim().optional(),
})

function optionalDate(value?: string): Date | null {
  if (!value) return null
  const date = new Date(`${value}T12:00:00+08:00`)
  if (Number.isNaN(date.getTime())) throw new Error('日期格式无效')
  return date
}

function optionalValue(value?: string): string | null {
  return value || null
}

export async function createManualProjectAction(formData: FormData) {
  const actor = await requireAdminActor()
  const parsed = manualProjectSchema.parse({
    name: formData.get('name'),
    clientName: formData.get('clientName') || undefined,
    clientPhone: formData.get('clientPhone') || undefined,
    clientWechat: formData.get('clientWechat') || undefined,
    city: formData.get('city') || undefined,
    address: formData.get('address') || undefined,
    area: formData.get('area') || undefined,
    budgetYuan: formData.get('budgetYuan') || undefined,
    homeType: formData.get('homeType') || undefined,
    style: formData.get('style') || undefined,
    source: formData.get('source') || undefined,
    startedAt: formData.get('startedAt') || undefined,
  })

  const project = await createManualConstructionProject(
    {
      name: parsed.name,
      clientName: optionalValue(parsed.clientName),
      clientPhone: optionalValue(parsed.clientPhone),
      clientWechat: optionalValue(parsed.clientWechat),
      city: optionalValue(parsed.city),
      address: optionalValue(parsed.address),
      area: parsed.area ?? null,
      budget: parsed.budgetYuan === undefined ? null : Math.round(parsed.budgetYuan * 100),
      homeType: optionalValue(parsed.homeType),
      style: optionalValue(parsed.style),
      source: optionalValue(parsed.source) ?? 'manual-admin',
      startedAt: optionalDate(parsed.startedAt),
    },
    actor,
  )

  redirect(`/admin/projects/${project.id}`)
}
