import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getUnitsByFaction, getFactionById, type UnitWarscroll } from '@path-to-glory/shared';
import { useAuth } from '../contexts/AuthContext';

const RANKS = ['Regular', 'Veteran', 'Elite'];

export default function AddUnitPage() {
  const navigate = useNavigate();
  const { armyId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [army, setArmy] = useState<any>(null);
  const [availableUnits, setAvailableUnits] = useState<Record<string, UnitWarscroll>>({});

  const [formData, setFormData] = useState({
    warscrollId: '',
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
      alert('You can only add units to your own armies');
      navigate('/armies');
      return;
    }

    setArmy(foundArmy);
    setAvailableUnits(getUnitsByFaction(foundArmy.factionId));
    setLoading(false);
  }, [armyId, navigate, user, authLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !army) {
      alert('You must be logged in');
      return;
    }

    if (!formData.warscrollId) {
      alert('Please select a unit type');
      return;
    }

    const selectedWarscroll = availableUnits[formData.warscrollId];

    // Generate unique unit ID
    const unitId = `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newUnit = {
      id: unitId,
      warscroll: selectedWarscroll.name,
      warscrollId: formData.warscrollId,
      name: formData.customName || selectedWarscroll.name,
      rank: formData.rank,
      renown: formData.renown,
      reinforced: formData.reinforced,
      enhancement: formData.enhancement,
      pathAbility: formData.pathAbility,
    };

    // TODO: Replace with GraphQL mutation when backend is ready
    const existingArmies = JSON.parse(localStorage.getItem('armies') || '[]');
    const armyIndex = existingArmies.findIndex((a: any) => a.id === armyId);

    if (armyIndex === -1) {
      alert('Army not found');
      return;
    }

    existingArmies[armyIndex].units = existingArmies[armyIndex].units || [];
    existingArmies[armyIndex].units.push(newUnit);

    localStorage.setItem('armies', JSON.stringify(existingArmies));

    console.log('Added unit:', newUnit);

    navigate(`/armies/${armyId}`);
  };


  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const unitList = Object.values(availableUnits);
  const selectedWarscroll = formData.warscrollId ? availableUnits[formData.warscrollId] : null;

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

      <h2 className="text-2xl font-bold mb-6">Add Unit</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit Type Selection */}
        <div>
          <label htmlFor="warscroll" className="label">
            Unit Type *
          </label>
          <select
            id="warscroll"
            required
            className="input"
            value={formData.warscrollId}
            onChange={(e) => setFormData({ ...formData, warscrollId: e.target.value })}
          >
            <option value="">Select a unit...</option>
            {unitList
              .sort((a, b) => {
                // Sort Heroes first, then by name
                const aIsHero = a.keywords.unit.includes('Hero');
                const bIsHero = b.keywords.unit.includes('Hero');
                if (aIsHero && !bIsHero) return -1;
                if (!aIsHero && bIsHero) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((unit) => {
                const isHero = unit.keywords.unit.includes('Hero');
                const prefix = isHero ? '[Hero] ' : '';
                return (
                  <option key={unit.id} value={unit.id}>
                    {prefix}
                    {unit.name}
                  </option>
                );
              })}
          </select>
          {selectedWarscroll && (
            <p className="mt-2 text-sm text-gray-600">
              {selectedWarscroll.subtitle || selectedWarscroll.keywords.unit.join(', ')}
            </p>
          )}
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
            Give this unit a unique name to distinguish it in your roster
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
          <label htmlFor="enhancement" className="label">
            Enhancement (Artefact of Power)
          </label>
          <select
            id="enhancement"
            className="input"
            value={formData.enhancement}
            onChange={(e) => setFormData({ ...formData, enhancement: e.target.value })}
          >
            <option value="">None</option>
            {army && getFactionById(army.factionId)?.enhancements?.map((enh) => (
              <option key={enh.id} value={enh.name}>
                {enh.name}
              </option>
            ))}
          </select>
          {formData.enhancement && army && (
            <p className="mt-2 text-sm text-gray-600">
              {getFactionById(army.factionId)?.enhancements?.find(e => e.name === formData.enhancement)?.description}
            </p>
          )}
        </div>

        {/* Path Ability */}
        <div>
          <label htmlFor="pathAbility" className="label">
            Path Ability (Heroic Trait)
          </label>
          <select
            id="pathAbility"
            className="input"
            value={formData.pathAbility}
            onChange={(e) => setFormData({ ...formData, pathAbility: e.target.value })}
          >
            <option value="">None</option>
            {army && getFactionById(army.factionId)?.pathAbilities?.map((ability) => (
              <option key={ability.id} value={ability.name}>
                {ability.name}
              </option>
            ))}
          </select>
          {formData.pathAbility && army && (
            <p className="mt-2 text-sm text-gray-600">
              {getFactionById(army.factionId)?.pathAbilities?.find(a => a.name === formData.pathAbility)?.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            Add Unit
          </button>
          <button
            type="button"
            onClick={() => navigate(`/armies/${armyId}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
