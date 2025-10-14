import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('Paystack secret key not configured');
      return NextResponse.json(
        { success: false, error: 'Payment verification unavailable' },
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const verificationData = await response.json();

    if (!response.ok) {
      console.error('Paystack verification failed:', verificationData);
      return NextResponse.json(
        { success: false, error: verificationData.message || 'Verification failed' },
        { status: 400 }
      );
    }

    if (verificationData.status && verificationData.data.status === 'success') {
      return NextResponse.json({
        success: true,
        data: verificationData.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment not successful' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}