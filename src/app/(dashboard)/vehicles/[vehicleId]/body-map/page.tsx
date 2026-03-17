'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVehicleById, getDamageByVehicleId } from '@/lib/dal';
import { Vehicle } from '@/types/vehicle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BODY_PANEL_LABELS, DAMAGE_TYPE_LABELS, SEVERITY_LABELS, SEVERITY_COLOURS } from '@/lib/constants';
import { DamageItem } from '@/types/damage';

type ViewAngle = 'top' | 'left' | 'right' | 'front' | 'rear';

const viewLabels: Record<ViewAngle, string> = {
  top: 'Top View',
  left: 'Left Side',
  right: 'Right Side',
  front: 'Front',
  rear: 'Rear',
};

function getSeverityColour(severity: string): string {
  switch (severity) {
    case 'negligible': return '#9ca3af';
    case 'minor': return '#3b82f6';
    case 'moderate': return '#f59e0b';
    case 'significant': return '#f97316';
    case 'severe': return '#ef4444';
    default: return '#6b7280';
  }
}

function CarSvg({ view, damages, onPinClick, selectedId }: { view: ViewAngle; damages: DamageItem[]; onPinClick: (d: DamageItem) => void; selectedId?: string }) {
  return (
    <svg viewBox="0 0 400 250" className="w-full h-auto max-h-[400px]">
      {/* Car body based on view */}
      {view === 'top' && (
        <>
          <rect x="100" y="20" width="200" height="210" rx="40" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <rect x="130" y="40" width="140" height="60" rx="10" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1" opacity="0.5" />
          <rect x="130" y="150" width="140" height="50" rx="10" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1" opacity="0.5" />
          <text x="200" y="135" textAnchor="middle" fontSize="12" fill="#6b7280">{viewLabels[view]}</text>
        </>
      )}
      {view === 'left' && (
        <>
          <rect x="60" y="70" width="280" height="100" rx="15" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <rect x="120" y="40" width="160" height="55" rx="12" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <circle cx="120" cy="175" r="20" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <circle cx="280" cy="175" r="20" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <text x="200" y="130" textAnchor="middle" fontSize="12" fill="#6b7280">{viewLabels[view]}</text>
        </>
      )}
      {view === 'right' && (
        <>
          <rect x="60" y="70" width="280" height="100" rx="15" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <rect x="120" y="40" width="160" height="55" rx="12" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <circle cx="120" cy="175" r="20" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <circle cx="280" cy="175" r="20" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <text x="200" y="130" textAnchor="middle" fontSize="12" fill="#6b7280">{viewLabels[view]}</text>
        </>
      )}
      {view === 'front' && (
        <>
          <rect x="80" y="50" width="240" height="130" rx="20" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <rect x="120" y="30" width="160" height="50" rx="15" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <circle cx="130" cy="190" r="18" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <circle cx="270" cy="190" r="18" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <rect x="150" y="55" width="40" height="25" rx="5" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <rect x="210" y="55" width="40" height="25" rx="5" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <text x="200" y="125" textAnchor="middle" fontSize="12" fill="#6b7280">{viewLabels[view]}</text>
        </>
      )}
      {view === 'rear' && (
        <>
          <rect x="80" y="50" width="240" height="130" rx="20" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <rect x="120" y="30" width="160" height="50" rx="15" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
          <circle cx="130" cy="190" r="18" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <circle cx="270" cy="190" r="18" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
          <rect x="140" y="80" width="50" height="25" rx="5" fill="#fecaca" stroke="#ef4444" strokeWidth="1" />
          <rect x="210" y="80" width="50" height="25" rx="5" fill="#fecaca" stroke="#ef4444" strokeWidth="1" />
          <text x="200" y="130" textAnchor="middle" fontSize="12" fill="#6b7280">{viewLabels[view]}</text>
        </>
      )}

      {/* Damage pins */}
      {damages.map(d => {
        const cx = 60 + d.position.x * 280;
        const cy = 20 + d.position.y * 210;
        const isSelected = d.id === selectedId;
        return (
          <g key={d.id} onClick={() => onPinClick(d)} className="cursor-pointer">
            {isSelected && <circle cx={cx} cy={cy} r="14" fill={getSeverityColour(d.severity)} opacity="0.2" />}
            <circle cx={cx} cy={cy} r="8" fill={getSeverityColour(d.severity)} stroke="white" strokeWidth="2" opacity="0.9" />
            {d.isNew && <circle cx={cx + 6} cy={cy - 6} r="4" fill="#ef4444" stroke="white" strokeWidth="1" />}
          </g>
        );
      })}
    </svg>
  );
}

export default function BodyMapPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [damages, setDamages] = useState<DamageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewAngle>('top');
  const [selected, setSelected] = useState<DamageItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [v, d] = await Promise.all([
        getVehicleById(vehicleId),
        getDamageByVehicleId(vehicleId),
      ]);
      if (cancelled) return;
      if (!v) { notFound(); return; }
      setVehicle(v);
      setDamages(d);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [vehicleId]);

  if (loading || !vehicle) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={`/vehicles/${vehicleId}`} className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to {vehicle.registrationPlate}
      </Link>

      <h2 className="text-2xl font-bold text-gray-900">Body Map — {vehicle.make} {vehicle.model}</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4 flex-wrap">
                {(Object.keys(viewLabels) as ViewAngle[]).map(v => (
                  <Button key={v} variant={view === v ? 'default' : 'outline'} size="sm" onClick={() => setView(v)}
                    className={view === v ? 'bg-teal-600 hover:bg-teal-700' : ''}>
                    {viewLabels[v]}
                  </Button>
                ))}
              </div>
              <CarSvg view={view} damages={damages} onPinClick={setSelected} selectedId={selected?.id} />
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-gray-400 inline-block" />Negligible</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />Minor</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />Moderate</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-500 inline-block" />Significant</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500 inline-block" />Severe</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {selected ? (
            <Card className="border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{DAMAGE_TYPE_LABELS[selected.type]}</h3>
                  <Badge className={SEVERITY_COLOURS[selected.severity]}>{SEVERITY_LABELS[selected.severity]}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{selected.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Panel</span>
                    <span className="font-medium">{BODY_PANEL_LABELS[selected.panel]}</span>
                  </div>
                  {selected.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size</span>
                      <span className="font-medium">{selected.dimensions.lengthMm}mm{selected.dimensions.widthMm ? ` x ${selected.dimensions.widthMm}mm` : ''}</span>
                    </div>
                  )}
                  {selected.repairEstimate && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Repair Cost</span>
                        <span className="font-medium">&pound;{selected.repairEstimate.costGbp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Method</span>
                        <span className="font-medium text-right">{selected.repairEstimate.method}</span>
                      </div>
                    </>
                  )}
                  {selected.isNew && (
                    <Badge className="bg-red-50 text-red-700 border-red-200 mt-2">New — First detected this scan</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <p className="text-sm">Click a damage pin on the body map to see details</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">All Damage Items ({damages.length})</h3>
            {damages.map(d => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${d.id === selected?.id ? 'border-teal-300 bg-teal-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{DAMAGE_TYPE_LABELS[d.type]}</span>
                  <Badge variant="secondary" className={`${SEVERITY_COLOURS[d.severity]} text-xs`}>{SEVERITY_LABELS[d.severity]}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{BODY_PANEL_LABELS[d.panel]}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
