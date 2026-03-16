import { User, DemoAccount } from '@/types/user';

export const demoAccounts: DemoAccount[] = [
  {
    id: 'demo-garage',
    label: 'Demo Garage',
    description: 'ABC Motors — 12 vehicles, before/after service scans, MOT body checks',
    role: 'garage',
    credentials: { email: 'demo@abcmotors.scanvault.co.uk', password: 'demo' },
  },
  {
    id: 'demo-hire',
    label: 'Demo Hire Company',
    description: 'QuickHire Ltd — 20 vehicles, checkout/return scans, damage disputes',
    role: 'hire_company',
    credentials: { email: 'demo@quickhire.scanvault.co.uk', password: 'demo' },
  },
  {
    id: 'demo-insurance',
    label: 'Demo Insurance',
    description: 'SureCover Insurance — Policyholder reports, claims assessment',
    role: 'insurance',
    credentials: { email: 'demo@surecover.scanvault.co.uk', password: 'demo' },
  },
  {
    id: 'demo-sales',
    label: 'Demo Car Sales',
    description: 'Prestige Motors — 15 vehicles, provenance reports, buyer confidence',
    role: 'dealership',
    credentials: { email: 'demo@prestige.scanvault.co.uk', password: 'demo' },
  },
];

export const users: User[] = [
  {
    id: 'user-garage-1',
    email: 'demo@abcmotors.scanvault.co.uk',
    name: 'Mike Thompson',
    role: 'garage',
    organisationId: 'org-garage',
    isDemo: true,
    createdAt: '2025-06-01T09:00:00Z',
  },
  {
    id: 'user-hire-1',
    email: 'demo@quickhire.scanvault.co.uk',
    name: 'Sarah Chen',
    role: 'hire_company',
    organisationId: 'org-hire',
    isDemo: true,
    createdAt: '2025-05-15T09:00:00Z',
  },
  {
    id: 'user-insurance-1',
    email: 'demo@surecover.scanvault.co.uk',
    name: 'James Wright',
    role: 'insurance',
    organisationId: 'org-insurance',
    isDemo: true,
    createdAt: '2025-07-01T09:00:00Z',
  },
  {
    id: 'user-sales-1',
    email: 'demo@prestige.scanvault.co.uk',
    name: 'Emma Davis',
    role: 'dealership',
    organisationId: 'org-sales',
    isDemo: true,
    createdAt: '2025-04-01T09:00:00Z',
  },
];

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}
