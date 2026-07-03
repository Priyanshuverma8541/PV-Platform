import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Widget } from '@pv/ui';
import { Briefcase, FileText, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react';

export function Career() {
  const [activeTab, setActiveTab] = useState<'applications' | 'resume' | 'interviews'>('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications([
        { id: '1', company: 'TechCorp', position: 'Senior Developer', status: 'interview', appliedDate: '2024-01-15', location: 'Remote', salary: '$120K - $150K' },
        { id: '2', company: 'StartupXYZ', position: 'Full Stack Engineer', status: 'applied', appliedDate: '2024-01-10', location: 'San Francisco', salary: '$130K - $160K' },
        { id: '3', company: 'Enterprise Inc', position: 'Tech Lead', status: 'offer', appliedDate: '2024-01-05', location: 'New York', salary: '$150K - $180K' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offer': return 'bg-green-500';
      case 'interview': return 'bg-blue-500';
      case 'applied': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading career data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Career
        </h1>
        <p className="text-gray-400">Track your job search and manage your career growth</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Total Applications" value="12" change="+3 this month" trend="up" icon={<Briefcase className="w-6 h-6 text-cyan-400" />} />
        <Widget title="Interviews" value="5" change="2 scheduled" trend="up" icon={<Calendar className="w-6 h-6 text-purple-400" />} />
        <Widget title="Offers" value="2" change="Great progress!" trend="up" icon={<TrendingUp className="w-6 h-6 text-green-400" />} />
        <Widget title="Resume Views" value="48" change="+12 this week" trend="up" icon={<FileText className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {['applications', 'resume', 'interviews'].map((tab) => (
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
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{app.position}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)} text-white`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-lg text-cyan-400 mb-2">{app.company}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {app.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {app.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Applied {app.appliedDate}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'resume' && (
        <GlassCard className="p-8 text-center">
          <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Resume Manager</h3>
          <p className="text-gray-400 mb-6">Create and manage multiple resume versions</p>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform">
            Create New Resume
          </button>
        </GlassCard>
      )}

      {activeTab === 'interviews' && (
        <div className="space-y-4">
          {[
            { company: 'TechCorp', type: 'Technical', date: '2024-01-20', time: '10:00 AM' },
            { company: 'StartupXYZ', type: 'HR Round', date: '2024-01-22', time: '2:00 PM' },
          ].map((interview, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{interview.company}</h3>
                  <p className="text-cyan-400">{interview.type} Interview</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{interview.date}</p>
                  <p className="text-gray-400 text-sm">{interview.time}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}