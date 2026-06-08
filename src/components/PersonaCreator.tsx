import React, { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { UserPlus, Save, X, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const PersonaCreator: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    role: '',
    occupation: '',
    bio: '',
    motivations: '',
    pain_points: '',
    experience: 'mid' as 'junior' | 'mid' | 'senior' | 'staff',
    personality: {
      openness: 50,
      conscientiousness: 50,
      risk_tolerance: 50,
      extraversion: 50,
      agreeableness: 50
    }
  });

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
        skills: motivationsArr,
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
          personality: {
            openness: formData.personality.openness,
            conscientiousness: formData.personality.conscientiousness,
            risk_tolerance: formData.personality.risk_tolerance,
            extraversion: formData.personality.extraversion,
            agreeableness: formData.personality.agreeableness,
          }
        },
        capability_vector: {
          creativity: 0.5,
          strategic_thinking: 0.5,
          technical_depth: 0.5,
          communication: 0.5,
          leadership: 0.5,
          risk_tolerance: 0.5,
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border-4 border-black p-8 max-w-2xl w-full editorial-shadow relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <button onClick={onClose} className="hover:rotate-90 transition-transform">
          <X size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-black flex items-center justify-center text-white">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tighter uppercase">Forge New Identity</h2>
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 italic">Entity Initialization // Civitas Registry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Digital Name</label>
            <input 
              required
              className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-xl font-serif bg-transparent"
              placeholder="e.g. Elena Vance"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
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
        </div>

        {/* Personality Traits */}
        <div className="space-y-4 border-2 border-black/5 p-6 bg-stone-50">
          <label className="text-[10px] font-mono uppercase font-bold tracking-widest block mb-4">Core Personality Matrix</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Core Occupation</label>
            <input 
              required
              className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-sm font-mono"
              placeholder="e.g. Neural Architect"
              value={formData.occupation}
              onChange={e => setFormData({ ...formData, occupation: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Simulation Level</label>
            <select 
              className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-sm font-mono bg-transparent"
              value={formData.experience}
              onChange={e => setFormData({ ...formData, experience: e.target.value as any })}
            >
              <option value="junior">Junior // Initialized</option>
              <option value="mid">Mid // Operational</option>
              <option value="senior">Senior // Optimized</option>
              <option value="staff">Staff // Sovereign</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Behavioral Bio</label>
          <textarea 
            required
            rows={3}
            className="w-full border-2 border-black/5 focus:border-black/20 outline-none p-4 text-sm font-serif leading-relaxed italic"
            placeholder="Describe the inner narrative and worldview..."
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-2">
              <Sparkles size={10} /> Primary Motivations (Comma separated)
            </label>
            <input 
              className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-xs font-mono"
              placeholder="Autonomy, Deep Work, ROI"
              value={formData.motivations}
              onChange={e => setFormData({ ...formData, motivations: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold tracking-widest">Pain Points (Comma separated)</label>
            <input 
              className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 text-xs font-mono"
              placeholder="Information Overload, Bureaucracy"
              value={formData.pain_points}
              onChange={e => setFormData({ ...formData, pain_points: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-3 font-mono text-[10px] uppercase tracking-widest border border-black hover:bg-black/5 transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            className="px-8 py-3 font-mono text-[10px] uppercase tracking-widest bg-black text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <div className="animate-spin h-3 w-3 border-2 border-white/20 border-t-white rounded-full" /> : <Save size={14} />}
            Initialize in Civitas
          </button>
        </div>
      </form>
    </motion.div>
  );
};
