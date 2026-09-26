/**
 * SEO & Meta Management Utility
 * Updates document head metadata, canonical URLs, Open Graph, Twitter Cards,
 * and robots directives across public and private SPA routes.
 */

export interface MetaConfig {
  title: string
  description: string
  path: string
  isPrivate?: boolean
  ogType?: 'website' | 'article'
}

const DEFAULT_SITE_URL = 'https://speakly.ai'

export function getSiteUrl(): string {
  const envUrl = (import.meta.env.VITE_SITE_URL as string) || ''
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '')
  }
  return DEFAULT_SITE_URL
}

export function updatePageMeta(config: MetaConfig): void {
  const baseUrl = getSiteUrl()
  const cleanPath = config.path.startsWith('/') ? config.path : `/${config.path}`
  const canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`
  const ogImageUrl = `${baseUrl}/og-image.png`

  // 1. Page Title
  document.title = config.title

  // Helper to create or update meta tag
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attrName, attrVal)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  // 2. Standard Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', config.description)

  // 3. Robots meta (Strict noindex,nofollow for private authenticated app routes)
  if (config.isPrivate) {
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex,nofollow')
  } else {
    setMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    )
  }

  // 4. Canonical URL Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!canonicalEl) {
    canonicalEl = document.createElement('link')
    canonicalEl.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalEl)
  }
  canonicalEl.setAttribute('href', canonicalUrl)

  // 5. Open Graph
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Speakly AI')
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', config.title)
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description)
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', config.ogType || 'website')
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImageUrl)

  // 6. Twitter / X Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.title)
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description)
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImageUrl)
}
