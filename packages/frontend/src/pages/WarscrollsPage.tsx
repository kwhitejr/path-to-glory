import { useState, useMemo } from 'react';
import { getAllUnits, getAllFactions, type UnitWarscroll } from '@path-to-glory/shared';

type GrandAlliance = 'Order' | 'Chaos' | 'Death' | 'Destruction' | '';

export default function WarscrollsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrandAlliance, setSelectedGrandAlliance] = useState<GrandAlliance>('');
  const [selectedFaction, setSelectedFaction] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitWarscroll | null>(null);

  // Get all units and factions
  const allWarscrolls = useMemo(() => getAllUnits(), []);
  const allFactions = useMemo(() => getAllFactions(), []);

  // Extract unique keywords from all units
  const allKeywords = useMemo(() => {
    const keywordSet = new Set<string>();
    allWarscrolls.forEach(unit => {
      unit.keywords.unit.forEach(k => keywordSet.add(k));
      unit.keywords.faction.forEach(k => keywordSet.add(k));
    });
    return Array.from(keywordSet).sort();
  }, [allWarscrolls]);

  // Grand alliances
  const grandAlliances: GrandAlliance[] = ['Order', 'Chaos', 'Death', 'Destruction'];

  // Get factions for selected grand alliance
  const availableFactions = useMemo(() => {
    if (!selectedGrandAlliance) return allFactions;
    return allFactions.filter(f => f.grandAlliance === selectedGrandAlliance);
  }, [allFactions, selectedGrandAlliance]);

  // Filter units based on search and filters
  const filteredUnits = useMemo(() => {
    return allWarscrolls.filter(unit => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = unit.name.toLowerCase().includes(query);
        const matchesSubtitle = unit.subtitle?.toLowerCase().includes(query);
        const matchesAbility = unit.abilities.some(a =>
          a.name.toLowerCase().includes(query) ||
          a.effect.toLowerCase().includes(query)
        );
        const matchesKeyword = unit.keywords.unit.some(k => k.toLowerCase().includes(query)) ||
                               unit.keywords.faction.some(k => k.toLowerCase().includes(query));

        if (!matchesName && !matchesSubtitle && !matchesAbility && !matchesKeyword) {
          return false;
        }
      }

      // Faction filter
      if (selectedFaction && unit.factionId !== selectedFaction) {
        return false;
      }

      // Grand alliance filter (if no specific faction selected)
      if (selectedGrandAlliance && !selectedFaction) {
        const faction = allFactions.find(f => f.id === unit.factionId);
        if (faction?.grandAlliance !== selectedGrandAlliance) {
          return false;
        }
      }

      // Keywords filter
      if (selectedKeywords.length > 0) {
        const unitKeywords = [...unit.keywords.unit, ...unit.keywords.faction];
        const hasAllKeywords = selectedKeywords.every(k =>
          unitKeywords.some(uk => uk === k)
        );
        if (!hasAllKeywords) {
          return false;
        }
      }

      return true;
    });
  }, [allWarscrolls, searchQuery, selectedFaction, selectedGrandAlliance, selectedKeywords, allFactions]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGrandAlliance('');
    setSelectedFaction('');
    setSelectedKeywords([]);
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const activeFilterCount = [
    selectedGrandAlliance,
    selectedFaction,
    ...selectedKeywords
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warscrolls</h1>
          <p className="text-gray-600 mt-1">
            Browse {allWarscrolls.length} unit warscrolls
            {filteredUnits.length !== allWarscrolls.length && ` (${filteredUnits.length} shown)`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary relative"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, abilities, keywords..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grand Alliance filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grand Alliance
              </label>
              <select
                value={selectedGrandAlliance}
                onChange={(e) => {
                  setSelectedGrandAlliance(e.target.value as GrandAlliance);
                  setSelectedFaction(''); // Reset faction when changing alliance
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Alliances</option>
                {grandAlliances.map(ga => (
                  <option key={ga} value={ga}>{ga}</option>
                ))}
              </select>
            </div>

            {/* Faction filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faction
              </label>
              <select
                value={selectedFaction}
                onChange={(e) => setSelectedFaction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Factions</option>
                {availableFactions.map(faction => (
                  <option key={faction.id} value={faction.id}>
                    {faction.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Keywords filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (select multiple)
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {allKeywords.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedKeywords.includes(keyword)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Units grid */}
      {filteredUnits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No warscrolls found matching your criteria.</p>
          <button onClick={clearFilters} className="mt-4 text-primary-600 hover:text-primary-700">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.map(unit => (
            <UnitCard
              key={`${unit.factionId}-${unit.id}`}
              unit={unit}
              onClick={() => setSelectedUnit(unit)}
            />
          ))}
        </div>
      )}

      {/* Unit detail modal */}
      {selectedUnit && (
        <UnitDetailModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}
    </div>
  );
}

function UnitCard({ unit, onClick }: { unit: UnitWarscroll; onClick: () => void }) {
  const faction = getAllFactions().find(f => f.id === unit.factionId);
  const isManifestation = unit.battleProfile?.isManifestation || false;
  const isFactionTerrain = unit.battleProfile?.isFactionTerrain || false;

  const points = unit.battleProfile?.points || 0;
  const pointsLabel = points === 0 ? 'Free' : points;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{unit.name}</h3>
          {unit.subtitle && (
            <p className="text-sm text-gray-600">{unit.subtitle}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">{faction?.name}</p>
        </div>
        {unit.battleProfile && (
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">{pointsLabel}</div>
            <div className="text-xs text-gray-500">pts</div>
          </div>
        )}
      </div>

      {/* Characteristics */}
      <div className="flex gap-4 text-sm mb-3 pb-3 border-b border-gray-200">
        <div>
          <span className="text-gray-500">Move:</span>{' '}
          <span className="font-medium">{unit.characteristics.move || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500">Health:</span>{' '}
          <span className="font-medium">{unit.characteristics.health}</span>
        </div>
        <div>
          <span className="text-gray-500">Save:</span>{' '}
          <span className="font-medium">{unit.characteristics.save || '-'}</span>
        </div>
      </div>

      {/* Keywords badges */}
      <div className="flex flex-wrap gap-1">
        {unit.keywords.unit.map((keyword, idx) => (
          <span key={idx} className="badge badge-primary">
            {keyword}
          </span>
        ))}
        {isManifestation && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-700">
            MANIFESTATION
          </span>
        )}
        {isFactionTerrain && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-700">
            TERRAIN
          </span>
        )}
      </div>
    </button>
  );
}

function UnitDetailModal({ unit, onClose }: { unit: UnitWarscroll; onClose: () => void }) {
  const faction = getAllFactions().find(f => f.id === unit.factionId);
  const isManifestation = unit.battleProfile?.isManifestation || false;
  const isFactionTerrain = unit.battleProfile?.isFactionTerrain || false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{unit.name}</h2>
              {isManifestation && (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">
                  MANIFESTATION
                </span>
              )}
              {isFactionTerrain && (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-700">
                  TERRAIN
                </span>
              )}
            </div>
            {unit.subtitle && (
              <p className="text-gray-600 mt-1">{unit.subtitle}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">{faction?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Characteristics */}
          <section>
            <h3 className="font-bold text-gray-900 mb-3">Characteristics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Move</div>
                <div className="text-lg font-bold">{unit.characteristics.move || '-'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Health</div>
                <div className="text-lg font-bold">{unit.characteristics.health}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Save</div>
                <div className="text-lg font-bold">{unit.characteristics.save || '-'}</div>
              </div>
              {unit.characteristics.control !== undefined && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Control</div>
                  <div className="text-lg font-bold">{unit.characteristics.control}</div>
                </div>
              )}
            </div>
          </section>

          {/* Battle Profile */}
          {unit.battleProfile && (
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Battle Profile</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-bold">{unit.battleProfile.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Size:</span>
                  <span className="font-medium">{unit.battleProfile.unitSize}</span>
                </div>
                {unit.battleProfile.baseSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Size:</span>
                    <span className="font-medium">{unit.battleProfile.baseSize}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Weapons */}
          {(unit.meleeWeapons || unit.rangedWeapons) && (
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Weapons</h3>

              {unit.rangedWeapons && unit.rangedWeapons.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ranged Weapons</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-2">Weapon</th>
                          <th className="text-center p-2">Range</th>
                          <th className="text-center p-2">Attacks</th>
                          <th className="text-center p-2">Hit</th>
                          <th className="text-center p-2">Wound</th>
                          <th className="text-center p-2">Rend</th>
                          <th className="text-center p-2">Damage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unit.rangedWeapons.map((weapon, idx) => (
                          <tr key={idx} className="border-t border-gray-200">
                            <td className="p-2">{weapon.name}</td>
                            <td className="text-center p-2">{weapon.range || '-'}</td>
                            <td className="text-center p-2">{weapon.attacks}</td>
                            <td className="text-center p-2">{weapon.hit}</td>
                            <td className="text-center p-2">{weapon.wound}</td>
                            <td className="text-center p-2">{weapon.rend}</td>
                            <td className="text-center p-2">{weapon.damage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {unit.meleeWeapons && unit.meleeWeapons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Melee Weapons</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-2">Weapon</th>
                          <th className="text-center p-2">Attacks</th>
                          <th className="text-center p-2">Hit</th>
                          <th className="text-center p-2">Wound</th>
                          <th className="text-center p-2">Rend</th>
                          <th className="text-center p-2">Damage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unit.meleeWeapons.map((weapon, idx) => (
                          <tr key={idx} className="border-t border-gray-200">
                            <td className="p-2">{weapon.name}</td>
                            <td className="text-center p-2">{weapon.attacks}</td>
                            <td className="text-center p-2">{weapon.hit}</td>
                            <td className="text-center p-2">{weapon.wound}</td>
                            <td className="text-center p-2">{weapon.rend}</td>
                            <td className="text-center p-2">{weapon.damage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Abilities */}
          {unit.abilities.length > 0 && (
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Abilities</h3>
              <div className="space-y-3">
                {unit.abilities.map((ability, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{ability.name}</h4>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                        {ability.timing}
                      </span>
                    </div>
                    {ability.description && (
                      <p className="text-sm text-gray-600 italic mb-2">{ability.description}</p>
                    )}
                    {ability.declare && (
                      <p className="text-sm mb-1">
                        <span className="font-medium">Declare:</span> {ability.declare}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-medium">Effect:</span> {ability.effect}
                    </p>
                    {ability.keywords && ability.keywords.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {ability.keywords.map((kw, kidx) => (
                          <span key={kidx} className="badge badge-secondary text-xs">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Keywords */}
          <section>
            <h3 className="font-bold text-gray-900 mb-3">Keywords</h3>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Unit Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {unit.keywords.unit.map((keyword, idx) => (
                    <span key={idx} className="badge badge-primary">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Faction Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {unit.keywords.faction.map((keyword, idx) => (
                    <span key={idx} className="badge badge-secondary">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
