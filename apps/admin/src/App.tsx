import { useState } from 'react';
import { MissionControl } from './pages/MissionControl';

type Page = 'landing' | 'mission-control';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  if (currentPage === 'mission-control') {
    return <MissionControl />;
  }

  return (
    <div>
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
          PV Platform
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your Personal Operating System
        </p>
        <button
          onClick={() => setCurrentPage('mission-control')}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
        >
          Enter Mission Control
        </button>
      </div>
    </div>
  );
}

export default App;
