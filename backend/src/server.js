const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')

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

// Simple test routes (no auth required)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: {
      auth: '/api/auth',
      resume: '/api/resume'
    }
  })
})

app.get('/api/test-resume', (req, res) => {
  res.json({ message: 'Resume API endpoint is accessible' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running', 
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test',
      'GET /api/test-resume',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'POST /api/auth/logout',
      'GET /api/resume/test',
      'POST /api/resume/analyze'
    ]
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepai'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    console.log('⚠️ Running without database - using in-memory storage')
  })

// Start server
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`\n🚀 PrepAI Backend Server`)
  console.log(`📍 Running on: http://localhost:${PORT}`)
  console.log(`📡 API ready for frontend at http://localhost:3000`)
  console.log(`\n📋 Available endpoints:`)
  console.log(`   GET    /api/health            - Health check`)
  console.log(`   GET    /api/test              - Test endpoint`)
  console.log(`   GET    /api/test-resume       - Test resume endpoint`)
  console.log(`   POST   /api/auth/register     - Register new user`)
  console.log(`   POST   /api/auth/login        - Login user`)
  console.log(`   GET    /api/auth/profile      - Get user profile (Protected)`)
  console.log(`   POST   /api/auth/logout       - Logout user (Protected)`)
  console.log(`   GET    /api/resume/test       - Test resume route (Protected)`)
  console.log(`   POST   /api/resume/analyze    - Analyze resume (Protected)\n`)
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