import type { Metadata } from "next";
import { cache } from "react";
import PropertyDetailsClient from "@/components/PropertyDetailsClient";
import { getPropertyById } from "@/services/propertyApi";

const getPropertyCached = cache(async (id: string) => {
  return getPropertyById(id);
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params;

  const property = await getPropertyCached(id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3400";

  // fallback OG image (put this image in /public/og-default.jpg)
  const fallbackOgImage = `${siteUrl}/logo.png`;

  const ogImage =
    property?.banner ||
    property?.images?.[0] ||
    fallbackOgImage;

  return {
    metadataBase: new URL(siteUrl),
    title: property?.title || "Property Details",
    description:
      property?.description ||
      "Find verified properties on Proptriz Hub.",

    openGraph: {
      title: property?.title || "Property Details",

      description:
        property?.description ||
        "Find verified properties on Proptriz Hub.",

      url: `/property/details/${id}`,

      images: [
        {
          url: ogImage, // always available now
          width: 1200,
          height: 630,
          alt: property?.title || "Proptriz Hub Property",
        },
      ],
      
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: property?.title || "Property Details",
      description:
        property?.description ||
        "Find verified properties on Proptriz Hub.",
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const property = await getPropertyCached(id);

  return <PropertyDetailsClient property={property} />;
}
