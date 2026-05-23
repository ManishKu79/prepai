import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const ResumeUploader = ({ onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      await handleUpload(selectedFile)
    } else {
      onUploadError('Please upload a PDF file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  const handleUpload = async (fileToUpload) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('resume', fileToUpload)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        onUploadSuccess(data)
      } else {
        onUploadError(data.message || 'Analysis failed')
      }
    } catch (error) {
      onUploadError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}
          ${file ? 'bg-green-500/10 border-green-500' : ''}`}
      >
        <input {...getInputProps()} />
        
        {!file ? (
          <div>
            <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-white mb-2">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
            </p>
            <p className="text-gray-500 text-sm">or click to browse</p>
            <p className="text-gray-600 text-xs mt-2">PDF only (Max 5MB)</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">{file.name}</p>
                <p className="text-gray-500 text-xs">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {uploading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="text-gray-400">Analyzing your resume...</span>
        </div>
      )}
    </div>
  )
}

export default ResumeUploader