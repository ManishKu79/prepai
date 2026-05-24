const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')
const interviewRoutes = require('./routes/interview')
const codingRoutes = require('./routes/coding')
const feedbackRoutes = require('./routes/feedback')
const userRoutes = require('./routes/user')
const codeReviewRoutes = require('./routes/codeReview')
const leaderboardRoutes = require('./routes/leaderboard')

const app = express()

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ============ SIMPLE TEST ROUTES (NO MIDDLEWARE ISSUES) ============
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() })
})

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK', timestamp: new Date().toISOString() })
})

// ============ REGISTER ROUTES ============
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/coding', codingRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/user', userRoutes)
app.use('/api/code-review', codeReviewRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  })
})

// ============ ERROR HANDLER - FIXED VERSION ============
// This MUST be the last middleware
app.use((err, req, res, next) => {
  console.error('Error caught in handler:', err.message)
  console.error('Error stack:', err.stack)
  
  // Don't call next() here - just send response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ============ DATABASE CONNECTION ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepai'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    console.log('⚠️ Continuing without database...')
  })

// ============ START SERVER ============
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`\n🚀 PrepAI Backend Server`)
  console.log(`📍 Running on: http://localhost:${PORT}`)
  console.log(`📡 API ready for frontend at http://localhost:3000`)
  console.log(`\n📋 Available endpoints:`)
  console.log(`   POST   /api/auth/register     - Register user`)
  console.log(`   POST   /api/auth/login        - Login user`)
  console.log(`   GET    /api/auth/profile      - Get profile`)
  console.log(`   GET    /api/health            - Health check\n`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
})

module.exports = app