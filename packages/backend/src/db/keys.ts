/**
 * DynamoDB single-table design key generation utilities
 *
 * Table Schema:
 * - PK (Partition Key): Primary entity identifier
 * - SK (Sort Key): Entity type or relationship
 * - GSI1PK: User-based access pattern
 * - GSI1SK: Secondary sort for user queries
 */

import { DynamoDBKeyPrefix } from '@path-to-glory/shared';

export const keys = {
  // User keys
  user: (cognitoId: string) => ({
    PK: `${DynamoDBKeyPrefix.USER}${cognitoId}`,
    SK: DynamoDBKeyPrefix.METADATA,
  }),

  // Campaign keys
  campaign: (campaignId: string) => ({
    PK: `${DynamoDBKeyPrefix.CAMPAIGN}${campaignId}`,
    SK: DynamoDBKeyPrefix.METADATA,
  }),

  // Army keys
  army: (campaignId: string, armyId: string) => ({
    PK: `${DynamoDBKeyPrefix.CAMPAIGN}${campaignId}`,
    SK: `${DynamoDBKeyPrefix.ARMY}${armyId}`,
  }),

  // Unit keys
  unit: (campaignId: string, armyId: string, unitId: string) => ({
    PK: `${DynamoDBKeyPrefix.CAMPAIGN}${campaignId}`,
    SK: `${DynamoDBKeyPrefix.ARMY}${armyId}${DynamoDBKeyPrefix.UNIT}${unitId}`,
  }),

  // Battle keys
  battle: (campaignId: string, battleId: string) => ({
    PK: `${DynamoDBKeyPrefix.CAMPAIGN}${campaignId}`,
    SK: `${DynamoDBKeyPrefix.BATTLE}${battleId}`,
  }),
};

export const gsiKeys = {
  // Get all campaigns for a user
  userCampaigns: (userId: string) => ({
    GSI1PK: `${DynamoDBKeyPrefix.USER}${userId}`,
    GSI1SK: DynamoDBKeyPrefix.CAMPAIGN,
  }),

  // Get all armies for a user
  userArmies: (userId: string) => ({
    GSI1PK: `${DynamoDBKeyPrefix.USER}${userId}`,
    GSI1SK: DynamoDBKeyPrefix.ARMY,
  }),

  // Link army to user
  armyOwner: (userId: string, armyId: string) => ({
    GSI1PK: `${DynamoDBKeyPrefix.USER}${userId}`,
    GSI1SK: `${DynamoDBKeyPrefix.ARMY}${armyId}`,
  }),

  // Link campaign to user
  campaignOwner: (userId: string, campaignId: string) => ({
    GSI1PK: `${DynamoDBKeyPrefix.USER}${userId}`,
    GSI1SK: `${DynamoDBKeyPrefix.CAMPAIGN}${campaignId}`,
  }),
};
