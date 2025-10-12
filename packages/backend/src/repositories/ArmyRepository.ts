import { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../db/client.js';
import { keys, gsiKeys } from '../db/keys.js';
import { ArmyItem } from '../db/models.js';

export interface CreateArmyParams {
  campaignId: string;
  playerId: string;
  factionId: string;
  name: string;
  heraldry?: string;
  imageUrl?: string;
  realmOfOrigin?: string;
  battleFormation?: string;
  background?: string;
  glory?: number;
  renown?: number;
}

export interface UpdateArmyParams {
  name?: string;
  heraldry?: string;
  imageUrl?: string;
  realmOfOrigin?: string;
  battleFormation?: string;
  glory?: number;
  renown?: number;
  background?: string;
  notableEvents?: string;
  currentQuest?: string;
  questPoints?: number;
  completedQuests?: string[];
  spellLore?: string[];
  prayerLore?: string[];
  manifestationLore?: string[];
}

export class ArmyRepository {
  async create(params: CreateArmyParams): Promise<ArmyItem> {
    const armyId = uuidv4();
    const now = new Date().toISOString();

    const army: ArmyItem = {
      ...keys.army(params.campaignId, armyId),
      ...gsiKeys.armyOwner(params.playerId, armyId),
      type: 'ARMY',
      id: armyId,
      campaignId: params.campaignId,
      playerId: params.playerId,
      factionId: params.factionId,
      name: params.name,
      heraldry: params.heraldry,
      imageUrl: params.imageUrl,
      realmOfOrigin: params.realmOfOrigin,
      battleFormation: params.battleFormation,
      glory: params.glory ?? 0,
      renown: params.renown ?? 0,
      background: params.background,
      questPoints: 0,
      completedQuests: [],
      spellLore: [],
      prayerLore: [],
      manifestationLore: [],
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: army,
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    return army;
  }

  async findById(campaignId: string, armyId: string): Promise<ArmyItem | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.army(campaignId, armyId),
      })
    );

    return (result.Item as ArmyItem) || null;
  }

  async findByPlayerId(playerId: string): Promise<ArmyItem[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${playerId}`,
          ':sk': 'ARMY#',
        },
      })
    );

    return (result.Items as ArmyItem[]) || [];
  }

  async findByCampaignId(campaignId: string): Promise<ArmyItem[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `CAMPAIGN#${campaignId}`,
          ':sk': 'ARMY#',
        },
      })
    );

    return (result.Items as ArmyItem[]) || [];
  }

  async update(
    campaignId: string,
    armyId: string,
    params: UpdateArmyParams
  ): Promise<ArmyItem> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string | number> = {};

    // Build dynamic update expression
    if (params.name !== undefined) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = params.name;
    }

    if (params.heraldry !== undefined) {
      updateExpressions.push('heraldry = :heraldry');
      expressionAttributeValues[':heraldry'] = params.heraldry;
    }

    if (params.imageUrl !== undefined) {
      updateExpressions.push('imageUrl = :imageUrl');
      expressionAttributeValues[':imageUrl'] = params.imageUrl;
    }

    if (params.realmOfOrigin !== undefined) {
      updateExpressions.push('realmOfOrigin = :realmOfOrigin');
      expressionAttributeValues[':realmOfOrigin'] = params.realmOfOrigin;
    }

    if (params.battleFormation !== undefined) {
      updateExpressions.push('battleFormation = :battleFormation');
      expressionAttributeValues[':battleFormation'] = params.battleFormation;
    }

    if (params.glory !== undefined) {
      updateExpressions.push('glory = :glory');
      expressionAttributeValues[':glory'] = params.glory;
    }

    if (params.renown !== undefined) {
      updateExpressions.push('renown = :renown');
      expressionAttributeValues[':renown'] = params.renown;
    }

    if (params.background !== undefined) {
      updateExpressions.push('background = :background');
      expressionAttributeValues[':background'] = params.background;
    }

    if (params.notableEvents !== undefined) {
      updateExpressions.push('notableEvents = :notableEvents');
      expressionAttributeValues[':notableEvents'] = params.notableEvents;
    }

    if (params.currentQuest !== undefined) {
      updateExpressions.push('currentQuest = :currentQuest');
      expressionAttributeValues[':currentQuest'] = params.currentQuest;
    }

    if (params.questPoints !== undefined) {
      updateExpressions.push('questPoints = :questPoints');
      expressionAttributeValues[':questPoints'] = params.questPoints;
    }

    if (params.completedQuests !== undefined) {
      updateExpressions.push('completedQuests = :completedQuests');
      expressionAttributeValues[':completedQuests'] = params.completedQuests as any;
    }

    if (params.spellLore !== undefined) {
      updateExpressions.push('spellLore = :spellLore');
      expressionAttributeValues[':spellLore'] = params.spellLore as any;
    }

    if (params.prayerLore !== undefined) {
      updateExpressions.push('prayerLore = :prayerLore');
      expressionAttributeValues[':prayerLore'] = params.prayerLore as any;
    }

    if (params.manifestationLore !== undefined) {
      updateExpressions.push('manifestationLore = :manifestationLore');
      expressionAttributeValues[':manifestationLore'] = params.manifestationLore as any;
    }

    // Always update updatedAt
    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.army(campaignId, armyId),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length
          ? expressionAttributeNames
          : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as ArmyItem;
  }

  async delete(campaignId: string, armyId: string): Promise<void> {
    // Note: In a production system, you'd want to handle cascading deletes
    // or prevent deletion if the army has units
    // For now, we'll just delete the army (units should be deleted first by the caller)
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: keys.army(campaignId, armyId),
      })
    );
  }
}
