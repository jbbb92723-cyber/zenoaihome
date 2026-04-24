import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Seeing the World from a Job Site — Zeno',
  description:
    'Construction sites are a compressed model of how the world actually works — through accountability, communication, and how people behave under pressure.',
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
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">Work · Human nature · Judgment</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug">
            Seeing the World from a Job Site
          </h1>
          <p className="text-sm text-ink-muted mt-4">By Zeno &nbsp;·&nbsp; 2025</p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="prose-zeno">
          <p>
            One summer, it rained for weeks. The site was hot, humid, the air thick with plaster dust and water vapor. I was overseeing the trim on some woodwork — a small-looking discrepancy that ended up pulling an entire wall into rework. Most people assume job sites are primarily technical problems. After enough time on site you realize: technique is just the entry ticket. What actually determines outcomes is something else: whether information is aligned, whether accountability is owned, whether each person is willing to face facts.
          </p>

          <p>
            A construction site is a compressed cross-section of how society actually works. Miss one note on the drawings — that&rsquo;s three extra days on site. Say &ldquo;good enough&rdquo; verbally — you end up with a result nobody&rsquo;s satisfied with. Everyone agrees in the meeting — each person executes a different interpretation. You learn quickly that &ldquo;cost&rdquo; isn&rsquo;t just money and time. It&rsquo;s also trust.
          </p>

          <p>
            I&rsquo;ve met many clients whose main concern at the start was price. Their main pain at the end was miscommunication. The most common complaint: &ldquo;I thought you guys already knew.&rdquo; Sounds like frustration. It&rsquo;s actually revealing something: we habitually treat &ldquo;I assumed&rdquo; as &ldquo;I communicated.&rdquo; On a job site the price is concrete — once you swing a hammer, there&rsquo;s no going back. In life and work the price is subtler, but just as real.
          </p>

          <p>
            So I became more process-minded — not because I love spreadsheets, but because process reduces misunderstanding. Which milestones require written confirmation. Which changes need version documentation. Which risks must be flagged in advance. Which responsibilities must be assigned by name. These feel &ldquo;bureaucratic,&rdquo; but they protect working relationships. The biggest drain between people isn&rsquo;t usually disagreement — it&rsquo;s opacity.
          </p>

          <p>
            Job sites also taught me: to understand someone, don&rsquo;t watch them when things go smoothly. Watch them under pressure. When something breaks, does their first instinct deflect or absorb? Do they start with excuses or with solutions? After long enough you notice human nature is never abstract. It shows up in the details, every single day.
          </p>

          <p>
            When I write, I&rsquo;m translating this &ldquo;site thinking&rdquo; into more general language. Renovation is the entry point, but what I&rsquo;m really trying to discuss is: how do we make decisions in uncertainty, stay clear in information noise, and choose between short-term incentives and long-term consequences? From that angle, a job site and the world are structurally the same — just different scales.
          </p>

          <p>
            Taking AI seriously is part of the same logic. AI helps me organize information faster, review decisions, build institutional memory. Before, complex project post-mortems would fade — important lessons left scattered in memory. Now I do structured debriefs and use AI to find recurring problems and improvement paths. But the more I use it, the more certain I am: tools at best help you &ldquo;see.&rdquo; Actually &ldquo;owning it&rdquo; is still a human job.
          </p>

          <p>
            One thing I keep reminding myself: on a site, the most dangerous state isn&rsquo;t &ldquo;many problems.&rdquo; It&rsquo;s &ldquo;everyone thinks there are no problems.&rdquo; As long as people are willing to name what&rsquo;s wrong, there&rsquo;s still a chance to fix it. Once people start self-soothing, the cost doesn&rsquo;t disappear — it just gets deferred.
          </p>

          <p>
            If the job site taught me one thing it would be this: don&rsquo;t fear complexity — first respect reality. Reality contains emotions, errors, competing interests, and people who make each other better. See all of it clearly, and you have a chance to do the work right, hold the relationships right, and walk the long path steadily.
          </p>

          <p>
            So I&rsquo;ll keep writing about job sites — not for industry gossip, not to manufacture anxiety, but because sites keep reminding me: every grand principle eventually lands on a small, specific action. If you&rsquo;re also navigating complex relationships, projects, or choices — welcome. Different industries, but the underlying problems are more shared than you&rsquo;d think.
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
