/**
 * Configuration Interface
 * For accessing application configuration values
 */
export interface IConfiguration {
  /**
   * Get configuration value with generic type
   */
  get<T>(key: string, defaultValue?: T): T;

  /**
   * Get string configuration value
   */
  getString(key: string, defaultValue?: string): string;

  /**
   * Get number configuration value
   */
  getNumber(key: string, defaultValue?: number): number;

  /**
   * Get boolean configuration value
   */
  getBoolean(key: string, defaultValue?: boolean): boolean;

  /**
   * Get array configuration value
   */
  getArray<T>(key: string, defaultValue?: T[]): T[];

  /**
   * Get object configuration value
   */
  getObject<T>(key: string, defaultValue?: T): T;

  /**
   * Check if configuration key exists
   */
  has(key: string): boolean;

  /**
   * Get all configuration keys
   */
  getKeys(): string[];

  /**
   * Get configuration for a specific section
   */
  getSection(section: string): Record<string, any>;

  /**
   * Set configuration value (for testing or dynamic config)
   */
  set(key: string, value: any): void;
}
