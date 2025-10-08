import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';
import { getServerUser } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    // Validate required fields
    const {
      transaction_reference,
      payment_reference,
      amount,
      amount_paid,
      fee,
      currency,
      payment_method,
      payment_status,
      customer_name,
      customer_email,
      payment_type,
      item_id,
      item_name,
      metadata,
      completed_on,
      created_on,
    } = paymentData;

    if (!transaction_reference || !payment_reference || !amount || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    // Get authenticated user (optional - payments can be made by non-authenticated users)
    const { user } = await getServerUser();

    // Check if payment record already exists
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('transaction_reference', transaction_reference)
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment record already exists' },
        { status: 409 }
      );
    }

    // Insert payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([{
        transaction_reference,
        payment_reference,
        amount: parseFloat(amount),
        amount_paid: parseFloat(amount_paid || amount),
        fee: parseFloat(fee || 0),
        currency: currency || 'NGN',
        payment_method,
        payment_status,
        customer_name,
        customer_email,
        payment_type,
        item_id,
        item_name,
        user_id: user?.id || null,
        metadata: metadata || {},
        completed_on,
        created_on,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (paymentError) {
      console.error('Database error:', paymentError);
      return NextResponse.json(
        { error: 'Failed to save payment record' },
        { status: 500 }
      );
    }

    // Update related records based on payment type
    await updateRelatedRecords(payment_type, item_id, transaction_reference, payment_status);

    return NextResponse.json({
      success: true,
      payment: payment,
      message: 'Payment record saved successfully'
    });

  } catch (error) {
    console.error('Payment record API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateRelatedRecords(
  paymentType: string,
  itemId: string,
  transactionReference: string,
  paymentStatus: string
) {
  try {
    switch (paymentType) {
      case 'event_registration':
        // Update event registration payment status
        await supabaseAdmin
          .from('event_registrations')
          .update({
            payment_status: paymentStatus === 'PAID' ? 'paid' : 'pending',
            payment_reference: transactionReference,
            updated_at: new Date().toISOString(),
          })
          .eq('event_id', itemId);
        break;

      case 'vendor_booth':
        // Update vendor application payment status
        await supabaseAdmin
          .from('vendors')
          .update({
            payment_status: paymentStatus === 'PAID' ? 'paid' : 'pending',
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemId);
        break;

      case 'pageant_application':
        // Update pageant contestant payment status
        await supabaseAdmin
          .from('pageant_contestants')
          .update({
            // Add payment_status column to pageant_contestants table if needed
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemId);
        break;

      default:
        console.log('No specific update logic for payment type:', paymentType);
    }
  } catch (error) {
    console.error('Error updating related records:', error);
  }
}