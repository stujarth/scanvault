'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVehicleById } from '@/data/vehicles';
import { getScansByVehicleId } from '@/data/scans';
import { getDamageByScanId } from '@/data/damage-items';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ScanLine, Clock, MapPin, Cloud, Camera } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { format } from 'date-fns';

export default function ScanHistoryPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) notFound();

  const scans = getScansByVehicleId(vehicleId);

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
            const damages = getDamageByScanId(scan.id);
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
                        <span className="text-gray-500">{scan.mileageAtScan.toLocaleString()} miles</span>
                        <span className="text-gray-500">{Math.round(scan.duration / 60)} min scan</span>
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
