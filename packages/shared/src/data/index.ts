/**
 * Faction data
 */
import type { FactionData } from '../types/faction.js';
import factionsJson from './factions.json';

// Load factions from JSON file
export const FACTIONS: Record<string, FactionData> = factionsJson as Record<string, FactionData>;

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
