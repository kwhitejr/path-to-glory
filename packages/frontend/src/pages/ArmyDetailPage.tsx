import { useParams, Link } from 'react-router-dom';
import { getFactionById } from '@path-to-glory/shared';

// Mock data - will be replaced with GraphQL query
const mockArmy = {
  id: '1',
  name: 'The Crimson Host',
  factionId: 'flesh-eater-courts',
  glory: 12,
  renown: 3,
  realmOfOrigin: 'Shyish',
  background: 'A noble court of cannibalistic ghouls',
  units: [
    {
      id: 'u1',
      name: 'Lord Commander',
      warscroll: 'Abhorrant Archregent',
      rank: 'Warlord',
      renown: 2,
      enhancements: ['Ancient Heraldry'],
      pathAbilities: ['Inspiring Presence'],
      reinforced: false,
    },
    {
      id: 'u2',
      name: 'The Royal Guard',
      warscroll: 'Crypt Horrors',
      rank: 'Favoured',
      renown: 1,
      enhancements: [],
      pathAbilities: ['Deadly Coordination'],
      reinforced: true,
    },
  ],
};

export default function ArmyDetailPage() {
  const { armyId } = useParams();
  const army = mockArmy; // TODO: GraphQL query
  const faction = getFactionById(army.factionId);

  if (!army) {
    return <div>Army not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/armies" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Armies
      </Link>

      {/* Army Header - matches roster PDF */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{army.name}</h2>
            <p className="text-gray-600">{faction?.name}</p>
          </div>
          <Link to={`/armies/${armyId}/edit`} className="btn-secondary text-sm">
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Glory Points</span>
            <span className="font-bold text-lg">{army.glory}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Renown</span>
            <span className="font-bold text-lg">{army.renown}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Realm of Origin</span>
            <span className="font-semibold">{army.realmOfOrigin || '-'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Faction</span>
            <span className="font-semibold">{faction?.grandAlliance}</span>
          </div>
        </div>

        {army.background && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Background</h3>
            <p className="text-sm">{army.background}</p>
          </div>
        )}
      </div>

      {/* Order of Battle - matches roster PDF structure */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Order of Battle</h3>
          <button className="btn-primary text-sm">+ Add Unit</button>
        </div>

        <div className="space-y-4">
          {army.units.map((unit) => (
            <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
              {/* Unit Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{unit.name}</h4>
                    {unit.rank === 'Warlord' && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        WARLORD
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{unit.warscroll}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Unit Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Rank:</span>{' '}
                  <span className="font-semibold">{unit.rank}</span>
                </div>
                <div>
                  <span className="text-gray-500">Renown:</span>{' '}
                  <span className="font-semibold">{unit.renown}</span>
                </div>
                {unit.reinforced && (
                  <div>
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                      Reinforced
                    </span>
                  </div>
                )}
              </div>

              {/* Enhancements & Abilities */}
              {(unit.enhancements.length > 0 || unit.pathAbilities.length > 0) && (
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {unit.enhancements.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">Enhancements:</span>
                      <ul className="space-y-1">
                        {unit.enhancements.map((e, i) => (
                          <li key={i} className="text-sm">
                            • {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {unit.pathAbilities.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">Path Abilities:</span>
                      <ul className="space-y-1">
                        {unit.pathAbilities.map((a, i) => (
                          <li key={i} className="text-sm">
                            • {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to={`/armies/${armyId}/battle`} className="btn-primary text-center">
          Record Battle
        </Link>
        <Link to={`/armies/${armyId}/upgrade`} className="btn-secondary text-center">
          Upgrade Units
        </Link>
      </div>
    </div>
  );
}
