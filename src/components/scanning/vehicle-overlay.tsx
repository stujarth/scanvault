'use client';

import { VehicleType } from '@/types/vehicle';

interface VehicleOverlayProps {
  vehicleType: VehicleType;
  zone: string;
  vehicleBbox?: [number, number, number, number];
  containerWidth: number;
  containerHeight: number;
}

// SVG path templates for different vehicle types and scan angles
// Simplified outlines that guide users on framing
const vehicleTemplates: Record<string, Record<string, string>> = {
  saloon: {
    front: 'M 20,75 L 20,45 Q 20,30 35,25 L 65,25 Q 80,30 80,45 L 80,75 Q 80,80 75,80 L 25,80 Q 20,80 20,75 Z M 30,45 L 30,35 Q 30,28 40,28 L 60,28 Q 70,28 70,35 L 70,45 Z M 25,65 L 35,65 L 35,72 L 25,72 Z M 65,65 L 75,65 L 75,72 L 65,72 Z',
    rear: 'M 20,75 L 20,45 Q 20,35 30,30 L 70,30 Q 80,35 80,45 L 80,75 Q 80,80 75,80 L 25,80 Q 20,80 20,75 Z M 35,35 L 35,40 Q 35,45 40,45 L 60,45 Q 65,45 65,40 L 65,35 Z M 25,65 L 35,65 L 35,72 L 25,72 Z M 65,65 L 75,65 L 75,72 L 65,72 Z',
    left: 'M 10,65 L 15,60 L 20,45 Q 25,30 35,28 L 55,25 Q 65,25 68,30 L 75,45 L 90,50 L 90,65 L 85,70 L 80,70 Q 78,65 73,65 Q 68,65 68,70 L 35,70 Q 33,65 28,65 Q 23,65 22,70 L 15,70 Z',
    right: 'M 90,65 L 85,60 L 80,45 Q 75,30 65,28 L 45,25 Q 35,25 32,30 L 25,45 L 10,50 L 10,65 L 15,70 L 20,70 Q 22,65 27,65 Q 32,65 32,70 L 65,70 Q 67,65 72,65 Q 77,65 78,70 L 85,70 Z',
    roof: 'M 25,15 Q 25,10 35,10 L 65,10 Q 75,10 75,15 L 78,85 Q 78,90 68,90 L 32,90 Q 22,90 22,85 Z M 30,25 L 70,25 M 30,50 L 70,50 M 30,75 L 70,75',
    wheels: 'M 15,50 A 15,15 0 1,1 45,50 A 15,15 0 1,1 15,50 Z M 25,50 A 5,5 0 1,1 35,50 A 5,5 0 1,1 25,50 Z M 55,50 A 15,15 0 1,1 85,50 A 15,15 0 1,1 55,50 Z M 65,50 A 5,5 0 1,1 75,50 A 5,5 0 1,1 65,50 Z',
  },
  suv: {
    front: 'M 18,78 L 18,42 Q 18,28 33,22 L 67,22 Q 82,28 82,42 L 82,78 Q 82,82 78,82 L 22,82 Q 18,82 18,78 Z M 28,42 L 28,32 Q 28,26 38,26 L 62,26 Q 72,26 72,32 L 72,42 Z M 22,68 L 34,68 L 34,76 L 22,76 Z M 66,68 L 78,68 L 78,76 L 66,76 Z',
    rear: 'M 18,78 L 18,42 Q 18,32 28,27 L 72,27 Q 82,32 82,42 L 82,78 Q 82,82 78,82 L 22,82 Q 18,82 18,78 Z M 33,32 L 33,38 Q 33,43 38,43 L 62,43 Q 67,43 67,38 L 67,32 Z M 22,68 L 34,68 L 34,76 L 22,76 Z M 66,68 L 78,68 L 78,76 L 66,76 Z',
    left: 'M 8,62 L 12,55 L 18,40 Q 22,25 35,22 L 58,20 Q 68,20 72,25 L 78,40 L 92,45 L 92,62 L 88,68 L 82,68 Q 80,62 75,62 Q 70,62 68,68 L 35,68 Q 33,62 28,62 Q 23,62 22,68 L 12,68 Z',
    right: 'M 92,62 L 88,55 L 82,40 Q 78,25 65,22 L 42,20 Q 32,20 28,25 L 22,40 L 8,45 L 8,62 L 12,68 L 18,68 Q 20,62 25,62 Q 30,62 32,68 L 65,68 Q 67,62 72,62 Q 77,62 80,68 L 88,68 Z',
    roof: 'M 22,12 Q 22,8 34,8 L 66,8 Q 78,8 78,12 L 80,88 Q 80,92 68,92 L 32,92 Q 20,92 20,88 Z M 28,22 L 72,22 M 28,50 L 72,50 M 28,78 L 72,78',
    wheels: 'M 12,50 A 18,18 0 1,1 48,50 A 18,18 0 1,1 12,50 Z M 24,50 A 6,6 0 1,1 36,50 A 6,6 0 1,1 24,50 Z M 52,50 A 18,18 0 1,1 88,50 A 18,18 0 1,1 52,50 Z M 64,50 A 6,6 0 1,1 76,50 A 6,6 0 1,1 64,50 Z',
  },
  hatchback: {
    front: 'M 22,75 L 22,45 Q 22,32 36,27 L 64,27 Q 78,32 78,45 L 78,75 Q 78,79 74,79 L 26,79 Q 22,79 22,75 Z M 32,45 L 32,36 Q 32,30 40,30 L 60,30 Q 68,30 68,36 L 68,45 Z M 27,64 L 36,64 L 36,72 L 27,72 Z M 64,64 L 73,64 L 73,72 L 64,72 Z',
    rear: 'M 22,75 L 22,38 Q 22,30 32,28 L 68,28 Q 78,30 78,38 L 78,75 Q 78,79 74,79 L 26,79 Q 22,79 22,75 Z M 30,30 L 30,42 Q 30,46 35,46 L 65,46 Q 70,46 70,42 L 70,30 Z M 27,64 L 36,64 L 36,72 L 27,72 Z M 64,64 L 73,64 L 73,72 L 64,72 Z',
    left: 'M 10,65 L 15,58 L 22,42 Q 28,28 40,26 L 55,24 Q 62,24 65,32 L 70,42 L 88,48 L 88,65 L 84,70 L 78,70 Q 76,64 72,64 Q 67,64 66,70 L 34,70 Q 32,64 28,64 Q 23,64 22,70 L 14,70 Z',
    right: 'M 90,65 L 85,58 L 78,42 Q 72,28 60,26 L 45,24 Q 38,24 35,32 L 30,42 L 12,48 L 12,65 L 16,70 L 22,70 Q 24,64 28,64 Q 33,64 34,70 L 66,70 Q 68,64 72,64 Q 77,64 78,70 L 86,70 Z',
    roof: 'M 28,18 Q 28,12 38,12 L 62,12 Q 72,12 72,18 L 74,82 Q 74,88 64,88 L 36,88 Q 26,88 26,82 Z',
    wheels: 'M 15,50 A 15,15 0 1,1 45,50 A 15,15 0 1,1 15,50 Z M 25,50 A 5,5 0 1,1 35,50 A 5,5 0 1,1 25,50 Z M 55,50 A 15,15 0 1,1 85,50 A 15,15 0 1,1 55,50 Z M 65,50 A 5,5 0 1,1 75,50 A 5,5 0 1,1 65,50 Z',
  },
  van: {
    front: 'M 15,78 L 15,35 Q 15,22 30,18 L 70,18 Q 85,22 85,35 L 85,78 Q 85,82 80,82 L 20,82 Q 15,82 15,78 Z M 25,35 L 25,25 Q 25,20 35,20 L 65,20 Q 75,20 75,25 L 75,35 Z M 20,68 L 32,68 L 32,76 L 20,76 Z M 68,68 L 80,68 L 80,76 L 68,76 Z',
    rear: 'M 15,78 L 15,30 Q 15,22 25,20 L 75,20 Q 85,22 85,30 L 85,78 Q 85,82 80,82 L 20,82 Q 15,82 15,78 Z M 25,25 L 49,25 L 49,55 L 25,55 Z M 51,25 L 75,25 L 75,55 L 51,55 Z M 20,68 L 32,68 L 32,76 L 20,76 Z M 68,68 L 80,68 L 80,76 L 68,76 Z',
    left: 'M 5,62 L 8,50 L 12,35 Q 15,20 28,18 L 75,18 Q 88,18 90,25 L 95,35 L 95,62 L 90,68 L 85,68 Q 83,62 78,62 Q 73,62 72,68 L 30,68 Q 28,62 23,62 Q 18,62 17,68 L 8,68 Z',
    right: 'M 95,62 L 92,50 L 88,35 Q 85,20 72,18 L 25,18 Q 12,18 10,25 L 5,35 L 5,62 L 10,68 L 15,68 Q 17,62 22,62 Q 27,62 28,68 L 70,68 Q 72,62 77,62 Q 82,62 83,68 L 92,68 Z',
    roof: 'M 20,8 Q 20,5 32,5 L 68,5 Q 80,5 80,8 L 82,92 Q 82,95 70,95 L 30,95 Q 18,95 18,92 Z',
    wheels: 'M 12,50 A 16,16 0 1,1 44,50 A 16,16 0 1,1 12,50 Z M 22,50 A 6,6 0 1,1 34,50 A 6,6 0 1,1 22,50 Z M 56,50 A 16,16 0 1,1 88,50 A 16,16 0 1,1 56,50 Z M 66,50 A 6,6 0 1,1 78,50 A 6,6 0 1,1 66,50 Z',
  },
  estate: {
    front: 'M 20,75 L 20,45 Q 20,30 35,25 L 65,25 Q 80,30 80,45 L 80,75 Q 80,80 75,80 L 25,80 Q 20,80 20,75 Z M 30,45 L 30,35 Q 30,28 40,28 L 60,28 Q 70,28 70,35 L 70,45 Z M 25,65 L 35,65 L 35,72 L 25,72 Z M 65,65 L 75,65 L 75,72 L 65,72 Z',
    rear: 'M 20,75 L 20,35 Q 20,28 30,25 L 70,25 Q 80,28 80,35 L 80,75 Q 80,80 75,80 L 25,80 Q 20,80 20,75 Z M 30,28 L 30,42 Q 30,46 35,46 L 65,46 Q 70,46 70,42 L 70,28 Z M 25,65 L 35,65 L 35,72 L 25,72 Z M 65,65 L 75,65 L 75,72 L 65,72 Z',
    left: 'M 10,65 L 14,58 L 20,42 Q 25,28 38,26 L 60,24 Q 68,24 70,26 L 75,28 L 90,28 L 92,48 L 92,65 L 88,70 L 82,70 Q 80,64 76,64 Q 71,64 70,70 L 34,70 Q 32,64 28,64 Q 23,64 22,70 L 14,70 Z',
    right: 'M 90,65 L 86,58 L 80,42 Q 75,28 62,26 L 40,24 Q 32,24 30,26 L 25,28 L 10,28 L 8,48 L 8,65 L 12,70 L 18,70 Q 20,64 24,64 Q 29,64 30,70 L 66,70 Q 68,64 72,64 Q 77,64 78,70 L 86,70 Z',
    roof: 'M 25,10 Q 25,6 35,6 L 65,6 Q 75,6 75,10 L 78,90 Q 78,94 68,94 L 32,94 Q 22,94 22,90 Z',
    wheels: 'M 15,50 A 15,15 0 1,1 45,50 A 15,15 0 1,1 15,50 Z M 25,50 A 5,5 0 1,1 35,50 A 5,5 0 1,1 25,50 Z M 55,50 A 15,15 0 1,1 85,50 A 15,15 0 1,1 55,50 Z M 65,50 A 5,5 0 1,1 75,50 A 5,5 0 1,1 65,50 Z',
  },
};

// Map vehicle types that share a template shape
function getTemplateKey(type: VehicleType): string {
  const mapping: Record<VehicleType, string> = {
    saloon: 'saloon',
    coupe: 'saloon',
    convertible: 'saloon',
    hatchback: 'hatchback',
    suv: 'suv',
    pickup: 'suv',
    estate: 'estate',
    van: 'van',
  };
  return mapping[type] || 'saloon';
}

export function VehicleOverlay({
  vehicleType,
  zone,
  vehicleBbox,
  containerWidth,
  containerHeight,
}: VehicleOverlayProps) {
  const templateKey = getTemplateKey(vehicleType);
  const templates = vehicleTemplates[templateKey] || vehicleTemplates.saloon;
  const path = templates[zone];

  if (!path) return null;

  // If we have a real detection bbox, position the overlay to match
  const transform = vehicleBbox
    ? `translate(${vehicleBbox[0]}, ${vehicleBbox[1]}) scale(${vehicleBbox[2] / 100}, ${vehicleBbox[3] / 100})`
    : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ width: containerWidth, height: containerHeight }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Guide outline */}
      <path
        d={path}
        fill="none"
        stroke="rgba(13, 148, 136, 0.6)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        transform={transform}
      />
      {/* Filled guide area with low opacity */}
      <path
        d={path}
        fill="rgba(13, 148, 136, 0.05)"
        stroke="none"
        transform={transform}
      />
    </svg>
  );
}

export function DetectionBoundingBox({
  bbox,
  label,
  confidence,
  videoWidth,
  videoHeight,
  containerWidth,
  containerHeight,
}: {
  bbox: [number, number, number, number];
  label: string;
  confidence: number;
  videoWidth: number;
  videoHeight: number;
  containerWidth: number;
  containerHeight: number;
}) {
  // Scale bbox from video coordinates to container coordinates
  const scaleX = containerWidth / videoWidth;
  const scaleY = containerHeight / videoHeight;
  const [x, y, w, h] = bbox;

  return (
    <div
      className="absolute border-2 border-teal-400 rounded pointer-events-none"
      style={{
        left: x * scaleX,
        top: y * scaleY,
        width: w * scaleX,
        height: h * scaleY,
      }}
    >
      <span className="absolute -top-6 left-0 bg-teal-600 text-white text-xs px-2 py-0.5 rounded">
        {label} {Math.round(confidence * 100)}%
      </span>
    </div>
  );
}
