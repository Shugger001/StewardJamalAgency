import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog-posts";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "https://steward-jamal-agency-eidc.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/services/web-development",
    "/services/ecommerce",
    "/services/seo",
    "/services/digital-marketing",
    "/portfolio",
    "/pricing",
    "/blog",
    "/contact",
    "/login",
    "/signup",
    "/privacy",
    "/terms",
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
