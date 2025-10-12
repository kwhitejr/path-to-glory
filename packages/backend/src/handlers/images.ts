import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { generatePresignedUploadUrl, generatePresignedViewUrl } from '../services/s3.js';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '524288', 10); // 512KB default
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadUrlRequest {
  filename: string;
  contentType: string;
  entityType: 'army' | 'unit';
  entityId: string;
}

interface ViewUrlRequest {
  imageKey: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  imageKey: string;
  expiresIn: number;
}

interface ViewUrlResponse {
  viewUrl: string;
  expiresIn: number;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const routeKey = event.routeKey || '';

    // Route: POST /images/view-url
    if (routeKey.includes('/images/view-url')) {
      return await handleViewUrl(event);
    }

    // Route: POST /images/upload-url
    if (routeKey.includes('/images/upload-url')) {
      return await handleUploadUrl(event);
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Route not found' }),
    };
  } catch (error) {
    console.error('Error in images handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

async function handleUploadUrl(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
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
}

async function handleViewUrl(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  // Parse request body
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Request body is required' }),
    };
  }

  const body: ViewUrlRequest = JSON.parse(event.body);

  // Validate request
  if (!body.imageKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing required field: imageKey',
      }),
    };
  }

  // Generate presigned view URL
  const result = await generatePresignedViewUrl(body.imageKey);

  const response: ViewUrlResponse = {
    viewUrl: result.viewUrl,
    expiresIn: result.expiresIn,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}
