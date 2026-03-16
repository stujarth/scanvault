import { DamageItem } from '@/types/damage';
import { GradingProfile, GradingThreshold } from '@/types/grading';

export function calculateGrade(damages: DamageItem[], profile: GradingProfile): { score: number; label: string; colour: string } {
  let totalDeduction = 0;

  for (const damage of damages) {
    const shouldIgnore = profile.ignoreRules.some(rule => {
      if (rule.damageType !== damage.type) return false;
      const severityOrder = ['negligible', 'minor', 'moderate', 'significant', 'severe'];
      if (severityOrder.indexOf(damage.severity) > severityOrder.indexOf(rule.maxSeverity)) return false;
      if (rule.maxDimensionMm && damage.dimensions?.lengthMm && damage.dimensions.lengthMm > rule.maxDimensionMm) return false;
      return true;
    });

    if (shouldIgnore) continue;

    const severityScore = profile.severityMultipliers[damage.severity];
    const typeWeight = profile.damageTypeWeights[damage.type];
    totalDeduction += severityScore * typeWeight;
  }

  const score = Math.max(0, Math.round(100 - totalDeduction));
  const threshold = getThreshold(score, profile.thresholds);

  return {
    score,
    label: threshold?.label ?? 'Unknown',
    colour: threshold?.colour ?? 'text-gray-600 bg-gray-50',
  };
}

export function getThreshold(score: number, thresholds: GradingThreshold[]): GradingThreshold | undefined {
  return thresholds.find(t => score >= t.minScore && score <= t.maxScore);
}

export function getGradeColour(score: number): string {
  if (score >= 90) return 'text-teal-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 55) return 'text-amber-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
}

export function getGradeBgColour(score: number): string {
  if (score >= 90) return 'bg-teal-50 border-teal-200';
  if (score >= 75) return 'bg-blue-50 border-blue-200';
  if (score >= 55) return 'bg-amber-50 border-amber-200';
  if (score >= 30) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}

export function getGradeLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Fail';
}
