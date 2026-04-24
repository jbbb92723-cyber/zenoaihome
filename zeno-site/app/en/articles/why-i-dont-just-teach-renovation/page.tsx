import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: "Why I Don't Want to Be Just a Renovation Blogger — Zeno",
  description:
    'What started as renovation writing became something broader — about living, judgment, and long-term thinking.',
}

export default function ArticlePage() {
  return (
    <>
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="reading">
          <nav className="flex items-center gap-2 mb-6 text-xs text-ink-muted">
            <Link href="/en" className="hover:text-stone transition-colors">EN Home</Link>
            <span>/</span>
            <Link href="/en/articles" className="hover:text-stone transition-colors">Articles</Link>
            <span>/</span>
            <span className="text-stone">This article</span>
          </nav>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">Renovation · Identity · Long-term thinking</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug">
            Why I Don&rsquo;t Want to Be Just a Renovation Blogger
          </h1>
          <p className="text-sm text-ink-muted mt-4">By Zeno &nbsp;·&nbsp; 2025</p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="prose-zeno">
          <p>
            A friend who&rsquo;s known me for years recently asked: &ldquo;So what exactly do you do now? Renovation? Content? AI?&rdquo;
            I used to answer quickly. Now I pause — because if I pick one label, I always feel like I&rsquo;m leaving out the most important part.
          </p>

          <p>
            I came up through renovation. In those early years my work was concrete: site visits, tracking milestones, reading blueprints, explaining to clients why budgets overrun, arguing with craftsmen about whether a 5mm gap matters. Back then I thought renovation was mainly about experience and craft — whoever was more precise won. Later I realized the technical problems are actually the easiest. The hard part is human relationships, judgment, and trade-offs.
          </p>

          <p>
            One memory stands out: a couple preparing to get married. They both said &ldquo;we&rsquo;re flexible&rdquo; at the design meeting, then suddenly erupted on inspection day. One wanted an open kitchen; the other insisted on enclosed. One wanted a bar counter for ambiance; the other worried about fumes and maintenance. They weren&rsquo;t fighting about renovation — they were fighting about what kind of life they wanted to live. That day I understood with unusual clarity: renovation looks like spatial transformation, but underneath it&rsquo;s a negotiation of values about living.
          </p>

          <p>
            Another time, a client came with a folder of reference photos — &ldquo;make it look exactly like these.&rdquo; The photos were beautiful: light, texture, proportion, all elegant. But after a few questions I learned: elderly parents lived with them full-time, two pre-school kids, high cooking frequency, regular work-from-home. The look could be achieved, but within three months of moving in, real life would devour it. Aesthetics isn&rsquo;t copying beautiful images into your home — it&rsquo;s making daily life feel smoother and more expansive.
          </p>

          <p>
            The longer I worked, the more certain I became: if I only &ldquo;teach renovation,&rdquo; I cut away the things that matter most. When clients come to me, they ask about budgets, circulation, materials — but their deeper anxiety is usually something else: Am I being manipulated by information? How do I judge who&rsquo;s trustworthy? Am I making decisions for my life, or for appearances? None of these can be answered by renovation tips alone.
          </p>

          <p>
            So I started writing. Awkwardly at first. Friends advised: &ldquo;Focus on construction details, that drives more traffic.&rdquo; They weren&rsquo;t wrong. But I knew I wanted to write more than that. I wanted to capture the human nature I saw on job sites — the collaboration, the accountability, the cost of decisions. I wanted to pull aesthetics back from &ldquo;what looks good&rdquo; to &ldquo;what fits your life.&rdquo; I wanted to explain things that seem unrelated to renovation but actually shape every decision: long-term thinking, attention, judgment.
          </p>

          <p>
            In the past two years I&rsquo;ve started taking AI seriously — not because it&rsquo;s trending, and not because I want to &ldquo;pivot to tech.&rdquo; I found it helps me systematize experience that used to scatter. A client consultation would leave records spread across WeChat, voice memos, paper notes, and memory. Now I structure those notes and use AI to compare versions, flag risks, and plan next steps. Writing an article used to mean rummaging through dozens of fragments; now I can thread them more quickly into something worth saying.
          </p>

          <p>
            But I&rsquo;m also clearer about what AI can&rsquo;t do. It won&rsquo;t go to the site and take responsibility. It won&rsquo;t judge what a family needs most right now. It won&rsquo;t make the decision that needs to be made in a conflict. Tools improve efficiency; they don&rsquo;t replace values.
          </p>

          <p>
            That&rsquo;s how I define myself now: starting from renovation, but not limited to it. Writing about space, and about people. Writing about methods, and about costs. Writing about what to do today, and how to walk the long path.
          </p>

          <p>
            If you came here only looking for an avoidance checklist, I&rsquo;ll give you one. But if you&rsquo;re willing to go one step further — to understand how I think and why — we might build something longer lasting.
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex items-center justify-between">
          <Link href="/en/articles" className="text-sm text-stone hover:underline underline-offset-2">
            ← All Articles
          </Link>
          <Link href="/en/about" className="text-sm text-stone hover:underline underline-offset-2">
            About Zeno →
          </Link>
        </div>
      </Container>
    </>
  )
}
