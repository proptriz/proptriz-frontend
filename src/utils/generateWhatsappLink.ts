const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export function buildShareUrl(
  pageUrl: string,
  options?: {
    // forces WhatsApp to treat the URL as new (preview refresh)
    bustCache?: boolean;
    // custom cache key, default uses timestamp
    cacheKey?: string;
    // add extra tracking params
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
    };
  }
) {
  const url = new URL(pageUrl);

  if (options?.utm?.source) url.searchParams.set("utm_source", options.utm.source);
  if (options?.utm?.medium) url.searchParams.set("utm_medium", options.utm.medium);
  if (options?.utm?.campaign) url.searchParams.set("utm_campaign", options.utm.campaign);

  if (options?.bustCache) {
    url.searchParams.set("share", options.cacheKey || Date.now().toString());
  }

  return url.toString();
}

export function generateWhatsAppLink(args: {
  phoneNumber?: string; // can be "234..." or "+234..."
  messageTop?: string;  // e.g. "Hello I'm interested in..."
  pageUrl: string;      // product/property URL
  bustCache?: boolean;
}) {
  const raw = args.phoneNumber || DEFAULT_WHATSAPP_NUMBER;
  const phone = String(raw).replace(/[^\d]/g, ""); // removes + and any non-digit chars

  const shareUrl = buildShareUrl(args.pageUrl, {
    bustCache: args.bustCache ?? true,
    utm: { source: "whatsapp", medium: "share" },
  });

  /**
   * WhatsApp preview works best when the URL is on its own line
   * and not wrapped inside other text.
   */
  const text = [
    args.messageTop?.trim(),
    "",
    shareUrl,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
