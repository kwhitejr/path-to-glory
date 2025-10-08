import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../db/client.js';
import { keys, gsiKeys } from '../db/keys.js';
import { CampaignItem } from '../db/models.js';

export interface CreateCampaignParams {
  name: string;
  ownerId: string;
}

export class CampaignRepository {
  async create(params: CreateCampaignParams): Promise<CampaignItem> {
    const campaignId = uuidv4();
    const now = new Date().toISOString();

    const campaign: CampaignItem = {
      ...keys.campaign(campaignId),
      ...gsiKeys.campaignOwner(params.ownerId, campaignId),
      type: 'CAMPAIGN',
      id: campaignId,
      name: params.name,
      ownerId: params.ownerId,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: campaign,
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    return campaign;
  }

  async findById(campaignId: string): Promise<CampaignItem | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.campaign(campaignId),
      })
    );

    return (result.Item as CampaignItem) || null;
  }

  async findByOwnerId(ownerId: string): Promise<CampaignItem[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${ownerId}`,
          ':sk': 'CAMPAIGN#',
        },
      })
    );

    return (result.Items as CampaignItem[]) || [];
  }
}
