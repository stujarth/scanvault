'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getVehiclesByOwnerId } from '@/lib/dal';
import { Vehicle } from '@/types/vehicle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Car, ScanLine, ChevronRight, Loader2 } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';

export default function ScanSelectPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getVehiclesByOwnerId(user.id).then(data => {
      if (!cancelled) { setVehicles(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
          <ScanLine className="h-8 w-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">New Scan</h2>
        <p className="text-gray-500 mt-1">Select a vehicle to scan</p>
      </div>

      <div className="space-y-3">
        {vehicles.map(vehicle => (
          <Link key={vehicle.id} href={`/scan/${vehicle.id}`}>
            <Card className="hover:border-teal-200 hover:shadow-md transition-all cursor-pointer mb-3">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Car className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 font-mono font-bold text-sm px-2 py-0.5 rounded border border-amber-200">
                        {vehicle.registrationPlate}
                      </span>
                      <Badge className={`${getGradeBgColour(vehicle.currentGrade.score)} ${getGradeColour(vehicle.currentGrade.score)} border text-xs`}>
                        {vehicle.currentGrade.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
