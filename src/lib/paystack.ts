// Paystack Payment Gateway Integration for Groovy December Festival
// Comprehensive payment solution for events, vendors, and pageant applications

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => PaystackHandler;
    };
  }
}

interface PaystackHandler {
  openIframe: () => void;
}

// Paystack Configuration Types
export interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // Amount in kobo
  currency?: string;
  ref: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  metadata?: Record<string, any>;
  channels?: PaymentChannel[];
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

export type PaymentChannel = 'card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer';

export interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  redirecturl?: string;
}

// Payment initialization for different festival services
export interface FestivalPaymentConfig {
  type: 'event_registration' | 'vendor_booth' | 'pageant_application' | 'general';
  itemId?: string;
  itemName: string;
  customerDetails: {
    fullName: string;
    email: string;
    phone?: string;
  };
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

// Paystack Payment Service
export class PaystackPaymentService {
  private static instance: PaystackPaymentService;
  private publicKey: string;
  private secretKey: string;
  private baseUrl: string;
  private isProduction: boolean;

  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    this.baseUrl = 'https://api.paystack.co';
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Check configuration
    if (!this.publicKey) {
      console.warn('Payment system temporarily disabled - Paystack configuration not available');
    }
  }

  static getInstance(): PaystackPaymentService {
    if (!PaystackPaymentService.instance) {
      PaystackPaymentService.instance = new PaystackPaymentService();
    }
    return PaystackPaymentService.instance;
  }

  // Load Paystack SDK
  async loadSDK(): Promise<boolean> {
    // Check if payment system is configured
    if (!this.publicKey) {
      console.warn('Payment system temporarily disabled - configuration not available');
      throw new Error('Payment system temporarily disabled');
    }

    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.PaystackPop) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Paystack SDK loaded successfully');
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Paystack SDK');
        reject(new Error('Failed to load Paystack SDK'));
      };

      document.head.appendChild(script);
    });
  }

  // Generate unique payment reference
  generatePaymentReference(type: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const typePrefix = type.toUpperCase().replace('_', '');
    const festivalPrefix = prefix || 'GROOVY2025';
    
    return `${festivalPrefix}_${typePrefix}_${timestamp}_${random}`;
  }

  // Convert amount to kobo (Paystack uses kobo)
  private convertToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  // Convert amount from kobo to naira
  private convertFromKobo(amount: number): number {
    return amount / 100;
  }

  // Calculate Paystack fee (1.5% + N100 for Nigerian cards, 3.9% for international)
  calculatePaystackFee(amount: number, isInternational: boolean = false): number {
    const feePercentage = isInternational ? 0.039 : 0.015;
    const fixedFee = isInternational ? 0 : 100; // N100 for local cards only
    
    const percentageFee = amount * feePercentage;
    const totalFee = percentageFee + fixedFee;
    
    // Paystack caps fees at N2000
    return Math.min(totalFee, 2000);
  }

  // Initialize festival payment
  async initializeFestivalPayment(config: FestivalPaymentConfig): Promise<void> {
    try {
      // Check if payment system is configured
      if (!this.publicKey) {
        // Show user-friendly message instead of console error
        alert('🚧 Payment system is temporarily unavailable.\n\nPlease contact us directly to complete your registration:\n📧 hello@groovydecember.ng\n📞 +234-xxx-xxx-xxxx');
        return;
      }

      // Ensure SDK is loaded
      await this.loadSDK();

      if (!window.PaystackPop) {
        throw new Error('Paystack SDK not available');
      }

      // Generate unique payment reference
      const paymentReference = this.generatePaymentReference(config.type, config.itemId);

      // Parse customer name
      const nameParts = config.customerDetails.fullName.trim().split(' ');
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';

      // Configure payment channels based on type and amount
      let channels: PaymentChannel[] = ['card', 'bank', 'ussd', 'bank_transfer'];
      
      // For smaller amounts, prioritize bank transfer and USSD
      if (config.amount <= 5000) {
        channels = ['bank_transfer', 'ussd', 'card', 'bank'];
      }

      const paystackConfig: PaystackConfig = {
        key: this.publicKey,
        email: config.customerDetails.email,
        amount: this.convertToKobo(config.amount),
        currency: 'NGN',
        ref: paymentReference,
        firstname,
        lastname,
        phone: config.customerDetails.phone,
        channels,
        metadata: {
          festival_event: 'Groovy December 2025',
          payment_type: config.type,
          item_id: config.itemId,
          item_name: config.itemName,
          description: config.description,
          ...config.metadata,
        },
        callback: (response: PaystackResponse) => {
          console.log('Payment completed:', response);
          this.handlePaymentSuccess(response, config);
        },
        onClose: () => {
          console.log('Payment closed by user');
          this.handlePaymentClose(config);
        },
      };

      // Track payment start
      this.trackPaymentEvent('payment_started', config);

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup(paystackConfig);
      handler.openIframe();

    } catch (error) {
      console.error('Payment initialization error:', error);
      this.handlePaymentError(error as Error, config);
      throw error;
    }
  }

  // Handle successful payment
  private async handlePaymentSuccess(response: PaystackResponse, config: FestivalPaymentConfig) {
    try {
      // Track successful payment
      this.trackPaymentEvent('payment_completed', config, {
        reference: response.reference,
        transaction_id: response.transaction,
      });

      // Verify payment on server
      const verificationResult = await this.verifyPayment(response.reference);
      
      if (verificationResult.success) {
        // Save payment record to database
        await this.savePaymentRecord(verificationResult.data, config);

        // Send confirmation email/notification
        await this.sendPaymentConfirmation(verificationResult.data, config);

        // Show success message
        this.showPaymentResult('success', verificationResult.data, config);
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (error) {
      console.error('Post-payment processing error:', error);
      this.showPaymentResult('success_with_warning', response, config);
    }
  }

  // Handle payment cancellation/closure
  private handlePaymentClose(config: FestivalPaymentConfig) {
    console.log('Payment closed by user');
    
    this.trackPaymentEvent('payment_cancelled', config, {
      reason: 'User closed payment modal',
    });

    this.showPaymentResult('cancelled', null, config);
  }

  // Handle payment errors
  private handlePaymentError(error: Error, config: FestivalPaymentConfig) {
    console.error('Payment error:', error);
    
    this.trackPaymentEvent('payment_error', config, {
      error_message: error.message,
    });

    this.showPaymentResult('error', { message: error.message }, config);
  }

  // Verify payment on server
  private async verifyPayment(reference: string): Promise<{ success: boolean; data?: any }> {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false };
    }
  }

  // Save payment record to database
  private async savePaymentRecord(paymentData: any, config: FestivalPaymentConfig) {
    try {
      const paymentRecord = {
        transaction_reference: paymentData.id,
        payment_reference: paymentData.reference,
        amount: this.convertFromKobo(paymentData.amount),
        amount_paid: this.convertFromKobo(paymentData.amount),
        fee: this.convertFromKobo(paymentData.fees || 0),
        currency: paymentData.currency,
        payment_method: paymentData.channel,
        payment_status: paymentData.status.toUpperCase(),
        customer_name: `${paymentData.customer.first_name} ${paymentData.customer.last_name}`,
        customer_email: paymentData.customer.email,
        payment_type: config.type,
        item_id: config.itemId,
        item_name: config.itemName,
        metadata: {
          ...paymentData.metadata,
          festival_config: config.metadata,
          paystack_data: paymentData,
        },
        completed_on: paymentData.paid_at,
        created_on: paymentData.created_at,
      };

      // Make API call to save payment
      const response = await fetch('/api/payments/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRecord),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment record');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving payment record:', error);
      throw error;
    }
  }

  // Send payment confirmation
  private async sendPaymentConfirmation(paymentData: any, config: FestivalPaymentConfig) {
    try {
      const response = await fetch('/api/payments/confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment: paymentData,
          config: config,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to send payment confirmation email');
      }
    } catch (error) {
      console.warn('Error sending confirmation:', error);
    }
  }

  // Track payment events
  private trackPaymentEvent(event: string, config: FestivalPaymentConfig, additionalData?: any) {
    try {
      // Integration with analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, {
          event_category: 'payment',
          event_label: config.type,
          value: config.amount,
          ...additionalData,
        });
      }

      // Custom event tracking can be added here
      console.log('Payment event tracked:', event, config, additionalData);
    } catch (error) {
      console.warn('Failed to track payment event:', error);
    }
  }

  // Show payment result to user
  private showPaymentResult(type: string, data: any, config: FestivalPaymentConfig) {
    switch (type) {
      case 'success':
        alert(`🎉 Payment Successful!\n\nAmount: ₦${config.amount.toLocaleString()}\nReference: ${data.reference}\n\nYou will receive a confirmation email shortly.`);
        // Redirect or refresh page as needed
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        break;
        
      case 'success_with_warning':
        alert(`✅ Payment Completed!\n\nAmount: ₦${config.amount.toLocaleString()}\n\nNote: There may be a delay in processing. Please contact us if you don't receive confirmation within 24 hours.`);
        break;
        
      case 'cancelled':
        alert('Payment was cancelled. You can try again anytime.');
        break;
        
      case 'error':
        alert(`❌ Payment Error\n\n${data.message}\n\nPlease try again or contact support.`);
        break;
    }
  }
}

// Export singleton instance
export const paystackService = PaystackPaymentService.getInstance();

// Utility functions
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

export const calculatePaystackFee = (amount: number, isInternational: boolean = false): number => {
  return paystackService.calculatePaystackFee(amount, isInternational);
};

// Export for compatibility
export { PaystackPaymentService as paystackPaymentService };