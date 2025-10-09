import { prisma } from '@/lib/prisma'

interface CredibilityScoreBreakdown {
  education: {
    score: number
    weight: number
    factors: Record<string, number>
  }
  experience: {
    score: number
    weight: number
    factors: Record<string, number>
  }
  technical: {
    score: number
    weight: number
    factors: Record<string, number>
  }
  social: {
    score: number
    weight: number
    factors: Record<string, number>
  }
  certifications: {
    score: number
    weight: number
    factors: Record<string, number>
  }
}

interface CredibilityScoreResult {
  overallScore: number
  breakdown: CredibilityScoreBreakdown
  verificationLevel: 'basic' | 'verified' | 'premium' | 'elite'
  lastUpdated: Date
}

/**
 * Calculate credibility score for a user based on their profile data
 */
export async function calculateCredibilityScore(userId: string): Promise<CredibilityScoreResult> {
  try {
    // Fetch user data
    const [profile, skills, githubProfile, user] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.userSkill.findMany({ 
        where: { userId },
        include: { skill: true }
      }),
      prisma.gitHubProfile.findUnique({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId } })
    ])

    // Calculate Education Score
    const educationScore = calculateEducationScore(profile)

    // Calculate Experience Score
    const experienceScore = calculateExperienceScore(profile, githubProfile)

    // Calculate Technical Score
    const technicalScore = calculateTechnicalScore(skills, githubProfile)

    // Calculate Social Score
    const socialScore = calculateSocialScore(githubProfile, user)

    // Calculate Certifications Score
    const certificationsScore = calculateCertificationsScore(skills)

    const breakdown: CredibilityScoreBreakdown = {
      education: educationScore,
      experience: experienceScore,
      technical: technicalScore,
      social: socialScore,
      certifications: certificationsScore
    }

    // Calculate overall weighted score
    const overallScore = Math.round(
      educationScore.score * educationScore.weight +
      experienceScore.score * experienceScore.weight +
      technicalScore.score * technicalScore.weight +
      socialScore.score * socialScore.weight +
      certificationsScore.score * certificationsScore.weight
    )

    // Determine verification level based on score
    const verificationLevel = getVerificationLevel(overallScore)

    // Save to database
    await prisma.credibilityScore.upsert({
      where: { userId },
      create: {
        userId,
        overallScore,
        educationScore: educationScore.score,
        experienceScore: experienceScore.score,
        technicalScore: technicalScore.score,
        socialScore: socialScore.score,
        certificationScore: certificationsScore.score,
        breakdown: breakdown as any,
        verificationLevel,
        calculatedAt: new Date()
      },
      update: {
        overallScore,
        educationScore: educationScore.score,
        experienceScore: experienceScore.score,
        technicalScore: technicalScore.score,
        socialScore: socialScore.score,
        certificationScore: certificationsScore.score,
        breakdown: breakdown as any,
        verificationLevel,
        calculatedAt: new Date()
      }
    })

    return {
      overallScore,
      breakdown,
      verificationLevel: verificationLevel as 'basic' | 'verified' | 'premium' | 'elite',
      lastUpdated: new Date()
    }
  } catch (error) {
    console.error('Error calculating credibility score:', error)
    throw error
  }
}

/**
 * Get user's current credibility score from database
 */
export async function getUserCredibilityScore(userId: string): Promise<CredibilityScoreResult | null> {
  try {
    const score = await prisma.credibilityScore.findUnique({
      where: { userId }
    })

    if (!score) {
      // Calculate initial score
      return await calculateCredibilityScore(userId)
    }

    return {
      overallScore: score.overallScore,
      breakdown: score.breakdown as any,
      verificationLevel: score.verificationLevel as 'basic' | 'verified' | 'premium' | 'elite',
      lastUpdated: score.calculatedAt
    }
  } catch (error) {
    console.error('Error fetching credibility score:', error)
    return null
  }
}

function calculateEducationScore(profile: any) {
  const factors: Record<string, number> = {
    'Degree Level': 0,
    'Institution Reputation': 0,
    'Field Relevance': 0,
    'Graduation Year': 0
  }

  // Basic scoring based on profile data
  if (profile?.bio) factors['Degree Level'] = 60
  if (profile?.title) factors['Institution Reputation'] = 65
  factors['Field Relevance'] = 70
  factors['Graduation Year'] = 75

  const avgScore = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length

  return {
    score: Math.round(avgScore),
    weight: 0.25,
    factors
  }
}

function calculateExperienceScore(profile: any, githubProfile: any) {
  const factors: Record<string, number> = {
    'Years of Experience': 0,
    'Role Seniority': 0,
    'Company Size': 0,
    'Industry Relevance': 0
  }

  // Calculate years of experience
  const yearsExp = profile?.yearsExperience || 0
  factors['Years of Experience'] = Math.min(100, yearsExp * 10)

  // Role seniority from title
  if (profile?.title) {
    const title = profile.title.toLowerCase()
    if (title.includes('senior') || title.includes('lead')) {
      factors['Role Seniority'] = 85
    } else if (title.includes('mid') || title.includes('intermediate')) {
      factors['Role Seniority'] = 65
    } else {
      factors['Role Seniority'] = 50
    }
  }

  // GitHub activity as proxy for company engagement
  if (githubProfile) {
    factors['Company Size'] = 70
    factors['Industry Relevance'] = 75
  } else {
    factors['Company Size'] = 40
    factors['Industry Relevance'] = 40
  }

  const avgScore = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length

  return {
    score: Math.round(avgScore),
    weight: 0.30,
    factors
  }
}

function calculateTechnicalScore(skills: any[], githubProfile: any) {
  const factors: Record<string, number> = {
    'Core Skills': 0,
    'Specialized Skills': 0,
    'Project Contributions': 0
  }

  // Core skills based on number of skills
  factors['Core Skills'] = Math.min(100, (skills.length / 20) * 100)

  // Specialized skills based on proficiency
  const avgProficiency = skills.reduce((sum, s) => sum + (s.proficiencyScore || 50), 0) / (skills.length || 1)
  factors['Specialized Skills'] = Math.round(avgProficiency)

  // GitHub contributions
  if (githubProfile) {
    factors['Project Contributions'] = Math.min(100, (githubProfile.totalRepositories || 0) * 5)
  } else {
    factors['Project Contributions'] = 30
  }

  const avgScore = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length

  return {
    score: Math.round(avgScore),
    weight: 0.20,
    factors
  }
}

function calculateSocialScore(githubProfile: any, user: any) {
  const factors: Record<string, number> = {
    'LinkedIn Connections': 0,
    'GitHub Followers': 0,
    'Community Engagement': 0
  }

  // LinkedIn placeholder (not yet implemented)
  factors['LinkedIn Connections'] = 50

  // GitHub followers
  if (githubProfile?.followers) {
    factors['GitHub Followers'] = Math.min(100, githubProfile.followers * 2)
  } else {
    factors['GitHub Followers'] = 30
  }

  // Community engagement (email verified as basic check)
  if (user?.email) {
    factors['Community Engagement'] = 60
  } else {
    factors['Community Engagement'] = 20
  }

  const avgScore = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length

  return {
    score: Math.round(avgScore),
    weight: 0.15,
    factors
  }
}

function calculateCertificationsScore(skills: any[]) {
  const factors: Record<string, number> = {
    'Relevant Certifications': 0,
    'Certification Authority': 0
  }

  // Check for skills marked as certifications or with verification
  const verifiedSkills = skills.filter(s => s.isVerified || s.source === 'certification')
  
  factors['Relevant Certifications'] = Math.min(100, (verifiedSkills.length / 5) * 100)
  factors['Certification Authority'] = verifiedSkills.length > 0 ? 80 : 40

  const avgScore = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length

  return {
    score: Math.round(avgScore),
    weight: 0.10,
    factors
  }
}

function getVerificationLevel(score: number): 'basic' | 'verified' | 'premium' | 'elite' {
  if (score >= 90) return 'elite'
  if (score >= 75) return 'premium'
  if (score >= 60) return 'verified'
  return 'basic'
}
