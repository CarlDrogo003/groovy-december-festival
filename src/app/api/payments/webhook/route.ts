import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  console.log('🔔 Paystack webhook received');
  
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const webhookData = JSON.parse(rawBody);
    const signature = request.headers.get('x-paystack-signature');

    console.log('Webhook event type:', webhookData.event);
    console.log('Webhook data reference:', webhookData.data?.reference);

    // Verify webhook signature for security
    if (!verifyPaystackWebhook(rawBody, signature)) {
      console.error('❌ Invalid Paystack webhook signature');
      console.log('Expected signature verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Webhook signature verified');

    const { event, data } = webhookData;

    // Handle different webhook events
    switch (event) {
      case 'charge.success':
        console.log('💰 Processing successful payment webhook');
        await handleSuccessfulPayment(data);
        break;
      
      case 'charge.failed':
        console.log('❌ Processing failed payment webhook');
        await handleFailedPayment(data);
        break;

      case 'transfer.success':
        console.log('💸 Processing successful transfer webhook');
        await handleSuccessfulTransfer(data);
        break;

      case 'transfer.failed':
        console.log('❌ Processing failed transfer webhook');
        await handleFailedTransfer(data);
        break;

      default:
        console.log('ℹ️ Unhandled Paystack webhook event:', event);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'success', event, processed: true });

  } catch (error) {
    console.error('🚨 Paystack webhook processing error:', error);
    
    // Return 200 OK even on error to prevent retries for malformed requests
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Webhook processing failed',
        error: process.env.NODE_ENV === 'development' ? error : 'Internal error'
      },
      { status: 200 } // Return 200 to prevent Paystack retries for processing errors
    );
  }
}

// Add GET method for webhook verification/testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const test = searchParams.get('test');

  if (test === 'true') {
    // Test webhook endpoint accessibility
    return NextResponse.json({
      status: 'Webhook endpoint is accessible',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      configuration: {
        has_secret_key: !!process.env.PAYSTACK_SECRET_KEY,
        secret_key_type: process.env.PAYSTACK_SECRET_KEY ? 
          (process.env.PAYSTACK_SECRET_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE') : 
          'MISSING'
      },
      webhook_info: {
        supported_events: [
          'charge.success',
          'charge.failed',
          'transfer.success',
          'transfer.failed'
        ],
        signature_verification: 'HMAC SHA512',
        required_headers: ['x-paystack-signature']
      }
    });
  }

  return NextResponse.json(
    { message: 'Paystack webhook endpoint - POST only' },
    { status: 405 }
  );
}

function verifyPaystackWebhook(rawBody: string, signature: string | null): boolean {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) {
    console.log('Missing signature or secret key for webhook verification');
    return false;
  }

  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody, 'utf8')
      .digest('hex');

    const isValid = hash === signature;
    
    if (!isValid) {
      console.log('Webhook signature mismatch:', {
        expected: signature,
        calculated: hash
      });
    }

    return isValid;
  } catch (error) {
    console.error('Paystack signature verification error:', error);
    return false;
  }
}

async function handleSuccessfulPayment(eventData: any) {
  const {
    id: transactionId,
    reference: paymentReference,
    amount,
    fees,
    paid_at: paidAt,
    channel: paymentMethod,
    currency,
    metadata,
    customer,
  } = eventData;

  try {
    // Convert amount from kobo to naira
    const amountInNaira = amount / 100;
    const feesInNaira = fees ? fees / 100 : 0;

    // Update payment record in database
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'PAID',
        amount_paid: amountInNaira,
        fee: feesInNaira,
        payment_method: paymentMethod,
        completed_on: paidAt,
        webhook_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_reference', paymentReference);

    if (updateError) {
      console.error('Failed to update payment record:', updateError);
      return;
    }

    // Get payment record to determine type and item
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('payment_type, item_id, customer_email')
      .eq('payment_reference', paymentReference)
      .single();

    if (payment) {
      // Update related records
      await updateRelatedRecordsOnSuccess(
        payment.payment_type,
        payment.item_id,
        paymentReference
      );

      // If this is a diaspora booking, update coordinator earnings
      if (payment.payment_type === 'diaspora_booking') {
        // Get the booking to find referral_code and final_amount
        const { data: booking, error: bookingError } = await supabaseAdmin
          .from('diaspora_bookings')
          .select('referral_code, final_amount')
          .eq('id', payment.item_id)
          .single();
        if (!bookingError && booking && booking.referral_code && booking.final_amount) {
          // Call the API route to update coordinator earnings
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/diaspora/update-coordinator-earnings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referral_code: booking.referral_code,
              final_amount: booking.final_amount
            })
          });
        }
      }

      // Send confirmation email (implement email service)
      await sendPaymentConfirmationEmail(payment.customer_email, {
        transactionReference: paymentReference,
        amountPaid: amountInNaira.toString(),
        paymentType: payment.payment_type,
      });
    }

    console.log('Successfully processed Paystack payment:', paymentReference);

  } catch (error) {
    console.error('Error handling successful transaction:', error);
  }
}

async function handleFailedPayment(eventData: any) {
  const { reference: paymentReference } = eventData;

  try {
    await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'FAILED',
        webhook_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_reference', paymentReference);

    console.log('Paystack payment failed:', paymentReference);

  } catch (error) {
    console.error('Error handling failed Paystack payment:', error);
  }
}

async function handleSuccessfulTransfer(eventData: any) {
  const { reference, amount, recipient } = eventData;

  try {
    // Log successful transfer for audit purposes
    console.log('Paystack transfer successful:', {
      reference,
      amount: amount / 100, // Convert from kobo
      recipient,
    });

    // Additional transfer handling logic can be added here
    
  } catch (error) {
    console.error('Error handling successful transfer:', error);
  }
}

async function handleFailedTransfer(eventData: any) {
  const { reference, failure_reason } = eventData;

  try {
    // Log failed transfer for audit purposes
    console.log('Paystack transfer failed:', {
      reference,
      reason: failure_reason,
    });

    // Additional failed transfer handling logic can be added here
    
  } catch (error) {
    console.error('Error handling failed transfer:', error);
  }
}

async function updateRelatedRecordsOnSuccess(
  paymentType: string,
  itemId: string,
  transactionReference: string
) {
  try {
    switch (paymentType) {
      case 'event_registration':
        await supabaseAdmin
          .from('event_registrations')
          .update({
            payment_status: 'paid',
            payment_confirmed: true,
            updated_at: new Date().toISOString(),
          })
          .eq('event_id', itemId)
          .eq('payment_reference', transactionReference);
        break;

      case 'vendor_booth':
        await supabaseAdmin
          .from('vendors')
          .update({
            payment_status: 'paid',
            status: 'approved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemId);
        break;

      case 'pageant_application':
        await supabaseAdmin
          .from('pageant_contestants')
          .update({
            payment_status: 'paid',
            application_status: 'approved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemId);
        break;
    }
  } catch (error) {
    console.error('Error updating related records on success:', error);
  }
}

async function sendPaymentConfirmationEmail(
  email: string,
  paymentDetails: {
    transactionReference: string;
    amountPaid: string;
    paymentType: string;
  }
) {
  // TODO: Implement email service
  // This could use services like:
  // - SendGrid
  // - Mailgun
  // - Amazon SES
  // - Resend

  console.log('Payment confirmation email should be sent to:', email, paymentDetails);
}