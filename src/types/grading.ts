import { UserRole } from './user';
import { DamageType, DamageSeverity, BodyPanel } from './damage';

export type GradingProfileId = 'hire_return' | 'hire_checkout' | 'private_sale' | 'trade_sale' | 'garage_mot' | 'insurance_claim' | 'police_evidence' | 'car_park_entry';

export interface GradingProfile {
  id: GradingProfileId;
  name: string;
  description: string;
  applicableRoles: UserRole[];
  thresholds: GradingThreshold[];
  damageTypeWeights: Record<DamageType, number>;
  severityMultipliers: Record<DamageSeverity, number>;
  ignoreRules: IgnoreRule[];
}

export interface GradingThreshold {
  minScore: number;
  maxScore: number;
  label: string;
  colour: string;
  description: string;
}

export interface IgnoreRule {
  damageType: DamageType;
  maxSeverity: DamageSeverity;
  maxDimensionMm?: number;
  description: string;
}
