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
      "https://groovydecember.ng"
    ],
    "font-src": [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    "connect-src": [
      "'self'",
      "https://www.google-analytics.com",
      "https://api.paystack.co",
      "https://api.monnify.com",
      "https://js.stripe.com",
      // Allow Supabase API and realtime connections. If NEXT_PUBLIC_SUPABASE_URL is set
      // in the environment we include it so the deployed site can connect to Supabase.
      (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxakewiiobmlyzmzrshb.supabase.co'),
      // WebSocket endpoint for realtime (wss)
      (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxakewiiobmlyzmzrshb.supabase.co').replace(/^https?:/, 'wss:')
    ],
    "frame-src": [
      "'self'",
      "https://js.stripe.com"
    ],
    "media-src": ["'self'"],
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
