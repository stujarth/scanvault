import { ScanGrade } from './scan';

export type ReportType = 'condition_report' | 'hire_checkout' | 'hire_return' | 'mot_advisory' | 'insurance_assessment' | 'comparison' | 'provenance';

export interface Report {
  id: string;
  vehicleId: string;
  scanIds: string[];
  type: ReportType;
  title: string;
  generatedBy: string;
  gradingProfile: string;
  grade: ScanGrade;
  sharedWith: ShareRecord[];
  createdAt: string;
}

export interface ShareRecord {
  id: string;
  reportId: string;
  sharedWithEmail?: string;
  sharedWithOrgId?: string;
  accessLevel: 'view' | 'download';
  expiresAt?: string;
  accessUrl: string;
  createdAt: string;
}
