import { useState } from 'react';
import { UnitWarscroll, getFactionById } from '@path-to-glory/shared';

const RANKS = ['Regular', 'Veteran', 'Elite'];

interface SelectedUnit {
  id: string;
  warscroll: string;
  warscrollId: string;
  name: string;
  rank: string;
  renown: number;
  reinforced: boolean;
  enhancement: string;
  pathAbility: string;
}

interface UnitSelectorProps {
  factionId: string;
  availableUnits: Record<string, UnitWarscroll>;
  selectedUnits: SelectedUnit[];
  onUnitsChange: (units: SelectedUnit[]) => void;
}

export default function UnitSelector({
  factionId,
  availableUnits,
  selectedUnits,
  onUnitsChange,
}: UnitSelectorProps) {
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [formData, setFormData] = useState({
    warscrollId: '',
    customName: '',
    rank: 'Regular',
    renown: 0,
    reinforced: false,
    enhancement: '',
    pathAbility: '',
  });

  const unitList = Object.values(availableUnits);
  const faction = getFactionById(factionId);

  const handleAddUnit = () => {
    if (!formData.warscrollId) return;

    const warscroll = availableUnits[formData.warscrollId];
    const unitId = `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newUnit: SelectedUnit = {
      id: unitId,
      warscroll: warscroll.name,
      warscrollId: formData.warscrollId,
      name: formData.customName || warscroll.name,
      rank: formData.rank,
      renown: formData.renown,
      reinforced: formData.reinforced,
      enhancement: formData.enhancement,
      pathAbility: formData.pathAbility,
    };

    onUnitsChange([...selectedUnits, newUnit]);

    // Reset form
    setFormData({
      warscrollId: '',
      customName: '',
      rank: 'Regular',
      renown: 0,
      reinforced: false,
      enhancement: '',
      pathAbility: '',
    });
    setShowAddUnit(false);
  };

  const handleRemoveUnit = (unitId: string) => {
    onUnitsChange(selectedUnits.filter((u) => u.id !== unitId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Units</h3>
        <button
          type="button"
          onClick={() => setShowAddUnit(!showAddUnit)}
          className="btn-secondary text-sm"
        >
          {showAddUnit ? 'Cancel' : '+ Add Unit'}
        </button>
      </div>

      {/* Add Unit Form */}
      {showAddUnit && (
        <div className="card bg-gray-50 border border-gray-200 space-y-3">
          {/* Unit Type */}
          <div>
            <label className="label text-sm">Unit Type *</label>
            <select
              className="input text-sm"
              value={formData.warscrollId}
              onChange={(e) => setFormData({ ...formData, warscrollId: e.target.value })}
            >
              <option value="">Select a unit...</option>
              {unitList
                .sort((a, b) => {
                  const aIsHero = a.keywords.unit.includes('Hero');
                  const bIsHero = b.keywords.unit.includes('Hero');
                  if (aIsHero && !bIsHero) return -1;
                  if (!aIsHero && bIsHero) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map((unit) => {
                  const isHero = unit.keywords.unit.includes('Hero');
                  const prefix = isHero ? '[Hero] ' : '';
                  return (
                    <option key={unit.id} value={unit.id}>
                      {prefix}{unit.name}
                    </option>
                  );
                })}
            </select>
            {formData.warscrollId && (
              <p className="mt-1 text-xs text-gray-600">
                {availableUnits[formData.warscrollId].subtitle ||
                  availableUnits[formData.warscrollId].keywords.unit.join(', ')}
              </p>
            )}
          </div>

          {/* Custom Name */}
          <div>
            <label className="label text-sm">Custom Name (optional)</label>
            <input
              type="text"
              className="input text-sm"
              value={formData.customName}
              onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
              placeholder="e.g., The Crimson Guard"
            />
          </div>

          {/* Rank */}
          <div>
            <label className="label text-sm">Rank</label>
            <select
              className="input text-sm"
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            >
              {RANKS.map((rank) => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>

          {/* Renown */}
          <div>
            <label className="label text-sm">Renown</label>
            <input
              type="number"
              min="0"
              className="input text-sm w-24"
              value={formData.renown}
              onChange={(e) => setFormData({ ...formData, renown: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Reinforced */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reinforced"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.reinforced}
              onChange={(e) => setFormData({ ...formData, reinforced: e.target.checked })}
            />
            <label htmlFor="reinforced" className="ml-2 text-sm text-gray-700">
              Reinforced Unit
            </label>
          </div>

          {/* Enhancement */}
          <div>
            <label className="label text-sm">Enhancement (Artefact of Power)</label>
            <select
              className="input text-sm"
              value={formData.enhancement}
              onChange={(e) => setFormData({ ...formData, enhancement: e.target.value })}
            >
              <option value="">None</option>
              {faction?.enhancements?.map((enh) => (
                <option key={enh.id} value={enh.name}>{enh.name}</option>
              ))}
            </select>
            {formData.enhancement && faction && (
              <p className="mt-1 text-xs text-gray-600">
                {faction.enhancements?.find(e => e.name === formData.enhancement)?.description}
              </p>
            )}
          </div>

          {/* Path Ability */}
          <div>
            <label className="label text-sm">Path Ability (Heroic Trait)</label>
            <select
              className="input text-sm"
              value={formData.pathAbility}
              onChange={(e) => setFormData({ ...formData, pathAbility: e.target.value })}
            >
              <option value="">None</option>
              {faction?.pathAbilities?.map((ability) => (
                <option key={ability.id} value={ability.name}>{ability.name}</option>
              ))}
            </select>
            {formData.pathAbility && faction && (
              <p className="mt-1 text-xs text-gray-600">
                {faction.pathAbilities?.find(a => a.name === formData.pathAbility)?.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddUnit}
            disabled={!formData.warscrollId}
            className="btn-primary w-full text-sm"
          >
            Add Unit
          </button>
        </div>
      )}

      {/* Selected Units List */}
      {selectedUnits.length > 0 ? (
        <div className="space-y-2">
          {selectedUnits.map((unit) => {
            return (
              <div
                key={unit.id}
                className="card bg-white border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium">{unit.name}</div>
                    <div className="text-sm text-gray-600">{unit.warscroll}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUnit(unit.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Rank: {unit.rank}</div>
                  <div>Renown: {unit.renown}</div>
                  {unit.reinforced && <div className="col-span-2 text-primary-600">Reinforced</div>}
                  {unit.enhancement && <div className="col-span-2">Enhancement: {unit.enhancement}</div>}
                  {unit.pathAbility && <div className="col-span-2">Path Ability: {unit.pathAbility}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No units added yet. Click "Add Unit" to begin building your roster.
        </p>
      )}
    </div>
  );
}

export { type SelectedUnit };
