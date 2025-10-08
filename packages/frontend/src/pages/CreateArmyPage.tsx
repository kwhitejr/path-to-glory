import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFactions, getUnitsByFaction, type UnitWarscroll } from '@path-to-glory/shared';
import UnitSelector, { SelectedUnit } from '../components/UnitSelector';
import { useAuth } from '../contexts/AuthContext';

export default function CreateArmyPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const factions = getAllFactions();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to armies list
      // The armies list will show a message to sign in
      navigate('/armies');
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    factionId: '',
    realmOfOrigin: '',
    background: '',
  });

  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create an army');
      return;
    }

    // Generate a unique ID for the army
    const armyId = `army-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const selectedFaction = factions.find((f) => f.id === formData.factionId);

    // Create the army object
    const newArmy = {
      id: armyId,
      name: formData.name,
      factionId: formData.factionId,
      realmOfOrigin: formData.realmOfOrigin,
      background: formData.background,
      playerId: user.id,
      playerName: user.name,
      playerPicture: user.picture,
      glory: selectedFaction?.startingGlory || 0,
      renown: selectedFaction?.startingRenown || 0,
      units: selectedUnits,
      createdAt: new Date().toISOString(),
    };

    // TODO: Replace with GraphQL mutation when backend is ready
    // For now, store in localStorage
    const existingArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    existingArmies.push(newArmy);
    localStorage.setItem('armies', JSON.stringify(existingArmies));

    console.log('Creating army:', formData);
    console.log('With units:', selectedUnits);
    console.log('Army saved to localStorage:', newArmy);

    navigate('/armies');
  };

  const selectedFaction = factions.find((f) => f.id === formData.factionId);
  const availableUnits: Record<string, UnitWarscroll> = formData.factionId ? getUnitsByFaction(formData.factionId) : {};

  const handleFactionChange = (factionId: string) => {
    setFormData({ ...formData, factionId });
    // Clear units when faction changes
    setSelectedUnits([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Army</h2>

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
          <input
            id="realm"
            type="text"
            className="input"
            value={formData.realmOfOrigin}
            onChange={(e) => setFormData({ ...formData, realmOfOrigin: e.target.value })}
            placeholder="e.g., Ghyran, Aqshy, Shyish..."
          />
        </div>

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
          />
        </div>

        {/* Unit Selection */}
        {formData.factionId && (
          <div className="card bg-white border border-gray-300">
            <UnitSelector
              availableUnits={availableUnits}
              selectedUnits={selectedUnits}
              onUnitsChange={setSelectedUnits}
            />
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
          <button type="submit" className="btn-primary flex-1">
            Create Army
          </button>
          <button
            type="button"
            onClick={() => navigate('/armies')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
