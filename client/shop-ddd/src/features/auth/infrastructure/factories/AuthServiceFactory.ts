import { AuthService } from '../../application/services/AuthService';
import { OAuthService } from '../../application/services/OAuthService';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { IOAuthRepository } from '../../domain/repositories/IOAuthRepository';
import { AuthRTKRepository } from '../repositories/AuthRepository';
import { OAuthRTKRepository } from '../repositories/OAuthRepository';

/**
 * Service Factory for Dependency Injection
 * Creates properly configured service instances with injected dependencies
 */
export class AuthServiceFactory {
    private static authRepositoryInstance: IAuthRepository;
    private static oauthRepositoryInstance: IOAuthRepository;

    /**
     * Get or create AuthRepository instance
     */
    static getAuthRepository(): IAuthRepository {
        if (!this.authRepositoryInstance) {
            this.authRepositoryInstance = new AuthRTKRepository();
        }
        return this.authRepositoryInstance;
    }

    /**
     * Get or create OAuthRepository instance
     */
    static getOAuthRepository(): IOAuthRepository {
        if (!this.oauthRepositoryInstance) {
            this.oauthRepositoryInstance = new OAuthRTKRepository();
        }
        return this.oauthRepositoryInstance;
    }

    /**
     * Create AuthService with proper dependencies
     */
    static createAuthService(): AuthService {
        const authRepository = this.getAuthRepository();
        return new AuthService(authRepository);
    }

    /**
     * Create OAuthService with proper dependencies
     */
    static createOAuthService(): OAuthService {
        const oauthRepository = this.getOAuthRepository();
        return new OAuthService(oauthRepository);
    }

    /**
     * Set custom repository implementations (for testing)
     */
    static setAuthRepository(repository: IAuthRepository): void {
        this.authRepositoryInstance = repository;
    }

    static setOAuthRepository(repository: IOAuthRepository): void {
        this.oauthRepositoryInstance = repository;
    }

    /**
     * Reset all instances (for testing)
     */
    static reset(): void {
        this.authRepositoryInstance = undefined as unknown as IAuthRepository;
        this.oauthRepositoryInstance = undefined as unknown as IOAuthRepository;
    }
}
