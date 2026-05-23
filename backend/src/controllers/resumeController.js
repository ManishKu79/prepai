const parseResume = require('../services/resumeParser')

const analyzeResume = async (req, res) => {
  try {
    console.log('Resume analysis request received')
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    
    console.log(`Processing file: ${req.file.originalname}, Size: ${req.file.size} bytes`)
    
    // Parse the resume
    const analysis = await parseResume(req.file.buffer)
    
    console.log('Resume analysis completed successfully')
    
    res.json({
      success: true,
      ...analysis
    })
  } catch (error) {
    console.error('Resume analysis error:', error)
    res.status(500).json({ 
      message: 'Failed to analyze resume', 
      error: error.message 
    })
  }
}

module.exports = { analyzeResume }