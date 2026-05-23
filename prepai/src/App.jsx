import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MockInterview from "./pages/MockInterview";
import Analytics from "./pages/Analytics";
import CodingPractice from './pages/CodingPractice'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="coding-practice" element={<CodingPractice />} />
          <Route path="analytics" element={<Analytics />} />{" "}
          <Route
            path="settings"
            element={
              <div className="text-white p-8 text-center">
                ⚙️ Settings - Coming Soon
              </div>
            }
          />
        </Route>

        {/* Catch all - 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400">Page not found</p>
                <a
                  href="/"
                  className="text-blue-500 hover:text-blue-400 mt-4 inline-block"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
