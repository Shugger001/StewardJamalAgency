import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "neutral";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" &&
          "border-[#0A66FF]/20 bg-[#0A66FF]/5 text-[#0A66FF]",
        variant === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        variant === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-900",
        variant === "neutral" &&
          "border-zinc-200 bg-zinc-50 text-zinc-700",
        className,
      )}
      {...props}
    />
  );
}
