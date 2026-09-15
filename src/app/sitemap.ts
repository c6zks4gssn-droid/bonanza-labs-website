import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.bonanza-labs.com";

  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/oplossingen`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tradeflow`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/serveflow`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/bonanza-voice`, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/pricing`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/portfolio`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/over-ons`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/voorwaarden`, changeFrequency: "yearly", priority: 0.35 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.35 },
  ];

  const articles: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...corePages, ...articles];
}
