import { ArrowDown, Sparkles, ShieldCheck, Clock } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onExploreProcess: () => void;
}

export function Hero({ onExploreCatalog, onExploreProcess }: HeroProps) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting effects matching forest green palette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#27442f]/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#1a3822]/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Message and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Brand Slogan pill / kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-white/15 text-xs font-semibold text-[#86efac] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-wide">Built with care, enjoy with ease.</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2] pb-2 text-balance mb-6">
              We build your dream home in <span className="text-[#86efac] inline-block pb-1">Bloxburg</span>.
            </h1>

            {/* Explanatory Paragraph */}
            <p className="font-body text-base sm:text-lg text-[#c3d6c7] leading-relaxed max-w-2xl mb-8">
              We are a boutique studio specializing in architectural design and luxury interiors for Bloxburg (Roblox). We craft modern mansions, minimalist estates, and turnkey cozy family homes, constructed directly on your plot within hours.
            </p>

            {/* CTAs with Liquid Glass aesthetics */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12">
              <button
                onClick={onExploreCatalog}
                className="liquid-glass-btn-primary px-7 py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-black/30 w-full sm:w-auto"
              >
                <span>View Catalog</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreProcess}
                className="liquid-glass-btn px-6 py-3.5 rounded-xl text-sm uppercase tracking-wider text-white font-medium flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Key Service Highlights (Homes built counter removed per user request) */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 w-full max-w-md text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">1-3h</p>
                <p className="text-xs text-[#9bb3a0] mt-0.5">Turnkey Delivery</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#86efac] font-display tabular-nums">100%</p>
                <p className="text-xs text-[#9bb3a0] mt-0.5">Satisfaction Guaranteed</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Hero Card with Liquid Glass frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-3 liquid-glass border border-white/20 shadow-2xl shadow-black/50">
              
              {/* Bloxburg Villa Showcase Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#162419]">
                <img
                  src="/src/assets/images/bloxburg_modern_villa_1793408050800.jpg"
                  alt="Luxury Bloxburg Villa HAUSBURG"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Glass Tag inside the photo */}
                <div className="absolute top-4 left-4 liquid-glass px-3 py-1.5 rounded-lg border border-white/25 flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#86efac]" />
                  <span>Featured Build: Villa Luminosa</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 liquid-glass p-3 rounded-xl border border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#a3b899]">Estimated Investment</p>
                    <p className="text-lg font-bold text-white font-display">$28 USD <span className="text-xs text-[#c3d6c7] font-normal">· ~$185k $B</span></p>
                  </div>
                  <button
                    onClick={onExploreCatalog}
                    className="liquid-glass-btn px-3 py-1.5 text-xs text-white rounded-lg font-medium hover:text-[#86efac]"
                  >
                    View details
                  </button>
                </div>
              </div>

              {/* Decorative Trust Signals */}
              <div className="mt-3 px-3 py-2 flex items-center justify-between text-xs text-[#a3b899]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#86efac]" />
                  Secure Co-Owner building
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#86efac]" />
                  Scheduled live sessions
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
