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
      "https://js.stripe.com"
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
