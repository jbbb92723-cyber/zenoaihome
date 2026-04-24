import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Why I Started Taking AI Seriously — Zeno',
  description:
    "AI isn't just for tech people. For practitioners in traditional industries, the real opportunity is augmenting judgment — not replacing it.",
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
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">AI · Work · Traditional industries</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug">
            Why I Started Taking AI Seriously
          </h1>
          <p className="text-sm text-ink-muted mt-4">By Zeno &nbsp;·&nbsp; 2025</p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="prose-zeno">
          <p>
            My first reaction to AI was skepticism. My feed was full of &ldquo;this tool just disrupted everything&rdquo; posts, and the repetition made me numb. I don&rsquo;t have a technical background, and I didn&rsquo;t trust the &ldquo;one prompt fixes all&rdquo; narrative. For me, any tool has to answer one question: can it actually help me do the real work I&rsquo;m doing right now?
          </p>

          <p>
            What made me take AI seriously wasn&rsquo;t a trend. It was pain. I was handling renovation consulting and project reviews while writing content simultaneously. My information was scattered everywhere: client conversations on WeChat, site notes on paper, ideas in voice memos, article outlines in a third document. Every day was busy, but I felt like huge amounts of time went into &ldquo;moving and repeating&rdquo; rather than into judgment and creation.
          </p>

          <p>
            I made the typical mistake at first. I collected &ldquo;universal prompts&rdquo; that looked impressive but felt off in use. They produced complete sentences — just not in my voice. They generated suggestions — just not for my situation. Eventually I understood: the problem wasn&rsquo;t the tools. I was treating them as an &ldquo;answer machine&rdquo; when they&rsquo;re actually a &ldquo;thinking partner.&rdquo;
          </p>

          <p>
            The shift happened when I started breaking my own workflow into stages. I mapped a complete task across phases: information gathering, structural organization, risk identification, written output, and post-mortem. Then I only brought in AI at the phase where it actually fit.
          </p>

          <p>
            After a client consultation: I write my core assessment first, then use AI to check for gaps. When writing an article: I nail down the core observation and experience first, then let AI help sharpen the structure and readability. After a project finishes: I feed in my notes and ask for a &ldquo;reusable checklist for next time.&rdquo; Working this way, efficiency improved — but more importantly, my thinking became more stable.
          </p>

          <p>
            People ask me what the biggest change from AI has been. Not &ldquo;speed.&rdquo; &ldquo;Clarity.&rdquo; Before, I had lots of experience but it was scattered. Now I&rsquo;m better at converting experience into method, and method into reusable assets. This matters especially for people like me who came up through sites and real projects. We&rsquo;re naturally strong at practice — but without a system, experience never compounds.
          </p>

          <p>
            The limits are just as important to state clearly. AI won&rsquo;t go to a site for you. It won&rsquo;t own the consequences of a wrong call. It won&rsquo;t build trust with an anxious client. It&rsquo;s good at processing information; not good at carrying relationships. Good at generating options; not good at making value judgments. My current stance: use it when it&rsquo;s useful, don&rsquo;t mythologize it, improve efficiency where possible, but don&rsquo;t outsource thinking.
          </p>

          <p>
            When I say &ldquo;take AI seriously,&rdquo; I really mean &ldquo;seriously upgrade yourself.&rdquo; In traditional industries we&rsquo;ve always relied on experience — and we still will. But how experience gets organized is changing. Whoever can structure their experience, clarify their expression, and systematize their workflow will have more agency. This isn&rsquo;t a threat to practitioners — it&rsquo;s an opening. The ones who understand both the domain and the tools become the rarest people in the room.
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
