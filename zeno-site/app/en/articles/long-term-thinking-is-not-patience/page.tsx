import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Long-term Thinking Is Not Patience — Zeno',
  description:
    'Long-term thinking is not about enduring discomfort. It is a design principle — structuring your decisions so they cost less in the future than they do today.',
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
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">Long-term thinking · Decisions · Living</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug">
            Long-term Thinking Is Not Patience
          </h1>
          <p className="text-sm text-ink-muted mt-4">By Zeno &nbsp;·&nbsp; 2025</p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="prose-zeno">
          <p>
            Most people, when they hear &ldquo;long-term thinking,&rdquo; picture gritting their teeth and enduring. Suppress your feelings. Delay satisfaction. Just stick it out. I thought roughly the same thing for a while — until a few costly lessons in construction and life made something clearer to me: real long-term thinking isn&rsquo;t endurance. It&rsquo;s design.
          </p>

          <p>
            Renovation has a classic mistake pattern: cut the upfront cost on a critical step with &ldquo;it should be fine.&rdquo; Skip a layer of waterproofing. Fudge the electrical layout. Choose materials based on unit price, ignoring maintenance and replacement cycles. Every one of these decisions looks sensible at the moment. Over time, the rework, friction, and relationship damage all arrive together. This taught me that short-term and long-term aren&rsquo;t time concepts — they&rsquo;re cost structures.
          </p>

          <p>
            The same logic holds for personal growth. We get hijacked by instant feedback: a trending topic, a viral post, a short-term windfall — &ldquo;grab it first, think later.&rdquo; The problem is that every time you drain your attention, reputation, or energy that way, what remains is exhaustion. Long-term thinking doesn&rsquo;t mean giving up the present. It means making fewer decisions today that damage your future.
          </p>

          <p>
            I now use three questions to assess whether something is worth doing: Does this build a reusable capability? Will it damage my most important relationships or rhythms? Three months from now, will I be glad I did it today? If I can&rsquo;t answer two of the three, I usually don&rsquo;t rush.
          </p>

          <p>
            Aesthetics is part of long-term thinking too. Most people think aesthetics is about expensive or trendy. For me, it&rsquo;s closer to an ordering ability: can you arrange space, time, and attention so that daily life feels less like friction? A home that has real aesthetic quality isn&rsquo;t one where every corner is perfect — it&rsquo;s one where the people living there don&rsquo;t have to fight their environment. A person with real aesthetic sense isn&rsquo;t always productive — they know when to move fast and when to slow down.
          </p>

          <p>
            Client relationships confirmed this. Short-term: extravagant promises win trust quickly. Long-term: only honest communication, milestone delivery, and owning mistakes when they happen builds relationships that compound. People don&rsquo;t ultimately remember your best lines. They remember whether you delivered when it counted.
          </p>

          <p>
            Taking AI seriously is doing the same thing. Not chasing novelty — using AI to reduce repetitive work and return that time to judgment and creation. I treat AI as leverage, not a crutch. What truly compounds over time is always your mental framework, your working habits, and your credibility.
          </p>

          <p>
            Looking back at my most effective changes over the past several years, none of them came from a sudden breakthrough. They came from a long series of small actions done right: notes written clearly, commitments stated specifically, reviews completed fully, attention kept on the people and things that actually matter.
          </p>

          <p>
            Long-term thinking, in the end, is a stack of small correct choices. Not heroic endurance. Design — of your decisions, your systems, and your time.
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
