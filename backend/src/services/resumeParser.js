const pdfParse = require('pdf-parse')

// Mock implementation - in production, use AI API
const parseResume = async (pdfBuffer) => {
  try {
    // Extract text from PDF
    const data = await pdfParse(pdfBuffer)
    const text = data.text.toLowerCase()
    
    // Extract skills (common tech skills)
    const skillKeywords = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
      'express', 'mongodb', 'postgresql', 'mysql', 'aws', 'docker', 'kubernetes',
      'git', 'html', 'css', 'typescript', 'next.js', 'tailwind', 'bootstrap'
    ]
    
    const detectedSkills = skillKeywords.filter(skill => 
      text.includes(skill.toLowerCase())
    )
    
    // Calculate ATS Score
    let score = 70 // Base score
    
    // Check for keywords
    const keywords = ['experience', 'education', 'skills', 'project', 'achievement']
    const keywordCount = keywords.filter(kw => text.includes(kw)).length
    score += keywordCount * 5
    
    // Check for measurable achievements
    if (text.match(/\d+%/)) score += 5
    if (text.match(/\d+ years?/)) score += 5
    
    // Cap at 95
    score = Math.min(score, 95)
    
    // Generate feedback
    const feedback = []
    if (keywordCount < 3) {
      feedback.push({
        type: 'warning',
        message: 'Missing key sections like Experience or Education'
      })
    } else {
      feedback.push({
        type: 'positive',
        message: 'Good structure with clear sections'
      })
    }
    
    if (detectedSkills.length < 5) {
      feedback.push({
        type: 'warning',
        message: 'Consider adding more technical skills'
      })
    } else {
      feedback.push({
        type: 'positive',
        message: `Found ${detectedSkills.length} relevant skills`
      })
    }
    
    // Generate suggestions
    const suggestions = []
    
    if (detectedSkills.length < 5) {
      suggestions.push({
        priority: 'high',
        title: 'Add More Technical Skills',
        description: 'Include relevant technologies and tools you know',
        example: 'JavaScript, React, Node.js, MongoDB, Git'
      })
    }
    
    if (!text.includes('linkedin')) {
      suggestions.push({
        priority: 'medium',
        title: 'Add LinkedIn Profile',
        description: 'Include your LinkedIn URL for recruiters',
        example: 'linkedin.com/in/yourname'
      })
    }
    
    if (!text.match(/\d+%/)) {
      suggestions.push({
        priority: 'high',
        title: 'Add Measurable Achievements',
        description: 'Use numbers and percentages to show impact',
        example: 'Improved performance by 40%'
      })
    }
    
    if (text.length < 500) {
      suggestions.push({
        priority: 'high',
        title: 'Add More Content',
        description: 'Your resume seems brief. Add more details about your experience',
        example: 'Expand on your projects and responsibilities'
      })
    }
    
    return {
      atsScore: score,
      skills: detectedSkills.slice(0, 10),
      feedback,
      suggestions,
      text: data.text.substring(0, 500)
    }
  } catch (error) {
    console.error('Resume parsing error:', error)
    throw new Error('Failed to parse resume')
  }
}

module.exports = parseResume