import { Request, Response } from 'express'
import { User } from '../models/User'
import { Wish } from '../models/Wish'

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // For demo purposes, return a mock user profile
    const user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
      createdAt: new Date().toISOString()
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    })
  }
}

// Get user's wishes
export const getUserWishes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query

    const result = await (Wish as any).findWithPagination(
      { author: id },
      parseInt(page as string),
      parseInt(limit as string),
      { createdAt: -1 }
    )

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching user wishes:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user wishes'
    })
  }
} 