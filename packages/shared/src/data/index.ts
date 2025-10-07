/**
 * Faction data loader
 */
import factionsData from './factions.json' assert { type: 'json' };
import type { FactionsData } from '../types/faction.js';

export const FACTIONS: FactionsData = factionsData;

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
