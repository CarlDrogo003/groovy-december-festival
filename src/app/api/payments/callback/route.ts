import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  // Paystack sends the transaction reference as a query parameter
  const transactionReference = reference || trxref;

  if (!transactionReference) {
    console.error('Payment callback received without reference');
    // Redirect to payment failure page
    redirect(`/payment/result?status=error&message=${encodeURIComponent('Payment reference missing')}`);
  }

  console.log('Payment callback received for reference:', transactionReference);

  // Verify the payment status with Paystack
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('CRITICAL: Paystack secret key not configured for callback verification');
    redirect(`/payment/result?status=error&message=${encodeURIComponent('Payment verification configuration error')}`);
  }

  // Verify payment with Paystack API
  let verifyResponse;
  let verificationData;

  try {
    verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${transactionReference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (fetchError) {
    console.error('Network error during payment verification:', fetchError);
    redirect(`/payment/result?status=error&message=${encodeURIComponent('Network error during verification')}&reference=${transactionReference}`);
  }

  try {
    verificationData = await verifyResponse.json();
  } catch (jsonError) {
    console.error('Error parsing verification response:', jsonError);
    redirect(`/payment/result?status=error&message=${encodeURIComponent('Invalid verification response')}&reference=${transactionReference}`);
  }

  if (!verifyResponse.ok) {
    console.error('Paystack verification failed:', verificationData);
    redirect(`/payment/result?status=error&message=${encodeURIComponent('Payment verification failed')}&reference=${transactionReference}`);
  }

  if (!verificationData.status || verificationData.data?.status !== 'success') {
    console.error('Payment not successful:', verificationData);
    const paymentStatus = verificationData.data?.status || 'unknown';
    redirect(`/payment/result?status=failed&message=${encodeURIComponent(`Payment ${paymentStatus}`)}&reference=${transactionReference}`);
  }

  // Payment is successful
  const paymentData = verificationData.data;
  console.log('Payment verified successfully:', {
    reference: paymentData.reference,
    amount: paymentData.amount,
    status: paymentData.status,
    customer: paymentData.customer.email
  });

  // Prepare success redirect with payment details
  const successParams = new URLSearchParams({
    status: 'success',
    reference: paymentData.reference,
    amount: (paymentData.amount / 100).toString(), // Convert from kobo to naira
    currency: paymentData.currency,
    channel: paymentData.channel,
    customer: paymentData.customer.email,
    transaction_id: paymentData.id.toString(),
    paid_at: paymentData.paid_at || new Date().toISOString()
  });

  // Redirect to success page with payment details
  redirect(`/payment/result?${successParams.toString()}`);
}

// Handle POST requests as well (some payment gateways send POST callbacks)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = body.reference || body.trxref;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference missing in callback' },
        { status: 400 }
      );
    }

    console.log('POST payment callback received for reference:', reference);

    // For POST callbacks, we'll return JSON instead of redirecting
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment verification configuration error' },
        { status: 500 }
      );
    }

    try {
      // Verify payment with Paystack API
      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const verificationData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        return NextResponse.json(
          { error: 'Payment verification failed', details: verificationData },
          { status: 400 }
        );
      }

      if (!verificationData.status || verificationData.data?.status !== 'success') {
        return NextResponse.json(
          { 
            error: 'Payment not successful', 
            status: verificationData.data?.status || 'unknown',
            reference: reference
          },
          { status: 400 }
        );
      }

      // Payment is successful
      const paymentData = verificationData.data;
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: paymentData.reference,
          amount: paymentData.amount / 100, // Convert from kobo to naira
          currency: paymentData.currency,
          status: paymentData.status,
          channel: paymentData.channel,
          customer: paymentData.customer,
          transaction_id: paymentData.id,
          paid_at: paymentData.paid_at,
          gateway_response: paymentData.gateway_response
        }
      });

    } catch (verificationError) {
      console.error('Error during payment verification:', verificationError);
      return NextResponse.json(
        { error: 'Payment verification error', details: verificationError },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('POST callback processing error:', error);
    return NextResponse.json(
      { error: 'Payment callback processing error', details: error },
      { status: 500 }
    );
  }
}