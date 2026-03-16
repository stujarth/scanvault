'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVehicleById } from '@/data/vehicles';
import { getReportsByVehicleId } from '@/data/reports';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { format } from 'date-fns';

export default function VehicleReportsPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) notFound();

  const reports = getReportsByVehicleId(vehicleId);

  return (
    <div className="space-y-6">
      <Link href={`/vehicles/${vehicleId}`} className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to {vehicle.registrationPlate}
      </Link>
      <h2 className="text-2xl font-bold text-gray-900">Reports — {vehicle.make} {vehicle.model}</h2>
      <div className="space-y-3">
        {reports.map(report => (
          <Link key={report.id} href={`/reports/${report.id}`}>
            <Card className="hover:border-teal-200 transition-colors cursor-pointer mb-3">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500">{format(new Date(report.createdAt), 'd MMM yyyy')} &middot; {report.type.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <Badge className={`${getGradeBgColour(report.grade.overall)} ${getGradeColour(report.grade.overall)} border`}>
                  {report.grade.overall} — {report.grade.label}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {reports.length === 0 && (
          <Card><CardContent className="p-8 text-center text-gray-500">No reports generated for this vehicle yet</CardContent></Card>
        )}
      </div>
    </div>
  );
}
