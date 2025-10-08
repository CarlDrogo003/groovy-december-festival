# Google Analytics 4 (GA4) Setup Guide for Groovy December Festival

## 🚀 Complete Analytics Implementation

Your Groovy December Festival website now has comprehensive analytics tracking with Google Analytics 4, performance monitoring, and custom event tracking specifically designed for festival activities.

## 📊 What's Been Implemented

### 1. Google Analytics 4 (GA4) Integration
- ✅ Complete GA4 setup with enhanced e-commerce tracking
- ✅ Custom event tracking for festival-specific actions
- ✅ Core Web Vitals performance monitoring
- ✅ User behavior and engagement tracking
- ✅ GDPR-compliant cookie consent banner

### 2. Festival-Specific Event Tracking
- **User Authentication Events**: Sign up, login, logout with role tracking
- **Event Registrations**: Start, complete, and payment tracking
- **Pageant Applications**: Form opens, submissions with contestant data
- **Vendor Applications**: Business type and booth fee tracking
- **Sponsor Interactions**: Click tracking with sponsor level data
- **Content Engagement**: Video plays, downloads, social shares
- **Admin Actions**: Admin activity monitoring

### 3. Performance Monitoring
- **Core Web Vitals**: FCP, LCP, CLS, FID tracking
- **Page Load Performance**: DNS, server response, DOM processing times
- **Error Tracking**: JavaScript errors and unhandled promises
- **User Engagement**: Time spent, scroll depth, interaction rates

### 4. Admin Analytics Dashboard
- **Real-time Metrics**: User counts, registrations, applications
- **Performance Insights**: Web Vitals with recommendations
- **User Breakdown**: Role-based user analytics
- **Recent Activity**: Live feed of user actions
- **Quick Access**: Direct links to GA4, Search Console, PageSpeed Insights

## 🔧 Setup Instructions

### Step 1: Create Google Analytics 4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Get your Measurement ID (starts with G-XXXXXXXXXX)

### Step 2: Optional - Set up Google Tag Manager
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container
3. Get your GTM ID (starts with GTM-XXXXXXX)

### Step 3: Configure Environment Variables
Add to your `.env.local` file:
```env
# Analytics Configuration
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # Optional
```

### Step 4: Verify Installation
1. Deploy your website
2. Visit your site and perform some actions
3. Check GA4 Real-time reports within 5-10 minutes
4. Verify events are being tracked in GA4 Events section

## 📈 Available Analytics Events

### User Authentication
```javascript
// Tracked automatically on user actions
analyticsEvents.userSignUp('email', 'user');
analyticsEvents.userLogin('email', 'admin');
analyticsEvents.userLogout('vendor');
```

### Event Registrations
```javascript
// Tracked in RegisterForm component
analyticsEvents.eventRegistrationStarted('Cultural Night');
analyticsEvents.eventRegistration('Cultural Night', 'event-id', 5000);
analyticsEvents.eventRegistrationCompleted('Cultural Night', 'paystack');
```

### Pageant Applications
```javascript
// Tracked in RegistrationForm component
analyticsEvents.pageantApplicationStarted();
analyticsEvents.pageantApplicationSubmitted(25);
```

### Content Engagement
```javascript
// Available for manual tracking
analyticsEvents.sponsorClick('MTN Nigeria', 'platinum');
analyticsEvents.videoPlay('Festival Highlights 2024', 'home');
analyticsEvents.socialShare('facebook', 'event_announcement');
```

### Performance Tracking
```javascript
// Automatic performance monitoring
analyticsEvents.performanceMetric('page_load_time', 2300, '/events');
```

## 🎯 Key Metrics to Monitor

### Festival Success Metrics
- **Total Registrations**: Event sign-ups across all events
- **Conversion Rates**: Visitor to registration conversion
- **Popular Events**: Most registered events
- **User Engagement**: Time spent, pages per session
- **Geographic Data**: Where your audience is located

### Technical Performance
- **Page Load Speed**: Target < 3 seconds
- **Core Web Vitals**: All metrics in "Good" range
- **Error Rates**: Monitor and fix JavaScript errors
- **Mobile Performance**: Ensure good mobile experience

### User Behavior
- **Registration Funnel**: Track drop-off points
- **Popular Content**: Most viewed pages/sections
- **Search Terms**: What users are looking for
- **Device/Browser**: Optimize for popular platforms

## 🛠️ Using the Analytics Dashboard

### Access the Dashboard
1. Login as admin user
2. Go to `/admin/analytics`
3. View real-time metrics and insights

### Key Features
- **Live Metrics**: Current user counts and activity
- **Performance Monitoring**: Core Web Vitals status
- **User Breakdown**: Roles and registration status
- **Quick Actions**: Direct links to Google tools

### External Tools Integration
- **Google Analytics**: Detailed reports and audience insights
- **Google Search Console**: SEO performance and search visibility
- **PageSpeed Insights**: Performance optimization recommendations

## 📱 GDPR Compliance

### Cookie Consent
- Automatic consent banner for new visitors
- User choice stored in localStorage
- Analytics only active after consent
- Privacy policy integration

### Data Privacy
- Anonymized IP addresses
- Secure cookie settings
- User data protection
- GDPR-compliant data handling

## 🔍 Advanced Tracking Features

### Enhanced E-commerce
Ready for payment integration:
```javascript
ecommerceEvents.purchase('TXN123', items, 15000);
ecommerceEvents.addToCart('event-1', 'Cultural Night', 'events', 5000);
```

### Custom User Properties
Segment users by festival attributes:
```javascript
setUserProperties({
  user_role: 'contestant',
  festival_year: '2025',
  registration_status: 'registered',
  preferred_events: 'cultural,music'
});
```

### Error Monitoring
Automatic error tracking:
```javascript
// Automatically tracks JavaScript errors
// Manual error tracking available
analyticsEvents.error('api_error', 'Registration failed', '/events/register');
```

## 📊 Google Analytics 4 Configuration

### Recommended Events to Set Up in GA4
1. **Conversions**: Mark event registrations as conversions
2. **Audiences**: Create audiences for contestants, vendors, diaspora
3. **Goals**: Set up registration and application goals
4. **Funnels**: Track registration completion funnels

### Custom Dimensions (Recommended)
- User Role (admin, vendor, contestant, user)
- Festival Section (events, pageant, vendors, diaspora)
- Business Type (for vendors)
- Event Category (cultural, music, food, etc.)

## 🚀 Performance Optimization

### Monitoring Guidelines
- Check Core Web Vitals weekly
- Monitor error rates daily
- Review conversion funnels monthly
- Analyze user behavior patterns

### Optimization Priorities
1. **Page Speed**: Keep load times under 3 seconds
2. **Mobile Experience**: Ensure smooth mobile navigation
3. **Error Reduction**: Fix JavaScript errors promptly
4. **Conversion Optimization**: Improve registration forms

## 📈 Success Measurement

### Festival KPIs
- Total event registrations
- Pageant applications submitted
- Vendor applications approved
- Website conversion rate
- User engagement metrics

### Technical KPIs
- Page load speed < 3 seconds
- Core Web Vitals in "Good" range
- Error rate < 1%
- Mobile performance score > 90

---

## 🎉 You're All Set!

Your Groovy December Festival website now has professional-grade analytics tracking that will help you:

- **Understand Your Audience**: See who's visiting and what they're interested in
- **Optimize Performance**: Monitor and improve site speed and user experience
- **Track Success**: Measure registrations, applications, and engagement
- **Make Data-Driven Decisions**: Use insights to improve your festival

**Monitor your analytics dashboard and watch your festival grow! 📊🎊**