import { useState } from 'react';
import { Layout, Header, Container } from '@pv/ui';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { Apps } from './pages/Apps';

type Page = 'dashboard' | 'users' | 'apps' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'apps':
        return <Apps />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <Layout>
      <div className="flex h-screen">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Admin Dashboard" />
          <Container className="flex-1 overflow-auto">
            {renderPage()}
          </Container>
        </div>
      </div>
    </Layout>
  );
}

export default App;