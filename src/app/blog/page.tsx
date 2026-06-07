import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/content/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on web design, e-commerce, SEO, and marketing for Ghanaian business owners.",
};

export default function BlogIndexPage() {
  return (
    <main className="agency-landing min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-200 bg-[#F1F2F2]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-sm font-bold text-[#051B2E] hover:text-[#0693e3]">
            ← The Steward Jamal Agency
          </Link>
          <Link
            href="/#proposal"
            className="rounded-sm bg-[#FFCC53] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#051B2E]"
          >
            Request a quote
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">Insights & guides</p>
        <h1 className="mt-2 text-3xl font-bold text-[#051B2E] sm:text-4xl">Articles for Ghanaian business owners</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Practical notes on websites, e-commerce, SEO, and marketing—written for teams building or improving their online presence.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute left-4 top-4 rounded bg-white px-2 py-1 text-xs font-bold text-[#051B2E]">
                    {post.date}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#0693e3]">{post.category}</p>
                  <h2 className="mt-2 text-sm font-bold leading-snug text-[#051B2E] group-hover:text-[#0693e3]">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-xs text-zinc-600">{post.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-[#0693e3]">Read article →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
