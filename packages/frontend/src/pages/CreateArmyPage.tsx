import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  getAllFactions,
  getUnitsByFaction,
  getSpellLoreByFaction,
  getPrayerLoreByFaction,
  getManifestationLoreByFaction,
  getBattleFormationsByFaction,
  type UnitWarscroll,
  RealmOfOrigin,
  RealmOfOriginLabels
} from '@path-to-glory/shared';
import UnitSelector, { SelectedUnit } from '../components/UnitSelector';
import { useAuth } from '../contexts/AuthContext';
import { CREATE_CAMPAIGN, CREATE_ARMY, ADD_UNIT, GET_MY_CAMPAIGNS, GET_MY_ARMIES } from '../graphql/operations';
import { ImageUpload } from '../components/ImageUpload';

export default function CreateArmyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const factions = getAllFactions();

  // GraphQL operations
  const { data: campaignsData, loading: campaignsLoading } = useQuery(GET_MY_CAMPAIGNS, {
    skip: !user,
  });
  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_MY_CAMPAIGNS }],
  });
  const [createArmy] = useMutation(CREATE_ARMY, {
    refetchQueries: [{ query: GET_MY_ARMIES }],
  });
  const [addUnit] = useMutation(ADD_UNIT);

  // State
  const [formData, setFormData] = useState({
    name: '',
    factionId: '',
    realmOfOrigin: '' as RealmOfOrigin | '',
    battleFormation: '',
    background: '',
    imageUrl: '',
  });
  const [tempArmyId] = useState(() => `temp-${crypto.randomUUID()}`);
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [warlordUnitId, setWarlordUnitId] = useState<string>('');
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const [selectedPrayers, setSelectedPrayers] = useState<string[]>([]);
  const [selectedManifestations, setSelectedManifestations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/armies');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      alert('You must be logged in to create an army');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Get or create a default campaign
      let campaignId = campaignsData?.myCampaigns?.[0]?.id;

      if (!campaignId) {
        console.log('No campaign found, creating default campaign...');
        const campaignResult = await createCampaign({
          variables: {
            input: {
              name: `${user.name}'s Campaign`,
            },
          },
        });
        campaignId = campaignResult.data?.createCampaign?.id;
        console.log('Created campaign:', campaignId);
      }

      if (!campaignId) {
        throw new Error('Failed to create or find campaign');
      }

      // Step 2: Create the army
      console.log('Creating army...');
      const armyResult = await createArmy({
        variables: {
          input: {
            campaignId,
            factionId: formData.factionId,
            name: formData.name,
            realmOfOrigin: formData.realmOfOrigin || undefined,
            battleFormation: formData.battleFormation || undefined,
            background: formData.background || undefined,
            spellLore: selectedSpells.length > 0 ? selectedSpells : undefined,
            prayerLore: selectedPrayers.length > 0 ? selectedPrayers : undefined,
            manifestationLore: selectedManifestations.length > 0 ? selectedManifestations : undefined,
            imageUrl: formData.imageUrl || undefined,
          },
        },
      });

      const newArmy = armyResult.data?.createArmy;
      if (!newArmy) {
        throw new Error('Failed to create army');
      }

      console.log('Army created:', newArmy);

      // Step 3: Add units to the army
      if (selectedUnits.length > 0) {
        console.log(`Adding ${selectedUnits.length} units...`);
        for (const unit of selectedUnits) {
          // Get the unit warscroll to find size and wounds
          const warscroll = availableUnits[unit.warscrollId];
          const isWarlord = warlordUnitId === unit.id;
          await addUnit({
            variables: {
              armyId: newArmy.id,
              input: {
                unitTypeId: unit.warscrollId,
                name: unit.name,
                warscroll: warscroll?.name || unit.name,
                size: 1, // Default to 1 model - can be updated later
                wounds: warscroll?.characteristics?.health || 1,
                rank: unit.rank,
                renown: unit.renown,
                reinforced: unit.reinforced,
                isWarlord,
                pathAbilities: unit.pathAbility ? [unit.pathAbility] : [],
              },
            },
          });
        }
        console.log('Units added successfully');
      }

      // Success! Navigate to the army detail page
      navigate(`/armies/${newArmy.id}`);
    } catch (err) {
      console.error('Error creating army:', err);
      setError(err instanceof Error ? err.message : 'Failed to create army. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedFaction = factions.find((f) => f.id === formData.factionId);
  const availableUnits: Record<string, UnitWarscroll> = formData.factionId ? getUnitsByFaction(formData.factionId) : {};

  // Get faction-specific options
  const battleFormations = formData.factionId ? getBattleFormationsByFaction(formData.factionId) : [];
  const spellLore = formData.factionId ? getSpellLoreByFaction(formData.factionId) : null;
  const prayerLore = formData.factionId ? getPrayerLoreByFaction(formData.factionId) : null;
  const manifestationLore = formData.factionId ? getManifestationLoreByFaction(formData.factionId) : null;

  const handleFactionChange = (factionId: string) => {
    setFormData({ ...formData, factionId });
    // Clear units, warlord, and arcane tome selections when faction changes
    setSelectedUnits([]);
    setWarlordUnitId('');
    setSelectedSpells([]);
    setSelectedPrayers([]);
    setSelectedManifestations([]);
  };

  // Update warlord selection when units change
  useEffect(() => {
    // If the current warlord was removed, clear the selection
    if (warlordUnitId && !selectedUnits.find(u => u.id === warlordUnitId)) {
      setWarlordUnitId('');
    }
  }, [selectedUnits, warlordUnitId]);

  const loading = authLoading || campaignsLoading;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Army</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Army Name */}
        <div>
          <label htmlFor="name" className="label">
            Army Name *
          </label>
          <input
            id="name"
            type="text"
            required
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., The Crimson Host"
            disabled={isSubmitting}
          />
        </div>

        {/* Army Banner */}
        <div>
          <ImageUpload
            entityType="army"
            entityId={tempArmyId}
            currentImageUrl={formData.imageUrl}
            onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
            label="Army Banner"
            variant="banner"
          />
        </div>

        {/* Faction Selection */}
        <div>
          <label htmlFor="faction" className="label">
            Faction *
          </label>
          <select
            id="faction"
            required
            className="input"
            value={formData.factionId}
            onChange={(e) => handleFactionChange(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select a faction...</option>
            {factions.map((faction: { id: string; name: string; grandAlliance: string }) => (
              <option key={faction.id} value={faction.id}>
                {faction.name} ({faction.grandAlliance})
              </option>
            ))}
          </select>
          {selectedFaction && (
            <p className="mt-2 text-sm text-gray-600">{selectedFaction.description}</p>
          )}
        </div>

        {/* Realm of Origin */}
        <div>
          <label htmlFor="realm" className="label">
            Realm of Origin
          </label>
          <select
            id="realm"
            className="input"
            value={formData.realmOfOrigin}
            onChange={(e) => setFormData({ ...formData, realmOfOrigin: e.target.value as RealmOfOrigin | '' })}
            disabled={isSubmitting}
          >
            <option value="">Select a realm...</option>
            {Object.values(RealmOfOrigin).map((realm) => (
              <option key={realm} value={realm}>
                {RealmOfOriginLabels[realm]}
              </option>
            ))}
          </select>
        </div>

        {/* Battle Formation */}
        {formData.factionId && battleFormations.length > 0 && (
          <div>
            <label className="label">
              Battle Formation
            </label>
            <div className="space-y-3 mt-2">
              {battleFormations.map((formation) => (
                <label
                  key={formation.id}
                  className="flex items-start p-4 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="battleFormation"
                    value={formation.name}
                    checked={formData.battleFormation === formation.name}
                    onChange={(e) => setFormData({ ...formData, battleFormation: e.target.value })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                    disabled={isSubmitting}
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-sm mb-1">{formation.name}</div>
                    <div className="text-xs text-gray-600">{formation.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {formData.battleFormation && (
              <p className="text-xs text-gray-500 italic mt-3">
                Refer to your faction's Battletome or the Core Rules for detailed battle formation abilities and restrictions.
              </p>
            )}
          </div>
        )}

        {/* Arcane Tome Selections */}
        {formData.factionId && (spellLore || prayerLore || manifestationLore) && (
          <div className="card bg-purple-50 border border-purple-200">
            <h3 className="font-semibold mb-3">Arcane Tome</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select spells, prayers, and manifestations for your army
            </p>

            {/* Spell Lore */}
            {spellLore && (
              <div className="mb-4">
                <label className="label text-sm font-medium">
                  {spellLore.name}
                </label>
                <div className="space-y-2 mt-2">
                  {spellLore.spells.map((spell) => (
                    <label
                      key={spell.id}
                      className="flex items-start p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpells.includes(spell.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSpells([...selectedSpells, spell.id]);
                          } else {
                            setSelectedSpells(selectedSpells.filter(id => id !== spell.id));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                        disabled={isSubmitting}
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-sm">{spell.name}</div>
                        <div className="text-xs text-gray-500">Casting Value: {spell.castingValue}</div>
                        <div className="text-xs text-gray-600 mt-1">{spell.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Prayer Lore */}
            {prayerLore && (
              <div className="mb-4">
                <label className="label text-sm font-medium">
                  {prayerLore.name}
                </label>
                <div className="space-y-2 mt-2">
                  {prayerLore.prayers.map((prayer) => (
                    <label
                      key={prayer.id}
                      className="flex items-start p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPrayers.includes(prayer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrayers([...selectedPrayers, prayer.id]);
                          } else {
                            setSelectedPrayers(selectedPrayers.filter(id => id !== prayer.id));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                        disabled={isSubmitting}
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-sm">{prayer.name}</div>
                        <div className="text-xs text-gray-500">Chanting Value: {prayer.chantingValue}</div>
                        <div className="text-xs text-gray-600 mt-1">{prayer.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Manifestation Lore */}
            {manifestationLore && (
              <div>
                <label className="label text-sm font-medium">
                  {manifestationLore.name}
                </label>
                <div className="space-y-2 mt-2">
                  {manifestationLore.manifestations.map((manifestation) => (
                    <label
                      key={manifestation.id}
                      className="flex items-start p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedManifestations.includes(manifestation.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedManifestations([...selectedManifestations, manifestation.id]);
                          } else {
                            setSelectedManifestations(selectedManifestations.filter(id => id !== manifestation.id));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                        disabled={isSubmitting}
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-sm">{manifestation.name}</div>
                        <div className="text-xs text-gray-500">Casting Value: {manifestation.castingValue}</div>
                        <div className="text-xs text-gray-600 mt-1">{manifestation.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Background */}
        <div>
          <label htmlFor="background" className="label">
            Background
          </label>
          <textarea
            id="background"
            rows={4}
            className="input"
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            placeholder="Tell the story of your warband..."
            disabled={isSubmitting}
          />
        </div>

        {/* Unit Selection */}
        {formData.factionId && (
          <div className="card bg-white border border-gray-300">
            <UnitSelector
              factionId={formData.factionId}
              availableUnits={availableUnits}
              selectedUnits={selectedUnits}
              onUnitsChange={setSelectedUnits}
            />
          </div>
        )}

        {/* Warlord Selection */}
        {selectedUnits.length > 0 && (
          <div className="card bg-primary-50 border border-primary-200">
            <h3 className="font-semibold mb-2">Warlord Selection</h3>
            <p className="text-sm text-gray-600 mb-3">
              Choose your army's warlord (must be a Hero). According to Path to Glory rules, your starting warlord must have a points value of 350 or less.
            </p>
            <div className="space-y-2">
              {selectedUnits
                .filter((unit) => {
                  const warscroll = availableUnits[unit.warscrollId];
                  return warscroll?.keywords?.unit?.includes('Hero');
                })
                .map((unit) => (
                  <label
                    key={unit.id}
                    className="flex items-center p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="warlord"
                      value={unit.id}
                      checked={warlordUnitId === unit.id}
                      onChange={(e) => setWarlordUnitId(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-sm">{unit.name}</div>
                      <div className="text-xs text-gray-600">{unit.warscroll}</div>
                    </div>
                  </label>
                ))}
              {selectedUnits.filter((unit) => {
                const warscroll = availableUnits[unit.warscrollId];
                return warscroll?.keywords?.unit?.includes('Hero');
              }).length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No Heroes added yet. Add a Hero unit to select your warlord.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Starting Stats Info */}
        {selectedFaction && (
          <div className="card bg-primary-50 border border-primary-200">
            <h3 className="font-semibold mb-2">Starting Stats</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-600">Glory Points:</span>{' '}
                <span className="font-semibold">{selectedFaction.startingGlory}</span>
              </p>
              <p>
                <span className="text-gray-600">Renown:</span>{' '}
                <span className="font-semibold">{selectedFaction.startingRenown}</span>
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Army...' : 'Create Army'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/armies')}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
