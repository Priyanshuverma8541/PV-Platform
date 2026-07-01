import { useState } from 'react';
import { Button } from '@pv/ui';
import '@pv/ui/styles.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
import PVPlatformPage from './pages/PVPlatformPage';
import AuthShell from './components/AuthShell';
import { useAuthContext } from './hooks/useAuthContext';

type View = 'portfolio' | 'login' | 'register';

function App() {
  const [view, setView] = useState<View>('portfolio');
  const { user, signOut } = useAuthContext();

  // Logged-in state: private PV Platform vision page
  if (user) {
    return (
      <PVPlatformPage
        userName={user.name}
        userEmail={user.email}
        onBackToPortfolio={() => setView('portfolio')}
        onSignOut={signOut}
      />
    );
  }

  // Portfolio view: Default homepage
  if (view === 'portfolio') {
    return (
      <div className="portfolio-shell">
        <Portfolio onLoginClick={() => setView('login')} />
      </div>
    );
  }

  // Auth view: Using shared Button components
  return (
    <AuthShell>
      <div className="auth-tabs">
        <Button 
          variant={view === 'login' ? 'primary' : 'secondary'} 
          onClick={() => setView('login')}
        >
          Login
        </Button>
        <Button 
          variant={view === 'register' ? 'primary' : 'secondary'} 
          onClick={() => setView('register')}
        >
          Register
        </Button>
      </div>
      
      {view === 'login' ? <Login /> : <Register />}
      
      <div className="auth-back">
        <button 
          onClick={() => setView('portfolio')} 
          className="auth-back-button"
        >
          â† Back to Portfolio
        </button>
      </div>
    </AuthShell>
  );
}

export default App;


