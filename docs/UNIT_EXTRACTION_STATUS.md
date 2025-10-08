# Unit Data Extraction Status

## Overview

This document tracks the status of unit warscroll extraction from faction pack PDFs.

## Extraction Progress

### ✅ Completed Factions

#### Ossiarch Bonereapers
- **Status**: 100% Complete
- **Units Extracted**: 22/22
- **Location**: `packages/shared/data/units/ossiarch-bonereapers/`
- **Details**: All units fully extracted with complete warscroll data
  - 5 Named Heroes
  - 5 Generic Heroes
  - 6 Infantry Units
  - 1 Cavalry Unit
  - 2 Monsters/War Machines
  - 3 Endless Spells

### 🟡 Partially Complete Factions

#### Flesh Eater Courts
- **Status**: 6% Complete (2/34 units)
- **Units Extracted**: 2 (Ushoran, Abhorrant Gorewarden)
- **Remaining**: ~32 units
- **Priority Units Needed**:
  - Abhorrant Ghoul King on Royal Terrorgheist
  - Abhorrant Ghoul King on Royal Zombie Dragon
  - Crypt Ghouls (battleline)
  - Crypt Horrors
  - Crypt Flayers
  - Morbheg Knights

### ⏸️ Not Started Factions

#### Slaves to Darkness
- **Status**: 0% Complete
- **Estimated Units**: ~30-35
- **Text File**: Already extracted
- **Priority Units**:
  - Archaon the Everchosen
  - Be'lakor
  - Chaos Warriors (battleline)
  - Chaos Knights
  - Chaos Chosen

#### Stormcast Eternals
- **Status**: 0% Complete
- **Estimated Units**: ~40-50 (largest faction)
- **Text Files**: 2 files (Faction Pack + Battle Tome Supplement)
- **Priority Units**:
  - Liberators (battleline)
  - Vindictors (battleline)
  - Judicators
  - Annihilators
  - Lord-Imperatant

## Extraction Methodology

### Manual Extraction Process

1. Read faction pack text file
2. Identify warscroll sections
3. Parse unit characteristics (Move, Health, Save, Control)
4. Extract weapon profiles (ranged and melee)
5. Extract abilities with timing and effects
6. Capture keywords and metadata
7. Validate against TypeScript schema
8. Create JSON file

### Data Quality

**Ossiarch Bonereapers**: ⭐⭐⭐⭐⭐
- Fully validated
- Complete weapon profiles
- All abilities with declare/effect structure
- Proper keyword organization

**Flesh Eater Courts**: ⭐⭐⭐
- Partial extraction
- Needs completion

**Other Factions**: Not yet extracted

## Automation Challenges

Manual extraction is time-consuming due to:
1. **Inconsistent PDF formatting**: Text extraction varies by document
2. **Complex ability text**: Multi-line declare/effect structures
3. **Weapon table parsing**: Variable column spacing
4. **Keyword extraction**: Multiple keyword types (unit vs faction)
5. **Special characters**: Dice notation (D3, D6, 2D6), symbols

A fully automated extraction would require:
- Advanced PDF parsing (pdfplumber with custom table detection)
- Natural language processing for ability text
- Manual review and validation of all extracted data

## Recommended Approach

### Phase 1: Core Units (Priority)
Extract essential units for each faction to enable basic gameplay:
- 1-2 Named heroes per faction
- 2-3 Generic heroes per faction
- 2-3 Battleline units per faction
- ~5-8 units per faction total

**Estimated effort**: 4-6 hours manual work

### Phase 2: Full Extraction (Future)
Complete all remaining units:
- All heroes and special characters
- All troop choices
- Monsters and war machines
- Endless spells and terrain

**Estimated effort**: 20-30 hours manual work

### Phase 3: Automation (Optional)
Develop automated extraction pipeline:
- PDF parser with table detection
- Ability text pattern matching
- Validation against schema
- Manual review workflow

**Estimated effort**: 40-60 hours development

## Current Data Structure

All extracted units follow this schema:

```typescript
{
  id: string;                    // Slugified name
  name: string;                  // Display name
  subtitle?: string;             // Optional title
  factionId: string;            // Faction reference
  characteristics: {
    move: string;
    health: number;
    save: string;
    control: number;
  };
  rangedWeapons?: Weapon[];
  meleeWeapons: Weapon[];
  abilities: Ability[];
  keywords: {
    unit: string[];
    faction: string[];
  };
  sourceFile: string;
  extractedAt: string;
}
```

## Next Steps

### Immediate (High Priority)
1. Extract 5-8 core units from Flesh Eater Courts
2. Extract 5-8 core units from Slaves to Darkness
3. Extract 5-8 core units from Stormcast Eternals
4. Create index files for each faction
5. Update main units index

### Short Term (Medium Priority)
1. Complete all Flesh Eater Courts units
2. Complete all Slaves to Darkness units
3. Complete all Stormcast Eternals units

### Long Term (Low Priority)
1. Extract additional factions (Skaven, etc.)
2. Develop automated extraction pipeline
3. Add validation tests for unit data
4. Create unit data versioning system

## Tools and Scripts

### Available Scripts

1. **`extract_pdf_text.py`** - Convert PDFs to text
   - Status: ✅ Working
   - Usage: `python scripts/extract_pdf_text.py <pdf_path>`

2. **`extract_units_from_text.py`** - Generate unit stubs
   - Status: ⚠️ Needs refinement
   - Usage: `python scripts/extract_units_from_text.py <faction-id>`
   - Note: Creates stubs that need manual completion

### Manual Extraction Workflow

1. Open faction pack text file
2. Use grep to find warscroll sections
3. Read relevant sections with line offsets
4. Create JSON files following schema
5. Validate with TypeScript type checking

## Contact

For questions about unit data extraction, see:
- `docs/UNIT_DATA_EXTRACTION_STRATEGY.md` - Extraction strategy
- `packages/shared/src/types/unit.ts` - TypeScript schema
- `docs/OSSIARCH_BONEREAPERS_EXTRACTION.md` - Completed example
