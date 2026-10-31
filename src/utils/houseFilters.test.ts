import test from 'node:test';
import assert from 'node:assert/strict';
import { filterHouses, formatBloxburgCash, formatPriceUSD, getFeaturedHouses } from './houseFilters';
import { HOUSES } from '../data/houses';

test('filterHouses filters by category correctly in English', () => {
  const allHouses = filterHouses(HOUSES, 'all');
  assert.equal(allHouses.length, HOUSES.length);

  const mansiones = filterHouses(HOUSES, 'mansions');
  assert.ok(mansiones.length > 0);
  assert.ok(mansiones.every((h) => h.category === 'mansions'));

  const minimalistas = filterHouses(HOUSES, 'minimalist');
  assert.ok(minimalistas.length > 0);
  assert.ok(minimalistas.every((h) => h.category === 'minimalist'));

  const family = filterHouses(HOUSES, 'family');
  assert.ok(family.length > 0);
  assert.ok(family.every((h) => h.category === 'family'));
});

test('filterHouses matches search query against name and description', () => {
  const matchesLuminosa = filterHouses(HOUSES, 'all', 'luminosa');
  assert.equal(matchesLuminosa.length, 1);
  assert.equal(matchesLuminosa[0].id, 'villa-luminosa');

  const matchesPool = filterHouses(HOUSES, 'all', 'pool');
  assert.ok(matchesPool.length >= 1);
});

test('formatting utilities work with accurate formats', () => {
  assert.equal(formatBloxburgCash(185000), '$185,000 $B');
  assert.equal(formatBloxburgCash(98000), '$98,000 $B');
  assert.equal(formatPriceUSD(28), '$28 USD');
});

test('getFeaturedHouses returns only featured houses up to the limit', () => {
  const featured = getFeaturedHouses(HOUSES, 3);
  assert.equal(featured.length, 3);
  assert.ok(featured.every((h) => h.featured));
});
