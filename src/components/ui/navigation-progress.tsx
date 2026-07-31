"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin top progress bar during client-side navigations so the UI never feels frozen.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams?.toString() ?? ""}`;

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target && anchor.target !== "_self") return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      } catch {
        return;
      }
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setVisible(true);
      setActive(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!active && !visible) return;
    setActive(false);
    hideTimer.current = setTimeout(() => setVisible(false), 280);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [routeKey]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent"
      aria-hidden
    >
      <div
        className={`h-full origin-left bg-[#1860F0] shadow-[0_0_8px_rgba(24,96,240,0.55)] transition-[width,opacity] duration-300 ease-out ${
          active ? "nav-progress-active w-[70%] opacity-100" : "w-full opacity-0"
        }`}
      />
    </div>
  );
}
