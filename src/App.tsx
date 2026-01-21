import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { CelebrationPage } from './pages/CelebrationPage';
import { LoginPage } from './pages/LoginPage';
import { UploadPage } from './pages/UploadPage';
import { SlideshowPage } from './pages/SlideshowPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated
  } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
function AdminRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    user
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // Check if user is admin (email contains 'admin')
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}
export function App() {
  return <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CelebrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>} />
          <Route path="/slideshow" element={<SlideshowPage />} />
          <Route path="/admin" element={<AdminRoute>
                <AdminPage />
              </AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>;
}