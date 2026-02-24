import L from "leaflet";

type PriceMarkerOptions = {
  price: number;
  listedFor: "rent" | "sale";
  isSelected?: boolean;
};

export function createPriceIcon({
  price,
  listedFor,
  isSelected = false,
}: PriceMarkerOptions) {
  const formattedPrice = formatPrice(price);

  const bgColor =
    listedFor === "rent" ? "#2563EB" : "#111827"; // blue for rent, dark for sale

  const selectedClass = isSelected ? "price-marker-selected" : "";

  return L.divIcon({
    className: "price-marker-wrapper",
    html: `
      <div class="price-marker-inner ${selectedClass}" 
           style="background:${bgColor}">
        ${formattedPrice}
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 32],
  });
}

function formatPrice(price: number) {
  if (price >= 1_000_000) return "₦" + (price / 1_000_000).toFixed(1) + "M";
  if (price >= 1_000) return "₦" + (price / 1_000).toFixed(0) + "K";
  return "₦" + price;
}