'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { Button } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  GraduationCap,
  Award,
  Building2,
  User,
  Calendar,
  ExternalLink,
  Download,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react'
import { useState } from 'react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VerificationSubmission {
  id: string
  type: 'education' | 'certification' | 'employment' | 'skill'
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_info'
  priority: 'high' | 'normal' | 'low'
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string

  // User info
  userId: string
  userName: string
  userEmail: string

  // Submission details
  title: string // e.g., "Bachelor of Science in Computer Science"
  institution?: string // e.g., "Stanford University"
  issuer?: string // For certifications
  startDate?: Date
  endDate?: Date
  documents: VerificationDocument[]

  // Review data
  notes?: string
  adminNotes?: string
  rejectionReason?: string
  flagged?: boolean
  credibilityImpact?: number // How many points this adds to credibility score
}

export interface VerificationDocument {
  id: string
  type: 'transcript' | 'certificate' | 'diploma' | 'letter' | 'other'
  fileName: string
  fileSize: number
  fileUrl: string
  uploadedAt: Date
  verified?: boolean
  ocrExtracted?: {
    text: string
    confidence: number
  }
}

interface AdminVerificationDashboardProps {
  submissions: VerificationSubmission[]
  stats?: {
    pending: number
    underReview: number
    approved: number
    rejected: number
    avgReviewTime: number // in hours
  }
  onReview?: (submissionId: string) => void
  onApprove?: (submissionId: string, notes?: string) => void
  onReject?: (submissionId: string, reason: string) => void
  onRequestInfo?: (submissionId: string, message: string) => void
  onBulkApprove?: (submissionIds: string[]) => void
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusColor = (status: VerificationSubmission['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'under_review':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'needs_info':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'pending':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getStatusIcon = (status: VerificationSubmission['status']) => {
  switch (status) {
    case 'approved':
      return CheckCircle2
    case 'rejected':
      return XCircle
    case 'under_review':
      return Clock
    case 'needs_info':
      return AlertCircle
    case 'pending':
      return Clock
    default:
      return Clock
  }
}

const getTypeIcon = (type: VerificationSubmission['type']) => {
  switch (type) {
    case 'education':
      return GraduationCap
    case 'certification':
      return Award
    case 'employment':
      return Building2
    case 'skill':
      return FileText
    default:
      return FileText
  }
}

const getPriorityColor = (priority: VerificationSubmission['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-600'
    case 'normal':
      return 'text-gray-600'
    case 'low':
      return 'text-gray-400'
    default:
      return 'text-gray-600'
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return 'just now'
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AdminVerificationDashboard({
  submissions,
  stats,
  onReview,
  onApprove,
  onReject,
  onRequestInfo,
  onBulkApprove,
  className
}: AdminVerificationDashboardProps) {
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set())
  const [filterStatus, setFilterStatus] = useState<VerificationSubmission['status'] | 'all'>('all')
  const [filterType, setFilterType] = useState<VerificationSubmission['type'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false
    if (filterType !== 'all' && sub.type !== filterType) return false
    if (searchQuery && !sub.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !sub.userName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort by priority and date
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    // Priority first
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    // Then by date (oldest first for pending)
    return a.submittedAt.getTime() - b.submittedAt.getTime()
  })

  const handleSelectSubmission = (id: string) => {
    const newSelected = new Set(selectedSubmissions)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSubmissions(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedSubmissions.size === sortedSubmissions.length) {
      setSelectedSubmissions(new Set())
    } else {
      setSelectedSubmissions(new Set(sortedSubmissions.map(s => s.id)))
    }
  }

  const handleBulkApprove = () => {
    if (selectedSubmissions.size > 0) {
      onBulkApprove?.(Array.from(selectedSubmissions))
      setSelectedSubmissions(new Set())
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
            Verification Dashboard
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve user credential submissions
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
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
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
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
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Review Time</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.avgReviewTime}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="needs_info">Needs Info</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="education">Education</option>
              <option value="certification">Certification</option>
              <option value="employment">Employment</option>
              <option value="skill">Skill</option>
            </select>

            {/* Bulk actions */}
            {selectedSubmissions.size > 0 && (
              <Button
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Selected ({selectedSubmissions.size})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Submissions ({sortedSubmissions.length})
            </CardTitle>
            {sortedSubmissions.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {selectedSubmissions.size === sortedSubmissions.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSubmissions.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                No submissions found matching your filters
              </p>
            ) : (
              sortedSubmissions.map((submission, index) => {
                const StatusIcon = getStatusIcon(submission.status)
                const TypeIcon = getTypeIcon(submission.type)
                const isSelected = selectedSubmissions.has(submission.id)

                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
                    } hover:shadow-md`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectSubmission(submission.id)}
                        className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />

                      {/* Type Icon */}
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <TypeIcon className="w-6 h-6 text-purple-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {submission.title}
                              </h3>
                              {submission.flagged && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>

                            {submission.institution && (
                              <p className="text-sm text-gray-600">
                                {submission.institution}
                              </p>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                {submission.userName}
                              </div>
                              {submission.endDate && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  {submission.endDate.getFullYear()}
                                </div>
                              )}
                              <span className={`text-xs font-medium ${getPriorityColor(submission.priority)}`}>
                                {submission.priority.toUpperCase()} PRIORITY
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <Badge className={`${getStatusColor(submission.status)} border flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {submission.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Documents */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Documents ({submission.documents.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {submission.documents.map(doc => (
                              <a
                                key={doc.id}
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                              >
                                <FileText className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-700">{doc.fileName}</span>
                                <span className="text-gray-500">({formatFileSize(doc.fileSize)})</span>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <span>Submitted {formatTimeAgo(submission.submittedAt)}</span>
                          {submission.reviewedAt && (
                            <span>Reviewed {formatTimeAgo(submission.reviewedAt)}</span>
                          )}
                          {submission.credibilityImpact && (
                            <span className="text-green-600 font-medium">
                              +{submission.credibilityImpact} credibility points
                            </span>
                          )}
                        </div>

                        {/* Notes */}
                        {submission.notes && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-medium text-blue-900 mb-1">User Notes:</p>
                            <p className="text-sm text-blue-800">{submission.notes}</p>
                          </div>
                        )}

                        {submission.rejectionReason && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-800">{submission.rejectionReason}</p>
                          </div>
                        )}

                        {/* Actions */}
                        {submission.status === 'pending' || submission.status === 'needs_info' ? (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => onReview?.(submission.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              Review
                            </Button>
                            <Button
                              onClick={() => onApprove?.(submission.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => onReject?.(submission.id, 'Invalid documents')}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => onRequestInfo?.(submission.id, 'Please provide additional documentation')}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Request Info
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {submission.reviewedBy && (
                              <span>Reviewed by {submission.reviewedBy}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
