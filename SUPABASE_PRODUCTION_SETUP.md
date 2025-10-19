# Supabase Production Setup Checklist

## 🚨 Critical Settings Before Going Live

### 1. **Authentication Configuration**
Go to Supabase Dashboard → Authentication → Settings

#### **Site URL Configuration**
- **Site URL**: Set to your production domain (e.g., `https://groovydecember.ng`)
- **Additional Redirect URLs**: Add these URLs:
  ```
  https://groovydecember.ng/admin/login
  https://groovydecember.ng/admin/login?verified=true
  https://your-domain.com/admin/login
  https://your-domain.com/admin/login?verified=true
  ```

#### **Email Templates** (Optional but Recommended)
- Customize confirmation email template
- Customize magic link email template  
- Add your branding and domain

### 2. **Row Level Security (RLS) Policies**
Ensure these are properly configured (should be done by the SQL scripts):

✅ **Profiles Table Policies:**
- Users can view all profiles
- Users can only insert/update their own profile
- Admin users have broader access

✅ **Events Table Policies:**
- Public read access for events
- Admin-only write access

✅ **Other Tables** (vendors, pageant_applications, etc.):
- Appropriate read/write permissions based on user roles

### 3. **API Keys and Environment Variables**

#### **Production Environment Variables**
Update your production `.env.local` or hosting platform environment variables:

```env
# Production Supabase Settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Payment Settings (Production)
PAYSTACK_SECRET_KEY=sk_live_your-live-secret-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your-live-public-key

# Domain Settings
NEXT_PUBLIC_SITE_URL=https://groovydecember.ng
```

### 4. **Database Setup - Run These SQL Scripts**

#### **Required Tables and Functions:**
1. **Auth Setup**: Run `auth-setup-safe.sql`
2. **Admin Profile**: Run `create-admin-profile.sql` 
3. **Traditional Events**: Run `database/traditional-events.sql`
4. **Sample Events**: Run `sample-events.sql` (if needed)

### 5. **Paystack Production Setup**

#### **Live API Keys**
- Replace test keys with live keys in production environment
- Update webhook URLs in Paystack dashboard:
  ```
  https://groovydecember.ng/api/payments/webhook
  https://groovydecember.ng/api/payments/callback
  ```

#### **Test Payment Flow**
- Test with live Paystack keys in production
- Verify webhook signature validation works
- Test payment success/failure scenarios

### 6. **Security Configurations**

#### **CORS Settings**
In Supabase Dashboard → Settings → API:
- Add your production domain to allowed origins
- Remove localhost URLs from production

#### **JWT Settings**
- JWT expiry time (default 1 hour is fine)
- JWT secret (automatically managed by Supabase)

### 7. **Performance Optimizations**

#### **Database Indexes**
The SQL scripts should create these indexes:
```sql
-- Should already be created by auth-setup-safe.sql
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Additional recommended indexes
CREATE INDEX IF NOT EXISTS events_category_idx ON public.events(category);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events(date);
CREATE INDEX IF NOT EXISTS events_featured_idx ON public.events(featured);
```

#### **Connection Pooling**
- Default settings are usually fine for small-medium apps
- Monitor connection usage in Supabase dashboard

### 8. **Backup and Monitoring**

#### **Database Backups**
- Supabase provides automatic daily backups
- Consider setting up additional backup strategy for critical data

#### **Monitoring**
- Set up alerts for high database usage
- Monitor authentication events
- Track API usage limits

### 9. **Content Security**

#### **File Upload Limits**
If using Supabase Storage:
- Set appropriate file size limits
- Configure allowed file types
- Set up proper bucket policies

### 10. **Pre-Launch Testing Checklist**

- [ ] Test user registration/login flow
- [ ] Test admin access with your profile
- [ ] Test payment processing with live keys
- [ ] Test all major features (events, pageant, vendors, etc.)
- [ ] Test on mobile devices
- [ ] Test email delivery (verification, magic links)
- [ ] Verify all redirect URLs work correctly
- [ ] Test form submissions and data storage

## 🎯 Quick Setup Commands

### **Step 1: Update Supabase Settings**
1. Site URL: `https://your-domain.com`
2. Redirect URLs: Add production URLs
3. CORS: Add production domain

### **Step 2: Run Database Scripts**
```sql
-- 1. Run auth-setup-safe.sql
-- 2. Run create-admin-profile.sql  
-- 3. Run any additional table setup scripts
```

### **Step 3: Update Environment Variables**
Replace all development/test keys with production keys

### **Step 4: Test Everything**
Use the production domain to test all functionality

## ⚠️ Common Production Issues

1. **"Auth session not found"** → Check Site URL configuration
2. **CORS errors** → Add production domain to allowed origins  
3. **Payment failures** → Verify live Paystack keys and webhook URLs
4. **Email not sending** → Check email template configuration
5. **Admin access denied** → Verify admin profile was created correctly

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Paystack Docs**: https://paystack.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Most Critical Items:**
1. ✅ Set correct Site URL and Redirect URLs
2. ✅ Run all database setup scripts  
3. ✅ Update to live Paystack keys
4. ✅ Test admin login and payment flow

The rest can be configured gradually after launch if needed.