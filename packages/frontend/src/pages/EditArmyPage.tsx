import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  getAllFactions,
  RealmOfOrigin,
  RealmOfOriginLabels,
  getBattleFormationsByFaction,
  getSpellLoreByFaction,
  getPrayerLoreByFaction,
  getManifestationLoreByFaction
} from '@path-to-glory/shared';
import { useAuth } from '../contexts/AuthContext';
import { GET_ARMY, UPDATE_ARMY, DELETE_ARMY, GET_MY_ARMIES } from '../graphql/operations';
import { ImageUpload } from '../components/ImageUpload';

export default function EditArmyPage() {
  const navigate = useNavigate();
  const { armyId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const factions = getAllFactions();

  const { data, loading: queryLoading, error } = useQuery(GET_ARMY, {
    variables: { id: armyId! },
    skip: !armyId,
  });

  const [updateArmy, { loading: updating }] = useMutation(UPDATE_ARMY, {
    refetchQueries: [
      { query: GET_ARMY, variables: { id: armyId } },
      { query: GET_MY_ARMIES },
    ],
  });

  const [deleteArmy, { loading: deleting }] = useMutation(DELETE_ARMY, {
    refetchQueries: [{ query: GET_MY_ARMIES }],
  });

  const [formData, setFormData] = useState({
    name: '',
    realmOfOrigin: '' as RealmOfOrigin | '',
    battleFormation: '',
    background: '',
    notableEvents: '',
    currentQuest: '',
    questPoints: 0,
    completedQuests: [] as string[],
    imageUrl: '',
  });
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const [selectedPrayers, setSelectedPrayers] = useState<string[]>([]);
  const [selectedManifestations, setSelectedManifestations] = useState<string[]>([]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const army = data?.army;

  useEffect(() => {
    // Check if user owns this army
    if (!authLoading && user && army && army.player?.id !== user.id) {
      alert('You can only edit your own armies');
      navigate('/armies');
      return;
    }

    if (army) {
      setFormData({
        name: army.name,
        realmOfOrigin: army.realmOfOrigin || '',
        battleFormation: army.battleFormation || '',
        background: army.background || '',
        notableEvents: army.notableEvents || '',
        currentQuest: army.currentQuest || '',
        questPoints: army.questPoints || 0,
        completedQuests: army.completedQuests || [],
        imageUrl: army.imageUrl || '',
      });
      setSelectedSpells(army.spellLore || []);
      setSelectedPrayers(army.prayerLore || []);
      setSelectedManifestations(army.manifestationLore || []);
    }
  }, [army, user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user || !army) {
      alert('You must be logged in to edit an army');
      return;
    }

    try {
      await updateArmy({
        variables: {
          id: armyId!,
          input: {
            name: formData.name,
            realmOfOrigin: formData.realmOfOrigin || undefined,
            battleFormation: formData.battleFormation || undefined,
            background: formData.background || undefined,
            notableEvents: formData.notableEvents || undefined,
            currentQuest: formData.currentQuest || undefined,
            questPoints: formData.questPoints,
            completedQuests: formData.completedQuests,
            spellLore: selectedSpells,
            prayerLore: selectedPrayers,
            manifestationLore: selectedManifestations,
            imageUrl: formData.imageUrl || undefined,
          },
        },
      });

      console.log('Army updated successfully');
      navigate(`/armies/${armyId}`);
    } catch (err) {
      console.error('Error updating army:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to update army');
    }
  };

  const handleDelete = async () => {
    if (!army) return;

    const confirmMessage = `Are you sure you want to delete "${army.name}"?\n\nThis will permanently delete the army and all its units. This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteArmy({
        variables: { id: armyId! },
      });

      console.log('Army deleted successfully');
      navigate('/armies');
    } catch (err) {
      console.error('Error deleting army:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete army');
    }
  };

  if (queryLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">Error loading army: {error.message}</p>
          <Link to="/armies" className="btn-primary mt-4">
            Back to Armies
          </Link>
        </div>
      </div>
    );
  }

  if (!army) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Army not found</h2>
        <Link to="/armies" className="btn-primary">
          Back to Armies
        </Link>
      </div>
    );
  }

  const selectedFaction = factions.find((f) => f.id === army.factionId);
  const battleFormations = army.factionId ? getBattleFormationsByFaction(army.factionId) : [];
  const spellLore = army.factionId ? getSpellLoreByFaction(army.factionId) : null;
  const prayerLore = army.factionId ? getPrayerLoreByFaction(army.factionId) : null;
  const manifestationLore = army.factionId ? getManifestationLoreByFaction(army.factionId) : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Link to={`/armies/${armyId}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Army
      </Link>

      <h2 className="text-2xl font-bold mb-6">Edit Army</h2>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{submitError}</p>
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
            disabled={updating}
          />
        </div>

        {/* Army Banner */}
        <div>
          <ImageUpload
            entityType="army"
            entityId={armyId!}
            currentImageUrl={formData.imageUrl}
            onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
            label="Army Banner"
            variant="banner"
          />
        </div>

        {/* Faction (Read-only) */}
        <div>
          <label htmlFor="faction" className="label">
            Faction
          </label>
          <input
            id="faction"
            type="text"
            disabled
            className="input bg-gray-100 cursor-not-allowed"
            value={selectedFaction?.name || ''}
          />
          <p className="mt-2 text-sm text-gray-500">
            Faction cannot be changed after army creation
          </p>
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
            disabled={updating}
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
        {battleFormations.length > 0 && (
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
                    disabled={updating}
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
            disabled={updating}
          />
        </div>

        {/* Notable Events */}
        <div>
          <label htmlFor="notableEvents" className="label">
            Notable Events
          </label>
          <textarea
            id="notableEvents"
            rows={4}
            className="input"
            value={formData.notableEvents}
            onChange={(e) => setFormData({ ...formData, notableEvents: e.target.value })}
            placeholder="Record memorable battles, victories, defeats, and key moments in your army's history..."
            disabled={updating}
          />
        </div>

        {/* Quest Log Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Quest Log</h3>

          {/* Current Quest */}
          <div className="mb-4">
            <label htmlFor="currentQuest" className="label">
              Current Quest
            </label>
            <input
              id="currentQuest"
              type="text"
              className="input"
              value={formData.currentQuest}
              onChange={(e) => setFormData({ ...formData, currentQuest: e.target.value })}
              placeholder="e.g., Claim the Ancient Ruins, Forge an Alliance..."
              disabled={updating}
            />
          </div>

          {/* Quest Points */}
          <div className="mb-4">
            <label htmlFor="questPoints" className="label">
              Quest Points
            </label>
            <input
              id="questPoints"
              type="number"
              min="0"
              className="input"
              value={formData.questPoints}
              onChange={(e) => setFormData({ ...formData, questPoints: parseInt(e.target.value) || 0 })}
              disabled={updating}
            />
            <p className="mt-1 text-xs text-gray-500">
              Progress toward completing your current quest
            </p>
          </div>

          {/* Completed Quests */}
          <div>
            <label htmlFor="completedQuests" className="label">
              Completed Quests
            </label>
            <textarea
              id="completedQuests"
              rows={3}
              className="input"
              value={formData.completedQuests.join('\n')}
              onChange={(e) => setFormData({ ...formData, completedQuests: e.target.value.split('\n').filter(q => q.trim()) })}
              placeholder="Enter completed quests, one per line..."
              disabled={updating}
            />
          </div>
        </div>

        {/* Arcane Tome Section */}
        {(spellLore || prayerLore || manifestationLore) && (
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
                        disabled={updating}
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
                        disabled={updating}
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
                        disabled={updating}
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

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/armies/${armyId}`)}
            className="btn-secondary"
            disabled={updating}
          >
            Cancel
          </button>
        </div>

        {/* Delete Army */}
        <div className="pt-6 border-t">
          <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-3">
            Deleting an army is permanent and cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={updating || deleting}
            className="btn-secondary bg-red-50 text-red-600 border-red-300 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete Army'}
          </button>
        </div>
      </form>
    </div>
  );
}
