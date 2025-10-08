// Monnify Payment Gateway Integration for Groovy December Festival
// Comprehensive payment solution for events, vendors, and pageant applications

declare global {
  interface Window {
    MonnifySDK: {
      initialize: (config: MonnifyConfig) => void;
    };
  }
}

// Monnify Configuration Types
export interface MonnifyConfig {
  amount: number;
  currency: string;
  reference: string;
  customerFullName: string;
  customerEmail: string;
  customerMobileNumber?: string;
  apiKey: string;
  contractCode: string;
  paymentDescription: string;
  paymentMethods?: PaymentMethod[];
  metadata?: Record<string, any>;
  incomeSplitConfig?: SubAccountConfig[];
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onComplete: (response: MonnifyResponse) => void;
  onClose: (response: MonnifyCloseResponse) => void;
}

export type PaymentMethod = 'CARD' | 'ACCOUNT_TRANSFER' | 'USSD' | 'PHONE_NUMBER';

export interface SubAccountConfig {
  subAccountCode: string;
  feePercentage?: number;
  splitAmount?: number;
  feeBearer?: boolean;
}

export interface MonnifyResponse {
  amount: number;
  amountPaid: number;
  completed: boolean;
  completedOn: string;
  createdOn: string;
  currencyCode: string;
  customerEmail: string;
  customerName: string;
  fee: number;
  metaData: Record<string, any>;
  payableAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED' | 'FAILED';
  transactionReference: string;
}

export interface MonnifyCloseResponse {
  authorizedAmount?: number;
  paymentStatus: 'USER_CANCELLED' | 'TIMEOUT' | 'FAILED';
  redirectUrl: string | null;
  responseCode: string;
  responseMessage: string;
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

// Monnify Payment Service
export class MonnifyPaymentService {
  private static instance: MonnifyPaymentService;
  private apiKey: string;
  private contractCode: string;
  private baseUrl: string;
  private isProduction: boolean;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_MONNIFY_API_KEY || '';
    this.contractCode = process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE || '';
    this.baseUrl = process.env.NEXT_PUBLIC_MONNIFY_BASE_URL || 'https://sandbox.monnify.com';
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // For now, payment system is temporarily disabled
    // This prevents console errors during development
    if (!this.apiKey || !this.contractCode) {
      console.warn('Payment system temporarily disabled - Monnify configuration not available');
    }
  }

  static getInstance(): MonnifyPaymentService {
    if (!MonnifyPaymentService.instance) {
      MonnifyPaymentService.instance = new MonnifyPaymentService();
    }
    return MonnifyPaymentService.instance;
  }

  // Load Monnify SDK
  async loadSDK(): Promise<boolean> {
    // Check if payment system is configured
    if (!this.apiKey || !this.contractCode) {
      console.warn('Payment system temporarily disabled - configuration not available');
      throw new Error('Payment system temporarily disabled');
    }

    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.MonnifySDK) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.monnify.com/plugin/monnify.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Monnify SDK loaded successfully');
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Monnify SDK');
        reject(new Error('Failed to load Monnify SDK'));
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

  // Initialize festival payment
  async initializeFestivalPayment(config: FestivalPaymentConfig): Promise<void> {
    try {
      // Check if payment system is configured
      if (!this.apiKey || !this.contractCode) {
        // Show user-friendly message instead of console error
        alert('🚧 Payment system is temporarily unavailable.\n\nPlease contact us directly to complete your registration:\n📧 hello@groovydecember.ng\n📞 +234-xxx-xxx-xxxx');
        return;
      }

      // Ensure SDK is loaded
      await this.loadSDK();

      if (!window.MonnifySDK) {
        throw new Error('Monnify SDK not available');
      }

      // Generate unique payment reference
      const paymentReference = this.generatePaymentReference(config.type, config.itemId);

      // Configure payment methods based on type
      let paymentMethods: PaymentMethod[] = ['ACCOUNT_TRANSFER', 'CARD', 'USSD'];
      
      // For smaller amounts, prioritize bank transfer and USSD
      if (config.amount <= 5000) {
        paymentMethods = ['ACCOUNT_TRANSFER', 'USSD', 'CARD'];
      }

      const monnifyConfig: MonnifyConfig = {
        amount: config.amount,
        currency: 'NGN',
        reference: paymentReference,
        customerFullName: config.customerDetails.fullName,
        customerEmail: config.customerDetails.email,
        customerMobileNumber: config.customerDetails.phone,
        apiKey: this.apiKey,
        contractCode: this.contractCode,
        paymentDescription: config.description,
        paymentMethods,
        metadata: {
          festival_event: 'Groovy December 2025',
          payment_type: config.type,
          item_id: config.itemId,
          item_name: config.itemName,
          ...config.metadata,
        },
        onLoadStart: () => {
          console.log('Monnify payment loading started');
          // Track payment start
          this.trackPaymentEvent('payment_started', config);
        },
        onLoadComplete: () => {
          console.log('Monnify payment loaded');
          this.trackPaymentEvent('payment_loaded', config);
        },
        onComplete: (response: MonnifyResponse) => {
          console.log('Payment completed:', response);
          this.handlePaymentComplete(response, config);
        },
        onClose: (response: MonnifyCloseResponse) => {
          console.log('Payment closed:', response);
          this.handlePaymentClose(response, config);
        },
      };

      // Initialize Monnify payment
      window.MonnifySDK.initialize(monnifyConfig);

    } catch (error) {
      console.error('Payment initialization error:', error);
      this.handlePaymentError(error as Error, config);
      throw error;
    }
  }

  // Handle successful payment
  private async handlePaymentComplete(response: MonnifyResponse, config: FestivalPaymentConfig) {
    try {
      // Track successful payment
      this.trackPaymentEvent('payment_completed', config, {
        amount: response.amount,
        paymentMethod: response.paymentMethod,
        transactionReference: response.transactionReference,
      });

      // Save payment record to database
      await this.savePaymentRecord(response, config);

      // Send confirmation email/notification
      await this.sendPaymentConfirmation(response, config);

      // Show success message
      this.showPaymentResult('success', response, config);

    } catch (error) {
      console.error('Post-payment processing error:', error);
      this.showPaymentResult('success_with_warning', response, config);
    }
  }

  // Handle payment cancellation/closure
  private handlePaymentClose(response: MonnifyCloseResponse, config: FestivalPaymentConfig) {
    console.log('Payment closed by user:', response);
    
    this.trackPaymentEvent('payment_cancelled', config, {
      reason: response.responseMessage,
      status: response.paymentStatus,
    });

    this.showPaymentResult('cancelled', response, config);
  }

  // Handle payment errors
  private handlePaymentError(error: Error, config: FestivalPaymentConfig) {
    console.error('Payment error:', error);
    
    this.trackPaymentEvent('payment_error', config, {
      error_message: error.message,
    });

    this.showPaymentResult('error', { message: error.message }, config);
  }

  // Save payment record to database
  private async savePaymentRecord(response: MonnifyResponse, config: FestivalPaymentConfig) {
    try {
      const paymentRecord = {
        transaction_reference: response.transactionReference,
        payment_reference: response.paymentReference,
        amount: response.amount,
        amount_paid: response.amountPaid,
        fee: response.fee,
        currency: response.currencyCode,
        payment_method: response.paymentMethod,
        payment_status: response.paymentStatus,
        customer_name: response.customerName,
        customer_email: response.customerEmail,
        payment_type: config.type,
        item_id: config.itemId,
        item_name: config.itemName,
        metadata: {
          ...response.metaData,
          festival_config: config.metadata,
        },
        completed_on: response.completedOn,
        created_on: response.createdOn,
      };

      // Make API call to save payment
      const saveResponse = await fetch('/api/payments/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRecord),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save payment record');
      }

      console.log('Payment record saved successfully');
    } catch (error) {
      console.error('Error saving payment record:', error);
      throw error;
    }
  }

  // Send payment confirmation
  private async sendPaymentConfirmation(response: MonnifyResponse, config: FestivalPaymentConfig) {
    try {
      await fetch('/api/payments/confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionReference: response.transactionReference,
          customerEmail: response.customerEmail,
          paymentType: config.type,
          itemName: config.itemName,
          amount: response.amount,
        }),
      });
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
  }

  // Track payment events for analytics
  private trackPaymentEvent(eventName: string, config: FestivalPaymentConfig, additionalData?: any) {
    try {
      // Google Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'payments',
          event_label: config.itemName,
          payment_type: config.type,
          amount: config.amount,
          currency: 'NGN',
          ...additionalData,
        });
      }

      // Custom analytics tracking
      console.log('Payment event tracked:', eventName, config, additionalData);
    } catch (error) {
      console.error('Error tracking payment event:', error);
    }
  }

  // Show payment result to user
  private showPaymentResult(
    type: 'success' | 'success_with_warning' | 'cancelled' | 'error', 
    response: any, 
    config: FestivalPaymentConfig
  ) {
    // This can be customized based on your UI framework
    const messages = {
      success: `🎉 Payment Successful!\n\nYour payment for ${config.itemName} has been processed successfully.\nAmount: ₦${config.amount.toLocaleString()}\nTransaction ID: ${response.transactionReference || 'N/A'}`,
      success_with_warning: `✅ Payment Successful!\n\nYour payment has been processed, but there was an issue with confirmation. Please contact support if you don't receive a confirmation email.`,
      cancelled: `❌ Payment Cancelled\n\nYou cancelled the payment for ${config.itemName}. You can try again anytime.`,
      error: `❌ Payment Error\n\nThere was an issue processing your payment: ${response.message || 'Unknown error'}.\nPlease try again or contact support.`
    };

    alert(messages[type]);

    // Redirect based on result
    if (type === 'success') {
      // Redirect to success page or reload current page
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  // Predefined payment configurations for festival services
  static getEventRegistrationConfig(eventDetails: {
    id: string;
    name: string;
    fee: number;
    customerDetails: { fullName: string; email: string; phone?: string };
  }): FestivalPaymentConfig {
    return {
      type: 'event_registration',
      itemId: eventDetails.id,
      itemName: eventDetails.name,
      customerDetails: eventDetails.customerDetails,
      amount: eventDetails.fee,
      description: `Registration fee for ${eventDetails.name} - Groovy December Festival 2025`,
      metadata: {
        event_id: eventDetails.id,
        event_name: eventDetails.name,
      },
    };
  }

  static getVendorBoothConfig(vendorDetails: {
    businessName: string;
    boothType: string;
    fee: number;
    customerDetails: { fullName: string; email: string; phone?: string };
  }): FestivalPaymentConfig {
    return {
      type: 'vendor_booth',
      itemId: `booth_${Date.now()}`,
      itemName: `${vendorDetails.boothType} Booth - ${vendorDetails.businessName}`,
      customerDetails: vendorDetails.customerDetails,
      amount: vendorDetails.fee,
      description: `Vendor booth fee for ${vendorDetails.businessName} - Groovy December Festival 2025`,
      metadata: {
        business_name: vendorDetails.businessName,
        booth_type: vendorDetails.boothType,
      },
    };
  }

  static getPageantApplicationConfig(contestantDetails: {
    fullName: string;
    email: string;
    phone?: string;
    fee: number;
  }): FestivalPaymentConfig {
    return {
      type: 'pageant_application',
      itemId: `pageant_${Date.now()}`,
      itemName: 'Miss Groovy December 2025 Application Fee',
      customerDetails: {
        fullName: contestantDetails.fullName,
        email: contestantDetails.email,
        phone: contestantDetails.phone,
      },
      amount: contestantDetails.fee,
      description: 'Application fee for Miss Groovy December 2025 Pageant',
      metadata: {
        pageant_year: '2025',
        application_type: 'contestant',
      },
    };
  }

  // Calculate Monnify transaction fee
  calculateFee(amount: number): number {
    const feeRate = 0.015; // 1.5%
    const feeCapNGN = 2000; // ₦2,000 cap
    const calculatedFee = amount * feeRate;
    return Math.min(calculatedFee, feeCapNGN);
  }

  // Initialize payment - alias for initializeFestivalPayment
  async initializePayment(config: FestivalPaymentConfig): Promise<void> {
    return this.initializeFestivalPayment(config);
  }
}

// Export the singleton instance
export const monnifyService = MonnifyPaymentService.getInstance();
export const monnifyPaymentService = monnifyService; // Alias for consistency

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateMonnifyFee = (amount: number): number => {
  const feeRate = 0.015; // 1.5%
  const feeCapNGN = 2000; // ₦2,000 cap
  const calculatedFee = amount * feeRate;
  return Math.min(calculatedFee, feeCapNGN);
};

export const getTotalAmountWithFee = (baseAmount: number): number => {
  return baseAmount + calculateMonnifyFee(baseAmount);
};

export default monnifyService;