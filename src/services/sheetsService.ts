import { House } from '../data/houses';

export const SHEET_COLUMNS = [
  'id',
  'name',
  'tagline',
  'category',
  'categoryLabel',
  'priceUSD',
  'bloxburgCashEst',
  'bedrooms',
  'bathrooms',
  'floors',
  'plotSize',
  'buildTimeHours',
  'requiredGamepasses',
  'featured',
  'mainImage',
  'galleryImages',
  'shortDescription',
  'fullDescription',
  'features',
];

export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Matches https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Otherwise assume it's already an ID if clean
  return trimmed.split('/')[0].split('?')[0];
}

export function parseSheetRowsToHouses(rows: any[][]): House[] {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((h) => String(h || '').trim());
  const headerMap: Record<string, number> = {};
  headers.forEach((h, idx) => {
    headerMap[h.toLowerCase()] = idx;
  });

  const getCol = (row: any[], colName: string, defaultValue: string = '') => {
    const idx = headerMap[colName.toLowerCase()];
    if (idx !== undefined && idx < row.length && row[idx] !== undefined && row[idx] !== null) {
      return String(row[idx]).trim();
    }
    return defaultValue;
  };

  const parsedHouses: House[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const id = getCol(row, 'id', `house-${i}`);
    const name = getCol(row, 'name');
    if (!name) continue; // Skip empty rows

    const tagline = getCol(row, 'tagline', '');
    let category = getCol(row, 'category', 'mansions').toLowerCase();
    if (!['all', 'mansions', 'minimalist', 'family'].includes(category)) {
      if (category.includes('man') || category.includes('luxury')) category = 'mansions';
      else if (category.includes('min')) category = 'minimalist';
      else if (category.includes('fam') || category.includes('cot')) category = 'family';
      else category = 'mansions';
    }

    const categoryLabel = getCol(row, 'categoryLabel', category === 'mansions' ? 'Modern Mansion' : category === 'minimalist' ? 'Minimalist Estate' : 'Family Home');
    const priceUSD = parseFloat(getCol(row, 'priceUSD', '25').replace(/[^0-9.]/g, '')) || 25;
    const bloxburgCashEst = parseInt(getCol(row, 'bloxburgCashEst', '120000').replace(/[^0-9]/g, ''), 10) || 120000;
    const bedrooms = parseInt(getCol(row, 'bedrooms', '3').replace(/[^0-9]/g, ''), 10) || 3;
    const bathrooms = parseFloat(getCol(row, 'bathrooms', '2').replace(/[^0-9.]/g, '')) || 2;
    const floors = parseInt(getCol(row, 'floors', '1').replace(/[^0-9]/g, ''), 10) || 1;
    const plotSizeRaw = getCol(row, 'plotSize', 'Regular Plot');
    const plotSize = plotSizeRaw.toLowerCase().includes('large') ? 'Large Plot' : 'Regular Plot';
    const buildTimeHours = parseFloat(getCol(row, 'buildTimeHours', '2').replace(/[^0-9.]/g, '')) || 2.0;

    const gamepassesRaw = getCol(row, 'requiredGamepasses', 'Advanced Placing');
    const requiredGamepasses = gamepassesRaw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const featuredRaw = getCol(row, 'featured', 'false').toLowerCase();
    const featured = featuredRaw === 'true' || featuredRaw === '1' || featuredRaw === 'yes';

    const mainImage = getCol(row, 'mainImage', '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg');

    const galleryRaw = getCol(row, 'galleryImages', '');
    let galleryImages: { url: string; caption: string }[] = [];
    if (galleryRaw) {
      galleryImages = galleryRaw
        .split(/[,;]/)
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url, idx) => ({
          url,
          caption: `${name} View ${idx + 1}`,
        }));
    }
    if (galleryImages.length === 0) {
      galleryImages = [{ url: mainImage, caption: `${name} Main View` }];
    }

    const shortDescription = getCol(row, 'shortDescription', 'Custom architectural design for Bloxburg.');
    const fullDescription = getCol(row, 'fullDescription', shortDescription);

    const featuresRaw = getCol(row, 'features', '');
    const features = featuresRaw
      ? featuresRaw.split(/;/).map((f) => f.trim()).filter(Boolean)
      : ['Custom finishes and calculated warm lighting', 'Optimized room layout for Bloxburg'];

    parsedHouses.push({
      id,
      name,
      tagline,
      category: category as any,
      categoryLabel,
      priceUSD,
      bloxburgCashEst,
      bedrooms,
      bathrooms,
      floors,
      plotSize,
      buildTimeHours,
      requiredGamepasses: requiredGamepasses.length > 0 ? requiredGamepasses : ['Advanced Placing'],
      featured,
      mainImage,
      galleryImages,
      shortDescription,
      fullDescription,
      features,
    });
  }

  return parsedHouses;
}

export function formatHousesToSheetRows(houses: House[]): any[][] {
  const rows: any[][] = [];
  rows.push(SHEET_COLUMNS);

  houses.forEach((h) => {
    rows.push([
      h.id,
      h.name,
      h.tagline,
      h.category,
      h.categoryLabel,
      h.priceUSD,
      h.bloxburgCashEst,
      h.bedrooms,
      h.bathrooms,
      h.floors,
      h.plotSize,
      h.buildTimeHours,
      h.requiredGamepasses.join(', '),
      h.featured ? 'TRUE' : 'FALSE',
      h.mainImage,
      h.galleryImages.map((g) => g.url).join('; '),
      h.shortDescription,
      h.fullDescription,
      h.features.join('; '),
    ]);
  });

  return rows;
}

export async function fetchHousesFromSheet(
  spreadsheetId: string,
  accessToken: string
): Promise<House[]> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId) {
    throw new Error('Invalid Google Spreadsheet ID or URL');
  }

  // 1. First get spreadsheet metadata to discover the first sheet title (best practice from skill)
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=sheets.properties.title`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!metaRes.ok) {
    const errorBody = await metaRes.text();
    throw new Error(`Failed to read spreadsheet metadata: ${metaRes.status} ${errorBody}`);
  }

  const metaData = await metaRes.json();
  const firstSheetTitle = metaData.sheets?.[0]?.properties?.title || 'Sheet1';

  // 2. Read values from the first sheet
  const valuesRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(firstSheetTitle)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!valuesRes.ok) {
    const errorBody = await valuesRes.text();
    throw new Error(`Failed to read values from sheet "${firstSheetTitle}": ${valuesRes.status} ${errorBody}`);
  }

  const valuesData = await valuesRes.json();
  const rows = valuesData.values;
  if (!rows || rows.length < 2) {
    throw new Error(`The sheet "${firstSheetTitle}" is empty or has only headers.`);
  }

  return parseSheetRowsToHouses(rows);
}

export async function createCatalogSheet(
  accessToken: string,
  defaultHouses: House[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // 1. Create a new Google Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'HAUSBURG Bloxburg Catalog Database',
      },
      sheets: [
        {
          properties: {
            title: 'Catalog',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet: ${createRes.status} ${err}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Populate with default catalog rows
  const rows = formatHousesToSheetRows(defaultHouses);
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Catalog!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!appendRes.ok) {
    console.warn('Could not populate initial rows:', await appendRes.text());
  }

  return { spreadsheetId, spreadsheetUrl };
}
