import { Queue, QueueEvents, Job } from 'bullmq'
import {
  QUEUE_NAMES,
  defaultQueueOptions,
  redisConnection,
  type QueueName
} from './config'

/**
 * QueueManager - Singleton class to manage all BullMQ queues
 *
 * Responsibilities:
 * - Initialize and maintain queue instances
 * - Provide type-safe queue access
 * - Monitor queue health
 * - Clean up resources
 *
 * @example
 * ```ts
 * const queueManager = QueueManager.getInstance()
 * const syncQueue = queueManager.getQueue('sync')
 * await syncQueue.add('github:sync', { userId: '123' })
 * ```
 */
export class QueueManager {
  private static instance: QueueManager
  private queues: Map<QueueName, Queue> = new Map()
  private queueEvents: Map<QueueName, QueueEvents> = new Map()
  private isInitialized = false

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance of QueueManager
   */
  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager()
    }
    return QueueManager.instance
  }

  /**
   * Initialize all queues
   * Must be called before using any queues
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('QueueManager already initialized')
      return
    }

    console.log('Initializing QueueManager...')

    // Create all queues
    for (const queueName of Object.values(QUEUE_NAMES)) {
      await this.createQueue(queueName)
    }

    this.isInitialized = true
    console.log('QueueManager initialized successfully')
  }

  /**
   * Create a single queue with event listeners
   */
  private async createQueue(name: QueueName): Promise<Queue> {
    console.log(`Creating queue: ${name}`)

    const queue = new Queue(name, defaultQueueOptions)
    const events = new QueueEvents(name, { connection: redisConnection })

    // Set up event listeners for monitoring
    this.setupEventListeners(name, events)

    this.queues.set(name, queue)
    this.queueEvents.set(name, events)

    return queue
  }

  /**
   * Set up event listeners for queue monitoring and logging
   */
  private setupEventListeners(queueName: QueueName, events: QueueEvents): void {
    // Job completed successfully
    events.on('completed', ({ jobId, returnvalue }) => {
      console.log(`[${queueName}] Job ${jobId} completed`, {
        returnvalue: returnvalue ? JSON.stringify(returnvalue).slice(0, 100) : 'none'
      })
    })

    // Job failed
    events.on('failed', ({ jobId, failedReason }) => {
      console.error(`[${queueName}] Job ${jobId} failed:`, failedReason)
    })

    // Job delayed (waiting for retry)
    events.on('delayed', ({ jobId, delay }) => {
      console.log(`[${queueName}] Job ${jobId} delayed by ${delay}ms`)
    })

    // Job stalled (worker may have crashed)
    events.on('stalled', ({ jobId }) => {
      console.warn(`[${queueName}] Job ${jobId} stalled (worker may have crashed)`)
    })

    // Job progress update
    events.on('progress', ({ jobId, data }) => {
      console.log(`[${queueName}] Job ${jobId} progress:`, data)
    })

    // Error in queue
    events.on('error', (err) => {
      console.error(`[${queueName}] Queue error:`, err)
    })
  }

  /**
   * Get a specific queue by name
   *
   * @throws Error if queue doesn't exist
   */
  getQueue(name: QueueName): Queue {
    if (!this.isInitialized) {
      throw new Error('QueueManager not initialized. Call initialize() first.')
    }

    const queue = this.queues.get(name)
    if (!queue) {
      throw new Error(`Queue "${name}" not found`)
    }

    return queue
  }

  /**
   * Get all queues
   */
  getAllQueues(): Map<QueueName, Queue> {
    if (!this.isInitialized) {
      throw new Error('QueueManager not initialized. Call initialize() first.')
    }

    return this.queues
  }

  /**
   * Check if a specific queue exists
   */
  hasQueue(name: QueueName): boolean {
    return this.queues.has(name)
  }

  /**
   * Get queue metrics for monitoring
   */
  async getQueueMetrics(name: QueueName) {
    const queue = this.getQueue(name)

    const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.isPaused()
    ])

    return {
      name,
      counts: {
        waiting,
        active,
        completed,
        failed,
        delayed
      },
      isPaused: paused
    }
  }

  /**
   * Get metrics for all queues
   */
  async getAllQueueMetrics() {
    const metrics = await Promise.all(
      Array.from(this.queues.keys()).map(name => this.getQueueMetrics(name))
    )

    return metrics
  }

  /**
   * Pause a queue (stop processing jobs)
   */
  async pauseQueue(name: QueueName): Promise<void> {
    const queue = this.getQueue(name)
    await queue.pause()
    console.log(`Queue "${name}" paused`)
  }

  /**
   * Resume a paused queue
   */
  async resumeQueue(name: QueueName): Promise<void> {
    const queue = this.getQueue(name)
    await queue.resume()
    console.log(`Queue "${name}" resumed`)
  }

  /**
   * Clean completed jobs from a queue
   *
   * @param name Queue name
   * @param grace Grace period in milliseconds (keep jobs newer than this)
   * @param limit Maximum number of jobs to clean
   */
  async cleanQueue(
    name: QueueName,
    grace: number = 24 * 60 * 60 * 1000, // 24 hours
    limit: number = 1000
  ): Promise<string[]> {
    const queue = this.getQueue(name)

    const jobs = await queue.clean(grace, limit, 'completed')
    console.log(`Cleaned ${jobs.length} completed jobs from queue "${name}"`)

    return jobs
  }

  /**
   * Drain a queue (remove all waiting jobs)
   */
  async drainQueue(name: QueueName, delayed = false): Promise<void> {
    const queue = this.getQueue(name)
    await queue.drain(delayed)
    console.log(`Queue "${name}" drained`)
  }

  /**
   * Obliterate a queue (delete all jobs and queue data)
   * USE WITH CAUTION - this cannot be undone
   */
  async obliterateQueue(name: QueueName): Promise<void> {
    const queue = this.getQueue(name)
    await queue.obliterate({ force: true })
    console.log(`Queue "${name}" obliterated`)
  }

  /**
   * Get failed jobs for a queue
   */
  async getFailedJobs(name: QueueName, start = 0, end = 100): Promise<Job[]> {
    const queue = this.getQueue(name)
    return await queue.getFailed(start, end)
  }

  /**
   * Retry a failed job
   */
  async retryJob(name: QueueName, jobId: string): Promise<void> {
    const queue = this.getQueue(name)
    const job = await queue.getJob(jobId)

    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${name}`)
    }

    await job.retry()
    console.log(`Job ${jobId} from queue "${name}" queued for retry`)
  }

  /**
   * Retry all failed jobs in a queue
   */
  async retryAllFailed(name: QueueName): Promise<void> {
    const failedJobs = await this.getFailedJobs(name, 0, -1)

    for (const job of failedJobs) {
      await job.retry()
    }

    console.log(`Retried ${failedJobs.length} failed jobs from queue "${name}"`)
  }

  /**
   * Get job by ID
   */
  async getJob(name: QueueName, jobId: string): Promise<Job | undefined> {
    const queue = this.getQueue(name)
    return await queue.getJob(jobId)
  }

  /**
   * Remove a specific job
   */
  async removeJob(name: QueueName, jobId: string): Promise<void> {
    const queue = this.getQueue(name)
    const job = await queue.getJob(jobId)

    if (job) {
      await job.remove()
      console.log(`Job ${jobId} removed from queue "${name}"`)
    }
  }

  /**
   * Check health of all queues
   *
   * Returns an array of health issues found
   */
  async checkHealth(): Promise<{
    healthy: boolean
    issues: string[]
    metrics: any[]
  }> {
    const issues: string[] = []
    const metrics = await this.getAllQueueMetrics()

    for (const metric of metrics) {
      // Check for too many failed jobs
      if (metric.counts.failed > 50) {
        issues.push(`Queue "${metric.name}" has ${metric.counts.failed} failed jobs`)
      }

      // Check for stalled processing
      if (metric.counts.waiting > 1000) {
        issues.push(`Queue "${metric.name}" has ${metric.counts.waiting} waiting jobs (possible bottleneck)`)
      }

      // Check if queue is paused unexpectedly
      if (metric.isPaused) {
        issues.push(`Queue "${metric.name}" is paused`)
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
      metrics
    }
  }

  /**
   * Gracefully close all queues and connections
   */
  async close(): Promise<void> {
    console.log('Closing QueueManager...')

    // Close all queues
    for (const [name, queue] of Array.from(this.queues.entries())) {
      await queue.close()
      console.log(`Queue "${name}" closed`)
    }

    // Close all event listeners
    for (const [name, events] of Array.from(this.queueEvents.entries())) {
      await events.close()
      console.log(`Events for queue "${name}" closed`)
    }

    this.queues.clear()
    this.queueEvents.clear()
    this.isInitialized = false

    console.log('QueueManager closed successfully')
  }
}

/**
 * Helper function to get queue manager instance
 */
export function getQueueManager(): QueueManager {
  return QueueManager.getInstance()
}

/**
 * Helper function to get a specific queue
 */
export function getQueue(name: QueueName): Queue {
  return getQueueManager().getQueue(name)
}
