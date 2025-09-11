/**
 * Logger Interface
 * For application logging across different levels
 */
export interface ILogger {
  /**
   * Log debug information
   */
  debug(message: string, meta?: any): void;

  /**
   * Log informational messages
   */
  info(message: string, meta?: any): void;

  /**
   * Log warning messages
   */
  warn(message: string, meta?: any): void;

  /**
   * Log error messages
   */
  error(message: string, error?: Error, meta?: any): void;

  /**
   * Log with custom level
   */
  log(level: string, message: string, meta?: any): void;

  /**
   * Create child logger with additional context
   */
  child(context: Record<string, any>): ILogger;
}
