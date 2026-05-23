const InterviewSession = require('../models/InterviewSession')
const { analyzePerformance, generateProgressReport } = require('../services/feedbackAnalysis')

const saveInterviewSession = async (req, res) => {
  try {
    const { role, difficulty, type, answers, overallScore, overallFeedback, strengths, improvements, recommendations } = req.body
    const userId = req.user._id
    
    const session = new InterviewSession({
      userId,
      role,
      difficulty,
      type,
      answers,
      overallScore,
      overallFeedback,
      strengths,
      improvements,
      recommendations,
      endTime: new Date()
    })
    
    await session.save()
    
    res.status(201).json({
      success: true,
      message: 'Interview session saved',
      sessionId: session._id
    })
  } catch (error) {
    console.error('Save session error:', error)
    res.status(500).json({ message: 'Failed to save session', error: error.message })
  }
}

const getSessionFeedback = async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.user._id
    
    const session = await InterviewSession.findOne({ _id: sessionId, userId })
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }
    
    const analysis = await analyzePerformance(session)
    
    res.json({
      success: true,
      session,
      analysis
    })
  } catch (error) {
    console.error('Get session feedback error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getUserFeedbackHistory = async (req, res) => {
  try {
    const userId = req.user._id
    
    const sessions = await InterviewSession.find({ userId })
      .sort({ endTime: -1 })
      .limit(20)
    
    const progress = await generateProgressReport(userId)
    
    res.json({
      success: true,
      sessions: sessions.map(s => ({
        id: s._id,
        role: s.role,
        difficulty: s.difficulty,
        date: s.endTime,
        score: s.overallScore,
        feedback: s.overallFeedback
      })),
      progress
    })
  } catch (error) {
    console.error('Get user feedback history error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user._id
    
    const sessions = await InterviewSession.find({ userId })
    
    if (sessions.length === 0) {
      return res.json({
        success: true,
        hasData: false,
        message: 'No interview data yet'
      })
    }
    
    // Role performance
    const roleStats = {}
    sessions.forEach(session => {
      if (!roleStats[session.role]) {
        roleStats[session.role] = { total: 0, count: 0 }
      }
      roleStats[session.role].total += session.overallScore || 0
      roleStats[session.role].count++
    })
    
    const rolePerformance = Object.entries(roleStats).map(([role, data]) => ({
      role,
      averageScore: Math.round(data.total / data.count),
      interviews: data.count
    }))
    
    // Difficulty performance
    const difficultyStats = {}
    sessions.forEach(session => {
      if (!difficultyStats[session.difficulty]) {
        difficultyStats[session.difficulty] = { total: 0, count: 0 }
      }
      difficultyStats[session.difficulty].total += session.overallScore || 0
      difficultyStats[session.difficulty].count++
    })
    
    const difficultyPerformance = Object.entries(difficultyStats).map(([difficulty, data]) => ({
      difficulty,
      averageScore: Math.round(data.total / data.count),
      interviews: data.count
    }))
    
    // Score trend
    const scoreTrend = sessions
      .sort((a, b) => a.endTime - b.endTime)
      .slice(-10)
      .map((session, index) => ({
        interview: index + 1,
        score: session.overallScore || 0,
        role: session.role
      }))
    
    // Average score
    const totalScore = sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0)
    const averageScore = Math.round(totalScore / sessions.length)
    
    // Common strengths and improvements
    const allStrengths = sessions.flatMap(s => s.strengths || [])
    const allImprovements = sessions.flatMap(s => s.improvements || [])
    
    const strengthCount = {}
    allStrengths.forEach(s => {
      strengthCount[s] = (strengthCount[s] || 0) + 1
    })
    const commonStrengths = Object.entries(strengthCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([strength]) => strength)
    
    const improvementCount = {}
    allImprovements.forEach(i => {
      improvementCount[i] = (improvementCount[i] || 0) + 1
    })
    const commonImprovements = Object.entries(improvementCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([improvement]) => improvement)
    
    res.json({
      success: true,
      hasData: true,
      analytics: {
        totalInterviews: sessions.length,
        averageScore,
        rolePerformance,
        difficultyPerformance,
        scoreTrend,
        commonStrengths: commonStrengths.length ? commonStrengths : ["Good effort", "Willingness to learn"],
        commonImprovements: commonImprovements.length ? commonImprovements : ["Practice more", "Use examples"],
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  saveInterviewSession,
  getSessionFeedback,
  getUserFeedbackHistory,
  getOverallAnalytics
}