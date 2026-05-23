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

// Protected route - requires authentication
router.post('/analyze', protect, upload.single('resume'), analyzeResume)

module.exports = router