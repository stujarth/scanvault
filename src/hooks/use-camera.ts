'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export interface CameraState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export function useCamera(options: CameraOptions = {}) {
  const { facingMode = 'environment', width = 1920, height = 1080 } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CameraState>({
    isReady: false,
    isLoading: false,
    error: null,
    stream: null,
  });

  const start = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState({ isReady: true, isLoading: false, error: null, stream });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access camera';
      setState({ isReady: false, isLoading: false, error: message, stream: null });
    }
  }, [facingMode, width, height]);

  const stop = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState({ isReady: false, isLoading: false, error: null, stream: null });
  }, [state.stream]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !state.isReady) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, [state.isReady]);

  const captureBlob = useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !state.isReady) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.85);
    });
  }, [state.isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state.stream]);

  return {
    videoRef,
    canvasRef,
    ...state,
    start,
    stop,
    captureFrame,
    captureBlob,
  };
}
