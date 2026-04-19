import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ChildDashboard from './pages/Child/Dashboard'
import Wallet from './pages/Child/Wallet'
import Missions from './pages/Child/Missions'
import Learning from './pages/Child/Learning'
import ModuleDetail from './pages/Child/ModuleDetail'
import ParentDashboard from './pages/Parent/Dashboard'
import ChildDetail from './pages/Parent/ChildDetail'
import AdminDashboard from './pages/Admin/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Child routes */}
          <Route path="/dashboard" element={<ProtectedRoute role="child"><ChildDashboard /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute role="child"><Wallet /></ProtectedRoute>} />
          <Route path="/missions" element={<ProtectedRoute role="child"><Missions /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute role="child"><Learning /></ProtectedRoute>} />
          <Route path="/learning/:id" element={<ProtectedRoute role="child"><ModuleDetail /></ProtectedRoute>} />

          {/* Parent routes */}
          <Route path="/parent" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
          <Route path="/parent/child/:id" element={<ProtectedRoute role="parent"><ChildDetail /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
