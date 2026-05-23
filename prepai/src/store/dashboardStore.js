import { create } from 'zustand'

const useDashboardStore = create((set, get) => ({
  // Stats data (will be populated from API)
  stats: {
    interviewsCompleted: 0,
    codingAccuracy: 0,
    weeklyStreak: 0,
    communicationScore: 0,
  },
  
  // Recent activity (from API)
  recentActivity: [],
  
  // Weekly progress (from API)
  weeklyProgress: [
    { day: 'Mon', interviews: 0, score: 0 },
    { day: 'Tue', interviews: 0, score: 0 },
    { day: 'Wed', interviews: 0, score: 0 },
    { day: 'Thu', interviews: 0, score: 0 },
    { day: 'Fri', interviews: 0, score: 0 },
    { day: 'Sat', interviews: 0, score: 0 },
    { day: 'Sun', interviews: 0, score: 0 },
  ],
  
  // Skill breakdown (calculated from interview performance)
  skills: [
    { name: 'Problem Solving', score: 0, color: '#3b82f6' },
    { name: 'Communication', score: 0, color: '#10b981' },
    { name: 'Technical Knowledge', score: 0, color: '#f59e0b' },
    { name: 'System Design', score: 0, color: '#ef4444' },
    { name: 'Behavioral', score: 0, color: '#8b5cf6' },
  ],
  
  // Loading states
  loading: true,
  error: null,
  
  // Fetch all dashboard data from backend
  fetchDashboardData: async () => {
    set({ loading: true, error: null })
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token')
      }
      
      // Fetch interview history
      const historyResponse = await fetch('http://localhost:5000/api/interview/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const historyData = await historyResponse.json()
      
      // Fetch coding stats
      const codingResponse = await fetch('http://localhost:5000/api/coding/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const codingData = await codingResponse.json()
      
      // Calculate dashboard stats
      const stats = get().calculateStats(historyData, codingData)
      const recentActivity = get().generateRecentActivity(historyData, codingData)
      const weeklyProgress = get().calculateWeeklyProgress(historyData)
      const skills = get().calculateSkills(historyData, codingData)
      
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
  
  // Calculate main stats
  calculateStats: (historyData, codingData) => {
    const interviews = historyData?.sessions || []
    const coding = codingData?.stats || {}
    
    const interviewsCompleted = interviews.length
    const codingAccuracy = coding.acceptanceRate || 0
    
    let weeklyStreak = 0
    if (interviews.length > 0) {
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      const recentInterviews = interviews.filter(i => new Date(i.date) > lastWeek)
      weeklyStreak = Math.min(recentInterviews.length, 7)
    }
    
    const behavioralInterviews = interviews.filter(i => i.type === 'hr' || i.type === 'behavioral')
    const communicationScore = behavioralInterviews.length > 0
      ? Math.round(behavioralInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / behavioralInterviews.length)
      : 65
    
    return {
      interviewsCompleted,
      codingAccuracy,
      weeklyStreak,
      communicationScore
    }
  },
  
  // Generate recent activity feed
  generateRecentActivity: (historyData, codingData) => {
    const activities = []
    
    const interviews = historyData?.sessions || []
    interviews.slice(0, 5).forEach(interview => {
      activities.push({
        id: interview.id,
        type: interview.type === 'hr' ? 'interview' : 'technical',
        title: `${interview.role} ${interview.type === 'hr' ? 'HR Interview' : 'Technical Interview'}`,
        score: interview.score,
        date: interview.date,
        status: interview.score >= 70 ? 'completed' : 'needs_improvement'
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
  
  // Calculate weekly progress
  calculateWeeklyProgress: (historyData) => {
    const interviews = historyData?.sessions || []
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    const weeklyData = weekDays.map(day => ({
      day,
      interviews: 0,
      score: 0
    }))
    
    interviews.forEach(interview => {
      const interviewDate = new Date(interview.date)
      if (interviewDate >= weekStart) {
        const dayIndex = interviewDate.getDay()
        if (weeklyData[dayIndex]) {
          weeklyData[dayIndex].interviews++
          weeklyData[dayIndex].score = Math.max(weeklyData[dayIndex].score, interview.score || 0)
        }
      }
    })
    
    return weeklyData
  },
  
  // Calculate skill scores
  calculateSkills: (historyData, codingData) => {
    const interviews = historyData?.sessions || []
    const coding = codingData?.stats || {}
    
    const problemSolving = coding.acceptanceRate || 65
    
    const behavioralInterviews = interviews.filter(i => i.type === 'hr' || i.type === 'behavioral')
    const communication = behavioralInterviews.length > 0
      ? Math.round(behavioralInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / behavioralInterviews.length)
      : 70
    
    const technicalInterviews = interviews.filter(i => i.type === 'technical')
    const technicalKnowledge = technicalInterviews.length > 0
      ? Math.round(technicalInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / technicalInterviews.length)
      : 65
    
    const systemDesignInterviews = interviews.filter(i => i.difficulty === 'advanced')
    const systemDesign = systemDesignInterviews.length > 0
      ? Math.round(systemDesignInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / systemDesignInterviews.length)
      : 55
    
    const behavioral = behavioralInterviews.length > 0
      ? Math.round(behavioralInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / behavioralInterviews.length)
      : 75
    
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