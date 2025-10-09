'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { motion } from 'framer-motion'
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Circle
} from 'lucide-react'

export interface CurrentProfile {
  currentRole: string
  currentCompany: string
  currentLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  yearsOfExperience: number
  location: string
  currentSalary?: number
  currency: string
  topSkills: {
    skill: string
    proficiency: number // 0-100
    yearsUsed: number
  }[]
  education: {
    degree: string
    field: string
    institution: string
    year: number
  }[]
  careerGoal?: string
}

export interface TargetRole {
  role: string
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  targetSalary?: {
    min: number
    max: number
  }
  targetCompanySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  targetIndustry?: string
  preferredLocation?: string
  timeframe: string // e.g., "6-12 months"
}

interface CurrentProfileCardProps {
  profile: CurrentProfile
  targetRole?: TargetRole
  onEditProfile?: () => void
  onSetGoal?: () => void
  className?: string
}

const levelLabels = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  lead: 'Lead',
  principal: 'Principal'
}

const companySizeLabels = {
  startup: 'Startup (1-50)',
  small: 'Small (51-200)',
  medium: 'Medium (201-1000)',
  large: 'Large (1001-5000)',
  enterprise: 'Enterprise (5000+)'
}

export function CurrentProfileCard({
  profile,
  targetRole,
  onEditProfile,
  onSetGoal,
  className
}: CurrentProfileCardProps) {
  const formatSalary = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getLevelProgression = () => {
    const levels = ['junior', 'mid', 'senior', 'lead', 'principal']
    const currentIndex = levels.indexOf(profile.currentLevel)
    const targetIndex = targetRole ? levels.indexOf(targetRole.level) : currentIndex

    return {
      currentIndex,
      targetIndex,
      isProgression: targetIndex > currentIndex,
      isLateral: targetIndex === currentIndex,
      levelsToGo: targetIndex - currentIndex
    }
  }

  const progression = getLevelProgression()

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-purple-400" />
              Your Career Profile
            </CardTitle>
            <CardDescription className="text-gray-400">
              {targetRole
                ? 'Current position vs. target role'
                : 'Your current professional profile'}
            </CardDescription>
          </div>
          <button
            onClick={onEditProfile}
            className="text-sm text-purple-400 hover:text-purple-300 font-medium"
          >
            Edit Profile
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Role Section */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
            Current Position
          </h4>

          <div className="space-y-3">
            {/* Role and company */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{profile.currentRole}</div>
                <div className="text-sm text-gray-300">{profile.currentCompany}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                    {levelLabels[profile.currentLevel]}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    {profile.yearsOfExperience} years exp.
                  </Badge>
                </div>
              </div>
            </div>

            {/* Location and salary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">Location</div>
                  <div className="text-sm font-medium text-white">{profile.location}</div>
                </div>
              </div>

              {profile.currentSalary && (
                <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-400">Salary</div>
                    <div className="text-sm font-medium text-white">
                      {formatSalary(profile.currentSalary, profile.currency)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Top skills */}
            <div>
              <div className="text-xs font-medium text-gray-300 mb-2">Top Skills</div>
              <div className="flex flex-wrap gap-2">
                {profile.topSkills.slice(0, 5).map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/50">
                      {skill.skill} ({skill.proficiency}%)
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education */}
            {profile.education.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-blue-300 mb-1">Education</div>
                  {profile.education.map((edu, index) => (
                    <div key={index} className="text-sm text-blue-200">
                      {edu.degree} in {edu.field}
                      <div className="text-xs text-blue-400">
                        {edu.institution} • {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Target Role Section */}
        {targetRole ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Role
              </h4>
              <button
                onClick={onSetGoal}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Change Goal
              </button>
            </div>

            <div className="space-y-3">
              {/* Target role info */}
              <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="p-2 bg-green-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-green-200">{targetRole.role}</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge className="bg-green-900/30 text-green-300">
                      {levelLabels[targetRole.level]}
                    </Badge>
                    {targetRole.targetCompanySize && (
                      <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                        {companySizeLabels[targetRole.targetCompanySize]}
                      </Badge>
                    )}
                    {targetRole.targetIndustry && (
                      <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                        {targetRole.targetIndustry}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Level progression visualization */}
              {(progression.isProgression || progression.isLateral) && (
                <div className="p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-purple-300">
                      Career Progression
                    </span>
                    <span className="text-xs text-purple-200">
                      {progression.isProgression
                        ? `${progression.levelsToGo} level${
                            progression.levelsToGo > 1 ? 's' : ''
                          } up`
                        : 'Lateral move'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {['junior', 'mid', 'senior', 'lead', 'principal'].map((level, index) => {
                      const isCurrent = index === progression.currentIndex
                      const isTarget = index === progression.targetIndex
                      const isPassed = index < progression.currentIndex
                      const isInProgress =
                        index > progression.currentIndex && index <= progression.targetIndex

                      return (
                        <div key={level} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            <motion.div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                isCurrent
                                  ? 'bg-purple-600 border-purple-600'
                                  : isTarget
                                  ? 'bg-green-600 border-green-600'
                                  : isPassed
                                  ? 'bg-gray-600 border-gray-600'
                                  : isInProgress
                                  ? 'bg-purple-500/30 border-purple-500'
                                  : 'bg-gray-800/30 border-gray-700'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              {(isCurrent || isTarget) && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                              {!isCurrent && !isTarget && (
                                <Circle
                                  className={`w-3 h-3 ${
                                    isPassed || isInProgress
                                      ? 'text-white'
                                      : 'text-gray-400'
                                  }`}
                                />
                              )}
                            </motion.div>
                            <div className="text-xs mt-1 text-center text-gray-400">
                              {levelLabels[level as keyof typeof levelLabels]}
                            </div>
                          </div>
                          {index < 4 && (
                            <ArrowRight
                              className={`w-4 h-4 flex-shrink-0 ${
                                index < progression.targetIndex
                                  ? 'text-purple-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Target salary and timeline */}
              <div className="grid grid-cols-2 gap-3">
                {targetRole.targetSalary && (
                  <div className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-800 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-xs text-green-400">Target Salary</div>
                      <div className="text-sm font-medium text-green-300">
                        {formatSalary(targetRole.targetSalary.min, profile.currency)} -{' '}
                        {formatSalary(targetRole.targetSalary.max, profile.currency)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-2 bg-blue-900/20 border border-blue-800 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs text-blue-400">Timeframe</div>
                    <div className="text-sm font-medium text-blue-300">
                      {targetRole.timeframe}
                    </div>
                  </div>
                </div>
              </div>

              {targetRole.preferredLocation &&
                targetRole.preferredLocation !== profile.location && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <div className="text-sm">
                      <span className="text-yellow-300 font-medium">Relocation: </span>
                      <span className="text-yellow-400">{targetRole.preferredLocation}</span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : (
          /* No goal set CTA */
          <div className="p-6 bg-purple-900/20 border-2 border-dashed border-purple-700 rounded-lg">
            <div className="text-center">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">Set Your Career Goal</h4>
              <p className="text-sm text-gray-400 mb-4">
                Define your target role to get personalized recommendations and learning paths.
              </p>
              <button
                onClick={onSetGoal}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Set Career Goal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
