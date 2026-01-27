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

function buildPropertyDescription(property: any) {
  if (!property) {
    return "Find verified properties on Proptriz Hub.";
  }

  const parts: string[] = [];

  if (property.category && property.listed_for) {
    parts.push(
      `${property.category} for ${property.listed_for}`
    );
  }

  if (property.address) {
    parts.push(`Located at ${property.address}`);
  }

  let summary = parts.join(". ");

  if (property.description) {
    const trimmed =
      property.description.length > 140
        ? property.description.slice(0, 140) + "…"
        : property.description;

    summary = summary
      ? `${summary}. ${trimmed}`
      : trimmed;
  }

  return summary || "Find verified properties on Proptriz Hub.";
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params;

  const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3400";


  try {
    const property = await getPropertyCached(id);

    const fallbackOgImage = `${siteUrl}/logo.png`;

    const ogImage =
      property?.banner
        ? property.banner.startsWith("http")
          ? property.banner
          : `${siteUrl}${property.banner}`
        : property?.images?.[0]
          ? property.images[0]
          : fallbackOgImage;

    const description = buildPropertyDescription(property);

    return {
      metadataBase: new URL(siteUrl),

      title: property?.title
        ? `${property.title} | Proptriz Hub`
        : "Property Details | Proptriz Hub",

      description,

      alternates: {
        canonical: `/property/details/${id}`,
      },

      openGraph: {
        title: property?.title || "Property Details",
        description,
        url: `/property/details/${id}`,
        siteName: "Proptriz Hub",
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: property?.title || "Proptriz Property",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: property?.title || "Property Details",
        description,
        images: [ogImage],
      },
    } 
  } catch (error) {
    // ✅ NEVER fail page due to metadata
    return {
      title: "Property Details | Proptriz Hub",
      description: "View verified property listings on Proptriz Hub.",
      openGraph: {
        title: "Property Details",
        description: "View verified property listings on Proptriz Hub.",
        images: [`${siteUrl}/logo.png`],
      }
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyCached(id);

  return property? 
    <PropertyDetailsClient property={property} /> :
    <div>
      No property Found
    </div>;
}