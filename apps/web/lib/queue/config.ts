import { ConnectionOptions, QueueOptions, WorkerOptions, JobsOptions } from 'bullmq'

/**
 * Redis connection configuration for BullMQ
 *
 * This configuration is shared across all queues and workers.
 * In production, use environment variables for credentials.
 */
export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
    return Math.min(times * 1000, 10000)
  },
  // Enable TLS in production
  tls: process.env.NODE_ENV === 'production'
    ? {
        rejectUnauthorized: process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false'
      }
    : undefined
}

/**
 * Default queue options applied to all queues
 */
export const defaultQueueOptions: QueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs up to 3 times
    backoff: {
      type: 'exponential',
      delay: 2000 // Start with 2s delay, doubles each retry
    },
    removeOnComplete: {
      age: 24 * 60 * 60, // Keep completed jobs for 24 hours
      count: 1000 // Keep max 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60 // Keep failed jobs for 7 days for debugging
    }
  }
}

/**
 * Default worker options applied to all workers
 */
export const defaultWorkerOptions: WorkerOptions = {
  connection: redisConnection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'), // Process 5 jobs simultaneously
  lockDuration: 30000, // Lock jobs for 30 seconds
  maxStalledCount: 2, // Maximum times a job can stall before failing
  stalledInterval: 10000 // Check for stalled jobs every 10 seconds
}

/**
 * Queue names used across the application
 */
export const QUEUE_NAMES = {
  SYNC: 'sync', // Data synchronization jobs
  CREDIBILITY: 'credibility', // Credibility score calculations
  NOTIFICATIONS: 'notifications', // Email/push notifications
  ANALYTICS: 'analytics', // Analytics and reporting
  VERIFICATION: 'verification' // Document verification workflows
} as const

/**
 * Job priorities (lower number = higher priority)
 */
export const JOB_PRIORITIES = {
  CRITICAL: 1, // User-initiated actions
  HIGH: 3, // Important background tasks
  NORMAL: 5, // Regular scheduled jobs
  LOW: 10 // Nice-to-have analytics
} as const

/**
 * Job types for the sync queue
 */
export const SYNC_JOB_TYPES = {
  GITHUB_SYNC: 'github:sync',
  LINKEDIN_SYNC: 'linkedin:sync',
  CERTIFICATION_SYNC: 'certification:sync',
  EDUCATION_VERIFY: 'education:verify',
  FULL_SYNC: 'full:sync' // Sync all data sources
} as const

/**
 * Job types for the credibility queue
 */
export const CREDIBILITY_JOB_TYPES = {
  CALCULATE_SCORE: 'credibility:calculate',
  GENERATE_INSIGHTS: 'credibility:insights',
  UPDATE_BADGES: 'credibility:badges',
  ANALYZE_TRENDS: 'credibility:trends'
} as const

/**
 * Job types for the notifications queue
 */
export const NOTIFICATION_JOB_TYPES = {
  EMAIL: 'notification:email',
  PUSH: 'notification:push',
  IN_APP: 'notification:in-app',
  DIGEST: 'notification:digest' // Daily/weekly digest emails
} as const

/**
 * Job types for the analytics queue
 */
export const ANALYTICS_JOB_TYPES = {
  USER_ACTIVITY: 'analytics:user-activity',
  SKILL_TRENDS: 'analytics:skill-trends',
  MARKET_DATA: 'analytics:market-data',
  REPORT_GENERATION: 'analytics:report'
} as const

/**
 * Job types for the verification queue
 */
export const VERIFICATION_JOB_TYPES = {
  DOCUMENT_REVIEW: 'verification:document-review',
  AUTO_VERIFY: 'verification:auto',
  MANUAL_REVIEW: 'verification:manual',
  BADGE_AWARD: 'verification:badge-award'
} as const

/**
 * Cron patterns for scheduled jobs
 */
export const CRON_PATTERNS = {
  DAILY_SYNC: '0 2 * * *', // 2 AM daily
  HOURLY_CHECK: '0 * * * *', // Every hour
  WEEKLY_DIGEST: '0 9 * * MON', // Monday 9 AM
  MONTHLY_REPORT: '0 9 1 * *', // 1st of month 9 AM
  EVERY_15_MIN: '*/15 * * * *', // Every 15 minutes
  EVERY_5_MIN: '*/5 * * * *' // Every 5 minutes
} as const

/**
 * Job options for different types of jobs
 */
export const jobOptionsPresets: Record<string, JobsOptions> = {
  userInitiated: {
    priority: JOB_PRIORITIES.CRITICAL,
    attempts: 1, // Don't auto-retry user actions
  },

  backgroundSync: {
    priority: JOB_PRIORITIES.NORMAL,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
  },

  credibilityCalculation: {
    priority: JOB_PRIORITIES.HIGH,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000
    }
  },

  notification: {
    priority: JOB_PRIORITIES.NORMAL,
    attempts: 5, // Retry notifications more aggressively
    backoff: {
      type: 'exponential',
      delay: 1000
    },
  },

  analytics: {
    priority: JOB_PRIORITIES.LOW,
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 60000 // 1 minute between retries
    }
  }
}

/**
 * Rate limiting configuration for different queue types
 */
export const rateLimits = {
  github: {
    max: 5000, // GitHub API allows 5000 requests/hour with auth
    duration: 60 * 60 * 1000 // 1 hour
  },

  linkedin: {
    max: 100, // Conservative limit for LinkedIn scraping
    duration: 60 * 60 * 1000 // 1 hour
  },

  email: {
    max: 1000, // Based on email service provider limits
    duration: 60 * 60 * 1000 // 1 hour
  },

  credibility: {
    max: 10000, // Internal computation, no external API limits
    duration: 60 * 60 * 1000
  }
}

/**
 * Get environment-specific configuration
 */
export function getQueueConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isTest = process.env.NODE_ENV === 'test'

  return {
    isDevelopment,
    isTest,
    isProduction: !isDevelopment && !isTest,

    // Use in-memory Redis for tests
    useInMemory: isTest,

    // Enable queue metrics in production
    enableMetrics: !isDevelopment,

    // Enable verbose logging in development
    verboseLogging: isDevelopment,

    // Worker concurrency based on environment
    workerConcurrency: isTest ? 1 : (isDevelopment ? 2 : 10),

    // Job retention
    jobRetention: {
      completed: isDevelopment ? 1 : 24, // hours
      failed: isDevelopment ? 24 : 168 // hours (7 days in prod)
    }
  }
}

/**
 * Health check thresholds
 */
export const HEALTH_CHECK_THRESHOLDS = {
  MAX_STALLED_JOBS: 10,
  MAX_FAILED_JOBS: 50,
  MAX_QUEUE_DELAY: 60000, // 1 minute
  MAX_JOB_AGE: 3600000 // 1 hour
} as const

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES]
export type SyncJobType = typeof SYNC_JOB_TYPES[keyof typeof SYNC_JOB_TYPES]
export type CredibilityJobType = typeof CREDIBILITY_JOB_TYPES[keyof typeof CREDIBILITY_JOB_TYPES]
export type NotificationJobType = typeof NOTIFICATION_JOB_TYPES[keyof typeof NOTIFICATION_JOB_TYPES]
export type AnalyticsJobType = typeof ANALYTICS_JOB_TYPES[keyof typeof ANALYTICS_JOB_TYPES]
export type VerificationJobType = typeof VERIFICATION_JOB_TYPES[keyof typeof VERIFICATION_JOB_TYPES]
