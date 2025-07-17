import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Wish, CreateWishRequest, PaginatedResponse } from '../types'
import { getMockWishes, createMockWish, toggleMockLike } from '../services/mockData'

// Get wishes - 使用 mock 数据
export const useWishes = (page = 1, limit = 10, category?: string, sort = 'createdAt') => {
  return useQuery(
    ['wishes', page, limit, category, sort], 
    () => getMockWishes(page, limit, category, sort),
    {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Error fetching wishes:', error)
      }
    }
  )
}

// Create wish - 使用 mock 数据
export const useCreateWish = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    createMockWish,
    {
      onSuccess: () => {
        // Invalidate and refetch wishes
        queryClient.invalidateQueries(['wishes'])
      },
      onError: (error) => {
        console.error('Error creating wish:', error)
      }
    }
  )
}

// Toggle like - 使用 mock 数据
export const useToggleLike = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    toggleMockLike,
    {
      onSuccess: () => {
        // Invalidate and refetch wishes
        queryClient.invalidateQueries(['wishes'])
      },
      onError: (error) => {
        console.error('Error toggling like:', error)
      }
    }
  )
} 