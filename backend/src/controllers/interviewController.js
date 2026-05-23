const { generateInterviewQuestion, evaluateAnswer, generateFeedback } = require('../services/aiService')

// Store active interviews in memory (in production, use database)
const activeInterviews = new Map()

const startInterview = async (req, res) => {
  try {
    const { role, difficulty, type } = req.body
    const userId = req.user._id
    
    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty are required' })
    }
    
    // Generate first question
    const firstQuestion = await generateInterviewQuestion(role, difficulty)
    
    // Create interview session
    const interviewId = Date.now().toString()
    const interview = {
      id: interviewId,
      userId,
      role,
      difficulty,
      type: type || (role === 'hr' ? 'hr' : 'technical'),
      startTime: new Date(),
      questions: [firstQuestion],
      answers: [],
      status: 'in-progress'
    }
    
    activeInterviews.set(interviewId, interview)
    
    res.status(201).json({
      success: true,
      interviewId,
      question: firstQuestion.question,
      questionNumber: 1,
      totalQuestions: 5
    })
  } catch (error) {
    console.error('Error starting interview:', error)
    res.status(500).json({ message: 'Failed to start interview', error: error.message })
  }
}

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, answer } = req.body
    
    if (!interviewId || !answer) {
      return res.status(400).json({ message: 'Interview ID and answer are required' })
    }
    
    const interview = activeInterviews.get(interviewId)
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }
    
    const currentQuestion = interview.questions[interview.questions.length - 1]
    
    // Evaluate the answer
    const evaluation = await evaluateAnswer(
      currentQuestion.question,
      answer,
      currentQuestion.expectedKeywords || []
    )
    
    // Store the answer
    interview.answers.push({
      question: currentQuestion.question,
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions,
      timestamp: new Date()
    })
    
    // Check if interview should continue (max 5 questions)
    const questionCount = interview.questions.length
    
    if (questionCount >= 5) {
      // Interview complete
      const finalFeedback = await generateFeedback(interview.answers)
      interview.status = 'completed'
      interview.endTime = new Date()
      interview.finalFeedback = finalFeedback
      
      return res.json({
        success: true,
        completed: true,
        feedback: finalFeedback
      })
    } else {
      // Generate next question
      const previousQuestions = interview.questions.map(q => q.question)
      const nextQuestion = await generateInterviewQuestion(
        interview.role,
        interview.difficulty,
        previousQuestions
      )
      
      interview.questions.push(nextQuestion)
      
      return res.json({
        success: true,
        completed: false,
        question: nextQuestion.question,
        questionNumber: questionCount + 1,
        totalQuestions: 5,
        evaluation: {
          score: evaluation.score,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions
        }
      })
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    res.status(500).json({ message: 'Failed to submit answer', error: error.message })
  }
}

const getInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params
    const interview = activeInterviews.get(interviewId)
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }
    
    res.json({
      success: true,
      interview: {
        role: interview.role,
        difficulty: interview.difficulty,
        status: interview.status,
        questionsAnswered: interview.answers.length,
        totalQuestions: 5
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewStatus
}