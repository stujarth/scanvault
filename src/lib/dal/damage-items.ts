import { DamageItem } from '@/types/damage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rowsToCamel, camelToRow } from './mappers';
import {
  getDamageByVehicleId as mockGetByVehicle,
  getDamageByScanId as mockGetByScan,
} from '@/data/damage-items';

export async function getDamageByVehicleId(vehicleId: string): Promise<DamageItem[]> {
  if (!isSupabaseConfigured) return mockGetByVehicle(vehicleId);

  const { data, error } = await supabase
    .from('damage_items')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return rowsToCamel<DamageItem>(data);
}

export async function getDamageByScanId(scanId: string): Promise<DamageItem[]> {
  if (!isSupabaseConfigured) return mockGetByScan(scanId);

  const { data, error } = await supabase
    .from('damage_items')
    .select('*')
    .eq('scan_id', scanId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return rowsToCamel<DamageItem>(data);
}

export async function createDamageItems(items: Partial<DamageItem>[]): Promise<DamageItem[]> {
  if (!isSupabaseConfigured) return [];

  const rows = items.map((item) => {
    const row = camelToRow(item as Record<string, unknown>);
    // Map nested fields
    if (item.dimensions) {
      row.length_mm = item.dimensions.lengthMm;
      row.width_mm = item.dimensions.widthMm;
      row.depth_mm = item.dimensions.depthMm;
    }
    delete row.dimensions;

    if (item.position) {
      row.position_x = item.position.x;
      row.position_y = item.position.y;
    }
    delete row.position;

    if (item.repairEstimate) {
      row.repair_cost_gbp = item.repairEstimate.costGbp;
      row.repair_method = item.repairEstimate.method;
    }
    delete row.repair_estimate;

    return row;
  });

  const { data, error } = await supabase
    .from('damage_items')
    .insert(rows)
    .select();

  if (error || !data) return [];
  return rowsToCamel<DamageItem>(data);
}
