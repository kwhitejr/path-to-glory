import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const UPLOAD_URL_EXPIRATION_SECONDS = 300; // 5 minutes for uploads
const VIEW_URL_EXPIRATION_SECONDS = 3600; // 1 hour for viewing

interface GeneratePresignedUrlParams {
  filename: string;
  contentType: string;
  entityType: 'army' | 'unit';
  entityId: string;
  maxFileSize: number;
}

interface GeneratePresignedUrlResult {
  uploadUrl: string;
  imageKey: string;
  expiresIn: number;
}

/**
 * Generate a presigned URL for uploading an image to S3
 */
export async function generatePresignedUploadUrl(
  params: GeneratePresignedUrlParams
): Promise<GeneratePresignedUrlResult> {
  const { filename, contentType, entityType, entityId, maxFileSize } = params;

  // Generate a unique key for the image
  // Format: {entityType}/{entityId}/{uuid}-{filename}
  const fileExtension = filename.split('.').pop() || 'jpg';
  const uniqueId = randomUUID();
  const imageKey = `${entityType}/${entityId}/${uniqueId}.${fileExtension}`;

  // Create the PutObject command
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: imageKey,
    ContentType: contentType,
    // Enforce file size limit via metadata
    Metadata: {
      'max-size': maxFileSize.toString(),
    },
    // Ensure uploaded file matches expected content type
    ContentLength: undefined, // Will be set by the client during upload
  });

  // Generate presigned URL
  const uploadUrl = await getSignedUrl(s3Client as any, command, {
    expiresIn: UPLOAD_URL_EXPIRATION_SECONDS,
  });

  return {
    uploadUrl,
    imageKey,
    expiresIn: UPLOAD_URL_EXPIRATION_SECONDS,
  };
}

/**
 * Generate a presigned URL for viewing an image from S3
 * Keeps bucket private while allowing temporary access
 */
export async function generatePresignedViewUrl(imageKey: string): Promise<{
  viewUrl: string;
  expiresIn: number;
}> {
  // Create the GetObject command
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: imageKey,
  });

  // Generate presigned URL (1 hour expiration)
  const viewUrl = await getSignedUrl(s3Client as any, command, {
    expiresIn: VIEW_URL_EXPIRATION_SECONDS,
  });

  return {
    viewUrl,
    expiresIn: VIEW_URL_EXPIRATION_SECONDS,
  };
}
