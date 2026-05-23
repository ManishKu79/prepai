import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Timer from './Timer'

const InterviewChat = ({ interviewId, onComplete }) => {
  const [messages, setMessages] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(5)
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [lastEvaluation, setLastEvaluation] = useState(null)
  const [timerReset, setTimerReset] = useState(0) // Track timer resets
  const [isTimerActive, setIsTimerActive] = useState(true) // Control timer active state
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Reset timer when new question arrives
  const resetTimer = () => {
    setTimerReset(prev => prev + 1)
    setIsTimerActive(true)
  }

  // Fetch initial question when component mounts
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/interview/status/${interviewId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.interview) {
            setTotalQuestions(data.interview.totalQuestions || 5)
            setQuestionNumber(data.interview.currentQuestionNumber || 1)
            
            const initialMessage = `Welcome to your mock interview! Let's begin.\n\n**Question ${data.interview.currentQuestionNumber}/${data.interview.totalQuestions || 5}**\n\n${data.interview.currentQuestion || "Tell me about yourself and your technical background."}`
            
            setCurrentQuestion(initialMessage)
            setMessages([{
              id: Date.now(),
              role: 'assistant',
              content: initialMessage,
              timestamp: new Date()
            }])
            
            // Start the timer for first question
            resetTimer()
          } else {
            // Fallback
            setTotalQuestions(5)
            const fallbackMessage = "Welcome to your mock interview! Let's begin.\n\n**Question 1/5**\n\nTell me about yourself and your technical background."
            setCurrentQuestion(fallbackMessage)
            setMessages([{
              id: Date.now(),
              role: 'assistant',
              content: fallbackMessage,
              timestamp: new Date()
            }])
            resetTimer()
          }
        } else {
          throw new Error('Failed to fetch interview status')
        }
      } catch (error) {
        console.error('Error fetching initial question:', error)
        const fallbackMessage = "Welcome to your mock interview! Let's begin.\n\n**Question 1/5**\n\nTell me about yourself and your technical background."
        setCurrentQuestion(fallbackMessage)
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: fallbackMessage,
          timestamp: new Date()
        }])
        resetTimer()
      } finally {
        setIsLoading(false)
      }
    }

    if (interviewId) {
      fetchInitialQuestion()
    }
  }, [interviewId])

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isLoading) return

    // Stop the timer immediately when answer is submitted
    setIsTimerActive(false)

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: currentAnswer,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setShowEvaluation(false)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/interview/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          interviewId,
          answer: currentAnswer
        })
      })

      const data = await response.json()

      if (data.completed) {
        // Interview completed
        setFeedback(data.feedback)
        setInterviewCompleted(true)
        onComplete(data.feedback)
        
        // Add final feedback to chat
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'feedback',
          content: `🎉 **Interview Complete!** 🎉\n\n**Final Score:** ${data.feedback.overallScore}/100\n\n${data.feedback.overallFeedback}\n\n**Strengths:**\n${data.feedback.strengths?.map(s => `✓ ${s}`).join('\n') || '✓ Good effort'}\n\n**Areas to Improve:**\n${data.feedback.improvements?.map(i => `• ${i}`).join('\n') || '• Keep practicing'}\n\n**Recommendations:**\n${data.feedback.recommendations?.map(r => `→ ${r}`).join('\n') || '→ Practice more interviews'}`,
          timestamp: new Date()
        }])
      } else {
        // Store evaluation for display
        setLastEvaluation(data.evaluation)
        setShowEvaluation(true)
        
        // Add evaluation feedback
        const scoreColor = data.evaluation?.score >= 70 ? '🟢' : (data.evaluation?.score >= 50 ? '🟡' : '🔴')
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'feedback',
          content: `${scoreColor} **Score:** ${data.evaluation?.score}/100\n\n**Feedback:** ${data.evaluation?.feedback}\n\n**Suggestions:**\n${data.evaluation?.suggestions?.map(s => `• ${s}`).join('\n') || '• Keep practicing'}`,
          timestamp: new Date()
        }])
        
        // Add next question after a short delay
        setTimeout(() => {
          const nextQuestionText = `**Question ${data.questionNumber}/${data.totalQuestions}**\n\n${data.question}`
          setCurrentQuestion(nextQuestionText)
          setQuestionNumber(data.questionNumber)
          setTotalQuestions(data.totalQuestions)
          
          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: nextQuestionText,
            timestamp: new Date()
          }])
          setShowEvaluation(false)
          
          // Reset timer for the next question
          resetTimer()
        }, 2000)
      }

      setCurrentAnswer('')
    } catch (error) {
      console.error('Error submitting answer:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'feedback',
        content: '❌ **Network Error**\n\nPlease check your connection and try again.',
        timestamp: new Date()
      }])
      // Reactivate timer on error so user can try again
      setIsTimerActive(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeUp = () => {
    if (!currentAnswer.trim() && !isLoading && !interviewCompleted) {
      // Auto-submit with a message about time up
      setCurrentAnswer("Time's up! I'll try to answer faster next time.")
      setTimeout(() => handleSubmitAnswer(), 100)
    }
  }

  if (interviewCompleted && feedback) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Interview Complete! 🎉</h3>
          <p className="text-gray-400">Great job completing the interview</p>
        </div>
        
        <div className="space-y-4">
          {/* Score Circle */}
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - (feedback.overallScore / 100))}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-white">{feedback.overallScore}%</div>
                <div className="text-xs text-gray-400">Overall Score</div>
              </div>
            </div>
            <p className="text-gray-300 mt-4">{feedback.overallFeedback}</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <h4 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Strengths
              </h4>
              <ul className="space-y-1">
                {feedback.strengths?.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm">✓ {s}</li>
                )) || <li className="text-gray-300 text-sm">✓ Good effort</li>}
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <h4 className="text-yellow-500 font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Areas to Improve
              </h4>
              <ul className="space-y-1">
                {feedback.improvements?.map((i, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">• {i}</li>
                )) || <li className="text-gray-300 text-sm">• Keep practicing</li>}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {feedback.recommendations && feedback.recommendations.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
              <h4 className="text-blue-500 font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Recommendations
              </h4>
              <ul className="space-y-1">
                {feedback.recommendations.map((r, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">→ {r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Start New Interview
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-white font-medium">AI Interviewer</span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Question {questionNumber}/{totalQuestions}</span>
              <span>•</span>
              <span>60s per question</span>
            </div>
          </div>
        </div>
        <Timer 
          duration={60} 
          onTimeUp={handleTimeUp} 
          reset={timerReset}
          isActive={isTimerActive && !interviewCompleted && !isLoading}
        />
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round((questionNumber - 1) / totalQuestions * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : message.role === 'feedback' ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'feedback'
                    ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                    : 'bg-gray-800 text-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h4 key={i} className="font-bold mb-1">{line.replace(/\*\*/g, '')}</h4>
                      }
                      if (line.startsWith('✓') || line.startsWith('•') || line.startsWith('→')) {
                        return <div key={i} className="text-xs mt-0.5">{line}</div>
                      }
                      return <p key={i} className="mb-1">{line}</p>
                    })}
                  </div>
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-gray-400 text-sm">AI is analyzing your answer...</span>
            </div>
          </motion.div>
        )}
        
        {showEvaluation && lastEvaluation && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center gap-2">
                {lastEvaluation.score >= 70 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : lastEvaluation.score >= 50 ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-gray-300 text-sm">
                  Score: {lastEvaluation.score}/100
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && !isLoading && handleSubmitAnswer()}
            placeholder="Type your answer here..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            rows="3"
            disabled={isLoading || interviewCompleted}
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim() || isLoading || interviewCompleted}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{currentAnswer.length} characters</span>
        </div>
      </div>
    </div>
  )
}

export default InterviewChat