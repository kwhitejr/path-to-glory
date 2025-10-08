# Ossiarch Bonereapers Unit Extraction

## Summary

Successfully extracted **22 units** from the Ossiarch Bonereapers Faction Pack PDF into structured JSON format.

## Extraction Date
2025-10-07

## Units Extracted

### Named Heroes (5)
1. **Nagash** - Supreme Lord of the Undead (Warmaster, Monster, Wizard 9)
2. **Katakros** - Mortarch of the Necropolis (Warmaster, Infantry)
3. **Arkhan the Black** - Mortarch of Sacrament (Warmaster, Monster, Wizard 3)
4. **Arch-Kavalos Zandtos** - Named cavalry hero (Unique, Cavalry)
5. **Vokmortian** - Master of the Bone-Tithe (Unique, Wizard 2)

### Generic Heroes (5)
6. **Mortisan Boneshaper** - Healing wizard (Wizard 1)
7. **Mortisan Ossifector** - Enhancement wizard (Wizard 1)
8. **Mortisan Soulreaper** - Combat wizard (Wizard 1)
9. **Mortisan Soulmason** - Strike-first wizard (Wizard 2)
10. **Liege-Kavalos** - Cavalry commander (Cavalry)

### Infantry Units (6)
11. **Mortek Guard** - Battleline infantry with shields
12. **Immortis Guard** - Elite bodyguards
13. **Necropolis Stalkers** - Multi-aspect elite infantry
14. **Teratic Cohort** - Ambush specialists
15. **Morghast Archai** - Flying elite with anti-magic armor
16. **Morghast Harbingers** - Flying elite with charge bonuses

### Cavalry Units (1)
17. **Kavalos Deathriders** - Fast cavalry with charge abilities

### Monsters & War Machines (2)
18. **Gothizzar Harvester** - Bone-harvesting monster
19. **Mortek Crawler** - Artillery war machine

### Endless Spells (3)
20. **Nightmare Predator** - Melee manifestation with resurrection
21. **Soulstealer Carrion** - Flying manifestation with control debuff
22. **Bone-tithe Shrieker** - Anti-ward manifestation

## Data Structure

Each unit includes:
- **Core Characteristics**: Move, Health, Save, Control
- **Weapons**: Melee and/or Ranged with full profiles (Attacks, Hit, Wound, Rend, Damage, Abilities)
- **Abilities**: Timing, description, declare/effect text, keywords
- **Keywords**: Unit type and faction keywords
- **Metadata**: Source file and extraction timestamp

## File Organization

```
packages/shared/data/units/ossiarch-bonereapers/
├── nagash.json
├── katakros.json
├── arkhan-the-black.json
├── arch-kavalos-zandtos.json
├── vokmortian.json
├── mortisan-boneshaper.json
├── mortisan-ossifector.json
├── mortisan-soulreaper.json
├── mortisan-soulmason.json
├── liege-kavalos.json
├── mortek-guard.json
├── immortis-guard.json
├── necropolis-stalkers.json
├── teratic-cohort.json
├── morghast-archai.json
├── morghast-harbingers.json
├── kavalos-deathriders.json
├── gothizzar-harvester.json
├── mortek-crawler.json
├── nightmare-predator.json
├── soulstealer-carrion.json
├── bone-tithe-shrieker.json
└── index.ts
```

## TypeScript Integration

Units are exported via barrel files:
- `packages/shared/data/units/ossiarch-bonereapers/index.ts` - Faction-specific export
- `packages/shared/data/units/index.ts` - Top-level export with helper functions

Helper functions available:
- `getUnitsByFaction(factionId)` - Get all units for a faction
- `getUnit(factionId, unitId)` - Get specific unit
- `getAllUnits()` - Get all units across all factions

## Schema Compliance

All units validated against the TypeScript schema defined in:
`packages/shared/src/types/unit.ts`

Key schemas:
- `UnitWarscrollSchema` - Complete unit data
- `WeaponSchema` - Weapon profiles
- `AbilitySchema` - Unit abilities
- `UnitCharacteristicsSchema` - Stats
- `UnitKeywordsSchema` - Keywords

## Next Steps

1. Extract additional factions:
   - Stormcast Eternals
   - Flesh Eater Courts
   - Slaves to Darkness

2. Integrate with frontend:
   - Unit selection in army builder
   - Warscroll display component
   - Ability reference lookup

3. Backend integration:
   - Serve unit data via GraphQL
   - Validation for army composition
   - Unit availability by faction
