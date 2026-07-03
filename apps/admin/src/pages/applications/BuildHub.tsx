import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Widget } from '@pv/ui';
import { Code, GitBranch, Rocket, Play, Pause, CheckCircle, Clock, Users } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, Project } from '@pv/api-client';

export function BuildHub() {
  const [activeTab, setActiveTab] = useState<'projects' | 'deployments' | 'team'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deployments = [
    { id: '1', project: 'Savitri Livings', environment: 'production', status: 'success', time: '2 hours ago', duration: '2m 34s' },
    { id: '2', project: 'IntegroHub', environment: 'staging', status: 'building', time: 'In progress', duration: '-' },
    { id: '3', project: 'CardioSense', environment: 'production', status: 'success', time: '1 day ago', duration: '1m 45s' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'active':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'archived':
        return <Pause className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'text-green-400';
      case 'active':
        return 'text-blue-400';
      case 'archived':
        return 'text-gray-400';
      default:
        return 'text-yellow-400';
    }
  };

  // Fetch projects on mount
  useEffect(() => {
    const initializeProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProjects();
        const userProjects = response.data;
        
        // If no projects exist, create sample projects
        if (userProjects.length === 0) {
          await createSampleProjects();
        } else {
          setProjects(userProjects);
        }
      } catch (err) {
        setError('Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProjects();
  }, []);

  // Create sample projects for demo
  const createSampleProjects = async () => {
    try {
      const sampleProjects = [
        {
          name: 'Savitri Livings',
          description: 'Home decor e-commerce platform with modern design and seamless user experience',
          techStack: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Stripe'],
          urls: {
            live: 'https://home-decor-inky.vercel.app/',
            github: 'https://github.com/priyanshuverma8541/home-decor',
          },
          status: 'deployed' as const,
          settings: { public: true, featured: true },
        },
        {
          name: 'IntegroHub',
          description: 'Salesforce integration platform for seamless CRM automation and workflow management',
          techStack: ['React', 'Node.js', 'Salesforce API', 'PostgreSQL', 'Docker'],
          urls: {
            live: 'https://integro-hub.vercel.app/',
            github: 'https://github.com/priyanshuverma8541/integro-hub',
          },
          status: 'deployed' as const,
          settings: { public: true, featured: true },
        },
        {
          name: 'CardioSense',
          description: 'AI-powered heart disease prediction system using machine learning algorithms',
          techStack: ['Python', 'Flask', 'TensorFlow', 'scikit-learn', 'Pandas'],
          urls: {
            github: 'https://github.com/priyanshuverma8541/cardio-sense',
          },
          status: 'active' as const,
          settings: { public: true, featured: false },
        },
        {
          name: 'PV Platform',
          description: 'Enterprise-grade Personal Operating System with AI, CRM, Finance, and Career management',
          techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Three.js', 'Docker'],
          urls: {
            github: 'https://github.com/priyanshuverma8541/PV-Platform',
          },
          status: 'active' as const,
          settings: { public: true, featured: true },
        },
      ];

      // Create all sample projects
      const createdProjects = await Promise.all(
        sampleProjects.map(project => createProject(project))
      );

      setProjects(createdProjects.map(p => p.data));
    } catch (err) {
      console.error('Error creating sample projects:', err);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          BuildHub
        </h1>
        <p className="text-gray-400">Build, deploy, and manage your projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Total Projects" value="12" change="4 deployed" trend="up" icon={<Code className="w-6 h-6 text-cyan-400" />} />
        <Widget title="Deployments" value="48" change="+12 this month" trend="up" icon={<Rocket className="w-6 h-6 text-purple-400" />} />
        <Widget title="Success Rate" value="98%" change="Excellent" trend="up" icon={<CheckCircle className="w-6 h-6 text-green-400" />} />
        <Widget title="Team Members" value="6" change="2 active now" trend="neutral" icon={<Users className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {['projects', 'deployments', 'team'].map((tab) => (
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
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(project.status)}
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  </div>
                  <p className={`text-sm capitalize mb-3 ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
                  Deploy
                </button>
                <button className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors">
                  <GitBranch className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'deployments' && (
        <div className="space-y-4">
          {deployments.map((deployment) => (
            <GlassCard key={deployment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(deployment.status)}
                    <h3 className="text-xl font-bold text-white">{deployment.project}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      deployment.environment === 'production' ? 'bg-purple-500' : 'bg-blue-500'
                    } text-white`}>
                      {deployment.environment}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span>Status: <span className={getStatusColor(deployment.status)}>{deployment.status}</span></span>
                    <span>Time: {deployment.time}</span>
                    {deployment.duration !== '-' && <span>Duration: {deployment.duration}</span>}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Priyanshu Verma', role: 'Lead Developer', projects: 8, status: 'online' },
            { name: 'Sarah Johnson', role: 'Full Stack Dev', projects: 5, status: 'online' },
            { name: 'Mike Chen', role: 'DevOps Engineer', projects: 12, status: 'away' },
          ].map((member, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Projects: <span className="text-white font-semibold">{member.projects}</span></span>
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className={member.status === 'online' ? 'text-green-400' : 'text-yellow-400'}>{member.status}</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}