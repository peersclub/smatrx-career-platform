'use client'

import { RecommendationCard, type CareerRecommendation } from '@/components/career-planner/RecommendationCard'
import { type CurrentProfile, type TargetRole } from '@/components/career-planner/CurrentProfileCard'
import { SkillGapAnalysis, type SkillGap } from '@/components/career-planner/SkillGapAnalysis'
import { LearningPathCard, type LearningPath } from '@/components/career-planner/LearningPathCard'
import CourseRecommendations from '@/components/learning/CourseRecommendations'
import Navigation from '@/components/navigation'
import { motion } from 'framer-motion'
import { Compass, Target, TrendingUp, BookOpen, Sparkles, User, Briefcase, MapPin, DollarSign, Calendar, GraduationCap, Edit, Loader2 } from 'lucide-react'
import { Button } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

// Mock data - will be replaced with React Query hooks
const mockCareerPlannerData = {
  profile: {
    currentRole: 'Senior Frontend Developer',
    currentCompany: 'TechCorp Inc.',
    currentLevel: 'senior' as const,
    yearsOfExperience: 6,
    location: 'San Francisco, CA',
    currentSalary: 145000,
    currency: 'USD',
    topSkills: [
      { skill: 'React', proficiency: 90, yearsUsed: 5 },
      { skill: 'TypeScript', proficiency: 85, yearsUsed: 4 },
      { skill: 'Next.js', proficiency: 80, yearsUsed: 3 },
      { skill: 'Node.js', proficiency: 75, yearsUsed: 4 },
      { skill: 'GraphQL', proficiency: 70, yearsUsed: 2 }
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        field: 'Software Engineering',
        institution: 'Stanford University',
        year: 2018
      }
    ],
    careerGoal: 'Become a Principal Engineer within 2 years'
  } as CurrentProfile,

  targetRole: {
    role: 'Principal Frontend Engineer',
    level: 'principal' as const,
    targetSalary: {
      min: 200000,
      max: 280000
    },
    targetCompanySize: 'large' as const,
    targetIndustry: 'Enterprise SaaS',
    preferredLocation: 'San Francisco, CA',
    timeframe: '18-24 months'
  } as TargetRole,

  recommendations: [
    {
      id: 'rec-1',
      role: 'Principal Frontend Engineer',
      company: 'Meta',
      level: 'principal' as const,
      matchScore: 85,
      salaryRange: { min: 220000, max: 300000, currency: 'USD' },
      location: 'Menlo Park, CA',
      timeToReady: '6-12 months',
      matchReasons: [
        'Your React expertise aligns with Meta\'s tech stack',
        '6 years experience meets their senior-to-principal threshold',
        'Strong architectural experience from current role'
      ],
      requiredSkills: [
        { skill: 'React', hasSkill: true, proficiency: 90 },
        { skill: 'System Design', hasSkill: true, proficiency: 75 },
        { skill: 'GraphQL', hasSkill: true, proficiency: 70 },
        { skill: 'Performance Optimization', hasSkill: true, proficiency: 80 },
        { skill: 'Mentorship', hasSkill: true, proficiency: 65 },
        { skill: 'Distributed Systems', hasSkill: false }
      ],
      growthPotential: 'high' as const,
      demandTrend: 'increasing' as const,
      aiGenerated: true
    },
    {
      id: 'rec-2',
      role: 'Engineering Lead',
      company: 'Stripe',
      level: 'lead' as const,
      matchScore: 78,
      salaryRange: { min: 190000, max: 250000, currency: 'USD' },
      location: 'San Francisco, CA',
      timeToReady: '3-6 months',
      matchReasons: [
        'Your frontend expertise complements Stripe\'s product needs',
        'Leadership experience from current team lead role',
        'TypeScript proficiency matches their requirements'
      ],
      requiredSkills: [
        { skill: 'TypeScript', hasSkill: true, proficiency: 85 },
        { skill: 'Team Leadership', hasSkill: true, proficiency: 70 },
        { skill: 'API Design', hasSkill: true, proficiency: 65 },
        { skill: 'Testing Strategy', hasSkill: true, proficiency: 60 },
        { skill: 'Product Sense', hasSkill: false }
      ],
      growthPotential: 'medium' as const,
      demandTrend: 'stable' as const,
      aiGenerated: true
    },
    {
      id: 'rec-3',
      role: 'Staff Frontend Engineer',
      company: 'Airbnb',
      level: 'principal' as const,
      matchScore: 72,
      salaryRange: { min: 200000, max: 270000, currency: 'USD' },
      location: 'San Francisco, CA',
      timeToReady: '8-12 months',
      matchReasons: [
        'Next.js experience aligns with their tech migration',
        'Design system experience from previous projects',
        'Strong collaboration with design teams'
      ],
      requiredSkills: [
        { skill: 'Next.js', hasSkill: true, proficiency: 80 },
        { skill: 'Design Systems', hasSkill: true, proficiency: 70 },
        { skill: 'A/B Testing', hasSkill: false },
        { skill: 'Accessibility', hasSkill: true, proficiency: 60 },
        { skill: 'Cross-functional Leadership', hasSkill: false }
      ],
      growthPotential: 'high' as const,
      demandTrend: 'stable' as const,
      aiGenerated: true
    }
  ] as CareerRecommendation[],

  skillGap: {
    have: [
      {
        id: 'skill-1',
        name: 'React',
        category: 'technical' as const,
        importance: 'critical' as const,
        currentProficiency: 90,
        targetProficiency: 95,
        learningResources: 8
      },
      {
        id: 'skill-2',
        name: 'TypeScript',
        category: 'language' as const,
        importance: 'critical' as const,
        currentProficiency: 85,
        targetProficiency: 90,
        learningResources: 12
      },
      {
        id: 'skill-3',
        name: 'System Design',
        category: 'technical' as const,
        importance: 'critical' as const,
        currentProficiency: 75,
        targetProficiency: 80,
        learningResources: 6
      }
    ],
    needImprovement: [
      {
        id: 'skill-4',
        name: 'Performance Optimization',
        category: 'technical' as const,
        importance: 'important' as const,
        currentProficiency: 60,
        targetProficiency: 85,
        timeToImprove: '2-3 months',
        learningResources: 10
      },
      {
        id: 'skill-5',
        name: 'Mentorship & Leadership',
        category: 'soft' as const,
        importance: 'critical' as const,
        currentProficiency: 65,
        targetProficiency: 90,
        timeToImprove: '4-6 months',
        learningResources: 5
      },
      {
        id: 'skill-6',
        name: 'Technical Writing',
        category: 'soft' as const,
        importance: 'important' as const,
        currentProficiency: 55,
        targetProficiency: 80,
        timeToImprove: '2-3 months',
        learningResources: 7
      }
    ],
    missing: [
      {
        id: 'skill-7',
        name: 'Distributed Systems',
        category: 'technical' as const,
        importance: 'critical' as const,
        targetProficiency: 75,
        timeToAcquire: '6-9 months',
        learningResources: 15
      },
      {
        id: 'skill-8',
        name: 'Engineering Management',
        category: 'soft' as const,
        importance: 'important' as const,
        targetProficiency: 70,
        timeToAcquire: '3-6 months',
        learningResources: 8
      },
      {
        id: 'skill-9',
        name: 'Product Strategy',
        category: 'domain' as const,
        importance: 'important' as const,
        targetProficiency: 65,
        timeToAcquire: '2-4 months',
        learningResources: 6
      }
    ]
  } as SkillGap,

  learningPaths: [
    {
      id: 'path-1',
      name: 'Distributed Systems Fundamentals',
      description: 'Master the core concepts of distributed systems architecture, scaling, and reliability',
      targetSkill: 'Distributed Systems',
      estimatedDuration: '6 months',
      difficulty: 'advanced' as const,
      prerequisites: ['System Design', 'Backend Development', 'Networking Basics'],
      outcomes: [
        'Design scalable distributed systems from scratch',
        'Understand CAP theorem and consistency models',
        'Implement fault-tolerant microservices',
        'Master distributed data storage patterns'
      ],
      popularity: 1247,
      aiGenerated: true,
      resources: [
        {
          id: 'res-1',
          title: 'Designing Data-Intensive Applications',
          type: 'book' as const,
          provider: 'O\'Reilly Media',
          duration: '40 hours',
          difficulty: 'advanced' as const,
          rating: 4.8,
          reviewCount: 2340,
          isFree: false,
          price: { amount: 45, currency: 'USD' },
          skills: ['Distributed Systems', 'Database Design', 'System Architecture']
        },
        {
          id: 'res-2',
          title: 'MIT 6.824: Distributed Systems',
          type: 'course' as const,
          provider: 'MIT OpenCourseWare',
          duration: '80 hours',
          difficulty: 'advanced' as const,
          rating: 4.9,
          reviewCount: 856,
          isFree: true,
          skills: ['Distributed Systems', 'Consensus Algorithms', 'Fault Tolerance'],
          completed: false,
          progress: 35
        },
        {
          id: 'res-3',
          title: 'Build a Distributed Key-Value Store',
          type: 'project' as const,
          provider: 'Real-World Projects',
          duration: '30 hours',
          difficulty: 'advanced' as const,
          isFree: true,
          skills: ['Distributed Systems', 'Golang', 'Raft Consensus']
        }
      ]
    },
    {
      id: 'path-2',
      name: 'Technical Leadership Track',
      description: 'Develop the leadership and mentorship skills needed for principal engineering roles',
      targetSkill: 'Engineering Leadership',
      estimatedDuration: '4 months',
      difficulty: 'intermediate' as const,
      prerequisites: ['3+ years experience', 'Team collaboration'],
      outcomes: [
        'Lead technical initiatives across multiple teams',
        'Effectively mentor junior and senior engineers',
        'Make architectural decisions with business impact',
        'Build technical roadmaps and drive execution'
      ],
      popularity: 983,
      aiGenerated: true,
      resources: [
        {
          id: 'res-4',
          title: 'The Staff Engineer\'s Path',
          type: 'book' as const,
          provider: 'O\'Reilly Media',
          duration: '20 hours',
          difficulty: 'intermediate' as const,
          rating: 4.7,
          reviewCount: 1234,
          isFree: false,
          price: { amount: 38, currency: 'USD' },
          skills: ['Technical Leadership', 'Career Development', 'Communication'],
          completed: true
        },
        {
          id: 'res-5',
          title: 'Engineering Management Fundamentals',
          type: 'course' as const,
          provider: 'LinkedIn Learning',
          duration: '12 hours',
          difficulty: 'beginner' as const,
          rating: 4.5,
          reviewCount: 3421,
          isFree: false,
          price: { amount: 30, currency: 'USD' },
          skills: ['Team Management', 'Communication', 'Conflict Resolution']
        }
      ]
    }
  ] as LearningPath[]
}

type ActiveSection = 'overview' | 'profile' | 'skills' | 'roles' | 'learning'

interface CareerPlannerClientProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function CareerPlannerClient({ user }: CareerPlannerClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview')
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [isLoadingPaths, setIsLoadingPaths] = useState(false)

  // Sync URL with active section
  useEffect(() => {
    const section = searchParams.get('section') as ActiveSection
    if (section && ['overview', 'profile', 'skills', 'roles', 'learning'].includes(section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  // Fetch learning paths on mount
  useEffect(() => {
    fetchLearningPaths()
  }, [])

  const fetchLearningPaths = async () => {
    setIsLoadingPaths(true)
    try {
      const response = await fetch('/api/learning/paths?userProgress=true')
      const data = await response.json()
      
      if (data.success && data.paths) {
        // Transform API data to match LearningPath interface
        const transformedPaths = data.paths.map((path: any) => ({
          id: path.id,
          name: path.name,
          description: path.description || '',
          targetSkill: path.resources?.targetSkill || path.targetRole || '',
          estimatedDuration: `${path.estimatedDuration || 12} weeks`,
          difficulty: path.difficulty || 'intermediate',
          prerequisites: path.resources?.prerequisites || [],
          outcomes: path.resources?.outcomes || [],
          popularity: path.resources?.popularity || 0,
          aiGenerated: path.resources?.aiGenerated || true,
          resources: path.resources?.resources || [],
          progress: path.userProgress?.percentage || 0,
          isStarted: !!path.userProgress,
        }))
        setLearningPaths(transformedPaths)
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error)
      showToast('error', 'Failed to load learning paths')
    } finally {
      setIsLoadingPaths(false)
    }
  }

  const navigateToSection = (section: ActiveSection) => {
    setActiveSection(section)
    router.push(`/dashboard/career-planner?section=${section}`, { scroll: false })
  }

  const handleExploreRecommendation = (id: string) => {
    console.log('Exploring recommendation:', id)
  }

  const handleSaveRecommendation = (id: string) => {
    console.log('Saving recommendation:', id)
  }

  const handleStartLearning = (skillId: string) => {
    console.log('Starting learning for skill:', skillId)
  }

  const handleStartPath = async (pathId: string) => {
    try {
      const response = await fetch(`/api/learning/paths/${pathId}/start`, {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        showToast(
          'success',
          data.isNew 
            ? 'Learning Path Started! Your progress is now being tracked' 
            : 'Welcome back! Continue where you left off'
        )
        // Refresh learning paths to show updated progress
        await fetchLearningPaths()
      } else {
        throw new Error(data.error || 'Failed to start learning path')
      }
    } catch (error) {
      console.error('Error starting learning path:', error)
      showToast('error', 'Failed to start learning path. Please try again.')
    }
  }

  const handleResourceClick = async (resourceId: string, pathId?: string) => {
    // Find the resource to get its URL
    const path = learningPaths.find(p => 
      p.resources?.some((r: any) => r.id === resourceId)
    )
    const resource = path?.resources?.find((r: any) => r.id === resourceId)
    
    if (resource && (resource as any).url) {
      // Open resource in new tab
      window.open((resource as any).url, '_blank')
      
      // Track resource access if we have a pathId
      if (pathId) {
        try {
          await fetch(`/api/learning/paths/${pathId}/resources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              resourceId, 
              action: 'view' 
            }),
          })
          // Silently refresh to update progress
          fetchLearningPaths()
        } catch (error) {
          console.error('Error tracking resource:', error)
          // Don't show error to user, tracking is optional
        }
      }
    } else {
      showToast('error', 'This resource link is not available yet.')
    }
  }

  const totalSkills = mockCareerPlannerData.skillGap.have.length + 
                      mockCareerPlannerData.skillGap.needImprovement.length + 
                      mockCareerPlannerData.skillGap.missing.length
  const masteredSkills = mockCareerPlannerData.skillGap.have.length
  const readinessPercent = Math.round((masteredSkills / totalSkills) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation user={user} variant="authenticated" />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Compass className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Career Planner</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              AI-powered insights to navigate your career journey
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{readinessPercent}%</div>
              <div className="text-sm text-gray-400">Career Readiness</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {mockCareerPlannerData.recommendations.length}
              </div>
              <div className="text-sm text-gray-400">Role Matches</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {mockCareerPlannerData.skillGap.missing.length}
              </div>
              <div className="text-sm text-gray-400">Skills to Learn</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {learningPaths.length}
              </div>
              <div className="text-sm text-gray-400">Learning Paths</div>
            </div>
          </motion.div>

          {/* Section Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Button
              variant={activeSection === 'overview' ? 'default' : 'outline'}
              onClick={() => navigateToSection('overview')}
              className="px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeSection === 'profile' ? 'default' : 'outline'}
              onClick={() => navigateToSection('profile')}
              className="px-6"
            >
              <Target className="w-4 h-4 mr-2" />
              Your Profile
            </Button>
            <Button
              variant={activeSection === 'skills' ? 'default' : 'outline'}
              onClick={() => navigateToSection('skills')}
              className="px-6"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Skill Gaps
            </Button>
            <Button
              variant={activeSection === 'roles' ? 'default' : 'outline'}
              onClick={() => navigateToSection('roles')}
              className="px-6"
            >
              <Compass className="w-4 h-4 mr-2" />
              Recommended Roles
            </Button>
            <Button
              variant={activeSection === 'learning' ? 'default' : 'outline'}
              onClick={() => navigateToSection('learning')}
              className="px-6"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Paths
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Your Career Journey</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      You're currently a <span className="text-white font-semibold">{mockCareerPlannerData.profile.currentRole}</span> with {readinessPercent}% readiness 
                      for your target role of <span className="text-white font-semibold">{mockCareerPlannerData.targetRole.role}</span>. 
                      We've identified {mockCareerPlannerData.recommendations.length} matching opportunities and {learningPaths.length} learning 
                      paths to help you achieve your goals.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => navigateToSection('profile')}>
                        View Your Profile
                      </Button>
                      <Button variant="outline" onClick={() => navigateToSection('roles')}>
                        Explore Roles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    Top Opportunities
                  </h3>
                  <div className="space-y-4">
                    {mockCareerPlannerData.recommendations.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{rec.role}</div>
                          <div className="text-sm text-gray-400">{rec.company}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{rec.matchScore}%</div>
                          <div className="text-xs text-gray-500">Match</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => navigateToSection('roles')}
                    >
                      View All Roles
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    Priority Learning
                  </h3>
                  <div className="space-y-4">
                    {mockCareerPlannerData.skillGap.missing.slice(0, 3).map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{skill.name}</div>
                          <div className="text-sm text-gray-400">{skill.category}</div>
                        </div>
                        <div className="text-xs text-gray-400 uppercase font-semibold">
                          {skill.importance}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => navigateToSection('skills')}
                    >
                      View Skill Gaps
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Section - Redesigned */}
          {activeSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Current Profile */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <User className="w-6 h-6 text-purple-400" />
                      Your Current Profile
                    </h2>
                    <p className="text-gray-400">Your professional snapshot</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Role & Company */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Current Role</div>
                      <div className="flex items-start gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-semibold text-lg text-white">
                            {mockCareerPlannerData.profile.currentRole}
                          </div>
                          <div className="text-gray-300 mt-1">
                            {mockCareerPlannerData.profile.currentCompany}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Badge className="bg-gray-800 text-gray-300 border border-gray-700">
                              Senior Level
                            </Badge>
                            <Badge variant="outline" className="text-gray-300 border-gray-700">
                              <Calendar className="w-3 h-3 mr-1" />
                              {mockCareerPlannerData.profile.yearsOfExperience} years
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Location</div>
                      <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">
                          {mockCareerPlannerData.profile.location}
                        </span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Current Compensation</div>
                      <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-semibold text-lg">
                          ${mockCareerPlannerData.profile.currentSalary?.toLocaleString()}
                        </span>
                        <span className="text-gray-400">/ year</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Top Skills */}
                    <div>
                      <div className="text-sm text-gray-400 mb-3">Top Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {mockCareerPlannerData.profile.topSkills.map((skill) => (
                          <Badge 
                            key={skill.skill}
                            className="bg-gray-800 text-gray-300 border border-gray-700"
                          >
                            {skill.skill} · {skill.proficiency}%
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Education</div>
                      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            {mockCareerPlannerData.profile.education.map((edu, idx) => (
                              <div key={idx}>
                                <div className="font-medium text-white">
                                  {edu.degree}
                                </div>
                                <div className="text-sm text-gray-300 mt-1">
                                  {edu.field}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {edu.institution} · {edu.year}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Career Goal */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Career Goal</div>
                      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p className="text-gray-300">
                            {mockCareerPlannerData.profile.careerGoal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Role */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Target className="w-6 h-6 text-purple-400" />
                      Target Role
                    </h2>
                    <p className="text-gray-400">Where you're heading</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Change Goal
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Role */}
                  <div className="lg:col-span-2">
                    <div className="text-sm text-gray-400 mb-2">Target Position</div>
                    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-2">
                        {mockCareerPlannerData.targetRole.role}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className="bg-gray-800 text-gray-300 border border-gray-700">
                          Principal Level
                        </Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700">
                          {mockCareerPlannerData.targetRole.targetIndustry}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700">
                          Large Company
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Timeframe */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Timeframe</div>
                    <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        {mockCareerPlannerData.targetRole.timeframe.split('-')[0]}
                      </div>
                      <div className="text-sm text-gray-400">months goal</div>
                    </div>
                  </div>
                </div>

                {/* Salary Target */}
                <div className="mt-6">
                  <div className="text-sm text-gray-400 mb-2">Target Compensation</div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-white font-semibold text-lg">
                        ${mockCareerPlannerData.targetRole.targetSalary?.min.toLocaleString()} - 
                        ${mockCareerPlannerData.targetRole.targetSalary?.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      +{Math.round(((mockCareerPlannerData.targetRole.targetSalary?.min || 0) / (mockCareerPlannerData.profile.currentSalary || 1) - 1) * 100)}% increase
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SkillGapAnalysis
                skillGap={mockCareerPlannerData.skillGap}
                targetRole={mockCareerPlannerData.targetRole.role}
                onStartLearning={handleStartLearning}
              />
            </motion.div>
          )}

          {/* Roles Section */}
          {activeSection === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Recommended Roles</h2>
                <p className="text-gray-400">Based on your skills and career goals</p>
              </div>
              {mockCareerPlannerData.recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onExplore={handleExploreRecommendation}
                  onSaveToPlanner={handleSaveRecommendation}
                />
              ))}
            </motion.div>
          )}

          {/* Learning Section */}
          {activeSection === 'learning' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* AI Course Recommendations */}
              <CourseRecommendations
                skillGaps={mockCareerPlannerData.skillGap.missing.map(s => s.name)}
                targetRole={mockCareerPlannerData.targetRole.role}
                currentLevel={mockCareerPlannerData.profile.currentLevel}
              />

              {/* Divider */}
              <div className="border-t border-gray-800"></div>

              {/* Curated Learning Paths */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Curated Learning Paths</h2>
                  <p className="text-gray-400">Structured paths to master essential skills</p>
                </div>
                
                {isLoadingPaths ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    <span className="ml-3 text-gray-400">Loading learning paths...</span>
                  </div>
                ) : learningPaths.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {learningPaths.map((path) => (
                      <LearningPathCard
                        key={path.id}
                        path={path}
                        onStartPath={handleStartPath}
                        onResourceClick={(resourceId) => handleResourceClick(resourceId, path.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" />
                    <p className="text-gray-400 mb-2">No learning paths available</p>
                    <p className="text-sm text-gray-500">Check back later for curated learning paths</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
