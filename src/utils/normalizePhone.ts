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

// utils/formatPhone.ts
export const formatPhone = (input: string) => {
  // Keep only digits and leading +
  const cleaned = input.replace(/[^\d+]/g, "");

  // Nigeria example (+234)
  if (!cleaned.startsWith("+")) return cleaned;

  // +234 801 234 5678
  const match = cleaned.match(/^(\+\d{1,3})(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return cleaned;

  return [match[1], match[2], match[3], match[4]]
    .filter(Boolean)
    .join(" ");
};
