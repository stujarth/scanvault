'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getReportsByUserId, getSharedReportsForOrg, getVehicleById } from '@/lib/dal';
import { Report } from '@/types/report';
import { Vehicle } from '@/types/vehicle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Loader2 } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { format } from 'date-fns';

export default function ReportsPage() {
  const { user } = useAuth();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [ownReportIds, setOwnReportIds] = useState<Set<string>>(new Set());
  const [vehicleMap, setVehicleMap] = useState<Record<string, Vehicle>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const [own, shared] = await Promise.all([
        getReportsByUserId(user!.id),
        user!.organisationId ? getSharedReportsForOrg(user!.organisationId) : Promise.resolve([]),
      ]);
      if (cancelled) return;

      const ownIds = new Set(own.map(r => r.id));
      const merged = [...own, ...shared.filter(r => !ownIds.has(r.id))];
      setOwnReportIds(ownIds);
      setAllReports(merged);

      const vehicleIds = [...new Set(merged.map(r => r.vehicleId))];
      const vehicles = await Promise.all(vehicleIds.map(id => getVehicleById(id)));
      if (!cancelled) {
        const map: Record<string, Vehicle> = {};
        vehicles.forEach(v => { if (v) map[v.id] = v; });
        setVehicleMap(map);
        setLoading(false);
      }
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>

      {allReports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No reports yet</h3>
            <p className="text-sm text-gray-500">Reports are generated after vehicle scans.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allReports.map(report => {
            const vehicle = vehicleMap[report.vehicleId];
            const isShared = !ownReportIds.has(report.id);
            return (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="hover:border-teal-200 transition-colors cursor-pointer mb-3">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{report.title}</p>
                          {isShared && <Badge variant="secondary" className="text-xs">Shared</Badge>}
                        </div>
                        <p className="text-xs text-gray-500">
                          {vehicle?.registrationPlate} &middot; {format(new Date(report.createdAt), 'd MMM yyyy')} &middot; {report.type.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getGradeBgColour(report.grade.overall)} ${getGradeColour(report.grade.overall)} border`}>
                      {report.grade.overall} — {report.grade.label}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
