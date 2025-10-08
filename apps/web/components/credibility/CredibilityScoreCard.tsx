'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Award, Shield, Star, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface CredibilityScoreCardProps {
  overallScore: number
  verificationLevel: 'basic' | 'verified' | 'premium' | 'elite'
  previousScore?: number
  lastUpdated: Date
  className?: string
}

const verificationLevelConfig = {
  basic: {
    label: 'Basic',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    icon: Shield,
    badgeVariant: 'secondary' as const
  },
  verified: {
    label: 'Verified',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    icon: Award,
    badgeVariant: 'default' as const
  },
  premium: {
    label: 'Premium',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    icon: Star,
    badgeVariant: 'default' as const
  },
  elite: {
    label: 'Elite',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    icon: Crown,
    badgeVariant: 'default' as const
  }
}

export function CredibilityScoreCard({
  overallScore,
  verificationLevel,
  previousScore,
  lastUpdated,
  className
}: CredibilityScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const levelConfig = verificationLevelConfig[verificationLevel]
  const LevelIcon = levelConfig.icon

  // Animate score counter
  useEffect(() => {
    const duration = 1500 // 1.5 seconds
    const steps = 60
    const increment = overallScore / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setDisplayScore(Math.min(Math.round(currentStep * increment), overallScore))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [overallScore])

  // Calculate score change
  const scoreChange = previousScore ? overallScore - previousScore : 0
  const hasIncreased = scoreChange > 0
  const hasDecreased = scoreChange < 0
  const TrendIcon = hasIncreased ? TrendingUp : hasDecreased ? TrendingDown : Minus

  // Format last updated time
  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'just now'
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Calculate circle progress
  const circumference = 2 * Math.PI * 70 // radius = 70
  const progress = (displayScore / 100) * circumference
  const dashOffset = circumference - progress

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981' // green
    if (score >= 60) return '#8b5cf6' // purple
    if (score >= 40) return '#3b82f6' // blue
    return '#6b7280' // gray
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Credibility Score</CardTitle>
          <Badge variant={levelConfig.badgeVariant} className="flex items-center gap-1">
            <LevelIcon className="w-3 h-3" />
            {levelConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Circular Progress */}
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="96"
                cy="96"
                r="70"
                stroke={getScoreColor(displayScore)}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference
                }}
              />
            </svg>

            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-5xl font-bold"
                style={{ color: getScoreColor(displayScore) }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {displayScore}
              </motion.div>
              <div className="text-gray-500 text-sm">/100</div>
            </div>
          </div>

          {/* Score trend */}
          {previousScore && (
            <motion.div
              className={`flex items-center gap-1 text-sm ${
                hasIncreased
                  ? 'text-green-600'
                  : hasDecreased
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <TrendIcon className="w-4 h-4" />
              <span>
                {scoreChange > 0 ? '+' : ''}
                {scoreChange} from last update
              </span>
            </motion.div>
          )}

          {/* Last updated */}
          <motion.div
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Last updated: {formatLastUpdated(lastUpdated)}
          </motion.div>

          {/* View details button */}
          <motion.button
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Detailed Breakdown
          </motion.button>
        </div>
      </CardContent>
    </Card>
  )
}
