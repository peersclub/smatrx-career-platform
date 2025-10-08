/**
 * Credibility Scoring Service
 *
 * Calculates comprehensive credibility scores based on verified data from multiple sources
 *
 * Scoring Breakdown:
 * - Education (25%): Verified degrees, GPA, institution reputation
 * - Experience (20%): LinkedIn work history, years of experience
 * - Technical (25%): GitHub contributions, code quality, consistency
 * - Social (15%): Follower counts, engagement, influence across platforms
 * - Certifications (15%): Verified learning credentials and professional certs
 */

import { prisma } from '@/lib/prisma'
import { calculateEducationScore as calcEducationScore } from './education-service'
import { calculateCertificationScore as calcCertificationScore } from './certification-service'

export interface CredibilityBreakdown {
  education: {
    score: number
    factors: {
      verifiedDegrees: number
      averageGPA: number
      institutionQuality: number
    }
  }
  experience: {
    score: number
    factors: {
      yearsOfExperience: number
      roleLevel: number
      industryRelevance: number
    }
  }
  technical: {
    score: number
    factors: {
      githubActivity: number
      codeQuality: number
      consistency: number
      languageDiversity: number
    }
  }
  social: {
    score: number
    factors: {
      totalFollowers: number
      engagementRate: number
      platformDiversity: number
      contentQuality: number
    }
  }
  certifications: {
    score: number
    factors: {
      verifiedCerts: number
      prestigeLevel: number
      recency: number
    }
  }
}

export interface CredibilityResult {
  overallScore: number
  educationScore: number
  experienceScore: number
  technicalScore: number
  socialScore: number
  certificationScore: number
  verificationLevel: 'basic' | 'verified' | 'premium' | 'elite'
  badges: string[]
  breakdown: CredibilityBreakdown
}

/**
 * Calculate education score based on verified academic records
 */
async function calculateEducationScore(userId: string): Promise<{ score: number; breakdown: CredibilityBreakdown['education'] }> {
  // Use the new education service for comprehensive scoring
  const educationScore = await calcEducationScore(userId)

  return {
    score: educationScore.overallScore,
    breakdown: {
      factors: {
        verifiedDegrees: educationScore.verifiedCount * 20,
        averageGPA: educationScore.averageGPA * 7.5, // Normalize to ~30 points max
        institutionQuality: educationScore.topInstitutions * 10
      }
    }
  }
}

/**
 * Calculate experience score based on LinkedIn profile data
 */
async function calculateExperienceScore(userId: string): Promise<{ score: number; breakdown: CredibilityBreakdown['experience'] }> {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  })

  if (!profile) {
    return {
      score: 0,
      breakdown: {
        factors: {
          yearsOfExperience: 0,
          roleLevel: 0,
          industryRelevance: 0
        }
      }
    }
  }

  // Years of experience score
  const years = profile.yearsExperience || 0
  const yearsScore = Math.min(40, years * 4) // Max 40 points for 10+ years

  // Career stage/role level
  const stageLevels: Record<string, number> = {
    'executive': 35,
    'lead': 30,
    'senior': 25,
    'mid': 20,
    'entry': 10,
    'student': 5
  }
  const roleScore = stageLevels[profile.careerStage || 'entry'] || 10

  // Industry relevance (has title, company, location filled)
  let relevanceScore = 0
  if (profile.title) relevanceScore += 8
  if (profile.company) relevanceScore += 8
  if (profile.location) relevanceScore += 9

  const totalScore = Math.min(100, yearsScore + roleScore + relevanceScore)

  return {
    score: totalScore,
    breakdown: {
      factors: {
        yearsOfExperience: yearsScore,
        roleLevel: roleScore,
        industryRelevance: relevanceScore
      }
    }
  }
}

/**
 * Calculate technical score based on GitHub activity
 */
async function calculateTechnicalScore(userId: string): Promise<{ score: number; breakdown: CredibilityBreakdown['technical'] }> {
  const github = await prisma.gitHubProfile.findUnique({
    where: { userId }
  })

  if (!github) {
    return {
      score: 0,
      breakdown: {
        factors: {
          githubActivity: 0,
          codeQuality: 0,
          consistency: 0,
          languageDiversity: 0
        }
      }
    }
  }

  // GitHub activity score
  const activityMetrics = {
    repos: Math.min(20, github.totalRepos * 0.5),
    commits: Math.min(15, github.totalCommits * 0.001),
    prs: Math.min(10, github.totalPRs * 0.5),
    stars: Math.min(10, github.totalStars * 0.1)
  }
  const activityScore = Object.values(activityMetrics).reduce((a, b) => a + b, 0)

  // Code quality score (from analysis)
  const qualityScore = github.codeQualityScore || 0

  // Consistency score (regular contributions)
  const consistencyScore = github.consistencyScore || 0

  // Language diversity
  const languages = github.languagesUsed as Record<string, number> || {}
  const languageCount = Object.keys(languages).length
  const diversityScore = Math.min(20, languageCount * 4) // Max 20 for 5+ languages

  const totalScore = Math.min(100, activityScore + qualityScore + consistencyScore + diversityScore)

  return {
    score: totalScore,
    breakdown: {
      factors: {
        githubActivity: activityScore,
        codeQuality: qualityScore,
        consistency: consistencyScore,
        languageDiversity: diversityScore
      }
    }
  }
}

/**
 * Calculate social score based on social media presence
 */
async function calculateSocialScore(userId: string): Promise<{ score: number; breakdown: CredibilityBreakdown['social'] }> {
  const profiles = await prisma.socialProfile.findMany({
    where: { userId }
  })

  if (profiles.length === 0) {
    return {
      score: 0,
      breakdown: {
        factors: {
          totalFollowers: 0,
          engagementRate: 0,
          platformDiversity: 0,
          contentQuality: 0
        }
      }
    }
  }

  // Total followers across platforms (logarithmic scale)
  const totalFollowers = profiles.reduce((sum, p) => sum + (p.followerCount || 0), 0)
  const followerScore = Math.min(35, Math.log10(totalFollowers + 1) * 10)

  // Average engagement rate
  const profilesWithEngagement = profiles.filter(p => p.engagementRate && p.engagementRate > 0)
  const avgEngagement = profilesWithEngagement.length > 0
    ? profilesWithEngagement.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / profilesWithEngagement.length
    : 0
  const engagementScore = Math.min(25, avgEngagement * 2.5)

  // Platform diversity
  const platformScore = Math.min(20, profiles.length * 5) // Max 20 for 4+ platforms

  // Content quality (AI-assessed)
  const avgContentScore = profiles.length > 0
    ? profiles.reduce((sum, p) => sum + (p.contentScore || 0), 0) / profiles.length
    : 0
  const contentScore = Math.min(20, avgContentScore * 0.2)

  const totalScore = Math.min(100, followerScore + engagementScore + platformScore + contentScore)

  return {
    score: totalScore,
    breakdown: {
      factors: {
        totalFollowers: followerScore,
        engagementRate: engagementScore,
        platformDiversity: platformScore,
        contentQuality: contentScore
      }
    }
  }
}

/**
 * Calculate certification score based on verified credentials
 */
async function calculateCertificationScore(userId: string): Promise<{ score: number; breakdown: CredibilityBreakdown['certifications'] }> {
  // Use the new certification service for comprehensive scoring
  const certificationScore = await calcCertificationScore(userId)

  return {
    score: certificationScore.overallScore,
    breakdown: {
      factors: {
        verifiedCerts: certificationScore.verifiedCount * 10,
        prestigeLevel: certificationScore.trustedIssuers * 12,
        recency: certificationScore.recentCertifications * 8
      }
    }
  }
}

/**
 * Determine verification level based on overall score
 */
function getVerificationLevel(score: number): CredibilityResult['verificationLevel'] {
  if (score >= 85) return 'elite'
  if (score >= 70) return 'premium'
  if (score >= 50) return 'verified'
  return 'basic'
}

/**
 * Determine earned badges based on scores and data
 */
async function calculateBadges(userId: string, breakdown: CredibilityBreakdown): Promise<string[]> {
  const badges: string[] = []

  // Education badges
  if (breakdown.education.factors.verifiedDegrees >= 40) {
    badges.push('Academic Excellence')
  }
  if (breakdown.education.factors.institutionQuality >= 30) {
    badges.push('Top Institution Graduate')
  }

  // Experience badges
  if (breakdown.experience.factors.yearsOfExperience >= 30) {
    badges.push('Industry Veteran')
  }
  if (breakdown.experience.factors.roleLevel >= 30) {
    badges.push('Leadership Role')
  }

  // Technical badges
  if (breakdown.technical.factors.githubActivity >= 40) {
    badges.push('Active Developer')
  }
  if (breakdown.technical.factors.languageDiversity >= 16) {
    badges.push('Polyglot Developer')
  }
  if (breakdown.technical.factors.codeQuality >= 80) {
    badges.push('Code Quality Champion')
  }

  // Social badges
  if (breakdown.social.factors.totalFollowers >= 25) {
    badges.push('Social Influencer')
  }
  if (breakdown.social.factors.platformDiversity >= 15) {
    badges.push('Multi-Platform Presence')
  }

  // Certification badges
  if (breakdown.certifications.factors.verifiedCerts >= 30) {
    badges.push('Certified Professional')
  }
  if (breakdown.certifications.factors.prestigeLevel >= 24) {
    badges.push('Elite Certification Holder')
  }

  // Completeness badge
  const hasAllSources = [
    breakdown.education.score > 0,
    breakdown.experience.score > 0,
    breakdown.technical.score > 0,
    breakdown.social.score > 0,
    breakdown.certifications.score > 0
  ].every(Boolean)

  if (hasAllSources) {
    badges.push('Complete Profile')
  }

  return badges
}

/**
 * Main function to calculate comprehensive credibility score
 */
export async function calculateCredibilityScore(userId: string): Promise<CredibilityResult> {
  // Calculate individual component scores
  const [education, experience, technical, social, certifications] = await Promise.all([
    calculateEducationScore(userId),
    calculateExperienceScore(userId),
    calculateTechnicalScore(userId),
    calculateSocialScore(userId),
    calculateCertificationScore(userId)
  ])

  // Weights for each component
  const weights = {
    education: 0.25,
    experience: 0.20,
    technical: 0.25,
    social: 0.15,
    certifications: 0.15
  }

  // Calculate weighted overall score
  const overallScore = Math.round(
    (education.score * weights.education) +
    (experience.score * weights.experience) +
    (technical.score * weights.technical) +
    (social.score * weights.social) +
    (certifications.score * weights.certifications)
  )

  // Build comprehensive breakdown
  const breakdown: CredibilityBreakdown = {
    education: { score: education.score, ...education.breakdown },
    experience: { score: experience.score, ...experience.breakdown },
    technical: { score: technical.score, ...technical.breakdown },
    social: { score: social.score, ...social.breakdown },
    certifications: { score: certifications.score, ...certifications.breakdown }
  }

  // Calculate badges
  const badges = await calculateBadges(userId, breakdown)

  // Determine verification level
  const verificationLevel = getVerificationLevel(overallScore)

  const result: CredibilityResult = {
    overallScore,
    educationScore: Math.round(education.score),
    experienceScore: Math.round(experience.score),
    technicalScore: Math.round(technical.score),
    socialScore: Math.round(social.score),
    certificationScore: Math.round(certifications.score),
    verificationLevel,
    badges,
    breakdown
  }

  // Save to database
  await prisma.credibilityScore.upsert({
    where: { userId },
    create: {
      userId,
      ...result,
      breakdown: breakdown as any,
      calculatedAt: new Date()
    },
    update: {
      ...result,
      breakdown: breakdown as any,
      calculatedAt: new Date()
    }
  })

  return result
}

/**
 * Get user's current credibility score (from cache or calculate if needed)
 */
export async function getUserCredibilityScore(userId: string, forceRecalculate = false): Promise<CredibilityResult> {
  if (!forceRecalculate) {
    const existing = await prisma.credibilityScore.findUnique({
      where: { userId }
    })

    if (existing) {
      return {
        overallScore: existing.overallScore,
        educationScore: existing.educationScore,
        experienceScore: existing.experienceScore,
        technicalScore: existing.technicalScore,
        socialScore: existing.socialScore,
        certificationScore: existing.certificationScore,
        verificationLevel: existing.verificationLevel as any,
        badges: existing.badges,
        breakdown: existing.breakdown as CredibilityBreakdown
      }
    }
  }

  // Calculate if not exists or force recalculate
  return calculateCredibilityScore(userId)
}
