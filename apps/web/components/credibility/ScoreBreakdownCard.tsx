'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Code, Users, Award, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ScoreComponent {
  score: number
  weight: number
  factors?: Record<string, number>
}

interface ScoreBreakdownCardProps {
  breakdown: {
    education: ScoreComponent
    experience: ScoreComponent
    technical: ScoreComponent
    social: ScoreComponent
    certifications: ScoreComponent
  }
  className?: string
}

const componentConfig = {
  education: {
    label: 'Education',
    icon: GraduationCap,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  experience: {
    label: 'Experience',
    icon: Briefcase,
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  technical: {
    label: 'Technical',
    icon: Code,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  social: {
    label: 'Social',
    icon: Users,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-100',
    textColor: 'text-pink-700'
  },
  certifications: {
    label: 'Certifications',
    icon: Award,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  }
} as const

export function ScoreBreakdownCard({ breakdown, className }: ScoreBreakdownCardProps) {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)

  const components = [
    { key: 'education', ...breakdown.education },
    { key: 'experience', ...breakdown.experience },
    { key: 'technical', ...breakdown.technical },
    { key: 'social', ...breakdown.social },
    { key: 'certifications', ...breakdown.certifications }
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
        <CardDescription>
          How your credibility score is calculated across 5 key areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {components.map((component, index) => {
            const config = componentConfig[component.key as keyof typeof componentConfig]
            const Icon = config.icon
            const isExpanded = expandedComponent === component.key
            const weightedScore = Math.round(component.score * component.weight)

            return (
              <motion.div
                key={component.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                {/* Component header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${config.lightColor}`}>
                      <Icon className={`w-4 h-4 ${config.textColor}`} />
                    </div>
                    <div>
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-gray-500">
                        Weight: {Math.round(component.weight * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {component.score}/100
                    </span>
                    {component.factors && (
                      <button
                        onClick={() =>
                          setExpandedComponent(isExpanded ? null : component.key)
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={config.color}
                    initial={{ width: 0 }}
                    animate={{ width: `${component.score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                    style={{ height: '100%' }}
                  />
                </div>

                {/* Contribution to overall score */}
                <div className="text-xs text-gray-500">
                  Contributes: {weightedScore} points to overall score
                </div>

                {/* Expanded factors */}
                {isExpanded && component.factors && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-12 pr-4 space-y-2 mt-3"
                  >
                    {Object.entries(component.factors).map(([factor, value]) => (
                      <div key={factor} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">
                          {factor.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">{Math.round(value)}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <motion.div
          className="mt-6 pt-6 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">Overall Score</span>
            <span className="text-2xl font-bold text-purple-600">
              {Math.round(
                components.reduce((sum, c) => sum + c.score * c.weight, 0)
              )}
              /100
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
