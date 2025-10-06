# Pageant System Documentation

## Overview
Complete pageant management system with public-facing registration, contestant showcase, and admin management capabilities.

## Features Completed

### 🏆 Public Pageant Pages
- **Landing Page** (`/pageant`) - Hero section with competition information and call-to-actions
- **Registration Form** (`/pageant/register`) - Multi-step application process with file uploads
- **Contestants Showcase** (`/pageant/contestants`) - Public gallery with search and filtering
- **Individual Profiles** (`/pageant/contestants/[id]`) - Detailed contestant information pages

### 📝 Registration System
- **5-Step Application Process**:
  1. Personal Information (name, contact, demographics)
  2. Emergency Contact & Physical Details (measurements, contact info)
  3. Background & Platform (biography, cause, achievements)
  4. File Uploads (headshot, full-body photo, ID proof)
  5. Terms & Agreement (consent and final submission)

- **Features**:
  - Real-time form validation
  - Progress tracking with visual indicators
  - File upload with Supabase Storage integration
  - Comprehensive data collection matching database schema
  - Mobile-responsive design

### 👥 Contestant Management
- **Public Showcase Features**:
  - Search by name functionality
  - Filter by nationality
  - Approved contestants only (status filtering)
  - Age calculation from birth date
  - Professional card layouts with hover effects
  - Responsive grid design

- **Individual Profile Pages**:
  - Comprehensive contestant information display
  - Photo galleries (headshot and full-body)
  - Biography and platform sections
  - Quick facts sidebar
  - Social media integration
  - Support and engagement CTAs

### 🔧 Admin Integration
- Connected to existing admin system
- Status management (pending, approved, rejected)
- Complete contestant data review capabilities
- File management through Supabase Storage

## Technical Implementation

### Database Schema
```sql
-- Pageant contestants table with all required fields
pageant_contestants (
  id: UUID PRIMARY KEY,
  full_name: TEXT NOT NULL,
  stage_name: TEXT,
  email: TEXT NOT NULL,
  phone: TEXT,
  date_of_birth: DATE,
  place_of_birth: TEXT,
  nationality: TEXT,
  current_address: TEXT,
  social_media_handles: TEXT,
  emergency_contact_name: TEXT,
  emergency_contact_phone: TEXT,
  height: TEXT,
  bust_chest: TEXT,
  waist: TEXT,
  hips: TEXT,
  dress_size: TEXT,
  languages: TEXT,
  biography: TEXT,
  why: TEXT,
  platform: TEXT,
  achievements: TEXT,
  hobbies_skills: TEXT,
  headshot_url: TEXT,
  full_body_url: TEXT,
  proof_of_identity_url: TEXT,
  status: pageant_status DEFAULT 'pending',
  user_id: TEXT,
  terms_accepted: BOOLEAN DEFAULT false,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
```

### File Storage Structure
```
supabase-storage/
├── pageant-files/
│   ├── headshots/
│   ├── fullbody/
│   └── proof/
└── event-banners/
```

### Component Architecture
```
src/app/pageant/
├── page.tsx                    # Landing page with hero and info
├── register/
│   └── page.tsx               # Registration wrapper
├── RegistrationForm.tsx       # Multi-step form component
└── contestants/
    ├── page.tsx              # Contestants showcase
    └── [id]/
        └── page.tsx          # Individual profile pages
```

## Setup Instructions

### 1. Database Setup
Run the SQL commands in `supabase-storage-setup.sql` in your Supabase SQL Editor:
```bash
# Copy and paste the contents of supabase-storage-setup.sql
# This will create storage buckets, policies, and indexes
```

### 2. Storage Buckets
The setup script creates these buckets:
- `pageant-files` - For contestant photos and documents (public)
- `event-banners` - For event promotional images (admin only)

### 3. Environment Variables
Ensure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. File Upload Configuration
The system uses Supabase Storage with these settings:
- Maximum file size: 5MB
- Supported formats: JPG, PNG, PDF
- Automatic file naming with timestamps
- Public read access for approved contestant photos

## User Flows

### Public User Registration
1. Visit `/pageant` - Learn about competition
2. Click "Register Now" → `/pageant/register`
3. Complete 5-step registration process
4. Submit application with required documents
5. Receive confirmation and wait for approval

### Public Contestant Viewing
1. Visit `/pageant/contestants` - Browse all approved contestants
2. Use search and filters to find specific contestants
3. Click on contestant card → `/pageant/contestants/[id]`
4. View detailed profile with photos and information
5. Share and support favorite contestants

### Admin Management
1. Access admin panel → `/admin/pageant`
2. Review pending applications
3. Approve/reject contestants
4. Manage contestant status and information
5. Monitor registration statistics

## Features & Validation

### Form Validation
- Email format validation
- Phone number format checking
- Date of birth validation (age requirements)
- Required field enforcement
- File type and size validation
- Terms acceptance requirement

### Security Features
- Row Level Security (RLS) policies
- File upload restrictions
- User authentication for applications
- Admin-only approval workflow
- Public read access for approved content only

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface elements
- Accessible navigation and forms
- Progressive enhancement

## Performance Optimizations

### Image Handling
- Optimized image loading
- Lazy loading for contestant grids
- Responsive image sizing
- Placeholder images for missing photos

### Database Queries
- Indexed columns for search and filtering
- Efficient pagination (ready for implementation)
- Optimized joins for contestant data
- Cached public content

### User Experience
- Loading states for all async operations
- Error handling with user-friendly messages
- Progress indicators for multi-step forms
- Smooth transitions and animations

## Testing Recommendations

### Manual Testing Checklist
- [ ] Complete registration flow from start to finish
- [ ] File upload functionality for all required documents
- [ ] Search and filter functionality on contestants page
- [ ] Individual profile page loading and display
- [ ] Mobile responsiveness on all screen sizes
- [ ] Form validation for all input fields
- [ ] Admin approval workflow
- [ ] Public visibility of approved contestants only

### Test Data
Use the sample contestant data in `supabase-storage-setup.sql` to test:
- Contestant showcase display
- Search functionality
- Individual profile pages
- Different contestant statuses

## Future Enhancements

### Potential Features
- [ ] Voting system for audience choice awards
- [ ] Social media integration for sharing
- [ ] Email notifications for status updates
- [ ] Advanced search with multiple criteria
- [ ] Contestant comparison feature
- [ ] Mobile app version
- [ ] Live streaming integration for events
- [ ] Sponsor showcase integration
- [ ] Multi-language support
- [ ] Advanced analytics and reporting

### Technical Improvements
- [ ] Image optimization with Next.js Image component
- [ ] Infinite scroll for contestants grid
- [ ] PWA capabilities for mobile users
- [ ] Enhanced SEO with structured data
- [ ] Performance monitoring and optimization
- [ ] Automated testing suite
- [ ] CDN integration for static assets

## Support & Maintenance

### Regular Tasks
- Monitor contestant applications
- Review and approve submissions
- Update competition information
- Manage storage usage
- Performance monitoring

### Troubleshooting
- Check Supabase Storage bucket permissions
- Verify RLS policies are correctly applied
- Monitor file upload limits and usage
- Review error logs for failed submissions

---

This pageant system is now fully functional and ready for production use. The system provides a professional platform for pageant management with comprehensive features for both contestants and administrators.