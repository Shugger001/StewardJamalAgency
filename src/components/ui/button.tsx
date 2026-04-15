import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66FF] disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-[#0A66FF] text-white hover:bg-[#0954d9]",
          variant === "secondary" &&
            "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
          variant === "outline" &&
            "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
          variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-9 px-4 text-sm",
          size === "lg" && "h-10 px-5 text-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
