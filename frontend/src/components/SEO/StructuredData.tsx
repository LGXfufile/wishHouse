import React from 'react'
import { useTranslation } from 'react-i18next'
import { Wish } from '../../types'

interface StructuredDataProps {
  type: 'website' | 'article' | 'breadcrumb' | 'organization'
  data?: any
  wish?: Wish
  breadcrumbs?: Array<{ name: string; url: string }>
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data, wish, breadcrumbs }) => {
  const { i18n } = useTranslation()
  
  const generateWebsiteSchema = () => {
    const siteName = i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
    const description = i18n.language === 'zh' 
      ? '与世界分享你的愿望和祝福。在心愿灯塔，每个愿望都值得被点亮。'
      : 'Share your wishes and blessings with the world. At Wish Lighthouse, every wish deserves to be lit up.'
    
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "description": description,
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/wish-wall?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "url": window.location.origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/images/logo.png`
        }
      },
      "inLanguage": [
        {
          "@type": "Language",
          "name": "English",
          "alternateName": "en"
        },
        {
          "@type": "Language", 
          "name": "Chinese",
          "alternateName": "zh"
        }
      ]
    }
  }

  const generateArticleSchema = (wish: Wish) => {
    const siteName = i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
    
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": wish.content.substring(0, 100) + (wish.content.length > 100 ? '...' : ''),
      "description": wish.content,
      "author": wish.isAnonymous ? {
        "@type": "Person",
        "name": "Anonymous User"
      } : {
        "@type": "Person",
        "name": wish.author?.name || "User"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "url": window.location.origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/images/logo.png`
        }
      },
      "datePublished": wish.createdAt,
      "dateModified": wish.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.origin}/wish/${wish._id}`
      },
      "image": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/images/wish-card-default.jpg`,
        "width": 1200,
        "height": 630
      },
      "keywords": [
        wish.category,
        i18n.language === 'zh' ? '愿望' : 'wish',
        i18n.language === 'zh' ? '祝福' : 'blessing'
      ].join(','),
      "articleSection": wish.category,
      "wordCount": wish.content.length,
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": wish.likes
      }
    }
  }

  const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }
  }

  const generateOrganizationSchema = () => {
    const siteName = i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
    const description = i18n.language === 'zh' 
      ? '全球心愿分享社区，让每个愿望都被看见和祝福'
      : 'Global wish sharing community where every wish is seen and blessed'
    
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "description": description,
      "url": window.location.origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/images/logo.png`,
        "width": 200,
        "height": 200
      },
      "sameAs": [
        // 添加社交媒体链接
        "https://twitter.com/wishlighthouse",
        "https://facebook.com/wishlighthouse"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@wishlighthouse.com"
      },
      "foundingDate": "2024-01-01",
      "keywords": i18n.language === 'zh' 
        ? '愿望,祝福,心愿,社区,分享,正能量,希望,梦想'
        : 'wishes,blessings,community,sharing,positive energy,hope,dreams'
    }
  }

  const generateSchema = () => {
    switch (type) {
      case 'website':
        return generateWebsiteSchema()
      case 'article':
        return wish ? generateArticleSchema(wish) : null
      case 'breadcrumb':
        return breadcrumbs ? generateBreadcrumbSchema(breadcrumbs) : null
      case 'organization':
        return generateOrganizationSchema()
      default:
        return data || null
    }
  }

  const schema = generateSchema()

  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}

export default StructuredData 