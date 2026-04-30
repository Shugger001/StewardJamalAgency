"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionPlaceholderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
};

export function SectionPlaceholder({
  title,
  description,
  actionLabel = "Add item",
  actionHref,
  onActionClick,
  className,
}: SectionPlaceholderProps) {
  const router = useRouter();
  const hasAction = Boolean(actionHref || onActionClick);

  return (
    <div className={cn("mx-auto max-w-7xl space-y-6", className)}>
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage {title.toLowerCase()} from one place.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
              <span className="text-lg font-semibold">—</span>
            </div>
            <h2 className="mt-4 text-sm font-medium text-zinc-900">
              Nothing here yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
            <Button
              variant="primary"
              className="mt-6"
              type="button"
              disabled={!hasAction}
              onClick={() => {
                if (onActionClick) {
                  onActionClick();
                  return;
                }
                if (actionHref) {
                  router.push(actionHref);
                }
              }}
            >
              {actionLabel}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
