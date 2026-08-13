import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { analyzeLivingDiagnosis } from '@/lib/living-diagnosis'
import { z } from 'zod'

const AnswerSchema = z.object({
  questionId: z.string().min(1).max(80),
  value:      z.string().min(1).max(120),
})

const Schema = z.object({
  stage:         z.string().max(80).optional().or(z.literal('')),
  city:          z.string().max(80).optional().or(z.literal('')),
  homeType:      z.string().max(80).optional().or(z.literal('')),
  area:          z.string().max(40).optional().or(z.literal('')),
  budgetRange:   z.string().max(80).optional().or(z.literal('')),
  contactName:   z.string().max(50).optional().or(z.literal('')),
  contactWechat: z.string().max(80).optional().or(z.literal('')),
  contactEmail:  z.string().email().optional().or(z.literal('')),
  answers:       z.array(AnswerSchema).min(1).max(20),
})

export async function POST(req: Request) {
  const session = await auth()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数校验失败', detail: parsed.error.flatten() }, { status: 422 })
  }

  const result = analyzeLivingDiagnosis(parsed.data.answers)

  try {
    const diagnosis = await prisma.$transaction(async (tx) => {
      const created = await tx.livingDiagnosis.create({
        data: {
          userId:        session?.user?.id ?? null,
          stage:         parsed.data.stage         || null,
          city:          parsed.data.city          || null,
          homeType:      parsed.data.homeType      || null,
          area:          parsed.data.area          || null,
          budgetRange:   parsed.data.budgetRange   || null,
          contactName:   parsed.data.contactName   || null,
          contactWechat: parsed.data.contactWechat || null,
          contactEmail:  parsed.data.contactEmail  || null,
          answers:       parsed.data.answers,
          result,
          status:        'submitted',
        },
      })

      await tx.analyticsEvent.create({
        data: {
          userId:   session?.user?.id ?? null,
          event:    'living_diagnosis_submitted',
          path:     '/living-diagnosis',
          metadata: {
            diagnosisId: created.id,
            primaryType: result.primaryType,
            riskLevel:   result.riskLevel,
          },
          userAgent: req.headers.get('user-agent') ?? null,
        },
      })

      return created
    })

    return NextResponse.json(
      { ok: true, persisted: true, diagnosisId: diagnosis.id, result },
      { status: 201 },
    )
  } catch (error) {
    console.error('[living-diagnosis] failed to persist diagnosis', error)
    return NextResponse.json(
      {
        ok: false,
        error: '诊断结果已生成，但系统暂时无法保存记录，请稍后重试。',
        persisted: false,
        diagnosisId: null,
        result,
      },
      { status: 503 },
    )
  }
}
