import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Star, Heart, Sparkles, Users, Filter, Clock, TrendingUp, Loader2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import WishForm from '../components/Wish/WishForm'
import WishCard from '../components/Wish/WishCard'
import StructuredData, { ProductStructuredData } from '../components/SEO/StructuredData'
import { HeroImage } from '../components/UI/OptimizedImage'
import { useSEO } from '../hooks/useSEO'
import { useWishes } from '../hooks/useWishes'
import { WishCategory } from '../types'

const Home: React.FC = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'time' | 'popular'>('time')
  const [showWishForm, setShowWishForm] = useState(false)
  const [page] = useState(1)

  // SEO配置
  useSEO({
    title: t('app.title'),
    description: t('app.subtitle'),
    type: 'website',
    keywords: t('i18n.language') === 'zh' 
      ? '愿望,祝福,心愿,社区,分享,正能量,希望,梦想,许愿,点亮,心愿墙'
      : 'wishes,blessings,community,sharing,positive energy,hope,dreams,lighthouse,make wish,light up,wish wall'
  })

  const { data, isLoading, error } = useWishes(
    page, 
    9, // 首页显示9个心愿
    selectedCategory === 'all' ? undefined : selectedCategory,
    sortBy === 'popular' ? 'popular' : 'createdAt'
  )

  const categories: (WishCategory | 'all')[] = ['all', 'health', 'career', 'love', 'study', 'family', 'wealth', 'other']

  const features = [
    {
      icon: <Star className="w-6 h-6 text-gold-500" />,
      title: "许愿",
      description: "分享您的心愿"
    },
    {
      icon: <Heart className="w-6 h-6 text-primary-500" />,
      title: "点亮",
      description: "为他人的心愿加油"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-sage-500" />,
      title: "祝福",
      description: "传递正能量"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: "社区",
      description: "连接有爱的人们"
    }
  ]

  return (
    <>
      {/* SEO结构化数据 */}
      <StructuredData type="website" />
      <ProductStructuredData />
      
      <div className="min-h-screen">
        {/* Hero Section - 简化版 */}
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-sage-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-gold-600 bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                  {t('app.subtitle')}
                </p>
                
                {/* 快速功能介绍 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm"
                    >
                      <div className="flex justify-center mb-2">{feature.icon}</div>
                      <h3 className="font-semibold text-sm text-gray-800">{feature.title}</h3>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA按钮 */}
                <motion.button
                  onClick={() => setShowWishForm(true)}
                  className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  许个心愿
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 心愿墙主要内容 */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* 页面标题和筛选 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  💫 心愿墙
                </h2>
                <p className="text-gray-600">
                  探索来自世界各地的美好心愿
                </p>
              </div>

              {/* 筛选和排序 */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                {/* 分类筛选 */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as WishCategory | 'all')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="all">{t('wishWall.allCategories')}</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {t(`wish.categories.${category}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 排序方式 */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'time' | 'popular')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="time">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {t('wishWall.sortByTime')}
                    </option>
                    <option value="popular">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {t('wishWall.sortByPopular')}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* 心愿卡片网格 */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <span className="ml-2 text-gray-600">加载心愿中...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">加载失败，请稍后重试</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  重新加载
                </button>
              </div>
            ) : (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {data?.wishes?.map((wish, index) => (
                  <motion.div
                    key={wish._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <WishCard wish={wish} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 查看更多按钮 */}
            <div className="text-center mt-8">
              <Link
                to="/wish-wall"
                className="btn-secondary px-6 py-3 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                查看更多心愿
              </Link>
            </div>
          </div>
        </section>

        {/* 心愿表单模态框 */}
        {showWishForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">✨ 许个心愿</h3>
                  <button
                    onClick={() => setShowWishForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <WishForm onSubmit={() => {
                  setShowWishForm(false)
                  // 刷新心愿列表
                  window.location.reload()
                }} />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

export default Home 