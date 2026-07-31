export type PortfolioItemInput = {
  title: string;
  client_name: string;
  url: string;
  summary: string | null;
  outcome: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

/** Normalize typed domains into absolute https URLs. */
export function normalizePortfolioUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function asOptionalString(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

/**
 * Validate portfolio create/update payloads. Pass `partial` for PATCH.
 */
export function parsePortfolioItemInput(
  body: unknown,
  options?: { partial?: boolean },
): { data: Partial<PortfolioItemInput> } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid portfolio item." };
  }

  const raw = body as Record<string, unknown>;
  const partial = Boolean(options?.partial);
  const result: Partial<PortfolioItemInput> = {};

  if ("title" in raw || !partial) {
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    if (!title || title.length < 2) return { error: "Title is required." };
    if (title.length > 120) return { error: "Title is too long." };
    result.title = title;
  }

  if ("client_name" in raw || !partial) {
    const clientName = typeof raw.client_name === "string" ? raw.client_name.trim() : "";
    if (!clientName || clientName.length < 2) {
      return { error: "Client or brand name is required." };
    }
    if (clientName.length > 120) return { error: "Client name is too long." };
    result.client_name = clientName;
  }

  if ("url" in raw || !partial) {
    const url = typeof raw.url === "string" ? raw.url.trim() : "";
    if (!url || !isHttpUrl(url)) return { error: "Enter a valid website URL." };
    if (url.length > 500) return { error: "URL is too long." };
    result.url = url;
  }

  if ("summary" in raw) {
    const summary = asOptionalString(raw.summary);
    if (summary && summary.length > 600) return { error: "Summary is too long." };
    result.summary = summary;
  } else if (!partial) {
    result.summary = null;
  }

  if ("outcome" in raw) {
    const outcome = asOptionalString(raw.outcome);
    if (outcome && outcome.length > 240) return { error: "Outcome is too long." };
    result.outcome = outcome;
  } else if (!partial) {
    result.outcome = null;
  }

  if ("image_url" in raw) {
    const imageUrl = asOptionalString(raw.image_url);
    if (imageUrl) {
      try {
        const parsed = new URL(imageUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return { error: "Image URL must be a valid http(s) link." };
        }
      } catch {
        return { error: "Image URL must be a valid http(s) link." };
      }
      if (imageUrl.length > 500) return { error: "Image URL is too long." };
    }
    result.image_url = imageUrl;
  } else if (!partial) {
    result.image_url = null;
  }

  if ("sort_order" in raw) {
    const sortOrder = Number(raw.sort_order ?? 0);
    if (!Number.isFinite(sortOrder) || sortOrder < 0 || sortOrder > 9999) {
      return { error: "Sort order must be between 0 and 9999." };
    }
    result.sort_order = Math.floor(sortOrder);
  } else if (!partial) {
    result.sort_order = 0;
  }

  if ("is_published" in raw) {
    result.is_published = Boolean(raw.is_published);
  } else if (!partial) {
    result.is_published = true;
  }

  return { data: result };
}
