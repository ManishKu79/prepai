const CodingSubmission = require('../models/CodingSubmission')
const problems = require('../data/codingProblems.json')
const { generateCodingProblem, evaluateCodingSolution } = require('../services/openaiService')

// Helper function to safely execute user code
const executeCode = (code, testCase) => {
  try {
    const { input, expected } = testCase
    
    let args = []
    if (input.includes(', ')) {
      args = input.split(', ').map(arg => {
        try {
          return JSON.parse(arg)
        } catch {
          return arg.replace(/['"]/g, '')
        }
      })
    } else {
      try {
        args = [JSON.parse(input)]
      } catch {
        args = [input.replace(/['"]/g, '')]
      }
    }
    
    const functionMatch = code.match(/function\s+(\w+)\s*\(/)
    const functionName = functionMatch ? functionMatch[1] : 'solution'
    
    const wrappedCode = `
      ${code}
      const result = ${functionName}(${args.map(arg => JSON.stringify(arg)).join(', ')});
      result;
    `
    
    const result = eval(wrappedCode)
    const output = JSON.stringify(result)
    const expectedOutput = JSON.stringify(expected)
    
    return {
      passed: output === expectedOutput,
      actualOutput: output,
      expectedOutput: expectedOutput
    }
  } catch (error) {
    return {
      passed: false,
      actualOutput: error.message,
      expectedOutput: JSON.stringify(testCase.expected),
      error: error.message
    }
  }
}

const submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body
    const userId = req.user._id
    
    const problem = problems.find(p => p.id === problemId)
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' })
    }
    
    console.log(`[Coding] Submitting solution for problem ${problemId}`)
    
    const testResults = []
    let passedCount = 0
    
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i]
      const result = executeCode(code, testCase)
      
      testResults.push({
        testCase: testCase.input,
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: result.expectedOutput,
        error: result.error
      })
      
      if (result.passed) passedCount++
    }
    
    const status = passedCount === problem.testCases.length ? 'accepted' : 'wrong_answer'
    
    const submission = new CodingSubmission({
      userId,
      problemId,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      code,
      language: language || 'javascript',
      testResults,
      passedCount,
      totalTests: problem.testCases.length,
      status,
      submittedAt: new Date()
    })
    
    await submission.save()
    
    res.json({
      success: true,
      status,
      passedCount,
      totalTests: problem.testCases.length,
      testResults,
      submissionId: submission._id
    })
  } catch (error) {
    console.error('Submit solution error:', error)
    res.status(500).json({ message: 'Failed to submit solution', error: error.message })
  }
}

const getProblems = async (req, res) => {
  try {
    const { difficulty, category } = req.query
    
    let filteredProblems = problems
    
    if (difficulty) {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty)
    }
    
    if (category) {
      filteredProblems = filteredProblems.filter(p => p.category === category)
    }
    
    res.json({
      success: true,
      problems: filteredProblems.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        category: p.category,
        description: p.description.substring(0, 100) + '...'
      }))
    })
  } catch (error) {
    console.error('Get problems error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getProblemDetails = async (req, res) => {
  try {
    const { problemId } = req.params
    const problem = problems.find(p => p.id === parseInt(problemId))
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' })
    }
    
    res.json({
      success: true,
      problem: {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        starterCode: problem.starterCode
      }
    })
  } catch (error) {
    console.error('Get problem details error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getSubmissions = async (req, res) => {
  try {
    const userId = req.user._id
    const submissions = await CodingSubmission.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(50)
    
    res.json({
      success: true,
      submissions: submissions.map(s => ({
        id: s._id,
        problemTitle: s.problemTitle,
        difficulty: s.difficulty,
        status: s.status,
        passedCount: s.passedCount,
        totalTests: s.totalTests,
        submittedAt: s.submittedAt
      }))
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getStats = async (req, res) => {
  try {
    const userId = req.user._id
    const submissions = await CodingSubmission.find({ userId })
      .sort({ submittedAt: -1 })
    
    const totalSubmissions = submissions.length
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length
    const acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0
    
    // Recent submissions for activity feed
    const recentSubmissions = submissions.slice(0, 5).map(s => ({
      id: s._id,
      problemTitle: s.problemTitle,
      status: s.status,
      passedCount: s.passedCount,
      totalTests: s.totalTests,
      submittedAt: s.submittedAt
    }))
    
    // Difficulty stats
    const difficultyStats = {
      Easy: { total: 0, accepted: 0 },
      Medium: { total: 0, accepted: 0 },
      Hard: { total: 0, accepted: 0 }
    }
    
    submissions.forEach(s => {
      if (difficultyStats[s.difficulty]) {
        difficultyStats[s.difficulty].total++
        if (s.status === 'accepted') {
          difficultyStats[s.difficulty].accepted++
        }
      }
    })
    
    const uniqueProblems = new Set()
    submissions.forEach(s => {
      if (s.status === 'accepted') {
        uniqueProblems.add(s.problemId)
      }
    })
    
    res.json({
      success: true,
      stats: {
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate: Math.round(acceptanceRate),
        problemsSolved: uniqueProblems.size,
        difficultyStats,
        recentSubmissions
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ============ AI POWERED FUNCTIONS ============

const generateAIProblem = async (req, res) => {
  try {
    const { category, difficulty } = req.body
    
    console.log(`[AI Coding] Generate problem request received: category=${category}, difficulty=${difficulty}`)
    
    if (!category || !difficulty) {
      return res.status(400).json({ message: 'Category and difficulty are required' })
    }
    
    const problem = await generateCodingProblem(category, difficulty)
    
    console.log(`[AI Coding] Problem generated: ${problem.title}`)
    
    res.json({
      success: true,
      problem,
      message: 'AI-generated problem created successfully'
    })
  } catch (error) {
    console.error('[AI Coding] Generate error:', error)
    res.status(500).json({ message: 'Failed to generate problem', error: error.message })
  }
}

const evaluateWithAI = async (req, res) => {
  try {
    const { problemId, code, testResults, problem } = req.body
    
    let problemData = problem
    if (!problemData && problemId) {
      problemData = problems.find(p => p.id === parseInt(problemId))
    }
    
    if (!problemData) {
      return res.status(404).json({ message: 'Problem not found' })
    }
    
    const evaluation = await evaluateCodingSolution(problemData, code, testResults || [])
    
    res.json({
      success: true,
      evaluation,
      message: 'AI evaluation completed'
    })
  } catch (error) {
    console.error('[AI Coding] Evaluate error:', error)
    res.status(500).json({ message: 'Failed to evaluate solution', error: error.message })
  }
}

const getAIStatus = async (req, res) => {
  const { isOpenAIConfigured } = require('../services/openaiService')
  
  res.json({
    success: true,
    aiConfigured: isOpenAIConfigured(),
    message: isOpenAIConfigured() ? 'AI service is ready' : 'OpenAI API key not configured'
  })
}

// EXPORT ALL FUNCTIONS
module.exports = {
  submitSolution,
  getProblems,
  getProblemDetails,
  getSubmissions,
  getStats,
  generateAIProblem,
  evaluateWithAI,
  getAIStatus
}