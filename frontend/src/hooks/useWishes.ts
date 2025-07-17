import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { Wish, CreateWishRequest, PaginatedResponse } from '../types'

const API_BASE_URL = '/api'

// Configure axios defaults
axios.defaults.timeout = 10000;

// Get wishes
export const useWishes = (page = 1, limit = 10, category?: string, sort = 'createdAt') => {
  return useQuery(
    ['wishes', page, limit, category, sort], 
    async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort
      })
      
      if (category && category !== 'all') {
        params.append('category', category)
      }

      console.log('Fetching wishes from:', `${API_BASE_URL}/wishes?${params}`)
      const response = await axios.get(`${API_BASE_URL}/wishes?${params}`)
      console.log('Response received:', response.data)
      return response.data.data as PaginatedResponse<Wish>
    },
    {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Error fetching wishes:', error)
      }
    }
  )
}

// Create wish
export const useCreateWish = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (wishData: CreateWishRequest) => {
      console.log('Creating wish:', wishData)
      const response = await axios.post(`${API_BASE_URL}/wishes`, wishData)
      console.log('Wish created:', response.data)
      return response.data.data as Wish
    },
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

// Toggle like
export const useToggleLike = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (wishId: string) => {
      console.log('Toggling like for wish:', wishId)
      const response = await axios.post(`${API_BASE_URL}/wishes/${wishId}/like`)
      console.log('Like toggled:', response.data)
      return response.data.data
    },
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