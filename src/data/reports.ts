import { Report } from '@/types/report';

export const reports: Report[] = [
  {
    id: 'rpt-001',
    vehicleId: 'veh-001',
    scanIds: ['scan-001-3'],
    type: 'condition_report',
    title: 'MOT Body Condition Report — AB12 CDE',
    generatedBy: 'user-garage-1',
    gradingProfile: 'garage_mot',
    grade: { overall: 82, perPanel: { rear_bumper: 78, front_bumper: 88, front_door_right: 75, bonnet: 82 }, profile: 'garage_mot', label: 'Good' },
    sharedWith: [],
    createdAt: '2026-03-10T15:00:00Z',
  },
  {
    id: 'rpt-002',
    vehicleId: 'veh-004',
    scanIds: ['scan-004-2', 'scan-004-3'],
    type: 'comparison',
    title: 'Pre/Post Incident Comparison — GH78 JKL',
    generatedBy: 'user-garage-1',
    gradingProfile: 'insurance_claim',
    grade: { overall: 38, perPanel: { front_wing_left: 8, front_bumper: 12, front_door_left: 35, mirror_left: 40, bonnet: 45 }, profile: 'insurance_claim', label: 'Poor' },
    sharedWith: [
      { id: 'share-001', reportId: 'rpt-002', sharedWithOrgId: 'org-insurance', accessLevel: 'view', accessUrl: '/shared/rpt-002-abc123', createdAt: '2026-03-06T09:00:00Z' },
    ],
    createdAt: '2026-03-05T17:00:00Z',
  },
  {
    id: 'rpt-003',
    vehicleId: 'veh-022',
    scanIds: ['scan-022-7', 'scan-022-8'],
    type: 'hire_return',
    title: 'Hire Return Report — QH22 CCC (New Damage)',
    generatedBy: 'user-hire-1',
    gradingProfile: 'hire_return',
    grade: { overall: 78, perPanel: { alloy_front_left: 72, rear_bumper: 78, rear_door_right: 70 }, profile: 'hire_return', label: 'Good' },
    sharedWith: [],
    createdAt: '2026-03-13T10:30:00Z',
  },
  {
    id: 'rpt-004',
    vehicleId: 'veh-040',
    scanIds: ['scan-040-2'],
    type: 'condition_report',
    title: 'Pre-Sale Condition Report — PM22 AAA',
    generatedBy: 'user-sales-1',
    gradingProfile: 'private_sale',
    grade: { overall: 86, perPanel: { rear_bumper: 78, bonnet: 92, alloy_rear_right: 72 }, profile: 'private_sale', label: 'Good' },
    sharedWith: [],
    createdAt: '2026-03-10T11:00:00Z',
  },
  {
    id: 'rpt-005',
    vehicleId: 'veh-044',
    scanIds: ['scan-044-1'],
    type: 'provenance',
    title: 'Vehicle Provenance Report — PM24 EEE',
    generatedBy: 'user-sales-1',
    gradingProfile: 'private_sale',
    grade: { overall: 97, perPanel: {}, profile: 'private_sale', label: 'Excellent' },
    sharedWith: [],
    createdAt: '2026-03-14T17:00:00Z',
  },
  {
    id: 'rpt-006',
    vehicleId: 'veh-003',
    scanIds: ['scan-003-5'],
    type: 'mot_advisory',
    title: 'MOT Advisory Report — EF56 GHJ',
    generatedBy: 'user-garage-1',
    gradingProfile: 'garage_mot',
    grade: { overall: 61, perPanel: { front_wing_right: 55, rear_bumper: 65, rear_wing_left: 70, front_door_left: 80, sill_left: 48, windscreen: 72 }, profile: 'garage_mot', label: 'Fair' },
    sharedWith: [],
    createdAt: '2026-03-12T10:00:00Z',
  },
];

export function getReportsByVehicleId(vehicleId: string) {
  return reports.filter(r => r.vehicleId === vehicleId);
}

export function getReportById(id: string) {
  return reports.find(r => r.id === id);
}

export function getReportsByUserId(userId: string) {
  return reports.filter(r => r.generatedBy === userId);
}

export function getSharedReportsForOrg(orgId: string) {
  return reports.filter(r => r.sharedWith.some(s => s.sharedWithOrgId === orgId));
}
