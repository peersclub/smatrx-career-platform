'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react'
import { useState } from 'react'

interface InsightItem {
  id: string
  type: 'strength' | 'improvement' | 'opportunity' | 'warning'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  actionText?: string
  category: string
}

interface NextStep {
  id: string
  title: string
  description: string
  estimatedImpact: number // +X points to credibility score
  timeEstimate: string
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
}

interface CredibilityInsightsCardProps {
  insights: InsightItem[]
  nextSteps: NextStep[]
  aiGenerated?: boolean
  lastAnalyzed?: Date
  onActionClick?: (insightId: string) => void
  className?: string
}

const insightTypeConfig = {
  strength: {
    icon: CheckCircle2,
    color: 'text-gray-400',
    bg: 'bg-gray-800/30',
    border: 'border-gray-700',
    badge: 'bg-gray-800 text-gray-300',
    label: 'Strength'
  },
  improvement: {
    icon: TrendingUp,
    color: 'text-gray-400',
    bg: 'bg-gray-800/30',
    border: 'border-gray-700',
    badge: 'bg-gray-800 text-gray-300',
    label: 'Improvement Area'
  },
  opportunity: {
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-gray-800/30',
    border: 'border-gray-700',
    badge: 'bg-gray-800 text-gray-300',
    label: 'Opportunity'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-gray-400',
    bg: 'bg-gray-800/30',
    border: 'border-gray-700',
    badge: 'bg-gray-800 text-gray-300',
    label: 'Warning'
  }
}

const impactConfig = {
  high: {
    label: 'High Impact',
    color: 'text-white',
    bg: 'bg-gray-800'
  },
  medium: {
    label: 'Medium Impact',
    color: 'text-gray-300',
    bg: 'bg-gray-800'
  },
  low: {
    label: 'Low Impact',
    color: 'text-gray-400',
    bg: 'bg-gray-800'
  }
}

const priorityConfig = {
  high: {
    label: 'High Priority',
    color: 'text-white',
    dotColor: 'bg-white'
  },
  medium: {
    label: 'Medium Priority',
    color: 'text-gray-300',
    dotColor: 'bg-gray-400'
  },
  low: {
    label: 'Low Priority',
    color: 'text-gray-400',
    dotColor: 'bg-gray-500'
  }
}

export function CredibilityInsightsCard({
  insights,
  nextSteps,
  aiGenerated = false,
  lastAnalyzed,
  onActionClick,
  className
}: CredibilityInsightsCardProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'insights' | 'nextSteps'>('insights')

  // Group insights by type
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) acc[insight.type] = []
    acc[insight.type].push(insight)
    return acc
  }, {} as Record<string, InsightItem[]>)

  // Sort next steps by priority
  const sortedNextSteps = [...nextSteps].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const formatLastAnalyzed = (date?: Date) => {
    if (!date) return 'Never'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <CardTitle>AI-Powered Insights</CardTitle>
              {aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </div>
            <CardDescription>
              Personalized recommendations to improve your credibility score
            </CardDescription>
          </div>
          <div className="text-xs text-gray-500">
            Last analyzed: {formatLastAnalyzed(lastAnalyzed)}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-4 border-b">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'insights'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab('nextSteps')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'nextSteps'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Next Steps ({nextSteps.filter(s => !s.completed).length})
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {Object.entries(groupedInsights).map(([type, items], groupIndex) => {
              const config = insightTypeConfig[type as keyof typeof insightTypeConfig]
              const Icon = config.icon

              return (
                <div key={type} className="space-y-2">
                  {/* Type header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <h4 className={`font-semibold text-sm ${config.color}`}>
                      {config.label} ({items.length})
                    </h4>
                  </div>

                  {/* Insights in this group */}
                  {items.map((insight, index) => {
                    const isExpanded = expandedInsight === insight.id
                    const impactConf = impactConfig[insight.impact]

                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: groupIndex * 0.1 + index * 0.05
                        }}
                        className={`p-4 rounded-lg border ${config.border} ${config.bg}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            {/* Title and category */}
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{insight.title}</h5>
                              <Badge variant="outline" className="text-xs">
                                {insight.category}
                              </Badge>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-700 mb-2">
                              {insight.description}
                            </p>

                            {/* Impact badge */}
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded ${impactConf.bg} ${impactConf.color}`}
                              >
                                {impactConf.label}
                              </span>

                              {/* Action button */}
                              {insight.actionable && insight.actionText && (
                                <button
                                  onClick={() => onActionClick?.(insight.id)}
                                  className={`text-xs font-medium ${config.color} hover:underline flex items-center gap-1`}
                                >
                                  {insight.actionText}
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )
            })}

            {insights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No insights available yet.</p>
                <p className="text-xs mt-1">
                  Complete your profile to receive personalized recommendations.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Steps Tab */}
        {activeTab === 'nextSteps' && (
          <div className="space-y-3">
            {sortedNextSteps.map((step, index) => {
              const priorityConf = priorityConfig[step.priority]

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    step.completed
                      ? 'border-gray-600 bg-gray-800/30 opacity-60'
                      : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox/check icon */}
                    <div className="mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title and priority */}
                      <div className="flex items-center gap-2 mb-1">
                        <h5
                          className={`font-semibold text-sm ${
                            step.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {step.title}
                        </h5>
                        {!step.completed && (
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${priorityConf.dotColor}`} />
                            <span className={`text-xs ${priorityConf.color}`}>
                              {priorityConf.label}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-white" />
                          <span>+{step.estimatedImpact} points</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>{step.timeEstimate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {nextSteps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No next steps available.</p>
                <p className="text-xs mt-1">
                  Your profile is complete or analysis is in progress.
                </p>
              </div>
            )}

            {/* Summary footer */}
            {nextSteps.filter(s => !s.completed).length > 0 && (
              <motion.div
                className="mt-6 p-4 bg-purple-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Potential Score Increase
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      Complete all steps to gain up to{' '}
                      {nextSteps
                        .filter(s => !s.completed)
                        .reduce((sum, s) => sum + s.estimatedImpact, 0)}{' '}
                      points
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    +
                    {nextSteps
                      .filter(s => !s.completed)
                      .reduce((sum, s) => sum + s.estimatedImpact, 0)}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
