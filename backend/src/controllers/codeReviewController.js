const CodeReview = require('../models/CodeReview')

// Submit code for review
const submitForReview = async (req, res) => {
  try {
    const { problemId, problemTitle, code, language } = req.body
    const userId = req.user._id
    const userName = req.user.name

    const review = new CodeReview({
      problemId,
      problemTitle,
      code,
      authorId: userId,
      authorName: userName,
      language: language || 'javascript'
    })

    await review.save()

    res.status(201).json({
      success: true,
      message: 'Code submitted for review',
      reviewId: review._id
    })
  } catch (error) {
    console.error('Submit review error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all code reviews
const getCodeReviews = async (req, res) => {
  try {
    const reviews = await CodeReview.find()
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email')
      .limit(50)

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        problemTitle: review.problemTitle,
        authorName: review.authorName,
        code: review.code.substring(0, 200),
        likes: review.likes.length,
        comments: review.comments.length,
        createdAt: review.createdAt,
        status: review.status
      }))
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get single review details
const getReviewDetails = async (req, res) => {
  try {
    const { reviewId } = req.params
    const review = await CodeReview.findById(reviewId)
      .populate('authorId', 'name email')
      .populate('comments.userId', 'name email')

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json({
      success: true,
      review: {
        id: review._id,
        problemTitle: review.problemTitle,
        code: review.code,
        authorName: review.authorName,
        language: review.language,
        likes: review.likes,
        comments: review.comments,
        status: review.status,
        createdAt: review.createdAt
      }
    })
  } catch (error) {
    console.error('Get review details error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Add comment to review
const addComment = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { comment, lineNumber } = req.body
    const userId = req.user._id
    const userName = req.user.name

    const review = await CodeReview.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    review.comments.push({
      userId,
      userName,
      comment,
      lineNumber
    })
    review.updatedAt = Date.now()
    await review.save()

    res.json({
      success: true,
      message: 'Comment added successfully'
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Like/unlike review
const toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.user._id

    const review = await CodeReview.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    const likeIndex = review.likes.indexOf(userId)
    if (likeIndex === -1) {
      review.likes.push(userId)
    } else {
      review.likes.splice(likeIndex, 1)
    }

    await review.save()

    res.json({
      success: true,
      likes: review.likes.length,
      liked: likeIndex === -1
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  submitForReview,
  getCodeReviews,
  getReviewDetails,
  addComment,
  toggleLike
}