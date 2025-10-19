// src/utils/sanitizeImageUrl.ts
export const sanitizeImageUrl = (url?: string): string => {
  if (!url) return "/placeholder.png"; // fallback
  if (typeof window !== "undefined" && window.location.protocol === "http:") {
    // convert https → http only for localhost dev
    return url.replace(/^https:\/\//i, "http://");
  }
  return url;
};
