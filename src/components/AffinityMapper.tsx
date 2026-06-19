
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, GripVertical, Hash, Bookmark } from 'lucide-react';

interface AffinityNote {
  id: string;
  content: string;
  category?: string;
  source?: string;
}

interface AffinityTheme {
  id: string;
  name: string;
  notes: AffinityNote[];
}

export const AffinityMapper: React.FC = () => {
  const [themes, setThemes] = useState<AffinityTheme[]>([
    { id: 'theme_1', name: 'UI/UX Friction', notes: [] },
    { id: 'theme_2', name: 'Strategic Intelligence', notes: [] },
  ]);
  const [inputNote, setInputNote] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

  const addNote = () => {
    if (!inputNote.trim()) return;
    const newNote: AffinityNote = {
      id: `note_${Math.random().toString(36).substr(2, 9)}`,
      content: inputNote,
      category: themes.find(t => t.id === selectedTheme)?.name
    };
    
    setThemes(prev => prev.map(t => 
      t.id === selectedTheme ? { ...t, notes: [...t.notes, newNote] } : t
    ));
    setInputNote('');
  };

  const removeNote = (themeId: string, noteId: string) => {
    setThemes(prev => prev.map(t => 
      t.id === themeId ? { ...t, notes: t.notes.filter(n => n.id !== noteId) } : t
    ));
  };

  const addTheme = () => {
    const name = prompt('Enter Theme Name:');
    if (!name) return;
    setThemes(prev => [...prev, {
      id: `theme_${Math.random().toString(36).substr(2, 9)}`,
      name,
      notes: []
    }]);
  };

  return (
    <div className="bg-stone-50 border-2 border-black editorial-shadow p-8 flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-xl">
          <h3 className="text-4xl font-serif font-bold tracking-tight mb-4">Affinity Synthesis</h3>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 leading-relaxed italic">
            Cluster qualitative data points into emergent behavioral themes.
          </p>
        </div>

        <div className="w-full md:w-96 bg-white border-2 border-black p-6 editorial-shadow-sm">
          <div className="text-[10px] font-mono uppercase font-bold mb-4 opacity-40">Capture Insight</div>
          <textarea 
            value={inputNote}
            onChange={(e) => setInputNote(e.target.value)}
            placeholder="Type a quote or trait observed..."
            className="w-full h-24 bg-stone-50 border border-black/10 p-3 font-sans text-xs focus:border-black outline-none mb-4 resize-none"
          />
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
            {themes.map(t => (
              <button 
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`px-3 py-1 text-[8px] font-mono uppercase tracking-widest border shrink-0 transition-all ${
                  selectedTheme === t.id ? 'bg-black text-white border-black' : 'border-black/20 opacity-40 hover:opacity-100'
                }`}
              >
                {t.name}
              </button>
            ))}
            <button 
              onClick={addTheme}
              className="px-3 py-1 text-[8px] font-mono uppercase border border-dashed border-black/40 opacity-40 hover:opacity-100"
            >
              + Add Theme
            </button>
          </div>
          <button 
            onClick={addNote}
            className="w-full bg-black text-white py-2 font-mono text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus size={12} /> Map Insight
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
        <AnimatePresence>
          {themes.map((theme) => (
            <motion.div 
              key={theme.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-black/10 p-6 editorial-shadow-sm flex flex-col min-h-[300px]"
            >
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-black">
                <div className="flex items-center gap-2">
                  <Bookmark size={14} className="text-blue-600" />
                  <h4 className="font-serif font-bold italic text-lg">{theme.name}</h4>
                </div>
                <span className="text-[10px] font-mono opacity-30">{theme.notes.length}</span>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {theme.notes.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-12">
                     <Hash size={32} strokeWidth={1} className="mb-4" />
                     <p className="text-[10px] font-mono uppercase">Empty Cluster</p>
                  </div>
                )}
                <AnimatePresence>
                  {theme.notes.map((note) => (
                    <motion.div 
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="group bg-stone-50 border-l-4 border-black p-4 relative"
                    >
                      <button 
                        onClick={() => removeNote(theme.id, note.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-black/20 hover:text-black transition-all"
                      >
                        <X size={12} />
                      </button>
                      <div className="flex gap-3">
                         <GripVertical size={12} className="opacity-10 shrink-0 mt-1" />
                         <p className="text-[11px] leading-relaxed italic text-black/80 font-sans">
                           "{note.content}"
                         </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
