import re

with open('app.js', 'r') as f:
    content = f.read()

# 1. Update App.init
init_target = """            this.setSlide(0);
            Viz.renderArticleDonuts();"""

init_replacement = """            const textBaro = await d3.text("csv/ina-barometre-jt.csv").catch(()=>"");
            if (textBaro) {
                const parsedBaro = d3.dsvFormat(";").parseRows(textBaro, d => {
                    if(!d[0] || !d[0].includes('/')) return null;
                    const parts = d[0].split('/');
                    return {
                        year: +parts[2],
                        chaine: d[1],
                        theme: d[3],
                        duree: +d[5] || 0
                    };
                }).filter(x => x);
                
                Viz.renderBarometreStreamgraph(parsedBaro, "barometre-streamgraph");
                Viz.renderBarometreRadialStacked(parsedBaro, "barometre-radial-stacked");
            }

            this.setSlide(0);
            Viz.renderArticleDonuts();"""

content = content.replace(init_target, init_replacement)

# 2. Add Viz methods
viz_target = """    resetSelection(e) { if(e.target.className.includes && e.target.className.includes('chart-wrapper')) this.resetView(); }
};"""

viz_replacement = """    resetSelection(e) { if(e.target.className.includes && e.target.className.includes('chart-wrapper')) this.resetView(); },

    renderBarometreStreamgraph(data, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !data || data.length === 0) return;
        container.innerHTML = '';
        
        // Group by year and theme
        const grouped = d3.rollup(data, v => d3.sum(v, d => d.duree), d => d.year, d => d.theme);
        
        const years = Array.from(grouped.keys()).sort();
        let themesSet = new Set();
        for (const [y, tMap] of grouped.entries()) {
            for (const t of tMap.keys()) themesSet.add(t);
        }
        const themes = Array.from(themesSet);
        
        const chartData = years.map(y => {
            const obj = { year: y };
            const tMap = grouped.get(y);
            themes.forEach(t => {
                obj[t] = tMap.get(t) || 0;
            });
            return obj;
        });

        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = {top: 20, right: 30, bottom: 30, left: 50};

        const series = d3.stack()
            .keys(themes)
            .offset(d3.stackOffsetWiggle)
            (chartData);

        const svg = d3.select(container).append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("max-width", "100%")
            .style("height", "auto");

        const x = d3.scaleLinear()
            .domain(d3.extent(years))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal(CUSTOM_PALETTE).domain(themes);

        const area = d3.area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
            .curve(d3.curveBasis);

        const tooltip = d3.select(container).append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("background", "var(--bg-card)")
            .style("border", "1px solid var(--accent-ui)")
            .style("padding", "10px")
            .style("border-radius", "8px")
            .style("color", "var(--text-main)")
            .style("pointer-events", "none")
            .style("z-index", 100);

        svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", d => color(d.key))
            .attr("d", area)
            .style("opacity", 0.9)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 1).style("stroke", "var(--text-main)").style("stroke-width", 1);
                const coords = d3.pointer(event, container);
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${d.key}</strong>`)
                    .style("left", (coords[0] + 15) + "px")
                    .style("top", (coords[1] - 28) + "px");
            })
            .on("mousemove", function(event) {
                const coords = d3.pointer(event, container);
                tooltip.style("left", (coords[0] + 15) + "px")
                    .style("top", (coords[1] - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 0.9).style("stroke", "none");
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format("d")))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height + margin.top + margin.bottom)
                .attr("stroke-opacity", 0.1))
            .selectAll("text")
            .style("fill", "var(--text-main)");
            
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(0))
            .call(g => g.select(".domain").remove());
    },

    renderBarometreRadialStacked(data, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !data || data.length === 0) return;
        container.innerHTML = '';

        const grouped = d3.rollup(data, v => d3.sum(v, d => d.duree), d => d.theme, d => d.chaine);
        const themes = Array.from(grouped.keys()).filter(t => t !== "");
        let chainesSet = new Set();
        for (const tMap of grouped.values()) {
            for (const c of tMap.keys()) if (c !== "") chainesSet.add(c);
        }
        const chaines = Array.from(chainesSet);

        const chartData = themes.map(t => {
            const obj = { theme: t };
            let total = 0;
            const tMap = grouped.get(t);
            chaines.forEach(c => {
                const val = tMap.get(c) || 0;
                obj[c] = val;
                total += val;
            });
            obj.total = total;
            return obj;
        }).sort((a, b) => b.total - a.total);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const innerRadius = 150;
        const outerRadius = Math.min(width, height) / 2 - 40;

        const svg = d3.select(container).append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("width", width)
            .attr("height", height);

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
        const color = d3.scaleOrdinal(CUSTOM_PALETTE).domain(chaines);

        const tooltip = d3.select(container).append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("background", "var(--bg-card)")
            .style("border", "1px solid var(--accent-ui)")
            .style("padding", "10px")
            .style("border-radius", "8px")
            .style("color", "var(--text-main)")
            .style("pointer-events", "none")
            .style("z-index", 100);

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("path")
            .data(d => d.map(item => { item.key = d.key; return item; }))
            .join("path")
            .attr("d", arc)
            .style("stroke", "var(--bg-card)")
            .style("stroke-width", "1px")
            .on("mouseover", function(event, d) {
                d3.selectAll("path").style("opacity", 0.3);
                d3.select(this).style("opacity", 1);
                const coords = d3.pointer(event, container);
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${d.data.theme}</strong><br>${d.key}: ${(d[1]-d[0]).toFixed(0)} s`)
                    .style("left", (coords[0] + width/2 + 15) + "px")
                    .style("top", (coords[1] + height/2 - 28) + "px");
            })
            .on("mousemove", function(event) {
                const coords = d3.pointer(event, container);
                tooltip.style("left", (coords[0] + width/2 + 15) + "px")
                    .style("top", (coords[1] + height/2 - 28) + "px");
            })
            .on("mouseout", function() {
                d3.selectAll("path").style("opacity", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        const labelGroup = svg.append("g").selectAll("g")
            .data(chartData)
            .join("g")
            .attr("text-anchor", d => (x(d.theme) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "start" : "end")
            .attr("transform", d => `
                rotate(${((x(d.theme) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                translate(${outerRadius + 15},0)
            `);

        labelGroup.append("text")
            .attr("transform", d => (x(d.theme) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "" : "rotate(180)")
            .text(d => d.theme.length > 20 ? d.theme.substring(0, 20) + '...' : d.theme)
            .style("font-size", "11px")
            .style("fill", "var(--text-main)")
            .style("font-weight", "600")
            .style("pointer-events", "none");

        // Legend
        const legend = svg.append("g")
            .attr("transform", `translate(-${width/2 - 20}, -${height/2 - 20})`)
            .selectAll("g")
            .data(chaines)
            .join("g")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color);

        legend.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .text(d => d)
            .style("fill", "var(--text-main)")
            .style("font-size", "12px");
    }
};"""

content = content.replace(viz_target, viz_replacement)

with open('app.js', 'w') as f:
    f.write(content)

