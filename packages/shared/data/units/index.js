import { ossiarchBonereapersUnits } from './ossiarch-bonereapers';
import { fleshEaterCourtsUnits } from './flesh-eater-courts';
import { slavesToDarknessUnits } from './slaves-to-darkness';
/**
 * All unit warscrolls organized by faction
 */
export const allUnits = {
    'ossiarch-bonereapers': ossiarchBonereapersUnits,
    'flesh-eater-courts': fleshEaterCourtsUnits,
    'slaves-to-darkness': slavesToDarknessUnits,
};
/**
 * Get all units for a specific faction
 */
export function getUnitsByFaction(factionId) {
    return allUnits[factionId] || {};
}
/**
 * Get a specific unit by faction and unit ID
 */
export function getUnit(factionId, unitId) {
    return allUnits[factionId]?.[unitId];
}
/**
 * Get all units across all factions (flattened)
 */
export function getAllUnits() {
    return Object.values(allUnits).flatMap(factionUnits => Object.values(factionUnits));
}
export { ossiarchBonereapersUnits, fleshEaterCourtsUnits, slavesToDarknessUnits };
//# sourceMappingURL=index.js.map