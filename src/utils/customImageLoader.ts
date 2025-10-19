// utils/customImageLoader.ts
export default function customImageLoader({ src }: { src: string }) {
  if (!src) return "/placeholder.jpg";

  let cleanUrl = src.trim();

  if (cleanUrl.startsWith("//")) {
    cleanUrl = `http:${cleanUrl}`;
  }

  if (process.env.NODE_ENV === "development") {
    cleanUrl = cleanUrl.replace(/^https:\/\//, "http://");
  } else {
    cleanUrl = cleanUrl.replace(/^http:\/\//, "https://");
  }

  return cleanUrl;
}
