import { UnitWarscroll } from '../../src/types/unit';
import { ossiarchBonereapersUnits } from './ossiarch-bonereapers';
import { fleshEaterCourtsUnits } from './flesh-eater-courts';
import { slavesToDarknessUnits } from './slaves-to-darkness';
/**
 * All unit warscrolls organized by faction
 */
export declare const allUnits: Record<string, Record<string, UnitWarscroll>>;
/**
 * Get all units for a specific faction
 */
export declare function getUnitsByFaction(factionId: string): Record<string, UnitWarscroll>;
/**
 * Get a specific unit by faction and unit ID
 */
export declare function getUnit(factionId: string, unitId: string): UnitWarscroll | undefined;
/**
 * Get all units across all factions (flattened)
 */
export declare function getAllUnits(): UnitWarscroll[];
export { ossiarchBonereapersUnits, fleshEaterCourtsUnits, slavesToDarknessUnits };
//# sourceMappingURL=index.d.ts.map