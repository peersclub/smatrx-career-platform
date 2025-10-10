'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Target,
  Book,
  Code,
  Zap,
  ArrowRight,
  Star,
  Clock
} from 'lucide-react'
import { useState } from 'react'

export interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft' | 'domain' | 'tool' | 'language'
  importance: 'critical' | 'important' | 'nice-to-have'
  currentProficiency?: number // 0-100, undefined if don't have
  targetProficiency: number // 0-100
  timeToAcquire?: string // e.g., "2-3 months" if don't have
  timeToImprove?: string // if have but need improvement
  learningResources?: number // Number of available resources
}

export interface SkillGap {
  have: Skill[]
  needImprovement: Skill[]
  missing: Skill[]
}

interface SkillGapAnalysisProps {
  skillGap: SkillGap
  targetRole: string
  onStartLearning?: (skillId: string) => void
  className?: string
}

const categoryConfig = {
  technical: {
    label: 'Technical',
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    icon: Code
  },
  soft: {
    label: 'Soft Skills',
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    icon: Star
  },
  domain: {
    label: 'Domain Knowledge',
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    icon: Book
  },
  tool: {
    label: 'Tools',
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    icon: Zap
  },
  language: {
    label: 'Languages',
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    icon: Code
  }
}

const importanceConfig = {
  critical: {
    label: 'Critical',
    color: 'text-white',
    bg: 'bg-gray-800/50',
    border: 'border-gray-700',
    dotColor: 'bg-white'
  },
  important: {
    label: 'Important',
    color: 'text-gray-300',
    bg: 'bg-gray-800/50',
    border: 'border-gray-700',
    dotColor: 'bg-gray-400'
  },
  'nice-to-have': {
    label: 'Nice to Have',
    color: 'text-gray-400',
    bg: 'bg-gray-800/50',
    border: 'border-gray-700',
    dotColor: 'bg-gray-500'
  }
}

export function SkillGapAnalysis({
  skillGap,
  targetRole,
  onStartLearning,
  className
}: SkillGapAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'missing' | 'improve'>('overview')

  const totalSkills = skillGap.have.length + skillGap.needImprovement.length + skillGap.missing.length
  const completionPercentage = ((skillGap.have.length / totalSkills) * 100).toFixed(0)

  const criticalMissing = skillGap.missing.filter(s => s.importance === 'critical').length
  const importantMissing = skillGap.missing.filter(s => s.importance === 'important').length

  const renderSkillItem = (skill: Skill, status: 'have' | 'improve' | 'missing') => {
    const categoryConf = categoryConfig[skill.category]
    const importanceConf = importanceConfig[skill.importance]
    const CategoryIcon = categoryConf.icon

    const gap = skill.currentProficiency
      ? skill.targetProficiency - skill.currentProficiency
      : skill.targetProficiency

    return (
      <motion.div
        key={skill.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-lg border ${importanceConf.border} ${importanceConf.bg}`}
      >
        <div className="flex items-start gap-3">
          {/* Status icon */}
          <div className="mt-1">
            {status === 'have' && <CheckCircle2 className="w-5 h-5 text-gray-400" />}
            {status === 'improve' && <TrendingUp className="w-5 h-5 text-gray-400" />}
            {status === 'missing' && <AlertCircle className="w-5 h-5 text-gray-400" />}
          </div>

          <div className="flex-1 min-w-0">
            {/* Skill name and category */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h5 className="font-semibold text-sm text-white">{skill.name}</h5>
              <Badge className={categoryConf.color}>
                <CategoryIcon className="w-3 h-3 mr-1" />
                {categoryConf.label}
              </Badge>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${importanceConf.dotColor}`} />
                <span className={`text-xs ${importanceConf.color}`}>
                  {importanceConf.label}
                </span>
              </div>
            </div>

            {/* Progress bar (for have and improve) */}
            {skill.currentProficiency !== undefined && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Current: {skill.currentProficiency}%</span>
                  <span>Target: {skill.targetProficiency}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.currentProficiency}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                {status === 'improve' && (
                  <div className="text-xs text-gray-400 mt-1">
                    Gap: {gap}% • Est. {skill.timeToImprove}
                  </div>
                )}
              </div>
            )}

            {/* Missing skill info */}
            {status === 'missing' && (
              <div className="mb-2">
                <div className="text-xs text-gray-400 mb-1">
                  Target proficiency: {skill.targetProficiency}%
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full w-0 bg-gray-600" />
                </div>
                {skill.timeToAcquire && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    Est. {skill.timeToAcquire} to acquire
                  </div>
                )}
              </div>
            )}

            {/* Learning resources */}
            {skill.learningResources && skill.learningResources > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {skill.learningResources} learning resource{skill.learningResources > 1 ? 's' : ''}{' '}
                  available
                </span>
                {onStartLearning && (
                  <button
                    onClick={() => onStartLearning(skill.id)}
                    className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    Start Learning
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Skill Gap Analysis
        </CardTitle>
        <CardDescription>
          Skills needed for <span className="font-semibold text-white">{targetRole}</span>
        </CardDescription>

        {/* Overall progress */}
        <div className="mt-4 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Overall Readiness</span>
            <span className="text-2xl font-bold text-white">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>
              {skillGap.have.length}/{totalSkills} skills mastered
            </span>
            <span>
              {skillGap.missing.length + skillGap.needImprovement.length} to go
            </span>
          </div>
        </div>

        {/* Warning for critical skills */}
        {criticalMissing > 0 && (
          <motion.div
            className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {criticalMissing} critical skill{criticalMissing > 1 ? 's' : ''} missing
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Focus on acquiring these skills first to be eligible for the target role.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-2 mt-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'missing'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Missing ({skillGap.missing.length})
          </button>
          <button
            onClick={() => setActiveTab('improve')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'improve'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Improve ({skillGap.needImprovement.length})
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
                <div className="text-3xl font-bold text-white">{skillGap.have.length}</div>
                <div className="text-xs text-gray-400 mt-1">Skills Mastered</div>
              </div>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
                <div className="text-3xl font-bold text-white">
                  {skillGap.needImprovement.length}
                </div>
                <div className="text-xs text-gray-400 mt-1">Need Improvement</div>
              </div>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
                <div className="text-3xl font-bold text-white">
                  {skillGap.missing.length}
                </div>
                <div className="text-xs text-gray-400 mt-1">To Acquire</div>
              </div>
            </div>

            {/* Priority breakdown */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-white">Priority Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-800/50 border border-gray-700 rounded">
                  <span className="text-sm text-white">Critical Skills Missing</span>
                  <span className="font-bold text-white">{criticalMissing}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/50 border border-gray-700 rounded">
                  <span className="text-sm text-gray-300">Important Skills Missing</span>
                  <span className="font-bold text-gray-300">{importantMissing}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/50 border border-gray-700 rounded">
                  <span className="text-sm text-gray-400">Nice-to-Have Missing</span>
                  <span className="font-bold text-gray-400">
                    {skillGap.missing.length - criticalMissing - importantMissing}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
              <h4 className="font-semibold text-sm text-white mb-2">
                Recommended Next Steps
              </h4>
              <ul className="space-y-2">
                {criticalMissing > 0 && (
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    Start with {criticalMissing} critical skill{criticalMissing > 1 ? 's' : ''}
                  </li>
                )}
                {skillGap.needImprovement.length > 0 && (
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    Improve {skillGap.needImprovement.length} existing skill
                    {skillGap.needImprovement.length > 1 ? 's' : ''}
                  </li>
                )}
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                  Build portfolio projects demonstrating proficiency
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Missing Skills Tab */}
        {activeTab === 'missing' && (
          <div className="space-y-3">
            {skillGap.missing.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">Great! You have all required skills.</p>
                <p className="text-xs mt-1">Focus on improving proficiency levels.</p>
              </div>
            ) : (
              <>
                {/* Sort by importance: critical first */}
                {['critical', 'important', 'nice-to-have'].map(importance => {
                  const skills = skillGap.missing.filter(s => s.importance === importance)
                  if (skills.length === 0) return null

                  return (
                    <div key={importance}>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                        {importanceConfig[importance as keyof typeof importanceConfig].label} (
                        {skills.length})
                      </h4>
                      <div className="space-y-2">
                        {skills.map(skill => renderSkillItem(skill, 'missing'))}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* Improve Skills Tab */}
        {activeTab === 'improve' && (
          <div className="space-y-3">
            {skillGap.needImprovement.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">All skills at target proficiency!</p>
                <p className="text-xs mt-1">
                  Keep practicing to maintain and exceed current levels.
                </p>
              </div>
            ) : (
              skillGap.needImprovement.map(skill => renderSkillItem(skill, 'improve'))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
