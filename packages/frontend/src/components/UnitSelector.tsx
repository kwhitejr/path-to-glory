import { useState } from 'react';
import { UnitWarscroll } from '@path-to-glory/shared';

interface SelectedUnit {
  id: string;
  unitWarscrollId: string;
  name: string;
  customName?: string;
  size: number;
}

interface UnitSelectorProps {
  availableUnits: Record<string, UnitWarscroll>;
  selectedUnits: SelectedUnit[];
  onUnitsChange: (units: SelectedUnit[]) => void;
}

export default function UnitSelector({
  availableUnits,
  selectedUnits,
  onUnitsChange,
}: UnitSelectorProps) {
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [selectedWarscrollId, setSelectedWarscrollId] = useState('');
  const [customName, setCustomName] = useState('');
  const [unitSize, setUnitSize] = useState(1);

  const unitList = Object.values(availableUnits);

  const handleAddUnit = () => {
    if (!selectedWarscrollId) return;

    const warscroll = availableUnits[selectedWarscrollId];
    const newUnit: SelectedUnit = {
      id: `${Date.now()}-${Math.random()}`, // Temporary ID
      unitWarscrollId: selectedWarscrollId,
      name: warscroll.name,
      customName: customName || undefined,
      size: unitSize,
    };

    onUnitsChange([...selectedUnits, newUnit]);

    // Reset form
    setSelectedWarscrollId('');
    setCustomName('');
    setUnitSize(1);
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
          <div>
            <label className="label text-sm">Unit Type *</label>
            <select
              className="input text-sm"
              value={selectedWarscrollId}
              onChange={(e) => setSelectedWarscrollId(e.target.value)}
            >
              <option value="">Select a unit...</option>
              {unitList
                .sort((a, b) => {
                  // Sort Heroes first, then by name
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
                      {prefix}
                      {unit.name}
                    </option>
                  );
                })}
            </select>
            {selectedWarscrollId && (
              <p className="mt-1 text-xs text-gray-600">
                {availableUnits[selectedWarscrollId].subtitle ||
                  availableUnits[selectedWarscrollId].keywords.unit.join(', ')}
              </p>
            )}
          </div>

          <div>
            <label className="label text-sm">Custom Name (optional)</label>
            <input
              type="text"
              className="input text-sm"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g., The Crimson Guard"
            />
          </div>

          <div>
            <label className="label text-sm">Unit Size</label>
            <input
              type="number"
              min="1"
              className="input text-sm w-24"
              value={unitSize}
              onChange={(e) => setUnitSize(parseInt(e.target.value) || 1)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of models in this unit
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddUnit}
            disabled={!selectedWarscrollId}
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
            const warscroll = availableUnits[unit.unitWarscrollId];
            return (
              <div
                key={unit.id}
                className="card bg-white border border-gray-200 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {unit.customName || unit.name}
                  </div>
                  {unit.customName && (
                    <div className="text-sm text-gray-600">{unit.name}</div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    Size: {unit.size} •{' '}
                    {warscroll.keywords.unit.join(', ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveUnit(unit.id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-3"
                >
                  Remove
                </button>
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
