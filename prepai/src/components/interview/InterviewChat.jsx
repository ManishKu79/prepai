import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Loader2 } from 'lucide-react'
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
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch initial question when component mounts
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/interview/status/' + interviewId, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          // Add initial AI question to messages
          const initialQuestion = "Welcome to your mock interview! Let's begin.\n\n" + (data.interview?.currentQuestion || "Tell me about yourself and your experience.")
          setCurrentQuestion(initialQuestion)
          setMessages([{
            role: 'assistant',
            content: initialQuestion
          }])
        } else {
          // Fallback question
          const fallbackQuestion = "Welcome to your mock interview! Let's begin.\n\nTell me about yourself and your technical background."
          setCurrentQuestion(fallbackQuestion)
          setMessages([{
            role: 'assistant',
            content: fallbackQuestion
          }])
        }
      } catch (error) {
        console.error('Error fetching initial question:', error)
        const fallbackQuestion = "Welcome to your mock interview! Let's begin.\n\nTell me about yourself and your technical background."
        setCurrentQuestion(fallbackQuestion)
        setMessages([{
          role: 'assistant',
          content: fallbackQuestion
        }])
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialQuestion()
  }, [interviewId])

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isLoading) return

    // Add user message to chat
    const userMessage = { role: 'user', content: currentAnswer }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

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
        setFeedback(data.feedback)
        setInterviewCompleted(true)
        onComplete(data.feedback)
        
        // Add final feedback to chat
        setMessages(prev => [...prev, {
          role: 'feedback',
          content: `🎉 Interview Complete! 🎉\n\nScore: ${data.feedback.overallScore}/100\n\n${data.feedback.overallFeedback}\n\nStrengths:\n${data.feedback.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas to Improve:\n${data.feedback.improvements.map(i => `• ${i}`).join('\n')}`
        }])
      } else {
        // Add evaluation feedback
        if (data.evaluation) {
          setMessages(prev => [...prev, {
            role: 'feedback',
            content: `📊 Score: ${data.evaluation.score}/100\n\n${data.evaluation.feedback}\n\n💡 Suggestions:\n${data.evaluation.suggestions.map(s => `• ${s}`).join('\n')}`
          }])
        }
        
        // Add next question
        const nextQuestion = data.question
        setCurrentQuestion(nextQuestion)
        setQuestionNumber(data.questionNumber)
        setTotalQuestions(data.totalQuestions)
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Question ${data.questionNumber}/${data.totalQuestions}:\n\n${nextQuestion}`
        }])
      }

      setCurrentAnswer('')
    } catch (error) {
      console.error('Error submitting answer:', error)
      setMessages(prev => [...prev, {
        role: 'feedback',
        content: '❌ Network error. Please check your connection and try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (interviewCompleted && feedback) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-2xl font-bold text-white mb-4">Interview Complete! 🎉</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-500 mb-2">
                {feedback.overallScore}%
              </div>
              <p className="text-gray-300">{feedback.overallFeedback}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <h4 className="text-green-500 font-semibold mb-2">💪 Strengths</h4>
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm">✓ {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <h4 className="text-yellow-500 font-semibold mb-2">📈 Areas to Improve</h4>
              <ul className="space-y-1">
                {feedback.improvements.map((i, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">• {i}</li>
                ))}
              </ul>
            </div>
          </div>

          {feedback.recommendations && (
            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
              <h4 className="text-blue-500 font-semibold mb-2">🎯 Recommendations</h4>
              <ul className="space-y-1">
                {feedback.recommendations.map((r, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">→ {r}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <span className="text-white font-medium">AI Interviewer</span>
          <span className="text-gray-500 text-sm ml-2">
            Question {questionNumber}/{totalQuestions}
          </span>
        </div>
        <Timer duration={90} onTimeUp={() => {
          if (currentAnswer.trim()) {
            handleSubmitAnswer()
          }
        }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading your interview...</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
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
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-gray-400 text-sm">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitAnswer()}
            placeholder="Type your answer here..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            rows="3"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

export default InterviewChat