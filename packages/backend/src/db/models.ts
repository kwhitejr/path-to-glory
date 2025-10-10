/**
 * DynamoDB item types matching the single-table design
 */

import { BattleOutcome } from '@path-to-glory/shared';

export interface BaseItem {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserItem extends BaseItem {
  type: 'USER';
  cognitoId: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export interface CampaignItem extends BaseItem {
  type: 'CAMPAIGN';
  id: string;
  name: string;
  ownerId: string;
}

export interface ArmyItem extends BaseItem {
  type: 'ARMY';
  id: string;
  campaignId: string;
  playerId: string;
  factionId: string;
  name: string;
  glory: number;
  renown: number;
}

export interface UnitItem extends BaseItem {
  type: 'UNIT';
  id: string;
  campaignId: string;
  armyId: string;
  unitTypeId: string;
  name: string;
  size: number;
  wounds: number;
  rank: string;
  renown: number;
  reinforced: boolean;
  veteranAbilities: string[];
  injuries: string[];
  enhancements: string[];
}

export interface BattleItem extends BaseItem {
  type: 'BATTLE';
  id: string;
  campaignId: string;
  armies: string[];
  outcome: BattleOutcome;
  gloryAwarded: Array<{
    armyId: string;
    amount: number;
    reason?: string;
  }>;
  notes?: string;
  playedAt: string;
}
