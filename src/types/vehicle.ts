export type VehicleType = 'saloon' | 'hatchback' | 'suv' | 'estate' | 'van' | 'pickup' | 'coupe' | 'convertible';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plug_in_hybrid';

export interface Vehicle {
  id: string;
  registrationPlate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  mileage: number;
  motExpiry: string;
  organisationId?: string;
  ownerId: string;
  currentGrade: OverallGrade;
  lastScanDate?: string;
  totalScans: number;
  imageUrl?: string;
  createdAt: string;
}

export interface OverallGrade {
  score: number;
  label: string;
  profileId: string;
}
