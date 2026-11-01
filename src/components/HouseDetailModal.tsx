import { useState, useEffect } from 'react';
import { House } from '../data/houses';
import { formatBloxburgCash, formatPriceUSD } from '../utils/houseFilters';
import { X, Clock, MapPin, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Send } from 'lucide-react';

interface HouseDetailModalProps {
  house: House | null;
  onClose: () => void;
  onSelectForContact: (house: House) => void;
}

export function HouseDetailModal({ house, onClose, onSelectForContact }: HouseDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (house) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [house, onClose]);

  if (!house) return null;

  const currentImage = house.galleryImages[activeImageIndex] || {
    url: house.mainImage,
    caption: house.name,
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % house.galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + house.galleryImages.length) % house.galleryImages.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto liquid-glass-card rounded-3xl border border-white/20 shadow-2xl p-5 sm:p-8 text-left my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 liquid-glass p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title & Category */}
        <div className="mb-6 pr-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#86efac] uppercase tracking-wider mb-1">
            <span>{house.categoryLabel}</span>
            <span>·</span>
            <span>Bloxburg Exclusive</span>
          </div>
          <h2 className="font-brand text-2xl sm:text-3xl font-black text-white">
            {house.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#9bb3a0] mt-1 font-body">
            {house.tagline}
          </p>
        </div>

        {/* Gallery Section */}
        <div className="mb-6">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#162419] border border-white/10">
            <img
              src={currentImage.url}
              alt={currentImage.caption}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            
            {/* Gallery controls if multiple images */}
            {house.galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 liquid-glass p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 liquid-glass p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Caption bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 sm:p-4 text-xs text-white">
              <span className="font-medium">{currentImage.caption}</span>
              <span className="text-[#a3b899] ml-2">
                ({activeImageIndex + 1}/{house.galleryImages.length})
              </span>
            </div>
          </div>

          {/* Thumbnails row */}
          {house.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
              {house.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#86efac] scale-102 shadow-md'
                      : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Key Attributes Card */}
        <div className="liquid-glass p-4 sm:p-5 rounded-2xl border border-white/15 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* Price USD */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[11px] uppercase tracking-wider text-[#9bb3a0] font-semibold">
                Construction Fee
              </p>
              <p className="text-2xl font-black text-white font-display mt-0.5">
                {formatPriceUSD(house.priceUSD)} USD
              </p>
              <p className="text-[10px] text-[#86efac]">HAUSBURG builder service</p>
            </div>

            {/* In-Game Cash */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[11px] uppercase tracking-wider text-[#9bb3a0] font-semibold">
                Bloxburg Cash ($B)
              </p>
              <p className="text-xl font-bold text-white font-mono mt-0.5 tabular-nums">
                {formatBloxburgCash(house.bloxburgCashEst)}
              </p>
              <p className="text-[10px] text-[#c4d4c8]">Required in-game plot funds</p>
            </div>

            {/* Build Time */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[11px] uppercase tracking-wider text-[#9bb3a0] font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#86efac]" /> Estimated Time
              </p>
              <p className="text-xl font-bold text-white font-display mt-0.5">
                {house.buildTimeDisplay ? house.buildTimeDisplay : `~${house.buildTimeHours} hours`}
              </p>
              <p className="text-[10px] text-[#c4d4c8]">Built live in your server</p>
            </div>

            {/* Plot Size */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[11px] uppercase tracking-wider text-[#9bb3a0] font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#86efac]" /> Recommended Plot
              </p>
              <p className="text-base font-bold text-white font-display mt-0.5">
                {house.plotSize}
              </p>
              <p className="text-[10px] text-[#c4d4c8]">Fits standard neighborhood</p>
            </div>

          </div>
        </div>

        {/* Detailed Description & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Left: Text & Features */}
          <div className="lg:col-span-7">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display mb-2">
              Architectural Concept
            </h4>
            <p className="text-xs sm:text-sm text-[#c3d6c7] leading-relaxed mb-4">
              {house.fullDescription}
            </p>

            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display mb-3">
              Included Features & Finishes
            </h4>
            <ul className="space-y-2">
              {house.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#a9bfae]">
                  <CheckCircle2 className="w-4 h-4 text-[#86efac] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Technical Requirements / Gamepasses */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#86efac]" /> Required Gamepasses
              </h4>
              <p className="text-[11px] text-[#9bb3a0] mb-3">
                To build this exact floorplan on your plot, ensure you have active in Roblox:
              </p>
              <div className="flex flex-col gap-1.5">
                {house.requiredGamepasses.map((gp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/5 border border-white/5 text-xs"
                  >
                    <span className="font-medium text-white">{gp}</span>
                    <span className="text-[10px] text-[#86efac] font-mono">Required</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#7d9983] mt-3 italic">
                * Missing a gamepass? Contact us and we will adapt the model to the passes you own.
              </p>
            </div>

            {/* Micro specs strip */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-white">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="block text-[10px] text-[#8ca893]">Bedrooms</span>
                <span className="font-bold">{house.bedrooms}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="block text-[10px] text-[#8ca893]">Bathrooms</span>
                <span className="font-bold">{house.bathrooms}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="block text-[10px] text-[#8ca893]">Floors</span>
                <span className="font-bold">{house.floors}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action CTA */}
        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#a3b899]">
            Have custom color requests or room layout questions? We will consult directly with you.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="liquid-glass-btn px-4 py-2.5 text-xs uppercase tracking-wider text-white rounded-xl w-full sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSelectForContact(house);
              }}
              className="liquid-glass-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider rounded-xl font-bold inline-flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
            >
              <span>I'm Interested in This House</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
