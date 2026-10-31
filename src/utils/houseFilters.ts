import { House } from '../data/houses';

export type CategoryFilter = 'all' | 'mansions' | 'minimalist' | 'family';

export function filterHouses(
  houses: House[],
  category: CategoryFilter,
  searchQuery: string = ''
): House[] {
  return houses.filter((house) => {
    const matchesCategory = category === 'all' || house.category === category;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesName = house.name.toLowerCase().includes(query);
    const matchesDesc = house.shortDescription.toLowerCase().includes(query) || house.tagline.toLowerCase().includes(query);
    const matchesCategoryLabel = house.categoryLabel.toLowerCase().includes(query);

    return matchesCategory && (matchesName || matchesDesc || matchesCategoryLabel);
  });
}

export function formatBloxburgCash(amount: number): string {
  return `$${amount.toLocaleString('en-US')} $B`;
}

export function formatPriceUSD(price: number): string {
  return `$${price.toFixed(0)} USD`;
}

export function getFeaturedHouses(houses: House[], limit: number = 3): House[] {
  return houses.filter((h) => h.featured).slice(0, limit);
}
