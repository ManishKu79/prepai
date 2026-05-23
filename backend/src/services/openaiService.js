const OpenAI = require('openai')

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Check if OpenAI is configured
const isOpenAIConfigured = () => {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-proj-your-actual-openai-api-key-here'
}

// Generate unique interview question (no repeats)
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

    const difficultyLevels = {
      beginner: 'basic concepts and fundamentals',
      intermediate: 'practical scenarios and problem-solving',
      advanced: 'system design, optimization, and edge cases'
    }

    // Create context about previous questions to avoid repeats
    const previousContext = previousQuestions.length > 0 
      ? `\n\nPreviously asked questions (DO NOT repeat these):\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : ''

    const prompt = `You are an AI technical interviewer for campus placements.
    
    Generate a UNIQUE ${difficulty} level interview question for a ${roleNames[role] || role} position.
    
    Requirements:
    - Question must be DIFFERENT from any previous questions
    - Difficulty: ${difficulty} (${difficultyLevels[difficulty]})
    - Question should test practical knowledge and problem-solving ability
    - Make it challenging but fair for a college student
    - Be specific and detailed
    - Return ONLY the question text, nothing else
    ${previousContext}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a technical interviewer for placement drives. Generate unique, relevant interview questions. Never repeat questions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8, // Higher temperature for more variety
      max_tokens: 200,
    })

    let question = completion.choices[0].message.content.trim()
    
    // Clean up the question (remove quotes, numbering, etc.)
    question = question.replace(/^["']|["']$/g, '')
    question = question.replace(/^\d+\.\s*/, '')
    
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

// Evaluate answer with detailed feedback
const evaluateAnswer = async (question, answer, expectedKeywords) => {
  if (!isOpenAIConfigured()) {
    return getFallbackEvaluation(answer, expectedKeywords)
  }

  try {
    const prompt = `You are an AI interviewer evaluating a candidate's answer for a placement interview.
    
    Question: "${question}"
    Candidate's Answer: "${answer}"
    
    Evaluate this answer on:
    1. Relevance to the question (0-25 points)
    2. Technical accuracy and correctness (0-25 points)
    3. Clarity, structure, and communication (0-25 points)
    4. Use of specific examples and details (0-25 points)
    
    Return a JSON object with EXACTLY this structure:
    {
      "score": 85,
      "feedback": "Brief constructive feedback (1-2 sentences)",
      "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
      "strengths": ["Strength 1", "Strength 2"]
    }
    
    Score should be between 0-100. Be honest but encouraging.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI interviewer evaluating candidate answers. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 400,
    })

    const content = completion.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
    
    return {
      score: result.score || 70,
      feedback: result.feedback || "Good attempt! Keep practicing.",
      suggestions: result.suggestions || ["Be more specific", "Use examples", "Structure your answer"],
      strengths: result.strengths || ["Attempted to answer the question"]
    }
  } catch (error) {
    console.error('OpenAI Evaluation Error:', error)
    return getFallbackEvaluation(answer, expectedKeywords)
  }
}

// Generate final feedback
const generateFinalFeedback = async (answers) => {
  if (!isOpenAIConfigured()) {
    return getFallbackFinalFeedback(answers)
  }

  try {
    const answersSummary = answers.map((a, i) => 
      `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}\nScore: ${a.score}\nFeedback: ${a.feedback}`
    ).join('\n\n')
    
    const prompt = `You are an AI career coach helping a student prepare for placement interviews.
    
    Based on this interview performance, provide comprehensive feedback.
    
    ${answersSummary}
    
    Return a JSON object with EXACTLY this structure:
    {
      "overallScore": 75,
      "overallFeedback": "2-3 sentence summary of performance",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "improvements": ["Area to improve 1", "Area to improve 2", "Area to improve 3"],
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI career coach providing interview feedback. Return only valid JSON." },
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
      overallFeedback: result.overallFeedback || "Good performance! Keep practicing to improve further.",
      strengths: result.strengths || ["Answered all questions", "Showed effort"],
      improvements: result.improvements || ["Provide more detailed answers", "Use specific examples"],
      recommendations: result.recommendations || ["Practice with mock interviews", "Review core concepts"],
      totalQuestions: answers.length
    }
  } catch (error) {
    console.error('OpenAI Final Feedback Error:', error)
    return getFallbackFinalFeedback(answers)
  }
}

// Extract keywords from question
const extractKeywords = (question, role) => {
  const keywords = {
    frontend: ['react', 'javascript', 'css', 'html', 'components', 'state', 'props', 'hooks', 'virtual', 'render', 'event'],
    backend: ['database', 'api', 'server', 'sql', 'nosql', 'authentication', 'caching', 'scaling', 'endpoint'],
    fullstack: ['frontend', 'backend', 'api', 'database', 'fullstack', 'integration', 'client', 'server'],
    hr: ['team', 'leadership', 'conflict', 'motivation', 'goal', 'achievement', 'failure', 'learning']
  }
  
  const roleKeywords = keywords[role] || keywords.frontend
  const questionLower = question.toLowerCase()
  
  return roleKeywords.filter(kw => questionLower.includes(kw.toLowerCase())).slice(0, 3)
}

// Fallback questions (large pool to avoid repeats)
const getFallbackQuestion = (role, difficulty, previousQuestions = []) => {
  const fallbackQuestions = {
    frontend: {
      beginner: [
        "What is the difference between let, const, and var in JavaScript?",
        "Explain the box model in CSS.",
        "What is the purpose of React keys?",
        "What is responsive design and how do you achieve it?",
        "Explain the difference between props and state in React."
      ],
      intermediate: [
        "Explain closures in JavaScript with an example.",
        "What is the virtual DOM and how does it work?",
        "Explain React lifecycle methods or hooks.",
        "What is state management and why do we need it?",
        "Explain event delegation in JavaScript."
      ],
      advanced: [
        "Explain the event loop in JavaScript.",
        "How would you optimize a React application's performance?",
        "Explain code splitting and lazy loading.",
        "What are Web Workers and when would you use them?",
        "Explain the concept of memoization."
      ]
    },
    backend: {
      beginner: [
        "What is the difference between SQL and NoSQL databases?",
        "Explain REST API and its principles.",
        "What is authentication vs authorization?",
        "What is the purpose of environment variables?",
        "Explain HTTP methods (GET, POST, PUT, DELETE)."
      ],
      intermediate: [
        "Explain database indexing and its benefits.",
        "What is JWT and how does it work?",
        "Explain the difference between SQL injection and XSS.",
        "What are microservices vs monolithic architecture?",
        "Explain caching strategies."
      ],
      advanced: [
        "Explain database sharding and when to use it.",
        "What are message queues and when would you use them?",
        "Explain the CAP theorem.",
        "How would you design a rate limiting system?",
        "Explain eventual consistency vs strong consistency."
      ]
    },
    fullstack: {
      beginner: [
        "What is the MERN stack?",
        "Explain the difference between client-side and server-side rendering.",
        "What is an API and how do you use it?",
        "Explain the purpose of package.json.",
        "What is version control and why is it important?"
      ],
      intermediate: [
        "Explain the authentication flow in a full-stack app.",
        "What are webhooks and how do they work?",
        "Explain CORS and how to handle it.",
        "What are environment variables and why are they important?",
        "Explain the difference between cookies, localStorage, and sessionStorage."
      ],
      advanced: [
        "Explain how you would implement real-time features like chat.",
        "What are the security considerations for a full-stack app?",
        "Explain how you would scale a full-stack application.",
        "What is the difference between horizontal and vertical scaling?",
        "Explain the challenges of server-side rendering."
      ]
    },
    hr: {
      beginner: [
        "Tell me about yourself.",
        "What are your strengths and weaknesses?",
        "Why do you want to work at our company?",
        "Where do you see yourself in 5 years?",
        "Why should we hire you?"
      ],
      intermediate: [
        "Describe a time you faced a challenge at work and how you overcame it.",
        "How do you handle conflicts with team members?",
        "Tell me about a time you showed leadership.",
        "How do you handle pressure and tight deadlines?",
        "Describe a situation where you failed and what you learned."
      ],
      advanced: [
        "Tell me about a time you had to make a difficult decision.",
        "How do you handle criticism from managers?",
        "Describe a time you went above and beyond for a project.",
        "How do you stay motivated during repetitive tasks?",
        "Tell me about a time you had to learn a new skill quickly."
      ]
    }
  }
  
  const questions = fallbackQuestions[role]?.[difficulty] || fallbackQuestions.frontend.beginner
  const availableQuestions = questions.filter(q => !previousQuestions.includes(q))
  
  // If all questions have been asked, reset and use all questions
  const questionPool = availableQuestions.length > 0 ? availableQuestions : questions
  const randomIndex = Math.floor(Math.random() * questionPool.length)
  const question = questionPool[randomIndex]
  
  return {
    question,
    type: role === 'hr' ? 'behavioral' : 'technical',
    expectedKeywords: extractKeywords(question, role)
  }
}

const getFallbackEvaluation = (answer, expectedKeywords) => {
  const lowerAnswer = answer.toLowerCase()
  let score = 50
  let matchedKeywords = []
  
  for (const keyword of expectedKeywords) {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword)
      score += 10
    }
  }
  
  if (answer.length > 100) score += 10
  if (answer.length > 200) score += 10
  score = Math.min(score, 100)
  
  let feedback = ""
  if (score >= 85) {
    feedback = "Excellent answer! You covered the key points very well."
  } else if (score >= 70) {
    feedback = "Good answer! You're on the right track."
  } else if (score >= 50) {
    feedback = "Good attempt. Consider adding more specific details."
  } else {
    feedback = "Try to provide more detailed answers and include technical terms."
  }
  
  const suggestions = []
  if (matchedKeywords.length < expectedKeywords.length / 2) {
    suggestions.push(`Consider mentioning: ${expectedKeywords.slice(0, 3).join(', ')}`)
  }
  if (answer.length < 100) {
    suggestions.push("Provide more detailed explanations")
  }
  
  return {
    score,
    feedback,
    suggestions: suggestions.slice(0, 3),
    strengths: matchedKeywords.length ? ["Used relevant keywords"] : ["Attempted to answer"]
  }
}

const getFallbackFinalFeedback = (answers) => {
  const avgScore = Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length)
  
  let overallFeedback = ""
  if (avgScore >= 85) {
    overallFeedback = "Excellent performance! You're well prepared for real interviews."
  } else if (avgScore >= 70) {
    overallFeedback = "Good job! You have a solid foundation. Keep practicing to improve further."
  } else if (avgScore >= 50) {
    overallFeedback = "Good effort! Focus on providing more detailed answers and including technical keywords."
  } else {
    overallFeedback = "Keep practicing! Focus on understanding core concepts and practicing your responses."
  }
  
  return {
    overallScore: avgScore,
    overallFeedback,
    strengths: ["Attempted all questions", "Showed willingness to learn"],
    improvements: ["Provide more detailed answers", "Use specific examples"],
    recommendations: ["Practice with more mock interviews", "Review core concepts", "Record yourself answering"],
    totalQuestions: answers.length
  }
}

module.exports = {
  generateQuestion,
  evaluateAnswer,
  generateFinalFeedback,
  isOpenAIConfigured
}