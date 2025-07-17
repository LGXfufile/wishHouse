import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Send, Sparkles } from 'lucide-react'
import { CreateWishRequest, WishCategory } from '../../types'
import { useCreateWish } from '../../hooks/useWishes'

interface WishFormProps {
  onSubmit?: (wish: CreateWishRequest) => void
}

const WishForm: React.FC<WishFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation()
  const createWishMutation = useCreateWish()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWishRequest>()

  const categories: WishCategory[] = ['health', 'career', 'love', 'study', 'family', 'wealth', 'other']

  const handleFormSubmit = async (data: CreateWishRequest) => {
    try {
      if (onSubmit) {
        onSubmit(data)
      } else {
        await createWishMutation.mutateAsync(data)
        alert(t('wish.submitSuccess'))
        reset()
      }
    } catch (error) {
      console.error('Error submitting wish:', error)
      alert('Failed to submit wish. Please try again.')
    }
  }

  const isSubmitting = createWishMutation.isLoading

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Wish Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            {t('wish.content')}
          </label>
          <textarea
            id="content"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder={t('wish.contentPlaceholder')}
            {...register('content', { 
              required: 'Wish content is required',
              minLength: { value: 10, message: 'Wish must be at least 10 characters' },
              maxLength: { value: 500, message: 'Wish must be less than 500 characters' }
            })}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            {t('wish.category')}
          </label>
          <select
            id="category"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            {...register('category', { required: 'Please select a category' })}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {t(`wish.categories.${category}`)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            id="isAnonymous"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            {...register('isAnonymous')}
          />
          <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
            {t('wish.isAnonymous')}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary text-lg py-3 flex items-center justify-center space-x-2 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Creating your wish...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{t('common.submit')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default WishForm 