import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAllFactions } from '@path-to-glory/shared';
import { useAuth } from '../contexts/AuthContext';

export default function EditArmyPage() {
  const navigate = useNavigate();
  const { armyId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const factions = getAllFactions();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    factionId: '',
    realmOfOrigin: '',
    background: '',
  });

  useEffect(() => {
    // TODO: Replace with GraphQL query when backend is ready
    const storedArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    const foundArmy = storedArmies.find((a: any) => a.id === armyId);

    if (!foundArmy) {
      navigate('/armies');
      return;
    }

    // Check if user owns this army
    if (!authLoading && user && foundArmy.playerId !== user.id) {
      alert('You can only edit your own armies');
      navigate('/armies');
      return;
    }

    setFormData({
      name: foundArmy.name,
      factionId: foundArmy.factionId,
      realmOfOrigin: foundArmy.realmOfOrigin || '',
      background: foundArmy.background || '',
    });
    setLoading(false);
  }, [armyId, navigate, user, authLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to edit an army');
      return;
    }

    // TODO: Replace with GraphQL mutation when backend is ready
    const existingArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    const armyIndex = existingArmies.findIndex((a: any) => a.id === armyId);

    if (armyIndex === -1) {
      alert('Army not found');
      return;
    }

    // Update only the editable fields, preserve everything else
    existingArmies[armyIndex] = {
      ...existingArmies[armyIndex],
      name: formData.name,
      realmOfOrigin: formData.realmOfOrigin,
      background: formData.background,
      // Note: factionId is not updated because changing faction would invalidate units
    };

    localStorage.setItem('armies', JSON.stringify(existingArmies));

    console.log('Updated army:', existingArmies[armyIndex]);

    navigate(`/armies/${armyId}`);
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this army? This action cannot be undone.')) {
      return;
    }

    // TODO: Replace with GraphQL mutation when backend is ready
    const existingArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    const filteredArmies = existingArmies.filter((a: any) => a.id !== armyId);
    localStorage.setItem('armies', JSON.stringify(filteredArmies));

    navigate('/armies');
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const selectedFaction = factions.find((f) => f.id === formData.factionId);

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

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(`/armies/${armyId}`)}
            className="btn-secondary"
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
            className="btn-secondary bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
          >
            Delete Army
          </button>
        </div>
      </form>
    </div>
  );
}
