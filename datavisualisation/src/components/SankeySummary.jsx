import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const pageNames = [
    'Parité',
    'Hiérarchie',
    'Films',
    'Genre',
    'Évolution',
    'Spécialisation',
    'Thématiques'
];

const metrics = [
    'H/F ratio',
    'Audience',
    'Diffusion',
    'Répartition',
    'Tendance',
    'Spécialisation'
];

const summaryItems = [
    { title: 'Parité', value: '40 % F / 60 % H' },
    { title: 'Hiérarchie', value: '12 chaînes, 4 groupes' },
    { title: 'Films', value: '85 films, 5 pays' },
    { title: 'Genre', value: 'Répartition H/F et thèmes' },
    { title: 'Évolution', value: '21 ans, 20 thèmes' },
    { title: 'Spécialisation', value: '14 thèmes, 10 chaînes' }
];

export default function SankeySummary({ activeIndex }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const width = container.clientWidth || 900;
        const height = 320;

        const svg = d3.select(container)
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', '100%');

        const graph = {
            nodes: pageNames.concat(metrics).map(name => ({ name })),
            links: [
                { source: 0, target: 6, value: 82 },
                { source: 1, target: 7, value: 68 },
                { source: 2, target: 8, value: 73 },
                { source: 3, target: 9, value: 77 },
                { source: 4, target: 10, value: 84 },
                { source: 5, target: 11, value: 65 },
                { source: 6, target: 9, value: 55 }
            ]
        };

        const sankeyGenerator = sankey()
            .nodeWidth(20)
            .nodePadding(18)
            .extent([[20, 20], [width - 20, height - 20]]);

        const sankeyData = sankeyGenerator({
            nodes: graph.nodes.map(d => Object.assign({}, d)),
            links: graph.links.map(d => Object.assign({}, d))
        });

        const link = svg.append('g')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.45)
            .selectAll('path')
            .data(sankeyData.links)
            .join('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', '#60a5fa')
            .attr('stroke-width', d => Math.max(1, d.width))
            .style('mix-blend-mode', 'multiply');

        const node = svg.append('g')
            .selectAll('g')
            .data(sankeyData.nodes)
            .join('g');

        node.append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => Math.max(12, d.y1 - d.y0))
            .attr('width', d => Math.max(16, d.x1 - d.x0))
            .attr('rx', 8)
            .attr('fill', d => {
                if (d.index === activeIndex) return '#1d4ed8';
                if (d.index < pageNames.length) return '#60a5fa';
                return '#0ea5e9';
            })
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 1);

        node.append('text')
            .attr('x', d => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
            .text(d => d.name)
            .style('font-family', 'var(--font-main)')
            .style('font-size', '0.82rem')
            .style('fill', '#1d4ed8');

    }, [activeIndex]);

    return (
        <div className="sankey-summary-wrapper">
            <div className="sankey-summary-card">
                <div className="sankey-summary-header">
                    <div>
                        <h3>Résumé statistique</h3>
                        <p>Visualisation Sankey synthétique des indicateurs clés pour chaque page.</p>
                    </div>
                    <div className="sankey-active-chip">Page active : {pageNames[activeIndex] || 'Parité'}</div>
                </div>
                <div ref={containerRef} className="sankey-chart-container" />
                <div className="sankey-stats-grid">
                    {summaryItems.map(item => (
                        <div key={item.title} className="sankey-stat-item">
                            <span>{item.title}</span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
