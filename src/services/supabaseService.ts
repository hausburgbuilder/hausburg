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
  // Title / Name mapping (supports title, name, model_name)
  const name = String(row.title ?? row.name ?? row.model_name ?? 'Bloxburg Architectural Build').trim();

  // Price / Construction fee in USD
  const rawPrice = row.construction_fee ?? row.price_usd ?? row.priceUSD ?? row.price ?? row.fee ?? 25;
  const priceUSD = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 25;

  // Bloxburg cash cost ($B)
  const rawCash = row.bloxburg_cash ?? row.bloxburg_cash_est ?? row.bloxburgCashEst ?? row.bloxburg_cost ?? 120000;
  const bloxburgCashEst = parseInt(String(rawCash).replace(/[^0-9]/g, ''), 10) || 120000;

  // Rooms and floors
  const bedrooms = parseInt(String(row.bedrooms ?? row.beds ?? '3').replace(/[^0-9]/g, ''), 10) || 3;
  const bathrooms = parseFloat(String(row.bathrooms ?? row.baths ?? '2').replace(/[^0-9.]/g, '')) || 2;
  const floors = parseInt(String(row.floors ?? '1').replace(/[^0-9]/g, ''), 10) || 1;

  // Build time (e.g. "2 hours", "1-2 horas", "45 mins", "3h")
  const rawTime = String(row.estimated_time ?? row.build_time ?? row.build_time_hours ?? row.buildTimeHours ?? '').trim();
  let buildTimeDisplay = rawTime;
  let buildTimeHours = 2.0;

  if (rawTime) {
    const match = rawTime.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (match) {
      buildTimeHours = parseFloat(match[1]) || 2.0;
    }
  } else {
    buildTimeDisplay = '2 hours';
  }

  // Plot size (recommended_plot, plot_size)
  const plotSizeRaw = String(row.recommended_plot ?? row.plot_size ?? row.plotSize ?? 'Regular Plot');
  const plotSize = plotSizeRaw.toLowerCase().includes('large') || plotSizeRaw.toLowerCase().includes('advanced')
    ? 'Large Plot'
    : 'Regular Plot';

  // Gamepasses handling
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

  // Features list
  let features: string[] = [];
  const rawFeatures = row.features_list ?? row.features ?? row.included_features ?? row.finishes;
  if (Array.isArray(rawFeatures)) {
    features = rawFeatures.map(String).map((s) => s.trim()).filter(Boolean);
  } else if (typeof rawFeatures === 'string') {
    features = rawFeatures.split(/[;\n,]/).map((s) => s.trim()).filter(Boolean);
  }
  if (features.length === 0) {
    features = [
      'Custom architectural layout optimized for Bloxburg plot grids',
      'Realistic balanced ambient warm interior lighting',
      'Designer landscaping with outdoor patio integration',
      'Fully furnished living areas with customized texture pairings',
    ];
  }

  // Gallery images handling (supports array or string)
  let galleryImages: { url: string; caption: string }[] = [];
  const rawGallery =
    row.gallery_image_urls ??
    row.gallery_images ??
    row.galleryImages ??
    row.gallery_urls ??
    row.gallery;

  if (Array.isArray(rawGallery)) {
    galleryImages = rawGallery
      .map((item, idx) => {
        if (typeof item === 'string') {
          return { url: item.trim(), caption: `${name} View ${idx + 1}` };
        }
        return {
          url: (item.url || item.image_url || '').trim(),
          caption: item.caption || item.title || `${name} View ${idx + 1}`,
        };
      })
      .filter((img) => Boolean(img.url));
  } else if (typeof rawGallery === 'string') {
    galleryImages = rawGallery
      .split(/[,;]/)
      .map((url, idx) => ({
        url: url.trim(),
        caption: `${name} View ${idx + 1}`,
      }))
      .filter((img) => Boolean(img.url));
  }

  // Main Image URL (supports main_image_url, main_image, mainImage, image_url, imageUrl, image)
  const mainImage = String(
    row.main_image_url ??
      row.main_image ??
      row.mainImage ??
      row.image_url ??
      row.imageUrl ??
      row.image ??
      (galleryImages[0]?.url || '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg')
  ).trim();

  if (galleryImages.length === 0) {
    galleryImages = [{ url: mainImage, caption: `${name} Main Perspective` }];
  }

  // Category detection: checks category, house_type, type, style, architectural_style, or architectural_concept
  const rawCat = String(
    row.category ??
      row.house_type ??
      row.houseType ??
      row.type ??
      row.style ??
      row.architectural_style ??
      row.architectural_concept ??
      ''
  ).toLowerCase().trim();

  let category: 'mansions' | 'minimalist' | 'family' = 'mansions';
  let categoryLabel = 'Modern Mansion';

  if (rawCat.includes('min') || rawCat.includes('minimal') || rawCat.includes('minimalista')) {
    category = 'minimalist';
    categoryLabel = 'Minimalist';
  } else if (rawCat.includes('fam') || rawCat.includes('cot') || rawCat.includes('cozy') || rawCat.includes('familiar')) {
    category = 'family';
    categoryLabel = 'Family Home';
  } else if (rawCat.includes('mod') || rawCat.includes('man') || rawCat.includes('lux') || rawCat.includes('mansion') || rawCat.includes('mansión')) {
    category = 'mansions';
    categoryLabel = 'Modern Mansion';
  } else {
    // If not specified in category fields, check if title gives a hint
    const nameLower = name.toLowerCase();
    if (nameLower.includes('min') || nameLower.includes('minimal')) {
      category = 'minimalist';
      categoryLabel = 'Minimalist';
    } else if (nameLower.includes('fam') || nameLower.includes('cot') || nameLower.includes('familiar')) {
      category = 'family';
      categoryLabel = 'Family Home';
    } else {
      category = 'mansions';
      categoryLabel = 'Modern Mansion';
    }
  }

  // Override categoryLabel if explicitly provided in row
  if (row.category_label || row.categoryLabel) {
    categoryLabel = String(row.category_label || row.categoryLabel);
  }

  // Description / Architectural concept
  // If architectural_concept is just a category word (e.g. "Modern", "Minimalist"), use a rich description
  const rawConcept = String(row.architectural_concept ?? '').trim();
  const isConceptJustCategory = rawConcept.length < 25 && (rawConcept.toLowerCase() === rawCat);

  let fallbackDesc = (!isConceptJustCategory && rawConcept) ? rawConcept : undefined;
  const fullDescription = String(
    row.full_description ??
      row.fullDescription ??
      row.description ??
      fallbackDesc ??
      row.short_description ??
      `A custom ${categoryLabel.toLowerCase()} designed specifically for Roblox Bloxburg gameplay and visual presence.`
  ).trim();

  const shortDescription = String(
    row.short_description ??
      row.shortDescription ??
      (fullDescription.length > 150 ? `${fullDescription.slice(0, 147)}...` : fullDescription)
  ).trim();

  const rawFeatured = row.featured ?? row.is_featured ?? row.destacada ?? row.destacado;
  const featured = Boolean(
    rawFeatured === true ||
      rawFeatured === 'true' ||
      rawFeatured === 1 ||
      rawFeatured === '1' ||
      rawFeatured === 'yes' ||
      rawFeatured === 'si'
  );

  return {
    id: String(row.id || `supabase-${Math.random().toString(36).substring(2, 9)}`),
    name,
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
    buildTimeDisplay,
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
      console.warn('Supabase query notice:', error.message);
      return { houses: HOUSES, isFromSupabase: false };
    }

    if (data && data.length > 0) {
      return { houses: data.map(mapSupabaseRowToHouse), isFromSupabase: true };
    }

    // Si tu tabla está vacía, muestra el catálogo modelo para que el sitio no quede en blanco
    return { houses: HOUSES, isFromSupabase: false };
  } catch (err: any) {
    return { houses: HOUSES, isFromSupabase: false };
  }
}
