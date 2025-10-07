import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllFactions, type FactionData } from '@path-to-glory/shared';

// Mock data for now - will be replaced with GraphQL query
const mockArmies = [
  {
    id: '1',
    name: 'The Crimson Host',
    factionId: 'flesh-eater-courts',
    playerId: 'player1',
    playerName: 'Alice',
    glory: 12,
    renown: 3,
  },
  {
    id: '2',
    name: 'Bone Legion',
    factionId: 'ossiarch-bonereapers',
    playerId: 'player1',
    playerName: 'Alice',
    glory: 8,
    renown: 2,
  },
  {
    id: '3',
    name: 'Dark Covenant',
    factionId: 'slaves-to-darkness',
    playerId: 'player2',
    playerName: 'Bob',
    glory: 15,
    renown: 4,
  },
  {
    id: '4',
    name: 'Ghoul Court',
    factionId: 'flesh-eater-courts',
    playerId: 'player3',
    playerName: 'Charlie',
    glory: 6,
    renown: 1,
  },
];

// Mock current user
const mockCurrentUser = { id: 'player1', name: 'Alice' };

type ViewMode = 'mine' | 'all';

export default function ArmyListPage() {
  const factions = getAllFactions();
  const factionsMap = Object.fromEntries(factions.map((f: FactionData) => [f.id, f]));

  const [viewMode, setViewMode] = useState<ViewMode>('mine');
  const [selectedGrandAlliance, setSelectedGrandAlliance] = useState<string>('all');
  const [selectedFaction, setSelectedFaction] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');

  // Get unique values for filters
  const grandAlliances = useMemo(() => {
    const alliances = new Set(factions.map((f) => f.grandAlliance));
    return Array.from(alliances).sort();
  }, [factions]);

  const players = useMemo(() => {
    const playerMap = new Map<string, string>();
    mockArmies.forEach((army) => {
      playerMap.set(army.playerId, army.playerName);
    });
    return Array.from(playerMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter armies
  const filteredArmies = useMemo(() => {
    let result = mockArmies;

    // Filter by view mode (mine vs all)
    if (viewMode === 'mine') {
      result = result.filter((army) => army.playerId === mockCurrentUser.id);
    }

    // Filter by grand alliance
    if (selectedGrandAlliance !== 'all') {
      result = result.filter((army) => {
        const faction = factionsMap[army.factionId];
        return faction?.grandAlliance === selectedGrandAlliance;
      });
    }

    // Filter by faction
    if (selectedFaction !== 'all') {
      result = result.filter((army) => army.factionId === selectedFaction);
    }

    // Filter by player (only in 'all' mode)
    if (viewMode === 'all' && selectedPlayer !== 'all') {
      result = result.filter((army) => army.playerId === selectedPlayer);
    }

    return result;
  }, [viewMode, selectedGrandAlliance, selectedFaction, selectedPlayer, factionsMap]);

  // Reset filters when switching view mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSelectedGrandAlliance('all');
    setSelectedFaction('all');
    setSelectedPlayer('all');
  };

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Armies</h2>
        <Link to="/armies/new" className="btn-primary">
          + New Army
        </Link>
      </div>

      {/* View mode toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => handleViewModeChange('mine')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            viewMode === 'mine'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Armies
        </button>
        <button
          onClick={() => handleViewModeChange('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            viewMode === 'all'
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
              <option value="all">All Alliances</option>
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
              <option value="all">All Factions</option>
              {factions.map((faction: FactionData) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
          </div>

          {/* Player filter (only show in 'all' mode) */}
          {viewMode === 'all' && (
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
                <option value="all">All Players</option>
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
        {(selectedGrandAlliance !== 'all' ||
          selectedFaction !== 'all' ||
          (viewMode === 'all' && selectedPlayer !== 'all')) && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredArmies.length} of {mockArmies.length} armies
            </p>
            <button
              onClick={() => {
                setSelectedGrandAlliance('all');
                setSelectedFaction('all');
                setSelectedPlayer('all');
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
        {filteredArmies.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">
              {viewMode === 'mine' ? 'No armies yet' : 'No armies match your filters'}
            </p>
            {viewMode === 'mine' && (
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
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{army.name}</h3>
                    {viewMode === 'all' && (
                      <p className="text-xs text-gray-500 mt-0.5">by {army.playerName}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getAllianceColor(
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
    case 'ORDER':
      return 'bg-blue-100 text-blue-700';
    case 'CHAOS':
      return 'bg-red-100 text-red-700';
    case 'DEATH':
      return 'bg-purple-100 text-purple-700';
    case 'DESTRUCTION':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
