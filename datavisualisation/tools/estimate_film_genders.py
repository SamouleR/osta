#!/usr/bin/env python3
"""
Small script to heuristically estimate presence of women in film credits.
It reads a CSV file (the films list), looks at Director/Title fields and marks a 'Women' column
if female first names are detected in the Director or Title (simple heuristic).

Usage:
  python3 tools/estimate_film_genders.py public/films.csv > public/films_with_gender.csv

This is intentionally conservative and illustrative; for production you'd use named-entity
recognition or manual curation.
"""
import sys, csv, re

FEMALE_NAMES = set([
  'marie','sophie','anne','julie','laura','isabelle','elise','valerie','aline','colette','coline','celine','claire','sylvie','denise','diane','audrey','emilie','emilie','camille','coline'
])

def detect_female_in_text(text):
    if not text: return False
    text = re.sub(r"[^a-zA-ZÀ-ÿ' ]+"," ", text).lower()
    tokens = text.split()
    for t in tokens:
        if t in FEMALE_NAMES:
            return True
    return False

def main():
    if len(sys.argv) < 2:
        print("Usage: estimate_film_genders.py films.csv", file=sys.stderr)
        sys.exit(1)
    path = sys.argv[1]
    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        if not rows:
            print('')
            return
        fieldnames = reader.fieldnames + ['WomenEstimated']
        writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            title = r.get('Title','')
            director = r.get('Director','')
            est = detect_female_in_text(director) or detect_female_in_text(title)
            r['WomenEstimated'] = '1' if est else '0'
            writer.writerow(r)

if __name__ == '__main__':
    main()
