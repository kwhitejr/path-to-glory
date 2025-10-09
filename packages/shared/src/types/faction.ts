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
});

export type FactionData = z.infer<typeof FactionSchema>;

/**
 * Collection of all factions
 */
export const FactionsSchema = z.record(z.string(), FactionSchema);
export type FactionsData = z.infer<typeof FactionsSchema>;
