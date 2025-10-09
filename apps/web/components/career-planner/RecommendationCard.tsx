'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  Star,
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
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  },
  mid: {
    label: 'Mid-level',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  },
  senior: {
    label: 'Senior',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  },
  lead: {
    label: 'Lead',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  },
  principal: {
    label: 'Principal',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  }
}

const growthPotentialConfig = {
  high: {
    label: 'High Growth',
    color: 'text-white',
    icon: TrendingUp,
    bg: 'bg-gray-800/50'
  },
  medium: {
    label: 'Medium Growth',
    color: 'text-white',
    icon: TrendingUp,
    bg: 'bg-gray-800/50'
  },
  low: {
    label: 'Low Growth',
    color: 'text-gray-400',
    icon: TrendingUp,
    bg: 'bg-gray-800/50'
  }
}

const demandTrendConfig = {
  increasing: {
    label: 'Increasing',
    color: 'text-white'
  },
  stable: {
    label: 'Stable',
    color: 'text-gray-300'
  },
  decreasing: {
    label: 'Decreasing',
    color: 'text-gray-400'
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
    if (score >= 80) return 'text-white'
    if (score >= 60) return 'text-white'
    if (score >= 40) return 'text-gray-300'
    return 'text-gray-400'
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
                <Badge variant="secondary" className="text-xs bg-gray-800/50 text-gray-300">
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
                {levelConf.label}
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
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
            <div className="text-xs text-gray-400">{getMatchLabel(recommendation.matchScore)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Salary */}
          <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Salary Range</div>
              <div className="text-sm font-semibold text-white">
                {formatSalary(recommendation.salaryRange.min, recommendation.salaryRange.currency)} -{' '}
                {formatSalary(recommendation.salaryRange.max, recommendation.salaryRange.currency)}
              </div>
            </div>
          </div>

          {/* Time to ready */}
          <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Time to Ready</div>
              <div className="text-sm font-semibold text-white">
                {recommendation.timeToReady}
              </div>
            </div>
          </div>

          {/* Growth potential */}
          <div className={`flex items-center gap-2 p-3 ${growthConf.bg} border border-gray-700 rounded-lg`}>
            <GrowthIcon className={`w-5 h-5 text-gray-400`} />
            <div>
              <div className="text-xs text-gray-400">Growth Potential</div>
              <div className={`text-sm font-semibold ${growthConf.color}`}>
                {growthConf.label}
              </div>
            </div>
          </div>

          {/* Demand trend */}
          <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Market Demand</div>
              <div className={`text-sm font-semibold ${demandConf.color}`}>
                {demandConf.label}
              </div>
            </div>
          </div>
        </div>

        {/* Why this matches */}
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-white">
            <Target className="w-4 h-4 text-gray-400" />
            Why This Matches You
          </h4>
          <ul className="space-y-1">
            {recommendation.matchReasons.slice(0, 3).map((reason, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-sm text-gray-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                {reason}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Skill coverage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-white">
              <Star className="w-4 h-4 text-gray-400" />
              Skill Coverage
            </h4>
            <span className="text-sm text-gray-400">
              {skillsHave}/{skillsTotal} skills
            </span>
          </div>

          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${skillCoverage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Expandable skills list */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
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
                  className="flex items-center justify-between text-sm p-2 bg-gray-800/50 rounded"
                >
                  <div className="flex items-center gap-2">
                    {skill.hasSkill ? (
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={skill.hasSkill ? 'text-white' : 'text-gray-400'}>
                      {skill.skill}
                    </span>
                  </div>
                  {skill.hasSkill && skill.proficiency && (
                    <span className="text-xs text-gray-400">{skill.proficiency}%</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={() => onExplore?.(recommendation.id)}
            className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            Explore Details
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isSaved
                ? 'bg-gray-800 text-white cursor-not-allowed border border-gray-700'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-700'
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
