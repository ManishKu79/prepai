const { generateQuestion, evaluateAnswer, generateFinalFeedback } = require('../services/openaiService')
const InterviewSession = require('../models/InterviewSession')

// Store active interviews in memory
const activeInterviews = new Map()

const startInterview = async (req, res) => {
  try {
    const { role, difficulty, type, questionCount = 5 } = req.body
    const userId = req.user._id
    
    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty are required' })
    }
    
    console.log(`[Interview] Starting ${difficulty} ${role} interview with ${questionCount} questions for user ${userId}`)
    
    // Generate first question
    const firstQuestion = await generateQuestion(role, difficulty, [])
    
    const interviewId = Date.now().toString()
    const interview = {
      id: interviewId,
      userId,
      role,
      difficulty,
      type: type || (role === 'hr' ? 'hr' : 'technical'),
      questionCount: questionCount, // Store the total questions
      startTime: new Date(),
      questions: [firstQuestion],
      askedQuestions: [firstQuestion.question],
      answers: [],
      status: 'in-progress'
    }
    
    activeInterviews.set(interviewId, interview)
    
    console.log(`[Interview] ${interviewId} created with ${questionCount} total questions`)
    
    res.status(201).json({
      success: true,
      interviewId,
      question: firstQuestion.question,
      questionNumber: 1,
      totalQuestions: questionCount
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
    const totalQuestions = interview.questionCount || 5
    
    console.log(`[Interview] Evaluating answer for question ${questionNumber}/${totalQuestions}`)
    
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
      strengths: evaluation.strengths || [],
      timestamp: new Date()
    })
    
    // Check if interview should continue (based on questionCount)
    if (questionNumber >= totalQuestions) {
      // Interview complete
      console.log(`[Interview] Interview completed after ${totalQuestions} questions, generating final feedback`)
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
          questionCount: totalQuestions,
          startTime: interview.startTime,
          endTime: new Date(),
          answers: interview.answers,
          overallScore: finalFeedback.overallScore,
          overallFeedback: finalFeedback.overallFeedback,
          strengths: finalFeedback.strengths || [],
          improvements: finalFeedback.improvements || [],
          recommendations: finalFeedback.recommendations || [],
          status: 'completed'
        })
        await session.save()
        console.log(`[Interview] Session saved: ${session._id}`)
      } catch (dbError) {
        console.error('[Interview] Failed to save session:', dbError)
      }
      
      activeInterviews.delete(interviewId)
      
      return res.json({
        success: true,
        completed: true,
        feedback: finalFeedback
      })
    } else {
      // Generate next question
      const previousQuestions = interview.askedQuestions || interview.questions.map(q => q.question)
      const nextQuestion = await generateQuestion(
        interview.role,
        interview.difficulty,
        previousQuestions
      )
      
      interview.askedQuestions = [...(interview.askedQuestions || []), nextQuestion.question]
      interview.questions.push(nextQuestion)
      
      console.log(`[Interview] Generated question ${questionNumber + 1}/${totalQuestions}`)
      
      return res.json({
        success: true,
        completed: false,
        question: nextQuestion.question,
        questionNumber: questionNumber + 1,
        totalQuestions: totalQuestions,
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
    
    const currentQuestionObj = interview.questions[interview.questions.length - 1]
    const totalQuestions = interview.questionCount || 5
    
    res.json({
      success: true,
      interview: {
        id: interview.id,
        role: interview.role,
        difficulty: interview.difficulty,
        status: interview.status,
        questionsAnswered: interview.answers.length,
        totalQuestions: totalQuestions,
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
    
    const sessions = await InterviewSession.find({ userId, status: 'completed' })
      .sort({ endTime: -1 })
      .limit(20)
    
    console.log(`[Interview] Found ${sessions.length} completed sessions for user ${userId}`)
    
    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        role: session.role,
        difficulty: session.difficulty,
        type: session.type,
        date: session.endTime || session.createdAt || new Date(),
        score: session.overallScore || 0,
        status: session.status
      }))
    })
  } catch (error) {
    console.error('[Interview] History error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewStatus,
  getInterviewHistory
}