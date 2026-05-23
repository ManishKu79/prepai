import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Code, Brain, Database, Globe, Server, Shield } from 'lucide-react'

const skillSuggestions = [
  'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'Express',
  'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Docker', 'AWS',
  'Java', 'C++', 'SQL', 'REST API', 'Git', 'HTML/CSS'
]

const getSkillIcon = (skill) => {
  const icons = {
    'JavaScript': Code, 'Python': Brain, 'React': Code, 'Node.js': Server,
    'MongoDB': Database, 'SQL': Database, 'AWS': Globe, 'Docker': Shield
  }
  const Icon = icons[skill] || Code
  return <Icon className="h-3 w-3" />
}

const SkillsManager = ({ skills = [], onAdd, onRemove }) => {
  const [newSkill, setNewSkill] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onAdd(newSkill.trim())
      setNewSkill('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill()
    }
  }

  const filteredSuggestions = skillSuggestions.filter(
    s => s.toLowerCase().includes(newSkill.toLowerCase()) && !skills.includes(s)
  )

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Skills</h3>

      {/* Current Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.length === 0 ? (
          <p className="text-gray-500 text-sm">No skills added yet</p>
        ) : (
          skills.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-lg"
            >
              {getSkillIcon(skill)}
              {skill}
              <button
                onClick={() => onRemove(skill)}
                className="ml-1 hover:text-blue-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))
        )}
      </div>

      {/* Add New Skill */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Add a skill (e.g., React, Python)..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setNewSkill(suggestion)
                  setShowSuggestions(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Add skills to get personalized interview questions
      </p>
    </div>
  )
}

export default SkillsManager