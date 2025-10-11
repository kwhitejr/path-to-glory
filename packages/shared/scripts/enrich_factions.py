#!/usr/bin/env python3
"""
Script to enrich factions.json with unit data from battle profiles
"""

import json
import os

# Get the path to factions.json
script_dir = os.path.dirname(os.path.abspath(__file__))
factions_path = os.path.join(script_dir, '../src/data/factions.json')

# Read current factions data
with open(factions_path, 'r') as f:
    factions = json.load(f)

# Note: Due to size, unit arrays are defined in a separate file
# This script will be called after manual JSON editing

print("Factions data loaded successfully")
print(f"Factions: {list(factions.keys())}")

# Check current structure
for faction_id, faction_data in factions.items():
    has_units = 'units' in faction_data
    unit_count = len(faction_data.get('units', [])) if has_units else 0
    print(f"{faction_data['name']}: {'✓' if has_units else '✗'} units field, {unit_count} units")
