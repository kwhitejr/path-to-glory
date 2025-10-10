import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { getAllFactions } from '@path-to-glory/shared';
import { useAuth } from '../contexts/AuthContext';
import { GET_ARMY, UPDATE_ARMY, GET_MY_ARMIES } from '../graphql/operations';

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

  const [formData, setFormData] = useState({
    name: '',
  });

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
      });
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

  const handleDelete = () => {
    // TODO: Implement delete army mutation
    alert('Delete army functionality not yet implemented');
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

        {/* Note about missing fields */}
        <div className="card bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Realm of Origin and Background fields are not yet implemented in the backend schema.
            Only the army name can be edited at this time.
          </p>
        </div>

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
            className="btn-secondary bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
          >
            Delete Army
          </button>
        </div>
      </form>
    </div>
  );
}
