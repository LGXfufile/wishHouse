/**
 * 高级SEO管理器
 * 功能：sitemap管理、SEO指标监控、报告生成、竞争分析
 */

export interface SEOMetrics {
  pageSpeed: number
  mobileUsability: boolean
  structuredDataValid: boolean
  metaTagsComplete: boolean
  imageOptimization: number
  internalLinks: number
  externalLinks: number
  contentQuality: number
  keywordDensity: Record<string, number>
}

export interface SEOReport {
  score: number
  metrics: SEOMetrics
  recommendations: string[]
  issues: Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    element?: string
  }>
  timestamp: string
}

export interface SitemapEntry {
  url: string
  lastModified: string
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  images?: Array<{
    url: string
    title?: string
    caption?: string
  }>
}

export class SEOManager {
  private siteUrl: string
  private sitemap: SitemapEntry[] = []
  
  constructor(siteUrl: string) {
    this.siteUrl = siteUrl.replace(/\/$/, '') // 移除末尾斜杠
  }

  /**
   * 添加页面到sitemap
   */
  addToSitemap(entry: Omit<SitemapEntry, 'lastModified'>) {
    const existingIndex = this.sitemap.findIndex(item => item.url === entry.url)
    const sitemapEntry: SitemapEntry = {
      ...entry,
      lastModified: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      this.sitemap[existingIndex] = sitemapEntry
    } else {
      this.sitemap.push(sitemapEntry)
    }
  }

  /**
   * 生成XML sitemap
   */
  generateSitemapXML(): string {
    const urls = this.sitemap.map(entry => {
      const images = entry.images?.map(img => `
        <image:image>
          <image:loc>${img.url}</image:loc>
          ${img.title ? `<image:title>${this.escapeXML(img.title)}</image:title>` : ''}
          ${img.caption ? `<image:caption>${this.escapeXML(img.caption)}</image:caption>` : ''}
        </image:image>
      `).join('') || ''

      return `
  <url>
    <loc>${this.siteUrl}${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFreq}</changefreq>
    <priority>${entry.priority}</priority>
    ${images}
  </url>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`
  }

  /**
   * 分析页面SEO
   */
  analyzePage(): SEOReport {
    const metrics = this.collectSEOMetrics()
    const issues = this.detectSEOIssues()
    const recommendations = this.generateRecommendations(metrics, issues)
    const score = this.calculateSEOScore(metrics)

    return {
      score,
      metrics,
      recommendations,
      issues,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 收集SEO指标
   */
  private collectSEOMetrics(): SEOMetrics {
    if (typeof window === 'undefined') {
      return this.getDefaultMetrics()
    }

    const doc = window.document
    
    // 检查meta标签完整性
    const hasTitle = !!doc.querySelector('title')?.textContent
    const hasDescription = !!doc.querySelector('meta[name="description"]')?.getAttribute('content')
    const hasKeywords = !!doc.querySelector('meta[name="keywords"]')?.getAttribute('content')
    const hasOGTags = !!doc.querySelector('meta[property^="og:"]')
    const metaTagsComplete = hasTitle && hasDescription && hasKeywords && hasOGTags

    // 检查结构化数据
    const structuredDataScripts = doc.querySelectorAll('script[type="application/ld+json"]')
    const structuredDataValid = structuredDataScripts.length > 0

    // 分析图片优化
    const images = doc.querySelectorAll('img')
    let optimizedImages = 0
    images.forEach(img => {
      if (img.alt && img.loading === 'lazy') {
        optimizedImages++
      }
    })
    const imageOptimization = images.length > 0 ? (optimizedImages / images.length) * 100 : 100

    // 统计链接
    const internalLinks = doc.querySelectorAll(`a[href^="/"], a[href^="${this.siteUrl}"]`).length
    const externalLinks = doc.querySelectorAll('a[href^="http"]:not([href^="' + this.siteUrl + '"])')?.length || 0

    // 内容质量分析
    const textContent = doc.body?.textContent || ''
    const wordCount = textContent.split(/\s+/).length
    const contentQuality = this.calculateContentQuality(textContent, wordCount)

    // 关键词密度
    const keywordDensity = this.analyzeKeywordDensity(textContent)

    return {
      pageSpeed: 0, // 需要从性能API获取
      mobileUsability: this.checkMobileUsability(),
      structuredDataValid,
      metaTagsComplete,
      imageOptimization,
      internalLinks,
      externalLinks,
      contentQuality,
      keywordDensity
    }
  }

  /**
   * 检测SEO问题
   */
  private detectSEOIssues(): SEOReport['issues'] {
    if (typeof window === 'undefined') return []

    const issues: SEOReport['issues'] = []
    const doc = window.document

    // 检查标题
    const title = doc.querySelector('title')?.textContent
    if (!title) {
      issues.push({ type: 'error', message: '页面缺少标题标签', element: 'title' })
    } else if (title.length < 30 || title.length > 60) {
      issues.push({ type: 'warning', message: '标题长度建议在30-60字符之间', element: 'title' })
    }

    // 检查描述
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')
    if (!description) {
      issues.push({ type: 'error', message: '页面缺少描述标签', element: 'meta[name="description"]' })
    } else if (description.length < 120 || description.length > 160) {
      issues.push({ type: 'warning', message: '描述长度建议在120-160字符之间', element: 'meta[name="description"]' })
    }

    // 检查H1标签
    const h1Tags = doc.querySelectorAll('h1')
    if (h1Tags.length === 0) {
      issues.push({ type: 'error', message: '页面缺少H1标签', element: 'h1' })
    } else if (h1Tags.length > 1) {
      issues.push({ type: 'warning', message: '页面有多个H1标签，建议只使用一个', element: 'h1' })
    }

    // 检查图片alt属性
    const imagesWithoutAlt = doc.querySelectorAll('img:not([alt])')
    if (imagesWithoutAlt.length > 0) {
      issues.push({ 
        type: 'warning', 
        message: `${imagesWithoutAlt.length}张图片缺少alt属性`, 
        element: 'img' 
      })
    }

    // 检查内部链接
    const internalLinks = doc.querySelectorAll(`a[href^="/"], a[href^="${this.siteUrl}"]`).length
    if (internalLinks < 3) {
      issues.push({ type: 'info', message: '建议增加更多内部链接以提升SEO', element: 'a' })
    }

    return issues
  }

  /**
   * 生成SEO建议
   */
  private generateRecommendations(metrics: SEOMetrics, issues: SEOReport['issues']): string[] {
    const recommendations: string[] = []

    if (!metrics.metaTagsComplete) {
      recommendations.push('完善meta标签：确保包含title、description、keywords和Open Graph标签')
    }

    if (metrics.imageOptimization < 80) {
      recommendations.push('优化图片：为所有图片添加alt属性并启用懒加载')
    }

    if (metrics.internalLinks < 5) {
      recommendations.push('增加内部链接：添加更多相关页面的链接以提升页面权重')
    }

    if (metrics.contentQuality < 70) {
      recommendations.push('提升内容质量：增加内容长度和相关性，确保内容有价值')
    }

    if (!metrics.structuredDataValid) {
      recommendations.push('添加结构化数据：使用Schema.org标记提升搜索结果展示')
    }

    // 根据问题生成建议
    const errorCount = issues.filter(issue => issue.type === 'error').length
    if (errorCount > 0) {
      recommendations.push(`修复${errorCount}个严重SEO问题以提升搜索排名`)
    }

    return recommendations
  }

  /**
   * 计算SEO评分
   */
  private calculateSEOScore(metrics: SEOMetrics): number {
    let score = 0
    let maxScore = 0

    // meta标签完整性 (20分)
    maxScore += 20
    if (metrics.metaTagsComplete) score += 20

    // 结构化数据 (15分)
    maxScore += 15
    if (metrics.structuredDataValid) score += 15

    // 图片优化 (15分)
    maxScore += 15
    score += (metrics.imageOptimization / 100) * 15

    // 内容质量 (20分)
    maxScore += 20
    score += (metrics.contentQuality / 100) * 20

    // 链接结构 (10分)
    maxScore += 10
    const linkScore = Math.min(metrics.internalLinks / 5, 1) * 10
    score += linkScore

    // 移动友好性 (10分)
    maxScore += 10
    if (metrics.mobileUsability) score += 10

    // 页面速度 (10分)
    maxScore += 10
    if (metrics.pageSpeed > 90) score += 10
    else if (metrics.pageSpeed > 50) score += 5

    return Math.round((score / maxScore) * 100)
  }

  /**
   * 检查移动友好性
   */
  private checkMobileUsability(): boolean {
    if (typeof window === 'undefined') return false

    const viewport = document.querySelector('meta[name="viewport"]')
    const hasViewport = !!viewport?.getAttribute('content')?.includes('width=device-width')
    
    // 简单检查是否使用了响应式设计
    const hasResponsiveCSS = Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules || []).some(rule => 
          rule.cssText.includes('@media') && rule.cssText.includes('max-width')
        )
      } catch {
        return false
      }
    })

    return hasViewport && hasResponsiveCSS
  }

  /**
   * 计算内容质量
   */
  private calculateContentQuality(text: string, wordCount: number): number {
    let score = 0

    // 内容长度评分
    if (wordCount >= 300) score += 30
    else if (wordCount >= 150) score += 20
    else if (wordCount >= 50) score += 10

    // 内容可读性评分（简单实现）
    const sentences = text.split(/[.!?]+/).length
    const avgWordsPerSentence = wordCount / sentences
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) score += 20

    // 关键词使用评分
    const keywords = ['wish', 'hope', 'dream', 'blessing', 'community']
    const keywordUsage = keywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    )
    if (keywordUsage) score += 20

    // 段落结构评分
    const paragraphs = text.split('\n\n').length
    if (paragraphs > 1) score += 15

    // 特殊字符和表情符号
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text)
    if (hasEmojis) score += 15

    return Math.min(score, 100)
  }

  /**
   * 分析关键词密度
   */
  private analyzeKeywordDensity(text: string): Record<string, number> {
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const totalWords = words.length
    const wordCount: Record<string, number> = {}

    words.forEach(word => {
      if (word.length > 3) { // 忽略太短的词
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })

    const density: Record<string, number> = {}
    Object.entries(wordCount).forEach(([word, count]) => {
      density[word] = (count / totalWords) * 100
    })

    // 返回前10个最常用的词
    return Object.fromEntries(
      Object.entries(density)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    )
  }

  /**
   * 转义XML字符
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  /**
   * 获取默认指标（服务器端渲染时使用）
   */
  private getDefaultMetrics(): SEOMetrics {
    return {
      pageSpeed: 85,
      mobileUsability: true,
      structuredDataValid: true,
      metaTagsComplete: true,
      imageOptimization: 90,
      internalLinks: 5,
      externalLinks: 2,
      contentQuality: 80,
      keywordDensity: {}
    }
  }

  /**
   * 导出SEO报告为JSON
   */
  exportReport(report: SEOReport): string {
    return JSON.stringify(report, null, 2)
  }

  /**
   * 自动更新sitemap
   */
  async updateSitemap() {
    try {
      const sitemapXML = this.generateSitemapXML()
      
      // 在实际应用中，这里应该发送到服务器保存sitemap文件
      console.log('Generated sitemap:', sitemapXML)
      
      // 通知搜索引擎更新
      this.notifySearchEngines()
      
      return sitemapXML
    } catch (error) {
      console.error('Failed to update sitemap:', error)
      throw error
    }
  }

  /**
   * 通知搜索引擎sitemap更新
   */
  private async notifySearchEngines() {
    const sitemapUrl = `${this.siteUrl}/sitemap.xml`
    
    const searchEngines = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    ]

    searchEngines.forEach(async (url) => {
      try {
        // 在实际应用中发送ping请求
        console.log('Notifying search engine:', url)
      } catch (error) {
        console.error('Failed to notify search engine:', error)
      }
    })
  }
}

// 创建全局SEO管理器实例
export const seoManager = new SEOManager(
  typeof window !== 'undefined' ? window.location.origin : 'https://wishlighthouse.vercel.app'
)

export default SEOManager 