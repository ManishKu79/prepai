const express = require('express')
const router = express.Router()
const { 
  submitSolution,
  getProblems,
  getProblemDetails,
  getSubmissions,
  getStats,
  generateAIProblem,
  evaluateWithAI,
  getAIStatus
} = require('../controllers/codingController')
const { protect } = require('../middleware/auth')

// Existing routes
router.get('/problems', protect, getProblems)
router.get('/problems/:problemId', protect, getProblemDetails)
router.post('/submit', protect, submitSolution)
router.get('/submissions', protect, getSubmissions)
router.get('/stats', protect, getStats)

// AI-powered routes - MAKE SURE THESE EXIST
router.post('/ai/generate', protect, generateAIProblem)
router.post('/ai/evaluate', protect, evaluateWithAI)
router.get('/ai/status', protect, getAIStatus)

module.exports = router