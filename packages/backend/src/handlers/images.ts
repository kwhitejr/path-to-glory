import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { generatePresignedUploadUrl } from '../services/s3.js';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '524288', 10); // 512KB default
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadUrlRequest {
  filename: string;
  contentType: string;
  entityType: 'army' | 'unit';
  entityId: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  imageKey: string;
  expiresIn: number;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const body: UploadUrlRequest = JSON.parse(event.body);

    // Validate request
    if (!body.filename || !body.contentType || !body.entityType || !body.entityId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields: filename, contentType, entityType, entityId',
        }),
      };
    }

    // Validate content type
    if (!ALLOWED_CONTENT_TYPES.includes(body.contentType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Invalid content type. Allowed: ${ALLOWED_CONTENT_TYPES.join(', ')}`,
        }),
      };
    }

    // Validate entity type
    if (!['army', 'unit'].includes(body.entityType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid entity type. Must be "army" or "unit"',
        }),
      };
    }

    // Generate presigned URL
    const result = await generatePresignedUploadUrl({
      filename: body.filename,
      contentType: body.contentType,
      entityType: body.entityType,
      entityId: body.entityId,
      maxFileSize: MAX_FILE_SIZE,
    });

    const response: UploadUrlResponse = {
      uploadUrl: result.uploadUrl,
      imageKey: result.imageKey,
      expiresIn: result.expiresIn,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
