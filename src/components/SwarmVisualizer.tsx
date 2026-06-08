import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { AgentCard, SwarmTask } from '../types';
import { SWARM_RULES, SwarmConnection } from '../data/interactionRules';
import { ProductivityHeatmap } from './ProductivityHeatmap.tsx';
import { motion } from 'motion/react';
import { Share2, Clock, Info, Activity } from 'lucide-react';

interface Props {
  agents: AgentCard[];
  tasks: SwarmTask[];
  relationships?: any[]; // Using any[] for now or fetch and import type
}

export const SwarmVisualizer: React.FC<Props> = ({ agents, tasks, relationships = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [timeStep, setTimeStep] = React.useState(100);

  // Derive connections based on ecosystem dynamics
  const connections = useMemo(() => {
    const links: SwarmConnection[] = [];
    
    // 1. Pheromone Signals (Based on recent successful tasks)
    tasks.filter(t => t.status === 'done').forEach(task => {
      const ids = task.assigned_agents;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          links.push({
            source: ids[i],
            target: ids[j],
            type: 'pheromone',
            strength: (task.confidence || 0.8) * 1.5
          });
        }
      }
    });

    // 2. Persistent Trust (From Firestore Relationships)
    relationships.forEach(rel => {
      links.push({
        source: rel.sourceId,
        target: rel.targetId,
        type: 'trust',
        strength: rel.trust || 0.5
      });
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
    if (!svgRef.current || agents.length === 0) return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(agents as any)
      .force("link", d3.forceLink(connections).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => 40 + (d.reputation || 50) / 4));

    const g = svg.append("g");

    // Influence Heatmap background
    const heatmap = g.append("g").attr("class", "influence-map");
    
    // Draw links with dynamic gradients/dash based on type
    const link = g.append("g")
      .selectAll("line")
      .data(connections)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'pheromone' ? '#FBBF24' : '#60A5FA')
      .attr("stroke-opacity", (d: any) => d.strength * 0.5)
      .attr("stroke-width", (d: any) => d.strength * 4)
      .attr("stroke-dasharray", (d: any) => d.type === 'trust' ? "2,2" : "0");

    // Citizen Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(agents)
      .join("g")
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
        .on("start", (event, d) => {
           if (!event.active) simulation.alphaTarget(0);
           d.fx = null;
           d.fy = null;
        }));

    // Institution Frame
    node.append("circle")
      .attr("r", (d: any) => 25 + (d.reputation || 50) / 4)
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#000' : '#fff')
      .attr("stroke", (d: any) => {
         const stage = d.lifecycle_stage;
         if (stage === 'leadership') return '#FBBF24';
         if (stage === 'mentorship') return '#A78BFA';
         return '#000';
      })
      .attr("stroke-width", (d: any) => d.lifecycle_stage === 'leadership' ? 4 : 2);

    // Identity Label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#fff' : '#000')
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "7px")
      .attr("font-weight", "bold")
      .text((d: any) => d.persona_metadata?.name.split(' ')[0] || d.role.slice(0, 8));

    // DNA Pulse
    node.append("circle")
      .attr("r", 5)
      .attr("cy", (d: any) => -30 - (d.reputation || 50) / 4)
      .attr("fill", "#60A5FA")
      .attr("opacity", 0.6)
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", "2;6;2")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [agents, connections]);

  return (
    <div className="space-y-12">
      {/* Network Graph Section */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-black pb-2">
          <div className="flex items-center gap-2">
            <Share2 size={16} />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Civitas Trust Network // Emerging Sociodynamics</h3>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Pheromones
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
               <div className="w-3 h-[1px] bg-blue-400 border-dashed border-b"></div> Persistent Trust
             </div>
          </div>
        </div>
        <div className="bg-[#f0f0f0] border-4 border-black editorial-shadow p-0 relative h-[450px] overflow-hidden">
          <svg 
            ref={svgRef} 
            width="800" 
            height="450" 
            viewBox="0 0 800 450" 
            className="w-full h-full bg-[#fdfdfd]"
          />
          <div className="absolute top-4 left-4 inline-block bg-black text-white text-[8px] font-mono p-2 uppercase tracking-tight">
            Ecosystem Observatory v3.0.0 // Emergence Feed
          </div>
          <div className="absolute bottom-4 right-4 bg-white/90 p-4 border border-black editorial-shadow-sm max-w-xs">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Time-Step Analysis</span>
                <span className="text-[10px] font-mono">{timeStep}% Synced</span>
             </div>
             <input 
               type="range" 
               className="w-full h-1 bg-black/10 appearance-none cursor-pointer accent-black"
               value={timeStep}
               onChange={e => setTimeStep(Number(e.target.value))}
             />
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
