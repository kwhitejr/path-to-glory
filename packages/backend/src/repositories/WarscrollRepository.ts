import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../db/client.js';
import { keys, gsiKeys } from '../db/keys.js';
import { CustomWarscrollItem } from '../db/models.js';

export interface CreateWarscrollParams {
  creatorId: string;
  name: string;
  subtitle?: string;
  factionId: string;
  characteristics: {
    move?: string;
    health: number;
    save?: string;
    control?: number;
    banishment?: string;
  };
  rangedWeapons?: Array<{
    name: string;
    range?: string;
    attacks: string;
    hit: string;
    wound: string;
    rend: string;
    damage: string;
    ability?: string;
  }>;
  meleeWeapons?: Array<{
    name: string;
    attacks: string;
    hit: string;
    wound: string;
    rend: string;
    damage: string;
    ability?: string;
  }>;
  abilities: Array<{
    name: string;
    timing: string;
    description?: string;
    declare?: string;
    effect: string;
    keywords?: string[];
  }>;
  keywords: {
    unit: string[];
    faction: string[];
  };
  battleProfile?: {
    unitSize: string;
    points: number;
    baseSize?: string;
    isManifestation?: boolean;
    isFactionTerrain?: boolean;
  };
}

export interface UpdateWarscrollParams {
  name?: string;
  subtitle?: string;
  factionId?: string;
  characteristics?: {
    move?: string;
    health: number;
    save?: string;
    control?: number;
    banishment?: string;
  };
  rangedWeapons?: Array<{
    name: string;
    range?: string;
    attacks: string;
    hit: string;
    wound: string;
    rend: string;
    damage: string;
    ability?: string;
  }>;
  meleeWeapons?: Array<{
    name: string;
    attacks: string;
    hit: string;
    wound: string;
    rend: string;
    damage: string;
    ability?: string;
  }>;
  abilities?: Array<{
    name: string;
    timing: string;
    description?: string;
    declare?: string;
    effect: string;
    keywords?: string[];
  }>;
  keywords?: {
    unit: string[];
    faction: string[];
  };
  battleProfile?: {
    unitSize: string;
    points: number;
    baseSize?: string;
    isManifestation?: boolean;
    isFactionTerrain?: boolean;
  };
}

export class WarscrollRepository {
  async create(params: CreateWarscrollParams): Promise<CustomWarscrollItem> {
    const warscrollId = uuidv4();
    const now = new Date().toISOString();

    const warscroll: CustomWarscrollItem = {
      ...keys.warscroll(warscrollId),
      ...gsiKeys.warscrollCreator(params.creatorId, warscrollId),
      type: 'WARSCROLL',
      id: warscrollId,
      name: params.name,
      subtitle: params.subtitle,
      factionId: params.factionId,
      creatorId: params.creatorId,
      characteristics: params.characteristics,
      rangedWeapons: params.rangedWeapons,
      meleeWeapons: params.meleeWeapons,
      abilities: params.abilities,
      keywords: params.keywords,
      battleProfile: params.battleProfile,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: warscroll,
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    return warscroll;
  }

  async findById(warscrollId: string): Promise<CustomWarscrollItem | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.warscroll(warscrollId),
      })
    );

    return (result.Item as CustomWarscrollItem) || null;
  }

  async findByCreatorId(creatorId: string): Promise<CustomWarscrollItem[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${creatorId}`,
          ':sk': 'WARSCROLL#',
        },
      })
    );

    return (result.Items as CustomWarscrollItem[]) || [];
  }

  async findAll(): Promise<CustomWarscrollItem[]> {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: '#type = :type',
        ExpressionAttributeNames: {
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ':type': 'WARSCROLL',
        },
      })
    );

    return (result.Items as CustomWarscrollItem[]) || [];
  }

  async update(
    warscrollId: string,
    params: UpdateWarscrollParams
  ): Promise<CustomWarscrollItem> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build dynamic update expression
    if (params.name !== undefined) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = params.name;
    }

    if (params.subtitle !== undefined) {
      updateExpressions.push('subtitle = :subtitle');
      expressionAttributeValues[':subtitle'] = params.subtitle;
    }

    if (params.factionId !== undefined) {
      updateExpressions.push('factionId = :factionId');
      expressionAttributeValues[':factionId'] = params.factionId;
    }

    if (params.characteristics !== undefined) {
      updateExpressions.push('characteristics = :characteristics');
      expressionAttributeValues[':characteristics'] = params.characteristics;
    }

    if (params.rangedWeapons !== undefined) {
      updateExpressions.push('rangedWeapons = :rangedWeapons');
      expressionAttributeValues[':rangedWeapons'] = params.rangedWeapons;
    }

    if (params.meleeWeapons !== undefined) {
      updateExpressions.push('meleeWeapons = :meleeWeapons');
      expressionAttributeValues[':meleeWeapons'] = params.meleeWeapons;
    }

    if (params.abilities !== undefined) {
      updateExpressions.push('abilities = :abilities');
      expressionAttributeValues[':abilities'] = params.abilities;
    }

    if (params.keywords !== undefined) {
      updateExpressions.push('keywords = :keywords');
      expressionAttributeValues[':keywords'] = params.keywords;
    }

    if (params.battleProfile !== undefined) {
      updateExpressions.push('battleProfile = :battleProfile');
      expressionAttributeValues[':battleProfile'] = params.battleProfile;
    }

    // Always update updatedAt
    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.warscroll(warscrollId),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length
          ? expressionAttributeNames
          : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as CustomWarscrollItem;
  }

  async delete(warscrollId: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: keys.warscroll(warscrollId),
      })
    );
  }
}
