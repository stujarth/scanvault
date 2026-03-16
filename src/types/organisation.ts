export type OrgType = 'garage' | 'hire_company' | 'insurance' | 'dealership' | 'police' | 'car_park';
export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Organisation {
  id: string;
  name: string;
  type: OrgType;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  logoUrl?: string;
  memberIds: string[];
  vehicleIds: string[];
  defaultGradingProfile: string;
  subscription: SubscriptionTier;
  createdAt: string;
}
