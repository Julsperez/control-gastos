import { type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/ToastProvider'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { GastosPage } from './pages/GastosPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsHubPage } from './pages/SettingsHubPage'
import { SettingsPage } from './pages/SettingsPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AppLayout } from './components/layout/AppLayout'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <Routes>
          {/* Auth routes — sin navegación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Rutas protegidas con layout de navegación */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/gastos"          element={<GastosPage />} />
            <Route path="/dashboard"       element={<AnalyticsPage />} />
            <Route path="/settings"        element={<SettingsHubPage />} />
            <Route path="/settings/budget" element={<SettingsPage />} />
          </Route>

          {/* Fallbacks */}
          <Route path="/"  element={<Navigate to="/gastos" replace />} />
          <Route path="*"  element={<Navigate to="/gastos" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
