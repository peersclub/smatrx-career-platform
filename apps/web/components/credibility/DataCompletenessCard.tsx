'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/packages/ui/src/components/card'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Circle, ArrowRight } from 'lucide-react'

interface MissingDataItem {
  category: string
  items: string[]
  priority: 'critical' | 'important' | 'optional'
}

interface DataCompletenessCardProps {
  completeness: number // 0-100
  missingData: MissingDataItem[]
  onAction?: (category: string) => void
  className?: string
}

const priorityConfig = {
  critical: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Critical'
  },
  important: {
    icon: Circle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    label: 'Important'
  },
  optional: {
    icon: Circle,
    color: 'text-gray-400',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    label: 'Optional'
  }
}

export function DataCompletenessCard({
  completeness,
  missingData,
  onAction,
  className
}: DataCompletenessCardProps) {
  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getCompletenessMessage = (percentage: number) => {
    if (percentage === 100) return 'Your profile is complete! 🎉'
    if (percentage >= 80) return 'Almost there! Just a few more items.'
    if (percentage >= 60) return 'Good progress! Keep going.'
    if (percentage >= 40) return 'You\'re on your way. Add more data to increase credibility.'
    return 'Let\'s get started! Complete your profile to unlock full credibility.'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profile Completeness</CardTitle>
        <CardDescription>
          {getCompletenessMessage(completeness)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Completion</span>
            <span className="text-2xl font-bold text-purple-600">
              {completeness}%
            </span>
          </div>

          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getCompletenessColor(completeness)}`}
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            {/* Milestones */}
            <div className="absolute inset-0 flex justify-between px-1">
              {[25, 50, 75].map((milestone) => (
                <div
                  key={milestone}
                  className="w-0.5 h-full bg-white opacity-50"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Missing data sections */}
        {missingData.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Items to Complete</h4>

            {missingData.map((section, index) => {
              const config = priorityConfig[section.priority]
              const Icon = config.icon

              return (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${config.border} ${config.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{section.category}</h5>
                        <span className={`text-xs ${config.color}`}>
                          {config.label}
                        </span>
                      </div>

                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item} className="text-sm text-gray-700 flex items-center gap-2">
                            <Circle className="w-2 h-2" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {onAction && (
                        <button
                          onClick={() => onAction(section.category)}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Complete now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Complete message */}
        {completeness === 100 && (
          <motion.div
            className="flex items-center justify-center gap-2 p-6 bg-green-50 rounded-lg border-2 border-green-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-green-700">
              Profile 100% Complete!
            </span>
          </motion.div>
        )}

        {/* Quick actions */}
        {missingData.length > 0 && (
          <motion.div
            className="mt-6 pt-6 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={() => onAction?.('all')}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              Complete Profile
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
