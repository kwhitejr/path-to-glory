import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { getAllFactions, getUnitsByFaction, type UnitWarscroll } from '@path-to-glory/shared';
import UnitSelector, { SelectedUnit } from '../components/UnitSelector';
import { useAuth } from '../contexts/AuthContext';
import { CREATE_CAMPAIGN, CREATE_ARMY, ADD_UNIT, GET_MY_CAMPAIGNS, GET_MY_ARMIES } from '../graphql/operations';

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
    realmOfOrigin: '',
    background: '',
  });
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
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
          await addUnit({
            variables: {
              armyId: newArmy.id,
              input: {
                unitTypeId: unit.warscrollId,
                name: unit.name,
                size: 1, // Default to 1 model - can be updated later
                wounds: warscroll?.characteristics?.health || 1,
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

  const handleFactionChange = (factionId: string) => {
    setFormData({ ...formData, factionId });
    // Clear units when faction changes
    setSelectedUnits([]);
  };

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
          <input
            id="realm"
            type="text"
            className="input"
            value={formData.realmOfOrigin}
            onChange={(e) => setFormData({ ...formData, realmOfOrigin: e.target.value })}
            placeholder="e.g., Ghyran, Aqshy, Shyish..."
            disabled={isSubmitting}
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
