import { House } from '../data/houses';
import { formatBloxburgCash, formatPriceUSD } from '../utils/houseFilters';
import { Bed, Bath, Layers, ArrowRight, Eye } from 'lucide-react';

interface FeaturedHousesProps {
  houses: House[];
  onSelectHouse: (house: House) => void;
  onExploreAll: () => void;
}

export function FeaturedHouses({ houses, onSelectHouse, onExploreAll }: FeaturedHousesProps) {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#86efac] uppercase font-mono mb-2">
              Exclusive Selection
            </p>
            <h2 className="font-brand text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured Houses
            </h2>
            <p className="font-body text-sm sm:text-base text-[#a9bfae] mt-2 max-w-xl">
              Our most celebrated architectural projects in the Bloxburg community, engineered for optimal space planning, clean gameplay flow, and luxury finishes.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="liquid-glass-btn px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white rounded-xl inline-flex items-center gap-2 self-start md:self-auto hover:text-[#86efac]"
          >
            <span>Explore All ({houses.length >= 3 ? '6+' : houses.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((house) => (
            <div
              key={house.id}
              onClick={() => onSelectHouse(house)}
              className="group cursor-pointer liquid-glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#162419]">
                <img
                  src={house.mainImage}
                  alt={house.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1710] via-transparent to-black/20" />

                {/* Category tag */}
                <div className="absolute top-3 left-3 liquid-glass px-2.5 py-1 rounded-md text-[11px] font-semibold text-white tracking-wide">
                  {house.categoryLabel}
                </div>

                {/* Price USD Badge with Fee label */}
                <div className="absolute bottom-3 right-3 liquid-glass-btn-primary px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider opacity-80 font-medium">Fee:</span>
                  <span className="font-black">{formatPriceUSD(house.priceUSD)} USD</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-brand text-xl font-bold text-white group-hover:text-[#86efac] transition-colors">
                    {house.name}
                  </h3>
                  
                  <p className="text-xs text-[#8ca893] mt-1 line-clamp-2">
                    {house.shortDescription}
                  </p>

                  {/* Fee in USD & Bloxburg Cost Preview */}
                  <div className="mt-3.5 text-xs flex items-center justify-between py-2 px-3 rounded-xl bg-black/35 border border-white/10">
                    <div>
                      <span className="text-[10px] text-[#9bb3a0] uppercase tracking-wider block font-semibold">
                        Construction Fee
                      </span>
                      <span className="font-extrabold text-[#86efac] font-display text-sm">
                        {formatPriceUSD(house.priceUSD)} USD
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#9bb3a0] uppercase tracking-wider block font-semibold">
                        Bloxburg Funds
                      </span>
                      <span className="font-semibold text-white font-mono tabular-nums">
                        {formatBloxburgCash(house.bloxburgCashEst)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer specs & CTA */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#a3b899]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title={`${house.bedrooms} Bedrooms`}>
                      <Bed className="w-3.5 h-3.5 text-[#86efac]" />
                      <span className="text-white font-medium">{house.bedrooms}</span>
                    </span>
                    <span className="flex items-center gap-1" title={`${house.bathrooms} Bathrooms`}>
                      <Bath className="w-3.5 h-3.5 text-[#86efac]" />
                      <span className="text-white font-medium">{house.bathrooms}</span>
                    </span>
                    <span className="flex items-center gap-1" title={`${house.floors} Floors`}>
                      <Layers className="w-3.5 h-3.5 text-[#86efac]" />
                      <span className="text-white font-medium">{house.floors}F</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-[#86efac] group-hover:underline">
                    View details <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
