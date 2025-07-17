export interface Wish {
  _id: string;
  content: string;
  category: WishCategory;
  isAnonymous: boolean;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked?: boolean;
}

export type WishCategory = 
  | 'health'
  | 'career'
  | 'love'
  | 'study'
  | 'family'
  | 'wealth'
  | 'other';

export interface CreateWishRequest {
  content: string;
  category: WishCategory;
  isAnonymous: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface WishCard {
  wish: Wish;
  qrCode: string;
  backgroundImage: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  wishes: T[]; // 修改为wishes而不是items
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 