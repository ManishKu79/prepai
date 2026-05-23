const analyzePerformance = async (session) => {
  const answers = session.answers || []
  
  if (answers.length === 0) {
    return {
      overallScore: 0,
      technicalScore: 0,
      behavioralScore: 0,
      overallFeedback: "No answers recorded for this session.",
      level: "beginner",
      strengths: [],
      improvements: [],
      totalQuestions: 0,
      recommendedFocus: "technical"
    }
  }
  
  const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0)
  const averageScore = totalScore / answers.length
  
  // Analyze by question type
  const technicalAnswers = answers.filter(a => 
    !a.question?.toLowerCase().includes('behavioral') &&
    !a.question?.toLowerCase().includes('tell me')
  )
  const behavioralAnswers = answers.filter(a => 
    a.question?.toLowerCase().includes('behavioral') ||
    a.question?.toLowerCase().includes('tell me')
  )
  
  const technicalScore = technicalAnswers.length 
    ? technicalAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / technicalAnswers.length 
    : 0
  const behavioralScore = behavioralAnswers.length 
    ? behavioralAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / behavioralAnswers.length 
    : 0
  
  // Collect all feedback and suggestions
  const allFeedback = answers.flatMap(a => a.feedback || [])
  const allSuggestions = answers.flatMap(a => a.suggestions || [])
  const allStrengths = answers.flatMap(a => a.strengths || [])
  
  // Count frequency of issues
  const issueCount = {}
  allSuggestions.forEach(suggestion => {
    const key = suggestion.toLowerCase().substring(0, 50)
    issueCount[key] = (issueCount[key] || 0) + 1
  })
  
  // Identify top areas for improvement
  const topImprovements = Object.entries(issueCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([issue]) => issue)
  
  // Generate overall feedback based on score
  let overallFeedback = ""
  let level = ""
  
  if (averageScore >= 85) {
    overallFeedback = "Excellent performance! You demonstrated strong technical knowledge and communication skills. Your answers were well-structured and insightful."
    level = "expert"
  } else if (averageScore >= 70) {
    overallFeedback = "Good job! You have a solid foundation. Focus on providing more specific examples and structuring your answers using the STAR method."
    level = "intermediate"
  } else if (averageScore >= 50) {
    overallFeedback = "Good effort! Keep practicing to build confidence. Work on understanding core concepts and practicing your responses to common questions."
    level = "beginner"
  } else {
    overallFeedback = "Keep practicing! Focus on learning fundamental concepts and practicing your answers. Regular mock interviews will help you improve significantly."
    level = "beginner"
  }
  
  return {
    overallScore: Math.round(averageScore),
    technicalScore: Math.round(technicalScore),
    behavioralScore: Math.round(behavioralScore),
    overallFeedback,
    level,
    strengths: [...new Set(allStrengths.slice(0, 5))],
    improvements: topImprovements.slice(0, 5),
    totalQuestions: answers.length,
    recommendedFocus: technicalScore < behavioralScore ? "technical" : "behavioral"
  }
}

const generateProgressReport = async (userId) => {
  const InterviewSession = require('../models/InterviewSession')
  
  try {
    const sessions = await InterviewSession.find({ userId }).sort({ startTime: -1 })
    
    if (sessions.length === 0) return null
    
    const recentSessions = sessions.slice(0, 5)
    const scores = recentSessions.map(s => s.overallScore || 0)
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const improvement = scores[0] - scores[scores.length - 1]
    
    // Analyze progress by role
    const rolePerformance = {}
    sessions.forEach(session => {
      if (!rolePerformance[session.role]) {
        rolePerformance[session.role] = { total: 0, count: 0, scores: [] }
      }
      rolePerformance[session.role].total += session.overallScore || 0
      rolePerformance[session.role].count++
      rolePerformance[session.role].scores.push(session.overallScore || 0)
    })
    
    const bestRole = Object.entries(rolePerformance)
      .map(([role, data]) => ({ role, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg)[0]
    
    return {
      totalInterviews: sessions.length,
      averageScore: Math.round(averageScore),
      improvement: Math.round(improvement),
      bestRole: bestRole?.role || 'N/A',
      bestRoleScore: Math.round(bestRole?.avg || 0),
      recentScores: scores.slice(0, 10).reverse(),
      lastInterviewDate: sessions[0]?.startTime || null
    }
  } catch (error) {
    console.error('Error generating progress report:', error)
    return null
  }
}

module.exports = {
  analyzePerformance,
  generateProgressReport
}