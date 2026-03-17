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
  const loadingRef = useRef(false);
  const [state, setState] = useState<VehicleDetectionState>({
    isModelLoaded: false,
    isLoading: false,
    error: null,
    detections: [],
    vehicleDetected: false,
    vehicleConfidence: 0,
  });

  const loadModel = useCallback(async () => {
    // Prevent double-loading
    if (modelRef.current || loadingRef.current) return;
    loadingRef.current = true;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const tf = await import('@tensorflow/tfjs');
      await tf.ready();

      // Prefer WebGL, fall back to WASM then CPU
      const currentBackend = tf.getBackend();
      if (currentBackend !== 'webgl') {
        try {
          await tf.setBackend('webgl');
        } catch {
          try {
            await tf.setBackend('wasm');
          } catch {
            await tf.setBackend('cpu');
          }
        }
      }

      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      const model = await cocoSsd.load({
        base: 'lite_mobilenet_v2',
      });

      modelRef.current = model;
      loadingRef.current = false;
      setState(prev => ({ ...prev, isModelLoaded: true, isLoading: false }));
    } catch (err) {
      loadingRef.current = false;
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
    intervalMs = 800
  ) => {
    let running = true;

    // Use requestAnimationFrame-based loop instead of setInterval
    // to avoid stacking if detection is slower than the interval
    async function loop() {
      if (!running) return;
      if (source.readyState >= 2) {
        await detect(source);
      }
      if (running) {
        setTimeout(() => {
          if (running) requestAnimationFrame(loop);
        }, intervalMs);
      }
    }

    requestAnimationFrame(loop);

    return () => { running = false; };
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
