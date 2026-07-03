import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StatusBar, 
  Sidebar, 
  Dock, 
  Widget, 
  CommandPalette, 
  AIChat, 
  NotificationCenter,
  GlassCard 
} from '@pv/ui';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Briefcase, 
  GraduationCap, 
  Users, 
  DollarSign, 
  Settings,
  Search,
  Bell,
  Sparkles,
  Code,
  Rocket,
  Zap,
  Globe,
  BarChart3,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { Career } from './applications/Career';
import { Learning } from './applications/Learning';
import { CRM } from './applications/CRM';
import { Finance } from './applications/Finance';
import { AIStudio } from './applications/AIStudio';
import { BuildHub } from './applications/BuildHub';
import { Task, DashboardWidget } from '@pv/types';

type AppView = 'dashboard' | 'career' | 'learning' | 'crm' | 'finance' | 'ai-studio' | 'buildhub';

export function MissionControl() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'career':
        return <Career />;
      case 'learning':
        return <Learning />;
      case 'crm':
        return <CRM />;
      case 'finance':
        return <Finance />;
      case 'ai-studio':
        return <AIStudio />;
      case 'buildhub':
        return <BuildHub />;
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                Mission Control
              </h1>
              <p className="text-gray-400">
                Welcome back! Here's what's happening today.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Widget
                title="Total Projects"
                value="12"
                change="+2 this month"
                trend="up"
                icon={<FolderOpen className="w-6 h-6 text-cyan-400" />}
              />
              <Widget
                title="Active Tasks"
                value="8"
                change="3 due today"
                trend="neutral"
                icon={<CheckSquare className="w-6 h-6 text-purple-400" />}
              />
              <Widget
                title="Revenue"
                value="$24.5K"
                change="+18% from last month"
                trend="up"
                icon={<DollarSign className="w-6 h-6 text-green-400" />}
              />
              <Widget
                title="Learning Hours"
                value="42"
                change="This week"
                trend="up"
                icon={<GraduationCap className="w-6 h-6 text-yellow-400" />}
              />
            </div>

            {/* Tasks and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks */}
              <div className="lg:col-span-2">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Today's Tasks</h2>
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
                      + Add Task
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(task.status)}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`${getPriorityColor(task.priority)} capitalize`}>
                                {task.priority}
                              </span>
                              <span className="text-gray-400 capitalize">
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Calendar & Quick Actions */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Calendar</h3>
                  <div className="space-y-2">
                    {['Team Meeting', 'Project Review', 'Client Call'].map((event, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg border-l-4 border-cyan-400">
                        <p className="font-semibold text-sm">{event}</p>
                        <p className="text-xs text-gray-400">Today, {10 + i}:00 AM</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <Code className="w-5 h-5" />, label: 'New Project', view: 'buildhub' as AppView },
                      { icon: <Sparkles className="w-5 h-5" />, label: 'AI Chat', action: () => setAiChatOpen(true) },
                      { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', view: 'dashboard' as AppView },
                      { icon: <Briefcase className="w-5 h-5" />, label: 'Career', view: 'career' as AppView },
                    ].map((action, i) => (
                      <button
                        key={i}
                        onClick={() => action.view && setCurrentView(action.view) || action.action && action.action()}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2"
                      >
                        <div className="text-cyan-400">{action.icon}</div>
                        <span className="text-xs">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        );
    }
  };

  // Mock data
  const tasks: Task[] = [
    { id: '1', title: 'Deploy portfolio to production', status: 'in_progress', priority: 'high', dueDate: new Date(), tags: ['deployment'], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', title: 'Review AI Studio features', status: 'pending', priority: 'medium', tags: ['ai'], createdAt: new Date(), updatedAt: new Date() },
    { id: '3', title: 'Update CRM contacts', status: 'completed', priority: 'low', tags: ['crm'], createdAt: new Date(), updatedAt: new Date() },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'career', label: 'Career', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'learning', label: 'Learning', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'crm', label: 'CRM', icon: <Users className="w-5 h-5" /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const dockItems = [
    { id: 'mission-control', label: 'Mission Control', icon: <Rocket className="w-5 h-5" />, onClick: () => {} },
    { id: 'portfolio', label: 'Portfolio', icon: <Globe className="w-5 h-5" />, onClick: () => {} },
    { id: 'ai-studio', label: 'AI Studio', icon: <Sparkles className="w-5 h-5" />, onClick: () => setAiChatOpen(true) },
    { id: 'buildhub', label: 'BuildHub', icon: <Code className="w-5 h-5" />, onClick: () => {} },
    { id: 'career', label: 'Career', icon: <Briefcase className="w-5 h-5" />, onClick: () => {} },
    { id: 'crm', label: 'CRM', icon: <Users className="w-5 h-5" />, onClick: () => {} },
  ];

  const commands = [
    { id: '1', label: 'Open Portfolio', icon: <Globe className="w-4 h-4" />, action: () => {}, shortcut: '⌘P' },
    { id: '2', label: 'New Project', icon: <FolderOpen className="w-4 h-4" />, action: () => {}, shortcut: '⌘N' },
    { id: '3', label: 'Open AI Chat', icon: <Sparkles className="w-4 h-4" />, action: () => setAiChatOpen(true), shortcut: '⌘K' },
    { id: '4', label: 'View Analytics', icon: <BarChart3 className="w-4 h-4" />, action: () => {}, shortcut: '⌘A' },
    { id: '5', label: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => {}, shortcut: '⌘,' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Status Bar */}
      <StatusBar
        items={[
          { label: 'CPU', value: '45%' },
          { label: 'Memory', value: '62%' },
          { label: 'Network', value: '1.2 Gbps' },
        ]}
      />

      {/* Main Layout */}
      <div className="flex pt-10">
        {/* Sidebar */}
        <Sidebar 
          items={sidebarItems.map(item => ({
            ...item,
            onClick: () => setCurrentView(item.id as AppView)
          }))} 
          activeItem={currentView} 
        />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Dock */}
      <Dock items={dockItems} />

      {/* Command Palette */}
      <CommandPalette
        commands={commands}
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* AI Chat */}
      <AIChat
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />

      {/* Notifications */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Keyboard Shortcuts */}
      <div className="fixed bottom-24 right-6 z-30 space-y-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all"
          title="Command Palette (⌘K)"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => setAiChatOpen(true)}
          className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all"
          title="AI Assistant"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <button
          onClick={() => setNotificationsOpen(true)}
          className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </button>
      </div>
    </div>
  );
}