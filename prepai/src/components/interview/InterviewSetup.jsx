import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Target, User } from 'lucide-react'

const InterviewSetup = ({ onStart }) => {
  const [role, setRole] = useState('frontend')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [type, setType] = useState('technical')

  const roles = [
    { id: 'frontend', name: 'Frontend Developer', icon: '🎨' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: '🚀' },
    { id: 'hr', name: 'HR / Behavioral', icon: '💼' },
  ]

  const difficulties = [
    { id: 'beginner', name: 'Beginner', color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 'advanced', name: 'Advanced', color: 'text-red-500', bg: 'bg-red-500/10' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Starting interview with:', { role, difficulty, type })
    onStart({ role, difficulty, type })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Interview Setup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Role
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-lg text-center transition-all ${
                  role === r.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className="text-sm">{r.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Difficulty Level
          </label>
          <div className="flex gap-3">
            {difficulties.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                className={`flex-1 p-3 rounded-lg text-center transition-all ${
                  difficulty === d.id
                    ? `${d.bg} border border-current`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                } ${d.color}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type (for technical roles) */}
        {role !== 'hr' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Interview Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('technical')}
                className={`flex-1 p-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  type === 'technical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Target className="h-4 w-4" />
                Technical
              </button>
              <button
                type="button"
                onClick={() => setType('hr')}
                className={`flex-1 p-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  type === 'hr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <User className="h-4 w-4" />
                HR + Behavioral
              </button>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Mic className="h-5 w-5" />
          Start Mock Interview
        </button>
      </form>
    </motion.div>
  )
}

export default InterviewSetup