const OpenAI = require('openai')

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Check if OpenAI is configured
const isOpenAIConfigured = () => {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-proj-your-actual-openai-api-key-here'
}

// ============ EXISTING FUNCTIONS (Keep these) ============

// Generate interview question based on role and difficulty
const generateQuestion = async (role, difficulty, previousQuestions = []) => {
  if (!isOpenAIConfigured()) {
    return getFallbackQuestion(role, difficulty, previousQuestions)
  }

  try {
    const roleNames = {
      frontend: 'Frontend Developer',
      backend: 'Backend Developer',
      fullstack: 'Full Stack Developer',
      hr: 'HR/Behavioral Interview'
    }

    const prompt = `You are an AI technical interviewer for campus placements.
    
    Generate a ${difficulty} level interview question for a ${roleNames[role] || role} position.
    
    Requirements:
    - Question should be relevant to ${role} development
    - Difficulty: ${difficulty}
    - Keep it concise (1-2 sentences)
    
    ${previousQuestions.length > 0 ? `Don't repeat these questions: ${previousQuestions.join(', ')}` : ''}
    
    Return ONLY the question text, nothing else.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a technical interviewer for placement drives." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const question = completion.choices[0].message.content.trim()
    const keywords = extractKeywords(question, role)
    
    return {
      question,
      type: role === 'hr' ? 'behavioral' : 'technical',
      expectedKeywords: keywords
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return getFallbackQuestion(role, difficulty, previousQuestions)
  }
}

// Evaluate interview answer
const evaluateAnswer = async (question, answer, expectedKeywords) => {
  if (!isOpenAIConfigured()) {
    return getFallbackEvaluation(answer, expectedKeywords)
  }

  try {
    const prompt = `You are an AI interviewer evaluating a candidate's answer.
    
    Question: "${question}"
    Candidate's Answer: "${answer}"
    
    Return a JSON object with:
    {
      "score": 85,
      "feedback": "Brief feedback here",
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "strengths": ["Strength 1", "Strength 2"]
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 300,
    })

    const content = completion.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
    
    return {
      score: result.score || 70,
      feedback: result.feedback || "Good attempt!",
      suggestions: result.suggestions || ["Be more specific"],
      strengths: result.strengths || ["Answered the question"]
    }
  } catch (error) {
    console.error('OpenAI Evaluation Error:', error)
    return getFallbackEvaluation(answer, expectedKeywords)
  }
}

// Generate final feedback after interview
const generateFinalFeedback = async (answers) => {
  if (!isOpenAIConfigured()) {
    return getFallbackFinalFeedback(answers)
  }

  try {
    const answersSummary = answers.map((a, i) => 
      `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}\nScore: ${a.score}`
    ).join('\n\n')
    
    const prompt = `Based on this interview performance, provide feedback.
    
    ${answersSummary}
    
    Return JSON: { "overallScore": 75, "overallFeedback": "...", "strengths": [...], "improvements": [...], "recommendations": [...] }`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    const content = completion.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
    
    const avgScore = result.overallScore || 
      Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length)
    
    return {
      overallScore: avgScore,
      overallFeedback: result.overallFeedback || "Good performance!",
      strengths: result.strengths || ["Answered all questions"],
      improvements: result.improvements || ["Be more detailed"],
      recommendations: result.recommendations || ["Practice more"],
      totalQuestions: answers.length
    }
  } catch (error) {
    console.error('OpenAI Final Feedback Error:', error)
    return getFallbackFinalFeedback(answers)
  }
}

// ============ NEW: CODING PROBLEM GENERATION ============

// Generate coding problem using OpenAI
const generateCodingProblem = async (category, difficulty) => {
  if (!isOpenAIConfigured()) {
    return getFallbackCodingProblem(category, difficulty)
  }

  try {
    const categories = {
      'arrays': 'array manipulation, traversal, two-pointer techniques',
      'strings': 'string manipulation, pattern matching, anagrams',
      'stacks': 'stack operations, parentheses, expression evaluation',
      'linked-lists': 'linked list traversal, reversal, cycle detection',
      'dynamic-programming': 'DP with memoization, tabulation, optimal substructure',
      'searching': 'binary search, search algorithms, finding elements',
      'sorting': 'sorting algorithms, custom sorting, merge sort'
    }

    const prompt = `You are a coding interview question generator for placement preparation.
    
    Generate a ${difficulty} level coding problem for the ${category} category.
    
    Category Focus: ${categories[category] || 'general coding concepts'}
    
    Return a JSON object with EXACTLY this structure (no extra text):
    {
      "title": "Problem Title Here",
      "description": "Detailed problem description.",
      "examples": [
        { "input": "Example input", "output": "Expected output", "explanation": "Brief explanation" }
      ],
      "constraints": ["Constraint 1", "Constraint 2"],
      "testCases": [
        { "input": "test input 1", "expected": "expected output 1" },
        { "input": "test input 2", "expected": "expected output 2" },
        { "input": "test input 3", "expected": "expected output 3" }
      ],
      "starterCode": "function problemName(param1, param2) {\n    // Write your solution here\n    \n}"
    }
    
    Requirements:
    - Title should be descriptive and catchy
    - Description should be clear and test understanding
    - Provide 2-3 examples
    - Include 3-4 realistic constraints
    - Create 3 test cases that test edge cases
    - Difficulty: ${difficulty}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a coding interview question generator. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0].message.content
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    let problem = null
    
    if (jsonMatch) {
      problem = JSON.parse(jsonMatch[0])
    } else {
      problem = JSON.parse(response)
    }
    
    return {
      ...problem,
      id: Date.now(),
      category,
      difficulty,
      isGenerated: true,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('OpenAI Problem Generation Error:', error)
    return getFallbackCodingProblem(category, difficulty)
  }
}

// Evaluate coding solution with AI
const evaluateCodingSolution = async (problem, code, testResults) => {
  if (!isOpenAIConfigured()) {
    return getFallbackCodingEvaluation(testResults)
  }

  try {
    const passedCount = testResults.filter(r => r.passed).length
    const totalTests = testResults.length
    
    const prompt = `You are a coding interview evaluator. Evaluate this solution.
    
    Problem: ${problem.title}
    
    Code Submitted:
    ${code.substring(0, 1500)}
    
    Test Results: ${passedCount}/${totalTests} tests passed
    
    Return a JSON object:
    {
      "score": 85,
      "feedback": "Detailed feedback",
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "strengths": ["Strength 1", "Strength 2"],
      "improvements": ["Improvement 1", "Improvement 2"]
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a coding interview evaluator. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    const response = completion.choices[0].message.content
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return getFallbackCodingEvaluation(testResults)
  } catch (error) {
    console.error('OpenAI Evaluation Error:', error)
    return getFallbackCodingEvaluation(testResults)
  }
}

// ============ FALLBACK FUNCTIONS ============

const extractKeywords = (question, role) => {
  const keywords = {
    frontend: ['react', 'javascript', 'css', 'html', 'components', 'state', 'props', 'hooks'],
    backend: ['database', 'api', 'server', 'sql', 'nosql', 'authentication', 'caching'],
    fullstack: ['frontend', 'backend', 'api', 'database', 'fullstack', 'integration'],
    hr: ['team', 'leadership', 'conflict', 'motivation', 'goal', 'achievement']
  }
  const roleKeywords = keywords[role] || keywords.frontend
  const questionLower = question.toLowerCase()
  return roleKeywords.filter(kw => questionLower.includes(kw.toLowerCase())).slice(0, 3)
}

const getFallbackQuestion = (role, difficulty, previousQuestions) => {
  const fallbackQuestions = {
    frontend: {
      beginner: ["What is the difference between let, const, and var in JavaScript?"],
      intermediate: ["Explain how React's virtual DOM works."],
      advanced: ["How would you optimize a React application's performance?"]
    },
    backend: {
      beginner: ["What is the difference between SQL and NoSQL databases?"],
      intermediate: ["Explain JWT authentication flow."],
      advanced: ["How would you design a rate limiting system?"]
    }
  }
  const questions = fallbackQuestions[role]?.[difficulty] || fallbackQuestions.frontend.beginner
  const availableQuestions = questions.filter(q => !previousQuestions.includes(q))
  const question = availableQuestions[0] || questions[0]
  return { question, type: 'technical', expectedKeywords: [] }
}

const getFallbackEvaluation = (answer, expectedKeywords) => {
  let score = 50
  expectedKeywords.forEach(keyword => {
    if (answer.toLowerCase().includes(keyword.toLowerCase())) score += 10
  })
  if (answer.length > 100) score += 10
  score = Math.min(score, 100)
  return {
    score,
    feedback: "Good attempt! Keep practicing.",
    suggestions: ["Be more specific", "Use examples"],
    strengths: ["Attempted to answer"]
  }
}

const getFallbackFinalFeedback = (answers) => {
  const avgScore = Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length)
  return {
    overallScore: avgScore,
    overallFeedback: avgScore >= 70 ? "Good job!" : "Keep practicing!",
    strengths: ["Answered all questions"],
    improvements: ["Be more detailed"],
    recommendations: ["Practice more"],
    totalQuestions: answers.length
  }
}

const getFallbackCodingProblem = (category, difficulty) => {
  const fallbackProblems = {
    'arrays': {
      title: "Find the Missing Number",
      description: "Given an array containing n distinct numbers taken from 0 to n, find the missing number.",
      examples: [{ input: "[3,0,1]", output: "2", explanation: "The missing number is 2" }],
      constraints: ["n == nums.length", "1 <= n <= 10^4"],
      testCases: [
        { input: "[3,0,1]", expected: 2 },
        { input: "[0,1]", expected: 2 },
        { input: "[9,6,4,2,3,5,7,0,1]", expected: 8 }
      ],
      starterCode: "function missingNumber(nums) {\n    // Write your solution here\n    \n}"
    },
    'strings': {
      title: "Valid Anagram",
      description: "Given two strings s and t, return true if t is an anagram of s.",
      examples: [{ input: "s = 'anagram', t = 'nagaram'", output: "true", explanation: "Same characters" }],
      constraints: ["1 <= s.length, t.length <= 5 * 10^4"],
      testCases: [
        { input: "'anagram', 'nagaram'", expected: true },
        { input: "'rat', 'car'", expected: false }
      ],
      starterCode: "function isAnagram(s, t) {\n    // Write your solution here\n    \n}"
    }
  }
  return fallbackProblems[category] || fallbackProblems['arrays']
}

const getFallbackCodingEvaluation = (testResults) => {
  const passedCount = testResults.filter(r => r.passed).length
  const score = Math.round((passedCount / testResults.length) * 100)
  return {
    score,
    feedback: score === 100 ? "Excellent! All tests passed." : "Good attempt. Some tests failed.",
    suggestions: ["Handle edge cases", "Optimize your solution"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    strengths: ["Solution works for basic cases"],
    improvements: ["Consider edge cases", "Optimize performance"]
  }
}

module.exports = {
  // Interview functions
  generateQuestion,
  evaluateAnswer,
  generateFinalFeedback,
  // Coding functions
  generateCodingProblem,
  evaluateCodingSolution,
  // Utility
  isOpenAIConfigured
}