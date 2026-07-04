import { useState } from 'react';
import { AuthProvider, useAuth } from '@pv/auth';
import { MissionControl } from './pages/MissionControl';
import Login from './pages/Login';
import Register from './pages/Register';

type Page = 'landing' | 'login' | 'register' | 'mission-control';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If authenticated and on landing/login/register, go to mission control
  if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
    setCurrentPage('mission-control');
  }

  // If not authenticated and trying to access mission control, go to login
  if (!isAuthenticated && currentPage === 'mission-control') {
    setCurrentPage('login');
  }

  if (currentPage === 'login') {
    return <Login onNavigateToRegister={() => setCurrentPage('register')} />;
  }

  if (currentPage === 'register') {
    return <Register onNavigateToLogin={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'mission-control') {
    return <MissionControl />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
          PV Platform
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your Personal Operating System
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentPage('login')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentPage('register')}
            className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
