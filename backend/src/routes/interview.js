const express = require('express')
const router = express.Router()
const { startInterview, submitAnswer, getInterviewStatus } = require('../controllers/interviewController')
const { protect } = require('../middleware/auth')

// All routes are protected (require authentication)
router.post('/start', protect, startInterview)
router.post('/submit', protect, submitAnswer)
router.get('/status/:interviewId', protect, getInterviewStatus)

module.exports = router