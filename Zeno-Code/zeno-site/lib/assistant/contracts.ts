export type AssistantPersona =
  | 'reviewer'
  | 'transformation-guide'
  | 'spark-recruiter'

export type AssistantCard = 'spark' | 'service' | 'archive'

export type ChatActionKind =
  | 'tool'
  | 'article'
  | 'resource'
  | 'service'
  | 'contact'
  | 'page'

export interface ChatAction {
  label: string
  href: string
  kind: ChatActionKind
}

export interface ChatResponse {
  reply: string
  bullets?: string[]
  actions?: ChatAction[]
  followUps?: string[]
  source: 'llm' | 'fallback'
  persona: AssistantPersona
  card?: AssistantCard
}
