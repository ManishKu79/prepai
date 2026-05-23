import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useDashboardStore from '../../store/dashboardStore'

const ProgressChart = () => {
  const { weeklyProgress } = useDashboardStore()
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-blue-500 text-sm">Score: {payload[0].value}%</p>
          <p className="text-gray-400 text-sm">Interviews: {payload[0].payload.interviews}</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Weekly Progress</h3>
      <div style={{ width: '100%', height: 320, minHeight: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyProgress} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ProgressChart