export const APP_NAME = 'ScanVault';
export const APP_TAGLINE = 'Every mark tells a story. We keep the record.';
export const APP_DESCRIPTION = 'AI-powered vehicle body condition scanning that builds a complete damage history. Trusted by garages, hire companies, insurers, and dealerships.';

export const BODY_PANEL_LABELS: Record<string, string> = {
  front_bumper: 'Front Bumper',
  rear_bumper: 'Rear Bumper',
  bonnet: 'Bonnet',
  boot: 'Boot',
  roof: 'Roof',
  front_wing_left: 'Front Wing (L)',
  front_wing_right: 'Front Wing (R)',
  rear_wing_left: 'Rear Wing (L)',
  rear_wing_right: 'Rear Wing (R)',
  front_door_left: 'Front Door (L)',
  front_door_right: 'Front Door (R)',
  rear_door_left: 'Rear Door (L)',
  rear_door_right: 'Rear Door (R)',
  sill_left: 'Sill (L)',
  sill_right: 'Sill (R)',
  mirror_left: 'Wing Mirror (L)',
  mirror_right: 'Wing Mirror (R)',
  windscreen: 'Windscreen',
  rear_window: 'Rear Window',
  alloy_front_left: 'Alloy FL',
  alloy_front_right: 'Alloy FR',
  alloy_rear_left: 'Alloy RL',
  alloy_rear_right: 'Alloy RR',
  undercarriage_front: 'Undercarriage (Front)',
  undercarriage_mid: 'Undercarriage (Mid)',
  undercarriage_rear: 'Undercarriage (Rear)',
};

export const DAMAGE_TYPE_LABELS: Record<string, string> = {
  scratch: 'Scratch',
  scuff: 'Scuff',
  dent: 'Dent',
  chip: 'Chip',
  crack: 'Crack',
  rust: 'Rust',
  paint_peel: 'Paint Peel',
  corrosion: 'Corrosion',
  structural: 'Structural',
};

export const SEVERITY_LABELS: Record<string, string> = {
  negligible: 'Negligible',
  minor: 'Minor',
  moderate: 'Moderate',
  significant: 'Significant',
  severe: 'Severe',
};

export const SEVERITY_COLOURS: Record<string, string> = {
  negligible: 'bg-gray-100 text-gray-700',
  minor: 'bg-blue-100 text-blue-700',
  moderate: 'bg-amber-100 text-amber-700',
  significant: 'bg-orange-100 text-orange-700',
  severe: 'bg-red-100 text-red-700',
};
