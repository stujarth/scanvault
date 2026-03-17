import { Scan } from '@/types/scan';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rowsToCamel, rowToCamel, camelToRow } from './mappers';
import {
  getScansByVehicleId as mockGetByVehicle,
  getScanById as mockGetById,
  getRecentScans as mockGetRecent,
} from '@/data/scans';
import { getDamageByScanId } from '@/data/damage-items';

function enrichScanWithDamage(scan: Scan): Scan {
  // In mock mode, attach damage items from mock data
  if (!scan.damageItems || scan.damageItems.length === 0) {
    scan.damageItems = getDamageByScanId(scan.id);
  }
  return scan;
}

export async function getScansByVehicleId(vehicleId: string): Promise<Scan[]> {
  if (!isSupabaseConfigured) {
    return mockGetByVehicle(vehicleId).map(enrichScanWithDamage);
  }

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const scans = rowsToCamel<Scan>(data);

  // Attach damage items for each scan
  for (const scan of scans) {
    const { data: damages } = await supabase
      .from('damage_items')
      .select('*')
      .eq('scan_id', scan.id);

    scan.damageItems = damages ? rowsToCamel(damages) : [];
  }

  return scans;
}

export async function getScanById(id: string): Promise<Scan | undefined> {
  if (!isSupabaseConfigured) {
    const scan = mockGetById(id);
    return scan ? enrichScanWithDamage(scan) : undefined;
  }

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  const scan = rowToCamel<Scan>(data);

  const { data: damages } = await supabase
    .from('damage_items')
    .select('*')
    .eq('scan_id', id);

  scan.damageItems = damages ? rowsToCamel(damages) : [];

  return scan;
}

export async function getRecentScans(userId: string, limit = 10): Promise<Scan[]> {
  if (!isSupabaseConfigured) {
    return mockGetRecent(userId, limit).map(enrichScanWithDamage);
  }

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('performed_by', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return rowsToCamel<Scan>(data);
}

export async function createScan(scan: Partial<Scan>): Promise<Scan | null> {
  if (!isSupabaseConfigured) return null;

  const row = camelToRow(scan as Record<string, unknown>);
  // Remove non-DB fields
  delete row.damage_items;
  delete row.grade;

  // Map grade fields to flat columns
  if (scan.grade) {
    row.grade_overall = scan.grade.overall;
    row.grade_label = scan.grade.label;
    row.grade_profile = scan.grade.profile;
    row.grade_per_panel = scan.grade.perPanel ?? {};
  }

  const { data, error } = await supabase
    .from('scans')
    .insert(row)
    .select()
    .single();

  if (error || !data) return null;
  return rowToCamel<Scan>(data);
}

export async function updateScanStatus(
  id: string,
  status: string,
  gradeData?: { overall: number; label: string; profile?: string; perPanel?: Record<string, number> }
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const updates: Record<string, unknown> = { status };
  if (gradeData) {
    updates.grade_overall = gradeData.overall;
    updates.grade_label = gradeData.label;
    updates.grade_profile = gradeData.profile;
    updates.grade_per_panel = gradeData.perPanel ?? {};
  }

  const { error } = await supabase
    .from('scans')
    .update(updates)
    .eq('id', id);

  return !error;
}
