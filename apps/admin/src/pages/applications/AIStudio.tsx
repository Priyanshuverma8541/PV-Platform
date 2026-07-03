import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Widget } from '@pv/ui';
import { Sparkles, MessageSquare, Image, Code, Wand2, Zap } from 'lucide-react';

export function AIStudio() {
  const [activeTab, setActiveTab] = useState<'chat' | 'generator' | 'workflows'>('chat');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const chatHistory = [
    { role: 'user', content: 'Help me write a React component for a dashboard', time: '10:30 AM' },
    { role: 'assistant', content: 'I\'ll help you create a dashboard component. Here\'s a modern React component with TypeScript...', time: '10:30 AM' },
    { role: 'user', content: 'Can you add animations?', time: '10:31 AM' },
    { role: 'assistant', content: 'Absolutely! Let me add Framer Motion animations for smooth transitions...', time: '10:31 AM' },
  ];

  const workflows = [
    { id: '1', name: 'Code Generator', description: 'Generate React components from descriptions', runs: 156, success: 98 },
    { id: '2', name: 'Content Writer', description: 'Create blog posts and documentation', runs: 89, success: 95 },
    { id: '3', name: 'Data Analyzer', description: 'Analyze and visualize data patterns', runs: 234, success: 92 },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          AI Studio
        </h1>
        <p className="text-gray-400">Chat with AI, generate content, and automate workflows</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="API Calls" value="1,234" change="+15% today" trend="up" icon={<Zap className="w-6 h-6 text-cyan-400" />} />
        <Widget title="Workflows" value="12" change="3 active" trend="neutral" icon={<Wand2 className="w-6 h-6 text-purple-400" />} />
        <Widget title="Generated" value="456" change="This month" trend="up" icon={<Code className="w-6 h-6 text-green-400" />} />
        <Widget title="Success Rate" value="96%" change="+2% improvement" trend="up" icon={<Sparkles className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {['chat', 'generator', 'workflows'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 capitalize transition-colors ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat History */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6 h-96 overflow-y-auto">
              <div className="space-y-4">
                {chatHistory.map((message, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                          : 'bg-white/10 text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-60">{message.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Ask AI anything..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400/50 transition-colors"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Send'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: <Code className="w-5 h-5" />, label: 'Generate Code', prompt: 'Write a React component for...' },
                  { icon: <MessageSquare className="w-5 h-5" />, label: 'Write Content', prompt: 'Create a blog post about...' },
                  { icon: <Image className="w-5 h-5" />, label: 'Analyze Data', prompt: 'Analyze this data...' },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(action.prompt)}
                    className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                  >
                    <div className="text-cyan-400">{action.icon}</div>
                    <span className="text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-8">
            <Image className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Image Generation</h3>
            <p className="text-gray-400 mb-6">Create images from text descriptions</p>
            <div className="space-y-4">
              <textarea
                placeholder="Describe the image you want to generate..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400/50 transition-colors h-32"
              />
              <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform">
                Generate Image
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <Code className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Code Generation</h3>
            <p className="text-gray-400 mb-6">Generate code from natural language</p>
            <div className="space-y-4">
              <textarea
                placeholder="Describe the code you want to generate..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400/50 transition-colors h-32"
              />
              <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform">
                Generate Code
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <motion.div
              key={workflow.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Wand2 className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">{workflow.name}</h3>
                  </div>
                  <p className="text-gray-400 mb-4">{workflow.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-400">Runs: <span className="text-white font-semibold">{workflow.runs}</span></span>
                    <span className="text-gray-400">Success: <span className="text-green-400 font-semibold">{workflow.success}%</span></span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
                  Run
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}