import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function NotificationCenter({ isOpen, onClose, className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Project Deployed',
      message: 'Your portfolio has been successfully deployed to production.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'New AI Feature',
      message: 'AI Studio now supports code generation. Try it out!',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Storage Warning',
      message: 'You\'re using 85% of your storage quota.',
      timestamp: new Date(Date.now() - 10800000),
      read: true,
    },
  ]);

  const iconMap = {
    info: <Info className="w-5 h-5 text-blue-400" />,
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-16 right-6 w-96 max-h-[600px] z-50 ${className}`}
        >
          <GlassCard className="p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-cyan-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`
                          p-4 rounded-xl border transition-all duration-200
                          ${notification.read 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {iconMap[notification.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-white">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4 text-gray-400" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 hover:bg-white/10 rounded transition-colors"
                                  title="Dismiss"
                                >
                                  <X className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}