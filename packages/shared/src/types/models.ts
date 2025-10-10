/**
 * Internal data models for DynamoDB entities
 * These map to the GraphQL types but represent the actual stored structure
 */

import { BattleOutcome } from '../enums.js';

export interface UserModel {
  pk: string; // USER#<cognitoId>
  sk: string; // METADATA
  cognitoId: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
  createdAt: string;
}

export interface CampaignModel {
  pk: string; // CAMPAIGN#<id>
  sk: string; // METADATA
  id: string;
  name: string;
  ownerId: string; // cognitoId
  createdAt: string;
}

export interface ArmyModel {
  pk: string; // CAMPAIGN#<campaignId>
  sk: string; // ARMY#<armyId>
  id: string;
  campaignId: string;
  playerId: string; // cognitoId
  factionId: string;
  name: string;
  glory: number;
  renown: number;
  createdAt: string;
  updatedAt: string;
}

export interface UnitModel {
  pk: string; // CAMPAIGN#<campaignId>
  sk: string; // ARMY#<armyId>#UNIT#<unitId>
  id: string;
  armyId: string;
  unitTypeId: string;
  name: string;
  size: number;
  wounds: number;
  veteranAbilities: string[];
  injuries: string[];
  enhancements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BattleModel {
  pk: string; // CAMPAIGN#<campaignId>
  sk: string; // BATTLE#<timestamp>
  id: string;
  campaignId: string;
  armies: string[]; // army IDs
  outcome: BattleOutcome;
  gloryAwarded: Array<{
    armyId: string;
    amount: number;
    reason?: string;
  }>;
  notes?: string;
  playedAt: string;
  createdAt: string;
}

export interface FactionModel {
  id: string;
  name: string;
  grandAlliance: string;
  startingGlory: number;
  startingRenown: number;
  description?: string;
}
