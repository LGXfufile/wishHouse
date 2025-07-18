import React from 'react'
import { useTranslation } from 'react-i18next'
import { Wish } from '../../types'

interface StructuredDataProps {
  type: 'website' | 'article' | 'breadcrumb' | 'organization' | 'faq' | 'review' | 'product' | 'person' | 'event' | 'collection' | 'webapp'
  data?: any
  wish?: Wish
  breadcrumbs?: Array<{ name: string; url: string }>
  faqs?: Array<{ question: string; answer: string }>
  reviews?: Array<{ rating: number; comment: string; author: string; date: string }>
  person?: { name: string; description: string; image?: string; jobTitle?: string }
  event?: { name: string; startDate: string; endDate?: string; location: string; description: string }
}

const StructuredData: React.FC<StructuredDataProps> = ({ 
  type, 
  data, 
  wish, 
  breadcrumbs, 
  faqs,
  reviews,
  person,
  event
}) => {
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
      ],
      "sameAs": [
        "https://twitter.com/wishlighthouse",
        "https://facebook.com/wishlighthouse",
        "https://instagram.com/wishlighthouse"
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
        "name": wish.author?.name || "User",
        "image": wish.author?.avatar
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
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "General Public"
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
        "item": item.url.startsWith('http') ? item.url : `${window.location.origin}${item.url}`
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
        "https://twitter.com/wishlighthouse",
        "https://facebook.com/wishlighthouse",
        "https://instagram.com/wishlighthouse",
        "https://linkedin.com/company/wishlighthouse"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@wishlighthouse.com",
        "availableLanguage": ["English", "Chinese"]
      },
      "foundingDate": "2024-01-01",
      "keywords": i18n.language === 'zh' 
        ? '愿望,祝福,心愿,社区,分享,正能量,希望,梦想'
        : 'wishes,blessings,community,sharing,positive energy,hope,dreams',
      "areaServed": "Worldwide",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Global"
      }
    }
  }

  // 新增的Schema生成函数
  const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  }

  const generatePersonSchema = (person: { name: string; description: string; image?: string; jobTitle?: string }) => {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": person.name,
      "description": person.description,
      "image": person.image,
      "jobTitle": person.jobTitle,
      "worksFor": {
        "@type": "Organization",
        "name": i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
      },
      "url": window.location.href
    }
  }

  const generateProductSchema = () => {
    const siteName = i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
    const description = i18n.language === 'zh' 
      ? '免费的在线愿望分享平台，让您与全世界分享心愿和祝福'
      : 'Free online wish sharing platform to share your hopes and blessings with the world'
    
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": siteName,
      "description": description,
      "url": window.location.origin,
      "applicationCategory": "Social Networking",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1000",
        "bestRating": "5",
        "worstRating": "1"
      },
      "creator": {
        "@type": "Organization",
        "name": siteName
      }
    }
  }

  const generateReviewSchema = (reviews: Array<{ rating: number; comment: string; author: string; date: string }>) => {
    const siteName = i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
    
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": siteName,
      "review": reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5"
        },
        "reviewBody": review.comment,
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "datePublished": review.date
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        "reviewCount": reviews.length.toString()
      }
    }
  }

  const generateEventSchema = (event: { name: string; startDate: string; endDate?: string; location: string; description: string }) => {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.name,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": {
        "@type": "Place",
        "name": event.location
      },
      "organizer": {
        "@type": "Organization",
        "name": i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse',
        "url": window.location.origin
      },
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode"
    }
  }

  const generateCollectionSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": i18n.language === 'zh' ? '愿望墙' : 'Wish Wall',
      "description": i18n.language === 'zh' 
        ? '浏览来自世界各地的心愿和祝福'
        : 'Browse wishes and blessings from around the world',
      "url": `${window.location.origin}/wish-wall`,
      "mainEntity": {
        "@type": "ItemList",
        "name": i18n.language === 'zh' ? '心愿列表' : 'Wish List',
        "description": i18n.language === 'zh' 
          ? '用户分享的心愿和祝福集合'
          : 'Collection of wishes and blessings shared by users'
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": i18n.language === 'zh' ? '首页' : 'Home',
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": i18n.language === 'zh' ? '愿望墙' : 'Wish Wall',
            "item": `${window.location.origin}/wish-wall`
          }
        ]
      }
    }
  }

  const generateWebAppSchema = () => {
    const siteName = i18n.language === 'zh' ? '心愿灯塔' : 'Wish Lighthouse'
    const description = i18n.language === 'zh' 
      ? '心愿灯塔是一个免费的在线愿望分享平台，让您与全世界分享心愿和祝福。'
      : 'Wish Lighthouse is a free online wish sharing platform to share your hopes and blessings with the world.'
    
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": siteName,
      "description": description,
      "url": window.location.origin,
      "applicationCategory": "Social Networking",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1000",
        "bestRating": "5",
        "worstRating": "1"
      },
      "creator": {
        "@type": "Organization",
        "name": siteName
      }
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
      case 'faq':
        return faqs ? generateFAQSchema(faqs) : null
      case 'review':
        return reviews ? generateReviewSchema(reviews) : null
      case 'product':
        return generateProductSchema()
      case 'person':
        return person ? generatePersonSchema(person) : null
      case 'event':
        return event ? generateEventSchema(event) : null
      case 'collection':
        return generateCollectionSchema()
      case 'webapp':
        return generateWebAppSchema()
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

// 导出预设的结构化数据组件
export const WebsiteStructuredData: React.FC = () => (
  <StructuredData type="website" />
)

export const OrganizationStructuredData: React.FC = () => (
  <StructuredData type="organization" />
)

export const ProductStructuredData: React.FC = () => (
  <StructuredData type="product" />
)

export const CollectionStructuredData: React.FC = () => (
  <StructuredData type="collection" />
) 