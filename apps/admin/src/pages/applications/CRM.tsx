import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Widget } from '@pv/ui';
import { Users, UserPlus, Mail, Phone, Building2, TrendingUp } from 'lucide-react';

export function CRM() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'interactions'>('contacts');

  const contacts = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', company: 'TechCorp', status: 'customer', source: 'website' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@startup.io', company: 'StartupXYZ', status: 'lead', source: 'referral' },
    { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@enterprise.com', company: 'Enterprise Inc', status: 'prospect', source: 'cold_outreach' },
  ];

  const deals = [
    { id: '1', title: 'Website Redesign', value: 15000, stage: 'proposal', probability: 60, contactId: '1' },
    { id: '2', title: 'Mobile App Development', value: 45000, stage: 'negotiation', probability: 80, contactId: '2' },
    { id: '3', title: 'Salesforce Integration', value: 25000, stage: 'qualification', probability: 30, contactId: '3' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-500';
      case 'prospect': return 'bg-blue-500';
      case 'lead': return 'bg-yellow-500';
      case 'partner': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closed_won': return 'bg-green-500';
      case 'negotiation': return 'bg-blue-500';
      case 'proposal': return 'bg-yellow-500';
      case 'qualification': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          CRM
        </h1>
        <p className="text-gray-400">Manage leads, clients, and business relationships</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Total Contacts" value="156" change="+12 this month" trend="up" icon={<Users className="w-6 h-6 text-cyan-400" />} />
        <Widget title="New Leads" value="23" change="+8 this week" trend="up" icon={<UserPlus className="w-6 h-6 text-purple-400" />} />
        <Widget title="Active Deals" value="8" change="$125K pipeline" trend="up" icon={<TrendingUp className="w-6 h-6 text-green-400" />} />
        <Widget title="Revenue" value="$89K" change="+15% MTD" trend="up" icon={<Building2 className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {['contacts', 'deals', 'interactions'].map((tab) => (
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
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)} text-white`}>
                      {contact.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {contact.company}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="space-y-4">
          {deals.map((deal) => (
            <GlassCard key={deal.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{deal.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(deal.stage)} text-white`}>
                      {deal.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="text-2xl font-bold text-cyan-400">${deal.value.toLocaleString()}</span>
                    <span>Probability: {deal.probability}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${deal.probability}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'interactions' && (
        <GlassCard className="p-12 text-center">
          <Mail className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Interaction History</h3>
          <p className="text-gray-400 mb-6">Track all communications with your contacts</p>
          <div className="space-y-3">
            {[
              { type: 'email', contact: 'John Doe', summary: 'Discussed project requirements', date: '2024-01-15' },
              { type: 'call', contact: 'Jane Smith', summary: 'Follow-up on proposal', date: '2024-01-14' },
              { type: 'meeting', contact: 'Mike Johnson', summary: 'Product demo', date: '2024-01-13' },
            ].map((interaction, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{interaction.contact}</p>
                    <p className="text-gray-400 text-sm">{interaction.summary}</p>
                  </div>
                  <span className="text-xs text-gray-500">{interaction.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}