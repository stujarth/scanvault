import { Scan } from '@/types/scan';

export const scans: Scan[] = [
  // veh-001 Ford Focus scans
  { id: 'scan-001-1', vehicleId: 'veh-001', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'MOT preparation', mileageAtScan: 28100, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 90, perPanel: { rear_bumper: 78, front_bumper: 95, bonnet: 95 }, profile: 'garage_mot', label: 'Excellent' }, weatherConditions: 'Dry, overcast', duration: 420, imageCount: 48, createdAt: '2025-11-15T14:30:00Z' },
  { id: 'scan-001-2', vehicleId: 'veh-001', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'Service check-in', mileageAtScan: 31200, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 85, perPanel: { rear_bumper: 78, front_bumper: 88, front_door_right: 75, bonnet: 95 }, profile: 'garage_mot', label: 'Good' }, weatherConditions: 'Dry, sunny', duration: 380, imageCount: 48, createdAt: '2025-12-20T10:00:00Z' },
  { id: 'scan-001-3', vehicleId: 'veh-001', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'Annual MOT', mileageAtScan: 34200, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 82, perPanel: { rear_bumper: 78, front_bumper: 88, front_door_right: 75, bonnet: 82 }, profile: 'garage_mot', label: 'Good' }, weatherConditions: 'Light rain', duration: 450, imageCount: 52, createdAt: '2026-03-10T14:30:00Z' },

  // veh-003 Transit Custom scans
  { id: 'scan-003-1', vehicleId: 'veh-003', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'Initial assessment', mileageAtScan: 58200, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 72, perPanel: { front_wing_right: 55, rear_bumper: 65, rear_wing_left: 85 }, profile: 'garage_mot', label: 'Fair' }, duration: 520, imageCount: 56, createdAt: '2025-07-01T09:00:00Z' },
  { id: 'scan-003-5', vehicleId: 'veh-003', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'MOT preparation', mileageAtScan: 78400, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 61, perPanel: { front_wing_right: 55, rear_bumper: 65, rear_wing_left: 70, front_door_left: 80, sill_left: 48, windscreen: 72 }, profile: 'garage_mot', label: 'Fair' }, weatherConditions: 'Dry', duration: 480, imageCount: 52, createdAt: '2026-03-12T09:00:00Z' },

  // veh-004 BMW 3 Series scans (before and after incident)
  { id: 'scan-004-1', vehicleId: 'veh-004', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'Service check-in', mileageAtScan: 38000, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 88, perPanel: {}, profile: 'garage_mot', label: 'Good' }, duration: 400, imageCount: 48, createdAt: '2025-10-01T10:00:00Z' },
  { id: 'scan-004-2', vehicleId: 'veh-004', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'Service completion', mileageAtScan: 38050, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 88, perPanel: {}, profile: 'garage_mot', label: 'Good' }, duration: 380, imageCount: 48, createdAt: '2025-10-03T16:00:00Z' },
  { id: 'scan-004-3', vehicleId: 'veh-004', performedBy: 'user-garage-1', type: 'exterior_full', status: 'complete', context: 'Post-incident assessment', mileageAtScan: 45000, location: 'ABC Motors, Bromley', damageItems: [], grade: { overall: 38, perPanel: { front_wing_left: 8, front_bumper: 12, front_door_left: 35, mirror_left: 40, bonnet: 45 }, profile: 'garage_mot', label: 'Poor' }, weatherConditions: 'Dry', duration: 620, imageCount: 72, createdAt: '2026-03-05T16:00:00Z' },

  // veh-022 Audi A3 hire car scans (checkout/return pairs)
  { id: 'scan-022-7', vehicleId: 'veh-022', performedBy: 'user-hire-1', type: 'exterior_full', status: 'complete', context: 'Hire checkout', mileageAtScan: 17800, location: 'QuickHire, Croydon', damageItems: [], grade: { overall: 82, perPanel: { alloy_front_left: 72, rear_bumper: 78 }, profile: 'hire_checkout', label: 'Good' }, duration: 300, imageCount: 36, createdAt: '2026-03-01T09:00:00Z' },
  { id: 'scan-022-8', vehicleId: 'veh-022', performedBy: 'user-hire-1', type: 'exterior_full', status: 'complete', context: 'Hire return — new damage detected', mileageAtScan: 18400, location: 'QuickHire, Croydon', damageItems: [], grade: { overall: 78, perPanel: { alloy_front_left: 72, rear_bumper: 78, rear_door_right: 70 }, profile: 'hire_return', label: 'Good' }, weatherConditions: 'Wet', duration: 340, imageCount: 42, createdAt: '2026-03-13T10:00:00Z' },

  // veh-020 VW Polo hire car
  { id: 'scan-020-1', vehicleId: 'veh-020', performedBy: 'user-hire-1', type: 'exterior_full', status: 'complete', context: 'Hire checkout', mileageAtScan: 7900, location: 'QuickHire, Croydon', damageItems: [], grade: { overall: 96, perPanel: {}, profile: 'hire_checkout', label: 'Excellent' }, duration: 280, imageCount: 36, createdAt: '2026-03-10T08:00:00Z' },
  { id: 'scan-020-2', vehicleId: 'veh-020', performedBy: 'user-hire-1', type: 'exterior_full', status: 'complete', context: 'Hire return — no new damage', mileageAtScan: 8200, location: 'QuickHire, Croydon', damageItems: [], grade: { overall: 94, perPanel: {}, profile: 'hire_return', label: 'Excellent' }, duration: 290, imageCount: 36, createdAt: '2026-03-15T08:00:00Z' },

  // veh-040 BMW 5 Series dealership
  { id: 'scan-040-1', vehicleId: 'veh-040', performedBy: 'user-sales-1', type: 'exterior_full', status: 'complete', context: 'Intake assessment', mileageAtScan: 33800, location: 'Prestige Motors, Sevenoaks', damageItems: [], grade: { overall: 88, perPanel: { rear_bumper: 78, bonnet: 92 }, profile: 'private_sale', label: 'Good' }, duration: 440, imageCount: 52, createdAt: '2026-02-01T10:00:00Z' },
  { id: 'scan-040-2', vehicleId: 'veh-040', performedBy: 'user-sales-1', type: 'exterior_full', status: 'complete', context: 'Pre-sale listing scan', mileageAtScan: 35200, location: 'Prestige Motors, Sevenoaks', damageItems: [], grade: { overall: 86, perPanel: { rear_bumper: 78, bonnet: 92, alloy_rear_right: 72 }, profile: 'private_sale', label: 'Good' }, weatherConditions: 'Dry, sunny', duration: 460, imageCount: 56, createdAt: '2026-03-10T10:00:00Z' },

  // veh-044 Tesla Model Y (near perfect)
  { id: 'scan-044-1', vehicleId: 'veh-044', performedBy: 'user-sales-1', type: 'exterior_full', status: 'complete', context: 'Intake assessment — nearly new', mileageAtScan: 8900, location: 'Prestige Motors, Sevenoaks', damageItems: [], grade: { overall: 97, perPanel: {}, profile: 'private_sale', label: 'Excellent' }, weatherConditions: 'Dry', duration: 380, imageCount: 48, createdAt: '2026-03-14T16:00:00Z' },
];

export function getScansByVehicleId(vehicleId: string) {
  return scans.filter(s => s.vehicleId === vehicleId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getScanById(id: string) {
  return scans.find(s => s.id === id);
}

export function getRecentScans(userId: string, limit = 10) {
  return scans
    .filter(s => s.performedBy === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
