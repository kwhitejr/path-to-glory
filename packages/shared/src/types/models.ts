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
  heraldry?: string;
  realmOfOrigin?: string; // Enum: AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU, AZYR
  battleFormation?: string;
  glory: number;
  renown: number;
  background?: string;
  notableEvents?: string;
  currentQuest?: string;
  questPoints: number;
  completedQuests: string[];
  spellLore: string[];
  prayerLore: string[];
  manifestationLore: string[];
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
  warscroll: string;
  size: number;
  wounds: number;
  rank: string;
  renown: number;
  reinforced: boolean;
  isWarlord: boolean;
  veteranAbilities: string[];
  injuries: string[];
  enhancements: string[];
  pathAbilities: string[];
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
