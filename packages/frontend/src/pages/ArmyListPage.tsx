import { Link } from 'react-router-dom';
import { getAllFactions, type FactionData } from '@path-to-glory/shared';

// Mock data for now - will be replaced with GraphQL query
const mockArmies = [
  {
    id: '1',
    name: 'The Crimson Host',
    factionId: 'flesh-eater-courts',
    glory: 12,
    renown: 3,
  },
  {
    id: '2',
    name: 'Bone Legion',
    factionId: 'ossiarch-bonereapers',
    glory: 8,
    renown: 2,
  },
];

export default function ArmyListPage() {
  const factions = getAllFactions();
  const factionsMap = Object.fromEntries(factions.map((f: FactionData) => [f.id, f]));

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Armies</h2>
        <Link to="/armies/new" className="btn-primary">
          + New Army
        </Link>
      </div>

      {/* Army list - mobile-optimized cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockArmies.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No armies yet</p>
            <Link to="/armies/new" className="btn-primary">
              Create Your First Army
            </Link>
          </div>
        ) : (
          mockArmies.map((army) => {
            const faction = factionsMap[army.factionId];
            return (
              <Link
                key={army.id}
                to={`/armies/${army.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{army.name}</h3>
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
