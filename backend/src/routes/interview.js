const express = require('express')
const router = express.Router()
const { 
  startInterview, 
  submitAnswer, 
  getInterviewStatus,
  getInterviewHistory,
  getSessionDetails
} = require('../controllers/interviewController')
const { protect } = require('../middleware/auth')

// All routes are protected (require authentication)
router.post('/start', protect, startInterview)
router.post('/submit', protect, submitAnswer)
router.get('/status/:interviewId', protect, getInterviewStatus)
router.get('/history', protect, getInterviewHistory)
router.get('/session/:sessionId', protect, getSessionDetails)

module.exports = router