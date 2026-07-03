import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Streamgraph({ data }) {
    const containerRef = useRef(null);
    const themes = (data && data.themes) || [];

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !data || !data.streamgraph || data.streamgraph.length === 0) return;

        container.innerHTML = '';

        const chartData = data.streamgraph;
        const years = chartData.map(d => d.year);

        const width = container.clientWidth || 900;
        const height = container.clientHeight || 420;
        const margin = { top: 20, right: 30, bottom: 30, left: 50 };

        const series = d3.stack()
            .keys(themes)
            .offset(d3.stackOffsetWiggle)
            (chartData);

        const svg = d3.select(container).append('svg')
            .attr('viewBox', [0, 0, width, height])
            .style('max-width', '100%')
            .style('height', 'auto');

        const x = d3.scaleLinear()
            .domain(d3.extent(years))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
            .range([height - margin.bottom, margin.top]);

        const palette = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
        const color = d3.scaleOrdinal(window.CUSTOM_PALETTE || palette).domain(themes);

        const area = d3.area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
            .curve(d3.curveBasis);

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
            .selectAll('path')
            .data(series)
            .join('path')
            .attr('fill', d => color(d.key))
            .attr('d', area)
            .style('opacity', 0)
            .transition()
            .duration(1500)
            .ease(d3.easeCubicOut)
            .style('opacity', 0.9);

        svg.selectAll('path')
            .on('mouseover', function (event, d) {
                d3.select(this).style('opacity', 1).style('stroke', 'var(--text-main)').style('stroke-width', 1);
                const coords = d3.pointer(event, container);
                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`<strong>${d.key}</strong>`)
                    .style('left', `${coords[0] + 15}px`)
                    .style('top', `${coords[1] - 28}px`);
            })
            .on('mousemove', function (event) {
                const coords = d3.pointer(event, container);
                tooltip.style('left', `${coords[0] + 15}px`)
                    .style('top', `${coords[1] - 28}px`);
            })
            .on('mouseout', function () {
                d3.select(this).style('opacity', 0.9).style('stroke', 'none');
                tooltip.transition().duration(500).style('opacity', 0);
            });

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format('d')))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line').clone()
                .attr('y2', -height + margin.top + margin.bottom)
                .attr('stroke-opacity', 0.1))
            .selectAll('text')
            .style('fill', 'var(--text-main)');

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(0))
            .call(g => g.select('.domain').remove());

    }, [data, themes]);

    const palette = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div ref={containerRef} style={{ width: '100%', flex: 1, minHeight: '320px', position: 'relative' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px', padding: '0 16px' }}>
                {themes.map((theme, index) => (
                    <div key={theme} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.75)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: palette[index % palette.length] }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{theme}</span>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '14px', padding: '0 16px', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                <strong>Interprétation :</strong> chaque flux montre l’évolution d’un thème dans le temps. Survolez une couche pour isoler ce thème et mieux comprendre sa progression au fil des années.
            </div>
        </div>
    );
}
