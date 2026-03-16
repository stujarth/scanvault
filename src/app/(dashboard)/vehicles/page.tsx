'use client';

import { useAuth } from '@/providers/auth-provider';
import { getVehiclesByOwnerId } from '@/data/vehicles';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Car, Search } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { format } from 'date-fns';
import { useState } from 'react';

export default function VehiclesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  if (!user) return null;

  const vehicles = getVehiclesByOwnerId(user.id).filter(v =>
    !search || v.registrationPlate.toLowerCase().includes(search.toLowerCase()) ||
    v.make.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vehicles</h2>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/vehicles/add"><Plus className="h-4 w-4 mr-2" />Add Vehicle</Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by plate, make, or model..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-sm text-gray-500 mb-4">Add your first vehicle to start scanning.</p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/vehicles/add">Add Vehicle</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(vehicle => (
            <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
              <Card className="hover:shadow-md hover:border-teal-200 transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-amber-100 text-amber-900 font-mono font-bold text-sm px-3 py-1 rounded border border-amber-200">
                      {vehicle.registrationPlate}
                    </div>
                    <Badge className={`${getGradeBgColour(vehicle.currentGrade.score)} ${getGradeColour(vehicle.currentGrade.score)} border text-xs`}>
                      {vehicle.currentGrade.score}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-sm text-gray-500">{vehicle.year} &middot; {vehicle.colour} &middot; {vehicle.fuelType}</p>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
                    <span>{vehicle.totalScans} scans</span>
                    <span>{vehicle.mileage.toLocaleString()} miles</span>
                    {vehicle.lastScanDate && (
                      <span>Last: {format(new Date(vehicle.lastScanDate), 'd MMM')}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
