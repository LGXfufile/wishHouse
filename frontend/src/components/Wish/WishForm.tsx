import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Send, Sparkles } from 'lucide-react'
import { CreateWishRequest, WishCategory } from '../../types'
import { useCreateWish } from '../../hooks/useWishes'
import { useUserTracking } from '../../hooks/useUserTracking'

interface WishFormProps {
  onSubmit?: (wish: CreateWishRequest) => void
}

const WishForm: React.FC<WishFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation()
  const createWishMutation = useCreateWish()
  const { trackWishSubmission, trackFormInteraction, trackCustomEvent } = useUserTracking()
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateWishRequest>()

  const categories: WishCategory[] = ['health', 'career', 'love', 'study', 'family', 'wealth', 'other']

  // 监控表单字段变化
  const watchedContent = watch('content')
  const watchedCategory = watch('category')
  const watchedIsAnonymous = watch('isAnonymous')

  const handleFormSubmit = async (data: CreateWishRequest) => {
    try {
      // 追踪心愿提交
      trackWishSubmission({
        category: data.category,
        isAnonymous: data.isAnonymous,
        content: data.content,
        contentLength: data.content?.length || 0
      })

      if (onSubmit) {
        onSubmit(data)
        trackCustomEvent('wish_form_custom_submit', { category: data.category })
      } else {
        await createWishMutation.mutateAsync(data)
        alert(t('wish.submitSuccess'))
        reset()
        trackCustomEvent('wish_submit_success', { category: data.category })
      }
    } catch (error) {
      console.error('Error submitting wish:', error)
      alert('Failed to submit wish. Please try again.')
      trackCustomEvent('wish_submit_error', { 
        error: (error as Error).message,
        category: data.category 
      })
    }
  }

  // 处理文本框交互
  const handleContentInteraction = (action: string) => {
    trackFormInteraction('wish_form', action, 'content')
  }

  // 处理类别选择
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    trackFormInteraction('wish_form', 'category_select', 'category')
    trackCustomEvent('category_selected', { 
      category: value,
      previousCategory: watchedCategory 
    })
  }

  // 处理匿名选择
  const handleAnonymousChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    trackFormInteraction('wish_form', 'anonymous_toggle', 'isAnonymous')
    trackCustomEvent('anonymous_toggle', { 
      isAnonymous: isChecked 
    })
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
            onFocus={() => handleContentInteraction('focus')}
            {...register('content', { 
              required: 'Wish content is required',
              minLength: { value: 10, message: 'Wish must be at least 10 characters' },
              maxLength: { value: 500, message: 'Wish must be less than 500 characters' },
              onBlur: () => handleContentInteraction('blur'),
              onChange: (e) => {
                // 追踪内容长度变化
                if (e.target.value.length > 0 && e.target.value.length % 50 === 0) {
                  trackCustomEvent('content_length_milestone', {
                    length: e.target.value.length,
                    milestone: Math.floor(e.target.value.length / 50) * 50
                  })
                }
              }
            })}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
          {/* 字数统计显示 */}
          <div className="mt-1 text-xs text-gray-500 text-right">
            {watchedContent?.length || 0}/500 字符
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            {t('wish.category')}
          </label>
          <select
            id="category"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onFocus={() => trackFormInteraction('wish_form', 'category_focus', 'category')}
            {...register('category', { 
              required: 'Please select a category',
              onChange: handleCategoryChange
            })}
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
            onFocus={() => trackFormInteraction('wish_form', 'anonymous_focus', 'isAnonymous')}
            {...register('isAnonymous', {
              onChange: handleAnonymousChange
            })}
          />
          <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
            {t('wish.isAnonymous')}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            if (!isSubmitting) {
              trackCustomEvent('submit_button_click', {
                contentLength: watchedContent?.length || 0,
                category: watchedCategory,
                isAnonymous: watchedIsAnonymous
              })
            }
          }}
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