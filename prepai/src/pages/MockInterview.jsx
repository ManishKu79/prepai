import { useState } from 'react'
import { motion } from 'framer-motion'
import InterviewSetup from '../components/interview/InterviewSetup'
import InterviewChat from '../components/interview/InterviewChat'
import { Sparkles } from 'lucide-react'

const MockInterview = () => {
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewId, setInterviewId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartInterview = async (setupData) => {
    setIsLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(setupData)
      })

      const data = await response.json()
      
      if (data.success) {
        setInterviewId(data.interviewId)
        setInterviewStarted(true)
      } else {
        alert(data.message || 'Failed to start interview')
      }
    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterviewComplete = (feedback) => {
    console.log('Interview completed with feedback:', feedback)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">AI Mock Interview</h1>
        <p className="text-gray-400 mt-1">
          Practice with our AI interviewer powered by OpenAI and get instant feedback
        </p>
      </motion.div>

      {!interviewStarted ? (
        <>
          <InterviewSetup onStart={handleStartInterview} />
          
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-400 ml-3">Starting your interview...</span>
            </div>
          )}

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-500/10 border border-blue-500 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h3 className="text-blue-500 font-semibold">AI Interview Tips</h3>
            </div>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Take your time to think before answering</li>
              <li>• Structure your answers using STAR method (Situation, Task, Action, Result)</li>
              <li>• Use specific examples from your projects or experience</li>
              <li>• Be honest and authentic in your responses</li>
              <li>• Practice active listening and ask clarifying questions if needed</li>
              <li>• The AI will provide instant feedback after each answer</li>
            </ul>
          </motion.div>
        </>
      ) : (
        <InterviewChat
          interviewId={interviewId}
          onComplete={handleInterviewComplete}
        />
      )}
    </div>
  )
}

export default MockInterview