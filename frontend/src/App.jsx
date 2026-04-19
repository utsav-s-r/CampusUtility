import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { Auth } from './Auth';
import { StudentDashboard } from './StudentDashboard';
import { AdminDashboard } from './AdminDashboard';
import './index.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Auth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return user.role === 'ADMIN' ? <AdminDashboard /> : <StudentDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
