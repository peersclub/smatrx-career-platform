'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Video,
  FileText,
  Code,
  Award,
  Clock,
  Star,
  CheckCircle2,
  Circle,
  Play,
  ExternalLink,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { useState } from 'react'

export interface LearningResource {
  id: string
  title: string
  type: 'course' | 'tutorial' | 'article' | 'video' | 'book' | 'certification' | 'project'
  provider: string
  url?: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating?: number // 0-5
  reviewCount?: number
  price?: {
    amount: number
    currency: string
  }
  isFree: boolean
  skills: string[]
  completed?: boolean
  progress?: number // 0-100
}

export interface LearningPath {
  id: string
  name: string
  description: string
  targetSkill: string
  estimatedDuration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: LearningResource[]
  prerequisites?: string[]
  outcomes: string[]
  popularity: number // Number of users following this path
  aiGenerated?: boolean
}

interface LearningPathCardProps {
  path: LearningPath
  onStartPath?: (pathId: string) => void
  onResourceClick?: (resourceId: string) => void
  className?: string
}

const resourceTypeConfig = {
  course: {
    icon: BookOpen,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Course'
  },
  tutorial: {
    icon: Code,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Tutorial'
  },
  article: {
    icon: FileText,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Article'
  },
  video: {
    icon: Video,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Video'
  },
  book: {
    icon: BookOpen,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Book'
  },
  certification: {
    icon: Award,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Certification'
  },
  project: {
    icon: Code,
    color: 'bg-gray-800 text-gray-300 border border-gray-700',
    label: 'Project'
  }
}

const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-gray-800 text-gray-300 border border-gray-700'
  }
}

export function LearningPathCard({
  path,
  onStartPath,
  onResourceClick,
  className
}: LearningPathCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedResources = path.resources.filter(r => r.completed).length
  const totalResources = path.resources.length
  const completionPercentage = (completedResources / totalResources) * 100

  const difficultyConf = difficultyConfig[path.difficulty]

  const formatPrice = (price?: { amount: number; currency: string }) => {
    if (!price) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.amount)
  }

  const renderResource = (resource: LearningResource, index: number) => {
    const typeConf = resourceTypeConfig[resource.type]
    const TypeIcon = typeConf.icon
    const diffConf = difficultyConfig[resource.difficulty]

    return (
      <motion.div
        key={resource.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`p-4 rounded-lg border-2 transition-all ${
          resource.completed
            ? 'border-gray-600 bg-gray-800/50'
            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Completion status */}
          <div className="mt-1">
            {resource.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Resource title and type */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h5
                  className={`font-semibold text-sm mb-1 ${
                    resource.completed ? 'line-through text-gray-400' : 'text-white'
                  }`}
                >
                  {resource.title}
                </h5>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={typeConf.color}>
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {typeConf.label}
                  </Badge>
                  <Badge className={diffConf.color}>
                    {diffConf.label}
                  </Badge>
                  {resource.isFree ? (
                    <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
                      Free
                    </Badge>
                  ) : (
                    resource.price && (
                      <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                        {formatPrice(resource.price)}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Provider and duration */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
              <span>{resource.provider}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {resource.duration}
              </span>
              {resource.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {resource.rating.toFixed(1)}
                  {resource.reviewCount && ` (${resource.reviewCount})`}
                </span>
              )}
            </div>

            {/* Skills covered */}
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.skills.slice(0, 3).map(skill => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 border border-gray-700 rounded"
                >
                  {skill}
                </span>
              ))}
              {resource.skills.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-gray-800/50 text-gray-400 rounded">
                  +{resource.skills.length - 3} more
                </span>
              )}
            </div>

            {/* Progress bar (if in progress) */}
            {!resource.completed && resource.progress !== undefined && resource.progress > 0 && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{resource.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={() => onResourceClick?.(resource.id)}
              className={`text-sm font-medium flex items-center gap-1 ${
                resource.completed
                  ? 'text-green-400 hover:text-green-300'
                  : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              {resource.completed ? (
                <>
                  View Certificate
                  <ExternalLink className="w-3 h-3" />
                </>
              ) : resource.progress ? (
                <>
                  Continue Learning
                  <Play className="w-3 h-3" />
                </>
              ) : (
                <>
                  Start Now
                  <Play className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                {path.name}
              </CardTitle>
              {path.aiGenerated && (
                <Badge variant="secondary" className="text-xs bg-gray-800/50 text-gray-300">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Curated
                </Badge>
              )}
            </div>
            <CardDescription>{path.description}</CardDescription>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={difficultyConf.color}>
                {difficultyConf.label}
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                <Clock className="w-3 h-3 mr-1" />
                {path.estimatedDuration}
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                <Users className="w-3 h-3 mr-1" />
                {path.popularity.toLocaleString()} following
              </Badge>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        {completedResources > 0 && (
          <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Path Progress</span>
              <span className="text-lg font-bold text-white">
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {completedResources}/{totalResources} resources completed
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Target skill and outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target skill */}
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Target Skill</h4>
            <p className="text-sm font-medium text-white">{path.targetSkill}</p>
          </div>

          {/* Prerequisites */}
          {path.prerequisites && path.prerequisites.length > 0 && (
            <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Prerequisites
              </h4>
              <div className="flex flex-wrap gap-1">
                {path.prerequisites.map(prereq => (
                  <span
                    key={prereq}
                    className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 border border-gray-700 rounded"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Learning outcomes */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-white">What You'll Learn</h4>
          <ul className="space-y-2">
            {path.outcomes.map((outcome, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-sm text-gray-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                {outcome}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">
              Learning Resources ({totalResources})
            </h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium"
            >
              {isExpanded ? 'Show Less' : 'Show All'}
            </button>
          </div>

          <div className="space-y-3">
            {(isExpanded ? path.resources : path.resources.slice(0, 3)).map((resource, index) =>
              renderResource(resource, index)
            )}
          </div>

          {!isExpanded && totalResources > 3 && (
            <div className="flex justify-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-3 px-6 py-2 text-sm text-gray-400 hover:text-white font-medium border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
              >
                +{totalResources - 3} more resources
              </button>
            </div>
          )}
        </div>

        {/* Start path button */}
        {completedResources === 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => onStartPath?.(path.id)}
              className="px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Learning Path
            </button>
          </div>
        )}

        {completedResources > 0 && completedResources < totalResources && (
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Keep Going!</p>
                <p className="text-xs text-gray-400 mt-1">
                  You're {completionPercentage.toFixed(0)}% through this path
                </p>
              </div>
              <button
                onClick={() => onStartPath?.(path.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {completedResources === totalResources && (
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-white" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Path Completed! 🎉
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  You've mastered {path.targetSkill}. Ready to apply your new skills!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
