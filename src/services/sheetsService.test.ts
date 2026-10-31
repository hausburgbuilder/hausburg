import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractSpreadsheetId,
  parseSheetRowsToHouses,
  formatHousesToSheetRows,
  SHEET_COLUMNS,
} from './sheetsService';
import { HOUSES } from '../data/houses';

describe('sheetsService', () => {
  describe('extractSpreadsheetId', () => {
    test('extracts ID from full standard google spreadsheet URL', () => {
      const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
      assert.equal(extractSpreadsheetId(url), '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    test('extracts ID from URL with path suffix', () => {
      const url = 'https://docs.google.com/spreadsheets/d/abc123_-XYZ/edit';
      assert.equal(extractSpreadsheetId(url), 'abc123_-XYZ');
    });

    test('returns clean ID directly if only ID is provided', () => {
      assert.equal(extractSpreadsheetId('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'), '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    });

    test('handles empty or whitespace inputs gracefully', () => {
      assert.equal(extractSpreadsheetId(''), '');
      assert.equal(extractSpreadsheetId('   '), '');
    });
  });

  describe('formatHousesToSheetRows and parseSheetRowsToHouses', () => {
    test('round-trips houses data into spreadsheet rows and back accurately', () => {
      const sampleHouses = HOUSES.slice(0, 3);
      const rows = formatHousesToSheetRows(sampleHouses);

      assert.equal(rows.length, 4); // 1 header + 3 rows
      assert.deepEqual(rows[0], SHEET_COLUMNS);

      const parsed = parseSheetRowsToHouses(rows);
      assert.equal(parsed.length, 3);

      const firstOriginal = sampleHouses[0];
      const firstParsed = parsed[0];

      assert.equal(firstParsed.id, firstOriginal.id);
      assert.equal(firstParsed.name, firstOriginal.name);
      assert.equal(firstParsed.priceUSD, firstOriginal.priceUSD);
      assert.equal(firstParsed.bedrooms, firstOriginal.bedrooms);
      assert.equal(firstParsed.bathrooms, firstOriginal.bathrooms);
      assert.equal(firstParsed.featured, firstOriginal.featured);
      assert.equal(firstParsed.plotSize, firstOriginal.plotSize);
      assert.equal(firstParsed.mainImage, firstOriginal.mainImage);
      assert.ok(firstParsed.requiredGamepasses.length > 0);
    });

    test('returns empty array when sheet has only headers or empty rows', () => {
      assert.deepEqual(parseSheetRowsToHouses([]), []);
      assert.deepEqual(parseSheetRowsToHouses([SHEET_COLUMNS]), []);
    });

    test('handles case-insensitive header mapping and reasonable defaults', () => {
      const customRows = [
        ['NAME', 'PRICEUSD', 'BEDROOMS', 'BATHROOMS', 'PLOTSIZE'],
        ['The Highland Villa', '$45.00', '4', '3.5', 'Large Plot'],
      ];

      const parsed = parseSheetRowsToHouses(customRows);
      assert.equal(parsed.length, 1);
      assert.equal(parsed[0].name, 'The Highland Villa');
      assert.equal(parsed[0].priceUSD, 45);
      assert.equal(parsed[0].bedrooms, 4);
      assert.equal(parsed[0].bathrooms, 3.5);
      assert.equal(parsed[0].plotSize, 'Large Plot');
    });
  });
});
