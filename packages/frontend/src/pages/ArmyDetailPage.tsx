import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { getFactionById, UnitRank, getUnit } from '@path-to-glory/shared';
import { GET_ARMY } from '../graphql/operations';
import type { GetArmyQuery } from '../gql/graphql';

const LOADING_MESSAGES = [
  'Marshalling the forces...',
  'Consulting the battle scrolls...',
  'Mustering the warband...',
  'Communing with the Realm Gods...',
  'Reading the ancient tomes...',
  'Rallying the troops...',
  'Gathering the order of battle...',
  'Preparing for glory...',
  'Summoning the host...',
  'Unfurling the battle standards...',
];

export default function ArmyDetailPage() {
  const { armyId } = useParams();
  const [loadingMessage] = useState(() =>
    LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  );

  const { data, loading, error } = useQuery<GetArmyQuery>(GET_ARMY, {
    variables: { id: armyId! },
    skip: !armyId,
  });

  const army = data?.army;
  const faction = army ? getFactionById(army.factionId) : null;

  type UnitType = NonNullable<GetArmyQuery['army']>['units'][number];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-600 italic">{loadingMessage}</p>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Glory Points</span>
            <span className="font-bold text-lg">{army.glory}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Renown</span>
            <span className="font-bold text-lg">{army.renown}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Grand Alliance</span>
            <span className="font-semibold">{faction?.grandAlliance}</span>
          </div>
        </div>
      </div>

      {/* Order of Battle - matches roster PDF structure */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Order of Battle</h3>
          <Link to={`/armies/${armyId}/units/new`} className="btn-primary text-sm">
            + Add Unit
          </Link>
        </div>

        <div className="space-y-4">
          {army.units && army.units.length > 0 ? (
            army.units.map((unit: UnitType) => {
              const unitWarscroll = getUnit(army.factionId, unit.unitTypeId);
              const unitTypeName = unitWarscroll?.name || unit.unitTypeId;

              return (
            <Link
              key={unit.id}
              to={`/armies/${armyId}/units/${unit.id}/edit`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50/50 transition-colors cursor-pointer"
            >
              {/* Unit Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{unit.name}</h4>
                    {unit.rank === UnitRank.WARLORD && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        WARLORD
                      </span>
                    )}
                  </div>
                  {unit.name !== unitTypeName && (
                    <p className="text-sm text-gray-600">{unitTypeName}</p>
                  )}
                </div>
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
              {(unit.enhancements?.length > 0 || unit.veteranAbilities?.length > 0) && (
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {unit.enhancements?.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">Enhancements:</span>
                      {unit.enhancements.map((enh: string, idx: number) => (
                        <p key={idx} className="text-sm">• {enh}</p>
                      ))}
                    </div>
                  )}
                  {unit.veteranAbilities?.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">Veteran Abilities:</span>
                      {unit.veteranAbilities.map((ability: string, idx: number) => (
                        <p key={idx} className="text-sm">• {ability}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Link>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No units in this army yet</p>
              <p className="text-sm mt-2">Add units to build your order of battle</p>
            </div>
          )}
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
