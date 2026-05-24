const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  lineNumber: { type: Number },
  createdAt: { type: Date, default: Date.now }
})

const codeReviewSchema = new mongoose.Schema({
  problemId: { type: Number, required: true },
  problemTitle: { type: String, required: true },
  code: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  comments: [commentSchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('CodeReview', codeReviewSchema)