/**
 * Faction data
 */
import type { FactionData } from '../../src/types/faction.js';
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

/**
 * Get arcane tome for a faction
 */
export function getArcaneTomeByFaction(factionId: string) {
  const faction = getFactionById(factionId);
  return faction?.arcaneTome;
}

/**
 * Get spell lore for a faction
 */
export function getSpellLoreByFaction(factionId: string) {
  return getArcaneTomeByFaction(factionId)?.spellLore;
}

/**
 * Get prayer lore for a faction
 */
export function getPrayerLoreByFaction(factionId: string) {
  return getArcaneTomeByFaction(factionId)?.prayerLore;
}

/**
 * Get manifestation lore for a faction
 */
export function getManifestationLoreByFaction(factionId: string) {
  return getArcaneTomeByFaction(factionId)?.manifestationLore;
}

/**
 * Get battle formations for a faction
 */
export function getBattleFormationsByFaction(factionId: string) {
  const faction = getFactionById(factionId);
  return faction?.battleFormations || [];
}
