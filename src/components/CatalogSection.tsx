import { useState } from 'react';
import { House } from '../data/houses';
import { CategoryFilter, filterHouses, formatBloxburgCash, formatPriceUSD } from '../utils/houseFilters';
import { Search, Bed, Bath, Layers, Send } from 'lucide-react';

interface CatalogSectionProps {
  houses: House[];
  onSelectHouse: (house: House) => void;
  onQuickContact: (house: House) => void;
}

export function CatalogSection({ houses, onSelectHouse, onQuickContact }: CatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Houses' },
    { id: 'mansions', label: 'Modern Mansions' },
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'family', label: 'Family Homes' },
  ];

  const filteredHouses = filterHouses(houses, activeCategory, searchQuery);

  return (
    <section id="catalog" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Our Exclusive Models
          </h2>
          <p className="font-body text-sm sm:text-base text-[#a9bfae] mt-3">
            Browse our full architectural portfolio. Each plan has been built, tested, and optimized to provide peak aesthetic presence and smooth gameplay in Roblox Bloxburg.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 liquid-glass p-3 rounded-2xl border border-white/15">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'liquid-glass-btn-primary shadow-md'
                    : 'text-[#c4d4c8] hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ba391]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model or style..."
              className="w-full pl-10 pr-4 py-2 text-xs text-white bg-black/40 border border-white/15 rounded-xl placeholder-[#758e7b] focus:outline-none focus:border-[#86efac] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8ba391] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Houses Grid */}
        {filteredHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHouses.map((house) => (
              <div
                key={house.id}
                className="liquid-glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Section */}
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-[#162419] cursor-pointer"
                  onClick={() => onSelectHouse(house)}
                >
                  <img
                    src={house.mainImage}
                    alt={house.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1710] via-black/10 to-transparent pointer-events-none" />

                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 liquid-glass px-2.5 py-1 rounded-md text-[11px] font-semibold text-white">
                    {house.categoryLabel}
                  </div>

                  {/* Construction Fee Badge in USD */}
                  <div className="absolute top-3 right-3 liquid-glass-btn-primary px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                    <span className="text-[10px] uppercase tracking-wider opacity-80 font-medium">Fee:</span>
                    <span className="font-black">{formatPriceUSD(house.priceUSD)} USD</span>
                  </div>

                  {/* Bloxburg Cash in-game tag at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 liquid-glass px-3 py-1.5 rounded-lg border border-white/15 flex items-center justify-between text-xs">
                    <span className="text-[#a3b899]">In-Game Funds ($B):</span>
                    <span className="font-bold text-white font-mono tabular-nums">
                      {formatBloxburgCash(house.bloxburgCashEst)}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectHouse(house)}
                      className="font-brand text-xl font-bold text-white group-hover:text-[#86efac] transition-colors cursor-pointer"
                    >
                      {house.name}
                    </h3>
                    <p className="text-xs text-[#8ca893] mt-1.5 line-clamp-2">
                      {house.shortDescription}
                    </p>

                    {/* Prominent Fee & Budget Breakdown */}
                    <div className="mt-3.5 py-2 px-3 rounded-xl bg-black/35 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#a3b899] uppercase tracking-wider font-semibold block">
                          Construction Fee
                        </span>
                        <span className="text-sm font-extrabold text-[#86efac] font-display">
                          {formatPriceUSD(house.priceUSD)} USD
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#a3b899] uppercase tracking-wider font-semibold block">
                          Bloxburg Budget
                        </span>
                        <span className="text-xs font-semibold text-white font-mono tabular-nums">
                          {formatBloxburgCash(house.bloxburgCashEst)}
                        </span>
                      </div>
                    </div>

                    {/* Specs chips */}
                    <div className="flex items-center gap-4 mt-3 py-2 border-y border-white/10 text-xs text-[#a9bfae]">
                      <span className="flex items-center gap-1.5" title="Bedrooms">
                        <Bed className="w-3.5 h-3.5 text-[#86efac]" />
                        <span className="text-white font-medium">{house.bedrooms} Beds</span>
                      </span>
                      <span className="flex items-center gap-1.5" title="Bathrooms">
                        <Bath className="w-3.5 h-3.5 text-[#86efac]" />
                        <span className="text-white font-medium">{house.bathrooms} Baths</span>
                      </span>
                      <span className="flex items-center gap-1.5" title="Floors">
                        <Layers className="w-3.5 h-3.5 text-[#86efac]" />
                        <span className="text-white font-medium">{house.floors} Floors</span>
                      </span>
                    </div>

                    {/* Gamepasses needed preview */}
                    <div className="mt-3 text-[11px] text-[#8ca893] flex flex-wrap gap-1.5 items-center">
                      <span className="text-[#6d8a74]">Passes:</span>
                      {house.requiredGamepasses.map((gp, i) => (
                        <span key={i} className="text-[#c4d4c8] bg-black/30 px-2 py-0.5 rounded border border-white/5">
                          {gp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 flex items-center gap-2">
                    <button
                      onClick={() => onSelectHouse(house)}
                      className="liquid-glass-btn flex-1 py-2 px-3 text-xs uppercase tracking-wider font-semibold text-white rounded-xl text-center hover:text-[#86efac] transition-colors cursor-pointer"
                    >
                      View Gallery & Specs
                    </button>
                    <button
                      onClick={() => onQuickContact(house)}
                      className="liquid-glass-btn-primary p-2 rounded-xl text-xs flex items-center justify-center cursor-pointer"
                      title={`I'm interested in ${house.name}`}
                      aria-label={`I'm interested in ${house.name}`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 liquid-glass rounded-2xl border border-white/10 max-w-md mx-auto">
            <p className="text-base text-white font-semibold">No houses match your search</p>
            <p className="text-xs text-[#8ca893] mt-1">Try switching to "All Houses" or clearing your search term.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 liquid-glass-btn px-4 py-2 text-xs text-white rounded-lg font-medium"
            >
              Reset filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
