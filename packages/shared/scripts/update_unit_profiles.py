#!/usr/bin/env python3
"""
Update all unit JSON files with battle profile data
"""

import json
import os
from pathlib import Path

# Base path for unit files
UNITS_BASE = Path("/Users/kwhitejr/Projects/github/path-to-glory/packages/shared/data/units")

# Flesh Eater Courts battle profile data
FEC_PROFILES = {
    "abhorrant-cardinal": {
        "unitSize": 1,
        "points": 130,
        "regimentOptions": "0-1 Royal Attendant, 0-1 Beast, 0-1 Knights, Any Serfs",
        "baseSize": "32mm"
    },
    "abhorrant-ghoul-king": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
        "baseSize": "32mm"
    },
    "abhorrant-ghoul-king-on-terrorgheist": {
        "unitSize": 1,
        "points": 350,
        "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
        "baseSize": "130mm"
    },
    "abhorrant-ghoul-king-on-zombie-dragon": {
        "unitSize": 1,
        "points": 360,
        "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
        "baseSize": "130mm"
    },
    "abhorrant-gorewarden": {
        "unitSize": 1,
        "points": 170,
        "regimentOptions": "0-1 Royal Attendant, 0-1 Beast, 0-1 Serfs, Any Knights",
        "baseSize": "40mm"
    },
    "crypt-haunter-courtier": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Beast, 0-1 Serfs, Any Crypt Horrors",
        "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
        "baseSize": "50mm"
    },
    "crypt-infernal-courtier": {
        "unitSize": 1,
        "points": 140,
        "regimentOptions": "0-1 Beast, 0-1 Serfs, Any Crypt Flayers",
        "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
        "baseSize": "50mm"
    },
    "grand-justice-gormayne": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Beast, 0-1 Knights, Any Serfs",
        "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
        "baseSize": "32mm"
    },
    "marrowscroll-herald": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Beast, Any Serfs",
        "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
        "baseSize": "32mm"
    },
    "royal-decapitator": {
        "unitSize": 1,
        "points": 100,
        "regimentOptions": "0-1 Beast, Any Serfs",
        "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
        "baseSize": "32mm"
    },
    "ushoran": {
        "unitSize": 1,
        "points": 450,
        "regimentOptions": "Any Royal Attendant, Any Flesh-eater Courts",
        "baseSize": "130mm"
    },
    "crypt-flayers": {
        "unitSize": 3,
        "points": 150,
        "keywords": ["Knights", "Infantry"],
        "baseSize": "50mm"
    },
    "crypt-horrors": {
        "unitSize": 3,
        "points": 160,
        "keywords": ["Knights", "Infantry"],
        "baseSize": "50mm"
    },
    "cryptguard": {
        "unitSize": 10,
        "points": 100,
        "keywords": ["Serfs", "Infantry"],
        "baseSize": "25mm"
    },
    "morbheg-knights": {
        "unitSize": 3,
        "points": 180,
        "keywords": ["Knights", "Cavalry"],
        "baseSize": "75 × 42mm"
    },
    "royal-beastflayers": {
        "unitSize": 10,
        "points": 100,
        "keywords": ["Serfs", "Infantry"],
        "notes": "This unit cannot be reinforced.",
        "baseSize": "40mm, 32mm, 28.5mm, 25mm"
    },
    "royal-terrorgheist": {
        "unitSize": 1,
        "points": 230,
        "keywords": ["Monster"],
        "baseSize": "130mm"
    },
    "royal-zombie-dragon": {
        "unitSize": 1,
        "points": 240,
        "keywords": ["Monster"],
        "baseSize": "130mm"
    },
    "varghulf-courtier": {
        "unitSize": 1,
        "points": 130,
        "keywords": ["Beast"],
        "baseSize": "90 × 52mm"
    }
}

# Ossiarch Bonereapers battle profile data
OBR_PROFILES = {
    "arch-kavalos-zandtos": {
        "unitSize": 1,
        "points": 190,
        "regimentOptions": "Any Ossiarch Bonereapers",
        "notes": "This Hero can join an eligible regiment as a Legion Subcommander.",
        "baseSize": "80mm"
    },
    "liege-kavalos": {
        "unitSize": 1,
        "points": 160,
        "regimentOptions": "Any Ossiarch Bonereapers",
        "notes": "This Hero can join an eligible regiment as a Legion Subcommander.",
        "baseSize": "80mm"
    },
    "mortisan-boneshaper": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Gothizzar Harvester, Any Infantry",
        "baseSize": "32mm"
    },
    "mortisan-ossifector": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Gothizzar Harvester, 0-1 Mortek Crawler, Any Infantry",
        "baseSize": "32mm"
    },
    "mortisan-soulmason": {
        "unitSize": 1,
        "points": 150,
        "regimentOptions": "0-1 Gothizzar Harvester, Any Infantry",
        "baseSize": "40mm"
    },
    "mortisan-soulreaper": {
        "unitSize": 1,
        "points": 90,
        "regimentOptions": "0-1 Gothizzar Harvester, Any Infantry",
        "baseSize": "32mm"
    },
    "vokmortian": {
        "unitSize": 1,
        "points": 150,
        "regimentOptions": "Any Ossiarch Bonereapers",
        "baseSize": "40mm"
    },
    "gothizzar-harvester": {
        "unitSize": 1,
        "points": 140,
        "keywords": ["Monster"],
        "baseSize": "105 × 70mm"
    },
    "immortis-guard": {
        "unitSize": 3,
        "points": 170,
        "keywords": ["Infantry"],
        "baseSize": "50mm"
    },
    "kavalos-deathriders": {
        "unitSize": 5,
        "points": 200,
        "keywords": ["Cavalry"],
        "baseSize": "60 × 35mm"
    },
    "morghast-archai": {
        "unitSize": 2,
        "points": 260,
        "keywords": ["Infantry"],
        "baseSize": "60mm"
    },
    "morghast-harbingers": {
        "unitSize": 2,
        "points": 260,
        "keywords": ["Infantry"],
        "baseSize": "60mm"
    },
    "mortek-crawler": {
        "unitSize": 1,
        "points": 260,
        "keywords": ["War Machine"],
        "baseSize": "170 × 105mm"
    },
    "mortek-guard": {
        "unitSize": 10,
        "points": 110,
        "keywords": ["Infantry"],
        "baseSize": "25mm"
    },
    "necropolis-stalkers": {
        "unitSize": 3,
        "points": 140,
        "keywords": ["Infantry"],
        "baseSize": "50mm"
    }
}

# Slaves to Darkness battle profile data
STD_PROFILES = {
    "chaos-lord": {
        "unitSize": 1,
        "points": 100,
        "regimentOptions": "0-1 Ruinous Champion, Any Slaves to Darkness",
        "notes": "This Hero can join an eligible regiment as a Ruinous Champion.",
        "baseSize": "40mm"
    },
    "chaos-lord-on-daemonic-mount": {
        "unitSize": 1,
        "points": 140,
        "regimentOptions": "0-1 Ruinous Champion, Any Slaves to Darkness",
        "notes": "This Hero can join an eligible regiment as a Ruinous Champion.",
        "baseSize": "90 × 52mm"
    },
    "chaos-lord-on-karkadrak": {
        "unitSize": 1,
        "points": 200,
        "regimentOptions": "0-1 Ruinous Champion, Any Slaves to Darkness",
        "notes": "This Hero can join an eligible regiment as a Ruinous Champion.",
        "baseSize": "90 × 52mm"
    },
    "chaos-sorcerer-lord": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Ruinous Champion, 0-1 Monster, Any Warriors of Chaos",
        "baseSize": "40mm"
    },
    "daemon-prince": {
        "unitSize": 1,
        "points": 260,
        "regimentOptions": "0-1 Ruinous Champion, Any Slaves to Darkness",
        "baseSize": "60mm"
    },
    "darkoath-chieftain": {
        "unitSize": 1,
        "points": 80,
        "regimentOptions": "0-1 Monster, Any Darkoath",
        "notes": "This Hero can join an eligible regiment as an Oathsworn.",
        "baseSize": "32mm"
    },
    "darkoath-chieftain-on-warsteed": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Oathsworn, 0-1 Monster, Any Darkoath",
        "notes": "This Hero can join an eligible regiment as an Oathsworn.",
        "baseSize": "75 × 42mm"
    },
    "darkoath-warqueen": {
        "unitSize": 1,
        "points": 100,
        "regimentOptions": "0-1 Oathsworn, 0-1 Monster, Any Darkoath",
        "baseSize": "32mm"
    },
    "exalted-hero-of-chaos": {
        "unitSize": 1,
        "points": 90,
        "regimentOptions": "0-1 Monster, Any Warriors of Chaos",
        "notes": "This Hero can join an eligible regiment as a Ruinous Champion.",
        "baseSize": "40mm"
    },
    "gaunt-summoner": {
        "unitSize": 1,
        "points": 180,
        "regimentOptions": "Any Slaves to Darkness",
        "baseSize": "40mm"
    },
    "ogroid-myrmidon": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "Any Ogroid Theridons, Any Monster, Any Daemon",
        "notes": "This Hero can join an eligible regiment as a Ruinous Champion.",
        "baseSize": "50mm"
    },
    "chaos-chariot": {
        "unitSize": 1,
        "points": 90,
        "keywords": ["Warriors of Chaos", "War Machine"],
        "baseSize": "120 × 92mm"
    },
    "chaos-chosen": {
        "unitSize": 5,
        "points": 280,
        "keywords": ["Warriors of Chaos", "Infantry"],
        "baseSize": "40mm"
    },
    "chaos-furies": {
        "unitSize": 6,
        "points": 120,
        "keywords": ["Daemon", "Infantry"],
        "baseSize": "32mm"
    },
    "chaos-knights": {
        "unitSize": 5,
        "points": 250,
        "keywords": ["Warriors of Chaos", "Cavalry"],
        "baseSize": "75 × 42mm"
    },
    "chaos-marauders": {
        "unitSize": 10,
        "points": 80,
        "keywords": ["Darkoath", "Infantry"],
        "baseSize": "28.5mm"
    },
    "chaos-spawn": {
        "unitSize": 1,
        "points": 60,
        "keywords": ["Beast"],
        "baseSize": "50mm"
    },
    "chaos-warriors": {
        "unitSize": 10,
        "points": 200,
        "keywords": ["Warriors of Chaos", "Infantry"],
        "baseSize": "32mm"
    },
    "darkoath-fellriders": {
        "unitSize": 5,
        "points": 150,
        "keywords": ["Darkoath", "Cavalry"],
        "baseSize": "60 × 35mm"
    },
    "darkoath-savagers": {
        "unitSize": 10,
        "points": 90,
        "keywords": ["Darkoath", "Infantry"],
        "notes": "This unit cannot be reinforced.",
        "baseSize": "32mm [3], 28.5mm [7]"
    },
    "darkoath-wilderfiend": {
        "unitSize": 1,
        "points": 130,
        "keywords": ["Darkoath", "Beast"],
        "baseSize": "60mm"
    },
    "gorebeast-chariot": {
        "unitSize": 1,
        "points": 100,
        "keywords": ["Warriors of Chaos", "War Machine"],
        "baseSize": "120 × 92mm"
    },
    "ogroid-theridons": {
        "unitSize": 3,
        "points": 180,
        "keywords": ["Infantry"],
        "baseSize": "50mm"
    },
    "raptoryx": {
        "unitSize": 6,
        "points": 100,
        "keywords": ["Beast"],
        "baseSize": "60 × 35mm"
    },
    "varanguard": {
        "unitSize": 3,
        "points": 330,
        "keywords": ["Warriors of Chaos", "Cavalry"],
        "baseSize": "75 × 42mm"
    }
}

# Stormcast Eternals battle profile data
SCE_PROFILES = {
    "knight-arcanum": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Gryph-hounds, Any Warrior Chamber",
        "baseSize": "40mm"
    },
    "knight-azyros": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Warrior Chamber, Any Ruination Chamber",
        "notes": "This Hero can join an eligible regiment as a Stormcast Exemplar.",
        "baseSize": "50mm"
    },
    "knight-questor": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Questor Soulsworn, 0-1 Gryph-hounds, Any Ruination Chamber",
        "notes": "This Hero can join an eligible regiment as a Stormcast Exemplar.",
        "baseSize": "40mm"
    },
    "knight-relictor": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Gryph-hounds, Any Warrior Chamber",
        "baseSize": "40mm"
    },
    "knight-vexillor": {
        "unitSize": 1,
        "points": 100,
        "regimentOptions": "0-1 Gryph-hounds, Any Warrior Chamber",
        "notes": "This Hero can join an eligible regiment as a Stormcast Exemplar.",
        "baseSize": "40mm"
    },
    "lord-aquilor": {
        "unitSize": 1,
        "points": 140,
        "regimentOptions": "Any Gryph-hounds, Any Vanguard Chamber",
        "baseSize": "90 × 52mm"
    },
    "lord-celestant": {
        "unitSize": 1,
        "points": 100,
        "regimentOptions": "0-1 Stormcast Exemplar, 0-1 Gryph-hounds, Any Warrior Chamber",
        "baseSize": "40mm"
    },
    "lord-celestant-on-dracoth": {
        "unitSize": 1,
        "points": 160,
        "regimentOptions": "0-1 Stormcast Exemplar, Any Extremis Chamber, Any Warrior Chamber",
        "baseSize": "90 × 52mm"
    },
    "lord-imperatant": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Stormcast Exemplar, 0-1 Gryph-hounds, Any Warrior Chamber",
        "notes": "This Hero can join an eligible regiment as a Stormcast Exemplar.",
        "baseSize": "40mm [1], 32mm [1]"
    },
    "lord-relictor": {
        "unitSize": 1,
        "points": 120,
        "regimentOptions": "0-1 Stormcast Exemplar, 0-1 Gryph-hounds, Any Ruination Chamber, Any Warrior Chamber",
        "baseSize": "40mm"
    },
    "lord-veritant": {
        "unitSize": 1,
        "points": 110,
        "regimentOptions": "0-1 Stormcast Exemplar, 0-1 Gryph-hounds, Any Ruination Chamber, Any Warrior Chamber",
        "baseSize": "40mm"
    },
    "vandus-hammerhand": {
        "unitSize": 1,
        "points": 170,
        "regimentOptions": "0-1 Stormcast Exemplar, Any Extremis Chamber, Any Warrior Chamber",
        "baseSize": "90 × 52mm"
    },
    "annihilators": {
        "unitSize": 3,
        "points": 130,
        "keywords": ["Warrior Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "gryph-hounds": {
        "unitSize": 6,
        "points": 90,
        "keywords": ["Beast"],
        "baseSize": "40mm"
    },
    "liberators": {
        "unitSize": 5,
        "points": 90,
        "keywords": ["Warrior Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "praetors": {
        "unitSize": 3,
        "points": 140,
        "keywords": ["Warrior Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "prosecutors": {
        "unitSize": 3,
        "points": 150,
        "keywords": ["Ruination Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "questor-soulsworn": {
        "unitSize": 6,
        "points": 200,
        "keywords": ["Warrior Chamber", "Infantry"],
        "notes": "This unit cannot be reinforced.",
        "baseSize": "40mm"
    },
    "reclusians": {
        "unitSize": 3,
        "points": 140,
        "keywords": ["Ruination Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "stormstrike-chariot": {
        "unitSize": 1,
        "points": 120,
        "keywords": ["Warrior Chamber", "War Machine"],
        "baseSize": "120 × 92mm"
    },
    "vanguard-hunters": {
        "unitSize": 5,
        "points": 120,
        "keywords": ["Vanguard Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "vanguard-raptors-with-hurricane-crossbows": {
        "unitSize": 3,
        "points": 110,
        "keywords": ["Vanguard Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "vanguard-raptors-with-longstrike-crossbows": {
        "unitSize": 3,
        "points": 200,
        "keywords": ["Vanguard Chamber", "Infantry"],
        "notes": "Champion is 60 × 35mm.",
        "baseSize": "40mm"
    },
    "vanquishers": {
        "unitSize": 5,
        "points": 100,
        "keywords": ["Warrior Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "vigilors": {
        "unitSize": 5,
        "points": 140,
        "keywords": ["Warrior Chamber", "Infantry"],
        "baseSize": "40mm"
    },
    "vindictors": {
        "unitSize": 5,
        "points": 100,
        "keywords": ["Warrior Chamber", "Infantry"],
        "baseSize": "40mm"
    }
}

def update_unit_file(faction_dir, unit_id, profile_data):
    """Update a single unit JSON file with battle profile data"""
    file_path = faction_dir / f"{unit_id}.json"

    if not file_path.exists():
        return False

    try:
        with open(file_path, 'r') as f:
            unit_data = json.load(f)

        # Skip if already has battleProfile
        if 'battleProfile' in unit_data:
            return False

        # Add battle profile
        unit_data['battleProfile'] = profile_data

        # Write back
        with open(file_path, 'w') as f:
            json.dump(unit_data, f, indent=2)
            f.write('\n')  # Add trailing newline

        return True
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    """Main function to update all unit files"""

    # Update Flesh Eater Courts
    fec_dir = UNITS_BASE / "flesh-eater-courts"
    fec_updated = 0
    for unit_id, profile in FEC_PROFILES.items():
        if update_unit_file(fec_dir, unit_id, profile):
            fec_updated += 1
    print(f"✅ Flesh Eater Courts: Updated {fec_updated} units")

    # Update Ossiarch Bonereapers
    obr_dir = UNITS_BASE / "ossiarch-bonereapers"
    obr_updated = 0
    for unit_id, profile in OBR_PROFILES.items():
        if update_unit_file(obr_dir, unit_id, profile):
            obr_updated += 1
    print(f"✅ Ossiarch Bonereapers: Updated {obr_updated} units")

    # Update Slaves to Darkness
    std_dir = UNITS_BASE / "slaves-to-darkness"
    std_updated = 0
    for unit_id, profile in STD_PROFILES.items():
        if update_unit_file(std_dir, unit_id, profile):
            std_updated += 1
    print(f"✅ Slaves to Darkness: Updated {std_updated} units")

    # Update Stormcast Eternals
    sce_dir = UNITS_BASE / "stormcast-eternals"
    sce_updated = 0
    for unit_id, profile in SCE_PROFILES.items():
        if update_unit_file(sce_dir, unit_id, profile):
            sce_updated += 1
    print(f"✅ Stormcast Eternals: Updated {sce_updated} units")

    total = fec_updated + obr_updated + std_updated + sce_updated
    print(f"\n🎉 Total units updated: {total}")

if __name__ == "__main__":
    main()
