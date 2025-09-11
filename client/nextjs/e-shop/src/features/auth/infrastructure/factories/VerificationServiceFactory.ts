import { EmailVerificationService } from '../../application/services/EmailVerificationService';
import { TwoFactorService } from '../../application/services/TwoFactorService';
import { EmailVerificationRepository } from '../repositories/EmailVerificationRepository';
import { TwoFactorRepository } from '../repositories/TwoFactorRepository';

/**
 * Email Verification Service Factory
 * Implements Factory Pattern for EmailVerificationService creation
 * Handles dependency injection and configuration
 */
export class EmailVerificationServiceFactory {
    private static emailVerificationService: EmailVerificationService | null = null;

    /**
     * Create EmailVerificationService with proper dependencies
     * Implements Singleton pattern for service instance
     */
    static createEmailVerificationService(): EmailVerificationService {
        if (!this.emailVerificationService) {
            const emailVerificationRepository = new EmailVerificationRepository();
            this.emailVerificationService = new EmailVerificationService(emailVerificationRepository);
        }
        return this.emailVerificationService;
    }

    /**
     * Reset the singleton instance (useful for testing)
     */
    static resetInstance(): void {
        this.emailVerificationService = null;
    }
}

/**
 * Two-Factor Authentication Service Factory
 * Implements Factory Pattern for TwoFactorService creation
 * Handles dependency injection and configuration
 */
export class TwoFactorServiceFactory {
    private static twoFactorService: TwoFactorService | null = null;

    /**
     * Create TwoFactorService with proper dependencies
     * Implements Singleton pattern for service instance
     */
    static createTwoFactorService(): TwoFactorService {
        if (!this.twoFactorService) {
            const twoFactorRepository = new TwoFactorRepository();
            this.twoFactorService = new TwoFactorService(twoFactorRepository);
        }
        return this.twoFactorService;
    }

    /**
     * Reset the singleton instance (useful for testing)
     */
    static resetInstance(): void {
        this.twoFactorService = null;
    }
}
