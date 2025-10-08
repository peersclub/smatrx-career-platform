import * as React from 'react'

/**
 * Email Template Components
 *
 * These React components are rendered to HTML strings for email delivery.
 * We use inline styles for maximum email client compatibility.
 */

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

interface EmailLayoutProps {
  children: React.ReactNode
  previewText?: string
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SMATRX Career Platform</title>
        {previewText && (
          <div style={{ display: 'none', maxHeight: '0px', overflow: 'hidden' }}>
            {previewText}
          </div>
        )}
      </head>
      <body
        style={{
          backgroundColor: '#f6f9fc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          padding: 0
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: '#f6f9fc', padding: '40px 0' }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#8b5cf6',
                      padding: '30px',
                      textAlign: 'center'
                    }}
                  >
                    <h1
                      style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: 0
                      }}
                    >
                      SMATRX Career Platform
                    </h1>
                  </td>
                </tr>

                {/* Content */}
                <tr>
                  <td style={{ padding: '40px 30px' }}>{children}</td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#f6f9fc',
                      padding: '30px',
                      textAlign: 'center',
                      borderTop: '1px solid #e5e7eb'
                    }}
                  >
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '0 0 10px'
                      }}
                    >
                      © 2025 SMATRX Career Platform. All rights reserved.
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                      <a
                        href="https://smatrx.com/unsubscribe"
                        style={{ color: '#9ca3af', textDecoration: 'none' }}
                      >
                        Unsubscribe
                      </a>
                      {' • '}
                      <a
                        href="https://smatrx.com/privacy"
                        style={{ color: '#9ca3af', textDecoration: 'none' }}
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

function Button({
  href,
  children
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      style={{
        backgroundColor: '#8b5cf6',
        borderRadius: '6px',
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '16px',
        fontWeight: '600',
        padding: '12px 24px',
        textDecoration: 'none',
        textAlign: 'center'
      }}
    >
      {children}
    </a>
  )
}

// ============================================================================
// SYNC NOTIFICATION TEMPLATES
// ============================================================================

export interface SyncCompleteEmailProps {
  userName: string
  syncType: 'GitHub' | 'LinkedIn' | 'Certifications' | 'Full Sync'
  itemsSynced: number
  credibilityScoreChange?: number
  newBadges?: string[]
  viewProfileUrl: string
}

export function SyncCompleteEmail({
  userName,
  syncType,
  itemsSynced,
  credibilityScoreChange,
  newBadges,
  viewProfileUrl
}: SyncCompleteEmailProps) {
  return (
    <EmailLayout previewText={`Your ${syncType} data has been synced successfully`}>
      <h2 style={{ color: '#111827', fontSize: '20px', marginTop: 0 }}>
        Hi {userName}! 👋
      </h2>

      <p style={{ color: '#374151', fontSize: '16px', lineHeight: '24px' }}>
        Great news! We've successfully synced your <strong>{syncType}</strong> data.
      </p>

      {/* Stats box */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0'
        }}
      >
        <tr>
          <td>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px' }}>
              Items Synced
            </p>
            <p
              style={{
                color: '#111827',
                fontSize: '28px',
                fontWeight: '700',
                margin: 0
              }}
            >
              {itemsSynced}
            </p>
          </td>

          {credibilityScoreChange !== undefined && credibilityScoreChange !== 0 && (
            <td align="right">
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px' }}>
                Credibility Score
              </p>
              <p
                style={{
                  color: credibilityScoreChange > 0 ? '#10b981' : '#ef4444',
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: 0
                }}
              >
                {credibilityScoreChange > 0 ? '+' : ''}
                {credibilityScoreChange}
              </p>
            </td>
          )}
        </tr>
      </table>

      {/* New badges */}
      {newBadges && newBadges.length > 0 && (
        <>
          <h3 style={{ color: '#111827', fontSize: '18px', marginBottom: '12px' }}>
            🎉 New Badges Earned!
          </h3>
          <ul style={{ color: '#374151', paddingLeft: '20px' }}>
            {newBadges.map((badge, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {badge}
              </li>
            ))}
          </ul>
        </>
      )}

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={viewProfileUrl}>View Your Profile</Button>
      </div>

      <p
        style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '20px',
          marginBottom: 0
        }}
      >
        Your profile is automatically synced daily. You can manually trigger a sync
        anytime from your dashboard.
      </p>
    </EmailLayout>
  )
}

export interface SyncFailedEmailProps {
  userName: string
  syncType: string
  errorMessage: string
  retryUrl: string
  supportUrl: string
}

export function SyncFailedEmail({
  userName,
  syncType,
  errorMessage,
  retryUrl,
  supportUrl
}: SyncFailedEmailProps) {
  return (
    <EmailLayout previewText={`Issue syncing your ${syncType} data`}>
      <h2 style={{ color: '#111827', fontSize: '20px', marginTop: 0 }}>
        Hi {userName},
      </h2>

      <p style={{ color: '#374151', fontSize: '16px', lineHeight: '24px' }}>
        We encountered an issue while syncing your <strong>{syncType}</strong> data.
      </p>

      <div
        style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          padding: '16px',
          margin: '20px 0'
        }}
      >
        <p style={{ color: '#991b1b', fontSize: '14px', margin: 0 }}>
          <strong>Error:</strong> {errorMessage}
        </p>
      </div>

      <p style={{ color: '#374151', fontSize: '16px', lineHeight: '24px' }}>
        Don't worry! This is usually temporary. Here's what you can do:
      </p>

      <ol style={{ color: '#374151', fontSize: '15px', lineHeight: '24px' }}>
        <li>Check your account connections are still active</li>
        <li>Try syncing again manually</li>
        <li>If the issue persists, contact our support team</li>
      </ol>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={retryUrl}>Retry Sync</Button>
      </div>

      <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
        Need help?{' '}
        <a href={supportUrl} style={{ color: '#8b5cf6', textDecoration: 'none' }}>
          Contact Support
        </a>
      </p>
    </EmailLayout>
  )
}

// ============================================================================
// CREDIBILITY SCORE TEMPLATES
// ============================================================================

export interface CredibilityUpdateEmailProps {
  userName: string
  newScore: number
  previousScore: number
  insights: string[]
  nextSteps: Array<{ title: string; impact: number }>
  viewDashboardUrl: string
}

export function CredibilityUpdateEmail({
  userName,
  newScore,
  previousScore,
  insights,
  nextSteps,
  viewDashboardUrl
}: CredibilityUpdateEmailProps) {
  const change = newScore - previousScore
  const changePercent = ((change / previousScore) * 100).toFixed(1)

  return (
    <EmailLayout previewText="Your credibility score has been updated">
      <h2 style={{ color: '#111827', fontSize: '20px', marginTop: 0 }}>
        Hi {userName}! 📊
      </h2>

      <p style={{ color: '#374151', fontSize: '16px', lineHeight: '24px' }}>
        Your credibility score has been recalculated based on your latest profile updates.
      </p>

      {/* Score card */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          backgroundColor: change >= 0 ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${change >= 0 ? '#10b981' : '#ef4444'}`,
          borderRadius: '8px',
          padding: '24px',
          margin: '24px 0',
          textAlign: 'center'
        }}
      >
        <tr>
          <td>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px' }}>
              Your Credibility Score
            </p>
            <p
              style={{
                color: '#111827',
                fontSize: '48px',
                fontWeight: '700',
                margin: '0 0 8px'
              }}
            >
              {newScore}
              <span style={{ fontSize: '24px', color: '#6b7280' }}>/100</span>
            </p>
            <p
              style={{
                color: change >= 0 ? '#10b981' : '#ef4444',
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)} points ({changePercent}%)
            </p>
          </td>
        </tr>
      </table>

      {/* Insights */}
      {insights.length > 0 && (
        <>
          <h3 style={{ color: '#111827', fontSize: '18px', marginBottom: '12px' }}>
            💡 Key Insights
          </h3>
          <ul style={{ color: '#374151', paddingLeft: '20px' }}>
            {insights.map((insight, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {insight}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Next steps */}
      {nextSteps.length > 0 && (
        <>
          <h3 style={{ color: '#111827', fontSize: '18px', marginBottom: '12px', marginTop: '24px' }}>
            🎯 Recommended Next Steps
          </h3>
          {nextSteps.map((step, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f9fafb',
                borderLeft: '3px solid #8b5cf6',
                padding: '12px 16px',
                marginBottom: '8px'
              }}
            >
              <p style={{ color: '#111827', fontSize: '15px', margin: '0 0 4px', fontWeight: '600' }}>
                {step.title}
              </p>
              <p style={{ color: '#10b981', fontSize: '13px', margin: 0 }}>
                +{step.impact} points potential impact
              </p>
            </div>
          ))}
        </>
      )}

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={viewDashboardUrl}>View Full Dashboard</Button>
      </div>
    </EmailLayout>
  )
}

// ============================================================================
// WEEKLY DIGEST TEMPLATE
// ============================================================================

export interface WeeklyDigestEmailProps {
  userName: string
  weekStats: {
    scoreChange: number
    itemsSynced: number
    badgesEarned: number
    skillsAdded: number
  }
  topInsights: string[]
  recommendations: Array<{
    role: string
    company: string
    matchScore: number
  }>
  viewDashboardUrl: string
}

export function WeeklyDigestEmail({
  userName,
  weekStats,
  topInsights,
  recommendations,
  viewDashboardUrl
}: WeeklyDigestEmailProps) {
  return (
    <EmailLayout previewText="Your weekly career progress summary">
      <h2 style={{ color: '#111827', fontSize: '20px', marginTop: 0 }}>
        Hi {userName}! 📅
      </h2>

      <p style={{ color: '#374151', fontSize: '16px', lineHeight: '24px' }}>
        Here's your career progress summary for the past week:
      </p>

      {/* Stats grid */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: '24px 0' }}>
        <tr>
          <td
            width="48%"
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px' }}>
              Score Change
            </p>
            <p
              style={{
                color: weekStats.scoreChange >= 0 ? '#10b981' : '#ef4444',
                fontSize: '24px',
                fontWeight: '700',
                margin: 0
              }}
            >
              {weekStats.scoreChange >= 0 ? '+' : ''}
              {weekStats.scoreChange}
            </p>
          </td>
          <td width="4%"></td>
          <td
            width="48%"
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px' }}>
              Items Synced
            </p>
            <p style={{ color: '#8b5cf6', fontSize: '24px', fontWeight: '700', margin: 0 }}>
              {weekStats.itemsSynced}
            </p>
          </td>
        </tr>
        <tr>
          <td height="12"></td>
        </tr>
        <tr>
          <td
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px' }}>
              Badges Earned
            </p>
            <p style={{ color: '#f59e0b', fontSize: '24px', fontWeight: '700', margin: 0 }}>
              {weekStats.badgesEarned}
            </p>
          </td>
          <td width="4%"></td>
          <td
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px' }}>
              Skills Added
            </p>
            <p style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '700', margin: 0 }}>
              {weekStats.skillsAdded}
            </p>
          </td>
        </tr>
      </table>

      {/* Top insights */}
      {topInsights.length > 0 && (
        <>
          <h3 style={{ color: '#111827', fontSize: '18px', marginBottom: '12px' }}>
            💡 This Week's Insights
          </h3>
          <ul style={{ color: '#374151', paddingLeft: '20px' }}>
            {topInsights.map((insight, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {insight}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <h3 style={{ color: '#111827', fontSize: '18px', marginBottom: '12px', marginTop: '24px' }}>
            🎯 New Opportunities
          </h3>
          {recommendations.slice(0, 3).map((rec, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#faf5ff',
                border: '1px solid #e9d5ff',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}
            >
              <p style={{ color: '#111827', fontSize: '16px', margin: '0 0 4px', fontWeight: '600' }}>
                {rec.role}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px' }}>
                {rec.company}
              </p>
              <p style={{ color: '#8b5cf6', fontSize: '14px', margin: 0, fontWeight: '600' }}>
                {rec.matchScore}% Match
              </p>
            </div>
          ))}
        </>
      )}

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={viewDashboardUrl}>View Full Dashboard</Button>
      </div>
    </EmailLayout>
  )
}
