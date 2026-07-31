"use client";

import { Suspense } from "react";
import { NavigationProgress } from "@/components/ui/navigation-progress";

/** Client chrome for in-app navigation feedback. */
export function AppLoadingChrome() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress />
    </Suspense>
  );
}
