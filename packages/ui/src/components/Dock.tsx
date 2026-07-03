import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  className?: string;
}

export function Dock({ items, className = '' }: DockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 ${className}`}
    >
      <div className="flex items-end gap-2 px-4 py-3 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{
              y: hoveredIndex === index ? -20 : 0,
              scale: hoveredIndex === index ? 1.2 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative group"
          >
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-8 h-8 flex items-center justify-center text-white">
                {item.icon}
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {item.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}