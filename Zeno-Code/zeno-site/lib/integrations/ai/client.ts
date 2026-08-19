import { resolveAiTaskConfig, type AiTask } from './config'

export type AiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string | AiMessageContent[]
}

export type AiMessageContent =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

export type AiCompletionResult = {
  content: string
  provider: string
  model: string
  latencyMs: number
  usage: {
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
  }
}

export class AiProviderError extends Error {
  constructor(
    public readonly code: 'UPSTREAM_UNAVAILABLE' | 'UPSTREAM_REJECTED' | 'INVALID_RESPONSE',
    public readonly status?: number,
  ) {
    super(code)
    this.name = 'AiProviderError'
  }
}

function tokenValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export async function createAiChatCompletion(input: {
  task: AiTask
  messages: AiMessage[]
  temperature: number
  maxTokens: number
  timeoutMs: number
}): Promise<AiCompletionResult | null> {
  const config = resolveAiTaskConfig(input.task)
  if (!config) return null

  const startedAt = Date.now()
  let response: Response

  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: input.messages,
        temperature: Math.min(2, Math.max(0, input.temperature)),
        max_tokens: Math.min(4000, Math.max(1, input.maxTokens)),
        ...(config.provider === 'zhipu' ? {
          thinking: { type: 'enabled' },
          ...(config.model === 'glm-5.3' ? { reasoning_effort: 'low' } : {}),
        } : {}),
      }),
      signal: AbortSignal.timeout(Math.min(60_000, Math.max(1_000, input.timeoutMs))),
    })
  } catch {
    throw new AiProviderError('UPSTREAM_UNAVAILABLE')
  }

  if (!response.ok) {
    throw new AiProviderError('UPSTREAM_REJECTED', response.status)
  }

  const data = await response.json().catch(() => null)
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    throw new AiProviderError('INVALID_RESPONSE')
  }

  return {
    content: content.trim(),
    provider: config.provider,
    model: config.model,
    latencyMs: Date.now() - startedAt,
    usage: {
      inputTokens: tokenValue(data?.usage?.prompt_tokens),
      outputTokens: tokenValue(data?.usage?.completion_tokens),
      totalTokens: tokenValue(data?.usage?.total_tokens),
    },
  }
}
