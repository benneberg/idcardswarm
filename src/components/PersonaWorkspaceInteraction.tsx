import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  Briefcase, 
  Palette, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight, 
  Zap, 
  ShieldAlert,
  Sliders,
  TrendingUp,
  Flame,
  Award
} from 'lucide-react';
import { USER_PERSONAS, UserPersona } from '../data/userPersonas';

export const PersonaWorkspaceInteraction: React.FC = () => {
  const maya = USER_PERSONAS.find(p => p.name === 'Maya Vance') || USER_PERSONAS[0];
  const julian = USER_PERSONAS.find(p => p.name === 'Julian Rivers') || USER_PERSONAS[1];
  const zoe = USER_PERSONAS.find(p => p.name === 'Zoe Rivera') || USER_PERSONAS[2];

  const [activeTab, setActiveTab] = useState<'interaction' | 'mobile_persona'>('interaction');
  const [interactionMode, setInteractionMode] = useState<'brainstorm' | 'task_management' | 'conflict_resolution'>('brainstorm');
  const [environmentState, setEnvironmentState] = useState<'innovation' | 'crunch' | 'ambiguity'>('innovation');

  const [sharedIdeas, setSharedIdeas] = useState([
    {
      id: 'idea_1',
      author: 'Julian Rivers',
      authorRole: 'Creative Freelancer',
      avatar: julian.avatar_url,
      rawIdea: 'Concept: Dynamic mood-based UI themes that shift colors based on daily focus energy levels.',
      processedByMaya: 'Action Item: Evaluate palette accessibility compliance (WCAG AA). Create 3 theme presets for Q3 Mobile Launch.',
      status: 'In Synthesis',
      time: '10:14 AM'
    },
    {
      id: 'idea_2',
      author: 'Maya Vance',
      authorRole: 'Busy Professional',
      avatar: maya.avatar_url,
      rawIdea: 'SLA Gate: Need final brand asset kit by Thursday 5 PM to lock sprint deployment.',
      processedByMaya: 'Julian response: Uploading SVG icon bundle & typography rules to Figma tokens repository.',
      status: 'Approved',
      time: '11:02 AM'
    }
  ]);

  const [newIdeaText, setNewIdeaText] = useState('');

  const handlePostIdea = () => {
    if (!newIdeaText.trim()) return;
    const idea = {
      id: `idea_${Date.now()}`,
      author: 'Julian Rivers',
      authorRole: 'Creative Freelancer',
      avatar: julian.avatar_url,
      rawIdea: newIdeaText,
      processedByMaya: `Swarm AI Parsing: Structured into 2 sub-tasks with 48h SLA gate. Assigned owner: Maya & Julian.`,
      status: 'Pending Review',
      time: 'Just now'
    };
    setSharedIdeas([idea, ...sharedIdeas]);
    setNewIdeaText('');
  };

  return (
    <div className="bg-white border-2 border-black editorial-shadow p-8 flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-black pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-blue-600">Swarm Collaboration Engine</span>
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Persona Interaction & Mobile Archetype</h2>
          <p className="text-xs font-mono uppercase tracking-widest text-black/50 mt-1">
            Simulating cross-functional synergy between Busy Professionals & Creative Freelancers
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-2 border-black bg-stone-100 p-1 font-mono text-[10px] uppercase">
          <button
            onClick={() => setActiveTab('interaction')}
            className={`px-4 py-2 flex items-center gap-2 transition-all font-bold ${
              activeTab === 'interaction' ? 'bg-black text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            <Layers size={14} /> Shared Workspace Interaction
          </button>
          <button
            onClick={() => setActiveTab('mobile_persona')}
            className={`px-4 py-2 flex items-center gap-2 transition-all font-bold ${
              activeTab === 'mobile_persona' ? 'bg-black text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            <Smartphone size={14} /> Young Adult Mobile Persona
          </button>
        </div>
      </div>

      {activeTab === 'interaction' ? (
        <div className="flex flex-col gap-8">
          {/* Persona Header Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Busy Professional Card */}
            <div className="bg-stone-50 border-2 border-black p-6 editorial-shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/20 pb-4">
                <div className="flex items-center gap-4">
                  <img src={maya.avatar_url} alt={maya.name} className="w-12 h-12 border border-black grayscale shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-xl">{maya.name}</h4>
                    <span className="text-[10px] font-mono uppercase text-blue-600 font-bold flex items-center gap-1">
                      <Briefcase size={12} /> {maya.occupation}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase opacity-50 block">Conscientiousness</span>
                  <span className="font-mono font-bold text-sm">95%</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="italic text-black/80 font-serif">"{maya.bio}"</p>
                <div className="pt-2 border-t border-black/10">
                  <span className="text-[10px] font-mono uppercase font-bold text-black/50 block mb-1">Key Priority:</span>
                  <p className="font-sans text-[11px] font-semibold text-black/90">Time-blocked clarity, structured async handoffs, executive summaries.</p>
                </div>
              </div>
            </div>

            {/* Creative Freelancer Card */}
            <div className="bg-stone-50 border-2 border-black p-6 editorial-shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/20 pb-4">
                <div className="flex items-center gap-4">
                  <img src={julian.avatar_url} alt={julian.name} className="w-12 h-12 border border-black grayscale shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-xl">{julian.name}</h4>
                    <span className="text-[10px] font-mono uppercase text-purple-600 font-bold flex items-center gap-1">
                      <Palette size={12} /> {julian.occupation}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase opacity-50 block">Openness</span>
                  <span className="font-mono font-bold text-sm">95%</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="italic text-black/80 font-serif">"{julian.bio}"</p>
                <div className="pt-2 border-t border-black/10">
                  <span className="text-[10px] font-mono uppercase font-bold text-black/50 block mb-1">Key Priority:</span>
                  <p className="font-sans text-[11px] font-semibold text-black/90">Spontaneous creative flow, visual whiteboarding, friction-free ideation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Controls */}
          <div className="bg-black text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sliders size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/60 block">Swarm Environment Context</span>
                <span className="font-serif font-bold text-sm">Active Condition: {environmentState.toUpperCase().replace('_', ' ')}</span>
              </div>
            </div>
            <div className="flex gap-2 font-mono text-[10px] uppercase">
              <button
                onClick={() => setEnvironmentState('innovation')}
                className={`px-3 py-1.5 border ${environmentState === 'innovation' ? 'bg-white text-black border-white' : 'border-white/30 text-white/70 hover:text-white'}`}
              >
                Innovation Phase
              </button>
              <button
                onClick={() => setEnvironmentState('crunch')}
                className={`px-3 py-1.5 border ${environmentState === 'crunch' ? 'bg-amber-400 text-black border-amber-400' : 'border-white/30 text-white/70 hover:text-white'}`}
              >
                Crunch Time
              </button>
              <button
                onClick={() => setEnvironmentState('ambiguity')}
                className={`px-3 py-1.5 border ${environmentState === 'ambiguity' ? 'bg-blue-400 text-black border-blue-400' : 'border-white/30 text-white/70 hover:text-white'}`}
              >
                High Ambiguity
              </button>
            </div>
          </div>

          {/* Interaction Simulator Container */}
          <div className="bg-stone-50 border-2 border-black p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/20 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <h3 className="font-serif font-bold text-lg">Digital Workspace Synergy Stream</h3>
              </div>
              <div className="flex gap-2 font-mono text-[9px] uppercase">
                <button
                  onClick={() => setInteractionMode('brainstorm')}
                  className={`px-3 py-1 border ${interactionMode === 'brainstorm' ? 'bg-black text-white' : 'border-black/20 bg-white'}`}
                >
                  Idea Sharing & Synthesis
                </button>
                <button
                  onClick={() => setInteractionMode('task_management')}
                  className={`px-3 py-1 border ${interactionMode === 'task_management' ? 'bg-black text-white' : 'border-black/20 bg-white'}`}
                >
                  Collaborative Task Bridge
                </button>
              </div>
            </div>

            {/* Input Form for Spontaneous Idea */}
            <div className="bg-white border border-black p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-black/60">
                <span>Post Creative Idea (as Julian - Creative Freelancer)</span>
                <span className="text-purple-600">Auto-Synthesized by Maya's Agent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIdeaText}
                  onChange={(e) => setNewIdeaText(e.target.value)}
                  placeholder="e.g., Let's turn onboarding into a interactive 3-step story card stack..."
                  className="flex-1 bg-stone-50 border border-black/20 px-3 py-2 text-xs font-sans outline-none focus:border-black"
                />
                <button
                  onClick={handlePostIdea}
                  className="bg-black text-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2 shrink-0"
                >
                  <Sparkles size={12} /> Share & Synthesize
                </button>
              </div>
            </div>

            {/* Live Shared Workspace Stream */}
            <div className="space-y-4">
              <AnimatePresence>
                {sharedIdeas.map((idea) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-l-4 border-l-purple-600 border border-black/20 p-4 flex flex-col gap-3 editorial-shadow-sm"
                  >
                    {/* Author & Header */}
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <div className="flex items-center gap-3">
                        <img src={idea.avatar} alt={idea.author} className="w-8 h-8 border border-black grayscale" />
                        <div>
                          <div className="font-serif font-bold text-xs">{idea.author}</div>
                          <div className="text-[9px] font-mono text-purple-600 uppercase font-bold">{idea.authorRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-black/40">
                        <Clock size={10} /> {idea.time}
                        <span className="bg-black text-white px-2 py-0.5 uppercase font-bold">{idea.status}</span>
                      </div>
                    </div>

                    {/* Raw Idea */}
                    <div className="bg-stone-50 border border-black/10 p-3 text-xs italic font-sans text-black/80">
                      "{idea.rawIdea}"
                    </div>

                    {/* Maya's Async Bridge Processing */}
                    <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-200 p-3">
                      <img src={maya.avatar_url} alt="Maya" className="w-6 h-6 border border-black grayscale shrink-0 mt-0.5" />
                      <div className="text-xs font-sans">
                        <span className="font-mono text-[9px] uppercase font-bold text-blue-700 block mb-0.5">
                          Maya's Async Synthesis Bridge ({environmentState === 'crunch' ? 'Strict SLA' : 'Fluid Alignment'}):
                        </span>
                        <p className="text-black/90 font-medium">{idea.processedByMaya}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* Young Adult Mobile Productivity Persona Spotlight */
        <div className="flex flex-col gap-8">
          <div className="bg-stone-50 border-2 border-black p-8 editorial-shadow-sm flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Persona Avatar & Fast Demographics */}
            <div className="w-full lg:w-72 bg-white border-2 border-black p-6 text-center flex flex-col items-center gap-4 shrink-0">
              <img src={zoe.avatar_url} alt={zoe.name} className="w-24 h-24 border-2 border-black grayscale" />
              <div>
                <h3 className="font-serif font-bold text-2xl">{zoe.name}, {zoe.age}</h3>
                <span className="text-[10px] font-mono uppercase text-blue-600 font-bold block mt-1">{zoe.occupation}</span>
              </div>
              <div className="w-full border-t border-black/10 pt-4 text-left space-y-2 text-xs">
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold text-black/40 block">Demographics</span>
                  <p className="font-sans text-[11px] leading-snug text-black/80">{zoe.demographics}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold text-black/40 block">Tech Proficiency</span>
                  <div className="w-full bg-stone-200 h-2 border border-black mt-1">
                    <div className="bg-black h-full" style={{ width: `${zoe.tech_proficiency}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Detailed Psychographics, Bio, Goals & Frustrations */}
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-blue-600 block mb-1">
                  Target Mobile Application Persona
                </span>
                <h3 className="font-serif font-bold text-3xl">Psychographic & Behavioral Profile</h3>
                <p className="text-xs font-serif italic text-black/80 mt-2 leading-relaxed">
                  "{zoe.bio}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Goals */}
                <div className="bg-white border border-black p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-black pb-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    <h4 className="font-mono text-xs uppercase font-bold tracking-widest">Core Goals</h4>
                  </div>
                  <ul className="space-y-2 text-xs font-sans">
                    {zoe.goals.map((g, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Frustrations */}
                <div className="bg-white border border-black p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-black pb-2">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <h4 className="font-mono text-xs uppercase font-bold tracking-widest">Frustrations & Friction</h4>
                  </div>
                  <ul className="space-y-2 text-xs font-sans">
                    {zoe.frustrations.map((f, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <ShieldAlert size={12} className="text-rose-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mobile App UX Requirements for Young Adult Audience */}
              <div className="bg-black text-white p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-white/20 pb-3">
                  <Smartphone size={16} className="text-amber-400" />
                  <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-amber-400">
                    Productivity Mobile App Design Principles for Gen Z / Young Adults
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="bg-white/10 p-4 border border-white/10">
                    <span className="font-mono text-[10px] uppercase font-bold text-amber-300 block mb-1">1. Two-Tap Capture</span>
                    <p className="text-white/80">Instant voice/text entry with background AI auto-tagging. Zero friction onboarding.</p>
                  </div>
                  <div className="bg-white/10 p-4 border border-white/10">
                    <span className="font-mono text-[10px] uppercase font-bold text-amber-300 block mb-1">2. Gamified Momentum</span>
                    <p className="text-white/80">Visual focus streaks, micro-badges, and satisfying tactile feedback loops.</p>
                  </div>
                  <div className="bg-white/10 p-4 border border-white/10">
                    <span className="font-mono text-[10px] uppercase font-bold text-amber-300 block mb-1">3. Cross-Device Sync</span>
                    <p className="text-white/80">Seamless handoff between 30-second mobile sessions and desktop deep work.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
