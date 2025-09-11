/**
 * Authentication Storage Configuration
 * 
 * This file provides runtime configuration for token storage preferences:
 * - Storage type selection (localStorage vs sessionStorage)
 * - Storage preference management
 * - Dynamic storage configuration based on user choice
 */

import { authConstants } from '@/constants/auth.constants';
import { TokenStorageUtils } from '@/utils/tokenStorage';

export interface StorageConfig {
    storageType: 'localStorage' | 'sessionStorage';
    rememberMe: boolean;
}

/**
 * Storage configuration manager
 */
export class AuthStorageConfig {
    private static readonly STORAGE_PREFERENCE_KEY = 'auth_storage_preference';

    /**
     * Get current storage configuration
     */
    static getStorageConfig(): StorageConfig {
        if (typeof window === 'undefined') {
            return {
                storageType: authConstants.TOKEN.STORAGE_TYPE,
                rememberMe: false
            };
        }

        try {
            const saved = localStorage.getItem(this.STORAGE_PREFERENCE_KEY);
            if (saved) {
                const config = JSON.parse(saved) as StorageConfig;
                return {
                    storageType: config.storageType || authConstants.TOKEN.STORAGE_TYPE,
                    rememberMe: config.rememberMe || false
                };
            }
        } catch (error) {
            console.error('Failed to get storage configuration:', error);
        }

        return {
            storageType: authConstants.TOKEN.STORAGE_TYPE,
            rememberMe: false
        };
    }

    /**
     * Set storage configuration
     */
    static setStorageConfig(config: Partial<StorageConfig>): void {
        if (typeof window === 'undefined') return;

        try {
            const currentConfig = this.getStorageConfig();
            const newConfig = { ...currentConfig, ...config };

            localStorage.setItem(this.STORAGE_PREFERENCE_KEY, JSON.stringify(newConfig));

            // Apply storage preference to token storage if needed
            if (config.storageType && config.storageType !== currentConfig.storageType) {
                TokenStorageUtils.setStoragePreference(config.storageType);
            }
        } catch (error) {
            console.error('Failed to set storage configuration:', error);
        }
    }

    /**
     * Set remember me preference (affects token storage duration)
     */
    static setRememberMe(rememberMe: boolean): void {
        this.setStorageConfig({
            rememberMe,
            storageType: rememberMe ? 'localStorage' : 'sessionStorage'
        });
    }

    /**
     * Check if remember me is enabled
     */
    static isRememberMeEnabled(): boolean {
        return this.getStorageConfig().rememberMe;
    }

    /**
     * Get recommended storage type based on user context
     */
    static getRecommendedStorageType(): 'localStorage' | 'sessionStorage' {
        const config = this.getStorageConfig();

        // If user has explicitly set remember me, use localStorage
        if (config.rememberMe) return 'localStorage';

        // Default to configured storage type
        return config.storageType;
    }

    /**
     * Apply storage settings during login
     */
    static applyLoginSettings(rememberMe?: boolean): void {
        if (rememberMe !== undefined) {
            this.setRememberMe(rememberMe);
        }
    }

    /**
     * Clear storage configuration (typically on logout)
     */
    static clearStorageConfig(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(this.STORAGE_PREFERENCE_KEY);
        } catch (error) {
            console.error('Failed to clear storage configuration:', error);
        }
    }
}

/**
 * Hook for managing storage configuration in components
 */
export function useAuthStorageConfig() {
    const getConfig = () => AuthStorageConfig.getStorageConfig();
    const setConfig = (config: Partial<StorageConfig>) => AuthStorageConfig.setStorageConfig(config);
    const setRememberMe = (rememberMe: boolean) => AuthStorageConfig.setRememberMe(rememberMe);
    const isRememberMe = () => AuthStorageConfig.isRememberMeEnabled();

    return {
        getConfig,
        setConfig,
        setRememberMe,
        isRememberMe,
        applyLoginSettings: AuthStorageConfig.applyLoginSettings,
        clearConfig: AuthStorageConfig.clearStorageConfig
    };
}
