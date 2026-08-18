'use client'

import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  className,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`min-h-11 w-full pr-12 ${className ?? 'text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors'}`}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink-faint transition-colors hover:text-ink-muted"
        aria-label={show ? '隐藏密码' : '显示密码'}
      >
        {show ? (
          <EyeSlash className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
