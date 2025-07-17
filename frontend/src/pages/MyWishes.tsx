import React from 'react'
import { useTranslation } from 'react-i18next'
import { Star, Heart, Calendar, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import WishCard from '../components/Wish/WishCard'
import { Wish } from '../types'

const MyWishes: React.FC = () => {
  const { t } = useTranslation()

  // Mock user wishes - replace with actual API call
  const userWishes: Wish[] = [
    {
      _id: '1',
      content: 'I wish for good health for my family and myself in the coming year.',
      category: 'health',
      isAnonymous: false,
      author: {
        _id: 'current-user',
        name: 'You',
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      likes: 42,
      isLiked: false
    }
  ]

  const stats = {
    totalWishes: userWishes.length,
    totalLikes: userWishes.reduce((sum, wish) => sum + wish.likes, 0),
    recentWishes: userWishes.filter(wish => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(wish.createdAt) > weekAgo
    }).length
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('profile.title')}</h1>
          <p className="text-xl text-gray-600">Manage your wishes and track their journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-6 text-center"
          >
            <Star className="w-12 h-12 text-gold-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalWishes}</h3>
            <p className="text-gray-600">{t('profile.totalWishes')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6 text-center"
          >
            <Heart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalLikes}</h3>
            <p className="text-gray-600">{t('profile.totalLikes')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-6 text-center"
          >
            <Calendar className="w-12 h-12 text-sage-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.recentWishes}</h3>
            <p className="text-gray-600">Recent Wishes (7 days)</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/" className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Wish</span>
          </Link>
          <Link to="/wish-wall" className="btn-secondary text-lg px-8 py-3">
            Explore Wish Wall
          </Link>
        </div>

        {/* My Wishes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">{t('profile.myWishes')}</h2>
          
          {userWishes.length === 0 ? (
            <div className="card p-12 text-center">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No wishes yet</h3>
              <p className="text-gray-500 mb-6">Start by creating your first wish!</p>
              <Link to="/" className="btn-primary">
                Create Your First Wish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userWishes.map((wish, index) => (
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
        </div>
      </div>
    </div>
  )
}

export default MyWishes 