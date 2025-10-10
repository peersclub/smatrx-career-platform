'use client'

import { CredibilityScoreCard } from '@/components/credibility/CredibilityScoreCard'
import { ScoreBreakdownCard } from '@/components/credibility/ScoreBreakdownCard'
import { VerificationBadges } from '@/components/credibility/VerificationBadges'
import { DataCompletenessCard } from '@/components/credibility/DataCompletenessCard'
import { CredibilityInsightsCard } from '@/components/credibility/CredibilityInsightsCard'
import Navigation from '@/components/navigation'
import { motion } from 'framer-motion'
import { RefreshCw, Download, Share2, Info, Shield, Loader2 } from 'lucide-react'
import { Button } from '@smatrx/ui'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LoadingState } from '@/components/loading-state'
import { ErrorAlert } from '@/components/error-alert'

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

interface CredibilityDashboardClientProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function CredibilityDashboardClient({ user }: CredibilityDashboardClientProps) {
  const [credibilityData, setCredibilityData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  // Fetch credibility data on mount
  useEffect(() => {
    fetchCredibilityData()
  }, [])

  const fetchCredibilityData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/credibility/calculate')
      
      if (!response.ok) {
        throw new Error('Failed to fetch credibility data')
      }
      
      const data = await response.json()
      
      if (data.success && data.score) {
        setCredibilityData(data.score)
      } else {
        // If no score exists, use mock data as fallback
        setCredibilityData(mockCredibilityData)
      }
    } catch (err) {
      console.error('Error fetching credibility data:', err)
      setError('Failed to load credibility data')
      // Use mock data as fallback
      setCredibilityData(mockCredibilityData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/credibility/refresh', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Update credibility data with the new score
        if (data.data) {
          setCredibilityData(data.data)
        } else {
          // Re-fetch to get the latest data
          await fetchCredibilityData()
        }
        alert('Credibility score refreshed successfully!')
      } else {
        alert('Failed to refresh credibility score')
      }
    } catch (error) {
      console.error('Error refreshing:', error)
      alert('An error occurred while refreshing')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/credibility/export?format=json')
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `credibility-report-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Failed to export credibility report')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const response = await fetch('/api/credibility/share', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setShareUrl(data.shareUrl)
        // Copy to clipboard
        await navigator.clipboard.writeText(data.shareUrl)
        alert(`✅ Share link copied to clipboard!\n\n${data.shareUrl}\n\nShare this link to showcase your credibility.`)
      } else {
        // Show detailed error message
        const errorMsg = data.error || 'Failed to generate share link'
        const detailMsg = data.details ? `\n\nDetails: ${data.details}` : ''
        alert(`❌ ${errorMsg}${detailMsg}`)
        console.error('Share error:', data)
      }
    } catch (error) {
      console.error('Error sharing:', error)
      alert('❌ Failed to generate share link. Please check the console for details.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleActionClick = (category: string) => {
    console.log('Action clicked for:', category)
    // TODO: Navigate to appropriate section or open modal
  }

  const handleInsightAction = (insightId: string) => {
    console.log('Insight action clicked:', insightId)
    // TODO: Handle insight-specific actions
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navigation user={user} variant="authenticated" />
        <div className="pt-24 pb-8 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <LoadingState message="Loading your credibility data..." size="lg" />
          </div>
        </div>
      </div>
    )
  }

  // Use fetched data or fallback to mock data
  const data = credibilityData || mockCredibilityData

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation user={user} variant="authenticated" />

      {/* Hero Section */}
      <div className="pt-24 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Credibility Dashboard</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track and improve your professional credibility score
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center items-center gap-3"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        {/* Info Banner */}
        <motion.div
          className="mb-8 p-4 bg-gray-800/30 border border-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                About Your Credibility Score
              </h3>
              <p className="text-sm text-gray-300">
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
              overallScore={data.overallScore}
              verificationLevel={data.verificationLevel}
              previousScore={data.previousScore}
              lastUpdated={data.lastUpdated}
            />
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ScoreBreakdownCard breakdown={data.breakdown} />
          </motion.div>
        </div>

        {/* Middle Row: Badges + Completeness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <VerificationBadges badges={data.badges} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <DataCompletenessCard
              completeness={data.completeness}
              missingData={data.missingData}
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
            insights={data.insights}
            nextSteps={data.nextSteps}
            aiGenerated={true}
            lastAnalyzed={data.lastAnalyzed}
            onActionClick={handleInsightAction}
          />
        </motion.div>
      </div>
    </div>
  )
}
