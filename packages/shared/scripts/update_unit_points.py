#!/usr/bin/env python3
"""
Extract unit points and battle formations from Battle Profile txt files and update JSON files.
"""

import json
import re
import os
from pathlib import Path

# Base paths
SCRIPT_DIR = Path(__file__).parent
SHARED_DIR = SCRIPT_DIR.parent
UNITS_DIR = SHARED_DIR / "data" / "units"
FACTIONS_JSON_PATH = SHARED_DIR / "src" / "data" / "factions.json"
BATTLE_PROFILES_DIR = SHARED_DIR.parent.parent / "docs" / "references" / "factions"

def extract_unit_points_from_file(filepath):
    """Extract unit points from a faction-specific Battle Profile txt file."""
    units = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match unit lines in the UNITS or HEROES sections
    # Examples:
    # ✹ Crypt Flayers 3 150 (+10) Knights, Infantry 50mm
    # Crypt Ghouls 20 160 Serfs, Infantry 25mm
    # ✹ Abhorrant Archregent 1 160 (-20) 0-1 Royal Attendant, 40mm

    unit_pattern = re.compile(
        r'^[✹\s]*([A-Za-z][A-Za-z\s\-\'\(\),]+?)\s+(\d+)\s+(\d+)\s+(?:\([+-]\d+\)\s+)?',
        re.MULTILINE
    )

    for match in unit_pattern.finditer(content):
        unit_name = match.group(1).strip()
        points = int(match.group(3))

        # Clean up unit name (remove trailing numbers from multi-model units)
        # e.g., "Crypt Flayers (2 models)" -> "Crypt Flayers"
        unit_name = re.sub(r'\s*\(\d+ models?\)', '', unit_name)

        units[unit_name] = points

    return units

def extract_battle_formations(filepath, faction_name=None):
    """Extract battle formations from a Battle Profile txt file.

    Args:
        filepath: Path to the txt file
        faction_name: If provided, extract only formations for this faction (e.g., "OSSIARCH BONEREAPERS")
                     If None, extract all formations (for faction-specific files)
    """
    formations = []

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if faction_name:
        # Extract formations only for the specified faction
        # The structure is: FACTION_NAME -> UPDATED -> HEROES/UNITS -> TYPE NAME POINTS NOTES -> Battle Formations -> next page
        # We need to find from the faction name to the next faction or end of content

        # Split content into lines for easier processing
        lines = content.split('\n')

        # Find the start of the faction section
        faction_start = -1
        for i, line in enumerate(lines):
            if line.strip() == faction_name:
                faction_start = i
                break

        if faction_start == -1:
            print(f"  Warning: Could not find section for {faction_name}")
            return formations

        # Find the end of the faction section (next major faction section, not page breaks)
        # Faction sections can span multiple pages, so we need to continue through page breaks
        # Page headers repeat the faction name, so we need to skip those
        faction_end = len(lines)
        for i in range(faction_start + 1, len(lines)):
            line = lines[i].strip()

            # Look for next faction (short all-caps line that's not a common keyword)
            # Must be 3+ words and not contain "POINTS", "SIZE", "NOTES" etc.
            if (re.match(r'^[A-Z][A-Z\s\-]+$', line) and
                len(line) <= 30 and  # Faction names are typically short
                line not in ['UPDATED', 'NEW', 'BATTLE PROFILES', 'SEPTEMBER 2025', 'WARHAMMER LEGENDS'] and
                not re.search(r'(POINTS|SIZE|NOTES|HEROES|UNITS|LEGENDS|REGIMENT|OPTIONS|BASE)', line)):

                # Check if this is a page header (preceded by "BATTLE PROFILES" or "SEPTEMBER 2025")
                prev_lines = [lines[i-j].strip() for j in range(1, min(6, i+1))]
                is_page_header = ('BATTLE PROFILES' in prev_lines or
                                'SEPTEMBER 2025' in prev_lines or
                                any(re.match(r'^---\s*Page\s+\d+', l) for l in prev_lines))

                if is_page_header and line == faction_name:
                    # Skip this, it's just a page header repeating the SAME faction name
                    continue
                elif is_page_header and line != faction_name:
                    # This is a DIFFERENT faction in a page header - stop here!
                    faction_end = i
                    break

                # Double check it's not a page header continuation
                # If the next few lines don't look like content, it's probably a new faction
                next_line = lines[i+1].strip() if i+1 < len(lines) else ""
                if next_line in ['UPDATED', 'NEW', ''] or re.match(r'^HEROES\s+UNIT', next_line):
                    faction_end = i
                    break

        # Extract the faction section
        faction_content = '\n'.join(lines[faction_start:faction_end])
    else:
        # Use entire file content (for faction-specific files)
        faction_content = content

    # Pattern to match battle formation lines:
    # ✹ Battle Formation Knightly Echelon 0 Battletome: Flesh-eater Courts
    # Battle Formation Lords of the Manor 0 Battletome: Flesh-eater Courts
    # ✹ Battle Formation Veteran Cannoneers 30 (+30) Scourge of Ghyran

    formation_pattern = re.compile(
        r'^[✹\s]*Battle Formation\s+([A-Za-z][A-Za-z\s\-\']+?)\s+\d+\s+(?:\([+-]\d+\)\s+)?(.+)$',
        re.MULTILINE
    )

    for match in formation_pattern.finditer(faction_content):
        formation_name = match.group(1).strip()
        source = match.group(2).strip()

        # Create formation object
        formation_id = formation_name.lower().replace(' ', '-').replace("'", '')
        formations.append({
            'id': formation_id,
            'name': formation_name,
            'description': f'From {source}'
        })

    return formations

def slugify(text):
    """Convert text to slug format."""
    return text.lower().replace(' ', '-').replace("'", '')

def update_faction_data(faction_slug, battle_profile_filename, faction_name_in_file=None):
    """Update unit points and battle formations for a faction.

    Args:
        faction_slug: Slug used in directory/file names (e.g., 'ossiarch-bonereapers')
        battle_profile_filename: Name of the txt file to read
        faction_name_in_file: Name of faction as it appears in Battle Profiles.txt (e.g., 'OSSIARCH BONEREAPERS')
                             Only needed for factions in the main Battle Profiles.txt file
    """

    print(f"\nProcessing {faction_slug}...")

    # Find the battle profile file
    battle_profile_path = BATTLE_PROFILES_DIR / battle_profile_filename
    if not battle_profile_path.exists():
        print(f"Warning: Battle profile not found at {battle_profile_path}")
        return

    # Extract unit points
    faction_points = extract_unit_points_from_file(battle_profile_path)
    print(f"  Found {len(faction_points)} units with points")

    # Extract battle formations
    battle_formations = extract_battle_formations(battle_profile_path, faction_name_in_file)
    print(f"  Found {len(battle_formations)} battle formations")

    # Update unit JSON files
    faction_dir = UNITS_DIR / faction_slug
    if faction_dir.exists():
        updated_count = 0
        for json_file in faction_dir.glob("*.json"):
            with open(json_file, 'r', encoding='utf-8') as f:
                unit_data = json.load(f)

            unit_name = unit_data.get('name', '')

            # Try to find matching points
            points = None
            for profile_name, profile_points in faction_points.items():
                # Exact match (case-insensitive)
                if unit_name.lower() == profile_name.lower():
                    points = profile_points
                    break
                # Partial match
                if profile_name.lower() in unit_name.lower() or unit_name.lower() in profile_name.lower():
                    points = profile_points
                    break

            if points is not None:
                # Update battleProfile
                if 'battleProfile' not in unit_data:
                    unit_data['battleProfile'] = {
                        'unitSize': 1,
                        'points': 0,
                        'baseSize': '40mm'
                    }

                old_points = unit_data['battleProfile'].get('points', 0)
                unit_data['battleProfile']['points'] = points

                # Write back
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(unit_data, f, indent=2, ensure_ascii=False)
                    f.write('\n')

                if old_points != points:
                    print(f"    {unit_name}: {old_points} -> {points} pts")
                updated_count += 1

        print(f"  Updated {updated_count} unit files")
    else:
        print(f"  Warning: Unit directory not found: {faction_dir}")

    # Update faction JSON with battle formations
    if battle_formations:
        with open(FACTIONS_JSON_PATH, 'r', encoding='utf-8') as f:
            factions_data = json.load(f)

        if faction_slug in factions_data:
            factions_data[faction_slug]['battleFormations'] = battle_formations

            with open(FACTIONS_JSON_PATH, 'w', encoding='utf-8') as f:
                json.dump(factions_data, f, indent=2, ensure_ascii=False)
                f.write('\n')

            print(f"  Added {len(battle_formations)} battle formations to factions.json")
        else:
            print(f"  Warning: Faction '{faction_slug}' not found in factions.json")

if __name__ == "__main__":
    print("="*60)
    print("Updating Unit Points and Battle Formations")
    print("="*60)

    # Map faction slugs to their Battle Profile txt files
    # Format: (faction_slug, battle_profile_filename, faction_name_in_file)
    # faction_name_in_file is only needed for factions in the main Battle Profiles.txt
    factions = [
        ('flesh-eater-courts', 'Battle Profile - Flesh Eater Courts.txt', None),
        ('ossiarch-bonereapers', 'Battle Profiles.txt', 'OSSIARCH BONEREAPERS'),
        ('slaves-to-darkness', 'Battle Profiles.txt', 'SLAVES TO DARKNESS'),
        ('stormcast-eternals', 'Battle Profiles.txt', 'STORMCAST ETERNALS'),
    ]

    for faction_slug, profile_filename, faction_name in factions:
        update_faction_data(faction_slug, profile_filename, faction_name)

    print("\n" + "="*60)
    print("✅ Done!")
    print("="*60)
