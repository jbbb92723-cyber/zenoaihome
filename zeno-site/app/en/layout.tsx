import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Zeno — From renovation sites to long-term living',
    template: '%s · Zeno',
  },
  description:
    "I\u2019m Zeno, a renovation practitioner from China. I write about real living, aesthetics, human decisions, work-site observations, and how traditional industry people can upgrade themselves with AI.",
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
