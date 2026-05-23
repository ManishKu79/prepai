import { useState } from 'react'
import { motion } from 'framer-motion'
import ResumeUploader from '../components/resume/ResumeUploader'
import ATSScoreCard from '../components/resume/ATSScoreCard'
import SkillsExtractor from '../components/resume/SkillsExtractor'
import SuggestionsList from '../components/resume/SuggestionsList'
import { FileText, AlertCircle } from 'lucide-react'

const ResumeAnalyzer = () => {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)
  const [analyzed, setAnalyzed] = useState(false)

  const handleUploadSuccess = (data) => {
    setAnalysisResult(data)
    setAnalyzed(true)
    setError(null)
  }

  const handleUploadError = (errorMsg) => {
    setError(errorMsg)
    setAnalyzed(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Resume Analyzer</h1>
        <p className="text-gray-400 mt-1">
          Get AI-powered insights to optimize your resume for ATS
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-white font-semibold">Upload Your Resume</h2>
        </div>
        
        <ResumeUploader
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500 rounded-xl p-4 flex items-center space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-500">{error}</p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analyzed && analysisResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ATSScoreCard 
              score={analysisResult.atsScore} 
              feedback={analysisResult.feedback}
            />
            <SkillsExtractor skills={analysisResult.skills} />
          </div>
          <SuggestionsList suggestions={analysisResult.suggestions} />
        </motion.div>
      )}

      {/* Tips Section */}
      {!analyzed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/10 border border-blue-500 rounded-xl p-4"
        >
          <h3 className="text-blue-500 font-semibold mb-2">💡 Pro Tips</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use standard fonts like Arial, Calibri, or Times New Roman</li>
            <li>• Save your resume as a PDF to preserve formatting</li>
            <li>• Include relevant keywords from job descriptions</li>
            <li>• Keep your resume to 1-2 pages maximum</li>
            <li>• Use bullet points for easy readability</li>
          </ul>
        </motion.div>
      )}
    </div>
  )
}

export default ResumeAnalyzer