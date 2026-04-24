import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'A Home Is Not a Showroom — Zeno',
  description:
    'The gap between what looks good in photos and what actually works for living. A perspective from the job site.',
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
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">Renovation · Aesthetics · Living</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug">
            A Home Is Not a Showroom
          </h1>
          <p className="text-sm text-ink-muted mt-4">By Zeno &nbsp;·&nbsp; 2025</p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="prose-zeno">
          <p>
            Over the years I&rsquo;ve heard many versions of &ldquo;the ideal home&rdquo;: clean, sophisticated, photogenic, the kind of place where guests walk in and immediately think you have taste. I understand those wishes — I share many of them. The problem is that people confuse &ldquo;looks like a home&rdquo; with &ldquo;lives like a home.&rdquo;
          </p>

          <p>
            A client once showed me over twenty reference photos. Nearly every one was stunning: open living rooms, unified color palettes, almost no sign of daily life. She wanted her home to &ldquo;always look like this.&rdquo; I didn&rsquo;t argue. I just asked a few practical questions: What time do you get home on weekdays? Who cooks? Where do the kids do homework on weekends? Will elderly parents be staying regularly? She paused — she hadn&rsquo;t thought about any of that. We scrapped the original scheme. The new design lost several &ldquo;photo-worthy&rdquo; features and gained a few &ldquo;frictionless to use&rdquo; details. Six months after moving in she messaged me: &ldquo;It finally feels like we&rsquo;re actually living here, not visiting.&rdquo;
          </p>

          <p>
            Showroom logic is addictive precisely because it delivers instant gratification. You see an image and immediately imagine: &ldquo;I could have this.&rdquo; The next decision tilts toward visual stimulus rather than long-term experience. But real life doesn&rsquo;t accommodate camera angles. The unwashed dishes after dinner, the homework spread across the table, the parcel left by the door, the relatives who drop by unannounced — these aren&rsquo;t failures of control. This is what a home actually looks like.
          </p>

          <p>
            When I design now, I keep reminding myself and my clients: answer &ldquo;how will you live here&rdquo; before answering &ldquo;how will it look.&rdquo;
          </p>

          <p>
            Circulation: pretty on paper isn&rsquo;t enough — the path you walk every day needs to feel effortless. Storage: more cabinets isn&rsquo;t always better — what matters is whether the things you reach for most often are easy to reach. Materials: expensive doesn&rsquo;t mean high quality — it means whether you&rsquo;re willing to maintain them long-term. Lighting: &ldquo;bright enough&rdquo; misses the point — can different times of day help people unwind?
          </p>

          <p>
            I&rsquo;m not against aesthetics. I believe aesthetics deserves serious attention. But aesthetics shouldn&rsquo;t stop at &ldquo;does this match a style.&rdquo; It should serve your life&rsquo;s rhythms and even your emotional state. A space&rsquo;s real beauty often comes from &ldquo;I don&rsquo;t have to fight this room,&rdquo; not from &ldquo;guests think it&rsquo;s impressive.&rdquo;
          </p>

          <p>
            Job sites made me see this truth early. No matter how perfect the drawings, what ultimately decides success or failure during construction and living is human behavior. Cut a critical step to save time — the rework costs more later. Force complex craftsmanship for appearances — the maintenance burden is enormous. Spend one more hour on a conversation upfront — it prevents weeks of conflict down the road. The final test of renovation isn&rsquo;t who can &ldquo;buy&rdquo; better, but who&rsquo;s willing to face reality honestly.
          </p>

          <p>
            I use AI in my workflow now — to help organize family needs, compare scheme variations, generate delivery checklists. It helps see more completely and miss less. But it can&rsquo;t replace on-site judgment, and it can&rsquo;t replace answering the question: &ldquo;What kind of life do you actually want to live?&rdquo; That question only you can answer.
          </p>

          <p>
            So &ldquo;a home is not a showroom&rdquo; isn&rsquo;t a counter-culture slogan. It&rsquo;s a practical reminder: don&rsquo;t let performance displace living. Don&rsquo;t let short-term visual satisfaction displace long-term daily experience.
          </p>

          <p>
            If you&rsquo;re making decisions right now, try swapping &ldquo;how do I want this home to look?&rdquo; for &ldquo;how do I want us to live in this home?&rdquo; The answer comes more slowly — but it&rsquo;s usually much closer to what you actually want.
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
