import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Code2, Clock, Database } from 'lucide-react'

const ProblemCard = ({ problem, onSelect, isSelected, isSolved }) => {
  const [expanded, setExpanded] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'Hard': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div 
      className={`bg-gray-900 rounded-xl border transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 ring-1 ring-blue-500' 
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Header */}
      <div 
        className="p-4"
        onClick={() => onSelect(problem.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <Code2 className="h-4 w-4 text-gray-500" />
              <h3 className="text-white font-semibold">{problem.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyBadge(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              {isSolved && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  ✓ Solved
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Database className="h-3 w-3" />
                {problem.category}
              </span>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {problem.difficulty === 'Easy' ? '15 min' : problem.difficulty === 'Medium' ? '30 min' : '45 min'}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 space-y-3">
          {/* Description */}
          <div className="pt-3">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Description</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{problem.description}</p>
          </div>

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Examples</h4>
              {problem.examples.map((example, idx) => (
                <div key={idx} className="bg-gray-800/50 rounded-lg p-3 mb-2">
                  <p className="text-gray-400 text-xs font-mono mb-1">Input: {example.input}</p>
                  <p className="text-gray-400 text-xs font-mono mb-1">Output: {example.output}</p>
                  {example.explanation && (
                    <p className="text-gray-500 text-xs mt-1">💡 {example.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Constraints</h4>
              <ul className="list-disc list-inside text-gray-500 text-xs space-y-0.5">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProblemCard