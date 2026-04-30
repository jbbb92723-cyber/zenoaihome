import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from '@/components/Avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { articles, getArticleBySlug, getRecentArticles } from '@/data/articles'
import { getAlternateSlug } from '@/lib/i18n'
import ArticleCard from '@/components/ArticleCard'
import CopyLinkButton from '@/components/CopyLinkButton'
import ArticleCTA from '@/components/ArticleCTA'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  const enSlug = getAlternateSlug(article.id, 'en')
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      locale: 'zh_CN',
      publishedTime: article.date,
      tags: article.tags,
    },
    alternates: {
      canonical: `https://zenoaihome.com/blog/${article.slug}`,
      languages: {
        'zh-CN': `https://zenoaihome.com/blog/${article.slug}`,
        ...(enSlug ? { en: `https://zenoaihome.com/en/blog/${enSlug}` } : {}),
      },
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const formattedDate = new Date(article.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Related: other articles in the same category, excluding current
  const related = getRecentArticles(6)
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3)

  const moreArticles = getRecentArticles(4).filter((a) => a.slug !== article.slug).slice(0, 3)

  const suggested = related.length > 0 ? related : moreArticles

  return (
    <>
      {/* 文章头部 */}
      <article className="max-w-reading mx-auto px-5 sm:px-8 pt-12 pb-16">
        {/* 面包屑 */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
          <Link href="/blog" className="hover:text-stone transition-colors">文章</Link>
          <span>/</span>
          <span className="text-stone">{article.category}</span>
        </nav>

        {/* 标题 */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-stone font-medium border border-stone/30 px-2 py-0.5">
              {article.category}
            </span>
            <time className="text-xs text-ink-muted">{formattedDate}</time>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink leading-tight tracking-tight">
            {article.title}
          </h1>
          <p className="mt-5 text-base text-ink-muted leading-[1.8] border-l-2 border-stone-light pl-4">
            {article.excerpt}
          </p>
          {/* 标签 */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs text-ink-muted border border-border px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 封面图（有图才显示） */}
        {article.coverImage && article.coverImage.length > 0 && (
          <div className="relative w-full aspect-[16/7] overflow-hidden mb-10">
            <Image
              src={article.coverImage}
              alt={article.coverAlt || article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </div>
        )}

        <hr className="border-border mb-10" />

        {/* 正文 */}
        <div className="article-prose prose prose-sm max-w-none text-ink
          [&_p]:text-[0.95rem] [&_p]:leading-[1.9] [&_p]:text-ink [&_p]:mb-0 [&_p+p]:mt-[1.5em]
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-ink [&_h2]:tracking-tight
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-ink
          [&_a]:text-stone [&_a]:underline [&_a]:decoration-stone-light [&_a:hover]:decoration-stone
          [&_ul]:my-5 [&_ul]:space-y-1.5 [&_ol]:my-5 [&_ol]:space-y-1.5
          [&_li]:text-[0.95rem] [&_li]:leading-[1.8]
          [&_strong]:text-ink [&_strong]:font-semibold
          [&_hr]:border-border [&_hr]:my-10
          [&_blockquote]:border-l-2 [&_blockquote]:border-stone-light [&_blockquote]:pl-4 [&_blockquote]:text-ink-muted
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        {/* 作者介绍 */}
        <div className="mt-14 pt-8 border-t border-border">
          <div className="flex items-start gap-4">
            <Avatar src="/images/brand/avatar.webp" alt="Zeno 头像" fallback="Z" size={40} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">Zeno · 赞诺</p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed max-w-sm">
                16 年装修从业经历，从工地和客户沟通中走出来。
                现在用 AI 把一线经验整理成普通人也能用的判断系统——不追热点，只讲真实。
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <Link href="/about" className="text-xs text-stone hover:underline underline-offset-2 decoration-stone-light">
                  了解更多 →
                </Link>
                <Link href="/contact" className="text-xs text-stone hover:underline underline-offset-2 decoration-stone-light">
                  联系 Zeno
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 轻互动 */}
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-3">
          <CopyLinkButton />
          <Link
            href="/resources"
            className="text-xs text-ink-muted border border-border px-3 py-1.5 hover:border-stone hover:text-stone transition-colors"
          >
            去资料库
          </Link>
          <Link
            href="/notes"
            className="text-xs text-ink-muted border border-border px-3 py-1.5 hover:border-stone hover:text-stone transition-colors"
          >
            看思考札记
          </Link>
          <Link
            href="/contact"
            className="text-xs text-ink-muted border border-border px-3 py-1.5 hover:border-stone hover:text-stone transition-colors"
          >
            联系 Zeno
          </Link>
        </div>
      </article>

      {/* 按分类显示不同 CTA */}
      <div className="max-w-reading mx-auto px-5 sm:px-8">
        <ArticleCTA category={article.category} />
      </div>

      {/* ───── 下一步行动 ───── */}
      <section className="max-w-reading mx-auto px-5 sm:px-8 py-10">
        <p className="text-xs text-stone font-medium uppercase tracking-widest mb-5">读完这篇，你还可以</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/resources"
            className="group border border-border bg-surface p-4 card-hover"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-faint mb-1">工具</p>
            <p className="text-sm font-medium text-ink group-hover:text-stone transition-colors">去资料库找工具</p>
            <p className="text-xs text-ink-muted mt-1">预算表、清单、提示词包</p>
          </Link>
          <Link
            href="/notes"
            className="group border border-border bg-surface p-4 card-hover"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-faint mb-1">思考</p>
            <p className="text-sm font-medium text-ink group-hover:text-stone transition-colors">看相关札记</p>
            <p className="text-xs text-ink-muted mt-1">更短、更直接的判断</p>
          </Link>
          <Link
            href="/contact"
            className="group border border-border bg-surface p-4 card-hover"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-faint mb-1">提问</p>
            <p className="text-sm font-medium text-ink group-hover:text-stone transition-colors">把你的问题告诉我</p>
            <p className="text-xs text-ink-muted mt-1">真实问题会变成内容</p>
          </Link>
        </div>
      </section>

      {/* 相关文章 */}
      {suggested.length > 0 && (
        <section className="max-w-reading mx-auto px-5 sm:px-8 py-12 border-t border-border">
          <p className="text-xs text-stone font-medium uppercase tracking-widest mb-6">继续阅读</p>
          {suggested.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
          <div className="mt-6">
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2">
              查看全部文章 →
            </Link>
          </div>
        </section>
      )}

    </>
  )
}
