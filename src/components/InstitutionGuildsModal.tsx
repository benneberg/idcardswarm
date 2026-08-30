import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, BookOpen, Sparkles, Plus, Award, Check, Users } from 'lucide-react';
import { Institution, AgentCard, GuildMemory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  institutions: Institution[];
  agents: AgentCard[];
  onAssignAgent: (agentId: string, institutionId: string) => Promise<void>;
  onRecordMemory: (institutionId: string, memory: { title: string; lesson: string; tag?: string; contributorAgentId: string }) => Promise<void>;
}

export const InstitutionGuildsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  institutions,
  agents,
  onAssignAgent,
  onRecordMemory
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemLesson, setNewMemLesson] = useState('');
  const [newMemTag, setNewMemTag] = useState('architecture');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAgentToAssign, setSelectedAgentToAssign] = useState('');

  if (!isOpen) return null;

  const currentInst = institutions.find(i => i.id === selectedInstId) || institutions[0];

  const handleAddMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInst || !newMemTitle.trim() || !newMemLesson.trim()) return;

    setSubmitting(true);
    try {
      await onRecordMemory(currentInst.id, {
        title: newMemTitle.trim(),
        lesson: newMemLesson.trim(),
        tag: newMemTag,
        contributorAgentId: 'curator'
      });
      setNewMemTitle('');
      setNewMemLesson('');
      setShowAddMemory(false);
    } catch (err) {
      console.error('Failed to record guild memory:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedAgentToAssign || !currentInst) return;
    setSubmitting(true);
    try {
      await onAssignAgent(selectedAgentToAssign, currentInst.id);
      setSelectedAgentToAssign('');
    } catch (err) {
      console.error('Failed to assign agent:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const assignedMembers = agents.filter(a => 
    a.institution_id === currentInst?.id || currentInst?.memberAgentIds?.includes(a.id)
  );

  const unassignedAgents = agents.filter(a => 
    a.institution_id !== currentInst?.id && !currentInst?.memberAgentIds?.includes(a.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border-4 border-black editorial-shadow"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-6 bg-[#FBF9F5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-black" size={18} />
              <span className="font-mono text-xs uppercase tracking-[0.25em] font-bold">Institutions & Guild Memory</span>
            </div>
            <h2 className="font-serif text-3xl font-bold italic tracking-tight">Institutional Culture Vectors</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-black/10">
          
          {/* Guild Sidebar Selector */}
          <div className="md:col-span-4 p-6 space-y-3 bg-stone-50">
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold mb-2">Recognized Guilds ({institutions.length})</p>
            {institutions.map(inst => {
              const isSelected = inst.id === (currentInst?.id);
              const memberCount = agents.filter(a => a.institution_id === inst.id || inst.memberAgentIds?.includes(a.id)).length;
              return (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstId(inst.id)}
                  className={`w-full text-left p-4 border transition-all ${
                    isSelected 
                      ? 'bg-black text-white border-black editorial-shadow' 
                      : 'bg-white border-black/15 hover:border-black text-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-base leading-snug">{inst.name}</span>
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${isSelected ? 'border-white/40 bg-white/10' : 'border-black/20 bg-stone-100'}`}>
                      {memberCount} Members
                    </span>
                  </div>
                  <p className={`font-mono text-[10px] line-clamp-2 italic ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                    "{inst.motto}"
                  </p>
                </button>
              );
            })}
          </div>

          {/* Guild Details & DNA View */}
          <div className="md:col-span-8 p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-100px)]">
            {currentInst ? (
              <>
                {/* Guild Title & Motto Banner */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] uppercase bg-black text-white px-2 py-0.5 tracking-widest font-bold">
                      Archetype: {currentInst.archetypeKey}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-black/60">
                      ID: {currentInst.id}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold">{currentInst.name}</h3>
                  <p className="font-serif italic text-lg text-stone-600 mt-1 mb-3">"{currentInst.motto}"</p>
                  <p className="text-sm font-sans text-stone-700 leading-relaxed border-l-2 border-black pl-4">
                    {currentInst.description}
                  </p>
                </div>

                {/* Cultural DNA Vector Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/15 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} />
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold">Aggregate Cultural DNA Vector</h4>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-black/50">Derived from affiliated cohort</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(currentInst.cultural_vector || {}).map(([dimension, val]) => {
                      const score = typeof val === 'number' ? val : 0.50;
                      return (
                        <div key={dimension} className="p-3 border border-black/15 bg-[#FDFBF7]">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-mono text-[9px] uppercase tracking-wide text-stone-600 truncate">{dimension.replace(/_/g, ' ')}</span>
                            <span className="font-mono text-xs font-bold">{Math.round(score * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 overflow-hidden">
                            <div 
                              className="h-full bg-black transition-all" 
                              style={{ width: `${Math.round(score * 100)}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Passive Buffs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-black/15 pb-2">
                    <Award size={16} />
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold">Passive Institutional Buffs</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentInst.passive_buffs.map((buff, bIdx) => (
                      <div key={bIdx} className="p-4 border-2 border-black bg-stone-50 space-y-2">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-black" />
                          <span className="font-serif font-bold text-sm">{buff.name}</span>
                        </div>
                        <p className="text-xs font-sans text-stone-600">{buff.description}</p>
                        {buff.statBuffs && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {Object.entries(buff.statBuffs).map(([s, b]) => (
                              <span key={s} className="px-2 py-0.5 bg-white border border-black font-mono text-[9px] uppercase font-bold">
                                {s}: +{Math.round(Number(b || 0) * 100)}%
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guild Memory Archive */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/15 pb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold">Guild Memory & Lessons ({currentInst.guild_memory?.length || 0})</h4>
                    </div>
                    <button
                      onClick={() => setShowAddMemory(!showAddMemory)}
                      className="px-2.5 py-1 border border-black bg-white hover:bg-stone-100 font-mono text-[10px] uppercase font-bold flex items-center gap-1"
                    >
                      <Plus size={11} /> {showAddMemory ? 'Cancel' : 'Record Heuristic'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAddMemory && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddMemorySubmit}
                        className="p-4 border-2 border-black bg-stone-100 space-y-3"
                      >
                        <div className="font-serif font-bold text-sm">Add New Collective Heuristic</div>
                        <input
                          type="text"
                          placeholder="Heuristic Title (e.g. Distributed State Invariants)"
                          value={newMemTitle}
                          onChange={(e) => setNewMemTitle(e.target.value)}
                          className="w-full p-2 border border-black bg-white font-mono text-xs"
                          required
                        />
                        <textarea
                          placeholder="Lesson or Behavioral Guideline..."
                          value={newMemLesson}
                          onChange={(e) => setNewMemLesson(e.target.value)}
                          className="w-full p-2 border border-black bg-white font-sans text-xs h-20"
                          required
                        />
                        <div className="flex items-center justify-between">
                          <select
                            value={newMemTag}
                            onChange={(e) => setNewMemTag(e.target.value)}
                            className="p-1.5 border border-black bg-white font-mono text-xs"
                          >
                            <option value="architecture">Architecture</option>
                            <option value="validation">Validation</option>
                            <option value="security">Security</option>
                            <option value="narrative">Narrative</option>
                            <option value="governance">Governance</option>
                          </select>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-1.5 bg-black text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-black/80"
                          >
                            {submitting ? 'Saving...' : 'Commit Lesson'}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {(currentInst.guild_memory || []).map((mem) => (
                      <div key={mem.id} className="p-3 border border-black/15 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm">{mem.title}</span>
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-stone-100 border border-stone-300">
                            {mem.tag || 'general'}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-stone-700 italic">"{mem.lesson}"</p>
                        <div className="font-mono text-[9px] text-stone-400">
                          Recorded {new Date(mem.recordedAt).toLocaleDateString()} by {mem.contributorAgentId}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affiliated Members & Assignment */}
                <div className="space-y-4 pt-4 border-t border-black/15">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold">Affiliated Agents ({assignedMembers.length})</h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {assignedMembers.length === 0 ? (
                      <p className="font-serif italic text-sm text-stone-400">No agents currently pledged to this guild.</p>
                    ) : (
                      assignedMembers.map(a => (
                        <div key={a.id} className="flex items-center gap-2 px-3 py-1.5 border border-black bg-stone-50">
                          <span className="font-serif text-sm font-bold">{a.role}</span>
                          <span className="font-mono text-[9px] px-1 bg-black text-white uppercase">{a.mode}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Assign Agent selector */}
                  {unassignedAgents.length > 0 && (
                    <div className="flex items-center gap-3 pt-2">
                      <select
                        value={selectedAgentToAssign}
                        onChange={(e) => setSelectedAgentToAssign(e.target.value)}
                        className="p-2 border border-black bg-white font-mono text-xs flex-1"
                      >
                        <option value="">-- Select Agent to Pledge to Guild --</option>
                        {unassignedAgents.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.role} ({a.mode}) - Level {a.level || 1}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignSubmit}
                        disabled={!selectedAgentToAssign || submitting}
                        className="px-4 py-2 bg-black text-white font-mono text-xs uppercase tracking-wider font-bold disabled:opacity-40"
                      >
                        Pledge Agent
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center font-serif italic text-stone-400">
                Select an institution from the directory.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
