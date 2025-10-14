import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature for security
    if (!verifyPaystackWebhook(webhookData, signature)) {
      console.error('Invalid Paystack webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Paystack webhook received:', webhookData);

    const { event, data } = webhookData;

    // Handle different webhook events
    switch (event) {
      case 'charge.success':
        await handleSuccessfulPayment(data);
        break;
      
      case 'charge.failed':
        await handleFailedPayment(data);
        break;

      case 'transfer.success':
        await handleSuccessfulTransfer(data);
        break;

      case 'transfer.failed':
        await handleFailedTransfer(data);
        break;

      default:
        console.log('Unhandled Paystack webhook event:', event);
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function verifyPaystackWebhook(payload: any, signature: string | null): boolean {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) {
    return false;
  }

  try {
    const payloadString = JSON.stringify(payload);
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(payloadString)
      .digest('hex');

    return hash === signature;
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