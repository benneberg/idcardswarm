import React, { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Save, X, Sparkles, ChevronRight, ChevronLeft, User, Briefcase, Compass, Cpu } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = [
  { id: 'demographics', title: 'Demographics', icon: User },
  { id: 'background', title: 'Background', icon: Briefcase },
  { id: 'needs', title: 'Needs', icon: Compass },
  { id: 'proficiency', title: 'Proficiency', icon: Cpu },
];

export const PersonaCreator: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    role: '',
    occupation: '',
    bio: '',
    motivations: '',
    pain_points: '',
    experience: 'mid' as 'junior' | 'mid' | 'senior' | 'staff',
    tech_proficiency: 50,
    personality: {
      openness: 50,
      conscientiousness: 50,
      risk_tolerance: 50,
      extraversion: 50,
      agreeableness: 50
    }
  });

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    setAiSuccess(false);
    try {
      const res = await fetch('/api/swarm/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate persona blueprint');
      }
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        name: data.name || prev.name,
        age: data.age || prev.age,
        role: data.role || prev.role,
        occupation: data.occupation || prev.occupation,
        bio: data.bio || prev.bio,
        motivations: data.motivations || prev.motivations,
        pain_points: data.pain_points || prev.pain_points,
        experience: data.experience || prev.experience,
        tech_proficiency: typeof data.tech_proficiency === 'number' ? data.tech_proficiency : prev.tech_proficiency,
        personality: {
          openness: data.personality?.openness ?? prev.personality.openness,
          conscientiousness: data.personality?.conscientiousness ?? prev.personality.conscientiousness,
          risk_tolerance: data.personality?.risk_tolerance ?? prev.personality.risk_tolerance,
          extraversion: data.personality?.extraversion ?? prev.personality.extraversion,
          agreeableness: data.personality?.agreeableness ?? prev.personality.agreeableness,
        }
      }));
      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 4000);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const motivationsArr = formData.motivations.split(',').map(s => s.trim()).filter(Boolean);
      const painPointsArr = formData.pain_points.split(',').map(s => s.trim()).filter(Boolean);

      await addDoc(collection(db, 'agents'), {
        role: formData.role || formData.occupation,
        mode: 'simulator',
        skills: [...motivationsArr, formData.occupation],
        experience_level: formData.experience,
        behavior_rules: [`Operate as ${formData.name}`, 'Maintain ecosystem consistency'],
        ownerId: auth.currentUser.uid,
        version: '2.0',
        reputation: 50,
        trustScore: 50,
        level: 1,
        exp: 0,
        skill_points: 3,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        persona_metadata: {
          name: formData.name,
          age: Number(formData.age),
          occupation: formData.occupation,
          bio: formData.bio,
          motivations: motivationsArr,
          pain_points: painPointsArr,
          tech_proficiency: formData.tech_proficiency,
          personality: {
            openness: formData.personality.openness,
            conscientiousness: formData.personality.conscientiousness,
            risk_tolerance: formData.personality.risk_tolerance,
            extraversion: formData.personality.extraversion,
            agreeableness: formData.personality.agreeableness,
          }
        },
        capability_vector: {
          creativity: formData.personality.openness / 100,
          strategic_thinking: formData.personality.conscientiousness / 100,
          technical_depth: formData.tech_proficiency / 100,
          communication: formData.personality.extraversion / 100,
          leadership: (formData.personality.extraversion + formData.personality.conscientiousness) / 200,
          risk_tolerance: formData.personality.risk_tolerance / 100,
          research_ability: 0.5,
          reliability: 0.5,
          curiosity: 0.5,
          adaptability: 0.5
        },
        priority_bias: { correctness: 0.5, speed: 0.5, elegance: 0.5 },
        context_budget: 4000,
        weaknesses: ['New entity baseline']
      });
      onSuccess();
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'agents');
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white border-4 border-black p-0 max-w-4xl w-full editorial-shadow relative overflow-hidden flex flex-col md:flex-row min-h-[600px]"
    >
      {/* Sidebar Progress */}
      <div className="w-full md:w-64 bg-black text-white p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <UserPlus size={24} className="text-blue-400" />
            <h2 className="text-xl font-serif font-bold tracking-tighter uppercase">Forge</h2>
          </div>

          <div className="space-y-8">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <div key={step.id} className="flex items-center gap-4 group">
                  <div className={`
                    w-8 h-8 flex items-center justify-center border-2 transition-all
                    ${isActive ? 'bg-blue-500 border-blue-500 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : isCompleted ? 'bg-white border-white text-black' : 'border-zinc-700 opacity-40'}
                  `}>
                    {isCompleted ? <Save size={14} /> : <Icon size={14} />}
                  </div>
                  <div className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <p className="text-[8px] font-mono uppercase tracking-[0.2em] mb-1">Step 0{idx + 1}</p>
                    <p className="text-[10px] font-mono uppercase font-bold tracking-widest">{step.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 italic">Civitas Initialization // Protocol v4.0</p>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-12 flex flex-col justify-between bg-zinc-50 relative">
        <button onClick={onClose} className="absolute top-8 right-8 hover:rotate-90 transition-transform z-10">
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-4xl font-serif font-bold tracking-tight mb-2">{currentStepData.title}</h3>
                  <p className="text-xs font-mono uppercase opacity-40 tracking-widest">
                    {currentStep === 0 && "Define the fundamental identity parameters."}
                    {currentStep === 1 && "Establish the narrative and expertise levels."}
                    {currentStep === 2 && "Map the behavioral drivers and friction points."}
                    {currentStep === 3 && "Configure the cognitive matrix and tech baseline."}
                  </p>
                </div>

                <div className="space-y-6">
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 gap-8">
                      {/* AI Fast Persona Generator */}
                      <div className="p-4 bg-blue-50 border-2 border-blue-600 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase font-bold text-blue-900 tracking-wider flex items-center gap-1.5">
                            <Sparkles size={13} className="text-blue-600" /> AI-Assisted Procedural Generation
                          </span>
                          <span className="font-mono text-[9px] text-blue-700 uppercase">Gemini Flash Synthesis</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="e.g. Senior Security Researcher specializing in memory safety and fault tolerance..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGenerateWithAi(); } }}
                            className="flex-1 bg-white border border-blue-300 px-3 py-2 text-xs font-mono outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={handleGenerateWithAi}
                            disabled={isGenerating || !aiPrompt.trim()}
                            className="px-4 py-2 bg-blue-600 text-white font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
                          >
                            {isGenerating ? 'Synthesizing...' : 'Generate with AI'}
                          </button>
                        </div>
                        {aiError && (
                          <p className="text-[10px] font-mono text-red-600">{aiError}</p>
                        )}
                        {aiSuccess && (
                          <p className="text-[10px] font-mono text-green-700 font-bold">✓ Persona parameters successfully generated & mapped!</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Digital Name</label>
                        <input 
                          required
                          autoFocus
                          className="w-full border-b-4 border-black/5 focus:border-black outline-none py-4 text-3xl font-serif bg-transparent transition-all"
                          placeholder="e.g. Elena Vance"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Maturity Age</label>
                          <input 
                            type="number"
                            required
                            className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-xl font-serif bg-transparent"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Core Occupation</label>
                          <input 
                            required
                            className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-xl font-serif bg-transparent"
                            placeholder="e.g. Architect"
                            value={formData.occupation}
                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Simulation Complexity</label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {(['junior', 'mid', 'senior', 'staff'] as const).map(lvl => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setFormData({ ...formData, experience: lvl })}
                              className={`p-4 border-2 font-mono text-[10px] uppercase tracking-widest transition-all ${formData.experience === lvl ? 'bg-black text-white border-black' : 'bg-white border-black/10 opacity-60 hover:opacity-100'}`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Behavioral Bio & Narrative</label>
                        <textarea 
                          required
                          rows={6}
                          className="w-full border-2 border-black/5 focus:border-black/20 outline-none p-6 text-lg font-serif leading-relaxed italic bg-white"
                          placeholder="Describe the inner narrative and worldview..."
                          value={formData.bio}
                          onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-2">
                          <Sparkles size={10} className="text-yellow-500" /> Primary Motivations
                        </label>
                        <p className="text-[10px] opacity-40 mb-2">Separate multiple drivers with commas.</p>
                        <input 
                          className="w-full border-b-2 border-black/10 focus:border-black outline-none py-4 text-xl font-serif bg-transparent"
                          placeholder="Autonomy, Deep Work, Recognition"
                          value={formData.motivations}
                          onChange={e => setFormData({ ...formData, motivations: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Systemic Pain Points</label>
                        <p className="text-[10px] opacity-40 mb-2">Define the primary stressors or obstacles.</p>
                        <input 
                          className="w-full border-b-2 border-black/10 focus:border-black outline-none py-4 text-xl font-serif bg-transparent"
                          placeholder="Inefficiency, Noise, Isolation"
                          value={formData.pain_points}
                          onChange={e => setFormData({ ...formData, pain_points: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="space-y-2 bg-black text-white p-8 rounded-sm">
                        <div className="flex justify-between items-center mb-6">
                          <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Technological Proficiency</label>
                          <span className="text-xl font-mono">{formData.tech_proficiency}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          className="w-full h-2 bg-white/20 appearance-none cursor-pointer accent-blue-400"
                          value={formData.tech_proficiency}
                          onChange={e => setFormData({ ...formData, tech_proficiency: Number(e.target.value) })}
                        />
                        <div className="flex justify-between text-[8px] font-mono uppercase opacity-40 mt-2">
                          <span>Novice</span>
                          <span>Expert</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest block">Personality Matrix (OCEAN)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-white p-6 border border-black/5">
                          {Object.entries(formData.personality).map(([trait, value]) => (
                            <div key={trait} className="space-y-2">
                              <div className="flex justify-between text-[8px] font-mono uppercase">
                                <span>{trait.replace('_', ' ')}</span>
                                <span>{value}%</span>
                              </div>
                              <input 
                                type="range"
                                min="0"
                                max="100"
                                className="w-full h-1 bg-black/10 appearance-none cursor-pointer accent-black"
                                value={value}
                                onChange={e => setFormData({
                                  ...formData,
                                  personality: { ...formData.personality, [trait]: Number(e.target.value) }
                                })}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-12 flex justify-between items-center border-t border-black/5">
            <button 
              type="button"
              onClick={currentStep === 0 ? onClose : prevStep}
              className="flex items-center gap-2 px-6 py-3 font-mono text-[10px] uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all"
            >
              <ChevronLeft size={14} />
              {currentStep === 0 ? "Abort" : "Back"}
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-10 py-3 font-mono text-[10px] uppercase tracking-widest bg-black text-white hover:opacity-90 transition-all"
              >
                Continue
                <ChevronRight size={14} />
              </button>
            ) : (
              <button 
                disabled={loading}
                className="flex items-center gap-2 px-10 py-3 font-mono text-[10px] uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                {loading ? <div className="animate-spin h-3 w-3 border-2 border-white/20 border-t-white rounded-full" /> : <Save size={14} />}
                Forge Identity
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};
