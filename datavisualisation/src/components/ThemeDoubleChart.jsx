import React, { useEffect, useState } from 'react';
import { csv } from 'd3';

export default function ThemeDoubleChart() {
    const [data, setData] = useState([]);
    const [average, setAverage] = useState(0);

    useEffect(() => {
        csv('/csv/ina-csa-parole-femmes-genreprogramme.csv')
            .then(rawData => {
                let totalWomen = 0;
                let totalMen = 0;

                const processed = rawData
                    .filter(d => d.genre && d.genre.trim() !== '' && d.genre !== 'Non Renseigné')
                    .map(d => {
                        const women = parseFloat(d.women_speech_duration_2020) || 0;
                        const men = parseFloat(d.men_speech_duration_2020) || 0;
                        const total = women + men;
                        const pctF = total > 0 ? (women / total) * 100 : 0;
                        const pctM = total > 0 ? (men / total) * 100 : 0;

                        totalWomen += women;
                        totalMen += men;

                        return {
                            genre: d.genre,
                            women,
                            men,
                            total,
                            pctF,
                            pctM
                        };
                    })
                    .sort((a, b) => a.pctF - b.pctF);

                const overallAvg = (totalWomen / (totalWomen + totalMen)) * 100;
                setAverage(overallAvg);
                setData(processed);
            })
            .catch(console.error);
    }, []);

    if (data.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-main)' }}>
                Chargement des données thématiques...
            </div>
        );
    }

    const rowHeight = 34;
    const padding = { top: 50, right: 28, bottom: 40, left: 170 };
    const chartHeight = data.length * rowHeight + padding.top + padding.bottom;
    const chartWidth = 540;
    const barDepth = 10;

    const xLeftScale = val => {
        const availableWidth = chartWidth - padding.left - padding.right;
        return padding.left + (val / 50) * availableWidth;
    };

    const xRightScale = val => {
        const availableWidth = chartWidth - padding.left - padding.right;
        return padding.left + (val / 100) * availableWidth;
    };

    const yScale = index => padding.top + index * rowHeight;

    const colorWomen = '#FF5A5F';
    const colorMen = '#3B82F6';

    return (
        <div style={{ display: 'flex', gap: '22px', width: '100%', minHeight: '100%', padding: '20px 16px', boxSizing: 'border-box', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 480px', minWidth: '300px', background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '1.22rem', color: 'var(--text-main)', fontWeight: '800' }}>
                    Part de parole féminine par thème
                </h3>
                <p style={{ margin: '0 0 22px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Ce graphique 3D stylisé met en évidence les thèmes où la parole féminine est sous ou au-dessus de la moyenne. Les barres en relief donnent une sensation de profondeur.
                </p>
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
                        <defs>
                            <linearGradient id="womenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FF7A7D" />
                                <stop offset="100%" stopColor="#D93025" />
                            </linearGradient>
                            <linearGradient id="menGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#1D4ED8" />
                            </linearGradient>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
                            </filter>
                        </defs>

                        {[10, 20, 30, 40, 50].map(val => {
                            const xPos = xLeftScale(val);
                            return (
                                <g key={val}>
                                    <line x1={xPos} y1={padding.top - 12} x2={xPos} y2={chartHeight - padding.bottom} stroke="var(--text-muted)" strokeOpacity="0.12" strokeDasharray="3 3" />
                                    <text x={xPos} y={chartHeight - padding.bottom + 20} textAnchor="middle" fill="var(--text-muted)" fontSize="10px" fontWeight="500">{val}%</text>
                                </g>
                            );
                        })}

                        <line x1={xLeftScale(average)} y1={padding.top - 14} x2={xLeftScale(average)} y2={chartHeight - padding.bottom} stroke="var(--text-muted)" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.65" />
                        <text x={xLeftScale(average)} y={padding.top - 22} textAnchor="middle" fill="var(--text-muted)" fontSize="10px" fontWeight="700">moy. {average.toFixed(1)}%</text>

                        {data.map((d, i) => {
                            const yPos = yScale(i);
                            const barWidth = Math.max(0, xLeftScale(Math.min(d.pctF, 50)) - padding.left);
                            const lightWidth = Math.max(0, barWidth - 8);
                            const isAbove = d.pctF >= average;
                            const barColor = isAbove ? 'url(#womenGradient)' : 'url(#menGradient)';

                            return (
                                <g key={d.genre} filter="url(#shadow)">
                                    <text x={padding.left - 18} y={yPos + 14} textAnchor="end" fill="var(--text-main)" fontSize="11px" fontWeight="700">{d.genre}</text>
                                    <path d={`M${padding.left},${yPos} h${barWidth} l${barDepth},-${barDepth} h-${barWidth} Z`} fill={barColor} opacity="0.95" />
                                    <path d={`M${padding.left},${yPos} v-${barDepth} h${barWidth} v${barDepth} Z`} fill="rgba(255,255,255,0.18)" />
                                    <path d={`M${padding.left + barWidth},${yPos} l${barDepth},-${barDepth} v18 l-${barDepth},${barDepth} Z`} fill="rgba(0,0,0,0.08)" />
                                    <rect x={padding.left} y={yPos} width={barWidth} height={18} rx="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                    <text x={padding.left + barWidth + 10} y={yPos + 14} fill="var(--text-main)" fontSize="10.5px" fontWeight="700">{d.pctF.toFixed(1)}%</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            <div style={{ flex: '1 1 480px', minWidth: '300px', background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '1.22rem', color: 'var(--text-main)', fontWeight: '800' }}>
                    Répartition Femmes / Hommes par thème
                </h3>
                <p style={{ margin: '0 0 22px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Les barres empilées donnent un effet 3D. Chaque bande représente le pourcentage de parole féminine et masculine pour un thème donné.
                </p>
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
                        <defs>
                            <linearGradient id="femaleDepth" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FF8A8D" />
                                <stop offset="100%" stopColor="#D6142D" />
                            </linearGradient>
                            <linearGradient id="maleDepth" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#7FB8FF" />
                                <stop offset="100%" stopColor="#1E40AF" />
                            </linearGradient>
                            <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
                            </filter>
                        </defs>

                        {[0, 20, 40, 60, 80, 100].map(val => {
                            const xPos = xRightScale(val);
                            return (
                                <g key={val}>
                                    <line x1={xPos} y1={padding.top - 12} x2={xPos} y2={chartHeight - padding.bottom} stroke="var(--text-muted)" strokeOpacity="0.1" strokeDasharray="3 3" />
                                    <text x={xPos} y={chartHeight - padding.bottom + 20} textAnchor="middle" fill="var(--text-muted)" fontSize="10px" fontWeight="500">{val}%</text>
                                </g>
                            );
                        })}

                        {data.map((d, i) => {
                            const yPos = yScale(i);
                            const widthFemale = Math.max(0, xRightScale(d.pctF) - padding.left);
                            const widthMale = Math.max(0, xRightScale(100) - xRightScale(d.pctF));
                            const femaleX = padding.left;

                            const femaleBarEnd = femaleX + widthFemale;
                            const maleBarStart = chartWidth - padding.right - widthMale;
                            return (
                                <g key={d.genre + '-stack'} filter="url(#shadow2)">
                                    <text x={padding.left - 18} y={yPos + 14} textAnchor="end" fill="#1d4ed8" fontSize="11px" fontWeight="700">{d.genre}</text>

                                    <rect x={femaleX} y={yPos} width="0" height={18} rx="6" fill="url(#femaleDepth)" opacity="0.95">
                                        <animate attributeName="width" from="0" to={widthFemale.toString()} dur="1s" fill="freeze" />
                                    </rect>
                                    <path d={`M${femaleX + widthFemale},${yPos} l${barDepth},-${barDepth} v18 l-${barDepth},${barDepth} Z`} fill="rgba(0,0,0,0.08)" />

                                    <rect x={chartWidth - padding.right} y={yPos} width="0" height={18} rx="6" fill="url(#maleDepth)" opacity="0.95">
                                        <animate attributeName="x" from={(chartWidth - padding.right).toString()} to={maleBarStart.toString()} dur="1s" fill="freeze" />
                                        <animate attributeName="width" from="0" to={widthMale.toString()} dur="1s" fill="freeze" />
                                    </rect>
                                    <path d={`M${chartWidth - padding.right},${yPos} l-${barDepth},-${barDepth} v18 l${barDepth},${barDepth} Z`} fill="rgba(0,0,0,0.08)" />

                                    <text x={femaleX + widthFemale / 2} y={yPos + 14} fill="#1d4ed8" fontSize="10px" fontWeight="700" textAnchor="middle">{d.pctF.toFixed(1)}%</text>
                                    <text x={maleBarStart + widthMale / 2} y={yPos + 14} fill="#1d4ed8" fontSize="10px" fontWeight="700" textAnchor="middle">{d.pctM.toFixed(1)}%</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.93rem', color: 'var(--text-main)', fontWeight: '700' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: colorWomen }} /> Femmes
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: colorMen }} /> Hommes
                    </span>
                </div>
            </div>
        </div>
    );
}
