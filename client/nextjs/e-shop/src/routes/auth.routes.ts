/**
 * Central location for all authentication application paths/routes
 * This helps maintain consistent navigation and prevents typos in path strings
 */
const AUTH_ROUTES = {
    HOME: '/',

    LOGIN: '/auth/login',
    CLIENT_LOGIN: '/auth/login/client',
    DEVELOPER_LOGIN: '/auth/login/developer',

    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',

    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    EMAIL_VERIFICATION: '/auth/verify-email',
    TWO_FACTOR_SETUP: '/auth/two-factor?mode=setup',
    TWO_FACTOR_VERIFY: '/auth/two-factor?mode=verify',
    TWO_FACTOR_AUTH: '/auth/two-factor',

    OAUTH: '/auth/oauth',
    OAUTH_CALLBACK: (provider: string): string => `/auth/oauth/${provider}/callback`,
    OAUTH_SUCCESS: '/auth/oauth/success',
    OAUTH_ERROR: '/auth/oauth/error',
};

export default AUTH_ROUTES;
