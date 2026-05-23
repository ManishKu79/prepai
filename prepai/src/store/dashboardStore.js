import { create } from 'zustand'

const useDashboardStore = create((set) => ({
  // Stats data
  stats: {
    interviewsCompleted: 12,
    codingAccuracy: 78,
    weeklyStreak: 5,
    communicationScore: 82,
  },
  
  // Recent activity
  recentActivity: [
    {
      id: 1,
      type: 'interview',
      title: 'Technical Interview - Frontend',
      score: 85,
      date: '2024-01-15T10:30:00',
    },
    {
      id: 2,
      type: 'coding',
      title: 'DSA Challenge - Two Sum',
      score: 100,
      date: '2024-01-14T15:45:00',
    },
    {
      id: 3,
      type: 'resume',
      title: 'Resume Analysis',
      score: 72,
      date: '2024-01-13T09:15:00',
    },
    {
      id: 4,
      type: 'interview',
      title: 'HR Interview - Behavioral',
      score: 90,
      date: '2024-01-12T14:00:00',
    },
  ],
  
  // Weekly progress data for chart
  weeklyProgress: [
    { day: 'Mon', interviews: 2, score: 75 },
    { day: 'Tue', interviews: 1, score: 80 },
    { day: 'Wed', interviews: 3, score: 82 },
    { day: 'Thu', interviews: 2, score: 78 },
    { day: 'Fri', interviews: 4, score: 85 },
    { day: 'Sat', interviews: 1, score: 88 },
    { day: 'Sun', interviews: 0, score: 0 },
  ],
  
  // Skill breakdown
  skills: [
    { name: 'Problem Solving', score: 75, color: '#3b82f6' },
    { name: 'Communication', score: 82, color: '#10b981' },
    { name: 'Technical Knowledge', score: 70, color: '#f59e0b' },
    { name: 'System Design', score: 65, color: '#ef4444' },
    { name: 'Behavioral', score: 88, color: '#8b5cf6' },
  ],
  
  updateStats: (newStats) => set({ stats: newStats }),
}))

export default useDashboardStore