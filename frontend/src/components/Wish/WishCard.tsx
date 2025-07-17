import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Share2, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Wish } from '../../types'
import { useToggleLike } from '../../hooks/useWishes'

interface WishCardProps {
  wish: Wish
  onShare?: (wish: Wish) => void
}

const WishCard: React.FC<WishCardProps> = ({ wish, onShare }) => {
  const { t } = useTranslation()
  const [isLiked, setIsLiked] = useState(wish.isLiked || false)
  const [likesCount, setLikesCount] = useState(wish.likes)
  const toggleLikeMutation = useToggleLike()

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked
      setIsLiked(newIsLiked)
      setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1)
      
      await toggleLikeMutation.mutateAsync(wish._id)
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
      console.error('Failed to toggle like:', error)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(wish)
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: 'Wish from Wish Lighthouse',
          text: wish.content,
          url: window.location.href
        }).catch(console.error)
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${wish.content} - Shared from Wish Lighthouse`).then(() => {
          alert('Wish copied to clipboard!')
        }).catch(console.error)
      }
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      health: '🏥',
      career: '💼',
      love: '💕',
      study: '📚',
      family: '👨‍👩‍👧‍👦',
      wealth: '💰',
      other: '⭐'
    }
    return icons[category as keyof typeof icons] || '⭐'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800',
      career: 'bg-blue-100 text-blue-800',
      love: 'bg-pink-100 text-pink-800',
      study: 'bg-purple-100 text-purple-800',
      family: 'bg-yellow-100 text-yellow-800',
      wealth: 'bg-emerald-100 text-emerald-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="wish-card group relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {wish.isAnonymous ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          ) : (
            <img
              src={wish.author?.avatar || `https://ui-avatars.com/api/?name=${wish.author?.name}&background=random`}
              alt={wish.author?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">
              {wish.isAnonymous ? t('common.anonymous') : wish.author?.name}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(wish.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(wish.category)}`}>
          <span className="mr-1">{getCategoryIcon(wish.category)}</span>
          {t(`wish.categories.${wish.category}`)}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-800 leading-relaxed">{wish.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={toggleLikeMutation.isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isLiked
              ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${toggleLikeMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{t('common.share')}</span>
        </button>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-gold-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

export default WishCard 