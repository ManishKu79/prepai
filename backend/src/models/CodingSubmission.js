const mongoose = require('mongoose')

const testCaseResultSchema = new mongoose.Schema({
  testCase: { type: String, required: true },
  passed: { type: Boolean, required: true },
  actualOutput: { type: String },
  expectedOutput: { type: String },
  error: { type: String }
})

const codingSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: Number, required: true },
  problemTitle: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  testResults: [testCaseResultSchema],
  passedCount: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  status: { type: String, enum: ['accepted', 'wrong_answer', 'error'], default: 'wrong_answer' },
  executionTime: { type: Number },
  submittedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema)