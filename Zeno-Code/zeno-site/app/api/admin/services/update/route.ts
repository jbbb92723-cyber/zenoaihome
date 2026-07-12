import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { id, status, aiCategory, responseText } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: Record<string, unknown> = {}
    if (status) data.status = status
    if (aiCategory) data.aiCategory = aiCategory
    if (responseText !== undefined) {
      data.responseText = responseText
      data.reviewedAt = new Date()
    }

    await prisma.serviceRequest.update({ where: { id }, data })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Service update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
