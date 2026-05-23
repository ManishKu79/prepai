const express = require('express')
const router = express.Router()
const { 
  saveInterviewSession, 
  getSessionFeedback, 
  getUserFeedbackHistory,
  getOverallAnalytics 
} = require('../controllers/feedbackController')
const { protect } = require('../middleware/auth')

router.post('/save-session', protect, saveInterviewSession)
router.get('/session/:sessionId', protect, getSessionFeedback)
router.get('/history', protect, getUserFeedbackHistory)
router.get('/analytics', protect, getOverallAnalytics)

module.exports = router