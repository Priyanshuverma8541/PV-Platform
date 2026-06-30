// import { useState } from 'react';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Portfolio from './pages/Portfolio';
// import AuthShell from './components/AuthShell';
// import { useAuthContext } from './hooks/useAuthContext';

// type View = 'portfolio' | 'login' | 'register';

// function App() {
//   const [view, setView] = useState<View>('portfolio');
//   const { user, signOut } = useAuthContext();

//   // Logged-in state: show dashboard stub with back to portfolio
//   if (user) {
//     return (
//       <main style={{ background: '#0e1726', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
//         <h1 style={{ color: '#4ef3c4' }}>Welcome back, {user.name} 👋</h1>
//         <p style={{ color: '#aaa' }}>Signed in as {user.email}</p>
//         <div style={{ display: 'flex', gap: 12 }}>
//           <button onClick={() => setView('portfolio')} style={{ background: '#1b755b', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 20, cursor: 'pointer', fontSize: '1rem' }}>
//             ← Back to Portfolio
//           </button>
//           <button onClick={signOut} style={{ background: '#182635', color: '#4ef3c4', border: '1px solid #4ef3c4', padding: '10px 24px', borderRadius: 20, cursor: 'pointer', fontSize: '1rem' }}>
//             Sign Out
//           </button>
//         </div>
//       </main>
//     );
//   }

//   // Portfolio view (default homepage)
//   if (view === 'portfolio') {
//     return (
//       <div style={{ background: '#0e1726', minHeight: '100vh' }}>
//         <Portfolio onLoginClick={() => setView('login')} />
//       </div>
//     );
//   }

//   // Auth view
//   return (
//     <AuthShell>
//       <div className="tab-bar">
//         <button className={view === 'login' ? 'active' : ''} onClick={() => setView('login')}>
//           Login
//         </button>
//         <button className={view === 'register' ? 'active' : ''} onClick={() => setView('register')}>
//           Register
//         </button>
//       </div>
//       {view === 'login' ? <Login /> : <Register />}
//       <p style={{ textAlign: 'center', marginTop: 16 }}>
//         <button onClick={() => setView('portfolio')} style={{ background: 'none', border: 'none', color: '#4ef3c4', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
//           ← Back to Portfolio
//         </button>
//       </p>
//     </AuthShell>
//   );
// }

// export default App;


import { useState } from 'react';
import { Button } from '@pv/ui'; // Imported from your shared package
import '@pv/ui/styles.css';       // Global platform styles
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
import AuthShell from './components/AuthShell';
import { useAuthContext } from './hooks/useAuthContext';

type View = 'portfolio' | 'login' | 'register';

function App() {
  const [view, setView] = useState<View>('portfolio');
  const { user, signOut } = useAuthContext();

  // Logged-in state: Use shared Button components
  if (user) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-3xl font-bold text-emerald-400">Welcome back, {user.name} 👋</h1>
        <p className="text-zinc-400">Signed in as {user.email}</p>
        
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setView('portfolio')}>
            ← Back to Portfolio
          </Button>
          <Button variant="primary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </main>
    );
  }

  // Portfolio view: Default homepage
  if (view === 'portfolio') {
    return (
      <div className="bg-zinc-950 min-h-screen">
        <Portfolio onLoginClick={() => setView('login')} />
      </div>
    );
  }

  // Auth view: Using shared Button components
  return (
    <AuthShell>
      <div className="flex gap-4 justify-center mb-6">
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
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => setView('portfolio')} 
          className="text-emerald-400 underline text-sm hover:text-emerald-300 transition-colors"
        >
          ← Back to Portfolio
        </button>
      </div>
    </AuthShell>
  );
}

export default App;