import React, { useEffect, useRef, useState } from 'react'
import { 
  createResponsiveImage, 
  preloadImage, 
  lazyLoader,
  ResponsiveImageConfig,
  SEO_IMAGE_PRESETS,
  createStructuredDataImage
} from '../../utils/imageOptimizer'

interface OptimizedImageProps extends Partial<ResponsiveImageConfig> {
  src: string
  alt: string
  preset?: keyof typeof SEO_IMAGE_PRESETS
  priority?: boolean
  structuredData?: boolean
  fallback?: string
  onLoad?: () => void
  onError?: () => void
  className?: string
  style?: React.CSSProperties
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  preset,
  priority = false,
  structuredData = false,
  fallback,
  onLoad,
  onError,
  className = '',
  style,
  ...options
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')

  // 应用预设配置
  const presetConfig = preset ? SEO_IMAGE_PRESETS[preset] : {}
  const finalOptions = { ...presetConfig, ...options }

  // 生成响应式图片配置
  const imageConfig = createResponsiveImage(src, alt, {
    ...finalOptions,
    loading: priority ? 'eager' : 'lazy'
  })

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    // 设置初始源
    if (priority) {
      // 高优先级图片立即加载
      img.src = imageConfig.src
      if (imageConfig.srcSet) {
        img.srcset = imageConfig.srcSet
      }
      
      // 预加载
      preloadImage(imageConfig.src, { priority: true })
        .catch(() => {
          if (fallback) {
            setCurrentSrc(fallback)
          }
        })
    } else {
      // 懒加载图片
      img.dataset.src = imageConfig.src
      if (imageConfig.srcSet) {
        img.dataset.srcset = imageConfig.srcSet
      }
      img.classList.add('lazy-loading')
      lazyLoader.observe(img)
    }

    setCurrentSrc(imageConfig.src)

    return () => {
      if (!priority) {
        lazyLoader.disconnect()
      }
    }
  }, [imageConfig.src, imageConfig.srcSet, priority, fallback])

  // 处理加载事件
  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
    onLoad?.()
  }

  // 处理错误事件
  const handleError = () => {
    setHasError(true)
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback)
      setHasError(false)
    } else {
      onError?.()
    }
  }

  // 生成结构化数据
  const structuredDataMarkup = structuredData && isLoaded ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          createStructuredDataImage(
            currentSrc,
            imageConfig.alt,
            imageConfig.width || 800,
            imageConfig.height || 600
          )
        )
      }}
    />
  ) : null

  return (
    <>
      <img
        ref={imgRef}
        alt={imageConfig.alt}
        width={imageConfig.width}
        height={imageConfig.height}
        sizes={imageConfig.sizes}
        loading={imageConfig.loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          ${className}
          ${!isLoaded ? 'opacity-0' : 'opacity-100'}
          ${hasError ? 'bg-gray-200' : ''}
          transition-opacity duration-300
        `.trim()}
        style={{
          aspectRatio: imageConfig.width && imageConfig.height 
            ? `${imageConfig.width} / ${imageConfig.height}` 
            : undefined,
          ...style
        }}
        // SEO属性
        itemProp={structuredData ? "image" : undefined}
      />
      
      {/* 加载占位符 */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{
            aspectRatio: imageConfig.width && imageConfig.height 
              ? `${imageConfig.width} / ${imageConfig.height}` 
              : undefined
          }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* 错误占位符 */}
      {hasError && !fallback && (
        <div 
          className="absolute inset-0 bg-gray-200 flex items-center justify-center"
          style={{
            aspectRatio: imageConfig.width && imageConfig.height 
              ? `${imageConfig.width} / ${imageConfig.height}` 
              : undefined
          }}
        >
          <div className="text-gray-500 text-sm text-center">
            <div>📷</div>
            <div>Image not available</div>
          </div>
        </div>
      )}
      
      {structuredDataMarkup}
    </>
  )
}

export default OptimizedImage

// 预设组件
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="hero" priority />
)

export const WishThumbnail: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="wishThumbnail" />
)

export const UserAvatar: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="avatar" />
)

export const OGImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="ogImage" structuredData />
) 