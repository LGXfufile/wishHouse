import { Request, Response } from 'express'

// Mock data for demo
let mockWishes = [
  {
    _id: '1',
    content: 'I wish for good health for my family and myself in the coming year.',
    category: 'health',
    isAnonymous: false,
    author: {
      _id: 'user1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9997188?w=150'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    likes: 42,
    likedBy: []
  },
  {
    _id: '2',
    content: 'May I find the courage to pursue my dreams and start my own business.',
    category: 'career',
    isAnonymous: true,
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    likes: 28,
    likedBy: []
  },
  {
    _id: '3',
    content: 'I hope to meet someone special who truly understands and loves me.',
    category: 'love',
    isAnonymous: false,
    author: {
      _id: 'user3',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    likes: 67,
    likedBy: []
  },
  {
    _id: '4',
    content: 'I wish for my parents to stay healthy and happy for many years to come.',
    category: 'family',
    isAnonymous: false,
    author: {
      _id: 'user4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    likes: 89,
    likedBy: []
  }
]

// Get all wishes with pagination and filtering
export const getWishes = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sort = 'createdAt'
    } = req.query

    let filteredWishes = [...mockWishes]

    // Apply category filter
    if (category && category !== 'all') {
      filteredWishes = filteredWishes.filter(wish => wish.category === category)
    }

    // Apply sorting
    if (sort === 'popular') {
      filteredWishes.sort((a, b) => b.likes - a.likes)
    } else {
      filteredWishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Apply pagination
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedWishes = filteredWishes.slice(startIndex, endIndex)

    const result = {
      wishes: paginatedWishes,
      total: filteredWishes.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredWishes.length / limitNum)
    }

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching wishes:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishes'
    })
  }
}

// Create a new wish
export const createWish = async (req: Request, res: Response) => {
  try {
    const { content, category, isAnonymous = false } = req.body

    const newWish = {
      _id: Date.now().toString(),
      content,
      category,
      isAnonymous,
      author: isAnonymous ? undefined : {
        _id: 'demo-user',
        name: 'Demo User',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    }

    mockWishes.unshift(newWish)

    res.status(201).json({
      success: true,
      data: newWish,
      message: 'Wish created successfully'
    })
  } catch (error) {
    console.error('Error creating wish:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create wish'
    })
  }
}

// Get wish by ID
export const getWishById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const wish = mockWishes.find(w => w._id === id)

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: 'Wish not found'
      })
    }

    res.json({
      success: true,
      data: wish
    })
  } catch (error) {
    console.error('Error fetching wish:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wish'
    })
  }
}

// Toggle like on a wish
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = 'demo-user-id'

    const wishIndex = mockWishes.findIndex(w => w._id === id)

    if (wishIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Wish not found'
      })
    }

    const wish = mockWishes[wishIndex]
    const isLiked = wish.likedBy.includes(userId)

    if (isLiked) {
      // Remove like
      wish.likedBy = wish.likedBy.filter(uid => uid !== userId)
      wish.likes = Math.max(0, wish.likes - 1)
    } else {
      // Add like
      wish.likedBy.push(userId)
      wish.likes += 1
    }

    wish.updatedAt = new Date().toISOString()
    mockWishes[wishIndex] = wish

    res.json({
      success: true,
      data: {
        wishId: wish._id,
        likes: wish.likes,
        isLiked: !isLiked
      },
      message: isLiked ? 'Like removed' : 'Wish liked'
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    })
  }
} 