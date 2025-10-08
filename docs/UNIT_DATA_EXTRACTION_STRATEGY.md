# Unit Data Extraction Strategy

## Analysis of Ossiarch Bonereapers Faction Pack

### Warscroll Structure Pattern

Each unit warscroll follows this consistent format:

#### Header Section
- **MOVE**: Movement characteristic (e.g., "10\"", "5\"")
- **HEALTH**: Health characteristic (number)
- **SAVE**: Save characteristic (e.g., "3+", "4+")
- **CONTROL**: Control value (number)
- **Unit Name**: Full name (e.g., "NAGASH", "KATAKROS")
- **Unit Subtitle**: Role/title (e.g., "SUPREME LORD OF THE UNDEAD")

#### Weapons Tables
**RANGED WEAPONS** (if applicable):
- Columns: Name | Rng | Atk | Hit | Wnd | Rnd | Dmg | Ability

**MELEE WEAPONS**:
- Columns: Name | Atk | Hit | Wnd | Rnd | Dmg | Ability

#### Abilities Section
Multiple ability types with different trigger conditions:
- **Passive**: Always active effects
- **Once Per Battle**: Single use abilities
- **Once Per Turn**: Can use each turn
- **Your Hero Phase**: Activated during hero phase
- **Any Combat Phase**: Combat phase abilities
- **Reaction**: Triggered by opponent actions

Each ability has:
- Name (in caps)
- Description/flavor text
- **Declare**: Conditions for using the ability
- **Effect**: What the ability does
- **Keywords**: Categorization (e.g., Spell, Rampage, etc.)

#### Keywords Section
- Unit category keywords (e.g., Hero, Monster, Infantry, Cavalry, Wizard, Fly, Ward)
- Faction keywords (e.g., Death, Ossiarch Bonereapers)
- Special traits (e.g., Warmaster, Unique)

### Normalized Schema Design

```typescript
interface UnitWarscroll {
  id: string;                    // Unique identifier (slugified name)
  name: string;                  // Unit name
  subtitle?: string;             // Optional role/title
  factionId: string;            // Reference to faction

  // Core characteristics
  characteristics: {
    move: string;                // e.g., "10\""
    health: number;
    save: string;                // e.g., "3+"
    control: number;
  };

  // Weapons
  rangedWeapons?: Weapon[];
  meleeWeapons: Weapon[];

  // Abilities
  abilities: Ability[];

  // Keywords and traits
  keywords: {
    unit: string[];              // e.g., ["Hero", "Monster", "Wizard (3)"]
    faction: string[];           // e.g., ["Death", "Ossiarch Bonereapers"]
  };

  // Metadata
  sourceFile: string;
  extractedAt: string;
}

interface Weapon {
  name: string;
  range?: string;                // Only for ranged weapons
  attacks: number | string;      // Can be "D3", "2D6", etc.
  hit: string;                   // e.g., "3+"
  wound: string;                 // e.g., "3+"
  rend: number | string;         // e.g., 2, "-"
  damage: number | string;       // e.g., "D6", 3
  ability?: string;              // e.g., "Crit (2 Hits)", "Companion"
}

interface Ability {
  name: string;
  timing: AbilityTiming;
  description: string;           // Flavor text
  declare?: string;              // Declare conditions
  effect: string;                // Effect description
  keywords?: string[];           // e.g., ["Spell", "Rampage"]
  restrictions?: string;         // e.g., "Once Per Battle", "Once Per Turn (Army)"
}

type AbilityTiming =
  | "Passive"
  | "Your Hero Phase"
  | "Your Movement Phase"
  | "Any Charge Phase"
  | "Any Combat Phase"
  | "Any Shooting Phase"
  | "End of Any Turn"
  | "Reaction"
  | "Deployment Phase";
```

### Extraction Process

1. **Parse warscroll sections** using text markers:
   - "WARSCROLL" header indicates start
   - "KEYWORDS" section indicates end
   - Page breaks separate units

2. **Extract characteristics** from header:
   - Use regex patterns for MOVE, HEALTH, SAVE, CONTROL
   - Extract unit name (all caps line)
   - Extract subtitle (next line after name)

3. **Parse weapon tables**:
   - Look for "RANGED WEAPONS" or "MELEE WEAPONS" headers
   - Parse table rows (space-separated values)
   - Handle special formats (D3, D6, 2D6, -, etc.)

4. **Extract abilities**:
   - Identify ability blocks by timing keywords
   - Extract name (first all-caps line in block)
   - Parse Declare/Effect sections
   - Capture keywords at end of ability block

5. **Parse keywords**:
   - Split KEYWORDS section into unit vs faction keywords
   - Handle special formatting (e.g., "Wizard (3)" includes level)

### Data Validation

- All characteristics must be present
- At least one melee weapon required
- Keywords must have at least faction keywords
- Ability timings must match known values
- Weapon stats must be valid formats

### Storage Format

Units will be stored as JSON files organized by faction:
```
packages/shared/data/units/
  ossiarch-bonereapers/
    nagash.json
    katakros.json
    mortisan-boneshaper.json
    ...
  stormcast-eternals/
    ...
```

Each JSON file contains a single UnitWarscroll object.

An index file will export all units for use in the application:
```typescript
// packages/shared/data/units/index.ts
export * from './ossiarch-bonereapers';
export * from './stormcast-eternals';
```
