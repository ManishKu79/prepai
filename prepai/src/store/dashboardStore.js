import { create } from 'zustand'

const useDashboardStore = create((set, get) => ({
  // Stats data
  stats: {
    interviewsCompleted: 0,
    codingAccuracy: 0,
    weeklyStreak: 0,
    communicationScore: 0,
  },
  
  recentActivity: [],
  
  weeklyProgress: [
    { day: 'Mon', interviews: 0, score: 0 },
    { day: 'Tue', interviews: 0, score: 0 },
    { day: 'Wed', interviews: 0, score: 0 },
    { day: 'Thu', interviews: 0, score: 0 },
    { day: 'Fri', interviews: 0, score: 0 },
    { day: 'Sat', interviews: 0, score: 0 },
    { day: 'Sun', interviews: 0, score: 0 },
  ],
  
  skills: [
    { name: 'Problem Solving', score: 0, color: '#3b82f6' },
    { name: 'Communication', score: 0, color: '#10b981' },
    { name: 'Technical Knowledge', score: 0, color: '#f59e0b' },
    { name: 'System Design', score: 0, color: '#ef4444' },
    { name: 'Behavioral', score: 0, color: '#8b5cf6' },
  ],
  
  loading: true,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null })
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token')
      }
      
      console.log('[Dashboard] Fetching interview history...')
      const historyResponse = await fetch('http://localhost:5000/api/interview/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const historyData = await historyResponse.json()
      console.log('[Dashboard] Interview history:', historyData)
      
      console.log('[Dashboard] Fetching coding stats...')
      const codingResponse = await fetch('http://localhost:5000/api/coding/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const codingData = await codingResponse.json()
      console.log('[Dashboard] Coding stats:', codingData)
      
      const stats = get().calculateStats(historyData, codingData)
      const recentActivity = get().generateRecentActivity(historyData, codingData)
      const weeklyProgress = get().calculateWeeklyProgress(historyData)
      const skills = get().calculateSkills(historyData, codingData)
      
      console.log('[Dashboard] Weekly Progress calculated:', weeklyProgress)
      
      set({
        stats,
        recentActivity,
        weeklyProgress,
        skills,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      set({ error: error.message, loading: false })
    }
  },
  
  calculateStats: (historyData, codingData) => {
    const interviews = historyData?.sessions || []
    const coding = codingData?.stats || {}
    
    const interviewsCompleted = interviews.length
    const codingAccuracy = coding.acceptanceRate || 0
    
    let weeklyStreak = 0
    if (interviews.length > 0) {
      const uniqueWeeks = new Set()
      interviews.forEach(interview => {
        if (interview.date) {
          const date = new Date(interview.date)
          const weekKey = `${date.getFullYear()}-${date.getMonth()}-${Math.floor(date.getDate() / 7)}`
          uniqueWeeks.add(weekKey)
        }
      })
      weeklyStreak = uniqueWeeks.size
    }
    
    const behavioralInterviews = interviews.filter(i => 
      i.type === 'hr' || i.type === 'behavioral' || i.role === 'hr'
    )
    const communicationScore = behavioralInterviews.length > 0
      ? Math.round(behavioralInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / behavioralInterviews.length)
      : 0
    
    return {
      interviewsCompleted,
      codingAccuracy,
      weeklyStreak,
      communicationScore
    }
  },
  
  generateRecentActivity: (historyData, codingData) => {
    const activities = []
    
    const interviews = historyData?.sessions || []
    interviews.slice(0, 5).forEach(interview => {
      activities.push({
        id: interview.id,
        type: interview.type === 'hr' ? 'interview' : 'technical',
        title: `${interview.role || 'Interview'} ${interview.type === 'hr' ? 'HR Interview' : 'Technical Interview'}`,
        score: interview.score,
        date: interview.date,
        status: (interview.score || 0) >= 70 ? 'completed' : 'needs_improvement'
      })
    })
    
    const submissions = codingData?.stats?.recentSubmissions || []
    submissions.slice(0, 3).forEach(sub => {
      activities.push({
        id: `code-${sub.id}`,
        type: 'coding',
        title: `Coding: ${sub.problemTitle}`,
        score: sub.status === 'accepted' ? 100 : Math.round((sub.passedCount / sub.totalTests) * 100),
        date: sub.submittedAt,
        status: sub.status
      })
    })
    
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
  },
  
  calculateWeeklyProgress: (historyData) => {
    const interviews = historyData?.sessions || []
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    // Initialize weekly data
    const weeklyData = weekDays.map(day => ({
      day,
      interviews: 0,
      score: 0
    }))
    
    // Get current week's start (Monday)
    const today = new Date()
    const currentDay = today.getDay()
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - daysToMonday)
    weekStart.setHours(0, 0, 0, 0)
    
    console.log('[Weekly Progress] Week starting:', weekStart)
    console.log('[Weekly Progress] Interviews to process:', interviews.length)
    
    // Process each interview
    interviews.forEach(interview => {
      if (!interview.date) {
        console.log('[Weekly Progress] No date for interview:', interview)
        return
      }
      
      const interviewDate = new Date(interview.date)
      console.log(`[Weekly Progress] Processing interview on: ${interviewDate.toDateString()}, Score: ${interview.score}`)
      
      // Only count interviews from current week
      if (interviewDate >= weekStart) {
        const dayOfWeek = interviewDate.getDay()
        // Convert Sunday (0) to index 6, Monday (1) to index 0
        let dayIndex
        if (dayOfWeek === 0) { // Sunday
          dayIndex = 6
        } else {
          dayIndex = dayOfWeek - 1
        }
        
        if (weeklyData[dayIndex]) {
          weeklyData[dayIndex].interviews++
          // Take the highest score for that day
          if ((interview.score || 0) > weeklyData[dayIndex].score) {
            weeklyData[dayIndex].score = interview.score || 0
          }
          console.log(`[Weekly Progress] Updated ${weeklyData[dayIndex].day}: interviews=${weeklyData[dayIndex].interviews}, score=${weeklyData[dayIndex].score}`)
        }
      } else {
        console.log(`[Weekly Progress] Interview ${interviewDate.toDateString()} is before week start ${weekStart.toDateString()}, skipping`)
      }
    })
    
    console.log('[Weekly Progress] Final weekly data:', weeklyData)
    return weeklyData
  },
  
  calculateSkills: (historyData, codingData) => {
    const interviews = historyData?.sessions || []
    const coding = codingData?.stats || {}
    
    const problemSolving = coding.acceptanceRate || 0
    
    const behavioralInterviews = interviews.filter(i => 
      i.type === 'hr' || i.type === 'behavioral' || i.role === 'hr'
    )
    const communication = behavioralInterviews.length > 0
      ? Math.round(behavioralInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / behavioralInterviews.length)
      : 0
    
    const technicalInterviews = interviews.filter(i => 
      i.type === 'technical' || (i.role !== 'hr' && i.role !== 'HR')
    )
    const technicalKnowledge = technicalInterviews.length > 0
      ? Math.round(technicalInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / technicalInterviews.length)
      : 0
    
    const advancedInterviews = interviews.filter(i => i.difficulty === 'advanced')
    const systemDesign = advancedInterviews.length > 0
      ? Math.round(advancedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / advancedInterviews.length)
      : 0
    
    const hrInterviews = interviews.filter(i => i.type === 'hr' || i.role === 'hr')
    const behavioral = hrInterviews.length > 0
      ? Math.round(hrInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / hrInterviews.length)
      : 0
    
    return [
      { name: 'Problem Solving', score: problemSolving, color: '#3b82f6' },
      { name: 'Communication', score: communication, color: '#10b981' },
      { name: 'Technical Knowledge', score: technicalKnowledge, color: '#f59e0b' },
      { name: 'System Design', score: systemDesign, color: '#ef4444' },
      { name: 'Behavioral', score: behavioral, color: '#8b5cf6' },
    ]
  },
  
  updateStats: (newStats) => set({ stats: newStats }),
}))

export default useDashboardStore