'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { useVehicleDetection, DetectedVehicle } from '@/hooks/use-vehicle-detection';
import { VehicleOverlay, DetectionBoundingBox } from './vehicle-overlay';
import { VehicleType } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, AlertCircle, Check, RotateCcw } from 'lucide-react';

interface CameraScannerProps {
  vehicleType: VehicleType;
  zone: string;
  zoneLabel: string;
  zoneInstruction: string;
  onCapture: (imageData: string) => void;
  onSkip?: () => void;
}

export function CameraScanner({
  vehicleType,
  zone,
  zoneLabel,
  zoneInstruction,
  onCapture,
  onSkip,
}: CameraScannerProps) {
  const {
    videoRef,
    canvasRef,
    isReady: cameraReady,
    isLoading: cameraLoading,
    error: cameraError,
    start: startCamera,
    captureFrame,
  } = useCamera({ facingMode: 'environment', width: 1280, height: 720 });

  const {
    isModelLoaded,
    isLoading: modelLoading,
    error: modelError,
    vehicleDetected,
    vehicleConfidence,
    detections,
    loadModel,
    startContinuousDetection,
  } = useVehicleDetection();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const stopDetectionRef = useRef<(() => void) | null>(null);

  // Start camera and load model once on mount
  useEffect(() => {
    startCamera();
    loadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/restart continuous detection when camera and model are ready
  useEffect(() => {
    if (cameraReady && isModelLoaded && videoRef.current && !captured) {
      // Stop previous detection loop if any
      if (stopDetectionRef.current) {
        stopDetectionRef.current();
      }
      const stop = startContinuousDetection(videoRef.current, 800);
      stopDetectionRef.current = stop;
      return () => {
        stop();
        stopDetectionRef.current = null;
      };
    }
  }, [cameraReady, isModelLoaded, captured, startContinuousDetection, videoRef]);

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset captured state when zone changes
  useEffect(() => {
    setCaptured(false);
    setCapturedImage(null);
  }, [zone]);

  const handleCapture = useCallback(() => {
    const frame = captureFrame();
    if (frame) {
      setCaptured(true);
      setCapturedImage(frame);
    }
  }, [captureFrame]);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      // Don't reset captured/image here — the zone change effect handles it
    }
  }, [capturedImage, onCapture]);

  const handleRetake = useCallback(() => {
    setCaptured(false);
    setCapturedImage(null);
  }, []);

  const bestDetection = detections.reduce<DetectedVehicle | null>(
    (best, d) => (!best || d.score > best.score ? d : best),
    null
  );

  const isLoading = cameraLoading || modelLoading;
  const hasError = cameraError || modelError;

  return (
    <div className="space-y-4">
      {/* Camera viewport */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-xl bg-gray-900 overflow-hidden"
      >
        {/* Loading state */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
            <Loader2 className="h-10 w-10 text-teal-400 animate-spin mb-3" />
            <p className="text-white/70 text-sm">
              {cameraLoading ? 'Starting camera...' : 'Loading detection model...'}
            </p>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20 px-6">
            <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
            <p className="text-white/90 text-sm text-center font-medium mb-1">
              {cameraError ? 'Camera unavailable' : 'Detection model failed to load'}
            </p>
            <p className="text-white/50 text-xs text-center mb-4">{cameraError || modelError}</p>
            <div className="flex gap-2">
              {cameraError && (
                <Button size="sm" onClick={startCamera} className="bg-teal-600 hover:bg-teal-700">
                  Retry Camera
                </Button>
              )}
              {onSkip && (
                <Button size="sm" variant="outline" onClick={onSkip} className="text-white border-white/30">
                  Skip Zone
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Video feed — always mounted to keep stream alive */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${captured ? 'invisible' : ''}`}
          playsInline
          muted
          autoPlay
        />

        {/* Captured preview */}
        {captured && capturedImage && (
          <img
            src={capturedImage}
            alt="Captured frame"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Vehicle guide overlay */}
        {!captured && cameraReady && containerSize.width > 0 && (
          <VehicleOverlay
            vehicleType={vehicleType}
            zone={zone}
            vehicleBbox={bestDetection?.bbox}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
          />
        )}

        {/* Detection bounding boxes */}
        {!captured && cameraReady && videoRef.current && detections.map((d, i) => (
          <DetectionBoundingBox
            key={i}
            bbox={d.bbox}
            label={d.class}
            confidence={d.score}
            videoWidth={videoRef.current!.videoWidth || 1280}
            videoHeight={videoRef.current!.videoHeight || 720}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
          />
        ))}

        {/* Corner markers */}
        {!captured && (
          <>
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-teal-400 rounded-tl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-teal-400 rounded-tr" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-teal-400 rounded-bl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-teal-400 rounded-br" />
          </>
        )}

        {/* Detection status indicator */}
        {!captured && cameraReady && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${
              vehicleDetected ? 'bg-teal-400' : isModelLoaded ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-white/90 text-xs">
              {vehicleDetected
                ? `Vehicle detected (${Math.round(vehicleConfidence * 100)}%)`
                : isModelLoaded
                  ? 'Searching for vehicle...'
                  : modelLoading
                    ? 'Loading model...'
                    : 'Model unavailable'}
            </span>
          </div>
        )}

        {/* Zone instruction banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-4 pt-8">
          <p className="text-white text-sm font-medium">{zoneLabel}</p>
          <p className="text-white/70 text-xs">{zoneInstruction}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!captured ? (
          <Button
            onClick={handleCapture}
            size="lg"
            disabled={!cameraReady}
            className="bg-teal-600 hover:bg-teal-700 min-w-[180px]"
          >
            <Camera className="h-5 w-5 mr-2" />
            Capture {zoneLabel}
          </Button>
        ) : (
          <>
            <Button onClick={handleRetake} size="lg" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
            <Button onClick={handleConfirm} size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Check className="h-4 w-4 mr-2" />
              Use Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
