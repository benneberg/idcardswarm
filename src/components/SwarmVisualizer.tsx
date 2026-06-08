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
}

export const SwarmVisualizer: React.FC<Props> = ({ agents, tasks }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Derive connections based on interaction rules
  const connections = useMemo(() => {
    const links: SwarmConnection[] = [];
    
    // 1. Proximity Links (Shared Tasks)
    tasks.forEach(task => {
      const ids = task.assigned_agents;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          links.push({
            source: ids[i],
            target: ids[j],
            type: 'collaboration',
            strength: 0.8
          });
        }
      }
    });

    // 2. Trust Links (Shared Motivations)
    agents.forEach((a1, i) => {
      agents.slice(i + 1).forEach(a2 => {
        const sharedMotivations = a1.persona_metadata?.motivations.filter(m => 
          a2.persona_metadata?.motivations.includes(m)
        ) || [];
        
        if (sharedMotivations.length > 0) {
          links.push({
            source: a1.id,
            target: a2.id,
            type: 'trust',
            strength: 0.2 + (sharedMotivations.length * 0.2)
          });
        }
      });
    });

    return links;
  }, [agents, tasks]);

  useEffect(() => {
    if (!svgRef.current || agents.length === 0) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(agents as any)
      .force("link", d3.forceLink(connections).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    const g = svg.append("g");

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(connections)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'collaboration' ? '#000' : '#ccc')
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => d.strength * 3)
      .attr("stroke-dasharray", (d: any) => d.type === 'trust' ? "4,4" : "0");

    // Draw nodes
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
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("rect")
      .attr("width", 80)
      .attr("height", 30)
      .attr("x", -40)
      .attr("y", -15)
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#1a1a1a' : '#f2efe9')
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", (d: any) => d.mode === 'simulator' ? '#fff' : '#000')
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .text((d: any) => d.persona_metadata?.name || d.role.slice(0, 10));

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
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Influence Network // Real-time</h3>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
               <div className="w-3 h-[1px] bg-black"></div> Collaboration
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
               <div className="w-3 h-[1px] bg-zinc-300 border-dashed border-b"></div> Motivation Alignment
             </div>
          </div>
        </div>
        <div className="bg-[#fdfdfd] border-4 border-black editorial-shadow p-4 relative h-[450px] overflow-hidden flex items-center justify-center">
          <svg 
            ref={svgRef} 
            width="800" 
            height="400" 
            viewBox="0 0 800 400" 
            className="w-full h-full"
          />
          <div className="absolute top-4 left-4 inline-block bg-black text-white text-[8px] font-mono p-2 uppercase tracking-tight">
            Force-Directed System v1.0.4
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
