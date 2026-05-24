import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, Send, ThumbsUp, MessageCircle, Eye, 
  Clock, User, CheckCircle, XCircle, AlertCircle,
  Loader2, ArrowLeft, Copy, Check
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CodeReview = () => {
  const [reviews, setReviews] = useState([])
  const [selectedReview, setSelectedReview] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/code-review/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewDetails = async (reviewId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/code-review/reviews/${reviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setSelectedReview(data.review)
      }
    } catch (error) {
      console.error('Error fetching review details:', error)
    }
  }

  const handleLike = async (reviewId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/code-review/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      fetchReviews()
      if (selectedReview && selectedReview.id === reviewId) {
        fetchReviewDetails(reviewId)
      }
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }

  const handleComment = async (reviewId) => {
    if (!comment.trim()) return
    
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/code-review/reviews/${reviewId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      })
      setComment('')
      fetchReviewDetails(reviewId)
      fetchReviews()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full text-xs"><CheckCircle className="h-3 w-3" /> Approved</span>
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full text-xs"><XCircle className="h-3 w-3" /> Rejected</span>
      default:
        return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full text-xs"><AlertCircle className="h-3 w-3" /> Pending</span>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Code Review</h1>
          <p className="text-gray-400 mt-1">
            Share your code and get feedback from peers
          </p>
        </div>
        <Link to="/dashboard/coding-practice">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Submit Code for Review
          </button>
        </Link>
      </motion.div>

      {selectedReview ? (
        // Review Detail View
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Back Button */}
          <button
            onClick={() => setSelectedReview(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </button>

          {/* Review Content */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedReview.problemTitle}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      {selectedReview.authorName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </div>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(selectedReview.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{selectedReview.likes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => copyCode(selectedReview.code)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                    <span className="text-sm text-gray-300">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Code Block */}
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {selectedReview.code}
                </pre>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({selectedReview.comments?.length || 0})
              </h3>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {selectedReview.comments?.map((comment, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {comment.userName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">{comment.userName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your feedback or suggestions..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  rows="3"
                />
                <button
                  onClick={() => handleComment(selectedReview.id)}
                  disabled={!comment.trim() || submitting}
                  className="px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Reviews List View
        <div className="grid gap-4">
          {reviews.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
              <Code2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No code reviews yet</p>
              <p className="text-gray-500 text-sm mt-2">Submit your code to get feedback from peers</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => fetchReviewDetails(review.id)}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.problemTitle}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <User className="h-3 w-3" /> {review.authorName}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(review.status)}
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {review.code.substring(0, 200)}...
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <ThumbsUp className="h-4 w-4" /> {review.likes}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="h-4 w-4" /> {review.comments}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Eye className="h-4 w-4" /> View Details
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CodeReview