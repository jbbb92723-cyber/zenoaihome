'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function scrollToCurrentHash(attempt = 0) {
  const hash = window.location.hash
  if (!hash) return

  const id = decodeURIComponent(hash.slice(1))
  const target = document.getElementById(id)

  if (!target) {
    if (attempt < 5) {
      window.setTimeout(() => scrollToCurrentHash(attempt + 1), 120)
    }
    return
  }

  target.scrollIntoView({ block: 'start' })
}

export default function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    const handleHashScroll = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToCurrentHash())
      })
    }

    handleHashScroll()
    window.addEventListener('hashchange', handleHashScroll)

    return () => {
      window.removeEventListener('hashchange', handleHashScroll)
    }
  }, [pathname])

  return null
}