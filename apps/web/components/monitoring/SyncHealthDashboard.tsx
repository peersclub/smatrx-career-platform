'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Pause,
  Play,
  Trash2,
  TrendingUp,
  Server,
  Database
} from 'lucide-react'
import { useState } from 'react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface QueueMetrics {
  name: string
  counts: {
    waiting: number
    active: number
    completed: number
    failed: number
    delayed: number
  }
  isPaused: boolean
}

export interface SyncJobStatus {
  id: string
  type: 'github' | 'linkedin' | 'certifications' | 'full'
  userId: string
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed'
  progress?: number
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
  error?: string
  data?: any
}

export interface HealthCheck {
  healthy: boolean
  issues: string[]
  metrics: QueueMetrics[]
  timestamp: Date
}

interface SyncHealthDashboardProps {
  healthCheck?: HealthCheck
  recentJobs?: SyncJobStatus[]
  onRefresh?: () => void
  onRetryJob?: (jobId: string) => void
  onPauseQueue?: (queueName: string) => void
  onResumeQueue?: (queueName: string) => void
  onCleanQueue?: (queueName: string) => void
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusColor = (status: SyncJobStatus['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50'
    case 'active':
      return 'text-blue-600 bg-blue-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'delayed':
      return 'text-yellow-600 bg-yellow-50'
    case 'waiting':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const getStatusIcon = (status: SyncJobStatus['status']) => {
  switch (status) {
    case 'completed':
      return CheckCircle2
    case 'active':
      return RefreshCw
    case 'failed':
      return XCircle
    case 'delayed':
      return Clock
    case 'waiting':
      return Clock
    default:
      return Activity
  }
}

const formatDuration = (start?: Date, end?: Date) => {
  if (!start) return '-'
  const endTime = end || new Date()
  const diff = endTime.getTime() - start.getTime()

  if (diff < 1000) return `${diff}ms`
  if (diff < 60000) return `${(diff / 1000).toFixed(1)}s`
  return `${(diff / 60000).toFixed(1)}m`
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SyncHealthDashboard({
  healthCheck,
  recentJobs = [],
  onRefresh,
  onRetryJob,
  onPauseQueue,
  onResumeQueue,
  onCleanQueue,
  className
}: SyncHealthDashboardProps) {
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null)

  const totalJobs = healthCheck?.metrics.reduce(
    (sum, q) => sum + q.counts.waiting + q.counts.active + q.counts.delayed,
    0
  ) || 0

  const totalFailed = healthCheck?.metrics.reduce(
    (sum, q) => sum + q.counts.failed,
    0
  ) || 0

  const totalCompleted = healthCheck?.metrics.reduce(
    (sum, q) => sum + q.counts.completed,
    0
  ) || 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-600" />
            Sync Health Monitor
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time monitoring of background job queues
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overall Health Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border-2 ${
          healthCheck?.healthy
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {healthCheck?.healthy ? (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-600" />
          )}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                healthCheck?.healthy ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {healthCheck?.healthy ? 'All Systems Operational' : 'Issues Detected'}
            </h3>
            {healthCheck?.issues && healthCheck.issues.length > 0 && (
              <ul className="mt-2 space-y-1">
                {healthCheck.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-red-800">
                    • {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {healthCheck?.timestamp && (
            <div className="text-xs text-gray-500">
              Last checked: {healthCheck.timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>
      </motion.div>

      {/* Queue Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{totalFailed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Queues</p>
                <p className="text-2xl font-bold text-purple-600">
                  {healthCheck?.metrics.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Details */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
          <CardDescription>
            Detailed breakdown of each background job queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthCheck?.metrics.map((queue, index) => (
              <motion.div
                key={queue.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {queue.name} Queue
                    </h4>
                    {queue.isPaused && (
                      <Badge className="bg-orange-100 text-orange-700">
                        Paused
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {queue.isPaused ? (
                      <button
                        onClick={() => onResumeQueue?.(queue.name)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Resume queue"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onPauseQueue?.(queue.name)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="Pause queue"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onCleanQueue?.(queue.name)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Clean completed jobs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Waiting</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {queue.counts.waiting}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Active</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {queue.counts.active}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Completed</p>
                    <p className="text-lg font-semibold text-green-600">
                      {queue.counts.completed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Failed</p>
                    <p className="text-lg font-semibold text-red-600">
                      {queue.counts.failed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Delayed</p>
                    <p className="text-lg font-semibold text-yellow-600">
                      {queue.counts.delayed}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Latest sync operations across all queues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentJobs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No recent jobs</p>
            ) : (
              recentJobs.map((job, index) => {
                const StatusIcon = getStatusIcon(job.status)
                const statusColor = getStatusColor(job.status)

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-2 rounded ${statusColor}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {job.type} Sync
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {job.userId.slice(0, 8)}...
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>
                          Created: {job.createdAt.toLocaleTimeString()}
                        </span>
                        {job.startedAt && (
                          <span>
                            Duration: {formatDuration(job.startedAt, job.finishedAt)}
                          </span>
                        )}
                      </div>

                      {job.progress !== undefined && job.progress < 100 && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${job.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {job.progress}% complete
                          </p>
                        </div>
                      )}

                      {job.error && (
                        <p className="text-xs text-red-600 mt-2">
                          Error: {job.error}
                        </p>
                      )}
                    </div>

                    {job.status === 'failed' && onRetryJob && (
                      <button
                        onClick={() => onRetryJob(job.id)}
                        className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
