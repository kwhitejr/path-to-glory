import { usePresignedImageUrl } from '../hooks/usePresignedImageUrl';

interface PresignedImageProps {
  imageKey: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Image component that automatically fetches presigned URLs for private S3 images
 *
 * Usage:
 *   <PresignedImage imageKey={army.imageUrl} alt={army.name} className="w-20 h-20" />
 */
export function PresignedImage({ imageKey, alt, className = '', fallback }: PresignedImageProps) {
  const presignedUrl = usePresignedImageUrl(imageKey);

  // Show fallback if no image key or URL not yet loaded
  if (!imageKey || !presignedUrl) {
    return fallback ? <>{fallback}</> : null;
  }

  return <img src={presignedUrl} alt={alt} className={className} />;
}
