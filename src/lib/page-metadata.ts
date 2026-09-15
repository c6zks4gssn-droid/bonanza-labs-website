import type { Metadata } from "next";

/** Keep each page's social cards aligned with its own Open Graph copy. */
export function withPageSocialMetadata(metadata: Metadata): Metadata {
  const title = metadata.openGraph?.title ?? metadata.title;
  const description = metadata.openGraph?.description ?? metadata.description ?? undefined;
  const images = metadata.openGraph?.images ?? ["/og-image.png"];
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images },
    twitter: {
      card: "summary_large_image",
      ...metadata.twitter,
      title: title ?? undefined,
      description,
      images: ["/og-image.png"],
    },
  };
}
