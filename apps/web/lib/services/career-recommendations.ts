/**
 * AI-Powered Career Recommendation Service
 *
 * Generates personalized career suggestions based on:
 * - User's verified skills and experience
 * - Current career goals
 * - Market demand and trends
 * - Skill gaps and learning recommendations
 *
 * Suggests specific resources:
 * - Coursera courses
 * - Tools to learn (Figma, Python, Excel, etc.)
 * - Certifications
 * - Projects to build
 */

import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

// Lazy-load OpenAI client to avoid build-time initialization
let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
  return openaiClient
}

export interface SkillGap {
  skill: string
  currentLevel: string | null
  requiredLevel: string
  priority: 'critical' | 'important' | 'nice-to-have'
  timeToLearn: string
}

export interface LearningResource {
  type: 'course' | 'certification' | 'tool' | 'book' | 'project'
  platform: string
  title: string
  url?: string
  provider: string
  duration: string
  cost: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skillsGained: string[]
  relevanceScore: number
}

export interface CareerRecommendation {
  role: string
  readinessScore: number // 0-100
  estimatedTime: string // "3 months", "1 year"
  estimatedWeeks: number
  skillGaps: SkillGap[]
  matchingSkills: Array<{ skill: string; level: string; source: string }>
  resources: LearningResource[]
  reasoning: string
  priority: number // 1-5
  confidence: number // AI confidence 0-100
}

/**
 * Aggregate all user skills from multiple sources
 */
async function aggregateUserSkills(userId: string) {
  const [userSkills, githubProfile, certifications] = await Promise.all([
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }
    }),
    prisma.gitHubProfile.findUnique({ where: { userId } }),
    prisma.certification.findMany({ where: { userId } })
  ])

  const skills = userSkills.map(us => ({
    name: us.skill.name,
    level: us.level,
    source: us.source,
    proficiency: us.proficiencyScore || 0,
    yearsExperience: us.yearsExperience || 0
  }))

  // Add GitHub languages as skills if not already present
  if (githubProfile) {
    const languages = githubProfile.languagesUsed as Record<string, number> || {}
    Object.entries(languages).forEach(([lang, percentage]) => {
      if (!skills.find(s => s.name.toLowerCase() === lang.toLowerCase())) {
        skills.push({
          name: lang,
          level: percentage > 30 ? 'advanced' : percentage > 15 ? 'intermediate' : 'beginner',
          source: 'github',
          proficiency: Math.min(100, percentage * 2),
          yearsExperience: 0
        })
      }
    })
  }

  // Add certification skills
  certifications.forEach(cert => {
    cert.skillsEarned.forEach(skillName => {
      if (!skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
        skills.push({
          name: skillName,
          level: 'intermediate',
          source: 'certification',
          proficiency: 70,
          yearsExperience: 0
        })
      }
    })
  })

  return skills
}

/**
 * Get user profile summary
 */
async function getUserSummary(userId: string) {
  const [profile, education, experience] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.educationRecord.findMany({ where: { userId } }),
    prisma.profile.findUnique({ where: { userId } })
  ])

  return {
    currentRole: profile?.title || 'Not specified',
    yearsExperience: profile?.yearsExperience || 0,
    careerStage: profile?.careerStage || 'entry',
    industries: profile?.industries || [],
    education: education.map(e => ({
      degree: e.degree,
      field: e.field,
      institution: e.institutionName
    })),
    targetRole: profile?.targetRole,
    timeline: profile?.careerTimeline
  }
}

/**
 * Generate career recommendations using OpenAI
 */
export async function generateCareerRecommendations(userId: string): Promise<CareerRecommendation[]> {
  // Gather user data
  const [skills, summary, goals] = await Promise.all([
    aggregateUserSkills(userId),
    getUserSummary(userId),
    prisma.careerGoal.findMany({ where: { userId, status: 'active' } })
  ])

  // Build AI prompt
  const prompt = `
You are a career advisor AI. Based on the user's profile, generate 5 personalized career path recommendations.

User Profile:
- Current Role: ${summary.currentRole}
- Years of Experience: ${summary.yearsExperience}
- Career Stage: ${summary.careerStage}
- Industries: ${summary.industries.join(', ') || 'Not specified'}
- Education: ${summary.education.map(e => `${e.degree} in ${e.field} from ${e.institution}`).join('; ')}

Current Skills:
${skills.map(s => `- ${s.name} (${s.level}, proficiency: ${s.proficiency}%, source: ${s.source})`).join('\n')}

Career Goals:
${goals.map(g => `- ${g.title}: ${g.description || 'No description'}`).join('\n') || 'Not specified'}

For each recommended career path, provide:
1. Role title
2. Readiness score (0-100) - how ready they are for this role now
3. Estimated time to be ready (in weeks)
4. Critical skill gaps they need to fill
5. Skills they already have that match
6. Top 5 specific learning resources (courses, tools, certifications) with:
   - Exact course/tool names
   - Platform (Coursera, Udemy, LinkedIn Learning, etc.)
   - Estimated duration
   - Cost (Free, $49, $299, etc.)
   - Skills gained
7. Reasoning for why this path makes sense
8. Priority (1-5, where 1 is highest)

Return as JSON array with this structure:
[{
  "role": "string",
  "readinessScore": number,
  "estimatedWeeks": number,
  "skillGaps": [{
    "skill": "string",
    "currentLevel": "beginner|intermediate|advanced|null",
    "requiredLevel": "intermediate|advanced|expert",
    "priority": "critical|important|nice-to-have",
    "timeToLearn": "2 weeks|1 month|3 months"
  }],
  "matchingSkills": [{
    "skill": "string",
    "level": "string",
    "source": "string"
  }],
  "resources": [{
    "type": "course|certification|tool|book|project",
    "platform": "string",
    "title": "string",
    "url": "string (optional)",
    "provider": "string",
    "duration": "string",
    "cost": "string",
    "difficulty": "beginner|intermediate|advanced",
    "skillsGained": ["string"],
    "relevanceScore": number (0-100)
  }],
  "reasoning": "string",
  "priority": number
}]

Focus on realistic, actionable paths. Include specific tools relevant to each role (e.g., Figma for UX, Python for Data Science, Excel for Finance, etc.).
`

  try {
    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career advisor who provides data-driven, personalized career recommendations based on verified skills and experience.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000
    })

    const content = response.choices[0].message.content || '{}'
    const parsed = JSON.parse(content)
    const recommendations = Array.isArray(parsed) ? parsed : (parsed.recommendations || [])

    // Calculate estimated time string and confidence
    const processedRecommendations: CareerRecommendation[] = recommendations.map((rec: any) => ({
      ...rec,
      estimatedTime: weeksToTimeString(rec.estimatedWeeks),
      confidence: calculateConfidence(rec.readinessScore, rec.skillGaps?.length || 0)
    }))

    // Save recommendations to database
    await Promise.all(
      processedRecommendations.map(rec =>
        prisma.careerSuggestion.create({
          data: {
            userId,
            role: rec.role,
            readinessScore: rec.readinessScore,
            estimatedTime: rec.estimatedTime,
            estimatedWeeks: rec.estimatedWeeks,
            skillGaps: (rec.skillGaps || []) as any,
            matchingSkills: (rec.matchingSkills || []) as any,
            resources: (rec.resources || []) as any,
            reasoning: rec.reasoning,
            priority: rec.priority,
            status: 'active',
            aiModel: 'gpt-4-turbo-preview',
            confidence: rec.confidence
          }
        })
      )
    )

    // Also save resource recommendations
    for (const rec of processedRecommendations) {
      const suggestion = await prisma.careerSuggestion.findFirst({
        where: { userId, role: rec.role },
        orderBy: { createdAt: 'desc' }
      })

      if (suggestion && rec.resources) {
        await Promise.all(
          rec.resources.map((resource: LearningResource) =>
            prisma.resourceRecommendation.create({
              data: {
                userId,
                careerSuggestionId: suggestion.id,
                type: resource.type,
                platform: resource.platform,
                title: resource.title,
                url: resource.url,
                provider: resource.provider,
                duration: resource.duration,
                cost: resource.cost,
                difficulty: resource.difficulty,
                skillsGained: resource.skillsGained,
                relevanceScore: resource.relevanceScore,
                status: 'suggested'
              }
            })
          )
        )
      }
    }

    return processedRecommendations
  } catch (error) {
    console.error('Error generating career recommendations:', error)
    throw error
  }
}

/**
 * Get user's career suggestions (from DB or generate new)
 */
export async function getUserCareerSuggestions(userId: string, forceRegenerate = false): Promise<CareerRecommendation[]> {
  if (!forceRegenerate) {
    const existing = await prisma.careerSuggestion.findMany({
      where: { userId, status: { not: 'dismissed' } },
      include: {
        resourceRecommendations: true
      },
      orderBy: [
        { priority: 'asc' },
        { readinessScore: 'desc' }
      ],
      take: 5
    })

    if (existing.length > 0) {
      return existing.map(s => ({
        role: s.role,
        readinessScore: s.readinessScore,
        estimatedTime: s.estimatedTime || weeksToTimeString(s.estimatedWeeks || 0),
        estimatedWeeks: s.estimatedWeeks || 0,
        skillGaps: s.skillGaps as any as SkillGap[],
        matchingSkills: s.matchingSkills as any[],
        resources: s.resourceRecommendations.map(r => ({
          type: r.type as any,
          platform: r.platform,
          title: r.title,
          url: r.url || undefined,
          provider: r.provider || '',
          duration: r.duration || '',
          cost: r.cost || '',
          difficulty: (r.difficulty || 'intermediate') as any,
          skillsGained: r.skillsGained,
          relevanceScore: r.relevanceScore || 0
        })),
        reasoning: s.reasoning || '',
        priority: s.priority,
        confidence: s.confidence || 0
      }))
    }
  }

  // Generate new recommendations
  return generateCareerRecommendations(userId)
}

/**
 * Update suggestion status (pursuing, achieved, dismissed)
 */
export async function updateSuggestionStatus(
  suggestionId: string,
  status: 'active' | 'pursuing' | 'achieved' | 'dismissed'
) {
  return prisma.careerSuggestion.update({
    where: { id: suggestionId },
    data: { status }
  })
}

/**
 * Mark resource as bookmarked, in-progress, or completed
 */
export async function updateResourceStatus(
  resourceId: string,
  status: 'suggested' | 'bookmarked' | 'in-progress' | 'completed' | 'dismissed'
) {
  return prisma.resourceRecommendation.update({
    where: { id: resourceId },
    data: { status }
  })
}

// Helper functions

function weeksToTimeString(weeks: number): string {
  if (weeks === 0) return 'Ready now'
  if (weeks <= 2) return `${weeks} week${weeks > 1 ? 's' : ''}`
  if (weeks <= 8) return `${Math.ceil(weeks / 4)} month${weeks > 4 ? 's' : ''}`
  if (weeks <= 52) return `${Math.ceil(weeks / 4)} months`
  return `${Math.ceil(weeks / 52)} year${weeks > 52 ? 's' : ''}`
}

function calculateConfidence(readinessScore: number, gapCount: number): number {
  // Higher readiness and fewer gaps = higher confidence
  const readinessFactor = readinessScore * 0.6
  const gapFactor = Math.max(0, 40 - (gapCount * 5))
  return Math.min(100, Math.round(readinessFactor + gapFactor))
}
