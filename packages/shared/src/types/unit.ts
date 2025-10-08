import { z } from 'zod';

/**
 * Schema for unit warscroll data extracted from faction pack PDFs
 */

export const WeaponSchema = z.object({
  name: z.string(),
  range: z.string().optional(), // Only for ranged weapons
  attacks: z.union([z.number(), z.string()]), // Can be "D3", "2D6", etc.
  hit: z.string(), // e.g., "3+"
  wound: z.string(), // e.g., "3+"
  rend: z.union([z.number(), z.string()]), // e.g., 2, "-"
  damage: z.union([z.number(), z.string()]), // e.g., "D6", 3
  ability: z.string().optional(), // e.g., "Crit (2 Hits)", "Companion"
});

export type Weapon = z.infer<typeof WeaponSchema>;

export const AbilityTimingSchema = z.enum([
  'Passive',
  'Your Hero Phase',
  'Your Movement Phase',
  'Your Shooting Phase',
  'Any Charge Phase',
  'Any Combat Phase',
  'Any Shooting Phase',
  'End of Any Turn',
  'Reaction',
  'Deployment Phase',
  'Once Per Battle',
  'Once Per Turn',
]);

export type AbilityTiming = z.infer<typeof AbilityTimingSchema>;

export const AbilitySchema = z.object({
  name: z.string(),
  timing: z.string(), // Free-form to capture "Once Per Battle (Army), Your Hero Phase"
  description: z.string(), // Flavor text
  declare: z.string().optional(), // Declare conditions
  effect: z.string(), // Effect description
  keywords: z.array(z.string()).optional(), // e.g., ["Spell", "Rampage"]
  restrictions: z.string().optional(), // e.g., "Once Per Battle", "Once Per Turn (Army)"
});

export type Ability = z.infer<typeof AbilitySchema>;

export const UnitCharacteristicsSchema = z.object({
  move: z.string(), // e.g., "10\""
  health: z.number(),
  save: z.string(), // e.g., "3+"
  control: z.number(),
});

export type UnitCharacteristics = z.infer<typeof UnitCharacteristicsSchema>;

export const UnitKeywordsSchema = z.object({
  unit: z.array(z.string()), // e.g., ["Hero", "Monster", "Wizard (3)"]
  faction: z.array(z.string()), // e.g., ["Death", "Ossiarch Bonereapers"]
});

export type UnitKeywords = z.infer<typeof UnitKeywordsSchema>;

export const UnitWarscrollSchema = z.object({
  id: z.string(), // Unique identifier (slugified name)
  name: z.string(), // Unit name
  subtitle: z.string().optional(), // Optional role/title
  factionId: z.string(), // Reference to faction

  // Core characteristics
  characteristics: UnitCharacteristicsSchema,

  // Weapons
  rangedWeapons: z.array(WeaponSchema).optional(),
  meleeWeapons: z.array(WeaponSchema),

  // Abilities
  abilities: z.array(AbilitySchema),

  // Keywords and traits
  keywords: UnitKeywordsSchema,

  // Metadata
  sourceFile: z.string(),
  extractedAt: z.string(), // ISO timestamp
});

export type UnitWarscroll = z.infer<typeof UnitWarscrollSchema>;

/**
 * Collection of all unit warscrolls
 */
export const UnitsSchema = z.record(z.string(), UnitWarscrollSchema);
export type UnitsData = z.infer<typeof UnitsSchema>;
