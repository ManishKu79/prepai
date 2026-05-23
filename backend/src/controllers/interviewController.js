const { generateQuestion, evaluateAnswer, generateFinalFeedback } = require('../services/openaiService')
const InterviewSession = require('../models/InterviewSession')

// Store active interviews in memory (in production, use database)
const activeInterviews = new Map()

const startInterview = async (req, res) => {
  try {
    const { role, difficulty, type } = req.body
    const userId = req.user._id
    
    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty are required' })
    }
    
    console.log(`[Interview] Starting ${difficulty} ${role} interview for user ${userId}`)
    
    // Generate first question using OpenAI
    const firstQuestion = await generateQuestion(role, difficulty)
    
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
    
    console.log(`[Interview] ${interviewId} created successfully`)
    
    res.status(201).json({
      success: true,
      interviewId,
      question: firstQuestion.question,
      questionNumber: 1,
      totalQuestions: 5
    })
  } catch (error) {
    console.error('[Interview] Error starting interview:', error)
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
    const questionNumber = interview.questions.length
    
    console.log(`[Interview] Evaluating answer for question ${questionNumber} in ${interviewId}`)
    
    // Evaluate the answer using OpenAI
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
      strengths: evaluation.strengths || [],
      timestamp: new Date()
    })
    
    // Check if interview should continue (max 5 questions)
    const questionCount = interview.questions.length
    
    if (questionCount >= 5) {
      // Interview complete - generate final feedback with OpenAI
      console.log(`[Interview] ${interviewId} completed, generating final feedback`)
      const finalFeedback = await generateFinalFeedback(interview.answers)
      
      interview.status = 'completed'
      interview.endTime = new Date()
      interview.finalFeedback = finalFeedback
      
      // Save to database
      try {
        const session = new InterviewSession({
          userId: interview.userId,
          role: interview.role,
          difficulty: interview.difficulty,
          type: interview.type,
          startTime: interview.startTime,
          endTime: new Date(),
          answers: interview.answers.map(a => ({
            question: a.question,
            answer: a.answer,
            score: a.score,
            feedback: a.feedback,
            suggestions: a.suggestions || [],
            strengths: a.strengths || [],
            timestamp: a.timestamp
          })),
          overallScore: finalFeedback.overallScore,
          overallFeedback: finalFeedback.overallFeedback,
          strengths: finalFeedback.strengths || [],
          improvements: finalFeedback.improvements || [],
          recommendations: finalFeedback.recommendations || [],
          status: 'completed'
        })
        await session.save()
        console.log(`[Interview] Session saved to database: ${session._id}`)
      } catch (dbError) {
        console.error('[Interview] Failed to save session:', dbError)
      }
      
      // Clean up active interview
      activeInterviews.delete(interviewId)
      
      return res.json({
        success: true,
        completed: true,
        feedback: finalFeedback
      })
    } else {
      // Generate next question using OpenAI
      const previousQuestions = interview.questions.map(q => q.question)
      const nextQuestion = await generateQuestion(
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
          suggestions: evaluation.suggestions,
          strengths: evaluation.strengths
        }
      })
    }
  } catch (error) {
    console.error('[Interview] Error submitting answer:', error)
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
    
    // Get current question
    const currentQuestionObj = interview.questions[interview.questions.length - 1]
    
    res.json({
      success: true,
      interview: {
        id: interview.id,
        role: interview.role,
        difficulty: interview.difficulty,
        status: interview.status,
        questionsAnswered: interview.answers.length,
        totalQuestions: 5,
        currentQuestion: currentQuestionObj?.question || null,
        currentQuestionNumber: interview.questions.length,
        isCompleted: interview.status === 'completed'
      }
    })
  } catch (error) {
    console.error('[Interview] Status error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id
    
    const sessions = await InterviewSession.find({ userId })
      .sort({ endTime: -1 })
      .limit(20)
    
    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        role: session.role,
        difficulty: session.difficulty,
        type: session.type,
        date: session.endTime,
        score: session.overallScore,
        status: session.status
      }))
    })
  } catch (error) {
    console.error('[Interview] History error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.user._id
    
    const session = await InterviewSession.findOne({ _id: sessionId, userId })
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }
    
    res.json({
      success: true,
      session: {
        id: session._id,
        role: session.role,
        difficulty: session.difficulty,
        type: session.type,
        startTime: session.startTime,
        endTime: session.endTime,
        answers: session.answers,
        overallScore: session.overallScore,
        overallFeedback: session.overallFeedback,
        strengths: session.strengths,
        improvements: session.improvements,
        recommendations: session.recommendations
      }
    })
  } catch (error) {
    console.error('[Interview] Session details error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Clean up old interviews (every hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  for (const [id, interview] of activeInterviews) {
    if (new Date(interview.startTime).getTime() < oneHourAgo && interview.status === 'in-progress') {
      activeInterviews.delete(id)
      console.log(`[Interview] Cleaned up stale interview ${id}`)
    }
  }
}, 60 * 60 * 1000)

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewStatus,
  getInterviewHistory,
  getSessionDetails
}