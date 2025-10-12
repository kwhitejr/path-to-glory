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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customWarscrolls, setCustomWarscrolls] = useState<UnitWarscroll[]>(() => {
    const stored = localStorage.getItem('customWarscrolls');
    return stored ? JSON.parse(stored) : [];
  });

  // Get all units and factions (merged with custom warscrolls)
  const allWarscrolls = useMemo(() => {
    const defaultUnits = getAllUnits();
    return [...customWarscrolls, ...defaultUnits];
  }, [customWarscrolls]);
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create
          </button>
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

      {/* Create warscroll modal */}
      {showCreateModal && (
        <CreateWarscrollModal
          onClose={() => setShowCreateModal(false)}
          onSave={(warscroll) => {
            // Save to localStorage
            const updated = [...customWarscrolls, warscroll];
            setCustomWarscrolls(updated);
            localStorage.setItem('customWarscrolls', JSON.stringify(updated));
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function UnitCard({ unit, onClick }: { unit: UnitWarscroll; onClick: () => void }) {
  const faction = getAllFactions().find(f => f.id === unit.factionId);
  const isManifestation = unit.battleProfile?.isManifestation || false;
  const isFactionTerrain = unit.battleProfile?.isFactionTerrain || false;
  const isCustom = unit.sourceFile === 'custom';

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
        {/* Show Manifestation badge if applicable */}
        {isManifestation && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-700">
            MANIFESTATION
          </span>
        )}
        {/* Show Terrain badge if applicable */}
        {isFactionTerrain && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-700">
            TERRAIN
          </span>
        )}
        {/* Show all other unit keywords as blue chips */}
        {unit.keywords.unit
          .filter(keyword =>
            keyword.toLowerCase() !== 'manifestation' &&
            keyword.toLowerCase() !== 'terrain'
          )
          .map((keyword, idx) => (
            <span key={idx} className="badge badge-primary">
              {keyword}
            </span>
          ))}
        {/* Show custom badge if applicable */}
        {isCustom && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700">
            CUSTOM
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

function CreateWarscrollModal({ onClose, onSave }: { onClose: () => void; onSave: (warscroll: UnitWarscroll) => void }) {
  const [activeTab, setActiveTab] = useState<'upload' | 'scratch'>('scratch');
  const allFactions = useMemo(() => getAllFactions(), []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    factionId: '',
    move: '',
    health: '',
    save: '',
    control: '',
    rangedWeapons: [] as { name: string; range: string; attacks: string; hit: string; wound: string; rend: string; damage: string; ability?: string }[],
    meleeWeapons: [] as { name: string; attacks: string; hit: string; wound: string; rend: string; damage: string; ability?: string }[],
    abilities: [] as { name: string; timing: string; description: string; declare: string; effect: string }[],
    unitKeywords: '',
    factionKeywords: '',
    unitSize: '',
    points: '',
    baseSize: '',
    isManifestation: false,
    isFactionTerrain: false,
  });

  const addRangedWeapon = () => {
    setFormData({
      ...formData,
      rangedWeapons: [...formData.rangedWeapons, { name: '', range: '', attacks: '', hit: '', wound: '', rend: '', damage: '' }]
    });
  };

  const addMeleeWeapon = () => {
    setFormData({
      ...formData,
      meleeWeapons: [...formData.meleeWeapons, { name: '', attacks: '', hit: '', wound: '', rend: '', damage: '' }]
    });
  };

  const addAbility = () => {
    setFormData({
      ...formData,
      abilities: [...formData.abilities, { name: '', timing: '', description: '', declare: '', effect: '' }]
    });
  };

  const updateRangedWeapon = (index: number, field: string, value: string) => {
    const updated = [...formData.rangedWeapons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, rangedWeapons: updated });
  };

  const updateMeleeWeapon = (index: number, field: string, value: string) => {
    const updated = [...formData.meleeWeapons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, meleeWeapons: updated });
  };

  const updateAbility = (index: number, field: string, value: string) => {
    const updated = [...formData.abilities];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, abilities: updated });
  };

  const removeRangedWeapon = (index: number) => {
    setFormData({
      ...formData,
      rangedWeapons: formData.rangedWeapons.filter((_, i) => i !== index)
    });
  };

  const removeMeleeWeapon = (index: number) => {
    setFormData({
      ...formData,
      meleeWeapons: formData.meleeWeapons.filter((_, i) => i !== index)
    });
  };

  const removeAbility = (index: number) => {
    setFormData({
      ...formData,
      abilities: formData.abilities.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create warscroll object
    const warscroll: UnitWarscroll = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      subtitle: formData.subtitle || undefined,
      factionId: formData.factionId,
      characteristics: {
        move: formData.move || null,
        health: parseInt(formData.health) || 0,
        save: formData.save || null,
        control: formData.control ? parseInt(formData.control) : undefined,
      },
      rangedWeapons: formData.rangedWeapons.length > 0 ? formData.rangedWeapons.map(w => ({
        ...w,
        attacks: isNaN(Number(w.attacks)) ? w.attacks : Number(w.attacks),
        rend: isNaN(Number(w.rend)) ? w.rend : Number(w.rend),
        damage: isNaN(Number(w.damage)) ? w.damage : Number(w.damage),
        ability: w.ability || null,
      })) : undefined,
      meleeWeapons: formData.meleeWeapons.length > 0 ? formData.meleeWeapons.map(w => ({
        ...w,
        attacks: isNaN(Number(w.attacks)) ? w.attacks : Number(w.attacks),
        rend: isNaN(Number(w.rend)) ? w.rend : Number(w.rend),
        damage: isNaN(Number(w.damage)) ? w.damage : Number(w.damage),
        ability: w.ability || null,
      })) : undefined,
      abilities: formData.abilities.map(a => ({
        name: a.name,
        timing: a.timing,
        description: a.description || '',
        effect: a.effect,
        declare: a.declare || undefined,
      })),
      keywords: {
        unit: formData.unitKeywords.split(',').map(k => k.trim()).filter(k => k),
        faction: formData.factionKeywords.split(',').map(k => k.trim()).filter(k => k),
      },
      battleProfile: formData.points ? {
        unitSize: isNaN(Number(formData.unitSize)) ? formData.unitSize : Number(formData.unitSize),
        points: parseInt(formData.points),
        baseSize: formData.baseSize || undefined,
        isManifestation: formData.isManifestation || undefined,
        isFactionTerrain: formData.isFactionTerrain || undefined,
      } : undefined,
      sourceFile: 'custom',
      extractedAt: new Date().toISOString(),
    };

    onSave(warscroll);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">New Warscroll Upload</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'upload'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              UPLOADED
            </button>
            <button
              onClick={() => setActiveTab('scratch')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'scratch'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FROM SCRATCH
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'upload' ? (
            <div className="text-center py-12">
              <p className="text-gray-600">File upload feature coming soon</p>
            </div>
          ) : (
            <>
              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="font-bold text-gray-900">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faction *
                    </label>
                    <select
                      required
                      value={formData.factionId}
                      onChange={(e) => setFormData({ ...formData, factionId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Faction</option>
                      {allFactions.map(faction => (
                        <option key={faction.id} value={faction.id}>{faction.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Characteristics */}
              <section className="space-y-4">
                <h3 className="font-bold text-gray-900">Characteristics</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Move
                    </label>
                    <input
                      type="text"
                      placeholder='e.g., 10"'
                      value={formData.move}
                      onChange={(e) => setFormData({ ...formData, move: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Health *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.health}
                      onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Save
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 3+"
                      value={formData.save}
                      onChange={(e) => setFormData({ ...formData, save: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Control
                    </label>
                    <input
                      type="number"
                      value={formData.control}
                      onChange={(e) => setFormData({ ...formData, control: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </section>

              {/* Ranged Weapons */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Ranged Weapons</h3>
                  <button
                    type="button"
                    onClick={addRangedWeapon}
                    className="btn-secondary text-sm"
                  >
                    + Add Weapon
                  </button>
                </div>

                {formData.rangedWeapons.map((weapon, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Ranged Weapon {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRangedWeapon(idx)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Weapon Name"
                        value={weapon.name}
                        onChange={(e) => updateRangedWeapon(idx, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder='Range (e.g., 12")'
                        value={weapon.range}
                        onChange={(e) => updateRangedWeapon(idx, 'range', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Attacks (e.g., 2D6)"
                        value={weapon.attacks}
                        onChange={(e) => updateRangedWeapon(idx, 'attacks', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Hit (e.g., 3+)"
                        value={weapon.hit}
                        onChange={(e) => updateRangedWeapon(idx, 'hit', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Wound (e.g., 3+)"
                        value={weapon.wound}
                        onChange={(e) => updateRangedWeapon(idx, 'wound', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Rend (e.g., -1)"
                        value={weapon.rend}
                        onChange={(e) => updateRangedWeapon(idx, 'rend', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Damage (e.g., D3)"
                        value={weapon.damage}
                        onChange={(e) => updateRangedWeapon(idx, 'damage', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Ability (optional)"
                        value={weapon.ability || ''}
                        onChange={(e) => updateRangedWeapon(idx, 'ability', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </section>

              {/* Melee Weapons */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Melee Weapons</h3>
                  <button
                    type="button"
                    onClick={addMeleeWeapon}
                    className="btn-secondary text-sm"
                  >
                    + Add Weapon
                  </button>
                </div>

                {formData.meleeWeapons.map((weapon, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Melee Weapon {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeMeleeWeapon(idx)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Weapon Name"
                        value={weapon.name}
                        onChange={(e) => updateMeleeWeapon(idx, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Attacks (e.g., 4)"
                        value={weapon.attacks}
                        onChange={(e) => updateMeleeWeapon(idx, 'attacks', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Hit (e.g., 3+)"
                        value={weapon.hit}
                        onChange={(e) => updateMeleeWeapon(idx, 'hit', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Wound (e.g., 3+)"
                        value={weapon.wound}
                        onChange={(e) => updateMeleeWeapon(idx, 'wound', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Rend (e.g., -1)"
                        value={weapon.rend}
                        onChange={(e) => updateMeleeWeapon(idx, 'rend', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Damage (e.g., 2)"
                        value={weapon.damage}
                        onChange={(e) => updateMeleeWeapon(idx, 'damage', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Ability (optional)"
                        value={weapon.ability || ''}
                        onChange={(e) => updateMeleeWeapon(idx, 'ability', e.target.value)}
                        className="col-span-2 md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </section>

              {/* Abilities */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Abilities</h3>
                  <button
                    type="button"
                    onClick={addAbility}
                    className="btn-secondary text-sm"
                  >
                    + Add Ability
                  </button>
                </div>

                {formData.abilities.map((ability, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Ability {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeAbility(idx)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Ability Name"
                          value={ability.name}
                          onChange={(e) => updateAbility(idx, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="text"
                          placeholder="Timing (e.g., Your Hero Phase)"
                          value={ability.timing}
                          onChange={(e) => updateAbility(idx, 'timing', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <textarea
                        placeholder="Description (flavor text)"
                        value={ability.description}
                        onChange={(e) => updateAbility(idx, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <textarea
                        placeholder="Declare (conditions)"
                        value={ability.declare}
                        onChange={(e) => updateAbility(idx, 'declare', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <textarea
                        placeholder="Effect (what it does)"
                        value={ability.effect}
                        onChange={(e) => updateAbility(idx, 'effect', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </section>

              {/* Keywords */}
              <section className="space-y-4">
                <h3 className="font-bold text-gray-900">Keywords</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Hero, Wizard, Infantry"
                      value={formData.unitKeywords}
                      onChange={(e) => setFormData({ ...formData, unitKeywords: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faction Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Order, Stormcast Eternals"
                      value={formData.factionKeywords}
                      onChange={(e) => setFormData({ ...formData, factionKeywords: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </section>

              {/* Battle Profile */}
              <section className="space-y-4">
                <h3 className="font-bold text-gray-900">Battle Profile (Optional)</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1 or 5-10"
                      value={formData.unitSize}
                      onChange={(e) => setFormData({ ...formData, unitSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Size
                    </label>
                    <input
                      type="text"
                      placeholder='e.g., 32mm'
                      value={formData.baseSize}
                      onChange={(e) => setFormData({ ...formData, baseSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isManifestation}
                      onChange={(e) => setFormData({ ...formData, isManifestation: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Is Manifestation</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFactionTerrain}
                      onChange={(e) => setFormData({ ...formData, isFactionTerrain: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Is Faction Terrain</span>
                  </label>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
