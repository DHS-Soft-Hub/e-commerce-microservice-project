/**
 * Generic storage utilities
 * Provides secure and consistent storage management for non-auth data
 */

/**
 * Generic storage utilities for application data
 */
export class StorageUtils {
  /**
   * Store data with optional expiration
   */
  static setItem(key: string, value: unknown, expirationMs?: number): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiresAt: expirationMs ? Date.now() + expirationMs : null
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to store item with key ${key}:`, error);
    }
  }

  /**
   * Get data and check expiration
   */
  static getItem<T = unknown>(key: string): T | null {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Check if expired
      if (data.expiresAt && Date.now() >= data.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error(`Failed to retrieve item with key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item
   */
  static removeItem(key: string): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item with key ${key}:`, error);
    }
  }

  /**
   * Check if item exists and is not expired
   */
  static hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Clear all items with a specific prefix
   */
  static clearItemsWithPrefix(prefix: string): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error(`Failed to clear items with prefix ${prefix}:`, error);
    }
  }

  /**
   * Get all items with a specific prefix
   */
  static getItemsWithPrefix<T = unknown>(prefix: string): Record<string, T> {
    const result: Record<string, T> = {};

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));

      keys.forEach(key => {
        const value = this.getItem<T>(key);
        if (value !== null) {
          result[key] = value;
        }
      });
    } catch (error) {
      console.error(`Failed to get items with prefix ${prefix}:`, error);
    }

    return result;
  }

  /**
   * Get storage info
   */
  static getStorageInfo(): {
    usedBytes: number;
    totalItems: number;
    availableBytes?: number;
  } {
    let usedBytes = 0;
    let totalItems = 0;

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return { usedBytes: 0, totalItems: 0 };
    }

    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          usedBytes += localStorage[key].length + key.length;
          totalItems++;
        }
      }
    } catch (error) {
      console.error('Failed to calculate storage info:', error);
    }

    // Try to estimate available space (not always accurate)
    let availableBytes: number | undefined;
    if (typeof window !== 'undefined') {
      try {
        const testKey = '__storage_test__';
        const chunk = '0'.repeat(1024); // 1KB chunks
        let size = 0;

        while (size < 10 * 1024 * 1024) { // Max 10MB test
          try {
            localStorage.setItem(testKey, chunk.repeat(size / 1024));
            size += 1024;
          } catch {
            break;
          }
        }

        localStorage.removeItem(testKey);
        availableBytes = size - usedBytes;
      } catch (_error) {
        // Silently fail storage size estimation
      }
    }

    return {
      usedBytes,
      totalItems,
      availableBytes
    };
  }

  /**
   * Clean expired items
   */
  static cleanExpiredItems(): number {
    let cleanedCount = 0;

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return 0;
    }

    try {
      const keys = Object.keys(localStorage);

      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);

            // Check if this item has expiration and is expired
            if (data.expiresAt && Date.now() >= data.expiresAt) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch {
          // Skip items that don't have our expected format
        }
      });
    } catch (error) {
      console.error('Failed to clean expired items:', error);
    }

    return cleanedCount;
  }

  /**
   * Store temporary data with automatic cleanup
   */
  static setTemporaryItem(key: string, value: unknown, expirationMs: number = 60 * 60 * 1000): void {
    this.setItem(key, value, expirationMs);
  }

  /**
   * Store session data (cleared when browser session ends)
   */
  static setSessionItem(key: string, value: unknown): void {
    try {
      sessionStorage.setItem(key, JSON.stringify({
        value,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error(`Failed to store session item with key ${key}:`, error);
    }
  }

  /**
   * Get session data
   */
  static getSessionItem<T = unknown>(key: string): T | null {
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;

      const data = JSON.parse(stored);
      return data.value;
    } catch (error) {
      console.error(`Failed to retrieve session item with key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove session item
   */
  static removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove session item with key ${key}:`, error);
    }
  }
}
