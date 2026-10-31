import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mapSupabaseRowToHouse } from './supabaseService';

describe('supabaseService', () => {
  test('maps standard Supabase row with snake_case fields correctly', () => {
    const row = {
      id: 'supa-villa-1',
      name: 'The Sovereign Estate',
      tagline: 'Grand Minimalist Architecture',
      price_usd: 35,
      bloxburg_cash_est: 210000,
      bedrooms: 4,
      bathrooms: 3.5,
      floors: 2,
      build_time_hours: 3.5,
      plot_size: 'Large Plot',
      required_gamepasses: ['Advanced Placing', 'Multiple Floors', 'Large Plot'],
      architectural_concept: 'A cantilevered modern sanctuary balancing glass walls and private courtyards.',
      features: ['Infinity edge pool', 'Custom linear ceiling lighting', '2-car garage'],
      main_image: 'https://images.unsplash.com/photo-example',
      gallery_images: [
        'https://images.unsplash.com/photo-example-1',
        'https://images.unsplash.com/photo-example-2',
      ],
      featured: true,
    };

    const house = mapSupabaseRowToHouse(row);
    assert.equal(house.id, 'supa-villa-1');
    assert.equal(house.name, 'The Sovereign Estate');
    assert.equal(house.priceUSD, 35);
    assert.equal(house.bloxburgCashEst, 210000);
    assert.equal(house.bedrooms, 4);
    assert.equal(house.bathrooms, 3.5);
    assert.equal(house.floors, 2);
    assert.equal(house.buildTimeHours, 3.5);
    assert.equal(house.plotSize, 'Large Plot');
    assert.deepEqual(house.requiredGamepasses, ['Advanced Placing', 'Multiple Floors', 'Large Plot']);
    assert.equal(house.fullDescription, 'A cantilevered modern sanctuary balancing glass walls and private courtyards.');
    assert.deepEqual(house.features, ['Infinity edge pool', 'Custom linear ceiling lighting', '2-car garage']);
    assert.equal(house.featured, true);
    assert.equal(house.galleryImages.length, 2);
  });

  test('falls back to safe defaults when optional fields are missing', () => {
    const sparseRow = {
      name: 'Minimal Bloxburg Cottage',
    };

    const house = mapSupabaseRowToHouse(sparseRow);
    assert.equal(house.name, 'Minimal Bloxburg Cottage');
    assert.equal(house.priceUSD, 25);
    assert.equal(house.bloxburgCashEst, 120000);
    assert.equal(house.bedrooms, 3);
    assert.equal(house.bathrooms, 2);
    assert.equal(house.floors, 1);
    assert.ok(house.requiredGamepasses.length > 0);
    assert.ok(house.features.length > 0);
  });

  test('fetchHousesFromSupabase successfully queries Supabase and returns structured houses', async () => {
    const { houses } = await import('./supabaseService').then((m) => m.fetchHousesFromSupabase());
    assert.ok(Array.isArray(houses));
    assert.ok(houses.length > 0);
    assert.ok(houses[0].name);
    assert.ok(houses[0].priceUSD > 0);
  });
});
