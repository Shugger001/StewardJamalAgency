export function formatAuthServiceError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "";

  const lowered = message.toLowerCase();

  if (
    lowered.includes("fetch failed") ||
    lowered.includes("enotfound") ||
    lowered.includes("network") ||
    lowered.includes("connection") ||
    lowered.includes("timeout") ||
    lowered.includes("econnrefused")
  ) {
    return "We couldn't reach the authentication service. The Supabase project may be paused, deleted, or misconfigured. Please contact support or try again later.";
  }

  if (message === "Database error saving new user") {
    return "Unable to create account due to current database auth trigger configuration. Please contact support to verify the Supabase new-user trigger.";
  }

  if (message === "Supabase auth is not configured in this environment.") {
    return message;
  }

  return message || "Unable to complete this request right now. Please try again.";
}
