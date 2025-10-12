import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { getAllFactions, type FactionData, ViewMode, FilterValue, GrandAlliance, getUnit } from '@path-to-glory/shared';
import { useAuth } from '../contexts/AuthContext';
import { GET_MY_ARMIES } from '../graphql/operations';
import type { GetMyArmiesQuery } from '../gql/graphql';
import { PresignedImage } from '../components/PresignedImage';

export default function ArmyListPage() {
  const { user } = useAuth();
  const factions = getAllFactions();
  const factionsMap = Object.fromEntries(factions.map((f: FactionData) => [f.id, f]));

  // Load armies from backend via GraphQL
  const { data, loading, error } = useQuery<GetMyArmiesQuery>(GET_MY_ARMIES);

  const allArmies = data?.myArmies || [];
  type ArmyType = GetMyArmiesQuery['myArmies'][number];

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MINE);
  const [selectedGrandAlliance, setSelectedGrandAlliance] = useState<string>(FilterValue.ALL);
  const [selectedFaction, setSelectedFaction] = useState<string>(FilterValue.ALL);
  const [selectedPlayer, setSelectedPlayer] = useState<string>(FilterValue.ALL);

  // Get unique values for filters
  const grandAlliances = useMemo(() => {
    const alliances = new Set(factions.map((f) => f.grandAlliance));
    return Array.from(alliances).sort();
  }, [factions]);

  const players = useMemo(() => {
    const playerMap = new Map<string, string>();
    allArmies.forEach((army) => {
      if (army.player) {
        playerMap.set(army.player.id, army.player.name);
      }
    });
    return Array.from(playerMap.entries()).map(([id, name]) => ({ id, name }));
  }, [allArmies]);

  // Filter armies
  const filteredArmies = useMemo(() => {
    let result: ArmyType[] = allArmies;

    // Filter by view mode (mine vs all)
    if (viewMode === ViewMode.MINE && user) {
      result = result.filter((army) => army.player?.id === user.id);
    }

    // Filter by grand alliance
    if (selectedGrandAlliance !== FilterValue.ALL) {
      result = result.filter((army) => {
        const faction = factionsMap[army.factionId];
        return faction?.grandAlliance === selectedGrandAlliance;
      });
    }

    // Filter by faction
    if (selectedFaction !== FilterValue.ALL) {
      result = result.filter((army) => army.factionId === selectedFaction);
    }

    // Filter by player (only in 'all' mode)
    if (viewMode === ViewMode.ALL && selectedPlayer !== FilterValue.ALL) {
      result = result.filter((army) => army.player?.id === selectedPlayer);
    }

    return result;
  }, [viewMode, selectedGrandAlliance, selectedFaction, selectedPlayer, factionsMap, user, allArmies]);

  // Reset filters when switching view mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSelectedGrandAlliance(FilterValue.ALL);
    setSelectedFaction(FilterValue.ALL);
    setSelectedPlayer(FilterValue.ALL);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Armies</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading armies...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Armies</h2>
        </div>
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">Error loading armies: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Armies</h2>
        {user && (
          <Link to="/armies/new" className="btn-primary">
            + New Army
          </Link>
        )}
      </div>

      {/* View mode toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => handleViewModeChange(ViewMode.MINE)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            viewMode === ViewMode.MINE
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Armies
        </button>
        <button
          onClick={() => handleViewModeChange(ViewMode.ALL)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            viewMode === ViewMode.ALL
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Armies
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Grand Alliance filter */}
          <div>
            <label htmlFor="grandAlliance" className="label text-xs">
              Grand Alliance
            </label>
            <select
              id="grandAlliance"
              className="input text-sm"
              value={selectedGrandAlliance}
              onChange={(e) => setSelectedGrandAlliance(e.target.value)}
            >
              <option value={FilterValue.ALL}>All Alliances</option>
              {grandAlliances.map((alliance) => (
                <option key={alliance} value={alliance}>
                  {alliance}
                </option>
              ))}
            </select>
          </div>

          {/* Faction filter */}
          <div>
            <label htmlFor="faction" className="label text-xs">
              Faction
            </label>
            <select
              id="faction"
              className="input text-sm"
              value={selectedFaction}
              onChange={(e) => setSelectedFaction(e.target.value)}
            >
              <option value={FilterValue.ALL}>All Factions</option>
              {factions.map((faction: FactionData) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
          </div>

          {/* Player filter (only show in 'all' mode) */}
          {viewMode === ViewMode.ALL && (
            <div>
              <label htmlFor="player" className="label text-xs">
                Player
              </label>
              <select
                id="player"
                className="input text-sm"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                <option value={FilterValue.ALL}>All Players</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Active filters count */}
        {(selectedGrandAlliance !== FilterValue.ALL ||
          selectedFaction !== FilterValue.ALL ||
          (viewMode === ViewMode.ALL && selectedPlayer !== FilterValue.ALL)) && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredArmies.length} of {allArmies.length} armies
            </p>
            <button
              onClick={() => {
                setSelectedGrandAlliance(FilterValue.ALL);
                setSelectedFaction(FilterValue.ALL);
                setSelectedPlayer(FilterValue.ALL);
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Army list - mobile-optimized cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!user && viewMode === ViewMode.MINE ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">
              Please sign in to view and create your armies
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Refresh Page After Sign In
            </button>
          </div>
        ) : filteredArmies.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">
              {viewMode === ViewMode.MINE ? 'No armies yet' : 'No armies match your filters'}
            </p>
            {viewMode === ViewMode.MINE && user && (
              <Link to="/armies/new" className="btn-primary">
                Create Your First Army
              </Link>
            )}
          </div>
        ) : (
          filteredArmies.map((army) => {
            const faction = factionsMap[army.factionId];
            return (
              <Link
                key={army.id}
                to={`/armies/${army.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 flex items-start gap-3">
                    {/* Army thumbnail */}
                    <div className="flex-shrink-0">
                      <PresignedImage
                        imageKey={army.imageUrl}
                        alt={army.name}
                        className="h-20 w-20 rounded object-cover border-2 border-gray-200"
                        fallback={
                          <div className="flex h-20 w-20 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50">
                            <svg
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg">{army.name}</h3>
                      {viewMode === ViewMode.ALL && army.player && (
                        <div className="flex items-center gap-2 mt-1">
                          {army.player.picture ? (
                            <img
                              src={army.player.picture}
                              alt={army.player.name}
                              className="h-5 w-5 rounded-full border border-gray-200"
                            />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600">
                              {army.player.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="text-xs text-gray-500">by {army.player.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getAllianceColor(
                      faction?.grandAlliance
                    )}`}
                  >
                    {faction?.grandAlliance}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{faction?.name}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Glory:</span>{' '}
                    <span className="font-semibold">{army.glory}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Renown:</span>{' '}
                    <span className="font-semibold">{army.renown}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Points:</span>{' '}
                    <span className="font-semibold">
                      {army.units?.reduce((sum, unit) => {
                        const unitWarscroll = getUnit(army.factionId, unit.unitTypeId);
                        return sum + (unitWarscroll?.battleProfile?.points || 0);
                      }, 0) || 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

function getAllianceColor(alliance?: string) {
  switch (alliance) {
    case GrandAlliance.ORDER:
      return 'bg-blue-100 text-blue-700';
    case GrandAlliance.CHAOS:
      return 'bg-red-100 text-red-700';
    case GrandAlliance.DEATH:
      return 'bg-purple-100 text-purple-700';
    case GrandAlliance.DESTRUCTION:
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
