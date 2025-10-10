import { z } from 'zod';

/**
 * Enhancement (Artefact of Power) that can be given to a hero unit
 */
export const EnhancementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Enhancement = z.infer<typeof EnhancementSchema>;

/**
 * Path Ability (Heroic Trait) that can be given to a hero unit
 */
export const PathAbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type PathAbility = z.infer<typeof PathAbilitySchema>;

/**
 * Unit from battle profiles - represents a hero or regular unit
 */
export const UnitProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  unitSize: z.union([z.number(), z.string()]), // Can be a number or range like "3-6"
  points: z.number(),
  isHero: z.boolean(),
  regimentOptions: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  notes: z.string().optional(),
  baseSize: z.string().optional(),
});

export type UnitProfile = z.infer<typeof UnitProfileSchema>;

/**
 * Schema for faction data extracted from PDFs
 */
export const FactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  grandAlliance: z.string(),
  startingGlory: z.number().int().min(0),
  startingRenown: z.number().int().min(0),
  description: z.string().optional(),
  sourceFile: z.string(), // PDF filename for reference
  extractedAt: z.string(), // ISO timestamp
  enhancements: z.array(EnhancementSchema).optional(), // Artefacts of Power
  pathAbilities: z.array(PathAbilitySchema).optional(), // Heroic Traits
  units: z.array(UnitProfileSchema).optional(), // Units from battle profiles
});

export type FactionData = z.infer<typeof FactionSchema>;

/**
 * Collection of all factions
 */
export const FactionsSchema = z.record(z.string(), FactionSchema);
export type FactionsData = z.infer<typeof FactionsSchema>;
