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
    // More robust environment detection
    this.isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    
    // Enhanced configuration check with detailed logging
    if (!this.publicKey) {
      console.error('URGENT: Paystack public key missing!', {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        hasPublicKey: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        hasSecretKey: !!process.env.PAYSTACK_SECRET_KEY,
        keyPreview: this.publicKey ? `${this.publicKey.substring(0, 7)}...` : 'missing'
      });
    }
    
    if (!this.secretKey && typeof window === 'undefined') {
      console.error('URGENT: Paystack secret key missing for server operations!');
    }

    // Log test mode status
    const isTestKey = this.publicKey.startsWith('pk_test_');
    console.log('Paystack Configuration:', {
      isProduction: this.isProduction,
      isTestKey: isTestKey,
      environment: process.env.NODE_ENV,
      recommendedMode: isTestKey ? 'TEST MODE - Safe for testing' : 'LIVE MODE - Real transactions'
    });
  }

  static getInstance(): PaystackPaymentService {
    if (!PaystackPaymentService.instance) {
      PaystackPaymentService.instance = new PaystackPaymentService();
    }
    return PaystackPaymentService.instance;
  }

  // Testing utility to check configuration
  getTestConfiguration(): object {
    const isTestKey = this.publicKey.startsWith('pk_test_');
    return {
      hasPublicKey: !!this.publicKey,
      hasSecretKey: !!this.secretKey,
      isTestMode: isTestKey,
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      keyPreview: this.publicKey ? `${this.publicKey.substring(0, 12)}...` : 'MISSING',
      isProduction: this.isProduction,
      recommendedTestCards: {
        success: '4084084084084081',
        failed: '4084084084084084',
        pending: '4084084084084089'
      }
    };
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

  // Initialize festival payment using server-side initialization (RECOMMENDED)
  async initializeFestivalPayment(config: FestivalPaymentConfig): Promise<void> {
    try {
      // Check if payment system is configured
      if (!this.publicKey) {
        // Show user-friendly message instead of console error
        alert('🚧 Payment system is temporarily unavailable.\n\nPlease contact us directly to complete your registration:\n📧 hello@groovydecember.ng\n📞 +234-xxx-xxx-xxxx');
        return;
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

      // Prepare initialization request
      const initializationRequest = {
        email: config.customerDetails.email,
        amount: config.amount, // Will be converted to kobo on server
        reference: paymentReference,
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
      };

      console.log('Initializing payment via server...', {
        reference: paymentReference,
        amount: config.amount,
        email: config.customerDetails.email
      });

      // Track payment start
      this.trackPaymentEvent('payment_started', config);

      // Initialize payment via server API
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initializationRequest),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Payment initialization failed');
      }

      console.log('Payment initialized successfully:', result.data);

      // Redirect to Paystack checkout page
      if (result.data.authorization_url) {
        // Store payment details for later verification
        this.storePaymentDetails(config, result.data);
        
        // Redirect to Paystack checkout
        window.location.href = result.data.authorization_url;
      } else {
        throw new Error('No authorization URL received from Paystack');
      }

    } catch (error) {
      console.error('Payment initialization error:', error);
      this.handlePaymentError(error as Error, config);
      throw error;
    }
  }

  // Store payment details in localStorage for verification after redirect
  private storePaymentDetails(config: FestivalPaymentConfig, paymentData: any) {
    try {
      const paymentDetails = {
        config,
        paymentData,
        timestamp: Date.now(),
        reference: paymentData.reference
      };
      
      localStorage.setItem('groovy_payment_pending', JSON.stringify(paymentDetails));
      
      // Auto-cleanup after 30 minutes
      setTimeout(() => {
        localStorage.removeItem('groovy_payment_pending');
      }, 30 * 60 * 1000);
      
    } catch (error) {
      console.warn('Could not store payment details:', error);
    }
  }

  // Retrieve and clear stored payment details
  getStoredPaymentDetails(): any {
    try {
      const stored = localStorage.getItem('groovy_payment_pending');
      if (stored) {
        localStorage.removeItem('groovy_payment_pending');
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not retrieve payment details:', error);
    }
    return null;
  }

  // Handle payment errors
  private handlePaymentError(error: Error, config: FestivalPaymentConfig) {
    console.error('Payment error:', error);
    
    this.trackPaymentEvent('payment_error', config, {
      error_message: error.message,
    });

    this.showPaymentResult('error', { message: error.message }, config);
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