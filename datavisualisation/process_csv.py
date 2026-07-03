import csv
import json
from collections import defaultdict

streamgraph_data = defaultdict(lambda: defaultdict(int)) # year -> theme -> duree
radial_data = defaultdict(lambda: defaultdict(int)) # theme -> chaine -> duree

with open('csv/ina-barometre-jt.csv', 'r', encoding='utf-8', errors='replace') as f:
    reader = csv.reader(f, delimiter=';')
    for row in reader:
        if len(row) < 6: continue
        date = row[0]
        if '/' not in date: continue
        try:
            year = int(date.split('/')[2])
            chaine = row[1]
            theme = row[3]
            if not theme: continue
            duree = int(row[5])
            
            streamgraph_data[year][theme] += duree
            radial_data[theme][chaine] += duree
        except:
            continue

out_stream = []
themes_set = set()
for y, tMap in streamgraph_data.items():
    obj = {"year": y}
    for t, val in tMap.items():
        obj[t] = val
        themes_set.add(t)
    out_stream.append(obj)
out_stream.sort(key=lambda x: x["year"])

out_radial = []
chaines_set = set()
for t, cMap in radial_data.items():
    obj = {"theme": t, "total": 0}
    for c, val in cMap.items():
        obj[c] = val
        obj["total"] += val
        chaines_set.add(c)
    out_radial.append(obj)
out_radial.sort(key=lambda x: x["total"], reverse=True)

with open('csv/barometre_aggr.json', 'w', encoding='utf-8') as f:
    json.dump({
        "streamgraph": out_stream,
        "radial": out_radial,
        "themes": list(themes_set),
        "chaines": list(chaines_set)
    }, f)

print("Aggregated data saved.")
