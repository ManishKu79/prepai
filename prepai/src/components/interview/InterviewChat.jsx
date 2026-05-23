import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import Timer from './Timer'

const InterviewChat = ({ interviewId, onComplete }) => {
  const [messages, setMessages] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isLoading) return

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: currentAnswer }])
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
      } else {
        // Add AI response
        setMessages(prev => [...prev, { role: 'assistant', content: data.question }])
        
        // Show evaluation feedback
        if (data.evaluation) {
          setMessages(prev => [...prev, {
            role: 'feedback',
            content: `Score: ${data.evaluation.score}/100\n${data.evaluation.feedback}`,
            suggestions: data.evaluation.suggestions
          }])
        }
      }

      setCurrentAnswer('')
    } catch (error) {
      console.error('Error submitting answer:', error)
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
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {feedback.overallScore}%
              </div>
              <p className="text-gray-300">{feedback.overallFeedback}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <h4 className="text-green-500 font-semibold mb-2">Strengths</h4>
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm">✓ {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <h4 className="text-yellow-500 font-semibold mb-2">Areas to Improve</h4>
              <ul className="space-y-1">
                {feedback.improvements.map((i, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">• {i}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
        </div>
        <Timer duration={60} onTimeUp={() => handleSubmitAnswer()} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                {message.suggestions && (
                  <div className="mt-2 pt-2 border-t border-yellow-500/30">
                    <p className="text-xs text-yellow-400">Suggestions:</p>
                    <ul className="text-xs text-yellow-300 mt-1">
                      {message.suggestions.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
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