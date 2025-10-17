import { NextRequest, NextResponse } from 'next/server';
import { paystackValidator } from '@/lib/paystackValidator';

interface PaystackInitializeRequest {
  email: string;
  amount: number; // Amount in naira (will be converted to kobo)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
  firstname?: string;
  lastname?: string;
  phone?: string;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const requestData: PaystackInitializeRequest = await request.json();

    // Validate required fields
    if (!requestData.email || !requestData.amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email and amount are required',
          details: {
            email: !requestData.email ? 'Missing email address' : null,
            amount: !requestData.amount ? 'Missing payment amount' : null
          }
        },
        { status: 400 }
      );
    }

    // Validate Paystack configuration first
    const configValidation = paystackValidator.validateForApiRequest();
    if (!configValidation.valid) {
      console.error('Paystack configuration invalid:', configValidation.error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment system configuration error. Please contact support.',
          code: 'PAYSTACK_CONFIG_INVALID',
          details: configValidation.error
        },
        { status: 500 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY!; // Already validated above
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    // Generate unique reference if not provided
    const reference = requestData.reference || generatePaymentReference();

    // Convert amount to kobo (Paystack requires kobo)
    const amountInKobo = Math.round(requestData.amount * 100);

    // Prepare Paystack initialization payload
    const paystackPayload = {
      email: requestData.email,
      amount: amountInKobo,
      currency: requestData.currency || 'NGN',
      reference: reference,
      callback_url: requestData.callback_url || `${baseUrl}/api/payments/callback`,
      metadata: {
        ...requestData.metadata,
        domain: host,
        user_agent: request.headers.get('user-agent') || '',
        timestamp: new Date().toISOString(),
      },
      channels: requestData.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      ...(requestData.firstname && { firstname: requestData.firstname }),
      ...(requestData.lastname && { lastname: requestData.lastname }),
      ...(requestData.phone && { phone: requestData.phone }),
    };

    console.log('Initializing Paystack transaction:', {
      reference: reference,
      amount: amountInKobo,
      email: requestData.email,
      callback_url: paystackPayload.callback_url
    });

    // Make request to Paystack Initialize Transaction API
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    const paystackData: PaystackInitializeResponse = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json(
        { 
          success: false, 
          error: paystackData.message || 'Payment initialization failed',
          details: paystackData
        },
        { status: 400 }
      );
    }

    if (!paystackData.status) {
      console.error('Paystack returned failure status:', paystackData);
      return NextResponse.json(
        { 
          success: false, 
          error: paystackData.message || 'Payment initialization failed',
          details: paystackData
        },
        { status: 400 }
      );
    }

    // Log successful initialization
    console.log('Paystack transaction initialized successfully:', {
      reference: paystackData.data.reference,
      access_code: paystackData.data.access_code,
      authorization_url: paystackData.data.authorization_url
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
        amount: requestData.amount,
        currency: requestData.currency || 'NGN',
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during payment initialization',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Generate unique payment reference
function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GROOVY2025_${timestamp}_${random}`;
}

// Test endpoint for verifying configuration
export async function GET(request: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      status: 'Payment initialization endpoint ready',
      configuration: {
        has_secret_key: !!secretKey,
        has_public_key: !!publicKey,
        secret_key_type: secretKey ? (secretKey.startsWith('sk_test_') ? 'TEST' : 'LIVE') : 'MISSING',
        public_key_type: publicKey ? (publicKey.startsWith('pk_test_') ? 'TEST' : 'LIVE') : 'MISSING',
        callback_url: `${baseUrl}/api/payments/callback`,
        webhook_url: `${baseUrl}/api/payments/webhook`,
        environment: process.env.NODE_ENV,
        base_url: baseUrl
      },
      recommendations: [
        secretKey ? null : 'Set PAYSTACK_SECRET_KEY environment variable',
        publicKey ? null : 'Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable',
        'Ensure webhook URL is accessible from Paystack servers',
        'Configure callback URL in Paystack dashboard if needed',
        'Test with Paystack test credentials before going live'
      ].filter(Boolean)
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Configuration check failed', details: error },
      { status: 500 }
    );
  }
}