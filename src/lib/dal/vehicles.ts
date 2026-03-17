import { Vehicle } from '@/types/vehicle';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rowsToCamel, rowToCamel, camelToRow } from './mappers';
import {
  getVehiclesByOwnerId as mockGetByOwner,
  getVehiclesByOrgId as mockGetByOrg,
  getVehicleById as mockGetById,
} from '@/data/vehicles';

/**
 * Enrich a raw DB vehicle row with computed fields from its latest scan.
 */
async function enrichVehicle(row: Record<string, unknown>): Promise<Vehicle> {
  const vehicle = rowToCamel<Vehicle>(row);

  // Fetch latest scan for computed fields
  const { data: latestScan } = await supabase
    .from('scans')
    .select('grade_overall, grade_label, created_at')
    .eq('vehicle_id', vehicle.id)
    .eq('status', 'complete')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { count } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', vehicle.id)
    .eq('status', 'complete');

  if (latestScan) {
    vehicle.currentGrade = {
      score: latestScan.grade_overall ?? 0,
      label: latestScan.grade_label ?? 'Ungraded',
      profileId: 'default',
    };
    vehicle.lastScanDate = latestScan.created_at;
  } else {
    vehicle.currentGrade = { score: 0, label: 'Ungraded', profileId: 'default' };
  }
  vehicle.totalScans = count ?? 0;

  return vehicle;
}

export async function getVehiclesByOwnerId(ownerId: string): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) return mockGetByOwner(ownerId);

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return Promise.all(data.map(enrichVehicle));
}

export async function getVehiclesByOrgId(orgId: string): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) return mockGetByOrg(orgId);

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return Promise.all(data.map(enrichVehicle));
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  if (!isSupabaseConfigured) return mockGetById(id);

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return enrichVehicle(data);
}

export async function createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) return null;

  const row = camelToRow(vehicle as Record<string, unknown>);
  // Remove computed fields that don't exist in DB
  delete row.current_grade;
  delete row.last_scan_date;
  delete row.total_scans;
  delete row.image_url;

  const { data, error } = await supabase
    .from('vehicles')
    .insert(row)
    .select()
    .single();

  if (error || !data) return null;
  return enrichVehicle(data);
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) return null;

  const row = camelToRow(updates as Record<string, unknown>);
  delete row.current_grade;
  delete row.last_scan_date;
  delete row.total_scans;
  delete row.image_url;
  delete row.id;

  const { data, error } = await supabase
    .from('vehicles')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return enrichVehicle(data);
}
