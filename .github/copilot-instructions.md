# Groovy December Festival - AI Coding Instructions

## Project Overview
This is a Next.js 15 (App Router) festival management application for "Groovy December 2025", built with TypeScript, Tailwind CSS 4, and Supabase as the backend. The app manages events, vendor registrations, pageant contestants, diaspora tours, and includes a comprehensive admin system.

## Architecture & Key Components

### Database Integration
- **Primary**: Supabase client (`src/lib/supabaseClient.ts`) for public operations
- **Admin**: Supabase admin client (`src/lib/supabaseAdminServer.ts`) for privileged operations
- **Auth**: Custom admin token verification system (`src/lib/adminAuth.ts`)

### Route Structure
- **Public Routes**: `/events`, `/vendors`, `/pageant`, `/diaspora`, `/sponsors`
- **Admin Routes**: `/admin/*` with protected layout and sidebar navigation
- **API Routes**: `/api/admin/*` for server-side operations with token auth

### Form Handling Pattern
**Critical**: All form submissions use FormData capture pattern to prevent React event pooling issues:
```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget; // Capture immediately!
  const formData = new FormData(form);
  // ... async operations
  form.reset(); // Safe to use captured reference
};
```

## Development Conventions

### Styling System
- **Theme Colors**: Primary brand color `#FF3D00` (orange-red), secondary green `#16a34a`
- **Component Library**: Custom UI components in `src/components/ui/` (Button, Card, Input, Modal)
- **Responsive**: Mobile-first with `md:` and `lg:` breakpoints
- **Shadows**: Consistent use of `shadow-md` and `hover:shadow-lg`

### File Upload Pattern
Uses Supabase Storage with path structure: `bucket/email_or_category/timestamp_filename`:
```tsx
const filePath = `contestants/${email}/${label}_${Date.now()}_${file.name}`;
const { data } = await supabase.storage.from("bucket").upload(filePath, file);
const publicUrl = supabase.storage.from("bucket").getPublicUrl(data.path);
```

### Admin Authentication Flow
1. Magic link login via `/admin/login`
2. Token verification through `verifyAdminToken()` helper
3. Bearer token in API headers: `Authorization: Bearer ${token}`
4. Admin access controlled by `admins` table lookup

### Error Handling Convention
- User-facing: Emoji prefixes (`✅ Success!`, `❌ Error:`)
- Console logging: Detailed error objects for debugging
- Loading states: Disabled buttons with "Loading..." text

## Key Files & Patterns

### Component Patterns
- **Server Components**: Data fetching pages (e.g., `src/app/events/page.tsx`)
- **Client Components**: Interactive forms and modals (marked with `"use client"`)
- **Layouts**: Admin sidebar in `src/app/admin/layout.tsx`, public header in `src/app/layout.tsx`

### Database Schema Assumptions
- Tables: `events`, `registrations`, `vendors`, `pageant_contestants`, `tours`, `tour_bookings`, `admins`
- Storage buckets: `event-banners`, `pageant-files`
- Foreign keys: `event_id`, `tour_id` for relationships

### Development Commands
```bash
npm run dev --turbopack    # Development server with Turbopack
npm run build --turbopack  # Production build with Turbopack
npm run lint              # ESLint with Next.js config
```

## Important Implementation Notes

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled with ES2017 target
- Next.js plugin for enhanced TypeScript support

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### File Structure Logic
- `src/app/` - Next.js App Router pages and API routes
- `src/components/ui/` - Reusable UI components with consistent prop interfaces
- `src/lib/` - Utility functions and service integrations
- `public/assets/` - Static images for sponsors, team photos, and branding

When extending this codebase, maintain the established patterns for form handling, error messaging, styling consistency, and admin authentication flow.