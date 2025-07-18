/**
 * 图片优化工具类
 * 功能：响应式图片、懒加载、WebP支持、SEO优化
 */

export interface ImageConfig {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
}

export interface ResponsiveImageConfig extends ImageConfig {
  srcSet?: string
  sizes?: string
}

/**
 * 生成响应式图片配置
 */
export const createResponsiveImage = (
  baseSrc: string,
  alt: string,
  options: Partial<ResponsiveImageConfig> = {}
): ResponsiveImageConfig => {
  const {
    width = 800,
    height = 600,
    loading = 'lazy',
    quality = 85,
    format = 'webp'
  } = options

  // 生成不同尺寸的图片URL
  const sizes = [400, 800, 1200, 1600]
  const srcSet = sizes
    .map(size => `${generateOptimizedUrl(baseSrc, { width: size, quality, format })} ${size}w`)
    .join(', ')

  return {
    src: generateOptimizedUrl(baseSrc, { width, height, quality, format }),
    alt: optimizeAltText(alt),
    srcSet,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    width,
    height,
    loading,
    ...options
  }
}

/**
 * 生成优化后的图片URL
 */
export const generateOptimizedUrl = (
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
  } = {}
): string => {
  const { width, height, quality = 85, format = 'webp' } = options
  
  // 如果是外部URL，直接返回
  if (src.startsWith('http')) {
    return src
  }

  // 构建优化参数
  const params = new URLSearchParams()
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  if (quality !== 85) params.append('q', quality.toString())
  if (format !== 'jpg') params.append('f', format)

  const paramString = params.toString()
  return paramString ? `${src}?${paramString}` : src
}

/**
 * 优化Alt文本，提升SEO价值
 */
export const optimizeAltText = (alt: string): string => {
  if (!alt) return ''
  
  // 移除多余的空格和换行
  let optimized = alt.trim().replace(/\s+/g, ' ')
  
  // 限制长度（建议125字符以内）
  if (optimized.length > 125) {
    optimized = optimized.substring(0, 122) + '...'
  }
  
  return optimized
}

/**
 * 检查浏览器是否支持WebP
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * 获取适合的图片格式
 */
export const getOptimalFormat = (): 'webp' | 'jpg' => {
  return supportsWebP() ? 'webp' : 'jpg'
}

/**
 * 预加载关键图片
 */
export const preloadImage = (src: string, options: { priority?: boolean } = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
    
    // 高优先级图片
    if (options.priority && 'fetchPriority' in img) {
      ;(img as any).fetchPriority = 'high'
    }
  })
}

/**
 * 懒加载图片实现
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null
  
  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              this.loadImage(img)
              this.observer?.unobserve(img)
            }
          })
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      )
    }
  }
  
  observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img)
    } else {
      // 回退：直接加载图片
      this.loadImage(img)
    }
  }
  
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src
    const srcSet = img.dataset.srcset
    
    if (src) {
      img.src = src
      img.removeAttribute('data-src')
    }
    
    if (srcSet) {
      img.srcset = srcSet
      img.removeAttribute('data-srcset')
    }
    
    img.classList.remove('lazy-loading')
    img.classList.add('lazy-loaded')
  }
  
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

/**
 * SEO图片预设配置
 */
export const SEO_IMAGE_PRESETS = {
  // Open Graph 图片
  ogImage: {
    width: 1200,
    height: 630,
    quality: 90,
    format: 'jpg' as const
  },
  
  // Twitter Card 图片
  twitterCard: {
    width: 1200,
    height: 675,
    quality: 90,
    format: 'jpg' as const
  },
  
  // 愿望卡片缩略图
  wishThumbnail: {
    width: 400,
    height: 300,
    quality: 85,
    format: 'webp' as const
  },
  
  // 用户头像
  avatar: {
    width: 120,
    height: 120,
    quality: 90,
    format: 'webp' as const
  },
  
  // 首页英雄图
  hero: {
    width: 1920,
    height: 1080,
    quality: 85,
    format: 'webp' as const
  }
}

/**
 * 生成结构化数据图片对象
 */
export const createStructuredDataImage = (
  src: string,
  alt: string,
  width: number,
  height: number
) => {
  return {
    '@type': 'ImageObject',
    url: src.startsWith('http') ? src : `${window.location.origin}${src}`,
    width,
    height,
    caption: alt
  }
}

// 导出懒加载实例
export const lazyLoader = new LazyImageLoader() 