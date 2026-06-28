import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthShell from './components/AuthShell';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { user, signOut } = useAuthContext();

  if (user) {
    return (
      <main>
        <section>
          <h1>Welcome back, {user.name}</h1>
          <p>You are signed in as {user.email}</p>
          <button onClick={signOut}>Sign out</button>
        </section>
      </main>
    );
  }

  return (
    <AuthShell>
      <div className="tab-bar">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
          Login
        </button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
          Register
        </button>
      </div>
      {mode === 'login' ? <Login /> : <Register />}
    </AuthShell>
  );
}

export default App;
