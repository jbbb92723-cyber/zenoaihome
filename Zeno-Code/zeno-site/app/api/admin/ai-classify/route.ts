import { NextResponse } from 'next/server'

const CLASSIFY_PROMPT = `你是装修咨询分类助手。根据业主的问题内容，判断属于以下哪一类：

- quote_review: 报价相关的咨询（看报价、比价、审核报价单）
- contract_review: 合同相关的咨询（签合同、条款、法律风险）
- budget: 预算相关的咨询（预算够不够、多少钱、超预算）
- construction: 施工相关的咨询（施工质量、验收、已经开工了）
- living_diagnosis: 居住需求诊断（还没想好装什么、风格、户型规划）
- general: 综合咨询或不确定类型

只返回分类代码（如 quote_review），不要返回额外文字。`

export async function POST(request: Request) {
  try {
    const { message, serviceType } = await request.json()
    const text = message || serviceType || ''
    if (!text.trim()) {
      return NextResponse.json({ category: 'general' })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      // 无 API key：关键词规则匹配
      const t = text.toLowerCase()
      if (t.includes('报价') || t.includes('报价单') || t.includes('比价') || t.includes('价格')) return NextResponse.json({ category: 'quote_review' })
      if (t.includes('合同') || t.includes('签约') || t.includes('条款')) return NextResponse.json({ category: 'contract_review' })
      if (t.includes('预算') || t.includes('多少钱') || t.includes('超支') || t.includes('贵不贵')) return NextResponse.json({ category: 'budget' })
      if (t.includes('施工') || t.includes('验收') || t.includes('开工') || t.includes('工地')) return NextResponse.json({ category: 'construction' })
      if (t.includes('装修') || t.includes('风格') || t.includes('户型') || t.includes('设计')) return NextResponse.json({ category: 'living_diagnosis' })
      return NextResponse.json({ category: 'general' })
    }

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: CLASSIFY_PROMPT },
          { role: 'user', content: text.slice(0, 500) },
        ],
        temperature: 0.1,
        max_tokens: 20,
      }),
    })

    const data = await res.json()
    const category = data.choices?.[0]?.message?.content?.trim() || 'general'
    return NextResponse.json({ category })
  } catch (error) {
    console.error('Classify error:', error)
    return NextResponse.json({ category: 'general' })
  }
}
