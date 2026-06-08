import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  capabilityVector: Record<string, number>;
}

export const CapabilityRadar: React.FC<Props> = ({ capabilityVector }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const data = Object.entries(capabilityVector).map(([axis, value]) => ({
      axis: axis.replace('_', ' ').toUpperCase(),
      value: value
    }));

    const width = 300;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const angleStep = (Math.PI * 2) / data.length;

    // Scales
    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    // Draw background circles
    const levels = 5;
    g.selectAll(".grid-circle")
      .data(d3.range(1, levels + 1))
      .enter()
      .append("circle")
      .attr("class", "grid-circle")
      .attr("r", (d: number) => (radius / levels) * d)
      .attr("fill", "none")
      .attr("stroke", "#eee")
      .attr("stroke-dasharray", "2,2");

    // Draw axes
    const axis = g.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: any, i: number) => rScale(1) * Math.cos(angleStep * i - Math.PI / 2))
      .attr("y2", (d: any, i: number) => rScale(1) * Math.sin(angleStep * i - Math.PI / 2))
      .attr("stroke", "#ddd")
      .attr("stroke-width", "1px");

    // Axis labels
    axis.append("text")
      .attr("class", "legend")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d: any, i: number) => rScale(1.15) * Math.cos(angleStep * i - Math.PI / 2))
      .attr("y", (d: any, i: number) => rScale(1.15) * Math.sin(angleStep * i - Math.PI / 2))
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("fill", "#666")
      .text((d: any) => d.axis);

    // Radar line generator
    const radarLine = d3.lineRadial<any>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleStep)
      .curve(d3.curveLinearClosed);

    // Draw the radar area
    g.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", "black")
      .attr("fill-opacity", 0.1)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Draw data points
    g.selectAll(".radar-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("cx", (d: any, i: number) => rScale(d.value) * Math.cos(angleStep * i - Math.PI / 2))
      .attr("cy", (d: any, i: number) => rScale(d.value) * Math.sin(angleStep * i - Math.PI / 2))
      .attr("r", 4)
      .attr("fill", "black");

  }, [capabilityVector]);

  return (
    <div className="flex justify-center items-center bg-stone-50 border border-black/5 p-4">
      <svg ref={svgRef} width="300" height="300" viewBox="0 0 300 300" />
    </div>
  );
};
