import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Outlet />
    </div>
  )
}

export default RootLayout