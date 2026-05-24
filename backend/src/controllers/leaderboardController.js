const Leaderboard = require('../models/Leaderboard')
const InterviewSession = require('../models/InterviewSession')
const CodingSubmission = require('../models/CodingSubmission')

// Update user leaderboard score
const updateUserScore = async (userId, userName) => {
  try {
    // Get interview stats
    const interviews = await InterviewSession.find({ userId, status: 'completed' })
    const interviewsCompleted = interviews.length
    const avgInterviewScore = interviews.length > 0
      ? interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.length
      : 0

    // Get coding stats
    const codingSubmissions = await CodingSubmission.find({ userId, status: 'accepted' })
    const codingProblemsSolved = codingSubmissions.length
    const uniqueProblems = new Set(codingSubmissions.map(s => s.problemId)).size

    // Calculate total score
    const totalScore = Math.round(
      (avgInterviewScore * 0.4) + 
      (uniqueProblems * 10) + 
      (interviewsCompleted * 5)
    )

    // Update or create leaderboard entry
    const leaderboardEntry = await Leaderboard.findOneAndUpdate(
      { userId },
      {
        userId,
        userName,
        totalScore,
        interviewsCompleted,
        codingProblemsSolved: uniqueProblems,
        averageScore: Math.round(avgInterviewScore),
        lastActive: new Date()
      },
      { upsert: true, new: true }
    )

    return leaderboardEntry
  } catch (error) {
    console.error('Update score error:', error)
    return null
  }
}

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 100 } = req.query
    
    const leaderboard = await Leaderboard.find()
      .sort({ totalScore: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email avatar')

    // Update ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    res.json({
      success: true,
      leaderboard: leaderboard.map(entry => ({
        rank: entry.rank,
        userName: entry.userName,
        totalScore: entry.totalScore,
        interviewsCompleted: entry.interviewsCompleted,
        codingProblemsSolved: entry.codingProblemsSolved,
        averageScore: entry.averageScore,
        streak: entry.streak
      }))
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get user rank
const getUserRank = async (req, res) => {
  try {
    const userId = req.user._id
    
    // Update user score first
    await updateUserScore(userId, req.user.name)
    
    const leaderboard = await Leaderboard.find().sort({ totalScore: -1 })
    const userRank = leaderboard.findIndex(entry => entry.userId.toString() === userId.toString()) + 1
    
    const userEntry = await Leaderboard.findOne({ userId })
    
    res.json({
      success: true,
      rank: userRank,
      totalUsers: leaderboard.length,
      userStats: userEntry
    })
  } catch (error) {
    console.error('Get user rank error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update user stats (call this after interview/coding completion)
const updateStats = async (req, res) => {
  try {
    const userId = req.user._id
    const userName = req.user.name
    
    const updatedStats = await updateUserScore(userId, userName)
    
    res.json({
      success: true,
      message: 'Stats updated successfully',
      stats: updatedStats
    })
  } catch (error) {
    console.error('Update stats error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getLeaderboard,
  getUserRank,
  updateStats,
  updateUserScore
}