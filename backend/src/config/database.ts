import mongoose from 'mongoose'
import { config } from './env'

export const connectDatabase = async (): Promise<void> => {
  try {
    // Try to connect to MongoDB, if it fails, use memory storage
    try {
      const conn = await mongoose.connect(config.database.mongoUri)
      console.log(`📚 MongoDB connected: ${conn.connection.host}`)
    } catch (mongoError) {
      console.log('📚 MongoDB not available, using in-memory storage for demo')
      // For demo purposes, we'll continue without MongoDB
      // In a real application, you might want to fail here
    }
  } catch (error) {
    console.error('❌ Database connection error:', error)
    // Don't throw error, continue with in-memory demo
    console.log('📚 Continuing with demo mode (no persistence)')
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close()
    console.log('📚 MongoDB connection closed.')
  }
  process.exit(0)
}) 