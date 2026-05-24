const express = require('express')
const router = express.Router()
const {
  submitForReview,
  getCodeReviews,
  getReviewDetails,
  addComment,
  toggleLike
} = require('../controllers/codeReviewController')
const { protect } = require('../middleware/auth')

router.post('/submit', protect, submitForReview)
router.get('/reviews', protect, getCodeReviews)
router.get('/reviews/:reviewId', protect, getReviewDetails)
router.post('/reviews/:reviewId/comment', protect, addComment)
router.post('/reviews/:reviewId/like', protect, toggleLike)

module.exports = router