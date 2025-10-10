import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { GET_ARMY, UPDATE_UNIT, REMOVE_UNIT, GET_MY_ARMIES } from '../graphql/operations';

const RANKS = ['Regular', 'Veteran', 'Elite'];

export default function EditUnitPage() {
  const navigate = useNavigate();
  const { armyId, unitId } = useParams();
  const { user, loading: authLoading } = useAuth();

  // GraphQL operations
  const { data, loading: queryLoading, error } = useQuery(GET_ARMY, {
    variables: { id: armyId! },
    skip: !armyId,
  });

  const [updateUnit, { loading: updating }] = useMutation(UPDATE_UNIT, {
    refetchQueries: [{ query: GET_ARMY, variables: { id: armyId } }],
  });

  const [removeUnit, { loading: deleting }] = useMutation(REMOVE_UNIT, {
    refetchQueries: [
      { query: GET_ARMY, variables: { id: armyId } },
      { query: GET_MY_ARMIES },
    ],
  });

  const [formData, setFormData] = useState({
    customName: '',
    rank: 'Regular',
    renown: 0,
    reinforced: false,
    enhancement: '',
    pathAbility: '',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const army = data?.army;
  const unit = army?.units?.find((u: any) => u.id === unitId);

  useEffect(() => {
    // Check if user owns this army
    if (!authLoading && user && army && army.player?.id !== user.id) {
      alert('You can only edit units in your own armies');
      navigate('/armies');
      return;
    }

    if (unit) {
      setFormData({
        customName: unit.name !== unit.unitTypeId ? unit.name : '',
        rank: unit.rank || 'Regular',
        renown: unit.renown || 0,
        reinforced: unit.reinforced || false,
        enhancement: unit.enhancements?.[0] || '',
        pathAbility: '', // TODO: Add pathAbility to schema
      });
    }
  }, [unit, army, user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user || !unit) {
      alert('You must be logged in');
      return;
    }

    try {
      await updateUnit({
        variables: {
          id: unitId!,
          input: {
            name: formData.customName || unit.unitTypeId,
            rank: formData.rank,
            renown: formData.renown,
            reinforced: formData.reinforced,
            enhancements: formData.enhancement ? [formData.enhancement] : [],
          },
        },
      });

      console.log('Unit updated successfully');
      navigate(`/armies/${armyId}`);
    } catch (err) {
      console.error('Error updating unit:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to update unit');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }

    try {
      await removeUnit({
        variables: { id: unitId! },
      });

      console.log('Unit deleted successfully');
      navigate(`/armies/${armyId}`);
    } catch (err) {
      console.error('Error deleting unit:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete unit');
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
          <p className="text-red-800">Error loading unit: {error.message}</p>
          <Link to={`/armies/${armyId}`} className="btn-primary mt-4">
            Back to Army
          </Link>
        </div>
      </div>
    );
  }

  if (!unit || !army) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Unit not found</h2>
        <Link to={`/armies/${armyId}`} className="btn-primary">
          Back to Army
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Link
        to={`/armies/${armyId}`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Army
      </Link>

      <h2 className="text-2xl font-bold mb-6">Edit Unit</h2>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit Type (Read-only) */}
        <div>
          <label className="label">Unit Type</label>
          <input
            type="text"
            disabled
            className="input bg-gray-100 cursor-not-allowed"
            value={unit.unitTypeId}
          />
          <p className="mt-2 text-sm text-gray-500">Unit type cannot be changed after creation</p>
        </div>

        {/* Custom Name */}
        <div>
          <label htmlFor="customName" className="label">
            Custom Name (optional)
          </label>
          <input
            id="customName"
            type="text"
            className="input"
            value={formData.customName}
            onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
            placeholder="e.g., The Crimson Guard"
            disabled={updating}
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to use default unit type ID: {unit.unitTypeId}
          </p>
        </div>

        {/* Rank */}
        <div>
          <label htmlFor="rank" className="label">
            Rank
          </label>
          <select
            id="rank"
            className="input"
            value={formData.rank}
            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            disabled={updating}
          >
            {RANKS.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div>

        {/* Renown */}
        <div>
          <label htmlFor="renown" className="label">
            Renown
          </label>
          <input
            id="renown"
            type="number"
            min="0"
            className="input"
            value={formData.renown}
            onChange={(e) => setFormData({ ...formData, renown: parseInt(e.target.value) || 0 })}
            disabled={updating}
          />
        </div>

        {/* Reinforced */}
        <div className="flex items-center gap-2">
          <input
            id="reinforced"
            type="checkbox"
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            checked={formData.reinforced}
            onChange={(e) => setFormData({ ...formData, reinforced: e.target.checked })}
            disabled={updating}
          />
          <label htmlFor="reinforced" className="text-sm font-medium text-gray-700">
            Reinforced
          </label>
        </div>

        {/* Enhancement */}
        <div>
          <label htmlFor="enhancement" className="label">
            Enhancement (optional)
          </label>
          <input
            id="enhancement"
            type="text"
            className="input"
            value={formData.enhancement}
            onChange={(e) => setFormData({ ...formData, enhancement: e.target.value })}
            placeholder="e.g., Banner Bearer, Musician"
            disabled={updating}
          />
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

        {/* Delete Unit */}
        <div className="pt-6 border-t">
          <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-3">
            Deleting a unit is permanent and cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-secondary bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
            disabled={deleting || updating}
          >
            {deleting ? 'Deleting...' : 'Delete Unit'}
          </button>
        </div>
      </form>
    </div>
  );
}
