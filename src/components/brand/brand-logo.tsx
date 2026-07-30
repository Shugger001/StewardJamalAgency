import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO = {
  full: "/brand/steward-jamal-logo.png",
  header: "/brand/steward-jamal-header.png",
  mark: "/brand/steward-jamal-mark.png",
} as const;

type BrandLogoProps = {
  /** header = horizontal lockup; full = stacked logo; mark = SJ monogram only */
  variant?: keyof typeof LOGO;
  href?: string | null;
  className?: string;
  /** Height in pixels for the image (width scales). */
  height?: number;
  priority?: boolean;
};

/**
 * Official Steward Jamal Agency mark / lockup.
 * Prefer `header` in nav bars; `full` for light footers or about; `mark` for compact chrome.
 */
export function BrandLogo({
  variant = "header",
  href = "/",
  className,
  height,
  priority = false,
}: BrandLogoProps) {
  const src = LOGO[variant];
  const h =
    height ??
    (variant === "header" ? 48 : variant === "mark" ? 40 : 96);
  const aspect =
    variant === "header" ? 440 / 56 : variant === "mark" ? 573 / 330 : 1;
  const w = Math.round(h * aspect);

  const image = (
    <Image
      src={src}
      alt="Steward Jamal Agency"
      width={w}
      height={h}
      priority={priority}
      className={cn("h-auto w-auto object-contain object-left", className)}
      style={{ height: h, width: "auto" }}
    />
  );

  if (href === null) return image;

  return (
    <Link href={href} className="inline-flex min-w-0 shrink-0 items-center" aria-label="Steward Jamal Agency home">
      {image}
    </Link>
  );
}
