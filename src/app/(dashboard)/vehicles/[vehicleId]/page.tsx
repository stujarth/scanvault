'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVehicleById } from '@/data/vehicles';
import { getScansByVehicleId } from '@/data/scans';
import { getDamageByVehicleId } from '@/data/damage-items';
import { getReportsByVehicleId } from '@/data/reports';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ScanLine, Car, Calendar, Gauge, FileText, Map, Clock } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { BODY_PANEL_LABELS, DAMAGE_TYPE_LABELS, SEVERITY_LABELS, SEVERITY_COLOURS } from '@/lib/constants';
import { format } from 'date-fns';

export default function VehicleDetailPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) notFound();

  const scans = getScansByVehicleId(vehicleId);
  const damages = getDamageByVehicleId(vehicleId);
  const reports = getReportsByVehicleId(vehicleId);

  return (
    <div className="space-y-6">
      <Link href="/vehicles" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Vehicles
      </Link>

      {/* Vehicle Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center">
            <Car className="h-7 w-7 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 text-amber-900 font-mono font-bold text-base px-3 py-1 rounded border border-amber-200">
                {vehicle.registrationPlate}
              </div>
              <Badge className={`${getGradeBgColour(vehicle.currentGrade.score)} ${getGradeColour(vehicle.currentGrade.score)} border`}>
                {vehicle.currentGrade.score} — {vehicle.currentGrade.label}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">{vehicle.year} {vehicle.make} {vehicle.model} &middot; {vehicle.colour} &middot; {vehicle.fuelType}</p>
          </div>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href={`/scan/${vehicleId}`}><ScanLine className="h-4 w-4 mr-2" />Scan Vehicle</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi`, icon: Gauge },
          { label: 'Total Scans', value: vehicle.totalScans, icon: ScanLine },
          { label: 'Damage Items', value: damages.length, icon: Map },
          { label: 'Reports', value: reports.length, icon: FileText },
          { label: 'MOT Expiry', value: format(new Date(vehicle.motExpiry), 'd MMM yyyy'), icon: Calendar },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <stat.icon className="h-3.5 w-3.5" />
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="damage">
        <TabsList>
          <TabsTrigger value="damage">Damage ({damages.length})</TabsTrigger>
          <TabsTrigger value="scans">Scans ({scans.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="damage" className="mt-4">
          <div className="flex gap-3 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/vehicles/${vehicleId}/body-map`}><Map className="h-4 w-4 mr-1" />View Body Map</Link>
            </Button>
          </div>
          {damages.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-500">No damage items recorded</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {damages.map(damage => (
                <Card key={damage.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{DAMAGE_TYPE_LABELS[damage.type] || damage.type}</span>
                          <Badge variant="secondary" className={SEVERITY_COLOURS[damage.severity]}>
                            {SEVERITY_LABELS[damage.severity]}
                          </Badge>
                          {damage.isNew && <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">New</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{damage.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{BODY_PANEL_LABELS[damage.panel] || damage.panel}</p>
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
            </div>
          )}
        </TabsContent>

        <TabsContent value="scans" className="mt-4">
          <div className="space-y-3">
            {scans.map(scan => (
              <Link key={scan.id} href={`/vehicles/${vehicleId}/scans/${scan.id}`}>
                <Card className="hover:border-teal-200 transition-colors cursor-pointer mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ScanLine className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{scan.context}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {format(new Date(scan.createdAt), 'd MMM yyyy, HH:mm')}
                          {scan.location && <><span className="text-gray-300">|</span>{scan.location}</>}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getGradeBgColour(scan.grade.overall)} ${getGradeColour(scan.grade.overall)} border`}>
                      {scan.grade.overall} — {scan.grade.label}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="space-y-3">
            {reports.map(report => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="hover:border-teal-200 transition-colors cursor-pointer mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-500">{format(new Date(report.createdAt), 'd MMM yyyy')} &middot; {report.type.replace(/_/g, ' ')}</p>
                    </div>
                    <Badge className={`${getGradeBgColour(report.grade.overall)} ${getGradeColour(report.grade.overall)} border`}>
                      {report.grade.overall}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
