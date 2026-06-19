
import React from 'react';
import { UserPersona } from '../data/userPersonas';
import { motion } from 'motion/react';
import { X, Check, AlertCircle } from 'lucide-react';

interface Props {
  personas: UserPersona[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const PersonaComparisonTable: React.FC<Props> = ({ personas, onRemove, onClose }) => {
  if (personas.length === 0) return null;

  const sections = [
    { label: 'Demographics', accessor: (p: UserPersona) => p.demographics },
    { label: 'Bio', accessor: (p: UserPersona) => p.bio },
    { label: 'Goals', accessor: (p: UserPersona) => p.goals, isList: true },
    { label: 'Motivations', accessor: (p: UserPersona) => p.motivations, isList: true },
    { label: 'Frustrations', accessor: (p: UserPersona) => p.frustrations, isList: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black editorial-shadow overflow-hidden flex flex-col"
    >
      <div className="bg-black text-white p-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-serif font-bold tracking-tight">Persona Comparison Matrix</h3>
          <p className="text-[10px] font-mono uppercase opacity-50">Cross-Referencing Behavioral Ecosystems</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-stone-50 border-b-2 border-black p-6 text-left font-mono text-[10px] uppercase tracking-widest w-48">Attribute</th>
              {personas.map(persona => (
                <th key={persona.id} className="border-b-2 border-black p-6 text-left relative min-w-[300px]">
                  <div className="flex items-center gap-4">
                    <img src={persona.avatar_url} alt={persona.name} className="w-12 h-12 border border-black/10 grayscale" />
                    <div>
                      <div className="font-serif font-bold text-xl leading-tight">{persona.name}</div>
                      <div className="text-[9px] font-mono uppercase text-blue-600 font-bold">{persona.occupation}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemove(persona.id)}
                    className="absolute top-4 right-4 text-black/20 hover:text-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section, idx) => (
              <tr key={section.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                <td className="p-6 border-r border-black/10 font-mono text-[10px] uppercase font-bold text-black/40">{section.label}</td>
                {personas.map(persona => (
                  <td key={persona.id} className="p-6 border-r border-black/10 last:border-r-0">
                    {section.isList ? (
                      <ul className="space-y-3">
                        {(section.accessor(persona) as string[]).map((item, i) => (
                          <li key={i} className="flex gap-3 items-start group">
                            <span className="mt-1 shrink-0">
                              {section.label === 'Frustrations' ? (
                                <AlertCircle size={10} className="text-red-500" />
                              ) : (
                                <Check size={10} className="text-green-500" />
                              )}
                            </span>
                            <span className="text-[11px] leading-relaxed font-sans group-hover:text-black transition-colors text-black/70 italic">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] leading-relaxed font-sans text-black/80">
                        {section.accessor(persona) as string}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
