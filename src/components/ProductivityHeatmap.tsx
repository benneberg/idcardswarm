import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SwarmTask } from '../types';

interface Props {
  tasks: SwarmTask[];
}

export const ProductivityHeatmap: React.FC<Props> = ({ tasks }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || tasks.length === 0) return;

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data: Tasks per hour/day vs Complexity
    // For now, let's map Complexity (Y) vs Index/Time (X)
    const data = tasks.filter(t => t.status === 'done').map((t, i) => ({
      x: i,
      y: t.complexity || Math.floor(Math.random() * 10) + 1,
      value: 1
    }));

    const x = d3.scaleLinear()
      .domain([0, Math.max(10, data.length)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0]);

    // Add Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "8px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "8px");

    // Add Labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "10px")
      .attr("text-transform", "uppercase")
      .text("Operational Cycles →");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "10px")
      .attr("text-transform", "uppercase")
      .text("Task Complexity Index");

    // Heat dots
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d: any) => x(d.x))
      .attr("cy", (d: any) => y(d.y))
      .attr("r", 15)
      .attr("fill", "#1a1a1a")
      .attr("opacity", 0.1)
      .attr("filter", "blur(8px)");

    g.selectAll(".point")
      .data(data)
      .join("rect")
      .attr("x", (d: any) => x(d.x) - 4)
      .attr("y", (d: any) => y(d.y) - 4)
      .attr("width", 8)
      .attr("height", 8)
      .attr("fill", "black")
      .attr("opacity", 0.8)
      .attr("class", "point");

  }, [tasks]);

  return (
    <div className="bg-white border-4 border-black p-8 editorial-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-serif font-bold uppercase tracking-tight">Productivity Heatmap</h3>
          <p className="font-mono text-[10px] uppercase opacity-40">Mapping Yield vs. Structural Complexity</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg ref={svgRef} width="800" height="300" viewBox="0 0 800 300" className="mx-auto" />
      </div>
    </div>
  );
};
