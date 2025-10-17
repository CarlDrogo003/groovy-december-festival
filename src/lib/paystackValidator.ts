// Environment Variable Validation for Paystack Integration
// Comprehensive validation for all required Paystack credentials and configurations

export interface PaystackEnvironmentConfig {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  configuration: {
    hasPublicKey: boolean;
    hasSecretKey: boolean;
    publicKeyType: 'TEST' | 'LIVE' | 'INVALID' | 'MISSING';
    secretKeyType: 'TEST' | 'LIVE' | 'INVALID' | 'MISSING';
    environment: string;
    isProduction: boolean;
    keysMatch: boolean;
  };
  recommendations: string[];
  testInstructions: string[];
}

export class PaystackEnvironmentValidator {
  private static instance: PaystackEnvironmentValidator;

  static getInstance(): PaystackEnvironmentValidator {
    if (!PaystackEnvironmentValidator.instance) {
      PaystackEnvironmentValidator.instance = new PaystackEnvironmentValidator();
    }
    return PaystackEnvironmentValidator.instance;
  }

  validateEnvironment(): PaystackEnvironmentConfig {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const testInstructions: string[] = [];

    // Get environment variables
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const nodeEnv = process.env.NODE_ENV;
    const vercelEnv = process.env.VERCEL_ENV;

    // Validate public key
    const publicKeyValidation = this.validatePublicKey(publicKey);
    const secretKeyValidation = this.validateSecretKey(secretKey);

    // Environment detection
    const isProduction = nodeEnv === 'production' || vercelEnv === 'production';

    // Check key compatibility
    const keysMatch = this.checkKeyCompatibility(publicKey, secretKey);

    // Collect errors
    if (!publicKeyValidation.isValid) {
      errors.push(...publicKeyValidation.errors);
    }
    if (!secretKeyValidation.isValid) {
      errors.push(...secretKeyValidation.errors);
    }
    if (!keysMatch.compatible) {
      errors.push(keysMatch.error || 'Public and secret keys do not match (TEST vs LIVE)');
    }

    // Collect warnings
    if (publicKeyValidation.warnings) {
      warnings.push(...publicKeyValidation.warnings);
    }
    if (secretKeyValidation.warnings) {
      warnings.push(...secretKeyValidation.warnings);
    }

    // Environment-specific warnings
    if (isProduction && publicKeyValidation.type === 'TEST') {
      warnings.push('Using TEST keys in production environment - real transactions will fail');
    }
    if (!isProduction && publicKeyValidation.type === 'LIVE') {
      warnings.push('Using LIVE keys in development - be careful with real money transactions');
    }

    // Generate recommendations
    if (errors.length > 0) {
      recommendations.push('Fix the errors above before attempting payments');
    }
    
    if (publicKeyValidation.type === 'TEST') {
      recommendations.push('Set up webhook URL in Paystack dashboard: https://dashboard.paystack.co/#/settings/developer');
      recommendations.push('Test with Paystack test cards before going live');
      testInstructions.push('Test Success Card: 4084084084084081');
      testInstructions.push('Test Failed Card: 4084084084084084');
      testInstructions.push('Use any CVV (123) and future expiry date');
    }

    if (publicKeyValidation.type === 'LIVE') {
      recommendations.push('Ensure your business is verified on Paystack dashboard');
      recommendations.push('Configure live webhook URL for production');
      recommendations.push('Monitor transactions carefully in live mode');
    }

    // Webhook configuration recommendations
    if (typeof window === 'undefined') {
      // Server-side
      const protocol = isProduction ? 'https' : 'http';
      const domain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
      const webhookUrl = `${protocol}://${domain}/api/payments/webhook`;
      const callbackUrl = `${protocol}://${domain}/api/payments/callback`;
      
      recommendations.push(`Configure webhook URL in Paystack dashboard: ${webhookUrl}`);
      recommendations.push(`Your callback URL is: ${callbackUrl}`);
    }

    // Security recommendations
    recommendations.push('Never expose secret key in frontend code');
    recommendations.push('Always verify payments server-side using webhooks or verify API');
    recommendations.push('Use HTTPS in production for secure payment processing');

    const configuration = {
      hasPublicKey: !!publicKey,
      hasSecretKey: !!secretKey,
      publicKeyType: publicKeyValidation.type,
      secretKeyType: secretKeyValidation.type,
      environment: nodeEnv || 'unknown',
      isProduction,
      keysMatch: keysMatch.compatible,
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      configuration,
      recommendations,
      testInstructions,
    };
  }

  private validatePublicKey(publicKey?: string): {
    isValid: boolean;
    type: 'TEST' | 'LIVE' | 'INVALID' | 'MISSING';
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!publicKey) {
      return {
        isValid: false,
        type: 'MISSING',
        errors: ['NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable is missing'],
        warnings: [],
      };
    }

    // Check format
    if (!publicKey.startsWith('pk_')) {
      errors.push('Public key must start with "pk_"');
      return {
        isValid: false,
        type: 'INVALID',
        errors,
        warnings,
      };
    }

    // Determine type
    let type: 'TEST' | 'LIVE' | 'INVALID';
    if (publicKey.startsWith('pk_test_')) {
      type = 'TEST';
    } else if (publicKey.startsWith('pk_live_')) {
      type = 'LIVE';
      warnings.push('Using LIVE public key - real transactions will be processed');
    } else {
      type = 'INVALID';
      errors.push('Public key format is invalid (should be pk_test_xxx or pk_live_xxx)');
    }

    // Check length
    if (publicKey.length < 20) {
      errors.push('Public key appears to be too short');
    }

    return {
      isValid: errors.length === 0,
      type,
      errors,
      warnings,
    };
  }

  private validateSecretKey(secretKey?: string): {
    isValid: boolean;
    type: 'TEST' | 'LIVE' | 'INVALID' | 'MISSING';
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!secretKey) {
      return {
        isValid: false,
        type: 'MISSING',
        errors: ['PAYSTACK_SECRET_KEY environment variable is missing'],
        warnings: [],
      };
    }

    // Check format
    if (!secretKey.startsWith('sk_')) {
      errors.push('Secret key must start with "sk_"');
      return {
        isValid: false,
        type: 'INVALID',
        errors,
        warnings,
      };
    }

    // Determine type
    let type: 'TEST' | 'LIVE' | 'INVALID';
    if (secretKey.startsWith('sk_test_')) {
      type = 'TEST';
    } else if (secretKey.startsWith('sk_live_')) {
      type = 'LIVE';
      warnings.push('Using LIVE secret key - real transactions will be processed');
    } else {
      type = 'INVALID';
      errors.push('Secret key format is invalid (should be sk_test_xxx or sk_live_xxx)');
    }

    // Check length
    if (secretKey.length < 20) {
      errors.push('Secret key appears to be too short');
    }

    return {
      isValid: errors.length === 0,
      type,
      errors,
      warnings,
    };
  }

  private checkKeyCompatibility(publicKey?: string, secretKey?: string): {
    compatible: boolean;
    error?: string;
  } {
    if (!publicKey || !secretKey) {
      return { compatible: false, error: 'Both public and secret keys are required' };
    }

    const publicIsTest = publicKey.startsWith('pk_test_');
    const secretIsTest = secretKey.startsWith('sk_test_');

    if (publicIsTest !== secretIsTest) {
      return {
        compatible: false,
        error: 'Public and secret keys must both be TEST or both be LIVE keys',
      };
    }

    return { compatible: true };
  }

  // Generate a detailed configuration report
  generateConfigurationReport(): string {
    const validation = this.validateEnvironment();
    
    let report = '🔧 PAYSTACK CONFIGURATION REPORT\n';
    report += '='.repeat(50) + '\n\n';

    // Status
    report += `Status: ${validation.isValid ? '✅ VALID' : '❌ INVALID'}\n`;
    report += `Environment: ${validation.configuration.environment}\n`;
    report += `Production Mode: ${validation.configuration.isProduction ? 'YES' : 'NO'}\n\n`;

    // Keys
    report += '🔑 KEYS CONFIGURATION:\n';
    report += `Public Key: ${validation.configuration.hasPublicKey ? '✅' : '❌'} (${validation.configuration.publicKeyType})\n`;
    report += `Secret Key: ${validation.configuration.hasSecretKey ? '✅' : '❌'} (${validation.configuration.secretKeyType})\n`;
    report += `Keys Match: ${validation.configuration.keysMatch ? '✅' : '❌'}\n\n`;

    // Errors
    if (validation.errors.length > 0) {
      report += '❌ ERRORS (MUST FIX):\n';
      validation.errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`;
      });
      report += '\n';
    }

    // Warnings
    if (validation.warnings.length > 0) {
      report += '⚠️ WARNINGS:\n';
      validation.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
      report += '\n';
    }

    // Recommendations
    if (validation.recommendations.length > 0) {
      report += '💡 RECOMMENDATIONS:\n';
      validation.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
      report += '\n';
    }

    // Test instructions
    if (validation.testInstructions.length > 0) {
      report += '🧪 TEST INSTRUCTIONS:\n';
      validation.testInstructions.forEach((instruction, index) => {
        report += `${index + 1}. ${instruction}\n`;
      });
      report += '\n';
    }

    return report;
  }

  // Quick validation for API endpoints
  validateForApiRequest(): { valid: boolean; error?: string } {
    const validation = this.validateEnvironment();
    
    if (!validation.isValid) {
      return {
        valid: false,
        error: validation.errors.join('; '),
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const paystackValidator = PaystackEnvironmentValidator.getInstance();

// Quick validation function
export function validatePaystackEnvironment(): PaystackEnvironmentConfig {
  return paystackValidator.validateEnvironment();
}

// Quick check function for API routes
export function isPaystackConfigured(): boolean {
  return paystackValidator.validateForApiRequest().valid;
}