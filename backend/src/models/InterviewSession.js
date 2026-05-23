const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  suggestions: [String],
  strengths: [String],
  timestamp: { type: Date, default: Date.now }
})

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  difficulty: { type: String, required: true },
  type: { type: String, required: true },
  questionCount: { type: Number, default: 5 }, // NEW FIELD
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  answers: [answerSchema],
  overallScore: { type: Number },
  overallFeedback: { type: String },
  strengths: [String],
  improvements: [String],
  recommendations: [String],
  status: { type: String, enum: ['completed', 'abandoned'], default: 'completed' }
}, {
  timestamps: true
})

module.exports = mongoose.model('InterviewSession', interviewSessionSchema)