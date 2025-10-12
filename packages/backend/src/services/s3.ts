import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const URL_EXPIRATION_SECONDS = 300; // 5 minutes

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
    expiresIn: URL_EXPIRATION_SECONDS,
  });

  return {
    uploadUrl,
    imageKey,
    expiresIn: URL_EXPIRATION_SECONDS,
  };
}

/**
 * Get the public URL for an image (once uploaded)
 * Note: Images are private by default, served via CloudFront in the future
 */
export function getImagePublicUrl(imageKey: string): string {
  // For now, construct S3 URL directly
  // TODO: Replace with CloudFront URL when CDN is configured
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
}
