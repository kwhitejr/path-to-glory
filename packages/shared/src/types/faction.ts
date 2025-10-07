import { z } from 'zod';

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
});

export type FactionData = z.infer<typeof FactionSchema>;

/**
 * Collection of all factions
 */
export const FactionsSchema = z.record(z.string(), FactionSchema);
export type FactionsData = z.infer<typeof FactionsSchema>;
