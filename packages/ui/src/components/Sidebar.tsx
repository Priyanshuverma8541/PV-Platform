import React from 'react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  className?: string;
}

export function Sidebar({ items, activeItem, className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 ${className}`}>
      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300
              ${activeItem === item.id 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}