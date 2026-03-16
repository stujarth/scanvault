import { DamageItem, BodyPanel } from './damage';

export type ScanType = 'exterior_full' | 'exterior_partial' | 'undercarriage' | 'interior';
export type ScanStatus = 'in_progress' | 'processing' | 'complete' | 'failed';

export interface Scan {
  id: string;
  vehicleId: string;
  performedBy: string;
  type: ScanType;
  status: ScanStatus;
  context: string;
  mileageAtScan: number;
  location?: string;
  notes?: string;
  damageItems: DamageItem[];
  grade: ScanGrade;
  weatherConditions?: string;
  duration: number;
  imageCount: number;
  createdAt: string;
}

export interface ScanGrade {
  overall: number;
  perPanel: Partial<Record<BodyPanel, number>>;
  profile: string;
  label: string;
}
