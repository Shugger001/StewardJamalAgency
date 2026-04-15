"use client";

import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string | null;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  async function loadNotifications() {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as {
      notifications: NotificationItem[];
      unreadCount: number;
    };
    setItems(payload.notifications);
    setUnreadCount(payload.unreadCount);
  }

  async function markAsRead(id: string) {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
    if (!response.ok) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          loadNotifications();
        }}
        className="relative rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0A66FF] px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="border-b border-zinc-100 px-3 py-2">
              <p className="text-sm font-semibold text-zinc-900">Notifications</p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {items.length === 0 ? (
                <p className="rounded-lg px-2 py-3 text-sm text-zinc-500">No notifications</p>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => !item.read && markAsRead(item.id)}
                    className={cn(
                      "mb-1 block w-full rounded-lg border px-3 py-2 text-left transition-colors",
                      item.read
                        ? "border-zinc-100 bg-white"
                        : "border-[#0A66FF]/20 bg-[#0A66FF]/5 hover:bg-[#0A66FF]/10",
                    )}
                  >
                    <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-600">{item.message}</p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                    </p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
