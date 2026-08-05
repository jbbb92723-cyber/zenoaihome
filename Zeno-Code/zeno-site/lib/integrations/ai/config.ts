export const AI_TASKS = ['public_chat', 'admin_draft', 'classification'] as const

export type AiTask = (typeof AI_TASKS)[number]
export type AiProviderId = 'deepseek' | 'openai' | 'custom'

export type AiTaskConfig = {
  task: AiTask
  provider: AiProviderId
  baseUrl: string
  apiKey: string
  model: string
}

const TASK_ENVIRONMENTS: Record<AiTask, { provider: string; model: string }> = {
  public_chat: { provider: 'AI_PUBLIC_CHAT_PROVIDER', model: 'AI_PUBLIC_CHAT_MODEL' },
  admin_draft: { provider: 'AI_ADMIN_DRAFT_PROVIDER', model: 'AI_ADMIN_DRAFT_MODEL' },
  classification: { provider: 'AI_CLASSIFICATION_PROVIDER', model: 'AI_CLASSIFICATION_MODEL' },
}

function normalizeProvider(value: string | undefined): AiProviderId | null {
  if (!value) return null
  const provider = value.trim().toLowerCase()
  if (provider === 'deepseek' || provider === 'openai' || provider === 'custom') {
    return provider
  }
  throw new Error(`不支持的 AI Provider：${provider}`)
}

function inferProvider(task: AiTask): AiProviderId | null {
  const taskEnvironment = TASK_ENVIRONMENTS[task]
  const explicit = normalizeProvider(
    process.env[taskEnvironment.provider] ?? process.env.AI_DEFAULT_PROVIDER,
  )
  if (explicit) return explicit

  if (process.env.AI_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY) return 'deepseek'
  if (process.env.AI_OPENAI_API_KEY) return 'openai'
  if (process.env.AI_CUSTOM_API_KEY) return 'custom'

  // 兼容现有公开聊天的 LLM_* 配置。
  if (task === 'public_chat' && process.env.LLM_API_KEY) return 'custom'
  return null
}

function normalizeBaseUrl(value: string): string {
  const url = new URL(value)
  if (
    !['http:', 'https:'].includes(url.protocol)
    || url.username
    || url.password
    || url.search
    || url.hash
  ) {
    throw new Error('AI Provider Base URL 必须是无内嵌凭据的 HTTP(S) 地址')
  }
  return url.toString().replace(/\/$/, '')
}

function providerValues(provider: AiProviderId, task: AiTask) {
  if (provider === 'deepseek') {
    return {
      apiKey: process.env.AI_DEEPSEEK_API_KEY
        ?? process.env.DEEPSEEK_API_KEY
        ?? (task === 'public_chat' ? process.env.LLM_API_KEY : undefined),
      baseUrl: process.env.AI_DEEPSEEK_BASE_URL
        ?? (task === 'public_chat' ? process.env.LLM_BASE_URL : undefined)
        ?? 'https://api.deepseek.com/v1',
      model: process.env.AI_DEEPSEEK_CHAT_MODEL ?? 'deepseek-chat',
    }
  }

  if (provider === 'openai') {
    return {
      apiKey: process.env.AI_OPENAI_API_KEY,
      baseUrl: process.env.AI_OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
      model: process.env.AI_OPENAI_CHAT_MODEL,
    }
  }

  return {
    apiKey: process.env.AI_CUSTOM_API_KEY
      ?? (task === 'public_chat' ? process.env.LLM_API_KEY : undefined),
    baseUrl: process.env.AI_CUSTOM_BASE_URL
      ?? (task === 'public_chat' ? process.env.LLM_BASE_URL : undefined),
    model: process.env.AI_CUSTOM_CHAT_MODEL
      ?? (task === 'public_chat' ? process.env.LLM_MODEL : undefined),
  }
}

export function resolveAiTaskConfig(task: AiTask): AiTaskConfig | null {
  const provider = inferProvider(task)
  if (!provider) return null

  const taskEnvironment = TASK_ENVIRONMENTS[task]
  const values = providerValues(provider, task)
  const model = process.env[taskEnvironment.model] ?? process.env.AI_DEFAULT_MODEL ?? values.model
  if (!values.apiKey || !values.baseUrl || !model) return null

  return {
    task,
    provider,
    baseUrl: normalizeBaseUrl(values.baseUrl),
    apiKey: values.apiKey,
    model,
  }
}

export function getAiTaskStatus(task: AiTask) {
  try {
    const config = resolveAiTaskConfig(task)
    return {
      task,
      configured: Boolean(config),
      provider: config?.provider ?? null,
      model: config?.model ?? null,
      configurationValid: true,
    }
  } catch {
    return {
      task,
      configured: false,
      provider: null,
      model: null,
      configurationValid: false,
    }
  }
}
