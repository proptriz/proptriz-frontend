export type SharePayload = {
  title: string;
  text?: string;
  url: string;
};

export async function nativeShare(payload: SharePayload) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(payload);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export const shareLinks = {
  whatsapp: (url: string, text?: string) =>
    `https://wa.me/?text=${encodeURIComponent(
      [text, url].filter(Boolean).join("\n")
    )}`,

  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,

  twitter: (url: string, text?: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text || "")}`,

  telegram: (url: string, text?: string) =>
    `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text || "")}`,
};

