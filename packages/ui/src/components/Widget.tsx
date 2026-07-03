import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface WidgetProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  children?: React.ReactNode;
}

export function Widget({ title, value, change, icon, trend = 'neutral', className = '', children }: WidgetProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {change && (
              <p className={`text-sm mt-2 ${trendColors[trend]}`}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl">
              {icon}
            </div>
          )}
        </div>
        {children}
      </GlassCard>
    </motion.div>
  );
}