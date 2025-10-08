'use client'

import { CredibilityScoreCard } from '@/components/credibility/CredibilityScoreCard'
import { ScoreBreakdownCard } from '@/components/credibility/ScoreBreakdownCard'
import { VerificationBadges } from '@/components/credibility/VerificationBadges'
import { DataCompletenessCard } from '@/components/credibility/DataCompletenessCard'
import { CredibilityInsightsCard } from '@/components/credibility/CredibilityInsightsCard'
import { motion } from 'framer-motion'
import { RefreshCw, Download, Share2, Info } from 'lucide-react'
import { Button } from '@/packages/ui/src/components/button'
import { useState } from 'react'

// Mock data - will be replaced with React Query hooks
const mockCredibilityData = {
  overallScore: 78,
  verificationLevel: 'verified' as const,
  previousScore: 72,
  lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago

  breakdown: {
    education: {
      score: 85,
      weight: 0.25,
      factors: {
        'Degree Level': 90,
        'Institution Reputation': 85,
        'Field Relevance': 80,
        'Graduation Year': 75
      }
    },
    experience: {
      score: 75,
      weight: 0.30,
      factors: {
        'Years of Experience': 80,
        'Role Seniority': 75,
        'Company Size': 70,
        'Industry Relevance': 75
      }
    },
    technical: {
      score: 82,
      weight: 0.20,
      factors: {
        'GitHub Activity': 85,
        'Project Complexity': 80,
        'Tech Stack Breadth': 82,
        'Code Quality': 81
      }
    },
    social: {
      score: 65,
      weight: 0.15,
      factors: {
        'LinkedIn Connections': 60,
        'Endorsements': 65,
        'Recommendations': 70,
        'Community Engagement': 65
      }
    },
    certifications: {
      score: 70,
      weight: 0.10,
      factors: {
        'Number of Certs': 75,
        'Cert Recency': 70,
        'Cert Relevance': 68,
        'Issuer Reputation': 67
      }
    }
  },

  badges: [
    {
      id: 'verified-email',
      name: 'Verified Email',
      description: 'Email address has been verified',
      icon: 'checkmark' as const,
      earned: true,
      criteria: 'Verify your email address'
    },
    {
      id: 'github-connected',
      name: 'GitHub Connected',
      description: 'GitHub account linked and analyzed',
      icon: 'lightning' as const,
      earned: true,
      criteria: 'Connect your GitHub account'
    },
    {
      id: 'education-verified',
      name: 'Education Verified',
      description: 'Educational credentials verified by institution',
      icon: 'graduation' as const,
      earned: false,
      progress: 60,
      criteria: 'Upload and verify educational documents'
    },
    {
      id: 'professional-certified',
      name: 'Professionally Certified',
      description: 'Hold at least one industry certification',
      icon: 'diamond' as const,
      earned: true,
      criteria: 'Add and verify professional certifications'
    },
    {
      id: 'global-presence',
      name: 'Global Presence',
      description: 'Active on multiple professional platforms',
      icon: 'globe' as const,
      earned: false,
      progress: 33,
      criteria: 'Connect LinkedIn, Twitter, and personal website'
    },
    {
      id: 'long-term-contributor',
      name: 'Long-term Contributor',
      description: 'Consistent activity over 2+ years',
      icon: 'calendar' as const,
      earned: false,
      progress: 75,
      criteria: 'Maintain consistent GitHub activity for 2 years'
    }
  ],

  completeness: 73,
  missingData: [
    {
      category: 'Education',
      items: ['Degree verification documents', 'GPA information'],
      priority: 'critical' as const
    },
    {
      category: 'Experience',
      items: ['Employment verification', 'Performance reviews'],
      priority: 'important' as const
    },
    {
      category: 'Social Proof',
      items: ['LinkedIn recommendations', 'Twitter profile'],
      priority: 'optional' as const
    }
  ],

  insights: [
    {
      id: 'strength-1',
      type: 'strength' as const,
      title: 'Strong Technical Foundation',
      description:
        'Your GitHub activity shows consistent contributions with high-quality code across multiple projects.',
      impact: 'high' as const,
      actionable: false,
      category: 'Technical Skills'
    },
    {
      id: 'improvement-1',
      type: 'improvement' as const,
      title: 'Enhance Social Proof',
      description:
        'Your social proof score is below average. Request recommendations from colleagues and engage more on LinkedIn.',
      impact: 'medium' as const,
      actionable: true,
      actionText: 'View recommendations',
      category: 'Social Proof'
    },
    {
      id: 'opportunity-1',
      type: 'opportunity' as const,
      title: 'Certification Opportunity',
      description:
        'Adding AWS Solutions Architect certification would boost your credibility by 8 points and increase marketability.',
      impact: 'high' as const,
      actionable: true,
      actionText: 'Explore certifications',
      category: 'Certifications'
    },
    {
      id: 'warning-1',
      type: 'warning' as const,
      title: 'Verification Pending',
      description:
        'Your education credentials are unverified. This limits your credibility score potential.',
      impact: 'high' as const,
      actionable: true,
      actionText: 'Verify now',
      category: 'Education'
    }
  ],

  nextSteps: [
    {
      id: 'step-1',
      title: 'Upload Education Verification Documents',
      description:
        'Submit your degree certificates and transcripts for institutional verification.',
      estimatedImpact: 12,
      timeEstimate: '10 minutes',
      priority: 'high' as const
    },
    {
      id: 'step-2',
      title: 'Request 3 LinkedIn Recommendations',
      description:
        'Reach out to former colleagues or managers for professional recommendations.',
      estimatedImpact: 8,
      timeEstimate: '15 minutes',
      priority: 'high' as const
    },
    {
      id: 'step-3',
      title: 'Connect Twitter Account',
      description: 'Link your Twitter profile to showcase your professional presence.',
      estimatedImpact: 5,
      timeEstimate: '2 minutes',
      priority: 'medium' as const
    },
    {
      id: 'step-4',
      title: 'Add Personal Website',
      description: 'Include a link to your portfolio or personal blog.',
      estimatedImpact: 3,
      timeEstimate: '5 minutes',
      priority: 'low' as const
    }
  ],

  lastAnalyzed: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
}

export default function CredibilityDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log('Exporting credibility report...')
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing credibility profile...')
  }

  const handleActionClick = (category: string) => {
    console.log('Action clicked for:', category)
    // TODO: Navigate to appropriate section or open modal
  }

  const handleInsightAction = (insightId: string) => {
    console.log('Insight action clicked:', insightId)
    // TODO: Handle insight-specific actions
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
              <h1 className="text-3xl font-bold text-gray-900">
                Credibility Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track and improve your professional credibility score
              </p>
            </div>

            <div className="flex items-center gap-3">
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
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <motion.div
          className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                About Your Credibility Score
              </h3>
              <p className="text-sm text-blue-800">
                Your credibility score is calculated from 5 key areas: Education,
                Experience, Technical Skills, Social Proof, and Certifications. Each area
                is weighted based on industry standards. Improve your score by completing
                your profile and verifying your credentials.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Row: Score + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CredibilityScoreCard
              overallScore={mockCredibilityData.overallScore}
              verificationLevel={mockCredibilityData.verificationLevel}
              previousScore={mockCredibilityData.previousScore}
              lastUpdated={mockCredibilityData.lastUpdated}
            />
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ScoreBreakdownCard breakdown={mockCredibilityData.breakdown} />
          </motion.div>
        </div>

        {/* Middle Row: Badges + Completeness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <VerificationBadges badges={mockCredibilityData.badges} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <DataCompletenessCard
              completeness={mockCredibilityData.completeness}
              missingData={mockCredibilityData.missingData}
              onAction={handleActionClick}
            />
          </motion.div>
        </div>

        {/* Bottom Row: AI Insights (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <CredibilityInsightsCard
            insights={mockCredibilityData.insights}
            nextSteps={mockCredibilityData.nextSteps}
            aiGenerated={true}
            lastAnalyzed={mockCredibilityData.lastAnalyzed}
            onActionClick={handleInsightAction}
          />
        </motion.div>
      </div>
    </div>
  )
}
