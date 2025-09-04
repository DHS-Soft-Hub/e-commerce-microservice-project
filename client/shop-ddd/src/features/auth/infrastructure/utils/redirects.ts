/**
 * Redirect utilities
 * URL management and redirect handling for authentication flows
 */

/**
 * Redirect utilities
 */
export class RedirectUtils {
  private static readonly REDIRECT_KEY = 'auth_redirect_url';

  /**
   * Store redirect URL
   */
  static storeRedirectUrl(url: string): void {
    try {
      sessionStorage.setItem(this.REDIRECT_KEY, url);
    } catch (error) {
      console.error('Failed to store redirect URL:', error);
    }
  }

  /**
   * Get and clear redirect URL
   */
  static getAndClearRedirectUrl(): string | null {
    try {
      const url = sessionStorage.getItem(this.REDIRECT_KEY);
      if (url) {
        sessionStorage.removeItem(this.REDIRECT_KEY);
      }
      return url;
    } catch (error) {
      console.error('Failed to get redirect URL:', error);
      return null;
    }
  }

  /**
   * Get redirect URL without clearing
   */
  static getRedirectUrl(): string | null {
    try {
      return sessionStorage.getItem(this.REDIRECT_KEY);
    } catch (error) {
      console.error('Failed to get redirect URL:', error);
      return null;
    }
  }

  /**
   * Clear redirect URL
   */
  static clearRedirectUrl(): void {
    try {
      sessionStorage.removeItem(this.REDIRECT_KEY);
    } catch (error) {
      console.error('Failed to clear redirect URL:', error);
    }
  }

  /**
   * Build redirect URL with return parameter
   */
  static buildRedirectUrl(baseUrl: string, returnUrl?: string): string {
    if (!returnUrl) return baseUrl;

    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('return', returnUrl);
    return url.toString();
  }

  /**
   * Extract return URL from current location
   */
  static extractReturnUrl(): string | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('return');
    } catch (error) {
      console.error('Failed to extract return URL:', error);
      return null;
    }
  }

  /**
   * Build login redirect URL
   */
  static buildLoginRedirectUrl(loginPath: string = '/auth/login'): string {
    const currentPath = window.location.pathname + window.location.search;
    return this.buildRedirectUrl(loginPath, currentPath);
  }

  /**
   * Build logout redirect URL
   */
  static buildLogoutRedirectUrl(logoutPath: string = '/'): string {
    return logoutPath;
  }

  /**
   * Validate redirect URL for security
   */
  static isValidRedirectUrl(url: string): boolean {
    try {
      const redirectUrl = new URL(url, window.location.origin);
      
      // Only allow same origin redirects for security
      if (redirectUrl.origin !== window.location.origin) {
        return false;
      }

      // Block javascript: and data: URLs
      if (redirectUrl.protocol === 'javascript:' || redirectUrl.protocol === 'data:') {
        return false;
      }

      return true;
    } catch {
      // Invalid URL
      return false;
    }
  }

  /**
   * Sanitize redirect URL
   */
  static sanitizeRedirectUrl(url: string): string | null {
    if (!this.isValidRedirectUrl(url)) {
      return null;
    }

    try {
      const redirectUrl = new URL(url, window.location.origin);
      return redirectUrl.pathname + redirectUrl.search + redirectUrl.hash;
    } catch {
      return null;
    }
  }

  /**
   * Handle post-login redirect
   */
  static handlePostLoginRedirect(defaultRedirect: string = '/dashboard'): void {
    const redirectUrl = this.getAndClearRedirectUrl();
    
    if (redirectUrl && this.isValidRedirectUrl(redirectUrl)) {
      window.location.href = redirectUrl;
    } else {
      window.location.href = defaultRedirect;
    }
  }

  /**
   * Handle post-logout redirect
   */
  static handlePostLogoutRedirect(defaultRedirect: string = '/'): void {
    this.clearRedirectUrl();
    window.location.href = defaultRedirect;
  }

  /**
   * Check if current URL requires authentication
   */
  static requiresAuth(pathname: string = window.location.pathname): boolean {
    const publicPaths = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email',
      '/',
      '/about',
      '/contact',
      '/privacy',
      '/terms'
    ];

    return !publicPaths.some(path => pathname.startsWith(path));
  }

  /**
   * Redirect to login with current URL stored
   */
  static redirectToLogin(loginPath: string = '/auth/login'): void {
    if (this.requiresAuth()) {
      this.storeRedirectUrl(window.location.href);
    }
    
    window.location.href = loginPath;
  }

  /**
   * Redirect to unauthorized page
   */
  static redirectToUnauthorized(unauthorizedPath: string = '/unauthorized'): void {
    window.location.href = unauthorizedPath;
  }

  /**
   * Get query parameter from current URL
   */
  static getQueryParam(param: string): string | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    } catch (error) {
      console.error('Failed to get query parameter:', error);
      return null;
    }
  }

  /**
   * Update query parameter in current URL
   */
  static updateQueryParam(param: string, value: string): void {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(param, value);
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Failed to update query parameter:', error);
    }
  }

  /**
   * Remove query parameter from current URL
   */
  static removeQueryParam(param: string): void {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(param);
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Failed to remove query parameter:', error);
    }
  }
}
