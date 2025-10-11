import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db/client.js';
import { keys } from '../db/keys.js';
import { UserItem } from '../db/models.js';

export interface CreateUserParams {
  cognitoId: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export class UserRepository {
  async create(params: CreateUserParams): Promise<UserItem> {
    const now = new Date().toISOString();

    const user: UserItem = {
      ...keys.user(params.cognitoId),
      type: 'USER',
      cognitoId: params.cognitoId,
      email: params.email,
      name: params.name,
      ...(params.picture && { picture: params.picture }),
      googleId: params.googleId,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    return user;
  }

  async findByCognitoId(cognitoId: string): Promise<UserItem | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.user(cognitoId),
      })
    );

    return (result.Item as UserItem) || null;
  }

  async upsert(params: CreateUserParams): Promise<UserItem> {
    const existing = await this.findByCognitoId(params.cognitoId);
    if (existing) {
      // Update user if any fields have changed
      const needsUpdate =
        existing.email !== params.email ||
        existing.name !== params.name ||
        existing.picture !== params.picture ||
        existing.googleId !== params.googleId;

      if (needsUpdate) {
        const now = new Date().toISOString();
        const updated: UserItem = {
          ...existing,
          email: params.email,
          name: params.name,
          picture: params.picture,
          googleId: params.googleId,
          updatedAt: now,
        };

        await docClient.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: updated,
          })
        );

        return updated;
      }

      return existing;
    }
    return this.create(params);
  }
}
