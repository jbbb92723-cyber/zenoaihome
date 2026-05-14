import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── 语义色（CSS 变量，自动响应暗色模式）───
        canvas:       'rgb(var(--color-canvas-rgb) / <alpha-value>)',
        surface:      'rgb(var(--color-surface-rgb) / <alpha-value>)',
        'surface-warm': 'rgb(var(--color-surface-warm-rgb) / <alpha-value>)',
        ink:          'rgb(var(--color-ink-rgb) / <alpha-value>)',
        'ink-muted':  'rgb(var(--color-ink-muted-rgb) / <alpha-value>)',
        'ink-faint':  'rgb(var(--color-ink-faint-rgb) / <alpha-value>)',
        stone:        'rgb(var(--color-stone-rgb) / <alpha-value>)',
        'stone-light': 'rgb(var(--color-stone-light-rgb) / <alpha-value>)',
        'stone-pale':  'rgb(var(--color-stone-pale-rgb) / <alpha-value>)',
        'stone-deep':  'rgb(var(--color-stone-deep-rgb) / <alpha-value>)',
        border:       'rgb(var(--color-border-rgb) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle-rgb) / <alpha-value>)',
        // ─── 专题色 ───
        topic1: '#8B7355',
        topic2: '#6B7A5E',
        topic3: '#5B6E8A',
        topic4: '#7A6B8A',
        topic5: '#8A6B5B',
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // 语义化字号别名
        label:  ['0.75rem',  { lineHeight: '1.4', letterSpacing: '0.06em' }], // 12px
        caption:['0.8125rem',{ lineHeight: '1.5' }],                           // 13px
        body:   ['1rem',     { lineHeight: '1.75' }],                          // 16px
        'body-lg':['1.0625rem',{ lineHeight: '1.85' }],                        // 17px
        prose:  ['1.125rem', { lineHeight: '1.9'  }],                          // 18px
      },
      spacing: {
        section:  '5rem',    // 80px  大区块上下
        'section-sm': '3rem',// 48px  小区块
        block:    '2rem',    // 32px  块内间距
      },
      maxWidth: {
        reading: '680px',   // 长文阅读
        content: '800px',   // 内页内容区
        wide:    '1000px',  // 宽页面
        layout:  '1152px',  // 全站 max（6xl ≈ 1152px）
      },
      borderRadius: {
        card: '12px',
        tag:  '4px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--color-ink)',
            lineHeight: '1.9',
            fontSize: '1.0625rem',
            '--tw-prose-body': 'var(--color-ink-muted)',
            '--tw-prose-headings': 'var(--color-ink)',
            '--tw-prose-links': 'var(--color-stone)',
            '--tw-prose-bold': 'var(--color-ink)',
            '--tw-prose-quotes': 'var(--color-ink-muted)',
            '--tw-prose-code': 'var(--color-ink)',
            '--tw-prose-hr': 'var(--color-border)',
            p: { marginTop: '1.5em', marginBottom: '1.5em' },
            h2: { marginTop: '2.2em', marginBottom: '0.8em', fontWeight: '600', fontSize: '1.25rem' },
            h3: { marginTop: '1.8em', marginBottom: '0.6em', fontWeight: '600', fontSize: '1.0625rem' },
            a: {
              color: 'var(--color-stone)',
              textDecoration: 'underline',
              textDecorationColor: 'var(--color-stone-light)',
              '&:hover': { textDecorationColor: 'var(--color-stone)' },
            },
            'ul, ol': { marginTop: '1.2em', marginBottom: '1.2em' },
            li: { marginTop: '0.4em', marginBottom: '0.4em' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
