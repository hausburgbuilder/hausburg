import { useState, useEffect } from 'react';
import { House, HOUSES } from '../data/houses';
import { ContactFormData, DESIGNATED_EMAIL, generateOrderCode, generateMailtoLink, validateContactForm } from '../utils/contactValidation';
import { Send, Mail, User, AtSign, MessageSquare, Home, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  initialHouse?: House | null;
  houses?: House[];
  onSuccessSubmit: (data: ContactFormData, orderCode: string, mailtoLink: string) => void;
}

export function ContactSection({ initialHouse, houses = HOUSES, onSuccessSubmit }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    robloxUsername: '',
    houseId: initialHouse ? initialHouse.id : 'custom',
    houseName: initialHouse ? initialHouse.name : 'Custom Commission from Scratch',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if initialHouse changes
  useEffect(() => {
    if (initialHouse) {
      setFormData((prev) => ({
        ...prev,
        houseId: initialHouse.id,
        houseName: initialHouse.name,
      }));
    }
  }, [initialHouse]);

  const handleHouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setFormData((prev) => ({
        ...prev,
        houseId: 'custom',
        houseName: 'Custom Commission from Scratch',
      }));
    } else {
      const found = houses.find((h) => h.id === val);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          houseId: found.id,
          houseName: found.name,
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Provide tactile submit animation
    setTimeout(() => {
      const orderCode = generateOrderCode(formData.houseId);
      const mailto = generateMailtoLink(formData, DESIGNATED_EMAIL);

      setIsSubmitting(false);

      // Trigger automatic mailto client opening as requested
      window.location.href = mailto;

      // Notify parent to display confirmation receipt modal
      onSuccessSubmit(formData, orderCode, mailto);
    }, 450);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-white/10 text-xs text-[#86efac] font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Construction Requests
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Make Your Bloxburg Home a Reality
          </h2>
          <p className="font-body text-sm sm:text-base text-[#a9bfae] mt-3">
            Fill in your details to schedule your building session. Your request will be dispatched automatically and we will get back to you promptly.
          </p>
        </div>

        {/* Liquid Glass Form Container */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#86efac]/10 rounded-full blur-[90px] pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3d6c7] mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="e.g. Sophia Martinez"
                  className={`w-full px-4 py-3 rounded-xl text-sm text-white bg-black/40 border transition-colors focus:outline-none ${
                    errors.fullName ? 'border-red-400' : 'border-white/15 focus:border-[#86efac]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3d6c7] mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Contact Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-3 rounded-xl text-sm text-white bg-black/40 border transition-colors focus:outline-none ${
                    errors.email ? 'border-red-400' : 'border-white/15 focus:border-[#86efac]'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Roblox Username */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3d6c7] mb-2 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Roblox Username *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.robloxUsername}
                  onChange={(e) => {
                    setFormData({ ...formData, robloxUsername: e.target.value });
                    if (errors.robloxUsername) setErrors({ ...errors, robloxUsername: '' });
                  }}
                  placeholder="Your @username in Roblox (e.g. BloxBuilder24)"
                  className={`w-full px-4 py-3 rounded-xl text-sm text-white bg-black/40 border transition-colors focus:outline-none ${
                    errors.robloxUsername ? 'border-red-400' : 'border-white/15 focus:border-[#86efac]'
                  }`}
                />
                {errors.robloxUsername && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.robloxUsername}</p>
                )}
                <span className="text-[10px] text-[#8aa591] mt-1 block">
                  Used to send you a friend request and join your Bloxburg plot.
                </span>
              </div>

              {/* Selected House / Model */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3d6c7] mb-2 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Selected Model</span>
                </label>
                <select
                  value={formData.houseId}
                  onChange={handleHouseChange}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white bg-[#132016] border border-white/15 focus:border-[#86efac] focus:outline-none cursor-pointer"
                >
                  <option value="custom">Custom Commission from Scratch</option>
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} (${h.priceUSD} USD · ~{h.bloxburgCashEst.toLocaleString()} $B)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#8aa591] mt-1 block">
                  Select a catalog design or request a custom architectural commission.
                </span>
              </div>

            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#c3d6c7] mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#86efac]" />
                <span>Message Box (Comments, availability, or custom notes) *</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                placeholder="Let us know your available play times, if you have the required gamepasses, or any specific requests for your home..."
                className={`w-full px-4 py-3 rounded-xl text-sm text-white bg-black/40 border transition-colors focus:outline-none resize-none ${
                  errors.message ? 'border-red-400' : 'border-white/15 focus:border-[#86efac]'
                }`}
              />
              {errors.message && (
                <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="liquid-glass-btn-primary px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-xl"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
