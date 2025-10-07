/**
 * Faction data
 */
import type { FactionData } from '../types/faction.js';

// Hardcoded factions for TypeScript build
// In the browser, Vite will load from the JSON file directly
export const FACTIONS: Record<string, FactionData> = {
  'flesh-eater-courts': {
    id: 'flesh-eater-courts',
    name: 'Flesh Eater Courts',
    grandAlliance: 'DEATH',
    startingGlory: 0,
    startingRenown: 1,
    description: 'Path to Glory faction pack for Flesh Eater Courts',
    sourceFile: 'Faction Pack - Flesh Eater Courts.pdf',
    extractedAt: '2025-10-07T03:47:31.959Z',
  },
  'ossiarch-bonereapers': {
    id: 'ossiarch-bonereapers',
    name: 'Ossiarch Bonereapers',
    grandAlliance: 'DEATH',
    startingGlory: 0,
    startingRenown: 1,
    description: 'Path to Glory faction pack for Ossiarch Bonereapers',
    sourceFile: 'Faction Pack - Ossiarch Bonereapers.pdf',
    extractedAt: '2025-10-07T03:47:31.961Z',
  },
  'slaves-to-darkness': {
    id: 'slaves-to-darkness',
    name: 'Slaves to Darkness',
    grandAlliance: 'CHAOS',
    startingGlory: 0,
    startingRenown: 1,
    description: 'Path to Glory faction pack for Slaves to Darkness',
    sourceFile: 'Faction Pack - Slaves to Darkness.pdf',
    extractedAt: '2025-10-07T03:47:31.961Z',
  },
};

/**
 * Get all factions as an array
 */
export function getAllFactions() {
  return Object.values(FACTIONS);
}

/**
 * Get a faction by ID
 */
export function getFactionById(id: string) {
  return FACTIONS[id];
}

/**
 * Get factions by Grand Alliance
 */
export function getFactionsByGrandAlliance(grandAlliance: string) {
  return getAllFactions().filter(f => f.grandAlliance === grandAlliance);
}
