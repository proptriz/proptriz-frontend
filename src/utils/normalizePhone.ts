export function normalizePhone(raw: string): string | null {
  if (!raw) return null;

  let phone = String(raw).replace(/[^\d+]/g, "");

  // Already international
  if (phone.startsWith("+") && phone.length >= 11) {
    return phone;
  }

  // Nigeria local format: 080xxxxxxxx
  if (/^0\d{10}$/.test(phone)) {
    return `+234${phone.slice(1)}`;
  }

  // Country code without +
  if (/^\d{11,15}$/.test(phone)) {
    return `+${phone}`;
  }

  return null;
}