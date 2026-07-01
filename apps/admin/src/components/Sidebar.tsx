import { Layout } from '@pv/ui';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'apps', label: 'Apps', icon: '📱' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">PV Platform</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-full text-left px-4 py-3 flex items-center gap-3
              hover:bg-gray-700 transition-colors
              ${currentPage === item.id ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
            `}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}