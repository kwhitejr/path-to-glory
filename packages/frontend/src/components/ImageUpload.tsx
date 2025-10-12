import React, { useState, useRef, useEffect } from 'react';
import { PresignedImage } from './PresignedImage';
import { ImageCropModal } from './ImageCropModal';

interface ImageUploadProps {
  entityType: 'army' | 'unit';
  entityId: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
  variant?: 'thumbnail' | 'banner';
}

const MAX_FILE_SIZE = 512 * 1024; // 512KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ptg.kwhitejr.com';

// Image dimension recommendations and validation
const IMAGE_SPECS = {
  thumbnail: {
    army: {
      recommended: { width: 200, height: 200 },
      display: { width: 80, height: 80 },
      aspectRatio: 1, // Square
      description: 'Army icon (square)',
    },
    unit: {
      recommended: { width: 150, height: 150 },
      display: { width: 60, height: 60 },
      aspectRatio: 1, // Square
      description: 'Unit icon (square)',
    },
  },
  banner: {
    army: {
      recommended: { width: 1200, height: 400 },
      display: { width: '100%', height: 300 },
      aspectRatio: 3, // 3:1 ratio
      description: 'Army banner (3:1 landscape)',
    },
  },
} as const;

export function ImageUpload({
  entityType,
  entityId,
  currentImageUrl,
  onImageUploaded,
  label = 'Upload Image',
  variant = 'thumbnail',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Update preview when currentImageUrl changes (e.g., when data loads from API)
  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  // Get spec with proper type narrowing
  const getSpec = () => {
    if (variant === 'banner') {
      // Banner only supports army
      return IMAGE_SPECS.banner.army;
    }
    // Thumbnail supports both army and unit
    return IMAGE_SPECS.thumbnail[entityType];
  };
  const spec = getSpec();

  const validateImageDimensions = (img: HTMLImageElement): { needsCrop: boolean } => {
    const { width, height } = img;
    const actualRatio = width / height;
    const expectedRatio = spec.aspectRatio;

    // Allow 10% tolerance for aspect ratio
    const tolerance = 0.1;
    const minRatio = expectedRatio * (1 - tolerance);
    const maxRatio = expectedRatio * (1 + tolerance);

    if (actualRatio < minRatio || actualRatio > maxRatio) {
      // Image needs cropping
      return { needsCrop: true };
    }

    return { needsCrop: false };
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB.`);
      return;
    }

    // Validate image dimensions
    const img = new Image();
    const imageDataUrl = URL.createObjectURL(file);

    const dimensionsCheck = await new Promise<{ needsCrop: boolean }>((resolve) => {
      img.onload = () => {
        const result = validateImageDimensions(img);
        resolve(result);
      };
      img.onerror = () => {
        setError('Failed to load image. Please try a different file.');
        resolve({ needsCrop: false });
      };
      img.src = imageDataUrl;
    });

    // If image needs cropping, show crop modal
    if (dimensionsCheck.needsCrop) {
      setOriginalFile(file);
      setImageToCrop(imageDataUrl);
      setShowCropModal(true);
      return;
    }

    URL.revokeObjectURL(imageDataUrl);

    // Image is good to go - proceed with upload
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    try {
      setUploading(true);

      // Step 1: Get presigned URL from our image service
      const response = await fetch(`${API_BASE_URL}/images/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          entityType,
          entityId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, imageKey } = await response.json();

      // Step 2: Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      // Step 3: Return the imageKey (not full URL)
      // Frontend will fetch presigned view URLs when displaying images
      // This keeps the S3 bucket private and secure
      onImageUploaded(imageKey);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    // Clean up
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setShowCropModal(false);
    setImageToCrop(null);
    setOriginalFile(null);

    // Upload the cropped file
    await uploadFile(croppedFile);
  };

  const handleCropCancel = () => {
    // Clean up
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setShowCropModal(false);
    setImageToCrop(null);
    setOriginalFile(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewClass =
    variant === 'banner'
      ? 'w-full max-w-2xl h-40 object-cover rounded border border-gray-300'
      : 'w-32 h-32 object-cover rounded border border-gray-300';

  const placeholderClass =
    variant === 'banner'
      ? 'w-full max-w-2xl h-40 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      : 'w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {preview ? (
        <div className="relative inline-block">
          {/* Check if preview is a data URL (starts with "data:") or an S3 imageKey */}
          {preview.startsWith('data:') ? (
            <img src={preview} alt="Preview" className={previewClass} />
          ) : (
            <PresignedImage
              imageKey={preview}
              alt="Preview"
              className={previewClass}
              fallback={<div className="w-32 h-32 bg-gray-200 animate-pulse rounded" />}
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className={placeholderClass}
        >
          {uploading ? (
            <span className="text-sm text-gray-500">Uploading...</span>
          ) : (
            <div className="text-center">
              <span className="text-2xl text-gray-400 block mb-1">+</span>
              {variant === 'banner' && (
                <span className="text-xs text-gray-400">{spec.description}</span>
              )}
            </div>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Recommended:</strong> {spec.recommended.width}×{spec.recommended.height}px{' '}
          {spec.description}
        </p>
        <p>
          <strong>Limits:</strong> Max {MAX_FILE_SIZE / 1024}KB • JPEG, PNG, or WebP
        </p>
      </div>

      {/* Crop Modal */}
      {showCropModal && imageToCrop && originalFile && (
        <ImageCropModal
          imageSrc={imageToCrop}
          aspectRatio={spec.aspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          fileName={originalFile.name}
          mimeType={originalFile.type}
        />
      )}
    </div>
  );
}
