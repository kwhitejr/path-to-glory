import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFactions } from '@path-to-glory/shared';

export default function CreateArmyPage() {
  const navigate = useNavigate();
  const factions = getAllFactions();

  const [formData, setFormData] = useState({
    name: '',
    factionId: '',
    realmOfOrigin: '',
    background: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: GraphQL mutation to create army
    console.log('Creating army:', formData);
    navigate('/armies');
  };

  const selectedFaction = factions.find((f) => f.id === formData.factionId);

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
            onChange={(e) => setFormData({ ...formData, factionId: e.target.value })}
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
