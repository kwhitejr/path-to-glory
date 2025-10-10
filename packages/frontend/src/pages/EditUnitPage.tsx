import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getFactionById } from '@path-to-glory/shared';
import { useAuth } from '../contexts/AuthContext';

const RANKS = ['Regular', 'Veteran', 'Elite'];

export default function EditUnitPage() {
  const navigate = useNavigate();
  const { armyId, unitId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<any>(null);
  const [army, setArmy] = useState<any>(null);

  const [formData, setFormData] = useState({
    customName: '',
    rank: 'Regular',
    renown: 0,
    reinforced: false,
    enhancement: '',
    pathAbility: '',
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
      alert('You can only edit units in your own armies');
      navigate('/armies');
      return;
    }

    const foundUnit = foundArmy.units?.find((u: any) => u.id === unitId);

    if (!foundUnit) {
      alert('Unit not found');
      navigate(`/armies/${armyId}`);
      return;
    }

    setArmy(foundArmy);
    setUnit(foundUnit);

    // If unit.name differs from warscroll, it's a custom name
    const hasCustomName = foundUnit.name !== foundUnit.warscroll;

    setFormData({
      customName: hasCustomName ? foundUnit.name : '',
      rank: foundUnit.rank || 'Regular',
      renown: foundUnit.renown || 0,
      reinforced: foundUnit.reinforced || false,
      enhancement: foundUnit.enhancement || '',
      pathAbility: foundUnit.pathAbility || '',
    });
    setLoading(false);
  }, [armyId, unitId, navigate, user, authLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !unit) {
      alert('You must be logged in');
      return;
    }

    // TODO: Replace with GraphQL mutation when backend is ready
    const existingArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    const armyIndex = existingArmies.findIndex((a: any) => a.id === armyId);

    if (armyIndex === -1) {
      alert('Army not found');
      return;
    }

    const unitIndex = existingArmies[armyIndex].units?.findIndex((u: any) => u.id === unitId);

    if (unitIndex === -1 || unitIndex === undefined) {
      alert('Unit not found');
      return;
    }

    // Update the unit
    existingArmies[armyIndex].units[unitIndex] = {
      ...existingArmies[armyIndex].units[unitIndex],
      name: formData.customName || unit.warscroll,
      rank: formData.rank,
      renown: formData.renown,
      reinforced: formData.reinforced,
      enhancement: formData.enhancement,
      pathAbility: formData.pathAbility,
    };

    localStorage.setItem('armies', JSON.stringify(existingArmies));

    console.log('Updated unit:', existingArmies[armyIndex].units[unitIndex]);

    navigate(`/armies/${armyId}`);
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }

    // TODO: Replace with GraphQL mutation when backend is ready
    const existingArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    const armyIndex = existingArmies.findIndex((a: any) => a.id === armyId);

    if (armyIndex !== -1 && existingArmies[armyIndex].units) {
      existingArmies[armyIndex].units = existingArmies[armyIndex].units.filter(
        (u: any) => u.id !== unitId
      );
      localStorage.setItem('armies', JSON.stringify(existingArmies));
    }

    navigate(`/armies/${armyId}`);
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit Type (Read-only) */}
        <div>
          <label className="label">Unit Type</label>
          <input
            type="text"
            disabled
            className="input bg-gray-100 cursor-not-allowed"
            value={unit.warscroll}
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
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to use default unit name: {unit.warscroll}
          </p>
        </div>

        {/* Rank */}
        <div>
          <label htmlFor="rank" className="label">
            Rank *
          </label>
          <select
            id="rank"
            required
            className="input"
            value={formData.rank}
            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
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
            className="input w-32"
            value={formData.renown}
            onChange={(e) => setFormData({ ...formData, renown: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Reinforced */}
        <div className="flex items-center">
          <input
            id="reinforced"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={formData.reinforced}
            onChange={(e) => setFormData({ ...formData, reinforced: e.target.checked })}
          />
          <label htmlFor="reinforced" className="ml-2 block text-sm text-gray-700">
            Reinforced Unit
          </label>
        </div>

        {/* Enhancement */}
        <div>
          <label className="label">Enhancement (Artefact of Power)</label>
          <div className="space-y-2">
            {/* None option */}
            <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="enhancement"
                value=""
                checked={formData.enhancement === ''}
                onChange={(e) => setFormData({ ...formData, enhancement: e.target.value })}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">None</span>
            </label>

            {/* Enhancement options */}
            {army && getFactionById(army.factionId)?.enhancements?.map((enh) => (
              <label
                key={enh.id}
                className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                title={enh.description}
              >
                <input
                  type="radio"
                  name="enhancement"
                  value={enh.name}
                  checked={formData.enhancement === enh.name}
                  onChange={(e) => setFormData({ ...formData, enhancement: e.target.value })}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-700">{enh.name}</span>
                  <p className="mt-1 text-xs text-gray-500">{enh.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Path Ability */}
        <div>
          <label className="label">Path Ability (Heroic Trait)</label>
          <div className="space-y-2">
            {/* None option */}
            <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="pathAbility"
                value=""
                checked={formData.pathAbility === ''}
                onChange={(e) => setFormData({ ...formData, pathAbility: e.target.value })}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">None</span>
            </label>

            {/* Path Ability options */}
            {army && getFactionById(army.factionId)?.pathAbilities?.map((ability) => (
              <label
                key={ability.id}
                className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                title={ability.description}
              >
                <input
                  type="radio"
                  name="pathAbility"
                  value={ability.name}
                  checked={formData.pathAbility === ability.name}
                  onChange={(e) => setFormData({ ...formData, pathAbility: e.target.value })}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-700">{ability.name}</span>
                  <p className="mt-1 text-xs text-gray-500">{ability.description}</p>
                </div>
              </label>
            ))}
          </div>
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
          >
            Delete Unit
          </button>
        </div>
      </form>
    </div>
  );
}
