'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReportById } from '@/data/reports';
import { getVehicleById } from '@/data/vehicles';
import { getScanById } from '@/data/scans';
import { getDamageByScanId } from '@/data/damage-items';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Share2, Shield, Printer } from 'lucide-react';
import { getGradeColour, getGradeBgColour } from '@/lib/grading';
import { BODY_PANEL_LABELS, DAMAGE_TYPE_LABELS, SEVERITY_LABELS, SEVERITY_COLOURS } from '@/lib/constants';
import { format } from 'date-fns';

export default function ReportViewerPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const report = getReportById(reportId);
  if (!report) notFound();

  const vehicle = getVehicleById(report.vehicleId);
  if (!vehicle) notFound();

  const allDamages = report.scanIds.flatMap(id => getDamageByScanId(id));
  const totalRepairCost = allDamages.reduce((sum, d) => sum + (d.repairEstimate?.costGbp || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/reports" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Reports
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />Share
          </Button>
        </div>
      </div>

      {/* Report Document */}
      <Card className="print:shadow-none print:border-0">
        <CardContent className="p-8 print:p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ScanVault</h1>
                <p className="text-xs text-gray-500">Vehicle Condition Report</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Report #{report.id.toUpperCase()}</p>
              <p>{format(new Date(report.createdAt), 'd MMMM yyyy')}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <h2 className="text-2xl font-bold text-gray-900 mb-4">{report.title}</h2>

          {/* Vehicle Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-xs text-gray-500">Registration</span>
              <p className="font-mono font-bold text-gray-900">{vehicle.registrationPlate}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Vehicle</span>
              <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">VIN</span>
              <p className="font-mono text-xs text-gray-900">{vehicle.vin}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Mileage</span>
              <p className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} miles</p>
            </div>
          </div>

          {/* Grade */}
          <div className="flex items-center justify-center gap-6 mb-8 p-6 rounded-xl border">
            <div className={`h-24 w-24 rounded-2xl flex items-center justify-center border-2 ${getGradeBgColour(report.grade.overall)}`}>
              <span className={`text-4xl font-bold ${getGradeColour(report.grade.overall)}`}>{report.grade.overall}</span>
            </div>
            <div>
              <Badge className={`${getGradeBgColour(report.grade.overall)} ${getGradeColour(report.grade.overall)} border text-lg px-4 py-2`}>
                {report.grade.label}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">Grading Profile: {report.gradingProfile.replace(/_/g, ' ')}</p>
            </div>
          </div>

          {/* Per-panel grades */}
          {Object.keys(report.grade.perPanel).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Panel Grades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(report.grade.perPanel).map(([panel, score]) => (
                  <div key={panel} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-gray-700">{BODY_PANEL_LABELS[panel] || panel}</span>
                    <Badge className={`${getGradeBgColour(score as number)} ${getGradeColour(score as number)} border text-xs`}>
                      {score as number}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Damage Table */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Damage Items ({allDamages.length})</h3>
          {allDamages.length > 0 ? (
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Panel</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Severity</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Description</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allDamages.map(d => (
                    <tr key={d.id} className={d.isNew ? 'bg-red-50/30' : ''}>
                      <td className="px-4 py-3 font-medium">
                        {DAMAGE_TYPE_LABELS[d.type]}
                        {d.isNew && <Badge className="ml-2 bg-red-50 text-red-700 border-red-200 text-[10px]">New</Badge>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{BODY_PANEL_LABELS[d.panel]}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={`${SEVERITY_COLOURS[d.severity]} text-xs`}>{SEVERITY_LABELS[d.severity]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{d.description}</td>
                      <td className="px-4 py-3 text-right font-medium">{d.repairEstimate ? `£${d.repairEstimate.costGbp}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 font-semibold text-gray-900">Total Estimated Repair Cost</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">&pound;{totalRepairCost.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-6">No damage items recorded.</p>
          )}

          {/* Footer */}
          <Separator className="mb-4" />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <p>Generated by ScanVault &middot; {format(new Date(report.createdAt), 'd MMMM yyyy, HH:mm')}</p>
            <p>This report is a digital document. Verify at scanvault.co.uk/verify/{report.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
