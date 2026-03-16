'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Check } from 'lucide-react';
import Link from 'next/link';

export default function AddVehiclePage() {
  const [regPlate, setRegPlate] = useState('');
  const [vin, setVin] = useState('');
  const [lookupResult, setLookupResult] = useState<{ make: string; model: string; year: number; colour: string; fuelType: string } | null>(null);
  const router = useRouter();

  const handleRegLookup = () => {
    // Mock DVLA lookup
    setLookupResult({
      make: 'Ford',
      model: 'Focus',
      year: 2022,
      colour: 'Blue',
      fuelType: 'Petrol',
    });
  };

  const handleVinLookup = () => {
    setLookupResult({
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      colour: 'Black',
      fuelType: 'Diesel',
    });
  };

  const handleAdd = () => {
    // In demo, just redirect
    router.push('/vehicles');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/vehicles" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Vehicles
      </Link>

      <h2 className="text-2xl font-bold text-gray-900">Add Vehicle</h2>

      <Tabs defaultValue="reg">
        <TabsList>
          <TabsTrigger value="reg">Registration Plate</TabsTrigger>
          <TabsTrigger value="vin">VIN Number</TabsTrigger>
        </TabsList>

        <TabsContent value="reg">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UK Registration Plate</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-blue-600 rounded-l-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">GB</span>
                    </div>
                    <Input
                      value={regPlate}
                      onChange={e => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
                        setRegPlate(val);
                        setLookupResult(null);
                      }}
                      placeholder="AB12 CDE"
                      className="pl-12 font-mono text-lg font-bold bg-amber-50 border-amber-200 tracking-wider"
                      maxLength={8}
                    />
                  </div>
                  <Button onClick={handleRegLookup} className="bg-teal-600 hover:bg-teal-700">
                    <Search className="h-4 w-4 mr-2" />Look Up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vin">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Identification Number</label>
                <div className="flex gap-3">
                  <Input
                    value={vin}
                    onChange={e => {
                      setVin(e.target.value.toUpperCase());
                      setLookupResult(null);
                    }}
                    placeholder="WF0XXXGCDX1234567"
                    className="font-mono tracking-wide"
                    maxLength={17}
                  />
                  <Button onClick={handleVinLookup} className="bg-teal-600 hover:bg-teal-700">
                    <Search className="h-4 w-4 mr-2" />Look Up
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">17-character VIN found on the dashboard or door jamb</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lookupResult && (
        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Vehicle Found</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Make</span>
                <p className="font-medium text-gray-900">{lookupResult.make}</p>
              </div>
              <div>
                <span className="text-gray-500">Model</span>
                <p className="font-medium text-gray-900">{lookupResult.model}</p>
              </div>
              <div>
                <span className="text-gray-500">Year</span>
                <p className="font-medium text-gray-900">{lookupResult.year}</p>
              </div>
              <div>
                <span className="text-gray-500">Colour</span>
                <p className="font-medium text-gray-900">{lookupResult.colour}</p>
              </div>
              <div>
                <span className="text-gray-500">Fuel Type</span>
                <p className="font-medium text-gray-900">{lookupResult.fuelType}</p>
              </div>
              <div>
                <span className="text-gray-500">MOT Status</span>
                <Badge className="bg-teal-50 text-teal-700 border-teal-200">Valid</Badge>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700">Add This Vehicle</Button>
              <Button variant="outline" onClick={() => setLookupResult(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
