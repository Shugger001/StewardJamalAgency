"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { AuthStatusChip } from "@/components/auth/auth-status-chip";
import { cn } from "@/lib/utils";

export type TopbarProps = {
  title: string;
  onMenuClick?: () => void;
};

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setMenuOpen(false);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur-md lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <motion.h1
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-zinc-900"
      >
        {title}
      </motion.h1>

      <div className="flex min-w-0 max-w-[min(100%,12rem)] flex-1 justify-end sm:max-w-none sm:justify-center sm:px-2 lg:max-w-lg">
        <label className="relative w-full">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50/80 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#0A66FF]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20 sm:max-w-md lg:max-w-lg"
          />
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          href="/site"
          className="hidden h-8 items-center rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:inline-flex"
        >
          View site
        </Link>
        <AuthStatusChip />
        <NotificationBell />

        <div className="relative pl-1" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-lg py-1.5 pl-1 pr-2 transition-colors hover:bg-zinc-100",
              menuOpen && "bg-zinc-100",
            )}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0A66FF] to-[#3b8cff] text-xs font-semibold text-white">
              JA
            </span>
            <ChevronDown
              className={cn(
                "hidden h-4 w-4 text-zinc-500 transition-transform sm:block",
                menuOpen && "rotate-180",
              )}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="border-b border-zinc-100 px-3 py-2">
                <p className="text-sm font-medium text-zinc-900">Jamal Steward</p>
                <p className="text-xs text-zinc-500">stewardjamalagency@gmail.com</p>
              </div>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/settings");
                }}
              >
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/settings");
                }}
              >
                Preferences
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
