import { Wish, CreateWishRequest, PaginatedResponse, WishCategory } from '../types'

// Mock 心愿数据
const mockWishes: Wish[] = [
  {
    _id: '1',
    content: 'I hope to find my dream job in tech this year and make a positive impact on the world through innovation.',
    category: 'career' as WishCategory,
    isAnonymous: false,
    author: {
      name: 'Alice Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=4f46e5&color=fff'
    },
    likes: 24,
    isLiked: false,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    _id: '2',
    content: 'Wishing for good health and strength for my elderly parents. May they live many more happy years.',
    category: 'health' as WishCategory,
    isAnonymous: true,
    author: null,
    likes: 42,
    isLiked: true,
    createdAt: new Date('2024-01-14').toISOString()
  },
  {
    _id: '3',
    content: 'I wish to travel the world with my partner and create beautiful memories together. Starting with Japan! 🌸',
    category: 'love' as WishCategory,
    isAnonymous: false,
    author: {
      name: 'Michael Chen',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=059669&color=fff'
    },
    likes: 18,
    isLiked: false,
    createdAt: new Date('2024-01-13').toISOString()
  },
  {
    _id: '4',
    content: 'Hope to graduate with honors and make my family proud. All those late nights studying will be worth it!',
    category: 'study' as WishCategory,
    isAnonymous: false,
    author: {
      name: 'Sarah Kim',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=dc2626&color=fff'
    },
    likes: 15,
    isLiked: true,
    createdAt: new Date('2024-01-12').toISOString()
  },
  {
    _id: '5',
    content: 'Wishing for peace and harmony in our family. May we always support each other through thick and thin.',
    category: 'family' as WishCategory,
    isAnonymous: true,
    author: null,
    likes: 31,
    isLiked: false,
    createdAt: new Date('2024-01-11').toISOString()
  },
  {
    _id: '6',
    content: 'I hope to save enough money to buy my first home and create a warm, welcoming space for my loved ones.',
    category: 'wealth' as WishCategory,
    isAnonymous: false,
    author: {
      name: 'David Rodriguez',
      avatar: 'https://ui-avatars.com/api/?name=David+Rodriguez&background=ea580c&color=fff'
    },
    likes: 27,
    isLiked: false,
    createdAt: new Date('2024-01-10').toISOString()
  },
  {
    _id: '7',
    content: 'May our planet heal and recover. I wish for cleaner oceans, greener forests, and a sustainable future for all.',
    category: 'other' as WishCategory,
    isAnonymous: false,
    author: {
      name: 'Emma Green',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Green&background=16a34a&color=fff'
    },
    likes: 56,
    isLiked: true,
    createdAt: new Date('2024-01-09').toISOString()
  },
  {
    _id: '8',
    content: 'Hoping to overcome my anxiety and build more confidence in social situations. Taking it one day at a time.',
    category: 'health' as WishCategory,
    isAnonymous: true,
    author: null,
    likes: 38,
    isLiked: false,
    createdAt: new Date('2024-01-08').toISOString()
  },
  {
    _id: '9',
    content: 'I wish to launch my own startup and turn my innovative ideas into reality. The journey starts now!',
    category: 'career' as WishCategory,
    isAnonymous: false,
    author: {
      name: 'Alex Thompson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=7c3aed&color=fff'
    },
    likes: 22,
    isLiked: true,
    createdAt: new Date('2024-01-07').toISOString()
  },
  {
    _id: '10',
    content: 'Wishing to find true love and build a meaningful relationship with someone who understands and accepts me.',
    category: 'love' as WishCategory,
    isAnonymous: true,
    author: null,
    likes: 45,
    isLiked: false,
    createdAt: new Date('2024-01-06').toISOString()
  }
]

// Mock API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取心愿列表
export const getMockWishes = async (
  page = 1, 
  limit = 10, 
  category?: string, 
  sort = 'createdAt'
): Promise<PaginatedResponse<Wish>> => {
  await delay(500) // 模拟网络延迟

  let filteredWishes = [...mockWishes]

  // 按分类筛选
  if (category && category !== 'all') {
    filteredWishes = filteredWishes.filter(wish => wish.category === category)
  }

  // 排序
  if (sort === 'likes') {
    filteredWishes.sort((a, b) => b.likes - a.likes)
  } else {
    // 默认按创建时间排序（最新的在前）
    filteredWishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // 分页
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedWishes = filteredWishes.slice(startIndex, endIndex)

  return {
    wishes: paginatedWishes,
    total: filteredWishes.length,
    page,
    totalPages: Math.ceil(filteredWishes.length / limit),
    hasNext: endIndex < filteredWishes.length,
    hasPrev: page > 1
  }
}

// 创建心愿
export const createMockWish = async (wishData: CreateWishRequest): Promise<Wish> => {
  await delay(300)

  const newWish: Wish = {
    _id: Date.now().toString(),
    content: wishData.content,
    category: wishData.category,
    isAnonymous: wishData.isAnonymous || false,
    author: wishData.isAnonymous ? null : {
      name: 'Current User',
      avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff'
    },
    likes: 0,
    isLiked: false,
    createdAt: new Date().toISOString()
  }

  // 添加到 mock 数据开头
  mockWishes.unshift(newWish)

  return newWish
}

// 点赞/取消点赞
export const toggleMockLike = async (wishId: string): Promise<{ likes: number; isLiked: boolean }> => {
  await delay(200)

  const wish = mockWishes.find(w => w._id === wishId)
  if (!wish) {
    throw new Error('Wish not found')
  }

  wish.isLiked = !wish.isLiked
  wish.likes += wish.isLiked ? 1 : -1

  return {
    likes: wish.likes,
    isLiked: wish.isLiked
  }
}