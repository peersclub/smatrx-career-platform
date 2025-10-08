'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/packages/ui/src/components/card'
import { Badge } from '@/packages/ui/src/components/badge'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  Star,
  Users,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

export interface CareerRecommendation {
  id: string
  role: string
  company?: string
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  matchScore: number // 0-100
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  location: string
  timeToReady: string // e.g., "3-6 months"
  matchReasons: string[]
  requiredSkills: {
    skill: string
    hasSkill: boolean
    proficiency?: number // 0-100 if hasSkill
  }[]
  growthPotential: 'high' | 'medium' | 'low'
  demandTrend: 'increasing' | 'stable' | 'decreasing'
  aiGenerated: boolean
  actionPlan?: {
    step: string
    duration: string
    priority: 'critical' | 'important' | 'optional'
  }[]
}

interface RecommendationCardProps {
  recommendation: CareerRecommendation
  onExplore?: (recommendationId: string) => void
  onSaveToPlanner?: (recommendationId: string) => void
  className?: string
}

const levelConfig = {
  junior: {
    label: 'Junior',
    color: 'bg-blue-100 text-blue-700',
    icon: '👶'
  },
  mid: {
    label: 'Mid-level',
    color: 'bg-green-100 text-green-700',
    icon: '🚀'
  },
  senior: {
    label: 'Senior',
    color: 'bg-purple-100 text-purple-700',
    icon: '⭐'
  },
  lead: {
    label: 'Lead',
    color: 'bg-orange-100 text-orange-700',
    icon: '👑'
  },
  principal: {
    label: 'Principal',
    color: 'bg-red-100 text-red-700',
    icon: '💎'
  }
}

const growthPotentialConfig = {
  high: {
    label: 'High Growth',
    color: 'text-green-600',
    icon: TrendingUp,
    bg: 'bg-green-50'
  },
  medium: {
    label: 'Medium Growth',
    color: 'text-yellow-600',
    icon: TrendingUp,
    bg: 'bg-yellow-50'
  },
  low: {
    label: 'Low Growth',
    color: 'text-gray-600',
    icon: TrendingUp,
    bg: 'bg-gray-50'
  }
}

const demandTrendConfig = {
  increasing: {
    label: 'Demand Increasing',
    color: 'text-green-600',
    icon: '📈'
  },
  stable: {
    label: 'Demand Stable',
    color: 'text-blue-600',
    icon: '➡️'
  },
  decreasing: {
    label: 'Demand Decreasing',
    color: 'text-orange-600',
    icon: '📉'
  }
}

export function RecommendationCard({
  recommendation,
  onExplore,
  onSaveToPlanner,
  className
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const levelConf = levelConfig[recommendation.level]
  const growthConf = growthPotentialConfig[recommendation.growthPotential]
  const demandConf = demandTrendConfig[recommendation.demandTrend]
  const GrowthIcon = growthConf.icon

  const formatSalary = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Moderate Match'
    return 'Weak Match'
  }

  const skillsHave = recommendation.requiredSkills.filter(s => s.hasSkill).length
  const skillsTotal = recommendation.requiredSkills.length
  const skillCoverage = (skillsHave / skillsTotal) * 100

  const handleSave = () => {
    setIsSaved(true)
    onSaveToPlanner?.(recommendation.id)
  }

  return (
    <Card className={`${className} hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{recommendation.role}</CardTitle>
              {recommendation.aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>

            {recommendation.company && (
              <CardDescription className="flex items-center gap-2 mb-2">
                <Briefcase className="w-3 h-3" />
                {recommendation.company}
              </CardDescription>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={levelConf.color}>
                {levelConf.icon} {levelConf.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {recommendation.location}
              </Badge>
            </div>
          </div>

          {/* Match score */}
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${getMatchColor(recommendation.matchScore)}`}
            >
              {recommendation.matchScore}%
            </div>
            <div className="text-xs text-gray-500">{getMatchLabel(recommendation.matchScore)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Salary */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-xs text-gray-600">Salary Range</div>
              <div className="text-sm font-semibold text-gray-900">
                {formatSalary(recommendation.salaryRange.min, recommendation.salaryRange.currency)} -{' '}
                {formatSalary(recommendation.salaryRange.max, recommendation.salaryRange.currency)}
              </div>
            </div>
          </div>

          {/* Time to ready */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs text-gray-600">Time to Ready</div>
              <div className="text-sm font-semibold text-gray-900">
                {recommendation.timeToReady}
              </div>
            </div>
          </div>

          {/* Growth potential */}
          <div className={`flex items-center gap-2 p-3 ${growthConf.bg} rounded-lg`}>
            <GrowthIcon className={`w-5 h-5 ${growthConf.color}`} />
            <div>
              <div className="text-xs text-gray-600">Growth Potential</div>
              <div className={`text-sm font-semibold ${growthConf.color}`}>
                {growthConf.label}
              </div>
            </div>
          </div>

          {/* Demand trend */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">{demandConf.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Market Demand</div>
              <div className={`text-sm font-semibold ${demandConf.color}`}>
                {demandConf.label}
              </div>
            </div>
          </div>
        </div>

        {/* Why this matches */}
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            Why This Matches You
          </h4>
          <ul className="space-y-1">
            {recommendation.matchReasons.slice(0, 3).map((reason, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {reason}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Skill coverage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Skill Coverage
            </h4>
            <span className="text-sm text-gray-600">
              {skillsHave}/{skillsTotal} skills
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <motion.div
              className={`h-full ${
                skillCoverage >= 75
                  ? 'bg-green-500'
                  : skillCoverage >= 50
                  ? 'bg-blue-500'
                  : 'bg-yellow-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${skillCoverage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Expandable skills list */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
          >
            {isExpanded ? 'Hide' : 'Show'} required skills
            <ChevronRight
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {recommendation.requiredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    {skill.hasSkill ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className={skill.hasSkill ? 'text-gray-900' : 'text-gray-600'}>
                      {skill.skill}
                    </span>
                  </div>
                  {skill.hasSkill && skill.proficiency && (
                    <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => onExplore?.(recommendation.id)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            Explore Details
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isSaved
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
