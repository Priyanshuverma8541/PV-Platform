import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, className = '', onClick, hover = true, glow = false }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-2xl
        shadow-2xl
        transition-all duration-500
        ${hover ? 'hover:bg-white/15 hover:scale-105 hover:shadow-cyan-500/50' : ''}
        ${glow ? 'shadow-cyan-500/20' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}