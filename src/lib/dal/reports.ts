import { Report } from '@/types/report';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rowsToCamel, rowToCamel, camelToRow } from './mappers';
import {
  getReportsByUserId as mockGetByUser,
  getReportById as mockGetById,
  getReportsByVehicleId as mockGetByVehicle,
  getSharedReportsForOrg as mockGetSharedForOrg,
} from '@/data/reports';

export async function getReportsByUserId(userId: string): Promise<Report[]> {
  if (!isSupabaseConfigured) return mockGetByUser(userId);

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('generated_by', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return rowsToCamel<Report>(data);
}

export async function getReportsByVehicleId(vehicleId: string): Promise<Report[]> {
  if (!isSupabaseConfigured) return mockGetByVehicle(vehicleId);

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return rowsToCamel<Report>(data);
}

export async function getReportById(id: string): Promise<Report | undefined> {
  if (!isSupabaseConfigured) return mockGetById(id);

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return rowToCamel<Report>(data);
}

export async function getSharedReportsForOrg(orgId: string): Promise<Report[]> {
  if (!isSupabaseConfigured) return mockGetSharedForOrg(orgId);

  const { data, error } = await supabase
    .from('shared_reports')
    .select('report_id, reports(*)')
    .eq('shared_with_org_id', orgId);

  if (error || !data) return [];
  return data
    .map((row: any) => row.reports)
    .filter(Boolean)
    .map((r: Record<string, unknown>) => rowToCamel<Report>(r));
}

export async function createReport(report: Partial<Report>): Promise<Report | null> {
  if (!isSupabaseConfigured) return null;

  const row = camelToRow(report as Record<string, unknown>);
  // Map grade fields to flat columns
  if (report.grade) {
    row.grading_profile = report.gradingProfile;
    row.grade_overall = report.grade.overall;
    row.grade_label = report.grade.label;
    row.grade_per_panel = report.grade.perPanel ?? {};
  }
  delete row.grade;
  delete row.shared_with;

  const { data, error } = await supabase
    .from('reports')
    .insert(row)
    .select()
    .single();

  if (error || !data) return null;
  return rowToCamel<Report>(data);
}
