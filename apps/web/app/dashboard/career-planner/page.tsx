'use client'

import { RecommendationCard, type CareerRecommendation } from '@/components/career-planner/RecommendationCard'
import { CurrentProfileCard, type CurrentProfile, type TargetRole } from '@/components/career-planner/CurrentProfileCard'
import { SkillGapAnalysis, type SkillGap } from '@/components/career-planner/SkillGapAnalysis'
import { LearningPathCard, type LearningPath } from '@/components/career-planner/LearningPathCard'
import { motion } from 'framer-motion'
import { Compass, RefreshCw, Filter, Info, Sparkles } from 'lucide-react'
import { Button } from '@smatrx/ui'
import { useState } from 'react'

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

export default function CareerPlannerPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleExploreRecommendation = (id: string) => {
    console.log('Exploring recommendation:', id)
    // TODO: Navigate to detailed view or open modal
  }

  const handleSaveRecommendation = (id: string) => {
    console.log('Saving recommendation:', id)
    // TODO: Save to user's career plan
  }

  const handleStartLearning = (skillId: string) => {
    console.log('Starting learning for skill:', skillId)
    // TODO: Navigate to learning resources
  }

  const handleStartPath = (pathId: string) => {
    console.log('Starting learning path:', pathId)
    // TODO: Enroll in learning path
  }

  const handleResourceClick = (resourceId: string) => {
    console.log('Opening resource:', resourceId)
    // TODO: Navigate to resource or open in new tab
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        className="bg-white border-b sticky top-0 z-10 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Compass className="w-8 h-8 text-purple-600" />
                Career Planner
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered insights to navigate your career journey
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <motion.div
          className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-purple-900 mb-1">
                AI-Powered Career Planning
              </h3>
              <p className="text-sm text-purple-800">
                Our AI analyzes your profile, market trends, and skill gaps to recommend
                personalized career paths and learning resources. Set your target role to get
                started!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Row: Profile */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CurrentProfileCard
            profile={mockCareerPlannerData.profile}
            targetRole={mockCareerPlannerData.targetRole}
            onEditProfile={() => console.log('Edit profile')}
            onSetGoal={() => console.log('Set career goal')}
          />
        </motion.div>

        {/* Second Row: Skill Gap Analysis (Full Width) */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SkillGapAnalysis
            skillGap={mockCareerPlannerData.skillGap}
            targetRole={mockCareerPlannerData.targetRole.role}
            onStartLearning={handleStartLearning}
          />
        </motion.div>

        {/* Third Row: Career Recommendations */}
        <div className="mb-6">
          <motion.h2
            className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            Recommended Roles
            <span className="text-sm font-normal text-gray-600">
              ({mockCareerPlannerData.recommendations.length} matches)
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 gap-6">
            {mockCareerPlannerData.recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <RecommendationCard
                  recommendation={rec}
                  onExplore={handleExploreRecommendation}
                  onSaveToPlanner={handleSaveRecommendation}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fourth Row: Learning Paths */}
        <div>
          <motion.h2
            className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Info className="w-5 h-5 text-blue-600" />
            Curated Learning Paths
            <span className="text-sm font-normal text-gray-600">
              ({mockCareerPlannerData.learningPaths.length} paths)
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCareerPlannerData.learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
              >
                <LearningPathCard
                  path={path}
                  onStartPath={handleStartPath}
                  onResourceClick={handleResourceClick}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
