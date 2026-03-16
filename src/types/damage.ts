export type DamageType = 'scratch' | 'scuff' | 'dent' | 'chip' | 'crack' | 'rust' | 'paint_peel' | 'corrosion' | 'structural';
export type DamageSeverity = 'negligible' | 'minor' | 'moderate' | 'significant' | 'severe';

export type BodyPanel =
  | 'front_bumper' | 'rear_bumper'
  | 'bonnet' | 'boot'
  | 'roof'
  | 'front_wing_left' | 'front_wing_right'
  | 'rear_wing_left' | 'rear_wing_right'
  | 'front_door_left' | 'front_door_right'
  | 'rear_door_left' | 'rear_door_right'
  | 'sill_left' | 'sill_right'
  | 'mirror_left' | 'mirror_right'
  | 'windscreen' | 'rear_window'
  | 'alloy_front_left' | 'alloy_front_right'
  | 'alloy_rear_left' | 'alloy_rear_right'
  | 'undercarriage_front' | 'undercarriage_mid' | 'undercarriage_rear';

export interface DamageItem {
  id: string;
  scanId: string;
  vehicleId: string;
  type: DamageType;
  severity: DamageSeverity;
  panel: BodyPanel;
  description: string;
  dimensions?: {
    lengthMm: number;
    widthMm?: number;
    depthMm?: number;
  };
  position: {
    x: number;
    y: number;
  };
  repairEstimate?: {
    costGbp: number;
    method: string;
  };
  isNew: boolean;
  firstDetectedScanId: string;
  createdAt: string;
}
