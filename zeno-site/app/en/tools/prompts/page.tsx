'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import Link from 'next/link'

const scenarios = [
  {
    id: 'writing',
    label: 'Write long-form content',
    icon: '✍️',
    description: 'Generate structured prompts for articles, essays, or newsletters',
    prompt: (topic: string) => `You are a content creator with 16+ years of hands-on experience in renovation and real living. You write with judgment, not just information.

Help me write a long-form article on this topic:
${topic ? `Topic: ${topic}` : '[Enter your topic above]'}

Requirements:
1. Don't open with "In today's..." or "As we all know..." — start with a real situation or a direct observation
2. Include specific details from real experience, not abstract advice
3. Clear structure with 2-3 main sections
4. Ending that feels conclusive without being preachy
5. 700-1000 words, conversational but substantive
6. Avoid AI-speak: no "It's worth noting that", "It's undeniable that", etc.

Please provide an outline first, then write the full piece.`,
  },
  {
    id: 'renovation',
    label: 'Renovation decision help',
    icon: '🏠',
    description: 'Clarify renovation needs and prepare for contractor meetings',
    prompt: (topic: string) => `You are a practical renovation advisor helping a homeowner think clearly before talking to contractors.

My situation:
${topic ? topic : '[Describe your situation: apartment size, budget range, style direction, special needs]'}

Please help me:
1. Clarify my core needs in a prioritized checklist
2. List 5+ questions I must get clear answers to before signing anything
3. Name 3 risks I probably haven't thought of, with how to prevent them
4. Give me a short "opening script" for my first meeting with a contractor

Keep it direct, practical, and ready to use. Skip the filler.`,
  },
  {
    id: 'budget',
    label: 'Budget quote analysis',
    icon: '📊',
    description: 'Spot missing items and risks in renovation quotes',
    prompt: (topic: string) => `You are an experienced renovation professional helping analyze a quote document.

${topic ? `Quote information: ${topic}` : '[Paste the key items from your quote, or describe what you received]'}

Please analyze from these angles:
1. **Completeness check**: What's likely missing (waterproofing, surface prep, auxiliary materials, etc.)
2. **Price reasonableness**: Which line items look unusually high or low
3. **Risk items**: What vague descriptions could lead to price increases later
4. **Questions to ask**: 5 specific questions I should push back on
5. **Overall judgment**: Is this quote worth continuing to negotiate?

Be direct and honest. Don't sugarcoat the risks.`,
  },
  {
    id: 'content-topics',
    label: 'Content topic generation',
    icon: '💡',
    description: 'Find real, opinionated angles worth writing about',
    prompt: (topic: string) => `You are a content strategy advisor helping traditional industry practitioners find ideas worth writing about.

My background:
${topic ? topic : '[Describe your industry experience: e.g., 10+ years in renovation, specializing in residential projects]'}

Generate 10 content topics with these qualities:
1. Based on a real pain point, not generic industry overview
2. Takes a position, not a balanced "on one hand..." take
3. Could be developed into a 700-1500 word piece
4. Has a slightly counterintuitive or provocative angle
5. Covers different formats: avoid-this, here's-why, case-study, method

For each topic, give:
- Title
- Core argument in one sentence
- Best entry point (what real experience to open with)`,
  },
  {
    id: 'ai-for-trades',
    label: 'AI for traditional industries',
    icon: '🤖',
    description: 'Find where AI actually saves you time in your specific work',
    prompt: (topic: string) => `You are an advisor who helps traditional industry practitioners use AI for real work — no hype, no fearmongering.

My situation:
${topic ? topic : '[Describe your industry and daily workflow: e.g., building materials sales, lots of customer inquiries every day]'}

Please help me:
1. **Identify 3 real use cases** where AI can save significant time (must be actual repetitive tasks in your workflow)
2. **Give a concrete approach** for each: which tool, what kind of prompt, roughly how much time saved
3. **Flag 2 use cases that look useful but aren't** (save me from wasted effort)
4. **Recommend where to start** — the single lowest-risk, highest-payoff first step

Be honest about what AI can and can't do. I'm looking for genuine productivity, not inspiration content.`,
  },
]

export default function EnPromptPlaygroundPage() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0])
  const [userInput, setUserInput] = useState('')
  const [copied, setCopied] = useState(false)

  const generatedPrompt = activeScenario.prompt(userInput)

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border py-10 sm:py-12">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Tools</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Prompt Playground</h1>
          <p className="text-sm text-ink-muted mt-3 max-w-xl leading-relaxed">
            Pick a scenario, add your context, and copy a ready-to-use prompt for Claude or ChatGPT.
            No login required. No AI model called. Instant local generation.
          </p>
        </Container>
      </div>

      <Container size="content" className="py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Left: scenario + input */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Choose a scenario</p>
              <div className="space-y-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveScenario(s); setUserInput('') }}
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      activeScenario.id === s.id
                        ? 'border-stone bg-stone/5 text-stone'
                        : 'border-border text-ink-muted hover:border-stone/50 hover:text-ink'
                    }`}
                  >
                    <span className="mr-2">{s.icon}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                    <p className={`text-xs mt-1 ${activeScenario.id === s.id ? 'text-stone/70' : 'text-ink-faint'}`}>
                      {s.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                Add your specific context (optional)
              </p>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your situation to make the prompt more targeted…"
                rows={4}
                className="w-full border border-border bg-surface text-sm text-ink placeholder:text-ink-faint px-3 py-2.5 resize-none focus:outline-none focus:border-stone transition-colors"
              />
              <p className="text-xs text-ink-faint mt-1">
                Optional — the prompt has placeholder instructions if you leave this blank.
              </p>
            </div>
          </div>

          {/* Right: generated prompt */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest">Your prompt</p>
              <button
                onClick={handleCopy}
                className={`text-xs font-medium px-3 py-1.5 border transition-colors ${
                  copied
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-stone text-stone hover:bg-stone hover:text-white'
                }`}
              >
                {copied ? 'Copied ✓' : 'Copy prompt'}
              </button>
            </div>

            <div className="flex-1 border border-border bg-surface p-4 overflow-auto">
              <pre className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
                {generatedPrompt}
              </pre>
            </div>

            <div className="mt-4 p-4 border border-border bg-surface-warm">
              <p className="text-xs text-ink-muted leading-relaxed">
                <span className="font-semibold text-ink">How to use: </span>
                Copy the prompt above and paste it directly into{' '}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-stone hover:underline underline-offset-2">Claude</a>
                {' '}or{' '}
                <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-stone hover:underline underline-offset-2">ChatGPT</a>.
                These templates come from real workflows — use as-is or adapt for your situation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4">
          <Link href="/en/tools" className="text-sm text-stone hover:underline underline-offset-4 transition-colors">
            ← Back to all tools
          </Link>
          <Link href="/" className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 transition-colors">
            Visit Chinese site
          </Link>
        </div>
      </Container>
    </div>
  )
}
