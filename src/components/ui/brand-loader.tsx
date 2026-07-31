import { cn } from "@/lib/utils";

type BrandLoaderProps = {
  label?: string;
  className?: string;
  /** full = centered page panel; inline = compact for cards */
  variant?: "full" | "inline";
};

/**
 * Branded loading indicator (cobalt ring + gold accent).
 * Honors prefers-reduced-motion via CSS.
 */
export function BrandLoader({
  label = "Loading…",
  className,
  variant = "full",
}: BrandLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        variant === "full" && "min-h-[50vh] w-full px-4 py-16",
        variant === "inline" && "py-8",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="brand-loader-ring" aria-hidden>
        <span className="brand-loader-ring__track" />
        <span className="brand-loader-ring__accent" />
        <span className="brand-loader-ring__core">SJ</span>
      </div>
      <p className="text-sm font-medium text-zinc-600">{label}</p>
    </div>
  );
}
