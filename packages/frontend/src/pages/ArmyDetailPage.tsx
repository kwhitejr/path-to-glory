import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { getFactionById, UnitRank, getUnit, RealmOfOriginLabels, getBattleFormationsByFaction } from '@path-to-glory/shared';
import { GET_ARMY } from '../graphql/operations';
import type { GetArmyQuery } from '../gql/graphql';
import { PresignedImage } from '../components/PresignedImage';

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
  const battleFormations = army ? getBattleFormationsByFaction(army.factionId) : [];
  const selectedFormation = army?.battleFormation
    ? battleFormations.find(f => f.name === army.battleFormation)
    : null;

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

      {/* Army Banner Image */}
      <PresignedImage
        imageKey={army.imageUrl}
        alt={`${army.name} banner`}
        className="w-full h-48 md:h-64 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
      />

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
            <span className="font-bold text-lg text-primary-600">{army.glory}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Renown</span>
            <span className="font-bold text-lg text-primary-600">{army.renown}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Total Points</span>
            <span className="font-bold text-lg text-primary-600">
              {army.units?.reduce((sum: number, unit: UnitType) => {
                const unitWarscroll = getUnit(army.factionId, unit.unitTypeId);
                return sum + (unitWarscroll?.battleProfile?.points || 0);
              }, 0) || 0}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Grand Alliance</span>
            <span className="font-semibold">{faction?.grandAlliance}</span>
          </div>
          {army.realmOfOrigin && (
            <div>
              <span className="text-gray-500 block">Realm of Origin</span>
              <span className="font-semibold">{RealmOfOriginLabels[army.realmOfOrigin as unknown as keyof typeof RealmOfOriginLabels]}</span>
            </div>
          )}
          {army.battleFormation && (
            <div className="col-span-2">
              <span className="text-gray-500 block mb-1">Battle Formation</span>
              <span className="font-semibold block">{army.battleFormation}</span>
              {selectedFormation && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedFormation.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Background */}
        {army.background && (
          <div className="mt-4 pt-4 border-t">
            <span className="text-gray-500 block mb-2">Background</span>
            <p className="text-sm whitespace-pre-wrap">{army.background}</p>
          </div>
        )}

        {/* Notable Events */}
        {army.notableEvents && (
          <div className="mt-4 pt-4 border-t">
            <span className="text-gray-500 block mb-2">Notable Events</span>
            <p className="text-sm whitespace-pre-wrap">{army.notableEvents}</p>
          </div>
        )}
      </div>

      {/* Quest Log */}
      {(army.currentQuest || army.completedQuests?.length > 0) && (
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Quest Log</h3>

          {army.currentQuest && (
            <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Current Quest</span>
                <span className="text-xs font-semibold px-2 py-1 bg-primary-600 text-white rounded">
                  {army.questPoints || 0} points
                </span>
              </div>
              <p className="font-semibold">{army.currentQuest}</p>
            </div>
          )}

          {army.completedQuests && army.completedQuests.length > 0 && (
            <div>
              <span className="text-sm text-gray-600 block mb-2">Completed Quests ({army.completedQuests.length})</span>
              <ul className="space-y-1">
                {army.completedQuests.map((quest: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{quest}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Arcane Tome */}
      {(army.spellLore?.length > 0 || army.prayerLore?.length > 0 || army.manifestationLore?.length > 0) && (
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Arcane Tome</h3>

          <div className="grid md:grid-cols-3 gap-4">
            {army.spellLore && army.spellLore.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 block mb-2">Spell Lore</span>
                <ul className="space-y-1">
                  {army.spellLore.map((spell: string, idx: number) => (
                    <li key={idx} className="text-sm">• {spell}</li>
                  ))}
                </ul>
              </div>
            )}

            {army.prayerLore && army.prayerLore.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 block mb-2">Prayer Lore</span>
                <ul className="space-y-1">
                  {army.prayerLore.map((prayer: string, idx: number) => (
                    <li key={idx} className="text-sm">• {prayer}</li>
                  ))}
                </ul>
              </div>
            )}

            {army.manifestationLore && army.manifestationLore.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 block mb-2">Manifestation Lore</span>
                <ul className="space-y-1">
                  {army.manifestationLore.map((manifestation: string, idx: number) => (
                    <li key={idx} className="text-sm">• {manifestation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

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
              const points = unitWarscroll?.battleProfile?.points || 0;

              return (
            <Link
              key={unit.id}
              to={`/armies/${armyId}/units/${unit.id}/edit`}
              className="flex border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 hover:bg-primary-50/50 transition-colors cursor-pointer"
            >
              {/* Left column - Unit Image */}
              <div className="w-1/4 flex-shrink-0">
                <PresignedImage
                  imageKey={unit.imageUrl}
                  alt={unit.name}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="flex w-full h-full items-center justify-center bg-gray-50">
                      <svg
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  }
                />
              </div>

              {/* Right column - Unit Details */}
              <div className="flex-1 p-4">
                {/* Unit Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
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
                  <div className="text-right ml-2">
                    <div className="text-sm font-semibold text-primary-600">{points} pts</div>
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
              </div>
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
