export const securityConfig = {
  // Content Security Policy
  csp: {
    "default-src": ["'self'"],

    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://js.stripe.com"
    ],

    "style-src": [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],

    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://images.unsplash.com",
      "https://groovydecember.ng",
      // Supabase Storage and avatars
      "https://*.supabase.co"
    ],

    "font-src": [
      "'self'",
      "https://fonts.gstatic.com"
    ],

    "connect-src": [
      "'self'",
      // Supabase REST API
      "https://*.supabase.co",
      // Allow environment-based Supabase URL during runtime builds
      (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oxakewiiobmlyzmzrshb.supabase.co"),
      // Supabase Realtime WS
      (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oxakewiiobmlyzmzrshb.supabase.co").replace(/^https?:/, "wss:"),
      // Analytics, payments
      "https://www.google-analytics.com",
      "https://api.paystack.co",
      "https://api.monnify.com",
      "https://js.stripe.com"
    ],

    "frame-src": [
      "'self'",
      "https://*.supabase.co",
      "https://js.stripe.com"
    ],

    "media-src": [
      "'self'",
      "https://*.supabase.co"
    ],

    "object-src": ["'none'"]
  },

  // Security Headers
  headers: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  }
};