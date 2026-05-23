import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Zap, CheckCircle, XCircle, AlertCircle, Download, Plus } from 'lucide-react'

const AIProblemGenerator = ({ onProblemGenerated, onAddToProblems }) => {
  const [category, setCategory] = useState('arrays')
  const [difficulty, setDifficulty] = useState('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProblem, setGeneratedProblem] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAIStatus()
  }, [])

  const checkAIStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coding/ai/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setAiStatus(data)
    } catch (error) {
      console.error('Error checking AI status:', error)
    }
  }

  const categories = [
    { id: 'arrays', name: 'Arrays', icon: '📊', color: 'blue' },
    { id: 'strings', name: 'Strings', icon: '📝', color: 'green' },
    { id: 'stacks', name: 'Stacks', icon: '📚', color: 'purple' },
    { id: 'linked-lists', name: 'Linked Lists', icon: '🔗', color: 'orange' },
    { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '⚡', color: 'red' },
    { id: 'searching', name: 'Searching', icon: '🔍', color: 'cyan' },
    { id: 'sorting', name: 'Sorting', icon: '📈', color: 'yellow' }
  ]

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { id: 'hard', name: 'Hard', color: 'text-red-400', bg: 'bg-red-500/20' }
  ]

  const generateProblem = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coding/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, difficulty })
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedProblem(data.problem)
        if (onProblemGenerated) {
          onProblemGenerated(data.problem)
        }
      } else {
        setError(data.message || 'Failed to generate problem')
      }
    } catch (error) {
      console.error('Error generating problem:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddToProblems = () => {
    if (generatedProblem && onAddToProblems) {
      onAddToProblems(generatedProblem)
    }
  }

  const getDifficultyColor = (diff) => {
    const diffObj = difficulties.find(d => d.id === diff)
    return diffObj ? diffObj.color : 'text-gray-400'
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-white font-semibold">AI Problem Generator</h3>
          {aiStatus?.aiConfigured ? (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> AI Ready
            </span>
          ) : (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Fallback Mode
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Select Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-2 rounded-lg text-center transition-all ${
                  category === cat.id
                    ? `bg-${cat.color}-600 text-white`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <div className="text-lg">{cat.icon}</div>
                <div className="text-xs mt-1">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Difficulty Level</label>
          <div className="flex gap-2">
            {difficulties.map(diff => (
              <button
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  difficulty === diff.id
                    ? `${diff.bg} border border-current ${diff.color}`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateProblem}
          disabled={isGenerating}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate AI Problem
            </>
          )}
        </button>

        {/* Generated Problem Preview */}
        <AnimatePresence>
          {generatedProblem && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Problem Generated!</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(generatedProblem.difficulty)} bg-gray-700`}>
                    {generatedProblem.difficulty?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleAddToProblems}
                  className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Add to problems list"
                >
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              
              <p className="text-white font-medium">{generatedProblem.title}</p>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                {generatedProblem.description?.substring(0, 100)}...
              </p>
              
              <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-500">Category: {generatedProblem.category}</span>
                <span className="text-xs text-gray-500">Test Cases: {generatedProblem.testCases?.length || 3}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Note */}
        <div className="mt-3 p-2 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            {aiStatus?.aiConfigured 
              ? "🤖 AI is generating unique problems based on your selection"
              : "⚠️ OpenAI API key not configured. Using fallback problems."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIProblemGenerator