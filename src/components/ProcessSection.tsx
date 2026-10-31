import { useState } from 'react';
import { Sparkles, Check, HelpCircle, ChevronDown, ChevronUp, Shield, Wrench, Coins, Users } from 'lucide-react';

export function ProcessSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      number: '01',
      title: 'Choose Your Model or Custom Plan',
      short: 'Catalog or custom commission',
      desc: 'Browse our catalog of modern mansions, minimalist residences, or cozy homes. If you want custom paint colors, room adjustments, or extra landscaping, tell us when requesting.',
      icon: Sparkles,
    },
    {
      number: '02',
      title: 'Prepare Your Bloxburg Cash ($B)',
      short: 'In-game budget for building items',
      desc: 'Building costs in Bloxburg are deducted from your player cash balance as walls and furniture are placed. Every model displays the calculated funds required.',
      icon: Coins,
    },
    {
      number: '03',
      title: 'Server Meetup & Co-Owner Permission',
      short: '100% Safe: We never ask for your password',
      desc: 'We join your Roblox server at the scheduled time. Simply grant us "Co-Owner" permission in your Bloxburg plot menu so we can place items on your land.',
      icon: Users,
    },
    {
      number: '04',
      title: 'Live Construction & Turnkey Delivery',
      short: 'Final inspection & complementary touches',
      desc: 'We construct your home block by block in a 1 to 3 hour live session. Once complete, we take a guided walkthrough together to fine-tune any detail you desire.',
      icon: Wrench,
    },
  ];

  const faqs = [
    {
      q: 'Is this process safe? Do you ever need my Roblox login credentials?',
      a: 'Completely safe! We will NEVER ask for your password, email, or account credentials. Construction takes place strictly within the game using Bloxburg\'s native features: you add us on Roblox and grant temporary "Co-Owner" permissions on your plot while we are in the server.',
    },
    {
      q: 'What happens if I run out of Bloxburg Cash mid-build?',
      a: 'We review your Bloxburg Cash balance with you before starting. If during the session you need a quick break to deliver pizzas and earn more funds for the garden or pool, we simply pause and resume when you are ready.',
    },
    {
      q: 'What if I do not own all the recommended Gamepasses?',
      a: 'We can adapt almost any design. If you lack "Multiple Floors", we can translate the aesthetic to an expansive single-story layout. If you lack "Advanced Placing", we adjust decor placement so it aligns beautifully with standard snapping.',
    },
    {
      q: 'How do I pay for the building service fee?',
      a: 'Payment is made via bank transfer. Construction of your house begins once the payment has been successfully processed. There are no refunds.',
    },
  ];

  return (
    <section id="process" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest text-[#86efac] uppercase font-mono mb-2">
            HAUSBURG Methodology
          </p>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            How the Service Works
          </h2>
          <p className="font-body text-sm sm:text-base text-[#a9bfae] mt-3">
            A streamlined, transparent, and secure 4-step workflow designed to deliver your dream Bloxburg home effortlessly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="liquid-glass-card rounded-2xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-brand text-2xl font-black text-[#86efac]/80 group-hover:text-[#86efac] transition-colors">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl liquid-glass border border-white/15 flex items-center justify-center text-white">
                    <Icon className="w-4 h-4 text-[#86efac]" />
                  </div>
                </div>

                <div>
                  <h3 className="font-brand text-lg font-bold text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#86efac] mb-3">
                    {step.short}
                  </p>
                  <p className="text-xs text-[#a3b899] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#718d78]">
                  <Check className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>HAUSBURG Quality Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Banner with Security highlight */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 mb-20">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#86efac]/20 border border-[#86efac]/40 flex items-center justify-center flex-shrink-0 text-[#86efac]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-brand text-xl font-bold text-white">
                  Account Privacy & Security Guarantee
                </h4>
                <p className="text-xs sm:text-sm text-[#a3b899] mt-1 max-w-2xl leading-relaxed">
                  You retain complete custody of your Roblox account at all times. Construction is carried out purely via in-game Co-Owner permissions that you grant and can revoke at any second.
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="liquid-glass-btn-primary px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold whitespace-nowrap"
            >
              Schedule My Build
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-brand text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#86efac]" /> Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#9bb3a0] mt-1">
              Everything you need to know before initiating your build session
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="liquid-glass rounded-xl border border-white/10 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="font-brand text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#86efac] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#a3b899] flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#b8ccbd] leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
