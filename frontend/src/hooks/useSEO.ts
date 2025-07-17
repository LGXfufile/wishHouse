import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  siteName?: string
  locale?: string
}

export const useSEO = (config: SEOConfig = {}) => {
  const location = useLocation()
  const { i18n } = useTranslation()
  
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : ''
  const currentLocale = i18n.language
  const siteName = currentLocale === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
  const defaultDescription = currentLocale === 'zh' 
    ? '与世界分享你的愿望和祝福。在心愿灯塔，每个愿望都值得被点亮。'
    : 'Share your wishes and blessings with the world. At Wish Lighthouse, every wish deserves to be lit up.'

  const seoConfig = {
    title: config.title ? `${config.title} | ${siteName}` : siteName,
    description: config.description || defaultDescription,
    keywords: config.keywords || (currentLocale === 'zh' 
      ? '愿望,祝福,心愿,社区,分享,正能量,希望,梦想' 
      : 'wishes,blessings,community,sharing,positive energy,hope,dreams'),
    image: config.image || `${window.location.origin}/images/og-image.jpg`,
    url: config.url || currentUrl,
    type: config.type || 'website',
    publishedTime: config.publishedTime,
    modifiedTime: config.modifiedTime,
    author: config.author,
    siteName,
    locale: currentLocale
  }

  useEffect(() => {
    // 设置基础meta标签
    updateMetaTag('title', seoConfig.title)
    updateMetaTag('description', seoConfig.description)
    updateMetaTag('keywords', seoConfig.keywords)
    
    // 设置Open Graph标签
    updateMetaTag('og:title', seoConfig.title)
    updateMetaTag('og:description', seoConfig.description)
    updateMetaTag('og:image', seoConfig.image)
    updateMetaTag('og:url', seoConfig.url)
    updateMetaTag('og:type', seoConfig.type)
    updateMetaTag('og:site_name', seoConfig.siteName)
    updateMetaTag('og:locale', seoConfig.locale)
    
    // 设置Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', seoConfig.title)
    updateMetaTag('twitter:description', seoConfig.description)
    updateMetaTag('twitter:image', seoConfig.image)
    
    // 设置文章特定标签
    if (seoConfig.type === 'article') {
      if (seoConfig.publishedTime) {
        updateMetaTag('article:published_time', seoConfig.publishedTime)
      }
      if (seoConfig.modifiedTime) {
        updateMetaTag('article:modified_time', seoConfig.modifiedTime)
      }
      if (seoConfig.author) {
        updateMetaTag('article:author', seoConfig.author)
      }
    }
    
    // 设置canonical URL
    updateCanonicalLink(seoConfig.url)
    
    // 设置hreflang标签
    updateHreflangLinks(location.pathname)
    
  }, [JSON.stringify(seoConfig), location.pathname])

  return seoConfig
}

// 辅助函数：更新meta标签
const updateMetaTag = (name: string, content: string) => {
  if (!content) return
  
  const isProperty = name.startsWith('og:') || name.startsWith('article:')
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
  
  let meta = document.querySelector(selector) as HTMLMetaElement
  
  if (!meta) {
    meta = document.createElement('meta')
    if (isProperty) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    document.head.appendChild(meta)
  }
  
  meta.setAttribute('content', content)
  
  // 特殊处理title标签
  if (name === 'title') {
    document.title = content
  }
}

// 辅助函数：更新canonical链接
const updateCanonicalLink = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  
  canonical.setAttribute('href', url)
}

// 辅助函数：更新hreflang链接
const updateHreflangLinks = (pathname: string) => {
  // 移除现有的hreflang标签
  const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]')
  existingHreflang.forEach(link => link.remove())
  
  const baseUrl = window.location.origin
  const languages = [
    { code: 'en', region: 'en-US' },
    { code: 'zh', region: 'zh-CN' }
  ]
  
  languages.forEach(lang => {
    const hreflang = document.createElement('link')
    hreflang.setAttribute('rel', 'alternate')
    hreflang.setAttribute('hreflang', lang.region)
    hreflang.setAttribute('href', `${baseUrl}${pathname}?lang=${lang.code}`)
    document.head.appendChild(hreflang)
  })
  
  // 添加x-default
  const xDefault = document.createElement('link')
  xDefault.setAttribute('rel', 'alternate')
  xDefault.setAttribute('hreflang', 'x-default')
  xDefault.setAttribute('href', `${baseUrl}${pathname}`)
  document.head.appendChild(xDefault)
}

export default useSEO 