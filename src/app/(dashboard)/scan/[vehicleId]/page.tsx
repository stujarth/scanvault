'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getVehicleById, getDamageByVehicleId, createScan, updateScanStatus, createDamageItems } from '@/lib/dal';
import { useAuth } from '@/providers/auth-provider';
import { isSupabaseConfigured } from '@/lib/supabase';
import { uploadScanImage, saveScanImage, dataUrlToBlob } from '@/lib/supabase-storage';
import { Vehicle } from '@/types/vehicle';
import { DamageItem } from '@/types/damage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Camera, Check, Loader2, ScanLine, AlertTriangle, Video, Monitor } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { DAMAGE_TYPE_LABELS, SEVERITY_LABELS, BODY_PANEL_LABELS } from '@/lib/constants';
import { CameraScanner } from '@/components/scanning/camera-scanner';
import Link from 'next/link';

const scanZones = [
  { id: 'front', label: 'Front', instruction: 'Stand 2 metres from the front bumper, centre the vehicle in frame' },
  { id: 'right', label: 'Right Side', instruction: 'Walk slowly along the right side, keeping the full panel in view' },
  { id: 'rear', label: 'Rear', instruction: 'Stand 2 metres from the rear bumper, centre the vehicle in frame' },
  { id: 'left', label: 'Left Side', instruction: 'Walk slowly along the left side, keeping the full panel in view' },
  { id: 'roof', label: 'Roof', instruction: 'Hold the device above the roof line looking down' },
  { id: 'wheels', label: 'Wheels & Arches', instruction: 'Capture each wheel arch close-up, including alloys' },
];

const processingSteps = [
  'Uploading images to analysis server...',
  'Detecting body panels with AI...',
  'Identifying surface damage...',
  'Measuring damage dimensions...',
  'Estimating repair costs...',
  'Calculating condition grade...',
];

type Phase = 'setup' | 'scanning' | 'processing' | 'results';
type ScanMode = 'camera' | 'demo';

interface CapturedZone {
  zoneId: string;
  images: string[];
}

interface AnalysedDamage {
  type: string;
  severity: string;
  panel: string;
  description: string;
  repairCostGbp: number | null;
  repairMethod: string | null;
  confidence: number;
}

export default function ScanSimulatorPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [newDamages, setNewDamages] = useState<DamageItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [savedScanId, setSavedScanId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [v, damages] = await Promise.all([
        getVehicleById(vehicleId),
        getDamageByVehicleId(vehicleId),
      ]);
      if (cancelled) return;
      if (!v) { notFound(); return; }
      setVehicle(v);
      setNewDamages(damages.filter(d => d.isNew));
      setDataLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [vehicleId]);

  const [phase, setPhase] = useState<Phase>('setup');
  const [scanMode, setScanMode] = useState<ScanMode>('camera');
  const [currentZone, setCurrentZone] = useState(0);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [capturedZones, setCapturedZones] = useState<CapturedZone[]>([]);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysedDamages, setAnalysedDamages] = useState<AnalysedDamage[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [resultGrade, setResultGrade] = useState<number>(0);

  // Handle camera capture for a zone
  const handleCameraCapture = useCallback((imageData: string) => {
    const zone = scanZones[currentZone];
    setCapturedZones(prev => {
      const existing = prev.find(z => z.zoneId === zone.id);
      if (existing) {
        return prev.map(z => z.zoneId === zone.id ? { ...z, images: [...z.images, imageData] } : z);
      }
      return [...prev, { zoneId: zone.id, images: [imageData] }];
    });
    setCompletedZones(prev => [...prev, zone.id]);

    if (currentZone < scanZones.length - 1) {
      setCurrentZone(prev => prev + 1);
    } else {
      setPhase('processing');
    }
  }, [currentZone]);

  // Handle demo mode capture (simulated)
  const handleDemoCapture = useCallback(() => {
    const zone = scanZones[currentZone];
    setTimeout(() => {
      setCompletedZones(prev => [...prev, zone.id]);
      if (currentZone < scanZones.length - 1) {
        setCurrentZone(prev => prev + 1);
      } else {
        setPhase('processing');
      }
    }, 1500);
  }, [currentZone]);

  // Handle skip zone in camera mode
  const handleSkipZone = useCallback(() => {
    setCompletedZones(prev => [...prev, scanZones[currentZone].id]);
    if (currentZone < scanZones.length - 1) {
      setCurrentZone(prev => prev + 1);
    } else {
      setPhase('processing');
    }
  }, [currentZone]);

  // Processing phase — either call Claude Vision API or simulate
  useEffect(() => {
    if (phase !== 'processing') return;

    if (scanMode === 'camera' && capturedZones.length > 0) {
      // Real analysis with Claude Vision
      runAnalysis();
    } else {
      // Demo mode — simulate processing
      runDemoProcessing();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  async function runAnalysis() {
    if (!vehicle) return;

    setProcessingProgress(0);
    setProcessingStep(0);
    let progress = 0;

    // Progress animation while waiting for API
    const progressInterval = setInterval(() => {
      if (progress >= 90) {
        clearInterval(progressInterval);
        return;
      }
      progress += 1;
      setProcessingProgress(progress);
      const step = Math.floor((progress / 100) * processingSteps.length);
      setProcessingStep(Math.min(step, processingSteps.length - 1));
    }, 150);

    try {
      // Send all zone images in parallel for speed
      const promises = capturedZones
        .filter(zone => zone.images.length > 0)
        .map(zone =>
          fetch('/api/analyze-damage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              images: zone.images,
              vehicleType: vehicle.vehicleType,
              vehicleMake: vehicle.make,
              vehicleModel: vehicle.model,
              vehicleColour: vehicle.colour,
              zone: zone.zoneId,
            }),
          }).then(r => r.ok ? r.json() : null).catch(() => null)
        );

      const results = await Promise.all(promises);
      clearInterval(progressInterval);

      const allDamages: AnalysedDamage[] = [];
      for (const result of results) {
        if (result?.damages) allDamages.push(...result.damages);
      }

      setAnalysedDamages(allDamages);

      const damageDeductions = allDamages.reduce((sum, d) => {
        const severityScores: Record<string, number> = {
          negligible: 1, minor: 3, moderate: 8, significant: 15, severe: 25,
        };
        return sum + (severityScores[d.severity] || 5);
      }, 0);
      const grade = Math.max(0, 100 - damageDeductions);
      const gradeLabel = grade >= 90 ? 'Excellent' : grade >= 75 ? 'Good' : grade >= 55 ? 'Fair' : grade >= 30 ? 'Poor' : 'Fail';
      setResultGrade(grade);

      // Persist to Supabase in background
      persistScan(allDamages, grade, gradeLabel);

      setProcessingProgress(100);
      setProcessingStep(processingSteps.length - 1);
      setTimeout(() => setPhase('results'), 500);
    } catch (err) {
      clearInterval(progressInterval);
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed');
      setProcessingProgress(100);
      setTimeout(() => setPhase('results'), 500);
    }
  }

  function runDemoProcessing() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        clearInterval(interval);
        setProcessingProgress(100);
        setProcessingStep(processingSteps.length - 1);
        setPhase('results');
        return;
      }
      setProcessingProgress(progress);
      const step = Math.floor((progress / 100) * processingSteps.length);
      setProcessingStep(Math.min(step, processingSteps.length - 1));
    }, 80);
  }

  // Persist scan results to Supabase
  async function persistScan(damages: AnalysedDamage[], grade: number, gradeLabel: string) {
    if (!isSupabaseConfigured || !user || !vehicle) return;

    try {
      // 1. Create the scan record
      const scan = await createScan({
        vehicleId,
        performedBy: user.id,
        type: 'exterior_full',
        status: 'processing',
        context: 'Full exterior scan',
        mileageAtScan: vehicle.mileage,
        imageCount: capturedZones.reduce((sum, z) => sum + z.images.length, 0),
      });

      if (!scan) return;
      setSavedScanId(scan.id);

      // 2. Upload captured images and save references
      for (const zone of capturedZones) {
        for (let i = 0; i < zone.images.length; i++) {
          const blob = dataUrlToBlob(zone.images[i]);
          const imageUrl = await uploadScanImage(scan.id, zone.zoneId, blob, i);
          if (imageUrl) {
            await saveScanImage({ scanId: scan.id, position: zone.zoneId, imageUrl });
          }
        }
      }

      // 3. Save damage items
      if (damages.length > 0) {
        await createDamageItems(
          damages.map(d => ({
            scanId: scan.id,
            vehicleId,
            type: d.type as any,
            severity: d.severity as any,
            panel: d.panel as any,
            description: d.description,
            repairEstimate: d.repairCostGbp ? { costGbp: d.repairCostGbp, method: d.repairMethod || 'Unknown' } : undefined,
            confidence: d.confidence,
            isNew: true,
            firstDetectedScanId: scan.id,
          }))
        );
      }

      // 4. Update scan status to complete with grade
      await updateScanStatus(scan.id, 'complete', {
        overall: grade,
        label: gradeLabel,
        profile: 'private_sale',
      });
    } catch (err) {
      console.error('Failed to persist scan:', err);
    }
  }

  // In results, merge AI-detected damages with existing demo damages
  const displayDamages = analysedDamages.length > 0
    ? analysedDamages
    : newDamages.map(d => ({
        type: d.type,
        severity: d.severity,
        panel: d.panel,
        description: d.description,
        repairCostGbp: d.repairEstimate?.costGbp ?? null,
        repairMethod: d.repairEstimate?.method ?? null,
        confidence: 0.85,
      }));

  if (dataLoading || !vehicle) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  const displayGrade = analysedDamages.length > 0 ? resultGrade : vehicle.currentGrade.score;
  const displayGradeLabel = displayGrade >= 90 ? 'Excellent' : displayGrade >= 75 ? 'Good' : displayGrade >= 55 ? 'Fair' : displayGrade >= 30 ? 'Poor' : 'Fail';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {phase !== 'results' && (
        <Link href={`/vehicles/${vehicleId}`} className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Cancel Scan
        </Link>
      )}

      {/* SETUP PHASE */}
      {phase === 'setup' && (
        <>
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
              <ScanLine className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Scan {vehicle.registrationPlate}</h2>
            <p className="text-gray-500 mt-1">{vehicle.make} {vehicle.model} — {vehicle.colour} {vehicle.vehicleType}</p>
          </div>

          {/* Scan mode selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setScanMode('camera')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                scanMode === 'camera'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className={`h-8 w-8 mx-auto mb-2 ${scanMode === 'camera' ? 'text-teal-600' : 'text-gray-400'}`} />
              <p className={`font-medium text-sm ${scanMode === 'camera' ? 'text-teal-700' : 'text-gray-600'}`}>
                Live Camera
              </p>
              <p className="text-xs text-gray-400 mt-1">Real-time vehicle scanning with AI detection</p>
            </button>
            <button
              onClick={() => setScanMode('demo')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                scanMode === 'demo'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className={`h-8 w-8 mx-auto mb-2 ${scanMode === 'demo' ? 'text-teal-600' : 'text-gray-400'}`} />
              <p className={`font-medium text-sm ${scanMode === 'demo' ? 'text-teal-700' : 'text-gray-600'}`}>
                Demo Mode
              </p>
              <p className="text-xs text-gray-400 mt-1">Simulated scan with sample data</p>
            </button>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pre-Scan Checklist</h3>
              <div className="space-y-3">
                {[
                  'Vehicle is clean and dry (or note wet conditions)',
                  'Good lighting — natural daylight preferred',
                  'Clear access around all sides of the vehicle',
                  scanMode === 'camera' ? 'Phone/tablet camera lens is clean' : 'Ready to begin simulated scan',
                  'VIN matches: ' + vehicle.vin.slice(0, 8) + '...',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded border-2 border-teal-500 bg-teal-50 flex items-center justify-center">
                      <Check className="h-3 w-3 text-teal-600" />
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <select className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                  <option>Full Exterior Scan</option>
                  <option>Partial Scan</option>
                  <option>Undercarriage</option>
                </select>
                <Button onClick={() => setPhase('scanning')} className="bg-teal-600 hover:bg-teal-700">
                  <Camera className="h-4 w-4 mr-2" /> Start Scanning
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* SCANNING PHASE */}
      {phase === 'scanning' && (
        <>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Scanning — Zone {currentZone + 1} of {scanZones.length}</h2>
            <Progress value={(completedZones.length / scanZones.length) * 100} className="mt-3 h-2" />
          </div>

          {scanMode === 'camera' ? (
            /* Real camera scanner */
            <CameraScanner
              vehicleType={vehicle.vehicleType}
              zone={scanZones[currentZone].id}
              zoneLabel={scanZones[currentZone].label}
              zoneInstruction={scanZones[currentZone].instruction}
              onCapture={handleCameraCapture}
              onSkip={handleSkipZone}
            />
          ) : (
            /* Demo mode scanner (original UI) */
            <Card className="border-teal-200">
              <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-xl bg-gray-900 overflow-hidden mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/20">
                      <Camera className="h-16 w-16" />
                    </div>
                  </div>
                  <div className="absolute inset-4 border-2 border-dashed border-teal-400/50 rounded-lg" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent animate-pulse" />
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-teal-400" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3">
                    <p className="text-white text-sm font-medium">{scanZones[currentZone].label}</p>
                    <p className="text-white/70 text-xs">{scanZones[currentZone].instruction}</p>
                  </div>
                </div>

                <Button onClick={handleDemoCapture} size="lg" className="bg-teal-600 hover:bg-teal-700">
                  <Camera className="h-5 w-5 mr-2" /> Capture {scanZones[currentZone].label}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Zone progress */}
          <div className="grid grid-cols-6 gap-2">
            {scanZones.map((zone, i) => (
              <div key={zone.id} className={`rounded-lg p-2 text-center text-xs ${
                completedZones.includes(zone.id) ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                i === currentZone ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-gray-50 text-gray-400 border border-gray-100'
              }`}>
                {completedZones.includes(zone.id) ? <Check className="h-4 w-4 mx-auto mb-1" /> : <span className="text-lg font-bold">{i + 1}</span>}
                <p className="truncate">{zone.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PROCESSING PHASE */}
      {phase === 'processing' && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-16 w-16 text-teal-600 mx-auto mb-6 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {scanMode === 'camera' ? 'Analysing with AI' : 'Processing Scan'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{processingSteps[processingStep]}</p>
            <Progress value={processingProgress} className="max-w-md mx-auto h-3" />
            <p className="text-xs text-gray-400 mt-3">
              {scanMode === 'camera'
                ? `Analysing ${capturedZones.reduce((sum, z) => sum + z.images.length, 0)} captured images...`
                : `Analysing ${vehicle.totalScans > 0 ? '52' : '48'} images...`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* RESULTS PHASE */}
      {phase === 'results' && (
        <>
          <div className="text-center">
            <div className={`mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-4 border ${getGradeBgColour(displayGrade)}`}>
              <span className={`text-3xl font-bold ${getGradeColour(displayGrade)}`}>{displayGrade}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Scan Complete</h2>
            <Badge className={`mt-2 ${getGradeBgColour(displayGrade)} ${getGradeColour(displayGrade)} border text-sm`}>
              {displayGradeLabel}
            </Badge>
            {scanMode === 'camera' && analysedDamages.length > 0 && (
              <p className="text-xs text-teal-600 mt-2">AI-powered analysis by Claude Vision</p>
            )}
          </div>

          {analysisError && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-amber-700">AI analysis unavailable — showing demo results. ({analysisError})</p>
              </CardContent>
            </Card>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-gray-900">{displayDamages.length}</div>
                <p className="text-sm text-gray-500">Damage Items</p>
              </CardContent>
            </Card>
            <Card className={displayDamages.length > 0 ? 'border-red-200' : ''}>
              <CardContent className="p-5 text-center">
                <div className={`text-3xl font-bold ${displayDamages.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {displayDamages.filter(d => d.confidence > 0.7).length}
                </div>
                <p className="text-sm text-gray-500">High Confidence</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {scanMode === 'camera' ? capturedZones.reduce((sum, z) => sum + z.images.length, 0) : 48}
                </div>
                <p className="text-sm text-gray-500">Images Analysed</p>
              </CardContent>
            </Card>
          </div>

          {displayDamages.length > 0 && (
            <Card className="border-red-200 bg-red-50/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Damage Detected</h3>
                </div>
                <div className="space-y-2">
                  {displayDamages.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-red-700">
                          {DAMAGE_TYPE_LABELS[d.type] || d.type} — {BODY_PANEL_LABELS[d.panel] || d.panel}
                        </span>
                        {d.confidence < 1 && (
                          <span className="text-xs text-gray-400">{Math.round(d.confidence * 100)}%</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {d.repairCostGbp && (
                          <span className="text-xs text-gray-500">~£{d.repairCostGbp}</span>
                        )}
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          {SEVERITY_LABELS[d.severity] || d.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {displayDamages.some(d => d.repairCostGbp) && (
                  <div className="mt-4 pt-3 border-t border-red-200 flex justify-between text-sm">
                    <span className="font-medium text-red-800">Estimated Total Repair Cost</span>
                    <span className="font-bold text-red-800">
                      £{displayDamages.reduce((sum, d) => sum + (d.repairCostGbp || 0), 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {displayDamages.length === 0 && (
            <Card className="border-teal-200 bg-teal-50/30">
              <CardContent className="p-5 text-center">
                <Check className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <p className="text-teal-800 font-medium">No damage detected</p>
                <p className="text-sm text-teal-600">The vehicle body appears to be in excellent condition.</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 justify-center">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href={`/vehicles/${vehicleId}/body-map`}>View Body Map</Link>
            </Button>
            {savedScanId && (
              <Button variant="outline" asChild>
                <Link href={`/vehicles/${vehicleId}/scans/${savedScanId}`}>View Scan Details</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/vehicles/${vehicleId}`}>View Vehicle</Link>
            </Button>
            <Button variant="outline" onClick={() => router.push('/vehicles')}>
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
