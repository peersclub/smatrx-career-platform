import { renderToStaticMarkup } from 'react-dom/server'
import * as React from 'react'
import nodemailer from 'nodemailer'
import {
  SyncCompleteEmail,
  SyncFailedEmail,
  CredibilityUpdateEmail,
  WeeklyDigestEmail,
  type SyncCompleteEmailProps,
  type SyncFailedEmailProps,
  type CredibilityUpdateEmailProps,
  type WeeklyDigestEmailProps
} from './email-templates'

/**
 * Email Service Configuration
 */
interface EmailConfig {
  from: string
  replyTo?: string
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
}

/**
 * Email sending result
 */
export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Email Service - Handles all email operations
 *
 * Supports:
 * - Transactional emails (sync notifications, alerts)
 * - Digest emails (weekly summaries)
 * - HTML templates with React components
 * - SMTP and email service provider integration
 */
export class EmailService {
  private static instance: EmailService
  private transporter: nodemailer.Transporter
  private config: EmailConfig

  private constructor() {
    this.config = this.loadConfig()
    this.transporter = this.createTransporter()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Load email configuration from environment variables
   */
  private loadConfig(): EmailConfig {
    return {
      from: process.env.EMAIL_FROM || 'SMATRX <noreply@smatrx.com>',
      replyTo: process.env.EMAIL_REPLY_TO || 'support@smatrx.com',
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      }
    }
  }

  /**
   * Create nodemailer transporter
   */
  private createTransporter(): nodemailer.Transporter {
    // In development, use console log transport
    if (process.env.NODE_ENV === 'development') {
      console.log('Using console email transport (development mode)')
      return nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      })
    }

    // In production, use real SMTP
    return nodemailer.createTransport(this.config.smtp)
  }

  /**
   * Render a React component to HTML string
   */
  private renderTemplate(component: React.ReactElement): string {
    return renderToStaticMarkup(component)
  }

  /**
   * Send an email
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<SendEmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: this.config.from,
        to,
        subject,
        html,
        replyTo: this.config.replyTo
      })

      // In development, log email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('='.repeat(80))
        console.log('📧 EMAIL SENT (DEV MODE)')
        console.log('='.repeat(80))
        console.log('To:', to)
        console.log('Subject:', subject)
        console.log('Preview:', html.slice(0, 200) + '...')
        console.log('='.repeat(80))
      }

      return {
        success: true,
        messageId: info.messageId
      }
    } catch (error: any) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // ==========================================================================
  // EMAIL TEMPLATES
  // ==========================================================================

  /**
   * Send sync complete notification
   */
  async sendSyncComplete(
    to: string,
    props: SyncCompleteEmailProps
  ): Promise<SendEmailResult> {
    const html = this.renderTemplate(
      React.createElement(SyncCompleteEmail, props)
    )

    return await this.sendEmail(
      to,
      `Your ${props.syncType} data has been synced`,
      html
    )
  }

  /**
   * Send sync failed notification
   */
  async sendSyncFailed(
    to: string,
    props: SyncFailedEmailProps
  ): Promise<SendEmailResult> {
    const html = this.renderTemplate(
      React.createElement(SyncFailedEmail, props)
    )

    return await this.sendEmail(
      to,
      `Issue syncing your ${props.syncType} data`,
      html
    )
  }

  /**
   * Send credibility score update
   */
  async sendCredibilityUpdate(
    to: string,
    props: CredibilityUpdateEmailProps
  ): Promise<SendEmailResult> {
    const html = this.renderTemplate(
      React.createElement(CredibilityUpdateEmail, props)
    )

    const change = props.newScore - props.previousScore
    const emoji = change >= 0 ? '📈' : '📉'

    return await this.sendEmail(
      to,
      `${emoji} Your credibility score is now ${props.newScore}`,
      html
    )
  }

  /**
   * Send weekly digest
   */
  async sendWeeklyDigest(
    to: string,
    props: WeeklyDigestEmailProps
  ): Promise<SendEmailResult> {
    const html = this.renderTemplate(
      React.createElement(WeeklyDigestEmail, props)
    )

    return await this.sendEmail(
      to,
      '📅 Your weekly career progress summary',
      html
    )
  }

  /**
   * Send custom email with HTML content
   */
  async sendCustom(
    to: string,
    subject: string,
    html: string
  ): Promise<SendEmailResult> {
    return await this.sendEmail(to, subject, html)
  }

  /**
   * Verify SMTP connection
   */
  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('✓ Email service connection verified')
      return true
    } catch (error) {
      console.error('✗ Email service connection failed:', error)
      return false
    }
  }

  /**
   * Close transporter
   */
  async close(): Promise<void> {
    this.transporter.close()
  }
}

/**
 * Helper function to get email service instance
 */
export function getEmailService(): EmailService {
  return EmailService.getInstance()
}
