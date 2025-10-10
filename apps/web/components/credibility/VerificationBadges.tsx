'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  Zap,
  GraduationCap,
  CheckCircle,
  Globe,
  Gem,
  Calendar,
  Lock
} from 'lucide-react'

export interface VerificationBadge {
  id: string
  name: string
  description: string
  icon: 'lightning' | 'graduation' | 'checkmark' | 'globe' | 'diamond' | 'calendar'
  earned: boolean
  progress?: number // 0-100 if not earned
  criteria: string
}

interface VerificationBadgesProps {
  badges?: VerificationBadge[]
  className?: string
}

const badgeIcons = {
  lightning: Zap,
  graduation: GraduationCap,
  checkmark: CheckCircle,
  globe: Globe,
  diamond: Gem,
  calendar: Calendar
}

const badgeColors = {
  lightning: {
    bg: 'bg-white',
    light: 'bg-gray-800/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/50'
  },
  graduation: {
    bg: 'bg-white',
    light: 'bg-gray-800/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/50'
  },
  checkmark: {
    bg: 'bg-white',
    light: 'bg-gray-800/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/50'
  },
  globe: {
    bg: 'bg-white',
    light: 'bg-gray-800/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/50'
  },
  diamond: {
    bg: 'bg-white',
    light: 'bg-gray-800/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/50'
  },
  calendar: {
    bg: 'bg-white',
    light: 'bg-gray-800/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/50'
  }
}

export function VerificationBadges({ badges = [], className }: VerificationBadgesProps) {
  const earnedCount = badges.filter(b => b.earned).length

  // Show empty state if no badges
  if (badges.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Verification Badges</CardTitle>
          <CardDescription>
            Complete actions to earn verification badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="w-12 h-12 mx-auto mb-3 text-gray-600 opacity-50" />
            <p className="text-sm text-gray-400 mb-2">No badges yet</p>
            <p className="text-xs text-gray-500">
              Connect your accounts and complete your profile to unlock badges
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verification Badges</CardTitle>
            <CardDescription>
              {earnedCount} of {badges.length} badges earned
            </CardDescription>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {earnedCount}/{badges.length}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge, index) => {
            const Icon = badgeIcons[badge.icon]
            const colors = badgeColors[badge.icon]

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  badge.earned
                    ? `border-transparent ${colors.light} shadow-lg ${colors.glow}`
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                {/* Badge icon */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 p-3 rounded-full ${
                      badge.earned ? colors.bg : 'bg-gray-300'
                    } ${badge.earned ? 'shadow-lg' : ''}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        badge.earned ? 'text-white' : 'text-gray-500'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Badge name */}
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-semibold ${
                          badge.earned ? colors.text : 'text-gray-600'
                        }`}
                      >
                        {badge.name}
                      </h4>
                      {badge.earned && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 200,
                            delay: index * 0.1 + 0.3
                          }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      {!badge.earned && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    {/* Badge description */}
                    <p className="text-sm text-gray-600 mt-1">
                      {badge.description}
                    </p>

                    {/* Criteria */}
                    <p className="text-xs text-gray-500 mt-2">
                      {badge.criteria}
                    </p>

                    {/* Progress bar for unearnedå badges */}
                    {!badge.earned && badge.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{badge.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={colors.bg}
                            initial={{ width: 0 }}
                            animate={{ width: `${badge.progress}%` }}
                            transition={{
                              duration: 1,
                              delay: index * 0.1 + 0.5,
                              ease: 'easeOut'
                            }}
                            style={{ height: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Earned indicator */}
                    {badge.earned && (
                      <motion.div
                        className="mt-2 text-xs font-medium text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        ✓ Earned
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to action for unearned badges */}
        {earnedCount < badges.length && (
          <motion.div
            className="mt-6 p-4 bg-purple-50 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-sm text-purple-800">
              <strong>Tip:</strong> Complete your profile to earn more badges and
              increase your credibility score!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
