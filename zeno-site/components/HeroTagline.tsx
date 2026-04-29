'use client'

import { useState, useEffect } from 'react'

const taglines = [
  '把经验变成工具，把内容变成资产。',
  '装修是入口，不是终局。',
  '先从真实问题开始，再让系统放大效率。',
  '用更少人力，建立更自由的事业。',
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
