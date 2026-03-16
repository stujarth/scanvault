export type UserRole = 'individual' | 'garage' | 'hire_company' | 'insurance' | 'dealership' | 'police' | 'car_park' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organisationId?: string;
  avatarUrl?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface DemoAccount {
  id: string;
  label: string;
  description: string;
  role: UserRole;
  credentials: {
    email: string;
    password: string;
  };
}
