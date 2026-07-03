import React from 'react';
import { motion } from 'framer-motion';

interface StatusBarProps {
  items?: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function StatusBar({ items = [], className = '' }: StatusBarProps) {
  const defaultItems = [
    { label: 'Users', value: '1,234', icon: null },
    { label: 'CPU', value: '45%', icon: null },
    { label: 'Memory', value: '62%', icon: null },
    { label: 'Network', value: '1.2 Gbps', icon: null },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
    >
      <div className="flex items-center justify-between px-6 py-2 bg-black/40 backdrop-blur-xl border-b border-white/10">
        {/* Left side - App name */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse" />
          <span className="text-sm font-semibold text-white">PV Platform</span>
        </div>

        {/* Center - Status items */}
        <div className="flex items-center gap-6">
          {displayItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {item.icon && <span className="text-cyan-400">{item.icon}</span>}
              <span className="text-gray-400">{item.label}:</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Right side - Time and controls */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}