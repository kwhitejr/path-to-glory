/**
 * DynamoDB single-table design key generation utilities
 *
 * Table Schema:
 * - PK (Partition Key): Primary entity identifier
 * - SK (Sort Key): Entity type or relationship
 * - GSI1PK: User-based access pattern
 * - GSI1SK: Secondary sort for user queries
 */

export const keys = {
  // User keys
  user: (cognitoId: string) => ({
    PK: `USER#${cognitoId}`,
    SK: 'METADATA',
  }),

  // Campaign keys
  campaign: (campaignId: string) => ({
    PK: `CAMPAIGN#${campaignId}`,
    SK: 'METADATA',
  }),

  // Army keys
  army: (campaignId: string, armyId: string) => ({
    PK: `CAMPAIGN#${campaignId}`,
    SK: `ARMY#${armyId}`,
  }),

  // Unit keys
  unit: (campaignId: string, armyId: string, unitId: string) => ({
    PK: `CAMPAIGN#${campaignId}`,
    SK: `ARMY#${armyId}#UNIT#${unitId}`,
  }),

  // Battle keys
  battle: (campaignId: string, battleId: string) => ({
    PK: `CAMPAIGN#${campaignId}`,
    SK: `BATTLE#${battleId}`,
  }),
};

export const gsiKeys = {
  // Get all campaigns for a user
  userCampaigns: (userId: string) => ({
    GSI1PK: `USER#${userId}`,
    GSI1SK: 'CAMPAIGN#',
  }),

  // Get all armies for a user
  userArmies: (userId: string) => ({
    GSI1PK: `USER#${userId}`,
    GSI1SK: 'ARMY#',
  }),

  // Link army to user
  armyOwner: (userId: string, armyId: string) => ({
    GSI1PK: `USER#${userId}`,
    GSI1SK: `ARMY#${armyId}`,
  }),

  // Link campaign to user
  campaignOwner: (userId: string, campaignId: string) => ({
    GSI1PK: `USER#${userId}`,
    GSI1SK: `CAMPAIGN#${campaignId}`,
  }),
};
