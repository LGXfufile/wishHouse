import { Request, Response, NextFunction } from 'express'
import { config } from '../config/env'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error)

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message)
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    })
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    })
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(config.server.nodeEnv === 'development' && { stack: error.stack })
  })
} 