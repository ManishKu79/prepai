import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout