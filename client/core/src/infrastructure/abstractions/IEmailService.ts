import { IResult } from '../../shared/types/IResult';

/**
 * Email Service Interface
 * For sending emails through various providers
 */
export interface IEmailService {
  /**
   * Send a simple email
   */
  sendEmail(to: string, subject: string, body: string): Promise<IResult<void>>;

  /**
   * Send email with HTML content
   */
  sendHtmlEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<IResult<void>>;

  /**
   * Send email to multiple recipients
   */
  sendBulkEmail(recipients: string[], subject: string, body: string): Promise<IResult<void>>;

  /**
   * Send email with attachments
   */
  sendEmailWithAttachments(
    to: string,
    subject: string,
    body: string,
    attachments: Array<{ filename: string; content: Uint8Array | string; contentType: string }>
  ): Promise<IResult<void>>;

  /**
   * Send email using template
   */
  sendTemplateEmail(
    to: string,
    templateId: string,
    templateData: Record<string, any>
  ): Promise<IResult<void>>;
}
