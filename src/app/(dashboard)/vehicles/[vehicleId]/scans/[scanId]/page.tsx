'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVehicleById, getScanById, getDamageByScanId } from '@/lib/dal';
import { Vehicle } from '@/types/vehicle';
import { Scan } from '@/types/scan';
import { DamageItem } from '@/types/damage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, Cloud, Camera, Gauge, Loader2 } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { BODY_PANEL_LABELS, DAMAGE_TYPE_LABELS, SEVERITY_LABELS, SEVERITY_COLOURS } from '@/lib/constants';
import { format } from 'date-fns';

export default function ScanDetailPage({ params }: { params: Promise<{ vehicleId: string; scanId: string }> }) {
  const { vehicleId, scanId } = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);
  const [damages, setDamages] = useState<DamageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [v, s, d] = await Promise.all([
        getVehicleById(vehicleId),
        getScanById(scanId),
        getDamageByScanId(scanId),
      ]);
      if (cancelled) return;
      if (!v || !s) { notFound(); return; }
      setVehicle(v);
      setScan(s);
      setDamages(d);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [vehicleId, scanId]);

  if (loading || !vehicle || !scan) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  const newDamages = damages.filter(d => d.isNew);
  const totalRepairCost = damages.reduce((sum, d) => sum + (d.repairEstimate?.costGbp || 0), 0);

  return (
    <div className="space-y-6">
      <Link href={`/vehicles/${vehicleId}/scans`} className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Scan History
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{scan.context}</h2>
          <p className="text-gray-500 mt-1">{vehicle.registrationPlate} — {vehicle.make} {vehicle.model}</p>
        </div>
        <Badge className={`${getGradeBgColour(scan.grade.overall)} ${getGradeColour(scan.grade.overall)} border text-lg px-4 py-2`}>
          {scan.grade.overall} — {scan.grade.label}
        </Badge>
      </div>

      {/* Scan metadata */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Clock, label: 'Date', value: format(new Date(scan.createdAt), 'd MMM yyyy, HH:mm') },
          { icon: MapPin, label: 'Location', value: scan.location || 'Not recorded' },
          { icon: Cloud, label: 'Weather', value: scan.weatherConditions || 'Not recorded' },
          { icon: Camera, label: 'Images', value: `${scan.imageCount} captured` },
          { icon: Gauge, label: 'Mileage', value: scan.mileageAtScan ? `${scan.mileageAtScan.toLocaleString()} mi` : 'N/A' },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
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
            <p className="text-sm text-gray-500">New This Scan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-bold text-gray-900">&pound;{totalRepairCost.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Est. Repair Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Damage list */}
      <h3 className="text-lg font-semibold text-gray-900">Damage Items</h3>
      <div className="space-y-3">
        {damages.map(damage => (
          <Card key={damage.id} className={damage.isNew ? 'border-red-200 bg-red-50/20' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{DAMAGE_TYPE_LABELS[damage.type]}</span>
                    <Badge variant="secondary" className={SEVERITY_COLOURS[damage.severity]}>{SEVERITY_LABELS[damage.severity]}</Badge>
                    {damage.isNew && <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{damage.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{BODY_PANEL_LABELS[damage.panel]}{damage.dimensions ? ` — ${damage.dimensions.lengthMm}mm` : ''}</p>
                </div>
                {damage.repairEstimate && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">&pound;{damage.repairEstimate.costGbp}</p>
                    <p className="text-xs text-gray-500">{damage.repairEstimate.method}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {damages.length === 0 && (
          <Card><CardContent className="p-8 text-center text-gray-500">No damage items detected in this scan</CardContent></Card>
        )}
      </div>
    </div>
  );
}
