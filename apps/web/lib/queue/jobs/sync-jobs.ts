import { Job } from 'bullmq'
import { getQueue } from '../queue-manager'
import { QUEUE_NAMES, SYNC_JOB_TYPES, jobOptionsPresets } from '../config'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface GitHubSyncJobData {
  userId: string
  username: string
  forceRefresh?: boolean
  syncRepositories?: boolean
  syncContributions?: boolean
  syncPullRequests?: boolean
}

export interface LinkedInSyncJobData {
  userId: string
  profileUrl: string
  syncExperience?: boolean
  syncEducation?: boolean
  syncSkills?: boolean
  syncRecommendations?: boolean
}

export interface CertificationSyncJobData {
  userId: string
  provider?: 'coursera' | 'udemy' | 'pluralsight' | 'aws' | 'google' | 'microsoft'
  certificateIds?: string[]
}

export interface EducationVerifyJobData {
  userId: string
  educationId: string
  documentUrls: string[]
  institutionEmail?: string
}

export interface FullSyncJobData {
  userId: string
  priority?: 'high' | 'normal' | 'low'
}

export interface SyncJobResult {
  success: boolean
  itemsSynced: number
  errors?: string[]
  updatedAt: Date
  nextSyncAt?: Date
}

// ============================================================================
// JOB SCHEDULERS
// ============================================================================

/**
 * Schedule a GitHub sync job for a user
 *
 * @example
 * ```ts
 * await scheduleGitHubSync({
 *   userId: 'user123',
 *   username: 'johndoe',
 *   forceRefresh: true
 * })
 * ```
 */
export async function scheduleGitHubSync(
  data: GitHubSyncJobData
): Promise<Job<GitHubSyncJobData>> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  return await queue.add(
    SYNC_JOB_TYPES.GITHUB_SYNC,
    data,
    {
      ...jobOptionsPresets.backgroundSync,
      jobId: `github:${data.userId}:${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false
    }
  )
}

/**
 * Schedule a LinkedIn sync job for a user
 *
 * @example
 * ```ts
 * await scheduleLinkedInSync({
 *   userId: 'user123',
 *   profileUrl: 'https://linkedin.com/in/johndoe',
 *   syncExperience: true,
 *   syncEducation: true
 * })
 * ```
 */
export async function scheduleLinkedInSync(
  data: LinkedInSyncJobData
): Promise<Job<LinkedInSyncJobData>> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  return await queue.add(
    SYNC_JOB_TYPES.LINKEDIN_SYNC,
    data,
    {
      ...jobOptionsPresets.backgroundSync,
      jobId: `linkedin:${data.userId}:${Date.now()}`
    }
  )
}

/**
 * Schedule a certification sync job
 *
 * @example
 * ```ts
 * await scheduleCertificationSync({
 *   userId: 'user123',
 *   provider: 'coursera'
 * })
 * ```
 */
export async function scheduleCertificationSync(
  data: CertificationSyncJobData
): Promise<Job<CertificationSyncJobData>> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  return await queue.add(
    SYNC_JOB_TYPES.CERTIFICATION_SYNC,
    data,
    {
      ...jobOptionsPresets.backgroundSync,
      jobId: `cert:${data.userId}:${data.provider || 'all'}:${Date.now()}`
    }
  )
}

/**
 * Schedule an education verification job
 *
 * @example
 * ```ts
 * await scheduleEducationVerify({
 *   userId: 'user123',
 *   educationId: 'edu456',
 *   documentUrls: ['https://s3.../degree.pdf']
 * })
 * ```
 */
export async function scheduleEducationVerify(
  data: EducationVerifyJobData
): Promise<Job<EducationVerifyJobData>> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  return await queue.add(
    SYNC_JOB_TYPES.EDUCATION_VERIFY,
    data,
    {
      ...jobOptionsPresets.userInitiated, // High priority for user-initiated verification
      jobId: `edu-verify:${data.userId}:${data.educationId}:${Date.now()}`
    }
  )
}

/**
 * Schedule a full sync job (all data sources)
 *
 * This creates individual jobs for each data source with proper sequencing.
 *
 * @example
 * ```ts
 * await scheduleFullSync({
 *   userId: 'user123',
 *   priority: 'normal'
 * })
 * ```
 */
export async function scheduleFullSync(
  data: FullSyncJobData
): Promise<Job<FullSyncJobData>> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  return await queue.add(
    SYNC_JOB_TYPES.FULL_SYNC,
    data,
    {
      ...jobOptionsPresets.backgroundSync,
      jobId: `full-sync:${data.userId}:${Date.now()}`
    }
  )
}

// ============================================================================
// RECURRING SYNC JOBS
// ============================================================================

/**
 * Schedule daily sync for a user
 *
 * Sets up a repeatable job that runs daily at 2 AM
 *
 * @example
 * ```ts
 * await scheduleDailySync('user123', {
 *   username: 'johndoe',
 *   profileUrl: 'https://linkedin.com/in/johndoe'
 * })
 * ```
 */
export async function scheduleDailySync(
  userId: string,
  config: {
    githubUsername?: string
    linkedinProfileUrl?: string
    syncCertifications?: boolean
  }
): Promise<void> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  // Schedule daily GitHub sync
  if (config.githubUsername) {
    await queue.add(
      SYNC_JOB_TYPES.GITHUB_SYNC,
      {
        userId,
        username: config.githubUsername,
        forceRefresh: false,
        syncRepositories: true,
        syncContributions: true,
        syncPullRequests: true
      },
      {
        ...jobOptionsPresets.backgroundSync,
        repeat: {
          pattern: '0 2 * * *', // 2 AM daily
          tz: 'UTC'
        },
        jobId: `daily-github:${userId}` // Prevents duplicates
      }
    )
  }

  // Schedule daily LinkedIn sync
  if (config.linkedinProfileUrl) {
    await queue.add(
      SYNC_JOB_TYPES.LINKEDIN_SYNC,
      {
        userId,
        profileUrl: config.linkedinProfileUrl,
        syncExperience: true,
        syncEducation: true,
        syncSkills: true,
        syncRecommendations: true
      },
      {
        ...jobOptionsPresets.backgroundSync,
        repeat: {
          pattern: '0 3 * * *', // 3 AM daily (1 hour after GitHub)
          tz: 'UTC'
        },
        jobId: `daily-linkedin:${userId}`
      }
    )
  }

  // Schedule daily certification sync
  if (config.syncCertifications) {
    await queue.add(
      SYNC_JOB_TYPES.CERTIFICATION_SYNC,
      {
        userId
      },
      {
        ...jobOptionsPresets.backgroundSync,
        repeat: {
          pattern: '0 4 * * *', // 4 AM daily
          tz: 'UTC'
        },
        jobId: `daily-cert:${userId}`
      }
    )
  }
}

/**
 * Cancel daily sync for a user
 *
 * @example
 * ```ts
 * await cancelDailySync('user123')
 * ```
 */
export async function cancelDailySync(userId: string): Promise<void> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  // Remove repeatable jobs by their IDs
  const repeatableJobs = await queue.getRepeatableJobs()

  for (const job of repeatableJobs) {
    if (
      job.id === `daily-github:${userId}` ||
      job.id === `daily-linkedin:${userId}` ||
      job.id === `daily-cert:${userId}`
    ) {
      await queue.removeRepeatableByKey(job.key)
    }
  }
}

/**
 * Schedule hourly sync for premium users
 *
 * More frequent syncs for users who pay for real-time updates
 */
export async function scheduleHourlySync(
  userId: string,
  config: {
    githubUsername?: string
    linkedinProfileUrl?: string
  }
): Promise<void> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  if (config.githubUsername) {
    await queue.add(
      SYNC_JOB_TYPES.GITHUB_SYNC,
      {
        userId,
        username: config.githubUsername,
        forceRefresh: false
      },
      {
        ...jobOptionsPresets.backgroundSync,
        repeat: {
          pattern: '0 * * * *', // Every hour
          tz: 'UTC'
        },
        jobId: `hourly-github:${userId}`
      }
    )
  }
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Schedule sync for multiple users (batch operation)
 *
 * Useful for admin-initiated bulk syncs
 *
 * @example
 * ```ts
 * await scheduleBulkSync([
 *   { userId: 'user1', username: 'john' },
 *   { userId: 'user2', username: 'jane' }
 * ])
 * ```
 */
export async function scheduleBulkGitHubSync(
  users: Array<{ userId: string; username: string }>
): Promise<Job<GitHubSyncJobData>[]> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  return await queue.addBulk(
    users.map((user) => ({
      name: SYNC_JOB_TYPES.GITHUB_SYNC,
      data: {
        userId: user.userId,
        username: user.username,
        forceRefresh: false
      },
      opts: {
        ...jobOptionsPresets.backgroundSync,
        jobId: `bulk-github:${user.userId}:${Date.now()}`
      }
    }))
  )
}

/**
 * Get sync status for a user
 *
 * Returns the status of all sync jobs for a user
 */
export async function getUserSyncStatus(userId: string): Promise<{
  github?: { status: string; lastSync?: Date }
  linkedin?: { status: string; lastSync?: Date }
  certifications?: { status: string; lastSync?: Date }
}> {
  const queue = getQueue(QUEUE_NAMES.SYNC)

  const jobs = await queue.getJobs(['completed', 'failed', 'active', 'waiting'])

  const userJobs = jobs.filter((job) => job.data.userId === userId)

  const status: any = {}

  for (const job of userJobs) {
    const source = job.name.split(':')[0] // 'github', 'linkedin', etc.

    if (job.finishedOn) {
      status[source] = {
        status: job.returnvalue?.success ? 'synced' : 'failed',
        lastSync: new Date(job.finishedOn)
      }
    } else {
      status[source] = {
        status: await job.getState(),
        lastSync: undefined
      }
    }
  }

  return status
}
