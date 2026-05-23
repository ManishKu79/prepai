const express = require('express')
const router = express.Router()
const { analyzeResume } = require('../controllers/resumeController')
const upload = require('../middleware/upload')
const { protect } = require('../middleware/auth')

// Test route - must be BEFORE the analyze route
router.get('/test', protect, (req, res) => {
  res.json({ 
    message: 'Resume route is working!',
    user: req.user?.email
  })
})

router.get('/analytics', protect, async (req, res) => {
  try {
    // Return resume analytics if available
    res.json({
      success: true,
      hasResume: false,
      message: 'No resume uploaded yet'
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Protected route - requires authentication
router.post('/analyze', protect, upload.single('resume'), analyzeResume)

module.exports = router