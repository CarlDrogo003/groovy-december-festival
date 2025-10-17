# 🧪 PAYSTACK PAYMENT GATEWAY TESTING GUIDE

## 🚀 QUICK START

This guide will help you test the newly implemented Paystack payment integration with proper webhook and callback URL configuration.

## 📋 PREREQUISITES

### 1. Environment Variables Required

Create/update your `.env.local` file:

```bash
# Paystack Test Credentials (Safe for testing)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_test_secret_key_here

# Optional: Production credentials (use only when ready for live transactions)
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key_here
# PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key_here
```

### 2. Get Test Credentials

1. Visit [Paystack Dashboard](https://dashboard.paystack.co/)
2. Login or create account
3. Go to Settings > API Keys & Webhooks
4. Copy your TEST API keys (pk_test_xxx and sk_test_xxx)

## 🔧 TESTING STEPS

### Step 1: Check Configuration

```bash
# Start development server
npm run dev

# Test configuration endpoint
curl http://localhost:3000/api/payments/initialize
```

Expected response: Configuration report with validation status

### Step 2: Test Payment Initialization

```bash
# Test payment initialization
curl -X POST http://localhost:3000/api/payments/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@groovydecember.ng",
    "amount": 5000,
    "firstname": "John",
    "lastname": "Doe",
    "phone": "+2348123456789",
    "metadata": {
      "test_payment": true,
      "event_type": "festival_registration"
    }
  }'
```

Expected response: 
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/xxxxx",
    "access_code": "xxxxx",
    "reference": "GROOVY2025_xxxxx",
    "amount": 5000,
    "currency": "NGN",
    "callback_url": "http://localhost:3000/api/payments/callback"
  }
}
```

### Step 3: Test Webhook Endpoint

```bash
# Test webhook accessibility
curl http://localhost:3000/api/payments/webhook?test=true
```

Expected response: Webhook configuration info

### Step 4: Complete Payment Flow Test

1. **Initialize Payment**: Use the `/api/payments/initialize` endpoint
2. **Open Checkout**: Visit the returned `authorization_url`
3. **Use Test Card**: 
   - Card: `4084084084084081` (Success)
   - CVV: Any 3 digits (e.g., `123`)
   - Expiry: Any future date (e.g., `12/25`)
   - OTP: `123456`
4. **Verify Callback**: Should redirect to `/payment/result?status=success`

## 💳 TEST CARD NUMBERS

| Purpose | Card Number | Result |
|---------|-------------|---------|
| Successful payment | `4084084084084081` | ✅ Success |
| Failed payment | `4084084084084084` | ❌ Failed |
| Insufficient funds | `4084084084084083` | ❌ Insufficient Funds |

**Additional Test Details:**
- CVV: Any 3 digits (123, 456, etc.)
- Expiry Date: Any future date
- OTP: `123456`

## 🔗 WEBHOOK CONFIGURATION

### For Local Testing (ngrok)

1. Install ngrok: `npm install -g ngrok`
2. Start tunnel: `ngrok http 3000`
3. Copy HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Configure webhook in Paystack dashboard:
   - URL: `https://abc123.ngrok.io/api/payments/webhook`
   - Events: `charge.success`, `charge.failed`

### For Production (Vercel)

1. Deploy to Vercel
2. Configure webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Add environment variables in Vercel dashboard

## 🚨 TROUBLESHOOTING

### Common Issues

1. **"Payment system configuration error"**
   - Check environment variables are set correctly
   - Ensure TEST keys start with `pk_test_` and `sk_test_`
   - Verify keys match (both test or both live)

2. **"Webhook signature verification failed"**
   - Ensure webhook URL is accessible from internet
   - Check Paystack dashboard webhook configuration
   - Verify environment variables are set

3. **"Payment initialization failed"**
   - Check Paystack API key validity
   - Verify internet connection
   - Check amount is valid (₦1 - ₦10,000,000)

### Debug Commands

```bash
# Check configuration
curl http://localhost:3000/api/payments/initialize | jq

# Test webhook endpoint
curl http://localhost:3000/api/payments/webhook?test=true | jq

# Verify payment (replace REFERENCE with actual reference)
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{"reference": "GROOVY2025_XXXXXXXXX"}' | jq
```

## ✅ SUCCESS CRITERIA

Your implementation is working correctly when:

1. ✅ Configuration endpoint shows "Payment initialization endpoint ready ✅"
2. ✅ Payment initialization returns success with `authorization_url`
3. ✅ Test payment completes successfully
4. ✅ Callback redirects to success page with payment details
5. ✅ Webhook endpoint responds correctly to test calls

## 🔐 SECURITY CHECKLIST

- [ ] Secret keys are not exposed in frontend code
- [ ] Webhook signature verification is enabled
- [ ] HTTPS is used in production
- [ ] Environment variables are properly configured
- [ ] Test mode is used for development

## 📞 SUPPORT

If you encounter issues:

1. Check the configuration report: `GET /api/payments/initialize`
2. Review browser console for errors
3. Check server logs for detailed error messages
4. Verify Paystack dashboard settings

---

## 🎯 NEXT STEPS

Once testing is complete:

1. **Update Frontend Components**: Modify your payment buttons to use the new server-side initialization
2. **Configure Live Webhooks**: Set up production webhook URLs in Paystack dashboard
3. **Switch to Live Keys**: Update environment variables for production
4. **Monitor Payments**: Use Paystack dashboard to track transactions

## 📝 IMPLEMENTATION EXAMPLE

```typescript
// Frontend payment trigger example
const handlePayment = async () => {
  try {
    const response = await fetch('/api/payments/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@example.com',
        amount: 5000,
        firstname: 'John',
        lastname: 'Doe',
        metadata: {
          event_type: 'festival_registration',
          customer_id: '12345'
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Redirect to Paystack checkout
      window.location.href = result.data.authorization_url;
    } else {
      alert('Payment initialization failed: ' + result.error);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment system error. Please try again.');
  }
};
```

---

🎉 **Your Paystack integration is now properly configured with webhooks and callback URLs!**