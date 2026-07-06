import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { AgentCard, SwarmTask } from '../types';
import { SWARM_RULES, SwarmConnection } from '../data/interactionRules';
import { ProductivityHeatmap } from './ProductivityHeatmap.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Clock, Info, Activity, LayoutGrid, Network, BarChart3, Fingerprint } from 'lucide-react';

interface Props {
  agents: AgentCard[];
  tasks: SwarmTask[];
  relationships?: any[]; // Using any[] for now or fetch and import type
}

type ViewMode = 'graph' | 'cluster' | 'heatmap';

export const SwarmVisualizer: React.FC<Props> = ({ agents = [], tasks = [], relationships = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [timeStep, setTimeStep] = React.useState(100);
  const [hoveredAgent, setHoveredAgent] = useState<AgentCard | null>(null);

  // Derive connections based on ecosystem dynamics
  const connections = useMemo(() => {
    const links: SwarmConnection[] = [];
    const agentIds = new Set(agents.map(a => a.id));
    
    // 1. Pheromone Signals (Based on recent successful tasks)
    tasks.filter(t => t.status === 'done').forEach(task => {
      const ids = task.assigned_agents;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          if (agentIds.has(ids[i]) && agentIds.has(ids[j])) {
            links.push({
              source: ids[i],
              target: ids[j],
              type: 'pheromone',
              strength: (task.confidence || 0.8) * 1.5
            });
          }
        }
      }
    });

    // 2. Persistent Trust (From Firestore Relationships)
    relationships.forEach(rel => {
      const sId = rel.sourceId || rel.source;
      const tId = rel.targetId || rel.target;
      if (sId && tId && agentIds.has(sId) && agentIds.has(tId)) {
        links.push({
          source: sId,
          target: tId,
          type: 'trust',
          strength: rel.trust || rel.strength || 0.5
        });
      }
    });

    // 3. Spontaneous trust based on personality (for visual flair/discovery)
    if (relationships.length === 0) {
      agents.forEach((a1, i) => {
        agents.slice(i + 1).forEach(a2 => {
          const p1 = a1.persona_metadata?.personality;
          const p2 = a2.persona_metadata?.personality;
          
          if (p1 && p2) {
            const similarity = 1 - (
              Math.abs(p1.openness - p2.openness) + 
              Math.abs(p1.conscientiousness - p2.conscientiousness)
            ) / 200;

            if (similarity > 0.8) {
              links.push({
                source: a1.id,
                target: a2.id,
                type: 'trust',
                strength: similarity * 0.5
              });
            }
          }
        });
      });
    }

    return links;
  }, [agents, tasks, relationships]);

  useEffect(() => {
    if (!svgRef.current || agents.length === 0 || viewMode === 'heatmap') return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Deep clone nodes and links to keep D3 and React state pure
    const nodes = agents.map(a => ({ ...a }));
    const links = connections.map(l => ({ ...l }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(viewMode === 'graph' ? -400 : -100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    if (viewMode === 'graph') {
      simulation.force("link", d3.forceLink(links).id((d: any) => d.id).distance(120));
    } else if (viewMode === 'cluster') {
      const distinctOccupations: string[] = Array.from(new Set(nodes.map(a => a.persona_metadata?.occupation || a.role)));
      const occupationScale = d3.scalePoint<string>()
        .domain(distinctOccupations)
        .range([100, width - 100]);

      simulation.force("x", d3.forceX().x((d: any) => occupationScale(d.persona_metadata?.occupation || d.role) || width / 2).strength(0.5));
    }

    const g = svg.append("g");

    // Draw links
    if (viewMode === 'graph') {
      g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", (d: any) => d.type === 'pheromone' ? '#FBBF24' : '#60A5FA')
        .attr("stroke-opacity", (d: any) => d.strength * 0.4)
        .attr("stroke-width", (d: any) => d.strength * 3)
        .attr("stroke-dasharray", (d: any) => d.type === 'trust' ? "3,3" : "0");
    }

    // Citizen Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .on("mouseover", (event, d: any) => setHoveredAgent(d))
      .on("mouseout", () => setHoveredAgent(null))
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Persona Card Frame
    node.append("rect")
      .attr("x", -30)
      .attr("y", -40)
      .attr("width", 60)
      .attr("height", 80)
      .attr("rx", 2)
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#111' : '#fff')
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("class", "cursor-pointer editorial-shadow-sm");

    // Top Header for card
    node.append("rect")
      .attr("x", -30)
      .attr("y", -40)
      .attr("width", 60)
      .attr("height", 10)
      .attr("fill", (d: any) => {
        const stage = d.lifecycle_stage;
        if (stage === 'leadership') return '#FBBF24';
        if (stage === 'mentorship') return '#A78BFA';
        return '#000';
      });

    // Identity Label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 15)
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#fff' : '#000')
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "6px")
      .attr("font-weight", "bold")
      .text((d: any) => {
        const name = d.persona_metadata?.name.split(' ')[0] || d.role;
        return name.length > 8 ? name.slice(0, 6) + '..' : name;
      });

    // Sub-title
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 25)
      .attr("fill", (d: any) => d.mode === 'simulator' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)')
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "4px")
      .text((d: any) => d.persona_metadata?.occupation.slice(0, 12) || 'IDENTITY');

    // Central Icon/Graphic
    node.append("circle")
      .attr("r", 12)
      .attr("cy", -10)
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#222' : '#f9f9f9')
      .attr("stroke", (d: any) => d.mode === 'simulator' ? '#333' : '#eee');

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("cy", -10)
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#666' : '#999')
      .attr("font-family", "serif")
      .attr("font-size", "10px")
      .attr("font-style", "italic")
      .attr("dy", "3px")
      .text((d: any) => (d.persona_metadata?.name?.[0] || d.role[0]).toUpperCase());

    // Progress Bar (Tech proficiency)
    const techG = node.append("g").attr("transform", "translate(-20, 32)");
    techG.append("rect").attr("width", 40).attr("height", 1.5).attr("fill", "rgba(0,0,0,0.1)");
    techG.append("rect")
      .attr("width", (d: any) => (d.persona_metadata?.tech_proficiency || 50) * 0.4)
      .attr("height", 1.5)
      .attr("fill", "#60A5FA");

    simulation.on("tick", () => {
      if (viewMode === 'graph') {
        g.selectAll("line")
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);
      }
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [agents, connections, viewMode]);

  return (
    <div className="space-y-12">
      {/* Network Graph Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-black pb-4 gap-4">
          <div className="flex items-center gap-4">
            <Fingerprint size={20} className="text-blue-500" />
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Civitas Observatory</h3>
              <p className="text-[9px] font-mono opacity-40 uppercase tracking-tighter">Sociodynamic Visualizer // v3.2.0</p>
            </div>
          </div>
          
          <div className="flex p-1 bg-zinc-100 border border-black/5 rounded-sm">
            <button 
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${viewMode === 'graph' ? 'bg-black text-white' : 'opacity-40 hover:opacity-100'}`}
            >
              <Network size={14} /> Network
            </button>
            <button 
              onClick={() => setViewMode('cluster')}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${viewMode === 'cluster' ? 'bg-black text-white' : 'opacity-40 hover:opacity-100'}`}
            >
              <LayoutGrid size={14} /> Swarm
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${viewMode === 'heatmap' ? 'bg-black text-white' : 'opacity-40 hover:opacity-100'}`}
            >
              <Activity size={14} /> Yield
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-[#fdfdfd] border-4 border-black editorial-shadow relative h-[450px] overflow-hidden">
            <AnimatePresence mode="wait">
              {viewMode !== 'heatmap' ? (
                <motion.svg 
                  key="viz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={svgRef} 
                  width="800" 
                  height="450" 
                  viewBox="0 0 800 450" 
                  className="w-full h-full bg-[#fdfdfd] cursor-grab active:cursor-grabbing"
                />
              ) : (
                <motion.div
                  key="heat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full p-8 overflow-y-auto"
                >
                  <ProductivityHeatmap tasks={tasks} />
                </motion.div>
              )}
            </AnimatePresence>

            {hoveredAgent && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-white border-2 border-black p-4 editorial-shadow-sm z-50 pointer-events-none flex gap-6 items-center"
              >
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif italic text-2xl">
                  {hoveredAgent.persona_metadata?.name?.[0] || '?' }
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold font-mono uppercase">{hoveredAgent.persona_metadata?.name || hoveredAgent.role}</h4>
                    <span className="text-[8px] font-mono bg-blue-100 text-blue-800 px-2 uppercase py-0.5">{hoveredAgent.mode}</span>
                  </div>
                  <p className="text-[10px] opacity-60 font-serif italic line-clamp-1">{hoveredAgent.persona_metadata?.bio}</p>
                </div>
                <div className="flex gap-8 text-right pr-4">
                  <div>
                    <p className="text-[8px] font-mono uppercase opacity-40">Tech Proficiency</p>
                    <p className="font-mono text-sm font-bold">{hoveredAgent.persona_metadata?.tech_proficiency || 50}%</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-mono uppercase opacity-40">Reputation</p>
                    <p className="font-mono text-sm font-bold">{hoveredAgent.reputation || 50}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="absolute top-4 left-4 bg-white/80 border border-black p-2 text-[8px] font-mono uppercase tracking-widest pointer-events-none">
              Projection: {viewMode.toUpperCase()} // REAL-TIME SYNC
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-stone-50 border-2 border-black p-6 editorial-shadow-sm h-full">
              <div className="flex items-center gap-2 mb-6 border-b border-black pb-2">
                <BarChart3 size={14} />
                <h4 className="text-[10px] font-mono uppercase font-bold tracking-[0.2em]">Live Analysis</h4>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                   <p className="text-[8px] font-mono uppercase opacity-40">Cluster Dynamics</p>
                   <div className="flex justify-between items-end">
                      <span className="text-3xl font-serif font-bold italic tracking-tighter">{agents.length}</span>
                      <span className="text-[10px] font-mono pb-1 opacity-60">Citizen Nodes</span>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                   <div className="flex justify-between text-[10px] font-mono uppercase">
                      <span>Trust Density</span>
                      <span className="font-bold">84%</span>
                   </div>
                   <div className="w-full h-1 bg-black/5">
                      <div className="h-full bg-black w-[84%]" />
                   </div>
                </div>

                <div className="pt-8 space-y-4">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest border-b border-black/5 pb-2">Legend</p>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 border border-black/10" />
                    <span className="text-[9px] font-mono uppercase opacity-60">High-Activity Bond</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 border border-black/10" />
                    <span className="text-[9px] font-mono uppercase opacity-60">Persistent trust</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-white border-2 border-black" />
                    <span className="text-[9px] font-mono uppercase opacity-60">Persona Template</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-2">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-mono uppercase font-bold tracking-widest opacity-40">Flux Frequency</span>
                    <span className="text-[10px] font-mono">{timeStep}Hz</span>
                 </div>
                 <input 
                   type="range" 
                   className="w-full h-1 bg-black/10 appearance-none cursor-pointer accent-black"
                   value={timeStep}
                   onChange={e => setTimeStep(Number(e.target.value))}
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6 border-b border-black pb-2">
          <Activity size={16} />
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Productivity Yield Analysis</h3>
        </div>
        <ProductivityHeatmap tasks={tasks} />
      </section>

      {/* Rules & Timeline Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-black pb-2">
            <Info size={16} />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Protocol Parameters</h3>
          </div>
          <div className="space-y-4">
            {SWARM_RULES.map(rule => (
              <div key={rule.id} className="border-l-2 border-black pl-4 group hover:bg-black/5 p-2 transition-colors">
                <p className="text-[10px] font-mono uppercase font-bold opacity-40 group-hover:opacity-100">{rule.name}</p>
                <p className="text-sm font-serif italic mb-1">{rule.description}</p>
                <p className="text-[9px] font-mono text-zinc-400">Trigger: {rule.factor}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-black pb-2">
            <Clock size={16} />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Transaction History</h3>
          </div>
          <div className="space-y-6">
            {tasks.length > 0 ? tasks.slice(0, 5).map(task => (
              <div key={task.id} className="relative pl-8 pb-4 border-l border-black/10 last:border-0">
                <div className="absolute left-[-5px] top-0 w-2 h-2 bg-black rounded-full" />
                <p className="text-[10px] font-mono uppercase opacity-40">{new Date(task.createdAt).toLocaleTimeString()}</p>
                <p className="text-xs font-bold leading-tight underline decoration-1">{task.type}</p>
                <p className="text-[11px] opacity-70 mt-1 line-clamp-1">{task.description}</p>
                <div className="flex gap-1 mt-2">
                  {task.assigned_agents.map(id => (
                    <span key={id} className="bg-black text-white text-[8px] px-1 font-mono">{id.slice(0, 4)}</span>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-center py-12 border-2 border-dashed border-black/10">
                <p className="font-serif italic text-sm opacity-40">Awaiting swarm activation...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
