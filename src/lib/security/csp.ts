/**
 * Builds a per-request Content-Security-Policy.
 * Uses nonces + strict-dynamic so script-src can omit unsafe-inline / unsafe-eval in production.
 */
export function buildContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    // Host allowlists are ignored by CSP3 when strict-dynamic is present; kept for older browsers.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://js.paystack.co https://vercel.live`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.paystack.co https://vercel.live wss://*.vercel.live",
    "frame-src 'self' https://js.paystack.co https://checkout.paystack.com https://*.paystack.com https://vercel.live",
    "upgrade-insecure-requests",
  ].join("; ");
}
