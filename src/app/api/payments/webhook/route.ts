import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    const signature = request.headers.get('monnify-signature');

    // Verify webhook signature for security
    if (!verifyWebhookSignature(webhookData, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Monnify webhook received:', webhookData);

    const {
      eventType,
      eventData,
    } = webhookData;

    // Handle different webhook events
    switch (eventType) {
      case 'SUCCESSFUL_TRANSACTION':
        await handleSuccessfulTransaction(eventData);
        break;
      
      case 'FAILED_TRANSACTION':
        await handleFailedTransaction(eventData);
        break;

      case 'OVERPAID_TRANSACTION':
        await handleOverpaidTransaction(eventData);
        break;

      case 'PARTIALLY_PAID_TRANSACTION':
        await handlePartiallyPaidTransaction(eventData);
        break;

      default:
        console.log('Unhandled webhook event type:', eventType);
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Monnify webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function verifyWebhookSignature(payload: any, signature: string | null): boolean {
  if (!signature || !process.env.MONNIFY_SECRET_KEY) {
    return false;
  }

  try {
    const payloadString = JSON.stringify(payload);
    const hash = crypto
      .createHmac('sha512', process.env.MONNIFY_SECRET_KEY)
      .update(payloadString)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function handleSuccessfulTransaction(eventData: any) {
  const {
    transactionReference,
    paymentReference,
    amountPaid,
    totalPayable,
    settlementAmount,
    paidOn,
    paymentMethod,
    currency,
    paymentDescription,
    metaData,
    customer,
  } = eventData;

  try {
    // Update payment record in database
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'PAID',
        amount_paid: parseFloat(amountPaid),
        settlement_amount: parseFloat(settlementAmount),
        payment_method: paymentMethod,
        completed_on: paidOn,
        webhook_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_reference', transactionReference);

    if (updateError) {
      console.error('Failed to update payment record:', updateError);
      return;
    }

    // Get payment record to determine type and item
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('payment_type, item_id, customer_email')
      .eq('transaction_reference', transactionReference)
      .single();

    if (payment) {
      // Update related records
      await updateRelatedRecordsOnSuccess(
        payment.payment_type,
        payment.item_id,
        transactionReference
      );

      // Send confirmation email (implement email service)
      await sendPaymentConfirmationEmail(payment.customer_email, {
        transactionReference,
        amountPaid,
        paymentType: payment.payment_type,
      });
    }

    console.log('Successfully processed payment:', transactionReference);

  } catch (error) {
    console.error('Error handling successful transaction:', error);
  }
}

async function handleFailedTransaction(eventData: any) {
  const { transactionReference } = eventData;

  try {
    await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'FAILED',
        webhook_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_reference', transactionReference);

    console.log('Payment failed:', transactionReference);

  } catch (error) {
    console.error('Error handling failed transaction:', error);
  }
}

async function handleOverpaidTransaction(eventData: any) {
  const { transactionReference, amountPaid, totalPayable } = eventData;

  try {
    await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'OVERPAID',
        amount_paid: parseFloat(amountPaid),
        webhook_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_reference', transactionReference);

    // Handle overpayment - could trigger refund process
    console.log('Overpayment detected:', transactionReference, {
      paid: amountPaid,
      expected: totalPayable,
    });

  } catch (error) {
    console.error('Error handling overpaid transaction:', error);
  }
}

async function handlePartiallyPaidTransaction(eventData: any) {
  const { transactionReference, amountPaid, totalPayable } = eventData;

  try {
    await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'PARTIALLY_PAID',
        amount_paid: parseFloat(amountPaid),
        webhook_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_reference', transactionReference);

    console.log('Partial payment received:', transactionReference, {
      paid: amountPaid,
      expected: totalPayable,
    });

  } catch (error) {
    console.error('Error handling partial payment:', error);
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