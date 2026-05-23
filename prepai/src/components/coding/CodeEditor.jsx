import React, { useState, useEffect } from 'react'

const SimpleCodeEditor = ({ initialCode, onChange, readOnly = false }) => {
  const [code, setCode] = useState(initialCode || '// Write your code here\n\nfunction solution() {\n    \n}')

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode)
    }
  }, [initialCode])

  const handleCodeChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    if (onChange) {
      onChange(newCode)
    }
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-400">JavaScript</span>
        <span className="text-xs text-gray-500">Write your solution below</span>
      </div>
      <textarea
        value={code}
        onChange={handleCodeChange}
        readOnly={readOnly}
        className="w-full bg-[#1a1a2e] text-gray-300 font-mono text-sm p-4 focus:outline-none resize-none"
        style={{ minHeight: '300px', fontFamily: 'monospace' }}
        spellCheck={false}
      />
    </div>
  )
}

export default SimpleCodeEditor