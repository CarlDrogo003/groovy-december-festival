# Paystack Testing Guide for Groovy December Festival

## Test Credentials Setup

### 1. Environment Variables for Testing
Add these to your `.env.local` file for local testing:

```bash
# Paystack TEST credentials (safe to use in development)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_TEST_PUBLIC_KEY
PAYSTACK_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY

# Set environment to development for testing
NODE_ENV=development
```

### 2. Paystack Test Cards

Use these test card numbers for different scenarios:

#### ✅ Successful Payments
- **Card Number:** 4084084084084081
- **Expiry:** Any future date (e.g., 12/30)
- **CVV:** Any 3 digits (e.g., 123)
- **PIN:** 0000 (when required)
- **OTP:** 123456 (when required)

#### ❌ Failed Payments (for testing error handling)
- **Card Number:** 4084084084084084 (will fail)
- **Card Number:** 5060666666666666 (insufficient funds)

#### 🔄 Timeout/Pending Payments
- **Card Number:** 4084084084084089 (pending transaction)

### 3. Test Amounts

Different amounts trigger different behaviors:
- **₦50,000 (5000000 kobo)** - Normal successful transaction
- **₦100 (10000 kobo)** - Successful small transaction
- **₦500,000+ (50000000+ kobo)** - May require additional verification

### 4. Test Process

1. **Local Testing:**
   ```bash
   npm run dev
   cd http://localhost:3000/tickets
   ```

2. **Test Flow:**
   - Select any ticket type
   - Fill in test email (use your real email to receive confirmations)
   - Use test card numbers above
   - Complete payment flow

3. **Production Testing:**
   - Deploy with test credentials first
   - Verify on staging/production URL
   - Switch to live credentials only after thorough testing

### 5. Verification Steps

✅ **Check these after each test payment:**
- Payment shows as "successful" in frontend
- Transaction appears in Paystack Dashboard (Test transactions)
- Database record created in Supabase
- Confirmation email sent (if configured)
- Console logs show proper API responses

### 6. Common Test Scenarios

#### A. Successful Payment Test
1. Use card: 4084084084084081
2. Complete payment flow
3. Verify success message
4. Check Paystack dashboard
5. Verify database entry

#### B. Failed Payment Test
1. Use card: 4084084084084084
2. Attempt payment
3. Verify error handling
4. Check user sees appropriate error message
5. Verify no charge occurred

#### C. Network Error Test
1. Disconnect internet during payment
2. Verify graceful error handling
3. Reconnect and retry
4. Ensure no duplicate charges

### 7. Production Deployment Checklist

Before switching to live credentials:

- [ ] All test scenarios pass
- [ ] Error handling works properly
- [ ] Database records created correctly
- [ ] Email notifications working
- [ ] Mobile responsive checkout tested
- [ ] Security headers properly configured
- [ ] Rate limiting working
- [ ] Webhook endpoints ready (if used)

### 8. Live Credentials Setup

Only after testing is complete:

```bash
# Paystack LIVE credentials (production only)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_YOUR_LIVE_PUBLIC_KEY
PAYSTACK_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NODE_ENV=production
```

### 9. Monitoring in Production

- Monitor Paystack Dashboard for real transactions
- Set up alerts for failed payments
- Track conversion rates
- Monitor for fraud patterns
- Keep transaction logs for reconciliation

### 10. Support Contacts

- **Paystack Support:** support@paystack.com
- **Documentation:** https://paystack.com/docs
- **Test Cards:** https://paystack.com/docs/payments/test-payments/