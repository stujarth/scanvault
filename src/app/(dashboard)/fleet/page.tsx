'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getVehiclesByOwnerId, getOrgById } from '@/lib/dal';
import { Vehicle } from '@/types/vehicle';
import { Organisation } from '@/types/organisation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Car, ScanLine, TrendingUp, UserPlus, Building2, Loader2 } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';

export default function FleetPage() {
  const { user } = useAuth();
  const [org, setOrg] = useState<Organisation | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const [v, o] = await Promise.all([
        getVehiclesByOwnerId(user!.id),
        user!.organisationId ? getOrgById(user!.organisationId) : Promise.resolve(undefined),
      ]);
      if (cancelled) return;
      setVehicles(v);
      setOrg(o ?? null);
      setLoading(false);
    }
    load();
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

  const avgGrade = vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.currentGrade.score, 0) / vehicles.length) : 0;
  const totalScans = vehicles.reduce((sum, v) => sum + v.totalScans, 0);

  const gradeDistribution = {
    excellent: vehicles.filter(v => v.currentGrade.score >= 90).length,
    good: vehicles.filter(v => v.currentGrade.score >= 75 && v.currentGrade.score < 90).length,
    fair: vehicles.filter(v => v.currentGrade.score >= 55 && v.currentGrade.score < 75).length,
    poor: vehicles.filter(v => v.currentGrade.score < 55).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet Management</h2>
          {org && <p className="text-gray-500 mt-1">{org.name}</p>}
        </div>
        <Button variant="outline"><UserPlus className="h-4 w-4 mr-2" />Invite Member</Button>
      </div>

      {/* Organisation Info */}
      {org && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{org.name}</h3>
                <p className="text-sm text-gray-500">{org.address}, {org.postcode}</p>
              </div>
              <Badge variant="secondary" className="ml-auto capitalize">{org.subscription}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-500">Type</span><p className="font-medium capitalize">{org.type.replace(/_/g, ' ')}</p></div>
              <div><span className="text-gray-500">Members</span><p className="font-medium">{org.memberIds.length}</p></div>
              <div><span className="text-gray-500">Phone</span><p className="font-medium">{org.phone}</p></div>
              <div><span className="text-gray-500">Email</span><p className="font-medium">{org.email}</p></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fleet Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2"><Car className="h-4 w-4" /><span className="text-sm">Vehicles</span></div>
            <div className="text-3xl font-bold text-gray-900">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2"><ScanLine className="h-4 w-4" /><span className="text-sm">Total Scans</span></div>
            <div className="text-3xl font-bold text-gray-900">{totalScans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2"><TrendingUp className="h-4 w-4" /><span className="text-sm">Average Grade</span></div>
            <div className={`text-3xl font-bold ${getGradeColour(avgGrade)}`}>{avgGrade}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2"><Users className="h-4 w-4" /><span className="text-sm">Team Members</span></div>
            <div className="text-3xl font-bold text-gray-900">{org?.memberIds.length || 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Fleet Condition Distribution</h3>
          <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
            {gradeDistribution.excellent > 0 && <div className="bg-teal-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(gradeDistribution.excellent / vehicles.length) * 100}%` }}>{gradeDistribution.excellent}</div>}
            {gradeDistribution.good > 0 && <div className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(gradeDistribution.good / vehicles.length) * 100}%` }}>{gradeDistribution.good}</div>}
            {gradeDistribution.fair > 0 && <div className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(gradeDistribution.fair / vehicles.length) * 100}%` }}>{gradeDistribution.fair}</div>}
            {gradeDistribution.poor > 0 && <div className="bg-red-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(gradeDistribution.poor / vehicles.length) * 100}%` }}>{gradeDistribution.poor}</div>}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-teal-500 inline-block" />Excellent ({gradeDistribution.excellent})</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-blue-500 inline-block" />Good ({gradeDistribution.good})</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-500 inline-block" />Fair ({gradeDistribution.fair})</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-red-500 inline-block" />Poor ({gradeDistribution.poor})</span>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <h3 className="text-lg font-semibold text-gray-900">Fleet Vehicles</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <Link key={v.id} href={`/vehicles/${v.id}`}>
            <Card className="hover:border-teal-200 transition-colors cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-amber-100 text-amber-900 font-mono font-bold text-xs px-2 py-0.5 rounded border border-amber-200">{v.registrationPlate}</span>
                  <Badge className={`${getGradeBgColour(v.currentGrade.score)} ${getGradeColour(v.currentGrade.score)} border text-xs`}>{v.currentGrade.score}</Badge>
                </div>
                <p className="text-sm font-medium text-gray-900">{v.make} {v.model}</p>
                <p className="text-xs text-gray-500">{v.year} &middot; {v.mileage.toLocaleString()} mi &middot; {v.totalScans} scans</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
