import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#0e1710] py-12 text-white overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#1a3822]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-brand text-2xl font-black tracking-wider text-white">
              HAUSBURG
            </span>
            <p className="font-brand text-sm font-semibold text-[#86efac] mt-1 tracking-tight">
              Built with care, enjoy with ease.
            </p>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#a3b899]">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#catalog" className="hover:text-white transition-colors">House Catalog</a>
            <a href="#process" className="hover:text-white transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact & Quote</a>
          </nav>

          {/* Back to top button */}
          <div className="flex items-center">
            <button
              onClick={scrollToTop}
              className="liquid-glass p-2.5 rounded-xl text-white hover:text-[#86efac] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
