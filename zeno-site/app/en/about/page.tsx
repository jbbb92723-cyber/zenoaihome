import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'About Zeno | Pre-Signing Renovation Judgment',
  description:
    'Zeno is a renovation practitioner in China with 16 years on site, building ZenoAIHome to help homeowners clarify quote risks before signing.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/about',
    languages: { 'zh-CN': 'https://zenoaihome.com/about', en: 'https://zenoaihome.com/en/about' },
  },
}

const sections = [
  {
    title: 'Who I am',
    content:
      'I am Zeno, a renovation practitioner based in China. I have spent more than 16 years on real renovation sites: reading quotes, coordinating work, handling scope changes, and seeing the awkward parts that never make it into a showroom photo.',
  },
  {
    title: 'Why quote risk matters',
    content:
      'A renovation quote is not just a price list. It is a responsibility map for future work. If scope, materials, quantities, change-order rules, acceptance standards, warranty terms, and payment milestones are unclear before signing, later disputes are not surprising; they are baked in.',
  },
  {
    title: 'What ZenoAIHome is building',
    content:
      'ZenoAIHome turns field experience into practical pre-signing judgment assets: a quote risk check, a risk dictionary, checklists, a project risk library, and focused expert review. AI helps sort the paperwork; it does not replace the judgment of what must be written down.',
  },
  {
    title: 'What I do not do',
    content:
      'I do not negotiate on your behalf, provide legal contract review, promise the lowest price, or decide whether you must sign. The work is to help you see what still needs to be clarified before you make that decision.',
  },
  {
    title: 'Why the English site is selective',
    content:
      'The full service and data library are currently in Chinese because the real quotes and contracts are usually Chinese. The English site is a carefully edited doorway: accurate, natural, and useful, without pretending that every local Chinese detail has been fully localized.',
  },
]

export default function EnAboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-warm py-12 sm:py-16">
        <Container size="content">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">About</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Sixteen years on site, turned into pre-signing judgment.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            ZenoAIHome exists for one practical moment: before a homeowner signs a renovation contract and needs to know what the quote still has not clearly said.
          </p>
        </Container>
      </section>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-base font-semibold text-ink">{section.title}</h2>
              <p className="text-sm leading-8 text-ink-muted">{section.content}</p>
            </section>
          ))}

          <section className="border-t border-border pt-8">
            <h2 className="mb-3 text-base font-semibold text-ink">Contact</h2>
            <p className="mb-4 text-sm leading-7 text-ink-muted">
              For international readers, email is the clearest way to reach me. Chinese homeowners can use the Chinese service page and WeChat contact details.
            </p>
            <p className="text-sm text-ink">Email: zenoaihome@qq.com</p>
          </section>

          <div className="border-t border-border pt-8 flex flex-wrap gap-3">
            <Link href="/en/tools" className="bg-stone px-4 py-2 text-sm font-semibold text-white hover:bg-stone/90">
              Explore quote risk tools
            </Link>
            <Link href="/en/services" className="border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-stone">
              See review options
            </Link>
          </div>
        </div>
      </Container>
    </>
  )
}
