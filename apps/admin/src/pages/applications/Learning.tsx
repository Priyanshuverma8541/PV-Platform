import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Widget } from '@pv/ui';
import { GraduationCap, BookOpen, Trophy, Clock, Play, CheckCircle } from 'lucide-react';

export function Learning() {
  const [activeTab, setActiveTab] = useState<'courses' | 'skills' | 'certificates'>('courses');

  const courses = [
    { id: '1', title: 'Advanced React Patterns', provider: 'Frontend Masters', progress: 75, status: 'in_progress', duration: '8 hours', skills: ['React', 'TypeScript', 'Performance'] },
    { id: '2', title: 'Salesforce Platform Developer II', provider: 'Trailhead', progress: 45, status: 'in_progress', duration: '20 hours', skills: ['Apex', 'LWC', 'Integration'] },
    { id: '3', title: 'AI Engineering with Python', provider: 'Coursera', progress: 100, status: 'completed', duration: '12 hours', skills: ['Python', 'ML', 'AI'] },
    { id: '4', title: 'System Design Fundamentals', provider: 'Educative', progress: 0, status: 'not_started', duration: '10 hours', skills: ['Architecture', 'Scalability', 'Design'] },
  ];

  const skills = [
    { name: 'React/Next.js', level: 90, target: 95, hours: 500 },
    { name: 'Node.js', level: 85, target: 90, hours: 400 },
    { name: 'Salesforce', level: 80, target: 95, hours: 300 },
    { name: 'AI/ML', level: 70, target: 85, hours: 200 },
    { name: 'System Design', level: 75, target: 90, hours: 150 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in_progress': return <Play className="w-5 h-5 text-blue-400" />;
      default: return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Learning
        </h1>
        <p className="text-gray-400">Track your learning journey and skill development</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Courses" value="12" change="4 in progress" trend="up" icon={<BookOpen className="w-6 h-6 text-cyan-400" />} />
        <Widget title="Skills" value="24" change="+3 this month" trend="up" icon={<GraduationCap className="w-6 h-6 text-purple-400" />} />
        <Widget title="Hours" value="156" change="This month" trend="up" icon={<Clock className="w-6 h-6 text-green-400" />} />
        <Widget title="Certificates" value="8" change="2 pending" trend="neutral" icon={<Trophy className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {['courses', 'skills', 'certificates'].map((tab) => (
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
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(course.status)}
                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                  </div>
                  <p className="text-cyan-400 mb-2">{course.provider}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                <span className="text-cyan-400 font-semibold">{skill.level}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Target: {skill.target}%</span>
                <span>{skill.hours} hours spent</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'certificates' && (
        <GlassCard className="p-12 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Your Certificates</h3>
          <p className="text-gray-400 mb-6">Showcase your achievements</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['React Certification', 'Salesforce Certified', 'AI Engineering'].map((cert, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-semibold">{cert}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}