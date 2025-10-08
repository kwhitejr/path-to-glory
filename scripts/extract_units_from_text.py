#!/usr/bin/env python3
"""
Extract unit warscroll data from faction pack text files and generate JSON files.
This is a simplified extraction that captures basic unit information.
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

def slugify(text):
    """Convert text to slug format."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def extract_unit_name(lines, start_idx):
    """Extract unit name from warscroll header."""
    # Look for the unit name in the next few lines after WARSCROLL
    for i in range(start_idx, min(start_idx + 10, len(lines))):
        line = lines[i].strip()
        # Unit names are often in ALL CAPS and substantial
        if line.isupper() and len(line) > 3 and 'WARSCROLL' not in line and 'MOVE' not in line:
            # Handle multi-line names
            name = line
            # Check if next line continues the name
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line.isupper() and len(next_line) > 3 and 'CONTROL' not in next_line:
                    name += ' ' + next_line
            return name.strip()
    return None

def parse_faction_text(text_file, faction_id):
    """Parse a faction text file and extract basic unit information."""
    with open(text_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    units = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Find warscroll markers
        if 'WARSCROLL' in line and faction_id.upper().replace('-', ' ') in line.upper():
            # Extract unit name
            unit_name = extract_unit_name(lines, i + 1)

            if unit_name:
                # Clean up unit name
                unit_name = re.sub(r'\s+', ' ', unit_name)
                unit_name = unit_name.replace('ON ROYAL ', 'on Royal ')
                unit_name = unit_name.replace('MORTARCH OF ', 'Mortarch of ')

                # Create unit stub
                unit_id = slugify(unit_name)

                unit_stub = {
                    "id": unit_id,
                    "name": unit_name.title(),
                    "factionId": faction_id,
                    "characteristics": {
                        "move": "6\"",  # Default, needs manual correction
                        "health": 1,
                        "save": "4+",
                        "control": 1
                    },
                    "meleeWeapons": [],
                    "abilities": [],
                    "keywords": {
                        "unit": ["Infantry"],
                        "faction": ["Death", faction_id.replace('-', ' ').title()]
                    },
                    "sourceFile": text_file.name,
                    "extractedAt": datetime.now().isoformat() + 'Z',
                    "_needs_manual_review": True
                }

                units.append(unit_stub)

        i += 1

    return units

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_units_from_text.py <faction-id>")
        print("Example: python extract_units_from_text.py flesh-eater-courts")
        sys.exit(1)

    faction_id = sys.argv[1]

    # Find the text file
    docs_path = Path(__file__).parent.parent / 'docs' / 'references' / 'factions'

    # Look for matching faction pack
    text_files = list(docs_path.glob(f"*{faction_id.replace('-', ' ').title()}*.txt"))

    if not text_files:
        # Try variations
        text_files = list(docs_path.glob(f"Faction Pack*.txt"))
        text_files = [f for f in text_files if faction_id.replace('-', ' ') in f.name.lower().replace('  ', ' ')]

    if not text_files:
        print(f"No text file found for faction: {faction_id}")
        sys.exit(1)

    text_file = text_files[0]
    print(f"Processing: {text_file.name}")

    # Extract units
    units = parse_faction_text(text_file, faction_id)

    print(f"\nFound {len(units)} units:")
    for unit in units:
        print(f"  - {unit['name']} ({unit['id']})")

    # Create output directory
    output_dir = Path(__file__).parent.parent / 'packages' / 'shared' / 'data' / 'units' / faction_id
    output_dir.mkdir(parents=True, exist_ok=True)

    # Write unit stubs
    for unit in units:
        output_file = output_dir / f"{unit['id']}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(unit, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Created {len(units)} unit stub files in {output_dir}")
    print(f"\nNOTE: These are stubs that need manual completion.")
    print("Each file is marked with '_needs_manual_review': true")

if __name__ == '__main__':
    main()
