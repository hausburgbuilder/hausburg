export interface ContactFormData {
  fullName: string;
  email: string;
  robloxUsername: string;
  houseId: string;
  houseName: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    fullName?: string;
    email?: string;
    robloxUsername?: string;
    message?: string;
  };
}

export const DESIGNATED_EMAIL = 'juanpetrosino25@gmail.com';

export function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (minimum 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. you@domain.com).';
  }

  if (!data.robloxUsername || data.robloxUsername.trim().length < 3) {
    errors.robloxUsername = 'Please enter your Roblox username to coordinate in Bloxburg.';
  }

  if (!data.message || data.message.trim().length < 5) {
    errors.message = 'Please provide a short message or your availability (minimum 5 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateOrderCode(houseId: string): string {
  const prefix = 'HAU';
  const cleanId = (houseId || 'GEN').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${cleanId}-${randomNum}`;
}

export function generateMailtoLink(
  data: ContactFormData,
  recipient: string = DESIGNATED_EMAIL
): string {
  const subject = encodeURIComponent(`[HAUSBURG Bloxburg] House Build Request: ${data.houseName}`);
  const bodyText = [
    `Hello HAUSBURG Team,`,
    ``,
    `I would like to request the construction of the following home in Bloxburg:`,
    `--------------------------------------------------`,
    `Selected Model: ${data.houseName}`,
    `Client Name: ${data.fullName}`,
    `Contact Email: ${data.email}`,
    `Roblox Username: @${data.robloxUsername}`,
    `--------------------------------------------------`,
    `Message / Additional Details:`,
    `${data.message}`,
    `--------------------------------------------------`,
    `Sent from the official HAUSBURG Bloxburg website.`,
  ].join('\n');

  return `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

export function formatClipboardMessage(data: ContactFormData, orderCode: string): string {
  return [
    `🏠 **HAUSBURG BLOXBURG BUILD REQUEST** [Folio: #${orderCode}]`,
    `• Model: ${data.houseName}`,
    `• Client: ${data.fullName}`,
    `• Email: ${data.email}`,
    `• Roblox: @${data.robloxUsername}`,
    `• Message: ${data.message}`,
  ].join('\n');
}
