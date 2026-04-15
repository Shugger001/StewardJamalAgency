"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  FolderKanban,
  Globe,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/websites", label: "Websites", icon: Globe },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const isLg = useMediaQuery("(min-width: 1024px)");
  const rail = collapsed && isLg;

  const content = (
    <div className="flex h-full flex-col border-r border-zinc-200/80 bg-white">
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-zinc-100 px-3",
          rail ? "justify-center" : "justify-between gap-2",
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50",
            rail && "justify-center px-0",
          )}
          onClick={onCloseMobile}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A66FF] text-xs font-semibold text-white">
            SJ
          </span>
          {!rail && (
            <span className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              Steward Jamal
            </span>
          )}
        </Link>
        {!rail && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:inline-flex"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {rail && (
        <div className="hidden border-b border-zinc-100 px-2 py-2 lg:flex lg:justify-center">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {nav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#0A66FF]/8 text-[#0A66FF]"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                rail && "justify-center px-0",
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  active ? "text-[#0A66FF]" : "text-zinc-400 group-hover:text-zinc-600",
                )}
              />
              {!rail && (
                <span className="truncate">{item.label}</span>
              )}
              {active && !rail && (
                <motion.span
                  layoutId="nav-active"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0A66FF]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-zinc-100 p-3", rail && "px-2")}>
        <div
          className={cn(
            "rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-500",
            rail && "px-2 text-center",
          )}
        >
          {!rail ? (
            <>
              <p className="font-medium text-zinc-700">Internal</p>
              <p className="mt-0.5 leading-relaxed">Agency operations</p>
            </>
          ) : (
            <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Int
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white transition-[transform,width] duration-200 ease-out lg:static lg:translate-x-0",
          rail ? "lg:w-[4.5rem]" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {content}
      </aside>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      )}
    </>
  );
}
