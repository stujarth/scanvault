'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getVehiclesByOwnerId, getRecentScans, getReportsByUserId } from '@/lib/dal';
import { Vehicle } from '@/types/vehicle';
import { Scan } from '@/types/scan';
import { Report } from '@/types/report';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Car, ScanLine, FileText, AlertTriangle, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const [v, s, r] = await Promise.all([
        getVehiclesByOwnerId(user!.id),
        getRecentScans(user!.id, 5),
        getReportsByUserId(user!.id),
      ]);
      if (cancelled) return;
      setVehicles(v);
      setRecentScans(s);
      setReports(r);
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

  const avgGrade = vehicles.length > 0
    ? Math.round(vehicles.reduce((sum, v) => sum + v.currentGrade.score, 0) / vehicles.length)
    : 0;

  const alertCount = vehicles.filter(v => v.currentGrade.score < 55).length;

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length, icon: Car, colour: 'text-teal-600 bg-teal-50' },
    { label: 'Scans This Month', value: recentScans.length, icon: ScanLine, colour: 'text-blue-600 bg-blue-50' },
    { label: 'Average Grade', value: avgGrade, icon: FileText, colour: `${getGradeColour(avgGrade)} ${getGradeBgColour(avgGrade).split(' ')[0]}` },
    { label: 'Attention Needed', value: alertCount, icon: AlertTriangle, colour: alertCount > 0 ? 'text-orange-600 bg-orange-50' : 'text-gray-400 bg-gray-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}</h2>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s your fleet overview</p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/scan"><ScanLine className="h-4 w-4 mr-2" />New Scan</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.colour}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Scans */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Scans</h3>
                <Link href="/vehicles" className="text-sm text-teal-600 hover:underline flex items-center">
                  View all <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
              {recentScans.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">No scans yet. Start by scanning a vehicle.</p>
              ) : (
                <div className="space-y-3">
                  {recentScans.map(scan => {
                    const vehicle = vehicles.find(v => v.id === scan.vehicleId);
                    return (
                      <Link key={scan.id} href={vehicle ? `/vehicles/${vehicle.id}/scans` : '#'} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Car className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {vehicle?.registrationPlate || 'Unknown'} — {vehicle?.make} {vehicle?.model}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {format(new Date(scan.createdAt), 'd MMM yyyy, HH:mm')}
                              <span className="text-gray-300">|</span>
                              {scan.context}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getGradeBgColour(scan.grade.overall)} ${getGradeColour(scan.grade.overall)} border`}>
                          {scan.grade.overall} — {scan.grade.label}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Fleet Health</h3>
              <div className="space-y-3">
                {['Excellent', 'Good', 'Fair', 'Poor'].map(label => {
                  const count = vehicles.filter(v => v.currentGrade.label === label).length;
                  const pct = vehicles.length > 0 ? (count / vehicles.length) * 100 : 0;
                  const colours: Record<string, string> = {
                    Excellent: 'bg-teal-500',
                    Good: 'bg-blue-500',
                    Fair: 'bg-amber-500',
                    Poor: 'bg-orange-500',
                  };
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className={`h-2 rounded-full ${colours[label]}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Reports</h3>
              {reports.slice(0, 3).map(report => (
                <Link key={report.id} href={`/reports/${report.id}`} className="block py-2 border-b last:border-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                  <p className="text-xs text-gray-500">{format(new Date(report.createdAt), 'd MMM yyyy')}</p>
                </Link>
              ))}
              {reports.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No reports yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
