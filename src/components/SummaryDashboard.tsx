import React from 'react';
import { motion } from 'motion/react';
import { SwarmJob, SwarmTask, AgentCard } from '../types';
import { Activity, CheckCircle2, AlertCircle, Users, Zap } from 'lucide-react';

interface Props {
  jobs: SwarmJob[];
  tasks: SwarmTask[];
  agents: AgentCard[];
}

export const SummaryDashboard: React.FC<Props> = ({ jobs, tasks, agents }) => {
  const activeJobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'failed').length;
  
  const avgTrust = agents.length > 0 
    ? (agents.reduce((acc, a) => acc + (a.trustScore || 80), 0) / agents.length)
    : 100;

  const avgReputation = agents.length > 0 
    ? (agents.reduce((acc, a) => acc + (a.reputation || 70), 0) / agents.length)
    : 100;

  const societalStability = (avgTrust + avgReputation) / 2;
  const collectiveInnovation = agents.length > 0 
    ? (agents.reduce((acc, a) => acc + (a.capability_vector?.creativity || 0.5) + (a.capability_vector?.curiosity || 0.5), 0) / (agents.length * 2)) * 100
    : 50;

  const agentsByStage = agents.reduce((acc, a) => {
    const stage = a.lifecycle_stage || 'collaboration';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'Active Institutions', value: activeJobs, icon: Activity, color: 'text-black' },
    { label: 'Social Trust', value: `${avgTrust.toFixed(0)}%`, icon: Zap, color: 'text-yellow-600' },
    { label: 'Collective Innovation', value: `${collectiveInnovation.toFixed(0)}%`, icon: AlertCircle, color: 'text-orange-600' },
    { label: 'Societal Stability', value: `${societalStability.toFixed(0)}%`, icon: Users, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-12 mb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white editorial-border p-6 editorial-shadow relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <stat.icon size={48} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={14} className={stat.color} />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold opacity-40">{stat.label}</p>
            </div>
            <p className="text-4xl font-serif font-bold tracking-tighter">{stat.value}</p>
            <div className="mt-4 h-1 bg-black/5 w-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className={`h-full ${stat.color === 'text-black' ? 'bg-black' : stat.color.replace('text', 'bg')}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 bg-[#1a1a1a] text-white p-8 editorial-shadow border border-zinc-800">
            <h3 className="font-mono text-[10px] uppercase tracking-widest mb-6 opacity-60">Civic Lifecycle Distribution</h3>
            <div className="space-y-4">
               {['initialization', 'learning', 'collaboration', 'leadership', 'mentorship', 'legacy'].map(stage => {
                 const count = agentsByStage[stage] || 0;
                 const percentage = agents.length > 0 ? (count / agents.length) * 100 : 0;
                 return (
                   <div key={stage} className="space-y-1">
                      <div className="flex justify-between text-[8px] font-mono uppercase">
                         <span>{stage}</span>
                         <span>{count}</span>
                      </div>
                      <div className="h-1 bg-white/10 w-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${percentage}%` }}
                           className="h-full bg-blue-500"
                         />
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
         <div className="md:col-span-2 bg-[#f9f8f4] p-8 border-2 border-black/10 editorial-shadow">
            <h3 className="font-mono text-[10px] uppercase tracking-widest mb-6">Collective Pheromone Signals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Innovation Signal', value: 'High', color: 'bg-yellow-400' },
                 { label: 'Trust Density', value: 'Clustered', color: 'bg-blue-400' },
                 { label: 'Conflict Delta', value: '-12%', color: 'bg-green-400' },
                 { label: 'Mentorship Ratio', value: '1:4', color: 'bg-purple-400' }
               ].map(signal => (
                 <div key={signal.label} className="p-4 bg-white border border-black/5 editorial-shadow-sm">
                    <div className={`w-2 h-2 rounded-full mb-2 ${signal.color}`} />
                    <p className="text-[8px] font-mono uppercase opacity-40 mb-1">{signal.label}</p>
                    <p className="text-sm font-serif font-bold italic">{signal.value}</p>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-6 border-t border-black/5">
               <p className="text-[10px] font-mono italic opacity-40">"Entities leave signals behind based on successful task completion... other entities are attracted to high-value signals."</p>
            </div>
         </div>
      </div>
    </div>
  );
};
