import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isSupabaseConfigured } from '@/lib/supabase';

const anthropic = new Anthropic();

// Simple in-memory rate limiter: max requests per window per user
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

interface AnalysisRequest {
  images: string[]; // base64 data URLs
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColour: string;
  zone: string;
}

interface DetectedDamage {
  type: 'scratch' | 'scuff' | 'dent' | 'chip' | 'crack' | 'rust' | 'paint_peel' | 'corrosion' | 'structural';
  severity: 'negligible' | 'minor' | 'moderate' | 'significant' | 'severe';
  panel: string;
  description: string;
  lengthMm: number | null;
  widthMm: number | null;
  depthMm: number | null;
  positionX: number;
  positionY: number;
  repairCostGbp: number | null;
  repairMethod: string | null;
  confidence: number;
}

interface AnalysisResponse {
  damages: DetectedDamage[];
  overallCondition: string;
  notes: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    // Verify auth when Supabase is configured
    if (isSupabaseConfigured) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Rate limit by user ID
      if (!checkRateLimit(user.id)) {
        return NextResponse.json(
          { error: 'Too many requests — please wait a moment' },
          { status: 429 }
        );
      }
    }

    const body: AnalysisRequest = await request.json();

    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Build image content blocks for Claude Vision
    const imageBlocks: Anthropic.Messages.ContentBlockParam[] = body.images.map(img => {
      // Strip data URL prefix to get raw base64
      const base64Match = img.match(/^data:image\/(jpeg|png|gif|webp);base64,(.+)$/);
      if (!base64Match) {
        throw new Error('Invalid image format — expected base64 data URL');
      }

      const mediaType = base64Match[1] as 'jpeg' | 'png' | 'gif' | 'webp';
      const data = base64Match[2];

      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: `image/${mediaType}` as const,
          data,
        },
      };
    });

    const systemPrompt = `You are a professional vehicle damage assessor for ScanVault, a UK-based vehicle condition scanning platform. You analyse photographs of vehicles to detect and document body damage.

Your assessments are used by garages, hire companies, insurance firms, and car dealerships. Be thorough, precise, and professional.

Respond ONLY with valid JSON matching this schema:
{
  "damages": [
    {
      "type": "scratch|scuff|dent|chip|crack|rust|paint_peel|corrosion|structural",
      "severity": "negligible|minor|moderate|significant|severe",
      "panel": "front_bumper|rear_bumper|bonnet|boot|roof|front_wing_left|front_wing_right|rear_wing_left|rear_wing_right|front_door_left|front_door_right|rear_door_left|rear_door_right|sill_left|sill_right|mirror_left|mirror_right|windscreen|rear_window|alloy_front_left|alloy_front_right|alloy_rear_left|alloy_rear_right",
      "description": "Clear description of the damage",
      "lengthMm": estimated length in mm or null,
      "widthMm": estimated width in mm or null,
      "depthMm": estimated depth in mm or null,
      "positionX": 0-1 normalised X position on the panel,
      "positionY": 0-1 normalised Y position on the panel,
      "repairCostGbp": estimated UK repair cost in GBP or null,
      "repairMethod": "paintless_dent_repair|touch_up|respray|panel_replacement|polish|structural_repair" or null,
      "confidence": 0-1 confidence score
    }
  ],
  "overallCondition": "excellent|good|fair|poor|very_poor",
  "notes": "Any additional observations about the vehicle condition"
}

Guidelines:
- Only report damage you can actually see in the images — do not fabricate damage
- Estimate dimensions based on proportions relative to known panel sizes
- Use UK repair costs (2024-2025 typical garage rates)
- Severity scale: negligible (<£50 to fix), minor (£50-200), moderate (£200-500), significant (£500-1500), severe (>£1500)
- If no damage is visible, return an empty damages array
- Position coordinates should reflect where on the panel the damage is located`;

    const userMessage = `Analyse the following ${body.images.length} image(s) of a ${body.vehicleColour} ${body.vehicleMake} ${body.vehicleModel} (${body.vehicleType}).

These images are from the "${body.zone}" zone scan. Identify all visible body damage and return your assessment as JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: userMessage },
          ],
        },
      ],
      system: systemPrompt,
    });

    // Extract the text response
    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from analysis' },
        { status: 500 }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = textBlock.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const analysis: AnalysisResponse = JSON.parse(jsonStr);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error('Damage analysis error:', err);
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
