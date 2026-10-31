import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { House, HOUSES } from '../data/houses';

export const DEFAULT_SUPABASE_URL = 'https://vpslcxxcnfqwhcvktzek.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc2xjeHhjbmZxd2hjdmt0emVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NjE5NzcsImV4cCI6MjEwOTAzNzk3N30.eSFH8oGFlmsCjuyyWYF64H-WaEtMe3-1j0QvQpBL8ZM';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient {
  const url = customUrl || SUPABASE_URL;
  const key = customKey || SUPABASE_ANON_KEY;

  if (!supabaseClient || customUrl || customKey) {
    supabaseClient = createClient(url, key);
  }

  return supabaseClient;
}

export function mapSupabaseRowToHouse(row: any): House {
  const priceUSD =
    parseFloat(String(row.price_usd ?? row.priceUSD ?? row.price ?? '25').replace(/[^0-9.]/g, '')) || 25;
  const bloxburgCashEst =
    parseInt(String(row.bloxburg_cash_est ?? row.bloxburgCashEst ?? row.bloxburg_cash ?? row.bloxburg_cost ?? '120000').replace(/[^0-9]/g, ''), 10) || 120000;
  const bedrooms = parseInt(String(row.bedrooms ?? row.beds ?? '3').replace(/[^0-9]/g, ''), 10) || 3;
  const bathrooms = parseFloat(String(row.bathrooms ?? row.baths ?? '2').replace(/[^0-9.]/g, '')) || 2;
  const floors = parseInt(String(row.floors ?? '1').replace(/[^0-9]/g, ''), 10) || 1;
  const buildTimeHours =
    parseFloat(String(row.build_time_hours ?? row.buildTimeHours ?? row.build_time ?? row.estimated_time ?? '2.0').replace(/[^0-9.]/g, '')) || 2.0;

  const plotSizeRaw = String(row.plot_size ?? row.plotSize ?? 'Regular Plot');
  const plotSize = plotSizeRaw.toLowerCase().includes('large') ? 'Large Plot' : 'Regular Plot';

  // Gamepasses array handling (supports string, array, or CSV)
  let requiredGamepasses: string[] = [];
  const rawGamepasses = row.required_gamepasses ?? row.requiredGamepasses ?? row.gamepasses;
  if (Array.isArray(rawGamepasses)) {
    requiredGamepasses = rawGamepasses.map(String).map((s) => s.trim()).filter(Boolean);
  } else if (typeof rawGamepasses === 'string') {
    requiredGamepasses = rawGamepasses.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  }
  if (requiredGamepasses.length === 0) {
    requiredGamepasses = ['Advanced Placing', 'Multiple Floors'];
  }

  // Features list (Included Features & Finishes)
  let features: string[] = [];
  const rawFeatures = row.features ?? row.included_features ?? row.finishes;
  if (Array.isArray(rawFeatures)) {
    features = rawFeatures.map(String).map((s) => s.trim()).filter(Boolean);
  } else if (typeof rawFeatures === 'string') {
    features = rawFeatures.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
  }
  if (features.length === 0) {
    features = [
      'Custom architectural layout optimized for Bloxburg plot grids',
      'Realistic balanced ambient warm interior lighting',
      'Designer landscaping with outdoor patio integration',
      'Fully furnished living areas with customized texture pairings',
    ];
  }

  // Gallery images handling (supports array of strings, objects, or semicolon/comma-separated strings)
  let galleryImages: { url: string; caption: string }[] = [];
  const rawGallery = row.gallery_images ?? row.galleryImages ?? row.gallery;
  if (Array.isArray(rawGallery)) {
    galleryImages = rawGallery.map((item, idx) => {
      if (typeof item === 'string') {
        return { url: item.trim(), caption: `${row.name || 'House'} View ${idx + 1}` };
      }
      return {
        url: (item.url || item.image_url || '').trim(),
        caption: item.caption || item.title || `${row.name || 'House'} View ${idx + 1}`,
      };
    }).filter((img) => Boolean(img.url));
  } else if (typeof rawGallery === 'string') {
    galleryImages = rawGallery.split(/[,;]/).map((url, idx) => ({
      url: url.trim(),
      caption: `${row.name || 'House'} View ${idx + 1}`,
    })).filter((img) => Boolean(img.url));
  }

  const mainImage =
    row.main_image ??
    row.mainImage ??
    row.image_url ??
    row.image ??
    (galleryImages[0]?.url || '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg');

  if (galleryImages.length === 0) {
    galleryImages = [{ url: mainImage, caption: `${row.name || 'House'} Main Perspective` }];
  }

  const fullDescription = String(
    row.full_description ??
      row.fullDescription ??
      row.architectural_concept ??
      row.description ??
      row.short_description ??
      row.shortDescription ??
      'A custom luxury home designed specifically for Roblox Bloxburg gameplay and visual presence.'
  );

  const shortDescription = String(
    row.short_description ??
      row.shortDescription ??
      (fullDescription.length > 150 ? `${fullDescription.slice(0, 147)}...` : fullDescription)
  );

  let category = String(row.category || 'mansions').toLowerCase();
  if (!['all', 'mansions', 'minimalist', 'family'].includes(category)) {
    if (category.includes('man') || category.includes('luxury')) category = 'mansions';
    else if (category.includes('min')) category = 'minimalist';
    else if (category.includes('fam') || category.includes('cot')) category = 'family';
    else category = 'mansions';
  }

  const categoryLabel = String(
    row.category_label ??
      row.categoryLabel ??
      (category === 'mansions' ? 'Modern Mansion' : category === 'minimalist' ? 'Minimalist Estate' : 'Family Home')
  );

  const featuredRaw = row.featured;
  const featured =
    featuredRaw === true ||
    featuredRaw === 'true' ||
    featuredRaw === 1 ||
    featuredRaw === '1' ||
    featuredRaw === 'yes';

  return {
    id: String(row.id || `supabase-${Math.random().toString(36).substring(2, 9)}`),
    name: String(row.name || 'Bloxburg Architectural Build'),
    tagline: String(row.tagline || 'Custom Architectural Commission'),
    category: category as any,
    categoryLabel,
    priceUSD,
    bloxburgCashEst,
    bedrooms,
    bathrooms,
    floors,
    plotSize,
    buildTimeHours,
    requiredGamepasses,
    featured,
    mainImage,
    galleryImages,
    shortDescription,
    fullDescription,
    features,
  };
}

export async function fetchHousesFromSupabase(customUrl?: string, customKey?: string): Promise<{
  houses: House[];
  isFromSupabase: boolean;
}> {
  try {
    const client = getSupabaseClient(customUrl, customKey);
    const { data, error } = await client.from('houses').select('*');

    if (error) {
      console.warn('Supabase query error (falling back to curated models):', error.message);
      return { houses: HOUSES, isFromSupabase: false };
    }

    if (data && data.length > 0) {
      const parsed = data.map(mapSupabaseRowToHouse);
      return { houses: parsed, isFromSupabase: true };
    }

    // When the table has 0 rows, return curated houses as high-quality initial portfolio
    return { houses: HOUSES, isFromSupabase: false };
  } catch (err: any) {
    console.warn('Supabase connection exception (falling back to curated models):', err?.message);
    return { houses: HOUSES, isFromSupabase: false };
  }
}
