import { Organisation } from '@/types/organisation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rowToCamel, camelToRow } from './mappers';
import { getOrgById as mockGetById } from '@/data/organisations';

export async function getOrgById(id: string): Promise<Organisation | undefined> {
  if (!isSupabaseConfigured) return mockGetById(id);

  const { data, error } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  const org = rowToCamel<Organisation>(data);

  // Derive memberIds and vehicleIds from foreign keys
  const { data: members } = await supabase
    .from('profiles')
    .select('id')
    .eq('organisation_id', id);
  org.memberIds = members?.map((m: { id: string }) => m.id) ?? [];

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id')
    .eq('organisation_id', id);
  org.vehicleIds = vehicles?.map((v: { id: string }) => v.id) ?? [];

  return org;
}

export async function updateOrg(id: string, updates: Partial<Organisation>): Promise<Organisation | null> {
  if (!isSupabaseConfigured) return null;

  const row = camelToRow(updates as Record<string, unknown>);
  // Remove derived fields
  delete row.member_ids;
  delete row.vehicle_ids;
  delete row.id;

  const { data, error } = await supabase
    .from('organisations')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToCamel<Organisation>(data);
}
