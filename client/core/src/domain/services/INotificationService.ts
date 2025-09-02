import { IResult } from '../../shared/types';

/**
 * Notification Service Interface
 * For sending notifications
 */
export interface INotificationService<TNotification> {
  /**
   * Send notification
   */
  send(notification: TNotification): Promise<IResult<void>>;

  /**
   * Send bulk notifications
   */
  sendBulk(notifications: TNotification[]): Promise<IResult<void>>;

  /**
   * Schedule notification
   */
  schedule(notification: TNotification, scheduleTime: Date): Promise<IResult<void>>;
}
