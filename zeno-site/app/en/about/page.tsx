import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Zeno',
  description: 'Who I am, what I write about, and why I look beyond renovation.',
}

const sections = [
  {
    title: 'Who I am',
    content:
      "I\u2019m Zeno \u2014 a renovation practitioner based in Nanning, China. I\u2019ve spent over 16 years on job sites, managing projects, reading blueprints, and solving problems that don\u2019t fit neatly into textbooks.",
  },
  {
    title: 'From renovation sites to broader life observations',
    content:
      "Renovation taught me to see things as they are \u2014 not as they\u2019re marketed. A home is not a showroom. A budget is not a wish list. Over time, I started writing about what I noticed: how people make decisions, how aesthetics shape living, and how long-term thinking applies to more than just buildings.",
  },
  {
    title: 'Why I write beyond renovation',
    content:
      "Because the patterns I see on job sites appear everywhere \u2014 in business, in technology adoption, in how people handle uncertainty. Writing helps me think clearly, and sharing those observations connects me with others who think similarly.",
  },
  {
    title: 'What I believe',
    content:
      "Long-term thinking is not patience \u2014 it\u2019s a strategy. Real aesthetics come from restraint, not decoration. AI should serve practitioners, not replace their judgment. Good writing comes from lived experience, not templates.",
  },
  {
    title: "What I don\u2019t believe in",
    content:
      "Quick fixes. Viral-first content strategies. Gatekeeping knowledge behind unnecessary paywalls. Pretending AI will solve everything. Treating people as traffic.",
  },
  {
    title: 'Current focus',
    content:
      "Building this site as a long-term writing home. Exploring how AI tools can genuinely help traditional industry professionals. Writing in both Chinese and English to connect with a broader audience.",
  },
]

export default function EnAboutPage() {
  return (
    <>
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">About Zeno</h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            Renovation practitioner, writer, and long-term thinker based in China.
          </p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-semibold text-ink mb-3">{s.title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed">{s.content}</p>
            </section>
          ))}

          {/* Contact */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-base font-semibold text-ink mb-3">Contact</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              The best way to reach me is through the{' '}
              <Link href="/contact" className="text-stone hover:underline underline-offset-2">
                contact page
              </Link>{' '}
              on the Chinese site. I read every message, though I may not reply to everything.
            </p>
            <p className="text-sm text-ink-muted">
              Email: 1603165918@qq.com
            </p>
          </section>
        </div>
      </Container>
    </>
  )
}
