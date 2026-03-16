import { Organisation } from '@/types/organisation';

export const organisations: Organisation[] = [
  {
    id: 'org-garage',
    name: 'ABC Motors',
    type: 'garage',
    address: '42 High Street, Bromley',
    postcode: 'BR1 1EG',
    phone: '020 8460 1234',
    email: 'info@abcmotors.co.uk',
    memberIds: ['user-garage-1'],
    vehicleIds: ['veh-001', 'veh-002', 'veh-003', 'veh-004', 'veh-005', 'veh-006', 'veh-007', 'veh-008', 'veh-009', 'veh-010', 'veh-011', 'veh-012'],
    defaultGradingProfile: 'garage_mot',
    subscription: 'professional',
    createdAt: '2025-06-01T09:00:00Z',
  },
  {
    id: 'org-hire',
    name: 'QuickHire Ltd',
    type: 'hire_company',
    address: '15 Station Road, Croydon',
    postcode: 'CR0 2RD',
    phone: '020 8680 5678',
    email: 'bookings@quickhire.co.uk',
    memberIds: ['user-hire-1'],
    vehicleIds: ['veh-020', 'veh-021', 'veh-022', 'veh-023', 'veh-024', 'veh-025', 'veh-026', 'veh-027', 'veh-028', 'veh-029', 'veh-030', 'veh-031', 'veh-032', 'veh-033', 'veh-034', 'veh-035', 'veh-036', 'veh-037', 'veh-038', 'veh-039'],
    defaultGradingProfile: 'hire_checkout',
    subscription: 'professional',
    createdAt: '2025-05-15T09:00:00Z',
  },
  {
    id: 'org-insurance',
    name: 'SureCover Insurance',
    type: 'insurance',
    address: '100 Fenchurch Street, London',
    postcode: 'EC3M 5JD',
    phone: '020 7626 9999',
    email: 'claims@surecover.co.uk',
    memberIds: ['user-insurance-1'],
    vehicleIds: [],
    defaultGradingProfile: 'insurance_claim',
    subscription: 'enterprise',
    createdAt: '2025-07-01T09:00:00Z',
  },
  {
    id: 'org-sales',
    name: 'Prestige Motors',
    type: 'dealership',
    address: '8 London Road, Sevenoaks',
    postcode: 'TN13 1AJ',
    phone: '01732 456789',
    email: 'sales@prestigemotors.co.uk',
    memberIds: ['user-sales-1'],
    vehicleIds: ['veh-040', 'veh-041', 'veh-042', 'veh-043', 'veh-044', 'veh-045', 'veh-046', 'veh-047', 'veh-048', 'veh-049', 'veh-050', 'veh-051', 'veh-052', 'veh-053', 'veh-054'],
    defaultGradingProfile: 'private_sale',
    subscription: 'professional',
    createdAt: '2025-04-01T09:00:00Z',
  },
];

export function getOrgById(id: string) {
  return organisations.find(o => o.id === id);
}
