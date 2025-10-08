import { UnitWarscroll } from '../../src/types/unit';
import { ossiarchBonereapersUnits } from './ossiarch-bonereapers';
import { fleshEaterCourtsUnits } from './flesh-eater-courts';
import { slavesToDarknessUnits } from './slaves-to-darkness';
import { stormcastEternalsUnits } from './stormcast-eternals';

/**
 * All unit warscrolls organized by faction
 */
export const allUnits: Record<string, Record<string, UnitWarscroll>> = {
  'ossiarch-bonereapers': ossiarchBonereapersUnits,
  'flesh-eater-courts': fleshEaterCourtsUnits,
  'slaves-to-darkness': slavesToDarknessUnits,
  'stormcast-eternals': stormcastEternalsUnits,
};

/**
 * Get all units for a specific faction
 */
export function getUnitsByFaction(factionId: string): Record<string, UnitWarscroll> {
  return allUnits[factionId] || {};
}

/**
 * Get a specific unit by faction and unit ID
 */
export function getUnit(factionId: string, unitId: string): UnitWarscroll | undefined {
  return allUnits[factionId]?.[unitId];
}

/**
 * Get all units across all factions (flattened)
 */
export function getAllUnits(): UnitWarscroll[] {
  return Object.values(allUnits).flatMap(factionUnits => Object.values(factionUnits));
}

export { ossiarchBonereapersUnits, fleshEaterCourtsUnits, slavesToDarknessUnits, stormcastEternalsUnits };
