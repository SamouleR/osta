import re

with open('app.js', 'r') as f:
    content = f.read()

# 1. Update data fetching
old_fetch = """            const textBaro = await d3.text("csv/ina-barometre-jt.csv").catch(()=>"");
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
            }"""

new_fetch = """            const baroData = await d3.json("csv/barometre_aggr.json").catch(()=>null);
            if (baroData) {
                Viz.renderBarometreStreamgraph(baroData, "barometre-streamgraph");
                Viz.renderBarometreRadialStacked(baroData, "barometre-radial-stacked");
            }"""

content = content.replace(old_fetch, new_fetch)

# 2. Update renderBarometreStreamgraph
old_stream_start = """    renderBarometreStreamgraph(data, containerId) {
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
        });"""

new_stream_start = """    renderBarometreStreamgraph(data, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !data) return;
        container.innerHTML = '';
        
        const chartData = data.streamgraph;
        const themes = data.themes;
        const years = chartData.map(d => d.year);
        
        if (chartData.length === 0) return;"""

content = content.replace(old_stream_start, new_stream_start)

# 3. Update renderBarometreRadialStacked
old_radial_start = """    renderBarometreRadialStacked(data, containerId) {
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
        }).sort((a, b) => b.total - a.total);"""

new_radial_start = """    renderBarometreRadialStacked(data, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !data) return;
        container.innerHTML = '';

        const chartData = data.radial;
        const chaines = data.chaines;
        if (chartData.length === 0) return;"""

content = content.replace(old_radial_start, new_radial_start)

with open('app.js', 'w') as f:
    f.write(content)
