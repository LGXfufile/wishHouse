import dotenv from 'dotenv'

dotenv.config()

export const config = {
  server: {
    port: process.env['PORT'] || 5000,
    nodeEnv: process.env['NODE_ENV'] || 'development'
  },
  database: {
    mongoUri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/wish-lighthouse'
  },
  jwt: {
    secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '7d'
  },
  cors: {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000'
  },
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100')
  },
  upload: {
    maxFileSize: parseInt(process.env['MAX_FILE_SIZE'] || '5242880'),
    uploadPath: process.env['UPLOAD_PATH'] || 'uploads/'
  },
  qrCode: {
    size: parseInt(process.env['QR_CODE_SIZE'] || '200')
  }
} 