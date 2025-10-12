import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { createCroppedImage, getCropAreaPixels } from '../utils/imageCrop';

interface ImageCropModalProps {
  imageSrc: string;
  aspectRatio: number;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  fileName: string;
  mimeType: string;
}

export function ImageCropModal({
  imageSrc,
  aspectRatio,
  onCropComplete,
  onCancel,
  fileName,
  mimeType,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropAreaChange = useCallback(
    (
      _croppedArea: { x: number; y: number; width: number; height: number },
      croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    try {
      setProcessing(true);
      const cropArea = getCropAreaPixels(croppedAreaPixels);
      const croppedFile = await createCroppedImage(imageSrc, cropArea, fileName, mimeType);
      onCropComplete(croppedFile);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
      setProcessing(false);
    }
  };

  const aspectRatioDescription =
    aspectRatio === 1 ? 'square (1:1)' : aspectRatio === 3 ? 'landscape (3:1)' : `${aspectRatio}:1`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <p className="text-sm text-gray-300">Adjust to {aspectRatioDescription} aspect ratio</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-300 hover:text-white text-2xl leading-none"
          disabled={processing}
        >
          ×
        </button>
      </div>

      {/* Cropper */}
      <div className="flex-1 relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropAreaChange}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-900 text-white p-4 space-y-4">
        {/* Zoom Slider */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300 w-12">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={processing}
          />
          <span className="text-sm text-gray-300 w-12 text-right">{zoom.toFixed(1)}x</span>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-400 text-center">
          <p>Drag to reposition • Pinch or scroll to zoom</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Apply Crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
