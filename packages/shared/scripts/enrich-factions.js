/**
 * Script to enrich factions.json with unit data from battle profiles
 */
const fs = require('fs');
const path = require('path');

// Read current factions data
const factionsPath = path.join(__dirname, '../src/data/factions.json');
const factions = JSON.parse(fs.readFileSync(factionsPath, 'utf-8'));

// Flesh Eater Courts units
const fleshEaterCourtsUnits = [
  {
    "id": "abhorrant-archregent",
    "name": "Abhorrant Archregent",
    "unitSize": 1,
    "points": 160,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
    "baseSize": "40mm"
  },
  {
    "id": "abhorrant-cardinal",
    "name": "Abhorrant Cardinal",
    "unitSize": 1,
    "points": 130,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, 0-1 Beast, 0-1 Knights, Any Serfs",
    "baseSize": "32mm"
  },
  {
    "id": "abhorrant-ghoul-king",
    "name": "Abhorrant Ghoul King",
    "unitSize": 1,
    "points": 120,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
    "baseSize": "32mm"
  },
  {
    "id": "abhorrant-ghoul-king-on-royal-terrorgheist",
    "name": "Abhorrant Ghoul King on Royal Terrorgheist",
    "unitSize": 1,
    "points": 350,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
    "baseSize": "130mm"
  },
  {
    "id": "abhorrant-ghoul-king-on-royal-zombie-dragon",
    "name": "Abhorrant Ghoul King on Royal Zombie Dragon",
    "unitSize": 1,
    "points": 360,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
    "baseSize": "130mm"
  },
  {
    "id": "abhorrant-gorewarden",
    "name": "Abhorrant Gorewarden",
    "unitSize": 1,
    "points": 170,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, 0-1 Beast, 0-1 Serfs, Any Knights",
    "baseSize": "40mm"
  },
  {
    "id": "crypt-haunter-courtier",
    "name": "Crypt Haunter Courtier",
    "unitSize": 1,
    "points": 120,
    "isHero": true,
    "regimentOptions": "0-1 Beast, 0-1 Serfs, Any Crypt Horrors",
    "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
    "baseSize": "50mm"
  },
  {
    "id": "crypt-infernal-courtier",
    "name": "Crypt Infernal Courtier",
    "unitSize": 1,
    "points": 140,
    "isHero": true,
    "regimentOptions": "0-1 Beast, 0-1 Serfs, Any Crypt Flayers",
    "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
    "baseSize": "50mm"
  },
  {
    "id": "grand-justice-gormayne",
    "name": "Grand Justice Gormayne",
    "unitSize": 1,
    "points": 110,
    "isHero": true,
    "regimentOptions": "0-1 Beast, 0-1 Knights, Any Serfs",
    "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
    "baseSize": "32mm"
  },
  {
    "id": "high-falconer-felgryn",
    "name": "High Falconer Felgryn",
    "unitSize": 1,
    "points": 120,
    "isHero": true,
    "regimentOptions": "0-1 Monster, Any Beast, Any Serfs",
    "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
    "baseSize": "28.5mm"
  },
  {
    "id": "marrowscroll-herald",
    "name": "Marrowscroll Herald",
    "unitSize": 1,
    "points": 110,
    "isHero": true,
    "regimentOptions": "0-1 Beast, Any Serfs",
    "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
    "baseSize": "32mm"
  },
  {
    "id": "nagash-supreme-lord-of-the-undead",
    "name": "Nagash, Supreme Lord of the Undead",
    "unitSize": 1,
    "points": 830,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
    "baseSize": "130mm"
  },
  {
    "id": "royal-decapitator",
    "name": "Royal Decapitator",
    "unitSize": 1,
    "points": 100,
    "isHero": true,
    "regimentOptions": "0-1 Beast, Any Serfs",
    "notes": "This Hero can join an eligible regiment as a Royal Attendant.",
    "baseSize": "32mm"
  },
  {
    "id": "ushoran-mortarch-of-delusion",
    "name": "Ushoran, Mortarch of Delusion",
    "unitSize": 1,
    "points": 450,
    "isHero": true,
    "regimentOptions": "Any Royal Attendant, Any Flesh-eater Courts",
    "baseSize": "130mm"
  },
  {
    "id": "scourge-of-ghyran-abhorrant-ghoul-king",
    "name": "Scourge of Ghyran Abhorrant Ghoul King",
    "unitSize": 1,
    "points": 120,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, Any Flesh-eater Courts",
    "notes": "This unit is legal for Matched Play for battles fought using the General's Handbook 2025-26 battlepack.",
    "baseSize": "32mm"
  },
  {
    "id": "scourge-of-ghyran-abhorrant-gorewarden",
    "name": "Scourge of Ghyran Abhorrant Gorewarden",
    "unitSize": 1,
    "points": 140,
    "isHero": true,
    "regimentOptions": "0-1 Royal Attendant, 0-1 Beast, 0-1 Serfs, Any Knights",
    "notes": "This unit is legal for Matched Play for battles fought using the General's Handbook 2025-26 battlepack.",
    "baseSize": "40mm"
  },
  {
    "id": "crypt-flayers",
    "name": "Crypt Flayers",
    "unitSize": 3,
    "points": 150,
    "isHero": false,
    "keywords": ["Knights", "Infantry"],
    "baseSize": "50mm"
  },
  {
    "id": "crypt-flayers-2-models",
    "name": "Crypt Flayers (2 models)",
    "unitSize": 2,
    "points": 80,
    "isHero": false,
    "keywords": ["Knights", "Infantry"],
    "notes": "You can include 1 unit of this type for each Crypt Infernal Courtier in your army. This unit cannot be reinforced.",
    "baseSize": "50mm"
  },
  {
    "id": "crypt-ghouls",
    "name": "Crypt Ghouls",
    "unitSize": 20,
    "points": 160,
    "isHero": false,
    "keywords": ["Serfs", "Infantry"],
    "baseSize": "25mm"
  },
  {
    "id": "crypt-horrors",
    "name": "Crypt Horrors",
    "unitSize": 3,
    "points": 160,
    "isHero": false,
    "keywords": ["Knights", "Infantry"],
    "baseSize": "50mm"
  },
  {
    "id": "crypt-horrors-2-models",
    "name": "Crypt Horrors (2 models)",
    "unitSize": 2,
    "points": 100,
    "isHero": false,
    "keywords": ["Knights", "Infantry"],
    "notes": "You can include 1 unit of this type for each Crypt Haunter Courtier in your army. This unit cannot be reinforced.",
    "baseSize": "50mm"
  },
  {
    "id": "cryptguard",
    "name": "Cryptguard",
    "unitSize": 10,
    "points": 100,
    "isHero": false,
    "keywords": ["Serfs", "Infantry"],
    "baseSize": "25mm"
  },
  {
    "id": "morbheg-knights",
    "name": "Morbheg Knights",
    "unitSize": 3,
    "points": 180,
    "isHero": false,
    "keywords": ["Knights", "Cavalry"],
    "baseSize": "75 × 42mm"
  },
  {
    "id": "royal-beastflayers",
    "name": "Royal Beastflayers",
    "unitSize": 10,
    "points": 100,
    "isHero": false,
    "keywords": ["Serfs", "Infantry"],
    "notes": "This unit cannot be reinforced.",
    "baseSize": "40mm, 32mm, 28.5mm, 25mm"
  },
  {
    "id": "royal-terrorgheist",
    "name": "Royal Terrorgheist",
    "unitSize": 1,
    "points": 230,
    "isHero": false,
    "keywords": ["Monster"],
    "baseSize": "130mm"
  },
  {
    "id": "royal-zombie-dragon",
    "name": "Royal Zombie Dragon",
    "unitSize": 1,
    "points": 240,
    "isHero": false,
    "keywords": ["Monster"],
    "baseSize": "130mm"
  },
  {
    "id": "varghulf-courtier",
    "name": "Varghulf Courtier",
    "unitSize": 1,
    "points": 130,
    "isHero": false,
    "keywords": ["Beast"],
    "baseSize": "90 × 52mm"
  }
];

// Add units to Flesh Eater Courts faction
factions['flesh-eater-courts'].units = fleshEaterCourtsUnits;

// Write the updated factions data
fs.writeFileSync(factionsPath, JSON.stringify(factions, null, 2), 'utf-8');

console.log('✅ Successfully enriched Flesh Eater Courts with unit data');
console.log(`   Added ${fleshEaterCourtsUnits.length} units`);
