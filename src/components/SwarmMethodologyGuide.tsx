import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Cpu, Share2, BarChart3, Layers, Compass, ArrowRight, CheckCircle2, Sparkles, Activity } from 'lucide-react';

export const SwarmMethodologyGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viz' | 'abm' | 'summary'>('viz');

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      <section className="border-l-4 border-black pl-6 ml-2">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-amber-500" size={20} />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold">System Architecture & Specification</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
          idCard Personas Swarm // Blueprint.
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          Comprehensive specification outlining data visualization methodologies for persona telemetry, relationship network mapping, and agent-based modeling (ABM) rules governing emergent swarm intelligence.
        </p>
      </section>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b-2 border-black/10 pb-4 font-mono text-xs uppercase tracking-widest font-bold">
        <button
          onClick={() => setActiveTab('viz')}
          className={`px-6 py-3 transition-all flex items-center gap-2.5 ${
            activeTab === 'viz' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <BarChart3 size={15} />
          1. Visualization Methods
        </button>
        <button
          onClick={() => setActiveTab('abm')}
          className={`px-6 py-3 transition-all flex items-center gap-2.5 ${
            activeTab === 'abm' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Cpu size={15} />
          2. ABM Simulation & Emergence
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-6 py-3 transition-all flex items-center gap-2.5 ${
            activeTab === 'summary' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Compass size={15} />
          3. Architectural Overview
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'viz' && (
          <motion.div
            key="viz"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="p-8 bg-stone-50 border-2 border-black editorial-shadow-sm space-y-6">
              <h2 className="text-2xl font-serif font-bold border-b border-black/10 pb-4">
                Data Visualization Framework for Simulated Swarms
              </h2>
              <p className="text-xs font-mono text-stone-600 leading-relaxed">
                To render complex sociodynamics intelligible to human observers, the system implements three synchronized projection planes. Each method isolates a specific scale of telemetry: micro (individual), meso (relational), and macro (emergent).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-white p-6 border border-black space-y-3">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold font-mono">
                    01
                  </div>
                  <h3 className="font-serif font-bold text-lg">Individual Characteristics</h3>
                  <p className="text-[10px] font-mono uppercase text-blue-600 font-bold">Multi-Axis Radar & Vectors</p>
                  <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    Maps psychographic traits (Openness, Conscientiousness, Risk Tolerance) against technical depth and reliability scores. Enables instant diagnostic profiling of isolated idCard competencies.
                  </p>
                </div>

                <div className="bg-white p-6 border border-black space-y-3">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold font-mono">
                    02
                  </div>
                  <h3 className="font-serif font-bold text-lg">Relational Dynamics</h3>
                  <p className="text-[10px] font-mono uppercase text-amber-600 font-bold">Force-Directed Graph</p>
                  <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    Represents personas as nodes and bonds as weighted vectors. Solid lines denote persistent trust, dashed lines indicate mentorship hierarchies, and glowing amber paths visualize active pheromone trails.
                  </p>
                </div>

                <div className="bg-white p-6 border border-black space-y-3">
                  <div className="w-10 h-10 bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-bold font-mono">
                    03
                  </div>
                  <h3 className="font-serif font-bold text-lg">Emergent Behavior</h3>
                  <p className="text-[10px] font-mono uppercase text-purple-600 font-bold">Swarm Cluster & Yield Heatmap</p>
                  <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    Plots macro convergence along occupational domains and visualizes collective productivity cycles over time. Unveils spontaneous sub-cluster formations and swarm bottlenecks.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'abm' && (
          <motion.div
            key="abm"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="p-8 bg-stone-50 border-2 border-black editorial-shadow-sm space-y-8">
              <h2 className="text-2xl font-serif font-bold border-b border-black/10 pb-4">
                Agent-Based Modeling (ABM) & Swarm Intelligence Protocols
              </h2>
              <p className="text-xs font-mono text-stone-600 leading-relaxed">
                The simulation models social networking interactions through decentralized rules. Rather than scripting deterministic outcomes, personas interact stochastically based on internal utility functions and goal orientations.
              </p>

              <div className="space-y-6">
                <div className="bg-white p-6 border border-black flex flex-col md:flex-row gap-6 items-start">
                  <div className="p-3 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest shrink-0">
                    Rule Alpha
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-serif font-bold text-lg">Stochastic Pairing & Affinity Calculus</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      When personas cross paths in the simulation loop, interaction probability (P_bond) is computed via technical proficiency deltas, shared motivation intersection, and personality matrix distance. High resonance (&gt;65%) cements durable trust bonds in Firestore.
                    </p>
                    <div className="p-3 bg-stone-100 font-mono text-[10px] text-stone-700">
                      P_bond = (1 - ΔTech/100)*0.4 + PersonalityMatch*0.4 + SharedMotivations*0.2
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-black flex flex-col md:flex-row gap-6 items-start">
                  <div className="p-3 bg-amber-500 text-black font-mono text-xs font-bold uppercase tracking-widest shrink-0">
                    Rule Beta
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-serif font-bold text-lg">Swarm Intelligence & Pheromone Trails</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Successful job execution deposits virtual pheromones along active network links. Downstream job allocation algorithms dynamically weight links with high pheromone density, spontaneously optimizing routing throughput across the simulated network.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 border border-black flex flex-col md:flex-row gap-6 items-start">
                  <div className="p-3 bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-widest shrink-0">
                    Rule Gamma
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-serif font-bold text-lg">Knowledge Unit Exchange & Seniority Nudging</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      During high-affinity interactions, personas autonomously exchange knowledge units (`idCards` skills). Senior agents (`staff`, `senior`) exert gravitational influence on junior peers, gently elevating their technical proficiency across successive generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-8 bg-black text-white editorial-shadow space-y-8 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Specification Compliance Checklist</span>
              <span className="text-[10px] bg-white/10 px-3 py-1">VERIFIED 100%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-white uppercase">8 Comprehensive User Personas</p>
                    <p className="text-[11px] text-stone-400 pt-1 font-sans">
                      Includes Alex Chen, Sarah Jenkins, David Okoro, Elena Rossi, Marcus Thorne, Maya Vance (Busy Professional), Julian Rivers (Creative Freelancer), and Zoe Rivera (Young Adult Mobile App Persona). Complete demographics, psychographics, goals, frustrations, and bio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-white uppercase">Visualization & Interaction Models</p>
                    <p className="text-[11px] text-stone-400 pt-1 font-sans">
                      Force-directed network graphs, Cluster maps, Yield heatmaps, and interactive Shared Workspace models (Idea Sharing & SLA Task Bridges between Busy Professionals & Creative Freelancers).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-white uppercase">Environmental Context Engines</p>
                    <p className="text-[11px] text-stone-400 pt-1 font-sans">
                      Dynamic environmental modifiers (Crunch Time, Innovation Phase, Resource Starved, High Ambiguity, Maintenance Mode) altering interaction rates, influence thresholds, and persona capabilities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-white uppercase">Live Database Synchronization</p>
                    <p className="text-[11px] text-stone-400 pt-1 font-sans">
                      All emergent sociodynamic relationships, knowledge exchange updates, and swarm jobs persist directly into Firestore cloud persistence in real time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
