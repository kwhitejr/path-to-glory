# Roster Implementation Plan

## Overview
Implementation plan for completing Path to Glory roster features based on the official roster structure from `docs/references/forms/Path To Glory Roster.txt`.

## Current State vs. Required Features

### ✅ Already Implemented
- Faction selection
- Army name
- Units with rank, renown, enhancements, reinforced status
- User authentication and army ownership

### ❌ Missing from Schema/Models

According to the official Path to Glory Roster, we need to add:

1. **Battle Formation** - A strategic formation choice for the army
2. **Realm of Origin** - The Mortal Realm the army hails from (8 standard realms)
3. **Warlord** - Distinct from regular units (hero/commander with special tracking)
4. **Quest Log**:
   - Current Quest (name/description)
   - Quest Points (progress toward completion)
   - Quests Completed (history)
5. **Notable Events** - Army history/background tracking (freeform text)
6. **Arcane Tome**:
   - Spell Lore (up to 6 spells)
   - Prayer Lore (up to 6 prayers)
   - Manifestation Lore (up to 6 manifestations)

## Implementation Approach

### Phase 1: Schema & Structure (Option 1) - CURRENT
**Goal**: Add all missing fields to schema/models with minimal PDF processing.

**Approach**:
- Add schema fields for all missing roster features
- Hardcode Realms of Origin (8 standard Mortal Realms)
- Use freeform text fields for Battle Formation, Quests, and Arcane Tome
- Distinguish Warlord from Units in schema
- Update GraphQL schema, TypeScript models, and frontend UI

**Benefits**:
- Complete roster structure immediately
- Unblocked for frontend development
- Can iterate on data later

**Hardcoded Reference Data**:
- **Realms of Origin**: Aqshy (Fire), Chamon (Metal), Ghur (Beasts), Ghyran (Life), Hysh (Light), Shyish (Death), Ulgu (Shadow), Azyr (Heavens)

### Phase 2: Reference Data Extraction (Option 2) - FUTURE
**Goal**: Extract faction-specific reference data from PDFs.

**Data to Extract by PDF Type**:

| Feature | Data Needed | Source Document | Processing Priority |
|---------|-------------|-----------------|---------------------|
| **Battle Formations** | List of formations per faction | Faction Packs / Battletomes | HIGH |
| **Quests** | Available quests per faction | Path to Glory rules / Faction Packs | HIGH |
| **Spell Lore** | Spell lists per faction | Faction Packs / Battletomes | MEDIUM |
| **Prayer Lore** | Prayer lists per faction | Faction Packs / Battletomes | MEDIUM |
| **Manifestation Lore** | Manifestation lists | Faction Packs / Battletomes | MEDIUM |
| **Enhancements** | Artefacts of Power | Faction Packs / Battletomes | LOW (already have structure) |
| **Path Abilities** | Heroic Traits | Faction Packs / Battletomes | LOW (already have structure) |

**PDF Processing Plan**:
1. Start with one faction (e.g., Stormcast Eternals - already have PDF extracted)
2. Extract Battle Formations and Quests
3. Update faction data schema to include new lists
4. Update frontend to use dropdowns instead of freeform fields
5. Repeat for each faction incrementally

**Schema Changes Required**:
```typescript
// Add to FactionSchema in packages/shared/src/types/faction.ts
{
  battleFormations: z.array(BattleFormationSchema).optional(),
  quests: z.array(QuestSchema).optional(),
  spellLore: z.array(SpellSchema).optional(),
  prayerLore: z.array(PrayerSchema).optional(),
  manifestationLore: z.array(ManifestationSchema).optional(),
}
```

## Schema Design Decisions

### Warlord vs Units
- **Warlord**: Single hero unit, required, special tracking (stored in Army model)
- **Units**: Supporting units, multiple allowed (stored as separate Unit models)
- Both share similar fields (rank, renown, enhancements) but have different constraints

### Quest Log Storage
Store as part of Army model:
```typescript
{
  currentQuest: string | null,
  questPoints: number,
  completedQuests: string[] // Array of quest names
}
```

### Arcane Tome Storage
Store as part of Army model:
```typescript
{
  spellLore: string[], // Up to 6
  prayerLore: string[], // Up to 6
  manifestationLore: string[] // Up to 6
}
```

## Migration Path

### Immediate (Phase 1)
1. Update GraphQL schema with new fields
2. Update DynamoDB models (ArmyModel, UnitModel)
3. Update frontend forms (Create Army, Edit Army, Unit modals)
4. Add Realm of Origin dropdown with hardcoded values
5. Add freeform text fields for Battle Formation, Quests, Arcane Tome
6. Add Notable Events text area
7. Distinguish Warlord in UI (first unit, marked as commander)

### Future (Phase 2)
1. Process Faction Pack PDFs to extract reference data
2. Update faction data JSON files with extracted lists
3. Replace freeform fields with validated dropdowns
4. Add quest tracking UI with progress indicators
5. Add arcane tome management UI with spell/prayer/manifestation selection

## Notes
- **Breaking Changes Acceptable**: Per CLAUDE.md, we're in active refactoring phase
- **Mobile-First**: All UI changes must work on mobile screens first
- **Data Source**: Official GW PDFs in `docs/references/` are source of truth
- **No Backwards Compatibility**: Clean slate approach, replace old patterns entirely

## Status
- **Phase 1**: ✅ COMPLETED (2025-10-10)
- **Phase 2**: PLANNED (implement after context clear)

## Phase 1 Completion Summary

All missing roster fields have been successfully added to the schema and UI:

### Schema Updates
- ✅ Added `RealmOfOrigin` enum with 8 Mortal Realms
- ✅ Updated `Army` type with all roster fields
- ✅ Updated `Unit` type with `warscroll`, `isWarlord`, `pathAbilities`
- ✅ Updated GraphQL input types for create/update operations
- ✅ Updated DynamoDB models to match schema

### Frontend Updates
- ✅ Create Army form includes Realm, Battle Formation, Background fields
- ✅ Edit Army form includes all roster management fields (Quest Log, Arcane Tome, Notable Events)
- ✅ Army Detail page displays all new roster information in organized sections
- ✅ GraphQL operations updated to fetch new fields
- ✅ Build verified and passing

### Next Steps (Phase 2)
When ready to implement reference data extraction:
1. Process faction PDFs (already converted to .txt files)
2. Extract Battle Formations, Quests, and Arcane Tome data
3. Update faction data schema and JSON files
4. Replace freeform text inputs with validated dropdowns

---
Last Updated: 2025-10-10
