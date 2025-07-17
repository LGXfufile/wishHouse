import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from './config/env'
import { connectDatabase } from './config/database'
import wishRoutes from './routes/wishRoutes'
import userRoutes from './routes/userRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api', limiter)

// Body parsing middleware
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use('/api/wishes', wishRoutes)
app.use('/api/users', userRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await connectDatabase()
    
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`)
      console.log(`🌍 Environment: ${config.server.nodeEnv}`)
      console.log(`📱 Health check: http://localhost:${config.server.port}/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app 