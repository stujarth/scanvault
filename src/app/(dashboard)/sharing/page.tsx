'use client';

import { useAuth } from '@/providers/auth-provider';
import { getReportsByUserId, getSharedReportsForOrg } from '@/data/reports';
import { getVehicleById } from '@/data/vehicles';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Link2, Eye, Download, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function SharingPage() {
  const { user } = useAuth();
  if (!user) return null;

  const reports = getReportsByUserId(user.id);
  const sharedReports = reports.filter(r => r.sharedWith.length > 0);
  const receivedReports = user.organisationId ? getSharedReportsForOrg(user.organisationId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Data Sharing</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shared by me */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-teal-600" /> Shared by You
          </h3>
          {sharedReports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Share2 className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No reports shared yet</p>
                <p className="text-xs text-gray-400 mt-1">Share reports with insurers, buyers, or partners</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sharedReports.map(report => {
                const vehicle = getVehicleById(report.vehicleId);
                return report.sharedWith.map(share => (
                  <Card key={share.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{report.title}</p>
                        <Badge variant="secondary" className="text-xs capitalize">{share.accessLevel}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{vehicle?.registrationPlate} &middot; {vehicle?.make} {vehicle?.model}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Link2 className="h-3 w-3" />{share.accessUrl}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(share.createdAt), 'd MMM yyyy')}</span>
                        <span className="flex items-center gap-1">
                          {share.accessLevel === 'view' ? <Eye className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                          {share.accessLevel}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">Revoke Access</Button>
                      </div>
                    </CardContent>
                  </Card>
                ));
              })}
            </div>
          )}
        </div>

        {/* Shared with me */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-600" /> Shared with You
          </h3>
          {receivedReports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Shield className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No reports shared with you yet</p>
                <p className="text-xs text-gray-400 mt-1">Reports shared by policyholders or partners will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {receivedReports.map(report => {
                const vehicle = getVehicleById(report.vehicleId);
                return (
                  <Card key={report.id} className="hover:border-indigo-200 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">{report.title}</p>
                      <p className="text-xs text-gray-500">{vehicle?.registrationPlate} &middot; {vehicle?.make} {vehicle?.model}</p>
                      <p className="text-xs text-gray-400 mt-2">{format(new Date(report.createdAt), 'd MMM yyyy')}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
