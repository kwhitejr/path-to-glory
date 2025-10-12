/**
 * Creates a cropped image from the given source image and crop area
 * Returns a File object that can be uploaded
 */

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function createCroppedImage(
  imageSrc: string,
  cropArea: CropArea,
  fileName: string,
  mimeType: string = 'image/jpeg'
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set canvas size to the crop dimensions
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      // Draw the cropped portion of the image
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          // Create a File from the blob
          const file = new File([blob], fileName, { type: mimeType });
          resolve(file);
        },
        mimeType,
        0.95 // Quality for JPEG
      );
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    image.src = imageSrc;
  });
}

/**
 * Get crop area in pixels from react-easy-crop's croppedAreaPixels
 */
export function getCropAreaPixels(
  croppedAreaPixels: { x: number; y: number; width: number; height: number }
): CropArea {
  return {
    x: Math.round(croppedAreaPixels.x),
    y: Math.round(croppedAreaPixels.y),
    width: Math.round(croppedAreaPixels.width),
    height: Math.round(croppedAreaPixels.height),
  };
}
