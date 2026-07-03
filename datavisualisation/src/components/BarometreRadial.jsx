import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BarometreRadial({ data }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !data || !data.radial || data.radial.length === 0) return;
        
        container.innerHTML = '';
        
        const chartData = data.radial;
        const chaines = data.chaines;

        const width = container.clientWidth || 700;
        const height = container.clientHeight || 700;
        const innerRadius = 150;
        const outerRadius = Math.min(width, height) / 2 - 40;

        const svg = d3.select(container).append('svg')
            .attr('viewBox', [-width / 2, -height / 2, width, height])
            .attr('width', width)
            .attr('height', height);

        const x = d3.scaleBand()
            .domain(chartData.map(d => d.theme))
            .range([0, 2 * Math.PI])
            .align(0);

        const yScale = (typeof d3.scaleRadial === 'function') ? d3.scaleRadial() : d3.scaleLinear();
        const y = yScale
            .domain([0, d3.max(chartData, d => d.total)])
            .range([innerRadius, outerRadius]);

        const arc = d3.arc()
            .innerRadius(d => y(d[0]))
            .outerRadius(d => y(d[1]))
            .startAngle(d => x(d.data.theme))
            .endAngle(d => x(d.data.theme) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius);

        const series = d3.stack().keys(chaines)(chartData);
        
        const palette = ['#4e79a7','#f28e2c','#e15759','#76b7b2','#59a14f','#edc949','#af7aa1','#ff9da7','#9c755f','#bab0ab'];
        const color = d3.scaleOrdinal(window.CUSTOM_PALETTE || palette).domain(chaines);

        const tooltip = d3.select(container).append('div')
            .style('position', 'absolute')
            .style('opacity', 0)
            .style('background', 'var(--bg-card)')
            .style('border', '1px solid var(--accent-ui)')
            .style('padding', '10px')
            .style('border-radius', '8px')
            .style('color', 'var(--text-main)')
            .style('pointer-events', 'none')
            .style('z-index', 100);

        svg.append('g')
            .selectAll('g')
            .data(series)
            .join('g')
            .attr('fill', d => color(d.key))
            .selectAll('path')
            .data(d => d.map(item => { item.key = d.key; return item; }))
            .join('path')
            .attr('d', arc)
            .style('stroke', 'var(--bg-card)')
            .style('stroke-width', '1px')
            .on('mouseover', function(event, d) {
                d3.selectAll('path').style('opacity', 0.25);
                d3.select(this).style('opacity', 1);
                const coords = d3.pointer(event, container);
                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`<strong>${d.data.theme}</strong><br>${d.key}: ${(d[1]-d[0]).toFixed(0)} s`)
                    .style('left', `${coords[0] + width/2 + 15}px`)
                    .style('top', `${coords[1] + height/2 - 28}px`);
            })
            .on('mousemove', function(event) {
                const coords = d3.pointer(event, container);
                tooltip.style('left', `${coords[0] + width/2 + 15}px`)
                    .style('top', `${coords[1] + height/2 - 28}px`);
            })
            .on('mouseout', function() {
                d3.selectAll('path').style('opacity', 1);
                tooltip.transition().duration(500).style('opacity', 0);
            });

        const labelGroup = svg.append('g').selectAll('g')
            .data(chartData)
            .join('g')
            .attr('text-anchor', d => (x(d.theme) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? 'start' : 'end')
            .attr('transform', d => `
                rotate(${((x(d.theme) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                translate(${outerRadius + 15},0)
            `);

        labelGroup.append('text')
            .attr('transform', d => (x(d.theme) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? '' : 'rotate(180)')
            .text(d => d.theme.length > 24 ? d.theme.substring(0, 24) + '...' : d.theme)
            .style('font-size', '11px')
            .style('fill', 'var(--text-main)')
            .style('font-weight', '600')
            .style('pointer-events', 'none');

    }, [data]);

    const chaines = (data && data.chaines) || [];
    const colors = ['#4e79a7','#f28e2c','#e15759','#76b7b2','#59a14f'];

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '24px' }}>
            <aside style={{ minWidth: '220px', padding: '20px', background: 'rgba(255,255,255,0.78)', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.08)', alignSelf: 'flex-start' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>Légende</h3>
                <p style={{ margin: '0 0 18px', color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.92rem' }}>
                    Les anneaux montrent la distribution par chaîne. Survolez un segment pour obtenir le détail des durées de parole.</p>
                <div style={{ display: 'grid', gap: '10px' }}>
                    {chaines.map((chaine, index) => (
                        <div key={chaine} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: colors[index % colors.length] }} />
                            <span style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '600' }}>{chaine}</span>
                        </div>
                    ))}
                </div>
            </aside>
            <div ref={containerRef} style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }} />
        </div>
    );
}
