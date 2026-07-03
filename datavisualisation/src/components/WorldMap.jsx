import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3';

// Map from ISO numeric to our filter codes
// FR=250, US=840, IT=380, GB=826, DE=276, ES=724
const COUNTRY_FILTER_MAP = {
  '250': 'FR',
  '840': 'US',
  '380': 'IT',
  '826': 'coprod', // GB (co-prod partner)
  '276': 'coprod', // DE (co-prod partner)
  '724': 'coprod', // ES (co-prod partner)
}

const FILTER_COLORS = {
  'FR':     '#ef4444',   // rouge France
  'US':     '#3b82f6',   // bleu USA
  'IT':     '#10b981',   // vert Italie
  'coprod': '#f59e0b',   // or co-productions
  'all':    null,
}

const LEGEND_ITEMS = [
  { code: 'FR',     label: 'France',           color: '#ef4444' },
  { code: 'IT',     label: 'Italie',            color: '#10b981' },
  { code: 'US',     label: 'États-Unis',        color: '#3b82f6' },
  { code: 'coprod', label: 'Co-productions',    color: '#f59e0b' },
]

export default function WorldMap({ selectedCountry = 'all', onCountryClick }) {
  const svgRef = useRef(null)
  const [hoveredCode, setHoveredCode] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function drawMap() {
      const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json())
      if (cancelled) return

      const topojson = await import('topojson-client')
      const countries = topojson.feature(world, world.objects.countries)
      const borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b)

      const container = svgRef.current
      if (!container || cancelled) return

      d3.select(container).selectAll('*').remove()

      const w = container.clientWidth || 400
      const h = container.clientHeight || 420

      let rotate = [-10, -45]
      if (selectedCountry !== 'all') {
        const targetFeature = countries.features.find(f => COUNTRY_FILTER_MAP[String(f.id)] === selectedCountry)
        if (targetFeature) {
          const centroid = d3.geoCentroid(targetFeature)
          if (centroid && centroid.length === 2 && !Number.isNaN(centroid[0]) && !Number.isNaN(centroid[1])) {
            rotate = [-centroid[0], -centroid[1]]
          }
        }
      }

      const projection = d3.geoOrthographic()
        .scale(w / 2.2)
        .translate([w / 2, h / 2])
        .rotate(rotate)

      const path = d3.geoPath().projection(projection)

      const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${w} ${h}`)
        .style('cursor', 'pointer')

      // Sphere / ocean
      svg.append('path')
        .datum({ type: 'Sphere' })
        .attr('d', path)
        .attr('fill', 'rgba(100,140,200,0.07)')

      // Graticule
      const graticule = d3.geoGraticule()
      const graticulePath = svg.append('path')
        .datum(graticule())
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.04)
        .attr('stroke-width', 0.5)

      // Countries
      const countryGroup = svg.append('g')
      const countryPaths = countryGroup.selectAll('path')
        .data(countries.features)
        .join('path')
        .attr('class', 'world-country')
        .attr('d', path)
        .attr('fill', d => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          if (!fcode) return 'var(--text-main)'
          if (selectedCountry !== 'all' && selectedCountry !== fcode) return 'var(--text-main)'
          return FILTER_COLORS[fcode] || 'var(--text-main)'
        })
        .attr('fill-opacity', d => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          if (!fcode) return 0.07
          if (selectedCountry !== 'all' && selectedCountry !== fcode) return 0.07
          return 0.75
        })
        .attr('stroke', d => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          if (!fcode) return 'var(--text-main)'
          return FILTER_COLORS[fcode] || 'var(--text-main)'
        })
        .attr('stroke-opacity', d => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          return fcode ? 0.4 : 0.12
        })
        .attr('stroke-width', 0.5)
        .style('transition', 'fill-opacity 0.2s, stroke-width 0.2s')
        .on('mouseover', (event, d) => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          if (!fcode) return
          d3.select(event.target).attr('fill-opacity', 1).attr('stroke-width', 1.5)
          const labels = { FR: 'France', US: 'États-Unis', IT: 'Italie', coprod: 'Co-production' }
          setHoveredCode(fcode)
          setTooltip({
            visible: true,
            text: labels[fcode] || fcode,
            x: event.offsetX,
            y: event.offsetY,
          })
        })
        .on('mousemove', (event) => {
          setTooltip(t => ({ ...t, x: event.offsetX, y: event.offsetY }))
        })
        .on('mouseout', (event, d) => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          d3.select(event.target)
            .attr('fill-opacity', fcode ? (selectedCountry !== 'all' && selectedCountry !== fcode ? 0.07 : 0.75) : 0.07)
            .attr('stroke-width', 0.5)
          setHoveredCode(null)
          setTooltip(t => ({ ...t, visible: false }))
        })
        .on('click', (event, d) => {
          const fcode = COUNTRY_FILTER_MAP[String(d.id)]
          if (!fcode || !onCountryClick) return
          onCountryClick(fcode)
        })

      // Country borders
      const borderPath = svg.append('path')
        .datum(borders)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'var(--text-main)')
        .attr('stroke-opacity', 0.1)
        .attr('stroke-width', 0.4)

      // Sphere outline
      const sphereOutline = svg.append('path')
        .datum({ type: 'Sphere' })
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'var(--text-main)')
        .attr('stroke-opacity', 0.15)
        .attr('stroke-width', 1)

      // Drag behavior for rotation
      const drag = d3.drag()
        .on('drag', (event) => {
          const rotate = projection.rotate()
          const k = 75 / projection.scale()
          projection.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k
          ])
          // Redraw everything
          svg.selectAll('path.world-country').attr('d', path)
          graticulePath.attr('d', path)
          borderPath.attr('d', path)
          sphereOutline.attr('d', path)
        })
      svg.call(drag)

      if (!cancelled) setLoaded(true)
    }

    drawMap()
    return () => { cancelled = true }
  }, [selectedCountry, onCountryClick])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      paddingTop: '10px',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '0.7rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--accent-ui)',
        marginBottom: '6px',
        opacity: 0.8,
        textAlign: 'center',
      }}>
        Filtrer par origine
      </div>
      <div style={{
        fontSize: '0.85rem',
        lineHeight: 1.5,
        color: 'var(--text-main)',
        opacity: 0.85,
        textAlign: 'center',
        marginBottom: '12px',
      }}>
        Clique sur un pays pour voir uniquement les films de ce pays dans le graphique radial.
      </div>

      {/* Map SVG container */}
      <div
        ref={svgRef}
        style={{ width: '100%', flex: 1.3, minHeight: 0, position: 'relative' }}
      />

      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 8,
          top: tooltip.y + 8,
          background: 'var(--text-main)',
          color: 'var(--bg-color)',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '700',
          pointerEvents: 'none',
          zIndex: 100,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(128,128,128,0.12)',
      }}>
        <div style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-main)', opacity: 0.4, marginBottom: '2px' }}>
          Légende — cliquer pour filtrer
        </div>
        {LEGEND_ITEMS.map(item => {
          const isActive = selectedCountry === item.code
          const isAny = selectedCountry === 'all'
          return (
            <button
              key={item.code}
              onClick={() => onCountryClick && onCountryClick(item.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '6px',
                transition: 'background 0.2s',
                opacity: isAny || isActive ? 1 : 0.35,
                width: '100%',
                textAlign: 'left',
                backgroundColor: isActive ? `${item.color}18` : 'transparent',
              }}
            >
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: item.color,
                flexShrink: 0,
                display: 'inline-block',
              }} />
              <span style={{
                fontSize: '0.72rem',
                fontWeight: isActive ? '800' : '600',
                color: isActive ? item.color : 'var(--text-main)',
                transition: 'color 0.2s',
              }}>
                {item.label}
              </span>
              {isActive && (
                <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: item.color, fontWeight: '700' }}>✕</span>
              )}
            </button>
          )
        })}
        {selectedCountry !== 'all' && (
          <button
            onClick={() => onCountryClick && onCountryClick('all')}
            style={{
              marginTop: '4px',
              background: 'rgba(128,128,128,0.1)',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '0.68rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: 'var(--text-main)',
              width: '100%',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}
