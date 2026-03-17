import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Upload a scan image to Supabase Storage.
 * Returns the public URL on success, or null if Supabase is not configured.
 */
export async function uploadScanImage(
  scanId: string,
  zone: string,
  imageBlob: Blob,
  index: number = 0
): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const ext = imageBlob.type === 'image/png' ? 'png' : 'jpg';
  const path = `scans/${scanId}/${zone}_${index}.${ext}`;

  const { error } = await supabase.storage
    .from('scan-images')
    .upload(path, imageBlob, {
      contentType: imageBlob.type,
      upsert: true,
    });

  if (error) {
    console.error('Image upload error:', error.message);
    return null;
  }

  const { data } = supabase.storage
    .from('scan-images')
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Convert a base64 data URL to a Blob.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bytes = atob(parts[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr], { type: mime });
}

/**
 * Save a completed scan to the Supabase database.
 */
export async function saveScan(scan: {
  vehicleId: string;
  performedBy: string;
  type: string;
  status: string;
  mileageAtScan?: number;
  location?: string;
  notes?: string;
  weatherConditions?: string;
  imageCount: number;
  gradeOverall?: number;
  gradeLabel?: string;
  gradeProfile?: string;
  gradePerPanel?: Record<string, number>;
}): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('scans')
    .insert({
      vehicle_id: scan.vehicleId,
      performed_by: scan.performedBy,
      type: scan.type,
      status: scan.status,
      mileage_at_scan: scan.mileageAtScan,
      location: scan.location,
      notes: scan.notes,
      weather_conditions: scan.weatherConditions,
      image_count: scan.imageCount,
      grade_overall: scan.gradeOverall,
      grade_label: scan.gradeLabel,
      grade_profile: scan.gradeProfile,
      grade_per_panel: scan.gradePerPanel || {},
    })
    .select('id')
    .single();

  if (error) {
    console.error('Save scan error:', error.message);
    return null;
  }

  return data.id;
}

/**
 * Save a scan image record to the database.
 */
export async function saveScanImage(image: {
  scanId: string;
  position: string;
  imageUrl: string;
  width?: number;
  height?: number;
}): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('scan_images')
    .insert({
      scan_id: image.scanId,
      position: image.position,
      image_url: image.imageUrl,
      width: image.width,
      height: image.height,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Save scan image error:', error.message);
    return null;
  }

  return data.id;
}

/**
 * Save damage items detected by AI to the database.
 */
export async function saveDamageItems(items: Array<{
  scanId: string;
  vehicleId: string;
  type: string;
  severity: string;
  panel: string;
  description: string;
  lengthMm?: number;
  widthMm?: number;
  depthMm?: number;
  positionX?: number;
  positionY?: number;
  repairCostGbp?: number;
  repairMethod?: string;
  confidence?: number;
}>): Promise<boolean> {
  if (!isSupabaseConfigured || items.length === 0) return false;

  const rows = items.map(item => ({
    scan_id: item.scanId,
    vehicle_id: item.vehicleId,
    type: item.type,
    severity: item.severity,
    panel: item.panel,
    description: item.description,
    length_mm: item.lengthMm,
    width_mm: item.widthMm,
    depth_mm: item.depthMm,
    position_x: item.positionX,
    position_y: item.positionY,
    repair_cost_gbp: item.repairCostGbp,
    repair_method: item.repairMethod,
    confidence: item.confidence,
    is_new: true,
    first_detected_scan_id: item.scanId,
  }));

  const { error } = await supabase.from('damage_items').insert(rows);

  if (error) {
    console.error('Save damage items error:', error.message);
    return false;
  }

  return true;
}
