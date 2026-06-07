import { DB, LANDING_GUTTER } from "@/lib/public-site-config";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section style={{ backgroundColor: DB.sky }} className="border-b border-zinc-200">
      <div className={`${LANDING_GUTTER} py-12 lg:py-14`}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-bold text-[#051B2E] sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
