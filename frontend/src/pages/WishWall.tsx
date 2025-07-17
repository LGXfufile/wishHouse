import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, Heart, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import WishCard from '../components/Wish/WishCard'
import StructuredData from '../components/SEO/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { WishCategory } from '../types'
import { useWishes } from '../hooks/useWishes'

const WishWall: React.FC = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'time' | 'popular'>('time')
  const [page, setPage] = useState(1)

  // SEO配置
  const seoTitle = selectedCategory === 'all' 
    ? t('wishWall.title')
    : `${t(`wish.categories.${selectedCategory}`)} ${t('wishWall.title')}`
  
  const seoDescription = selectedCategory === 'all'
    ? t('wishWall.subtitle')
    : `${t('wishWall.subtitle')} - ${t(`wish.categories.${selectedCategory}`)} category`

  useSEO({
    title: seoTitle,
    description: seoDescription,
    type: 'website',
    keywords: t('i18n.language') === 'zh' 
      ? `愿望墙,${selectedCategory !== 'all' ? t(`wish.categories.${selectedCategory}`) : ''},许愿,祝福,社区,分享`
      : `wish wall,${selectedCategory !== 'all' ? selectedCategory : ''},wishes,blessings,community,sharing`
  })

  const { data, isLoading, error } = useWishes(
    page, 
    12, 
    selectedCategory === 'all' ? undefined : selectedCategory,
    sortBy === 'popular' ? 'popular' : 'createdAt'
  )

  const categories: (WishCategory | 'all')[] = ['all', 'health', 'career', 'love', 'study', 'family', 'wealth', 'other']

  // 生成面包屑导航数据
  const breadcrumbs = [
    { name: t('nav.home'), url: '/' },
    { name: t('nav.wishWall'), url: '/wish-wall' }
  ]

  if (selectedCategory !== 'all') {
    breadcrumbs.push({
      name: t(`wish.categories.${selectedCategory}`),
      url: `/wish-wall?category=${selectedCategory}`
    })
  }

  const handleCategoryChange = (category: WishCategory | 'all') => {
    setSelectedCategory(category)
    setPage(1) // Reset to first page when filtering
  }

  const handleSortChange = (newSort: 'time' | 'popular') => {
    setSortBy(newSort)
    setPage(1) // Reset to first page when sorting
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Failed to load wishes</p>
          <p className="text-gray-500">Please make sure the backend server is running</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO结构化数据 */}
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{seoTitle}</h1>
            <p className="text-xl text-gray-600">{seoDescription}</p>
          </div>

          {/* Filters */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? t('wishWall.filterAll') : t(`wish.categories.${category}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSortChange('time')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === 'time'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{t('wishWall.sortByTime')}</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('popular')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === 'popular'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>{t('wishWall.sortByPopular')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wishes Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="ml-2 text-gray-600">{t('common.loading')}</span>
            </div>
          ) : data?.wishes && data.wishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.wishes.map((wish, index) => (
                <motion.div
                  key={wish._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <WishCard wish={wish} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">{t('wishWall.noWishes')}</p>
            </div>
          )}

          {/* Load More Button */}
          {data?.wishes && data.wishes.length > 0 && data.page < data.totalPages && (
            <div className="text-center">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="btn-primary px-8 py-3"
              >
                {t('wishWall.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default WishWall 