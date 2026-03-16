import { GradingProfile } from '@/types/grading';

export const gradingProfiles: GradingProfile[] = [
  {
    id: 'hire_checkout',
    name: 'Hire Checkout',
    description: 'Baseline scan when customer collects vehicle. Medium tolerance for existing wear.',
    applicableRoles: ['hire_company'],
    thresholds: [
      { minScore: 90, maxScore: 100, label: 'Excellent', colour: 'text-teal-600 bg-teal-50', description: 'Minimal or no visible damage' },
      { minScore: 75, maxScore: 89, label: 'Good', colour: 'text-blue-600 bg-blue-50', description: 'Light wear consistent with age and mileage' },
      { minScore: 55, maxScore: 74, label: 'Fair', colour: 'text-amber-600 bg-amber-50', description: 'Noticeable wear but within acceptable limits' },
      { minScore: 30, maxScore: 54, label: 'Poor', colour: 'text-orange-600 bg-orange-50', description: 'Significant damage requiring attention' },
      { minScore: 0, maxScore: 29, label: 'Fail', colour: 'text-red-600 bg-red-50', description: 'Not suitable for hire in current condition' },
    ],
    damageTypeWeights: { scratch: 1.0, scuff: 0.6, dent: 1.2, chip: 0.4, crack: 1.8, rust: 1.5, paint_peel: 1.3, corrosion: 2.0, structural: 2.5 },
    severityMultipliers: { negligible: 1, minor: 3, moderate: 8, significant: 15, severe: 25 },
    ignoreRules: [
      { damageType: 'scratch', maxSeverity: 'negligible', maxDimensionMm: 25, description: 'Scratches under 25mm are fair wear and tear' },
      { damageType: 'chip', maxSeverity: 'negligible', maxDimensionMm: 3, description: 'Tiny stone chips are expected' },
    ],
  },
  {
    id: 'hire_return',
    name: 'Hire Return',
    description: 'Strict comparison against checkout scan. All new damage flagged.',
    applicableRoles: ['hire_company'],
    thresholds: [
      { minScore: 90, maxScore: 100, label: 'Excellent', colour: 'text-teal-600 bg-teal-50', description: 'Returned in same condition as checkout' },
      { minScore: 75, maxScore: 89, label: 'Good', colour: 'text-blue-600 bg-blue-50', description: 'Minor new marks within fair usage' },
      { minScore: 55, maxScore: 74, label: 'Fair', colour: 'text-amber-600 bg-amber-50', description: 'New damage detected — review required' },
      { minScore: 30, maxScore: 54, label: 'Poor', colour: 'text-orange-600 bg-orange-50', description: 'Significant new damage — customer liable' },
      { minScore: 0, maxScore: 29, label: 'Fail', colour: 'text-red-600 bg-red-50', description: 'Major damage — incident report required' },
    ],
    damageTypeWeights: { scratch: 1.2, scuff: 0.8, dent: 1.5, chip: 0.6, crack: 2.0, rust: 1.0, paint_peel: 1.5, corrosion: 1.5, structural: 3.0 },
    severityMultipliers: { negligible: 1, minor: 3, moderate: 8, significant: 15, severe: 25 },
    ignoreRules: [],
  },
  {
    id: 'private_sale',
    name: 'Private Sale',
    description: 'Consumer-friendly grading for used car listings. Cosmetic focus.',
    applicableRoles: ['individual', 'dealership'],
    thresholds: [
      { minScore: 90, maxScore: 100, label: 'Excellent', colour: 'text-teal-600 bg-teal-50', description: 'Showroom condition — exceptional for age' },
      { minScore: 75, maxScore: 89, label: 'Good', colour: 'text-blue-600 bg-blue-50', description: 'Well-presented with minimal cosmetic marks' },
      { minScore: 55, maxScore: 74, label: 'Fair', colour: 'text-amber-600 bg-amber-50', description: 'Visible wear — priced to reflect condition' },
      { minScore: 30, maxScore: 54, label: 'Poor', colour: 'text-orange-600 bg-orange-50', description: 'Notable cosmetic issues — full disclosure' },
      { minScore: 0, maxScore: 29, label: 'Fail', colour: 'text-red-600 bg-red-50', description: 'Major body damage — trade sale only' },
    ],
    damageTypeWeights: { scratch: 1.0, scuff: 0.7, dent: 1.3, chip: 0.5, crack: 1.5, rust: 1.8, paint_peel: 1.4, corrosion: 2.0, structural: 2.5 },
    severityMultipliers: { negligible: 1, minor: 3, moderate: 8, significant: 15, severe: 25 },
    ignoreRules: [
      { damageType: 'chip', maxSeverity: 'negligible', maxDimensionMm: 3, description: 'Tiny stone chips are normal wear' },
    ],
  },
  {
    id: 'garage_mot',
    name: 'Garage / MOT',
    description: 'Only flags MOT-relevant body issues — structural integrity, corrosion, windscreen.',
    applicableRoles: ['garage'],
    thresholds: [
      { minScore: 80, maxScore: 100, label: 'Pass', colour: 'text-teal-600 bg-teal-50', description: 'No MOT-relevant body defects' },
      { minScore: 50, maxScore: 79, label: 'Advisory', colour: 'text-amber-600 bg-amber-50', description: 'Advisory items noted — monitor at next test' },
      { minScore: 0, maxScore: 49, label: 'Fail', colour: 'text-red-600 bg-red-50', description: 'MOT-relevant defects requiring repair' },
    ],
    damageTypeWeights: { scratch: 0.2, scuff: 0.1, dent: 0.3, chip: 0.3, crack: 1.5, rust: 2.0, paint_peel: 0.5, corrosion: 2.5, structural: 3.0 },
    severityMultipliers: { negligible: 1, minor: 3, moderate: 8, significant: 15, severe: 25 },
    ignoreRules: [
      { damageType: 'scratch', maxSeverity: 'moderate', description: 'Cosmetic scratches are not MOT-relevant' },
      { damageType: 'scuff', maxSeverity: 'moderate', description: 'Scuff marks are not MOT-relevant' },
      { damageType: 'dent', maxSeverity: 'minor', description: 'Small dents without sharp edges are not MOT-relevant' },
    ],
  },
  {
    id: 'insurance_claim',
    name: 'Insurance Claim',
    description: 'Every item documented with cost estimates. Evidence-grade detail.',
    applicableRoles: ['insurance', 'garage'],
    thresholds: [
      { minScore: 90, maxScore: 100, label: 'Excellent', colour: 'text-teal-600 bg-teal-50', description: 'No significant damage documented' },
      { minScore: 75, maxScore: 89, label: 'Good', colour: 'text-blue-600 bg-blue-50', description: 'Minor pre-existing damage documented' },
      { minScore: 55, maxScore: 74, label: 'Fair', colour: 'text-amber-600 bg-amber-50', description: 'Moderate pre-existing damage' },
      { minScore: 30, maxScore: 54, label: 'Poor', colour: 'text-orange-600 bg-orange-50', description: 'Significant damage — multiple items' },
      { minScore: 0, maxScore: 29, label: 'Severe', colour: 'text-red-600 bg-red-50', description: 'Major damage — potential write-off' },
    ],
    damageTypeWeights: { scratch: 1.0, scuff: 0.8, dent: 1.2, chip: 0.6, crack: 1.8, rust: 1.5, paint_peel: 1.2, corrosion: 2.0, structural: 3.0 },
    severityMultipliers: { negligible: 1, minor: 3, moderate: 8, significant: 15, severe: 25 },
    ignoreRules: [],
  },
];

export function getProfileById(id: string) {
  return gradingProfiles.find(p => p.id === id);
}

export function getProfilesForRole(role: string) {
  return gradingProfiles.filter(p => p.applicableRoles.includes(role as never));
}
