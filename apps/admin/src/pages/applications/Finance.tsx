import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Widget } from '@pv/ui';
import { DollarSign, TrendingUp, TrendingDown, Receipt, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function Finance() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices' | 'analytics'>('transactions');

  const transactions = [
    { id: '1', type: 'income', category: 'Client Payment', amount: 15000, description: 'Website redesign project', date: '2024-01-15', projectId: '1' },
    { id: '2', type: 'expense', category: 'Software', amount: 299, description: 'GitHub Enterprise subscription', date: '2024-01-14', projectId: undefined },
    { id: '3', type: 'income', category: 'Consulting', amount: 5000, description: 'Salesforce consulting hours', date: '2024-01-13', projectId: '2' },
    { id: '4', type: 'expense', category: 'Marketing', amount: 1200, description: 'Google Ads campaign', date: '2024-01-12', projectId: undefined },
  ];

  const invoices = [
    { id: '1', invoiceNumber: 'INV-001', clientId: '1', total: 15000, status: 'paid', issueDate: '2024-01-01', dueDate: '2024-01-15' },
    { id: '2', invoiceNumber: 'INV-002', clientId: '2', total: 8500, status: 'sent', issueDate: '2024-01-10', dueDate: '2024-01-25' },
    { id: '3', invoiceNumber: 'INV-003', clientId: '3', total: 22000, status: 'overdue', issueDate: '2023-12-15', dueDate: '2024-01-01' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'sent': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Finance
        </h1>
        <p className="text-gray-400">Track income, expenses, and invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Total Revenue" value="$45.2K" change="+18% this month" trend="up" icon={<TrendingUp className="w-6 h-6 text-green-400" />} />
        <Widget title="Expenses" value="$8.5K" change="-5% from last month" trend="down" icon={<TrendingDown className="w-6 h-6 text-red-400" />} />
        <Widget title="Net Profit" value="$36.7K" change="+22% MTD" trend="up" icon={<DollarSign className="w-6 h-6 text-cyan-400" />} />
        <Widget title="Pending Invoices" value="3" change="$34.5K outstanding" trend="neutral" icon={<Receipt className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {['transactions', 'invoices', 'analytics'].map((tab) => (
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
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{transaction.description}</h3>
                      <p className="text-sm text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 ml-12">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {transaction.date}
                    </span>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <GlassCard key={invoice.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Receipt className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">{invoice.invoiceNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)} text-white`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span>Issued: {invoice.issueDate}</span>
                    <span>Due: {invoice.dueDate}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  ${invoice.total.toLocaleString()}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold mb-6">Revenue Overview</h3>
            <div className="space-y-4">
              {[
                { month: 'January', amount: 45000, percentage: 100 },
                { month: 'February', amount: 38000, percentage: 84 },
                { month: 'March', amount: 52000, percentage: 116 },
              ].map((data, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">{data.month}</span>
                    <span className="text-white font-semibold">${data.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(data.percentage, 100)}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold mb-6">Expense Breakdown</h3>
            <div className="space-y-3">
              {[
                { category: 'Software & Tools', amount: 2500, percentage: 35 },
                { category: 'Marketing', amount: 3000, percentage: 42 },
                { category: 'Operations', amount: 1500, percentage: 23 },
              ].map((expense, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{expense.category}</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                      <motion.div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${expense.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                  <span className="text-red-400 font-semibold ml-4">${expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}