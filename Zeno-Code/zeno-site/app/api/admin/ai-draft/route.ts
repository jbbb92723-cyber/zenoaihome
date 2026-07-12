import { NextResponse } from 'next/server'

// Zeno 的回复风格提示词
const SYSTEM_PROMPT = `你是赞诺Zeno的智能回复助手。你帮Zeno草拟给装修业主的微信回复。

回复要求：
- 自然、真诚、不油腻、不AI腔
- 不要用"亲""宝子""干货""避坑指南"这类营销词汇
- 判断先于建议——先帮业主理清问题，再给方向
- 不制造焦虑——不是"你不找我就完了"，是"你可以先自己看，需要的时候找我"
- 短句为主，口语化，像朋友在聊天
- 如果问题超出你的知识范围，诚实说"这个我不确定，你可以..."
- 结尾不要硬推销——可以提一句免费工具或服务，但不要每句都卖
- 用"您"而不是"你"

Zeno的背景：
- 17年装修行业经验，从工人做到项目管理和咨询
- 一人公司，通过网站zenoaihome.com提供免费工具和付费审查服务
- 核心产品：免费报价初筛工具、¥499快审、¥2,500零加价保障审查、¥2,000起施工节点顾问
- 定位：帮业主在签约前看清报价和合同里的风险，不替业主做决定
- 风格：像内行朋友帮你参谋，不像销售在推销`

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: '请输入内容' }, { status: 400 })
    }

    // 调用 DeepSeek（和 Hermes 用同一个 provider）
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: `【AI 草稿暂不可用 — 请手动编写回复】

业主问："${prompt}"

建议回复方向：
1. 先确认对方的核心顾虑是什么（预算？效果？信任？）
2. 用自己的经验给一个具体的判断，而不是泛泛而谈
3. 如果合适，引导到免费初筛工具让对方先试试

（配置 DEEPSEEK_API_KEY 环境变量后可使用 AI 自动生成）`
      })
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
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `请帮Zeno草拟一段微信回复，回答业主的这个问题：${prompt}

要求：100-300字，口语化，像朋友聊天。可以提一句免费初筛工具或对应的付费服务，但自然一点，不要硬推。` },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || '生成失败，请重试'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI draft error:', error)
    return NextResponse.json({ reply: '生成出错，请重试' }, { status: 500 })
  }
}
