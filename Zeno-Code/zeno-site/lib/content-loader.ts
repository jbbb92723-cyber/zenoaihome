/**
 * Dynamic content loader — avoids compile-time bundling of all 60+ articles.
 * Each blog page loads only its own content at SSR time, saving ~300MB+ of heap.
 */
export async function getArticleContent(id: string): Promise<string> {
  try {
    const mod = await import(`@/data/content/article-${id}-content`)
    const key = `article${id}Content`
    if (key in mod) return mod[key] as string
    throw new Error(`Key ${key} not found in article-${id}-content`)
  } catch (e) {
    console.error(`Failed to load article ${id}:`, e)
    return ''
  }
}
