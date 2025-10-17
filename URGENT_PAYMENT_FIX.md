# 🚨 URGENT: Payment System Fix Guide

## Immediate Actions Required on Vercel:

### 1. Check Environment Variables in Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables and verify:

**Required Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxx (or pk_test_ for testing)
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxx (or sk_test_ for testing)
NODE_ENV=production
```

### 2. Verify Paystack Keys
- Ensure you're using **LIVE** keys for production (pk_live_ and sk_live_)
- Test keys (pk_test_, sk_test_) won't work for real payments
- Double-check keys are correctly pasted (no extra spaces/characters)

### 3. Check Supabase Connection
- Verify your Supabase project is active
- Ensure the service role key has proper permissions
- Check if your payments table exists and has correct schema

### 4. Deployment Fix
After updating environment variables:
1. Go to Vercel → Deployments
2. Click "Redeploy" on your latest deployment
3. Or push a small change to trigger new deployment

## What I've Fixed in Code:

✅ **Enhanced Error Logging**: Better error messages to identify issues
✅ **Environment Detection**: More robust production environment detection  
✅ **Payment API Debugging**: Added detailed logging for troubleshooting
✅ **Configuration Validation**: Check for missing environment variables

## Testing Steps:

1. After redeployment, check Vercel logs for the new environment check logs
2. Try a test payment and check the detailed error messages
3. Look for the specific error in Functions logs

## Common Issues & Solutions:

**"Registration failed"** usually means:
- Missing environment variables
- Supabase connection issues  
- Database table/permission problems
- Paystack key issues

The enhanced logging will now show exactly which component is failing.

## Next Steps:

1. Update Vercel environment variables
2. Redeploy
3. Test payment
4. Check logs for specific error details
5. Report back with the detailed error message