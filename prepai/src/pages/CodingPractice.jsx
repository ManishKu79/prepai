import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CodeEditor from '../components/coding/CodeEditor'
import ProblemCard from '../components/coding/ProblemCard'
import AIProblemGenerator from '../components/coding/AIProblemGenerator'
import { 
  Code2, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Terminal, 
  Search,
  Sparkles
} from 'lucide-react'

const CodingPractice = () => {
  const [problems, setProblems] = useState([])
  const [filteredProblems, setFilteredProblems] = useState([])
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [selectedProblemDetails, setSelectedProblemDetails] = useState(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [solvedProblems, setSolvedProblems] = useState(new Set())
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [aiProblems, setAiProblems] = useState([])

  useEffect(() => {
    fetchProblems()
    fetchStats()
    fetchSubmissions()
  }, [])

  useEffect(() => {
    const allProblems = [...problems, ...aiProblems]
    let filtered = [...allProblems]
    
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(p => p.difficulty?.toLowerCase() === difficultyFilter.toLowerCase())
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredProblems(filtered)
  }, [problems, aiProblems, difficultyFilter, searchQuery])

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coding/problems', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setProblems(data.problems)
      }
    } catch (error) {
      console.error('Error fetching problems:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coding/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coding/submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        const solved = new Set()
        data.submissions.forEach(sub => {
          if (sub.status === 'accepted') {
            const problem = [...problems, ...aiProblems].find(p => p.title === sub.problemTitle)
            if (problem) solved.add(problem.id)
          }
        })
        setSolvedProblems(solved)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }

  const fetchProblemDetails = async (problemId) => {
    try {
      // Check if it's an AI-generated problem first
      const aiProblem = aiProblems.find(p => p.id === problemId)
      if (aiProblem) {
        setSelectedProblemDetails(aiProblem)
        setCode(aiProblem.starterCode)
        setResult(null)
        return
      }
      
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/coding/problems/${problemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setSelectedProblemDetails(data.problem)
        setCode(data.problem.starterCode)
        setResult(null)
      }
    } catch (error) {
      console.error('Error fetching problem details:', error)
    }
  }

  const handleSelectProblem = (problemId) => {
    setSelectedProblem(problemId)
    fetchProblemDetails(problemId)
  }

  const handleSubmit = async () => {
    if (!selectedProblem || !code) return
    
    setIsSubmitting(true)
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/coding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: selectedProblem,
          code: code,
          language: 'javascript'
        })
      })

      const data = await response.json()
      setResult(data)
      
      if (data.status === 'accepted') {
        fetchStats()
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error submitting solution:', error)
      setResult({ status: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIProblemGenerated = (newProblem) => {
    setAiProblems(prev => {
      // Check if problem already exists
      if (prev.some(p => p.id === newProblem.id)) return prev
      return [newProblem, ...prev]
    })
    setShowAIGenerator(false)
    // Auto-select the new problem
    setTimeout(() => {
      handleSelectProblem(newProblem.id)
    }, 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Coding Practice</h1>
        <p className="text-gray-400 mt-1">
          Solve DSA problems with AI-generated challenges and instant feedback
        </p>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Solved</span>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.problemsSolved || 0}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Acceptance</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.acceptanceRate || 0}%</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Submissions</span>
              <Code2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalSubmissions || 0}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Problems</span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-white">{problems.length + aiProblems.length}</div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problems List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Filters and AI Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
              <button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                  showAIGenerator
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                AI Generate
              </button>
            </div>
          </div>

          {/* AI Generator Panel */}
          {showAIGenerator && (
            <AIProblemGenerator 
              onProblemGenerated={handleAIProblemGenerated}
              onAddToProblems={(problem) => {
                handleAIProblemGenerated(problem)
              }}
            />
          )}

          <h2 className="text-white font-semibold">
            Problems ({filteredProblems.length})
          </h2>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onSelect={handleSelectProblem}
                isSelected={selectedProblem === problem.id}
                isSolved={solvedProblems.has(problem.id)}
              />
            ))}
            {filteredProblems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No problems found matching your criteria
              </div>
            )}
          </div>
        </motion.div>

        {/* Code Editor Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Code Editor</h2>
            {selectedProblemDetails && (
              <span className="text-xs text-gray-500">
                {selectedProblemDetails.difficulty?.toUpperCase()} • {selectedProblemDetails.category}
              </span>
            )}
          </div>
          
          {selectedProblemDetails ? (
            <>
              {/* Problem Title */}
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium">{selectedProblemDetails.title}</h3>
                  {selectedProblemDetails.isGenerated && (
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> AI Generated
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {selectedProblemDetails.description}
                </p>
              </div>

              {/* Code Editor */}
              <CodeEditor
                initialCode={code}
                onChange={setCode}
              />
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Terminal className="h-4 w-4" />
                    Submit Solution
                  </>
                )}
              </button>

              {/* Result Display */}
              {result && (
                <div className={`rounded-lg p-4 ${
                  result.status === 'accepted' 
                    ? 'bg-green-500/10 border border-green-500'
                    : result.status === 'error'
                    ? 'bg-red-500/10 border border-red-500'
                    : 'bg-yellow-500/10 border border-yellow-500'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {result.status === 'accepted' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`font-semibold ${
                      result.status === 'accepted' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {result.status === 'accepted' ? '✓ Accepted!' : '✗ Wrong Answer'}
                    </span>
                    <span className="text-gray-400 text-sm ml-auto">
                      Passed {result.passedCount || 0} / {result.totalTests || 0} tests
                    </span>
                  </div>
                  
                  {result.testResults && result.testResults.map((test, idx) => (
                    <div key={idx} className="mt-2 text-xs border-t border-gray-700 pt-2">
                      <div className="flex items-center justify-between">
                        <span className={test.passed ? 'text-green-500' : 'text-red-500'}>
                          Test {idx + 1}: {test.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                      {!test.passed && (
                        <div className="text-gray-500 mt-1 space-y-1">
                          <div>Expected: {test.expectedOutput}</div>
                          <div>Got: {test.actualOutput}</div>
                          {test.error && <div className="text-red-400">Error: {test.error}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
              <Code2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a problem to start coding</p>
              <p className="text-gray-500 text-sm mt-2">Or click "AI Generate" for a custom problem</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CodingPractice