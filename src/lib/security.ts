// Security configuration for production deployment

export const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      "'unsafe-eval'", // Required for development
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://tagmanager.google.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': [
      "'self'",
      'data:',
      'https://images.unsplash.com',
      'https://groovydecember.ng',
      'https://supabase.com',
    ],
    'connect-src': [
      "'self'",
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://*.supabase.co',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://stats.g.doubleclick.net',
      'https://region1.google-analytics.com',
    ].filter(Boolean),
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },

  // Security Headers
  headers: {
    'X-DNS-Prefetch-Control': 'on',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://groovydecember.ng', 'https://www.groovydecember.ng']
      : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // Session Configuration
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Password Requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },

  // File Upload Security
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ],
    scanForMalware: true,
  },

  // API Security
  api: {
    enableRateLimit: true,
    enableCors: true,
    requireAuth: {
      '/api/admin/*': ['admin'],
      '/api/vendor/*': ['vendor', 'admin'],
      '/api/contestant/*': ['contestant', 'admin'],
    },
  },
};

export default securityConfig;