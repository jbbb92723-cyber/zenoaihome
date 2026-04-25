'use client'

import { useState, useEffect } from 'react'

const taglines = [
  '在混乱中保持清醒，在现场中找到秩序。',
  '看清真相，然后持续做对的事。',
  '装修是入口，不是终局。',
  '降低信息差，重建信任。',
]

export default function HeroTagline() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % taglines.length)
        setVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span
      className={`inline-block transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {taglines[index]}
    </span>
  )
}
