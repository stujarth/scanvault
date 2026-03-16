'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getVehicleById } from '@/data/vehicles';
import { getDamageByVehicleId } from '@/data/damage-items';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Camera, Check, Loader2, ScanLine, AlertTriangle } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { DAMAGE_TYPE_LABELS, SEVERITY_LABELS, BODY_PANEL_LABELS } from '@/lib/constants';
import Link from 'next/link';

const scanZones = [
  { id: 'front', label: 'Front', instruction: 'Stand 2 metres from the front bumper' },
  { id: 'right', label: 'Right Side', instruction: 'Walk slowly along the right side' },
  { id: 'rear', label: 'Rear', instruction: 'Stand 2 metres from the rear bumper' },
  { id: 'left', label: 'Left Side', instruction: 'Walk slowly along the left side' },
  { id: 'roof', label: 'Roof', instruction: 'Hold the device above the roof line' },
  { id: 'wheels', label: 'Wheels & Arches', instruction: 'Capture each wheel close-up' },
];

const processingSteps = [
  'Analysing captured images...',
  'Detecting body panels...',
  'Identifying surface damage...',
  'Measuring damage dimensions...',
  'Calculating condition grade...',
  'Generating report...',
];

type Phase = 'setup' | 'scanning' | 'processing' | 'results';

export default function ScanSimulatorPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) notFound();

  const router = useRouter();
  const damages = getDamageByVehicleId(vehicleId);
  const newDamages = damages.filter(d => d.isNew);

  const [phase, setPhase] = useState<Phase>('setup');
  const [currentZone, setCurrentZone] = useState(0);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleCaptureZone = useCallback(() => {
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

  useEffect(() => {
    if (phase === 'processing') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('results');
            return 100;
          }
          return prev + 2;
        });
        setProcessingStep(prev => {
          const step = Math.floor((processingProgress / 100) * processingSteps.length);
          return Math.min(step, processingSteps.length - 1);
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase, processingProgress]);

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
            <p className="text-gray-500 mt-1">{vehicle.make} {vehicle.model}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pre-Scan Checklist</h3>
              <div className="space-y-3">
                {[
                  'Vehicle is clean and dry (or note wet conditions)',
                  'Good lighting — natural daylight preferred',
                  'Clear access around all sides of the vehicle',
                  'Phone/tablet camera lens is clean',
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

          <Card className="border-teal-200">
            <CardContent className="p-8 text-center">
              {/* Simulated camera view */}
              <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-xl bg-gray-900 overflow-hidden mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/20 text-6xl">
                    <Camera className="h-16 w-16" />
                  </div>
                </div>
                {/* Scan guide overlay */}
                <div className="absolute inset-4 border-2 border-dashed border-teal-400/50 rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent animate-pulse" />
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-teal-400" />
                {/* Instruction overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3">
                  <p className="text-white text-sm font-medium">{scanZones[currentZone].label}</p>
                  <p className="text-white/70 text-xs">{scanZones[currentZone].instruction}</p>
                </div>
              </div>

              <Button onClick={handleCaptureZone} size="lg" className="bg-teal-600 hover:bg-teal-700">
                <Camera className="h-5 w-5 mr-2" /> Capture {scanZones[currentZone].label}
              </Button>
            </CardContent>
          </Card>

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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Scan</h2>
            <p className="text-sm text-gray-500 mb-6">{processingSteps[processingStep]}</p>
            <Progress value={processingProgress} className="max-w-md mx-auto h-3" />
            <p className="text-xs text-gray-400 mt-3">Analysing {vehicle.totalScans > 0 ? '52' : '48'} images...</p>
          </CardContent>
        </Card>
      )}

      {/* RESULTS PHASE */}
      {phase === 'results' && (
        <>
          <div className="text-center">
            <div className={`mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-4 border ${getGradeBgColour(vehicle.currentGrade.score)}`}>
              <span className={`text-3xl font-bold ${getGradeColour(vehicle.currentGrade.score)}`}>{vehicle.currentGrade.score}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Scan Complete</h2>
            <Badge className={`mt-2 ${getGradeBgColour(vehicle.currentGrade.score)} ${getGradeColour(vehicle.currentGrade.score)} border text-sm`}>
              {vehicle.currentGrade.label}
            </Badge>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-gray-900">{damages.length}</div>
                <p className="text-sm text-gray-500">Damage Items</p>
              </CardContent>
            </Card>
            <Card className={newDamages.length > 0 ? 'border-red-200' : ''}>
              <CardContent className="p-5 text-center">
                <div className={`text-3xl font-bold ${newDamages.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>{newDamages.length}</div>
                <p className="text-sm text-gray-500">New Damage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-gray-900">48</div>
                <p className="text-sm text-gray-500">Images Analysed</p>
              </CardContent>
            </Card>
          </div>

          {newDamages.length > 0 && (
            <Card className="border-red-200 bg-red-50/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">New Damage Detected</h3>
                </div>
                <div className="space-y-2">
                  {newDamages.map(d => (
                    <div key={d.id} className="flex items-center justify-between text-sm">
                      <span className="text-red-700">{DAMAGE_TYPE_LABELS[d.type]} — {BODY_PANEL_LABELS[d.panel]}</span>
                      <Badge className="bg-red-100 text-red-700 text-xs">{SEVERITY_LABELS[d.severity]}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 justify-center">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href={`/vehicles/${vehicleId}/body-map`}>View Body Map</Link>
            </Button>
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
