import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, Heart, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import WishCard from '../components/Wish/WishCard'
import { WishCategory } from '../types'
import { useWishes } from '../hooks/useWishes'

const WishWall: React.FC = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'time' | 'popular'>('time')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useWishes(
    page, 
    12, 
    selectedCategory === 'all' ? undefined : selectedCategory,
    sortBy === 'popular' ? 'popular' : 'createdAt'
  )

  const categories: (WishCategory | 'all')[] = ['all', 'health', 'career', 'love', 'study', 'family', 'wealth', 'other']

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
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('wishWall.title')}</h1>
          <p className="text-xl text-gray-600">{t('wishWall.subtitle')}</p>
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
              <button
                onClick={() => handleSortChange('time')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'time'
                    ? 'bg-gold-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{t('wishWall.sortByTime')}</span>
              </button>
              <button
                onClick={() => handleSortChange('popular')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-gold-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{t('wishWall.sortByPopular')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span className="ml-2 text-gray-600">{t('common.loading')}</span>
          </div>
        )}

        {/* Wishes Grid */}
        {!isLoading && data && (
          <>
            {data.wishes.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">{t('wishWall.noWishes')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.wishes.map((wish, index) => (
                  <motion.div
                    key={wish._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <WishCard wish={wish} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {data.wishes.length > 0 && page < data.totalPages && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => setPage(prev => prev + 1)}
                  className="btn-secondary px-8 py-3"
                >
                  {t('wishWall.loadMore')}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {data.wishes.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                Showing {((page - 1) * 12) + 1} - {Math.min(page * 12, data.total)} of {data.total} wishes
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WishWall 