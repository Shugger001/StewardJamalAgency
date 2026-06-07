import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileMenuButtonProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
  "aria-controls"?: string;
};

function HamburgerIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
      <path d="M1 2h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 8h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 14h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MobileMenuButton({
  open,
  onClick,
  className,
  "aria-controls": ariaControls,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:bg-zinc-50",
        className,
      )}
      aria-expanded={open}
      aria-controls={ariaControls}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onClick}
    >
      {open ? (
        <X className="h-5 w-5" strokeWidth={2} strokeLinecap="round" />
      ) : (
        <HamburgerIcon />
      )}
    </button>
  );
}
