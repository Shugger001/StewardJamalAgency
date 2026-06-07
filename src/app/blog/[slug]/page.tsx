import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getBlogPostSlugs } from "@/content/blog-posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <main className="agency-landing min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-200 bg-[#F1F2F2]">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/blog" className="text-sm font-medium text-[#0693e3] hover:underline">
            ← All posts
          </Link>
          <Link href="/" className="text-sm font-bold text-[#051B2E] hover:text-[#0693e3]">
            Home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0693e3]">{post.category}</p>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-[#051B2E] sm:text-3xl lg:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">{post.dateIso}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg shadow-md">
          <Image src={post.image} alt="" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>

        <p className="mt-8 text-base font-medium leading-relaxed text-zinc-700">{post.excerpt}</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-[#DDEDF5] bg-[#DDEDF5]/40 p-6">
          <p className="text-sm font-bold text-[#051B2E]">Ready to grow your business online?</p>
          <p className="mt-2 text-sm text-zinc-600">
            Tell us about your project and we&apos;ll reply with a clear plan and timeline.
          </p>
          <Link
            href="/#proposal"
            className="mt-4 inline-flex h-11 items-center rounded-sm bg-[#ff6900] px-6 text-sm font-bold uppercase tracking-wide text-white"
          >
            Get A Quote
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-zinc-200 bg-[#F1F2F2] py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#051B2E]">Continue reading</h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`} className="text-sm font-medium text-[#0693e3] hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
