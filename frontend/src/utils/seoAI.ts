/**
 * AI驱动的SEO内容优化器
 * 功能：智能关键词分析、内容优化、SEO评分、竞争分析
 */

export interface KeywordAnalysis {
  keyword: string
  density: number
  frequency: number
  positions: number[]
  sentiment: 'positive' | 'neutral' | 'negative'
  relevance: number
  competition: 'low' | 'medium' | 'high'
  suggestions: string[]
}

export interface ContentAnalysis {
  readabilityScore: number
  sentimentScore: number
  keywordOptimization: number
  contentLength: number
  paragraphCount: number
  sentenceCount: number
  averageWordsPerSentence: number
  fleschKincaidGrade: number
  topKeywords: KeywordAnalysis[]
  suggestions: ContentSuggestion[]
}

export interface ContentSuggestion {
  type: 'keyword' | 'structure' | 'readability' | 'length' | 'sentiment'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  implementation: string
  impact: number
}

export interface CompetitorAnalysis {
  url: string
  title: string
  metaDescription: string
  keywords: string[]
  contentLength: number
  seoScore: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
}

export interface SEOTrend {
  keyword: string
  trend: 'rising' | 'falling' | 'stable'
  volume: number
  difficulty: number
  opportunity: number
  relatedKeywords: string[]
}

export class SEOAIOptimizer {
  private readonly stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'would', 'you', 'your', 'this', 'they'
  ])

  private readonly positiveWords = new Set([
    'amazing', 'awesome', 'beautiful', 'best', 'brilliant', 'excellent',
    'fantastic', 'good', 'great', 'incredible', 'love', 'perfect',
    'wonderful', 'happy', 'joy', 'hope', 'dream', 'wish', 'blessing'
  ])

  private readonly negativeWords = new Set([
    'bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'sad',
    'angry', 'disappointed', 'frustrated', 'annoying', 'boring'
  ])

  /**
   * 分析内容的SEO性能
   */
  analyzeContent(content: string, targetKeywords?: string[]): ContentAnalysis {
    const words = this.extractWords(content)
    const sentences = this.extractSentences(content)
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)

    // 基础指标
    const contentLength = content.length
    const wordCount = words.length
    const sentenceCount = sentences.length
    const paragraphCount = paragraphs.length
    const averageWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0

    // 可读性评分
    const readabilityScore = this.calculateReadabilityScore(content, wordCount, sentenceCount)
    const fleschKincaidGrade = this.calculateFleschKincaidGrade(wordCount, sentenceCount, content)

    // 情感分析
    const sentimentScore = this.analyzeSentiment(words)

    // 关键词分析
    const keywordFrequency = this.analyzeKeywordFrequency(words)
    const topKeywords = this.getTopKeywords(keywordFrequency, content, targetKeywords)

    // 关键词优化评分
    const keywordOptimization = this.calculateKeywordOptimization(topKeywords, targetKeywords)

    // 生成建议
    const suggestions = this.generateContentSuggestions({
      contentLength,
      wordCount,
      readabilityScore,
      sentimentScore,
      keywordOptimization,
      paragraphCount,
      topKeywords,
      targetKeywords
    })

    return {
      readabilityScore,
      sentimentScore,
      keywordOptimization,
      contentLength,
      paragraphCount,
      sentenceCount,
      averageWordsPerSentence,
      fleschKincaidGrade,
      topKeywords,
      suggestions
    }
  }

  /**
   * 生成关键词建议
   */
  generateKeywordSuggestions(content: string, category?: string): string[] {
    const words = this.extractWords(content)
    const keywordFrequency = this.analyzeKeywordFrequency(words)
    
    // 基于内容的关键词
    const contentKeywords = Object.keys(keywordFrequency)
      .filter(word => word.length > 3 && keywordFrequency[word] > 1)
      .slice(0, 10)

    // 基于类别的关键词
    const categoryKeywords = this.getCategoryKeywords(category)

    // 相关关键词
    const relatedKeywords = this.getRelatedKeywords(contentKeywords)

    // 长尾关键词
    const longTailKeywords = this.generateLongTailKeywords(contentKeywords)

    return [
      ...contentKeywords,
      ...categoryKeywords,
      ...relatedKeywords,
      ...longTailKeywords
    ].slice(0, 20)
  }

  /**
   * 优化标题建议
   */
  optimizeTitle(title: string, targetKeywords?: string[]): {
    score: number
    suggestions: string[]
    optimizedTitle: string
  } {
    const suggestions: string[] = []
    let score = 0

    // 长度检查
    if (title.length < 30) {
      suggestions.push('标题太短，建议增加到30-60字符')
    } else if (title.length > 60) {
      suggestions.push('标题太长，建议缩短到60字符以内')
      score -= 20
    } else {
      score += 30
    }

    // 关键词检查
    if (targetKeywords) {
      const hasKeyword = targetKeywords.some(keyword => 
        title.toLowerCase().includes(keyword.toLowerCase())
      )
      if (hasKeyword) {
        score += 40
      } else {
        suggestions.push('标题中应包含目标关键词')
      }
    }

    // 可读性检查
    const wordCount = title.split(/\s+/).length
    if (wordCount < 4) {
      suggestions.push('标题词数太少，建议增加描述性词汇')
    } else if (wordCount > 12) {
      suggestions.push('标题词数太多，建议简化表达')
    } else {
      score += 20
    }

    // 情感词检查
    const hasEmotionalWord = this.hasEmotionalWords(title)
    if (hasEmotionalWord) {
      score += 10
    } else {
      suggestions.push('考虑添加情感词汇以提升吸引力')
    }

    // 生成优化后的标题
    const optimizedTitle = this.generateOptimizedTitle(title, targetKeywords)

    return {
      score: Math.max(0, Math.min(100, score)),
      suggestions,
      optimizedTitle
    }
  }

  /**
   * 优化描述建议
   */
  optimizeDescription(description: string, targetKeywords?: string[]): {
    score: number
    suggestions: string[]
    optimizedDescription: string
  } {
    const suggestions: string[] = []
    let score = 0

    // 长度检查
    if (description.length < 120) {
      suggestions.push('描述太短，建议增加到120-160字符')
    } else if (description.length > 160) {
      suggestions.push('描述太长，建议缩短到160字符以内')
      score -= 20
    } else {
      score += 30
    }

    // 关键词检查
    if (targetKeywords) {
      const keywordCount = targetKeywords.filter(keyword => 
        description.toLowerCase().includes(keyword.toLowerCase())
      ).length
      
      if (keywordCount > 0) {
        score += Math.min(40, keywordCount * 20)
      } else {
        suggestions.push('描述中应包含目标关键词')
      }
    }

    // 行动召唤检查
    const hasCallToAction = /了解|查看|发现|探索|点击|访问|阅读/i.test(description)
    if (hasCallToAction) {
      score += 15
    } else {
      suggestions.push('考虑添加行动召唤词汇')
    }

    // 独特性检查
    const hasUniqueValue = /免费|独特|专业|最佳|首选|官方/i.test(description)
    if (hasUniqueValue) {
      score += 15
    } else {
      suggestions.push('考虑突出独特价值主张')
    }

    // 生成优化后的描述
    const optimizedDescription = this.generateOptimizedDescription(description, targetKeywords)

    return {
      score: Math.max(0, Math.min(100, score)),
      suggestions,
      optimizedDescription
    }
  }

  /**
   * 提取词汇
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word))
  }

  /**
   * 提取句子
   */
  private extractSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  /**
   * 分析关键词频率
   */
  private analyzeKeywordFrequency(words: string[]): Record<string, number> {
    const frequency: Record<string, number> = {}
    
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return frequency
  }

  /**
   * 获取热门关键词
   */
  private getTopKeywords(
    frequency: Record<string, number>, 
    content: string, 
    targetKeywords?: string[]
  ): KeywordAnalysis[] {
    const keywords = Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword, freq]) => {
        const density = (freq / content.length) * 100
        const positions = this.findKeywordPositions(content, keyword)
        const sentiment = this.getKeywordSentiment(keyword)
        const relevance = this.calculateKeywordRelevance(keyword, targetKeywords)
        const competition = this.estimateKeywordCompetition(keyword)
        const suggestions = this.generateKeywordVariations(keyword)

        return {
          keyword,
          density,
          frequency: freq,
          positions,
          sentiment,
          relevance,
          competition,
          suggestions
        }
      })

    return keywords
  }

  /**
   * 找到关键词位置
   */
  private findKeywordPositions(content: string, keyword: string): number[] {
    const positions: number[] = []
    const lowerContent = content.toLowerCase()
    const lowerKeyword = keyword.toLowerCase()
    let position = 0

    while ((position = lowerContent.indexOf(lowerKeyword, position)) !== -1) {
      positions.push(position)
      position += lowerKeyword.length
    }

    return positions
  }

  /**
   * 计算可读性评分
   */
  private calculateReadabilityScore(content: string, wordCount: number, sentenceCount: number): number {
    // 基于句子长度和复杂词汇的简化可读性评分
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0
    const complexWords = content.match(/\b\w{7,}\b/g)?.length || 0
    const complexWordRatio = wordCount > 0 ? complexWords / wordCount : 0

    let score = 100
    
    // 句子太长扣分
    if (avgWordsPerSentence > 20) {
      score -= Math.min(30, (avgWordsPerSentence - 20) * 2)
    }
    
    // 复杂词汇太多扣分
    if (complexWordRatio > 0.3) {
      score -= Math.min(20, (complexWordRatio - 0.3) * 100)
    }

    return Math.max(0, Math.min(100, score))
  }

  /**
   * 计算Flesch-Kincaid等级
   */
  private calculateFleschKincaidGrade(wordCount: number, sentenceCount: number, content: string): number {
    if (sentenceCount === 0 || wordCount === 0) return 0

    const syllableCount = this.countSyllables(content)
    
    return 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59
  }

  /**
   * 计算音节数
   */
  private countSyllables(text: string): number {
    // 简化的音节计算（主要针对英文）
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    
    return words.reduce((total, word) => {
      // 简单的音节估算规则
      let syllables = word.match(/[aeiouy]+/g)?.length || 1
      if (word.endsWith('e')) syllables--
      return total + Math.max(1, syllables)
    }, 0)
  }

  /**
   * 分析情感
   */
  private analyzeSentiment(words: string[]): number {
    let positiveCount = 0
    let negativeCount = 0

    words.forEach(word => {
      if (this.positiveWords.has(word)) {
        positiveCount++
      } else if (this.negativeWords.has(word)) {
        negativeCount++
      }
    })

    const totalEmotionalWords = positiveCount + negativeCount
    if (totalEmotionalWords === 0) return 0

    // 返回-100到100的评分
    return ((positiveCount - negativeCount) / totalEmotionalWords) * 100
  }

  /**
   * 计算关键词优化评分
   */
  private calculateKeywordOptimization(keywords: KeywordAnalysis[], targetKeywords?: string[]): number {
    if (!targetKeywords || targetKeywords.length === 0) {
      return 70 // 没有目标关键词时的默认评分
    }

    const foundKeywords = keywords.filter(k => 
      targetKeywords.some(target => 
        target.toLowerCase().includes(k.keyword.toLowerCase()) ||
        k.keyword.toLowerCase().includes(target.toLowerCase())
      )
    )

    const coverage = foundKeywords.length / targetKeywords.length
    const avgDensity = foundKeywords.reduce((sum, k) => sum + k.density, 0) / foundKeywords.length

    // 密度在0.5%-2.5%之间为最佳
    const densityScore = avgDensity >= 0.5 && avgDensity <= 2.5 ? 100 : 
                        avgDensity < 0.5 ? avgDensity * 200 : 
                        Math.max(0, 100 - (avgDensity - 2.5) * 40)

    return (coverage * 60 + densityScore * 0.4)
  }

  /**
   * 生成内容建议
   */
  private generateContentSuggestions(analysis: {
    contentLength: number
    wordCount: number
    readabilityScore: number
    sentimentScore: number
    keywordOptimization: number
    paragraphCount: number
    topKeywords: KeywordAnalysis[]
    targetKeywords?: string[]
  }): ContentSuggestion[] {
    const suggestions: ContentSuggestion[] = []

    // 内容长度建议
    if (analysis.contentLength < 300) {
      suggestions.push({
        type: 'length',
        priority: 'high',
        title: '增加内容长度',
        description: '内容太短，搜索引擎更偏爱详细的内容',
        implementation: '扩展现有段落，添加更多相关信息和例子',
        impact: 85
      })
    } else if (analysis.contentLength > 2000) {
      suggestions.push({
        type: 'structure',
        priority: 'medium',
        title: '改善内容结构',
        description: '内容较长，需要更好的结构化',
        implementation: '添加副标题、要点列表和段落分隔',
        impact: 70
      })
    }

    // 可读性建议
    if (analysis.readabilityScore < 60) {
      suggestions.push({
        type: 'readability',
        priority: 'high',
        title: '提升内容可读性',
        description: '内容难以理解，影响用户体验',
        implementation: '使用简单句子，避免复杂词汇，增加段落分隔',
        impact: 90
      })
    }

    // 关键词优化建议
    if (analysis.keywordOptimization < 50) {
      suggestions.push({
        type: 'keyword',
        priority: 'high',
        title: '优化关键词使用',
        description: '关键词覆盖不足或密度不当',
        implementation: '自然地融入目标关键词，保持1-2%的密度',
        impact: 95
      })
    }

    // 情感建议
    if (analysis.sentimentScore < 20) {
      suggestions.push({
        type: 'sentiment',
        priority: 'medium',
        title: '增加积极情感词汇',
        description: '内容情感偏向消极，影响用户参与度',
        implementation: '使用更多积极、鼓励性的词汇',
        impact: 60
      })
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.impact - a.impact
    })
  }

  /**
   * 获取关键词情感
   */
  private getKeywordSentiment(keyword: string): 'positive' | 'neutral' | 'negative' {
    if (this.positiveWords.has(keyword)) return 'positive'
    if (this.negativeWords.has(keyword)) return 'negative'
    return 'neutral'
  }

  /**
   * 计算关键词相关性
   */
  private calculateKeywordRelevance(keyword: string, targetKeywords?: string[]): number {
    if (!targetKeywords) return 50

    const isTarget = targetKeywords.some(target => 
      target.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(target.toLowerCase())
    )

    return isTarget ? 100 : 30
  }

  /**
   * 估算关键词竞争度
   */
  private estimateKeywordCompetition(keyword: string): 'low' | 'medium' | 'high' {
    // 简化的竞争度估算
    if (keyword.length < 4) return 'high'
    if (keyword.length > 10) return 'low'
    return 'medium'
  }

  /**
   * 生成关键词建议
   */
  private generateKeywordVariations(keyword: string): string[] {
    return [
      `${keyword} 指南`,
      `${keyword} 技巧`,
      `${keyword} 最佳实践`,
      `如何 ${keyword}`,
      `${keyword} 教程`
    ]
  }

  /**
   * 获取类别关键词
   */
  private getCategoryKeywords(category?: string): string[] {
    const categoryMap: Record<string, string[]> = {
      'health': ['健康', '养生', '医疗', '锻炼', '营养'],
      'love': ['爱情', '浪漫', '关系', '约会', '婚姻'],
      'career': ['职业', '工作', '事业', '成功', '晋升'],
      'education': ['学习', '教育', '知识', '技能', '培训'],
      'travel': ['旅行', '旅游', '探索', '冒险', '目的地'],
      'family': ['家庭', '亲情', '父母', '孩子', '和谐']
    }

    return categoryMap[category || ''] || []
  }

  /**
   * 获取相关关键词
   */
  private getRelatedKeywords(keywords: string[]): string[] {
    const related: string[] = []
    
    keywords.forEach(keyword => {
      if (keyword.includes('愿望')) {
        related.push('希望', '梦想', '期待', '憧憬')
      } else if (keyword.includes('祝福')) {
        related.push('祈愿', '祝愿', '美好', '幸福')
      }
    })

    return related
  }

  /**
   * 生成长尾关键词
   */
  private generateLongTailKeywords(keywords: string[]): string[] {
    const longTail: string[] = []
    
    keywords.forEach(keyword => {
      longTail.push(
        `${keyword} 是什么`,
        `${keyword} 怎么做`,
        `${keyword} 的好处`,
        `${keyword} 注意事项`
      )
    })

    return longTail.slice(0, 10)
  }

  /**
   * 检查是否包含情感词汇
   */
  private hasEmotionalWords(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/)
    return words.some(word => 
      this.positiveWords.has(word) || this.negativeWords.has(word)
    )
  }

  /**
   * 生成优化后的标题
   */
  private generateOptimizedTitle(title: string, targetKeywords?: string[]): string {
    if (!targetKeywords || targetKeywords.length === 0) {
      return title
    }

    let optimized = title
    const mainKeyword = targetKeywords[0]

    // 如果标题中没有主关键词，尝试添加
    if (!title.toLowerCase().includes(mainKeyword.toLowerCase())) {
      optimized = `${mainKeyword} - ${title}`
    }

    // 确保长度合适
    if (optimized.length > 60) {
      optimized = optimized.substring(0, 57) + '...'
    }

    return optimized
  }

  /**
   * 生成优化后的描述
   */
  private generateOptimizedDescription(description: string, targetKeywords?: string[]): string {
    if (!targetKeywords || targetKeywords.length === 0) {
      return description
    }

    let optimized = description
    const mainKeyword = targetKeywords[0]

    // 如果描述中没有主关键词，尝试添加
    if (!description.toLowerCase().includes(mainKeyword.toLowerCase())) {
      optimized = `${description} 了解更多关于${mainKeyword}的信息。`
    }

    // 确保长度合适
    if (optimized.length > 160) {
      optimized = optimized.substring(0, 157) + '...'
    }

    return optimized
  }
}

// 创建全局SEO AI优化器实例
export const seoAI = new SEOAIOptimizer()

export default SEOAIOptimizer 