'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVehicleById, getScansByVehicleId, getDamageByScanId } from '@/lib/dal';
import { Vehicle } from '@/types/vehicle';
import { Scan } from '@/types/scan';
import { DamageItem } from '@/types/damage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ScanLine, Clock, MapPin, Cloud, Camera, Loader2 } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { format } from 'date-fns';

export default function ScanHistoryPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [scanDamages, setScanDamages] = useState<Record<string, DamageItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [v, s] = await Promise.all([
        getVehicleById(vehicleId),
        getScansByVehicleId(vehicleId),
      ]);
      if (cancelled) return;
      if (!v) { notFound(); return; }
      setVehicle(v);
      setScans(s);

      // Load damages per scan
      const damageMap: Record<string, DamageItem[]> = {};
      await Promise.all(s.map(async (scan) => {
        const damages = await getDamageByScanId(scan.id);
        damageMap[scan.id] = damages;
      }));
      if (!cancelled) {
        setScanDamages(damageMap);
        setLoading(false);
      }
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

      <h2 className="text-2xl font-bold text-gray-900">Scan History — {vehicle.make} {vehicle.model}</h2>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {scans.map((scan, index) => {
            const damages = scanDamages[scan.id] || [];
            const newDamages = damages.filter(d => d.isNew);
            return (
              <div key={scan.id} className="relative pl-14">
                <div className={`absolute left-4 w-5 h-5 rounded-full border-2 border-white shadow ${index === 0 ? 'bg-teal-500' : 'bg-gray-300'}`} />
                <Link href={`/vehicles/${vehicleId}/scans/${scan.id}`}>
                  <Card className="hover:border-teal-200 transition-colors cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{scan.context}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(scan.createdAt), 'd MMM yyyy, HH:mm')}</span>
                            {scan.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{scan.location}</span>}
                            {scan.weatherConditions && <span className="flex items-center gap-1"><Cloud className="h-3 w-3" />{scan.weatherConditions}</span>}
                            <span className="flex items-center gap-1"><Camera className="h-3 w-3" />{scan.imageCount} images</span>
                          </div>
                        </div>
                        <Badge className={`${getGradeBgColour(scan.grade.overall)} ${getGradeColour(scan.grade.overall)} border`}>
                          {scan.grade.overall} — {scan.grade.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-3">
                        <span className="text-gray-500">{damages.length} damage items</span>
                        {newDamages.length > 0 && (
                          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">{newDamages.length} new</Badge>
                        )}
                        {scan.mileageAtScan && <span className="text-gray-500">{scan.mileageAtScan.toLocaleString()} miles</span>}
                        {scan.duration && <span className="text-gray-500">{Math.round(scan.duration / 60)} min scan</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
