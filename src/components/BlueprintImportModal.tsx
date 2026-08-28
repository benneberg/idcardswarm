import React, { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { AgentCard } from '../types';

interface Props {
  onClose: () => void;
  onSuccess: (agent: AgentCard) => void;
}

export const BlueprintImportModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        setError(null);
      } catch (err: any) {
        setError('Failed to read file content.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!auth.currentUser) {
      setError('You must be signed in to import an agent blueprint.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsed = JSON.parse(jsonText);
      const agentData = parsed.agent || parsed;

      if (!agentData.role || typeof agentData.role !== 'string') {
        throw new Error('Invalid blueprint: missing or invalid "role" property.');
      }

      const skills = Array.isArray(agentData.skills) ? agentData.skills : ['Analysis'];
      const behaviorRules = Array.isArray(agentData.behavior_rules) 
        ? agentData.behavior_rules 
        : ['Adhere strictly to operational blueprint.'];

      const payload: Partial<AgentCard> = {
        role: agentData.role,
        mode: ['executor', 'critic', 'simulator'].includes(agentData.mode) ? agentData.mode : 'executor',
        skills,
        experience_level: agentData.experience_level || 'mid',
        behavior_rules: behaviorRules,
        capability_vector: agentData.capability_vector || {
          technical_depth: 0.6,
          curiosity: 0.6,
          reliability: 0.7,
          adaptability: 0.5,
          creativity: 0.6
        },
        priority_bias: agentData.priority_bias || { correctness: 0.5, speed: 0.3, elegance: 0.2 },
        persona_metadata: agentData.persona_metadata || {
          name: agentData.role,
          bio: 'Imported specialized system persona.',
          age: 30,
          occupation: agentData.role,
          personality: { openness: 60, conscientiousness: 70, risk_tolerance: 40, extraversion: 50 },
          tech_proficiency: 75
        },
        ownerId: auth.currentUser.uid,
        level: 1,
        exp: 0,
        reputation: 50,
        trustScore: 50,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        lineage: {
          generation: 1,
          mutations: ['Imported via Blueprint Specification']
        }
      };

      const docRef = await addDoc(collection(db, 'agents'), payload);
      onSuccess({ ...payload, id: docRef.id } as AgentCard);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Malformed JSON or invalid blueprint format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white max-w-xl w-full border-4 border-black editorial-shadow p-8"
      >
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          <div>
            <h3 className="text-2xl font-serif font-bold tracking-tight">Import Blueprint</h3>
            <p className="font-mono text-[10px] uppercase opacity-50 tracking-widest mt-1">
              Hydrate Agent Profile from JSON Spec
            </p>
          </div>
          <button onClick={onClose} className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-500 text-red-700 font-mono text-[10px] flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
              Upload .json Blueprint File
            </label>
            <input 
              type="file" 
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-[10px] file:font-mono file:uppercase file:bg-black file:text-white hover:file:bg-stone-800"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
              Or Paste Blueprint JSON
            </label>
            <textarea 
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste JSON specification here..."
              rows={8}
              className="w-full p-3 font-mono text-[11px] border border-black/20 focus:border-black outline-none bg-stone-50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-black font-mono text-[10px] uppercase tracking-widest hover:bg-stone-100"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleImport}
            disabled={!jsonText.trim() || loading}
            className="px-6 py-2 bg-black text-white font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Validating & Importing...' : 'Import to Registry'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
