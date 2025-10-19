# Admin Role Management Guide

## 🔧 System Architecture

### **Two-Table System:**
1. **`profiles` table**: General user profiles with basic roles (user, vendor, contestant, admin)
2. **`admins` table**: Detailed admin management with specific permissions and roles

### **Admin Role Hierarchy:**
- **`super_admin`**: Full system access, can manage other admins
- **`admin`**: Standard admin access, can manage festival content
- **`moderator`**: Limited admin access, can moderate content only

## 🚀 How to Add New Admins

### **Method 1: Add Existing User as Admin**
```sql
-- If user already exists, add them to admins table
INSERT INTO public.admins (
    user_id,
    email,
    full_name,
    role,
    is_active
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'new-admin@example.com'),
    'new-admin@example.com',
    'Admin Full Name',
    'admin', -- or 'super_admin' or 'moderator'
    true
);
```

### **Method 2: Create New Admin Account**
1. **User signs up** at `/admin/login` first
2. **Then run SQL** to promote them to admin:
```sql
-- Add to admins table after they sign up
INSERT INTO public.admins (
    user_id,
    email,
    full_name,
    role,
    is_active
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'their-email@example.com'),
    'their-email@example.com',
    'Their Full Name',
    'admin',
    true
);
```

## 👥 Admin Management Commands

### **View All Admins:**
```sql
SELECT 
    a.id,
    a.email,
    a.full_name,
    a.role,
    a.is_active,
    a.created_at,
    u.email_confirmed_at
FROM public.admins a
LEFT JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at DESC;
```

### **Update Admin Role:**
```sql
-- Promote admin to super_admin
UPDATE public.admins 
SET role = 'super_admin', updated_at = now()
WHERE email = 'admin@example.com';

-- Demote to moderator
UPDATE public.admins 
SET role = 'moderator', updated_at = now()
WHERE email = 'admin@example.com';
```

### **Deactivate Admin:**
```sql
-- Temporarily disable admin access
UPDATE public.admins 
SET is_active = false, updated_at = now()
WHERE email = 'admin@example.com';

-- Reactivate admin
UPDATE public.admins 
SET is_active = true, updated_at = now()
WHERE email = 'admin@example.com';
```

### **Remove Admin Completely:**
```sql
-- Remove from admins table (they keep their user account)
DELETE FROM public.admins 
WHERE email = 'admin@example.com';
```

## 🔐 Permission System

### **Current Permissions by Role:**

#### **Super Admin (`super_admin`):**
- ✅ Manage all festival content (events, vendors, pageant, etc.)
- ✅ Add/remove other admins
- ✅ Change admin roles
- ✅ Access all statistics and analytics
- ✅ Export data
- ✅ Manage system settings

#### **Admin (`admin`):**
- ✅ Manage festival content (events, vendors, pageant, etc.)
- ✅ Access statistics and analytics
- ✅ Export data
- ❌ Cannot manage other admins
- ❌ Cannot change admin roles

#### **Moderator (`moderator`):**
- ✅ View and moderate content
- ✅ Basic statistics access
- ❌ Cannot create/delete major content
- ❌ Cannot manage admins
- ❌ Limited export capabilities

## 🛠️ Adding Custom Permissions

You can extend the permissions system using the `permissions` JSONB field:

```sql
-- Add custom permissions to an admin
UPDATE public.admins 
SET permissions = '{
    "can_manage_payments": true,
    "can_send_emails": true,
    "max_events_per_day": 5,
    "allowed_sections": ["events", "vendors", "pageant"]
}'
WHERE email = 'admin@example.com';
```

## 📋 Quick Setup Checklist

### **For You (Current Super Admin):**
1. ✅ Run `create-admins-table.sql` to create the admins table
2. ✅ Your account (`groovydecember9@gmail.com`) will be added as `super_admin`
3. ✅ Test admin dashboard access

### **To Add New Admins:**
1. Have them sign up at `/admin/login`
2. Run the SQL to add them to admins table
3. They can now access `/admin` dashboard

## 🚨 Security Best Practices

1. **Always use `super_admin` sparingly** - only for founders/owners
2. **Regular admins** should use `admin` role for day-to-day management
3. **Use `moderator`** for staff who only need to review content
4. **Regular audit**: Review admin list monthly
5. **Deactivate unused accounts** instead of deleting them for audit trail

## 💡 Advanced Features

### **Admin Activity Logging:**
```sql
-- You can add an admin_logs table to track admin actions
CREATE TABLE admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES admins(id),
    action TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Temporary Admin Access:**
```sql
-- Add expiry date for temporary admins
ALTER TABLE admins ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Create temporary admin for 30 days
UPDATE public.admins 
SET expires_at = now() + interval '30 days'
WHERE email = 'temp-admin@example.com';
```

---

**Next Steps:**
1. Run `create-admins-table.sql` in Supabase
2. Test your admin access
3. Add other team members as needed using the SQL commands above