import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../db/client.js';
import { keys } from '../db/keys.js';
import { UnitItem } from '../db/models.js';

export interface CreateUnitParams {
  campaignId: string;
  armyId: string;
  unitTypeId: string;
  name: string;
  size: number;
  wounds: number;
}

export interface UpdateUnitParams {
  name?: string;
  size?: number;
  wounds?: number;
  veteranAbilities?: string[];
  injuries?: string[];
  enhancements?: string[];
}

export class UnitRepository {
  async create(params: CreateUnitParams): Promise<UnitItem> {
    const unitId = uuidv4();
    const now = new Date().toISOString();

    const unit: UnitItem = {
      ...keys.unit(params.campaignId, params.armyId, unitId),
      type: 'UNIT',
      id: unitId,
      campaignId: params.campaignId,
      armyId: params.armyId,
      unitTypeId: params.unitTypeId,
      name: params.name,
      size: params.size,
      wounds: params.wounds,
      veteranAbilities: [],
      injuries: [],
      enhancements: [],
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: unit,
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    return unit;
  }

  async findByArmyId(campaignId: string, armyId: string): Promise<UnitItem[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `CAMPAIGN#${campaignId}`,
          ':sk': `ARMY#${armyId}#UNIT#`,
        },
      })
    );

    return (result.Items as UnitItem[]) || [];
  }

  async update(
    campaignId: string,
    armyId: string,
    unitId: string,
    params: UpdateUnitParams
  ): Promise<UnitItem> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build dynamic update expression
    if (params.name !== undefined) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = params.name;
    }

    if (params.size !== undefined) {
      updateExpressions.push('#size = :size');
      expressionAttributeNames['#size'] = 'size';
      expressionAttributeValues[':size'] = params.size;
    }

    if (params.wounds !== undefined) {
      updateExpressions.push('wounds = :wounds');
      expressionAttributeValues[':wounds'] = params.wounds;
    }

    if (params.veteranAbilities !== undefined) {
      updateExpressions.push('veteranAbilities = :veteranAbilities');
      expressionAttributeValues[':veteranAbilities'] = params.veteranAbilities;
    }

    if (params.injuries !== undefined) {
      updateExpressions.push('injuries = :injuries');
      expressionAttributeValues[':injuries'] = params.injuries;
    }

    if (params.enhancements !== undefined) {
      updateExpressions.push('enhancements = :enhancements');
      expressionAttributeValues[':enhancements'] = params.enhancements;
    }

    // Always update updatedAt
    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.unit(campaignId, armyId, unitId),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length
          ? expressionAttributeNames
          : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as UnitItem;
  }

  async delete(campaignId: string, armyId: string, unitId: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: keys.unit(campaignId, armyId, unitId),
      })
    );
  }

  async addVeteranAbility(
    campaignId: string,
    armyId: string,
    unitId: string,
    ability: string
  ): Promise<UnitItem> {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.unit(campaignId, armyId, unitId),
        UpdateExpression: 'SET veteranAbilities = list_append(if_not_exists(veteranAbilities, :empty_list), :ability), updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':ability': [ability],
          ':empty_list': [],
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as UnitItem;
  }
}
