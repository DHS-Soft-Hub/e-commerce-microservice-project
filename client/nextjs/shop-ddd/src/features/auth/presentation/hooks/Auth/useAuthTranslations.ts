'use client';

import { useTranslations } from '@/lib/language';

/**
 * Hook for auth-specific translations
 * Provides typed access to auth module translations
 */
export const useAuthTranslations = () => {
    const { t } = useTranslations('auth');

    // Helper function to get auth translations
    const authT = (key: string): string => {
        // Pass the full key as it appears in the JSON file
        return t(key);
    };

    return {
        // Login translations
        login: {
            title: authT('auth.login.title'),
            subtitle: authT('auth.login.subtitle'),
            email: authT('auth.login.email'),
            password: authT('auth.login.password'),
            rememberMe: authT('auth.login.rememberMe'),
            userType: authT('auth.login.userType'),
            userTypes: {
                client: authT('auth.login.userType.client'),
                developer: authT('auth.login.userType.developer'),
                basic: authT('auth.login.userType.basic'),
            },
            totpCode: authT('auth.login.totpCode'),
            submit: authT('auth.login.submit'),
            forgotPassword: authT('auth.login.forgotPassword'),
            noAccount: authT('auth.login.noAccount'),
            signUp: authT('auth.login.signUp'),
            loading: authT('auth.login.loading'),
            success: authT('auth.login.success'),
            errors: {
                invalidCredentials: authT('auth.login.error.invalidCredentials'),
                emailRequired: authT('auth.login.error.emailRequired'),
                emailInvalid: authT('auth.login.error.emailInvalid'),
                passwordRequired: authT('auth.login.error.passwordRequired'),
                totpRequired: authT('auth.login.error.totpRequired'),
                totpInvalid: authT('auth.login.error.totpInvalid'),
            },
        },

        // Registration translations
        register: {
            title: authT('auth.register.title'),
            subtitle: authT('auth.register.subtitle'),
            client: {
                title: authT('auth.register.client.title'),
                subtitle: authT('auth.register.client.subtitle'),
            },
            developer: {
                title: authT('auth.register.developer.title'),
                subtitle: authT('auth.register.developer.subtitle'),
            },
            firstName: authT('auth.register.firstName'),
            lastName: authT('auth.register.lastName'),
            email: authT('auth.register.email'),
            password: authT('auth.register.password'),
            confirmPassword: authT('auth.register.confirmPassword'),
            phone: authT('auth.register.phone'),
            taxId: authT('auth.register.taxId'),
            address: authT('auth.register.address'),
            company: authT('auth.register.company'),
            jobTitle: authT('auth.register.jobTitle'),
            website: authT('auth.register.website'),
            githubProfile: authT('auth.register.githubProfile'),
            linkedinProfile: authT('auth.register.linkedinProfile'),
            portfolioUrl: authT('auth.register.portfolioUrl'),
            experienceLevel: authT('auth.register.experienceLevel'),
            experienceLevels: {
                junior: authT('auth.register.experienceLevel.junior'),
                mid: authT('auth.register.experienceLevel.mid'),
                senior: authT('auth.register.experienceLevel.senior'),
            },
            skills: authT('auth.register.skills'),
            skillsAdd: authT('auth.register.skills.add'),
            skillsPlaceholder: authT('auth.register.skills.placeholder'),
            acceptTerms: authT('auth.register.acceptTerms'),
            submit: authT('auth.register.submit'),
            alreadyHaveAccount: authT('auth.register.alreadyHaveAccount'),
            signIn: authT('auth.register.signIn'),
            loading: authT('auth.register.loading'),
            success: authT('auth.register.success'),
            switchToLogin: authT('auth.register.switchToLogin'),
            switchToRegister: authT('auth.register.switchToRegister'),
            errors: {
                emailExists: authT('auth.register.error.emailExists'),
                passwordMismatch: authT('auth.register.error.passwordMismatch'),
                acceptTerms: authT('auth.register.error.acceptTerms'),
            },
        },

        // Email verification translations
        verification: {
            title: authT('auth.verification.title'),
            subtitle: authT('auth.verification.subtitle'),
            message: authT('auth.verification.message'),
            resend: authT('auth.verification.resend'),
            success: authT('auth.verification.success'),
            error: authT('auth.verification.error'),
        },

        // Logout translations
        logout: {
            success: authT('auth.logout.success'),
            error: authT('auth.logout.error'),
        },

        // Guard translations
        guards: {
            loading: authT('auth.guards.loading'),
            redirecting: authT('auth.guards.redirecting'),
            emailVerificationRequired: authT('auth.guards.emailVerificationRequired'),
            accessDenied: authT('auth.guards.accessDenied'),
            noPermission: authT('auth.guards.noPermission'),
        },

        // Error translations
        errors: {
            generic: authT('auth.errors.generic'),
            network: authT('auth.errors.network'),
            serverError: authT('auth.errors.serverError'),
            unauthorized: authT('auth.errors.unauthorized'),
            forbidden: authT('auth.errors.forbidden'),
            notFound: authT('auth.errors.notFound'),
        },

        // Password reset translations
        passwordReset: {
            title: authT('auth.passwordReset.title'),
            subtitle: authT('auth.passwordReset.subtitle'),
            submit: authT('auth.passwordReset.submit'),
            success: authT('auth.passwordReset.success'),
        },

        // 2FA translations
        twoFactor: {
            title: authT('auth.2fa.title'),
            subtitle: authT('auth.2fa.subtitle'),
            code: authT('auth.2fa.code'),
            submit: authT('auth.2fa.submit'),
            error: authT('auth.2fa.error'),
        },

        // Helper function for direct key access
        t: authT,
    };
};
