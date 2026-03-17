'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export interface DetectedVehicle {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

export interface VehicleDetectionState {
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  detections: DetectedVehicle[];
  vehicleDetected: boolean;
  vehicleConfidence: number;
}

const VEHICLE_CLASSES = ['car', 'truck', 'bus', 'motorcycle'];

export function useVehicleDetection() {
  const modelRef = useRef<any>(null);
  const [state, setState] = useState<VehicleDetectionState>({
    isModelLoaded: false,
    isLoading: false,
    error: null,
    detections: [],
    vehicleDetected: false,
    vehicleConfidence: 0,
  });

  const loadModel = useCallback(async () => {
    if (modelRef.current) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Dynamic imports to avoid SSR issues with TensorFlow
      const tf = await import('@tensorflow/tfjs');
      await tf.ready();

      // Set backend - prefer WebGL for performance
      if (tf.getBackend() !== 'webgl') {
        try {
          await tf.setBackend('webgl');
        } catch {
          // Fall back to CPU if WebGL unavailable
          await tf.setBackend('cpu');
        }
      }

      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      const model = await cocoSsd.load({
        base: 'lite_mobilenet_v2', // Smaller, faster model for mobile
      });

      modelRef.current = model;
      setState(prev => ({ ...prev, isModelLoaded: true, isLoading: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load detection model';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const detect = useCallback(async (
    source: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
  ): Promise<DetectedVehicle[]> => {
    if (!modelRef.current) return [];

    try {
      const predictions = await modelRef.current.detect(source);

      const vehicleDetections: DetectedVehicle[] = predictions
        .filter((p: any) => VEHICLE_CLASSES.includes(p.class))
        .map((p: any) => ({
          bbox: p.bbox as [number, number, number, number],
          class: p.class,
          score: p.score,
        }));

      const bestDetection = vehicleDetections.reduce<DetectedVehicle | null>(
        (best, d) => (!best || d.score > best.score ? d : best),
        null
      );

      setState(prev => ({
        ...prev,
        detections: vehicleDetections,
        vehicleDetected: vehicleDetections.length > 0,
        vehicleConfidence: bestDetection?.score ?? 0,
      }));

      return vehicleDetections;
    } catch {
      return [];
    }
  }, []);

  const startContinuousDetection = useCallback((
    source: HTMLVideoElement,
    intervalMs = 500
  ) => {
    const id = setInterval(() => {
      if (source.readyState >= 2) {
        detect(source);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [detect]);

  // Cleanup model on unmount
  useEffect(() => {
    return () => {
      modelRef.current = null;
    };
  }, []);

  return {
    ...state,
    loadModel,
    detect,
    startContinuousDetection,
  };
}
