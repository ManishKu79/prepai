const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  userName: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  interviewsCompleted: { type: Number, default: 0 },
  codingProblemsSolved: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
})

leaderboardSchema.index({ totalScore: -1 })

module.exports = mongoose.model('Leaderboard', leaderboardSchema)