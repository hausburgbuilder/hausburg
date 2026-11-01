import { useState } from 'react';
import { ContactFormData, formatClipboardMessage, DESIGNATED_EMAIL } from '../utils/contactValidation';
import { CheckCircle2, Copy, Check, ExternalLink, X, Mail } from 'lucide-react';

interface OrderConfirmationModalProps {
  orderData: {
    formData: ContactFormData;
    orderCode: string;
    mailtoLink: string;
  } | null;
  onClose: () => void;
}

export function OrderConfirmationModal({ orderData, onClose }: OrderConfirmationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!orderData) return null;

  const { formData, orderCode, mailtoLink } = orderData;

  const handleCopy = () => {
    const text = formatClipboardMessage(formData, orderCode);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg liquid-glass-card rounded-3xl border border-[#86efac]/30 shadow-2xl p-6 sm:p-8 text-left my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 liquid-glass p-2 rounded-full text-white/80 hover:text-white"
          aria-label="Close confirmation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#86efac]/20 border border-[#86efac]/40 flex items-center justify-center text-[#86efac] mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="font-brand text-2xl font-black text-white">
          Request Successfully Registered!
        </h3>
        <p className="text-xs text-[#a3b899] mt-1 font-body">
          We have generated your building order with an official folio reference.
        </p>

        {/* Ticket Summary */}
        <div className="mt-5 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-[#8ba391]">Request Folio:</span>
            <span className="font-mono font-bold text-[#86efac] text-sm">
              #{orderCode}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8ba391]">Selected Model:</span>
            <span className="font-semibold text-white text-right">{formData.houseName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8ba391]">Client Name:</span>
            <span className="text-white">{formData.fullName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8ba391]">Roblox Username:</span>
            <span className="font-mono text-white">@{formData.robloxUsername}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8ba391]">Response Email:</span>
            <span className="text-white">{formData.email}</span>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
            <span className="text-[#8ba391]">Status:</span>
            <span className="text-[#86efac] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sent via Formspree
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onClose}
            className="liquid-glass-btn-primary py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 text-center cursor-pointer"
          >
            <span>Understood & Close</span>
          </button>

          <button
            onClick={handleCopy}
            className="liquid-glass-btn py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold text-white flex items-center justify-center gap-2 hover:text-[#86efac]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#86efac]" />
                <span className="text-[#86efac]">Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy text for Discord / Roblox chat</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#718d78]">
          We will review your message and reach out shortly to schedule the construction session.
        </p>

      </div>
    </div>
  );
}

