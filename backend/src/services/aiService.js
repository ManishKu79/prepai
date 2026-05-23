// For OpenAI (you'll need API key)
// const OpenAI = require('openai')

// For now, using mock AI responses
const questionsData = require('../data/interviewQuestions.json')

const generateInterviewQuestion = async (role, difficulty, previousQuestions = []) => {
  try {
    // Get questions for role and difficulty
    const questions = questionsData[role]?.[difficulty] || questionsData.frontend.beginner
    
    // Filter out already asked questions
    const availableQuestions = questions.filter(q => !previousQuestions.includes(q))
    
    // Pick a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const question = availableQuestions[randomIndex] || questions[0]
    
    return {
      question,
      type: role === 'hr' ? 'behavioral' : 'technical',
      expectedKeywords: getExpectedKeywords(role, question)
    }
  } catch (error) {
    console.error('Error generating question:', error)
    return {
      question: "Tell me about a challenging project you worked on.",
      type: "general",
      expectedKeywords: ["project", "challenge", "solution", "learned"]
    }
  }
}

const getExpectedKeywords = (role, question) => {
  const keywords = {
    javascript: ["javascript", "function", "variable", "scope"],
    react: ["react", "component", "state", "props", "hooks"],
    database: ["database", "sql", "query", "index"],
    team: ["team", "collaborate", "communicate", "together"],
    problem: ["problem", "solve", "solution", "approach"]
  }
  
  // Simple keyword extraction based on question
  const lowerQuestion = question.toLowerCase()
  const foundKeywords = []
  
  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(word => lowerQuestion.includes(word))) {
      foundKeywords.push(...words.slice(0, 2))
    }
  }
  
  return foundKeywords.length ? foundKeywords : ["relevant", "experience", "knowledge"]
}

const evaluateAnswer = async (question, answer, expectedKeywords) => {
  try {
    const lowerAnswer = answer.toLowerCase()
    
    // Calculate score based on keyword presence
    let score = 0
    const matchedKeywords = []
    
    for (const keyword of expectedKeywords) {
      if (lowerAnswer.includes(keyword.toLowerCase())) {
        score += 20
        matchedKeywords.push(keyword)
      }
    }
    
    // Check answer length
    if (answer.length > 100) score += 10
    if (answer.length > 200) score += 10
    
    // Cap score at 100
    score = Math.min(score, 100)
    
    // Generate feedback
    let feedback = ""
    if (score >= 80) {
      feedback = "Excellent answer! You covered the key points well."
    } else if (score >= 60) {
      feedback = "Good answer! Consider adding more specific examples."
    } else if (score >= 40) {
      feedback = `Good attempt. Try to include keywords like: ${expectedKeywords.slice(0, 3).join(', ')}`
    } else {
      feedback = "Try to provide more detailed answers with specific examples."
    }
    
    // Add specific suggestions
    const suggestions = []
    if (matchedKeywords.length < expectedKeywords.length / 2) {
      suggestions.push(`Consider mentioning: ${expectedKeywords.slice(0, 3).join(', ')}`)
    }
    if (answer.length < 50) {
      suggestions.push("Provide more detailed explanations")
    }
    
    return {
      score,
      feedback,
      suggestions,
      matchedKeywords
    }
  } catch (error) {
    console.error('Error evaluating answer:', error)
    return {
      score: 70,
      feedback: "Good attempt! Keep practicing to improve.",
      suggestions: ["Be more specific", "Use technical terms"]
    }
  }
}

const generateFeedback = async (answers) => {
  try {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0) / answers.length
    
    let overallFeedback = ""
    if (totalScore >= 80) {
      overallFeedback = "Excellent performance! You're well prepared for interviews."
    } else if (totalScore >= 60) {
      overallFeedback = "Good job! With a bit more practice, you'll be ready."
    } else {
      overallFeedback = "Keep practicing! Focus on providing more detailed and structured answers."
    }
    
    const strengths = answers.filter(a => a.score >= 70).map(a => a.question.substring(0, 50))
    const improvements = answers.filter(a => a.score < 60).map(a => a.question.substring(0, 50))
    
    return {
      overallScore: Math.round(totalScore),
      overallFeedback,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3),
      totalQuestions: answers.length
    }
  } catch (error) {
    console.error('Error generating feedback:', error)
    return {
      overallScore: 70,
      overallFeedback: "Good practice session! Keep working on your interview skills.",
      strengths: ["Question understanding", "Basic knowledge"],
      improvements: ["Provide more examples", "Structure your answers better"],
      totalQuestions: answers.length
    }
  }
}

module.exports = {
  generateInterviewQuestion,
  evaluateAnswer,
  generateFeedback
}