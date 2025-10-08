/**
 * Instagram Integration Service
 *
 * Fetches and analyzes Instagram profile data for credibility scoring
 *
 * Features:
 * - Facebook/Instagram OAuth authentication
 * - Profile metrics (followers, posts, engagement)
 * - Content analysis (post types, consistency)
 * - Influence calculation
 * - Visual portfolio tracking (for designers, creators)
 *
 * Note: Instagram Graph API requires Facebook App with Instagram permissions
 */

import { prisma } from '@/lib/prisma'

export interface InstagramProfile {
  id: string
  username: string
  name?: string
  biography?: string
  profilePictureUrl?: string
  website?: string
  accountType: 'PERSONAL' | 'CREATOR' | 'BUSINESS'
  mediaCount: number
}

export interface InstagramMetrics {
  followersCount: number
  followsCount: number
  mediaCount: number
  impressions?: number
  reach?: number
  profileViews?: number
}

export interface InstagramMediaAnalysis {
  totalPosts: number
  avgLikes: number
  avgComments: number
  avgEngagement: number
  postTypes: {
    images: number
    videos: number
    carousels: number
  }
  postingFrequency: number // posts per week
  consistencyScore: number // 0-100
}

export interface InstagramAnalytics {
  profile: InstagramProfile
  metrics: InstagramMetrics
  mediaAnalysis: InstagramMediaAnalysis
  engagementRate: number
  influenceScore: number
  contentScore?: number // AI-assessed visual quality
}

/**
 * Fetch Instagram user profile using access token
 */
export async function fetchInstagramProfile(accessToken: string): Promise<InstagramProfile> {
  const fields = 'id,username,name,biography,profile_picture_url,website,account_type,media_count'

  const response = await fetch(
    `https://graph.instagram.com/me?fields=${fields}&access_token=${accessToken}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Instagram API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()

  return {
    id: data.id,
    username: data.username,
    name: data.name,
    biography: data.biography,
    profilePictureUrl: data.profile_picture_url,
    website: data.website,
    accountType: data.account_type || 'PERSONAL',
    mediaCount: data.media_count || 0
  }
}

/**
 * Fetch Instagram insights (Business/Creator accounts only)
 */
export async function fetchInstagramInsights(
  userId: string,
  accessToken: string
): Promise<Partial<InstagramMetrics>> {
  try {
    const metrics = [
      'follower_count',
      'follows_count',
      'impressions',
      'reach',
      'profile_views'
    ].join(',')

    const response = await fetch(
      `https://graph.instagram.com/${userId}/insights?metric=${metrics}&period=day&access_token=${accessToken}`
    )

    if (!response.ok) {
      // Insights may not be available for personal accounts
      console.warn('Instagram insights not available (may be personal account)')
      return {}
    }

    const data = await response.json()
    const insights: any = {}

    data.data?.forEach((metric: any) => {
      const value = metric.values?.[0]?.value
      if (value !== undefined) {
        insights[metric.name] = value
      }
    })

    return {
      followersCount: insights.follower_count,
      followsCount: insights.follows_count,
      impressions: insights.impressions,
      reach: insights.reach,
      profileViews: insights.profile_views
    }
  } catch (error) {
    console.warn('Error fetching Instagram insights:', error)
    return {}
  }
}

/**
 * Fetch recent Instagram media posts
 */
export async function fetchInstagramMedia(userId: string, accessToken: string, limit = 50) {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'

  const response = await fetch(
    `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Instagram API error: ${response.status} - ${error.error?.message}`)
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Analyze Instagram media for engagement and content patterns
 */
export function analyzeInstagramMedia(media: any[]): InstagramMediaAnalysis {
  if (media.length === 0) {
    return {
      totalPosts: 0,
      avgLikes: 0,
      avgComments: 0,
      avgEngagement: 0,
      postTypes: { images: 0, videos: 0, carousels: 0 },
      postingFrequency: 0,
      consistencyScore: 0
    }
  }

  // Calculate average engagement
  const totalLikes = media.reduce((sum, post) => sum + (post.like_count || 0), 0)
  const totalComments = media.reduce((sum, post) => sum + (post.comments_count || 0), 0)
  const avgLikes = totalLikes / media.length
  const avgComments = totalComments / media.length
  const avgEngagement = avgLikes + avgComments

  // Categorize post types
  const postTypes = media.reduce((acc, post) => {
    if (post.media_type === 'IMAGE') acc.images++
    else if (post.media_type === 'VIDEO') acc.videos++
    else if (post.media_type === 'CAROUSEL_ALBUM') acc.carousels++
    return acc
  }, { images: 0, videos: 0, carousels: 0 })

  // Calculate posting frequency (posts per week)
  const timestamps = media
    .map(p => new Date(p.timestamp).getTime())
    .sort((a, b) => b - a)

  const timeSpanDays = timestamps.length > 1
    ? (timestamps[0] - timestamps[timestamps.length - 1]) / (1000 * 60 * 60 * 24)
    : 7

  const postingFrequency = (media.length / timeSpanDays) * 7

  // Calculate consistency score based on posting regularity
  const consistencyScore = calculateConsistencyScore(timestamps)

  return {
    totalPosts: media.length,
    avgLikes: Math.round(avgLikes),
    avgComments: Math.round(avgComments),
    avgEngagement: Math.round(avgEngagement),
    postTypes,
    postingFrequency: Math.round(postingFrequency * 10) / 10,
    consistencyScore
  }
}

/**
 * Calculate posting consistency score (0-100)
 */
function calculateConsistencyScore(timestamps: number[]): number {
  if (timestamps.length < 2) return 0

  // Calculate gaps between posts
  const gaps: number[] = []
  for (let i = 0; i < timestamps.length - 1; i++) {
    gaps.push(timestamps[i] - timestamps[i + 1])
  }

  // Calculate standard deviation of gaps
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length
  const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length
  const stdDev = Math.sqrt(variance)

  // Lower standard deviation = higher consistency
  const coefficientOfVariation = stdDev / avgGap

  // Convert to 0-100 score (inverse relationship)
  const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 50))

  return Math.min(100, Math.round(consistencyScore))
}

/**
 * Calculate Instagram engagement rate
 */
export function calculateEngagementRate(
  mediaAnalysis: InstagramMediaAnalysis,
  followersCount: number
): number {
  if (followersCount === 0 || mediaAnalysis.avgEngagement === 0) return 0

  const engagementRate = (mediaAnalysis.avgEngagement / followersCount) * 100
  return Math.min(100, engagementRate)
}

/**
 * Calculate Instagram influence score (0-100)
 *
 * Factors:
 * - Follower count (weighted logarithmically)
 * - Engagement rate
 * - Follower-to-following ratio
 * - Content consistency
 * - Account type (Creator/Business bonus)
 * - Posting frequency
 */
export function calculateInfluenceScore(
  profile: InstagramProfile,
  metrics: InstagramMetrics,
  mediaAnalysis: InstagramMediaAnalysis,
  engagementRate: number
): number {
  // Follower score (logarithmic, max 35 points)
  const followerScore = Math.min(35, Math.log10((metrics.followersCount || 0) + 1) * 7)

  // Engagement score (max 25 points)
  // Instagram typically has higher engagement than Twitter, so we adjust the multiplier
  const engagementScore = Math.min(25, engagementRate * 5)

  // Follower-to-following ratio score (max 15 points)
  const ratio = (metrics.followsCount || 1) > 0
    ? (metrics.followersCount || 0) / (metrics.followsCount || 1)
    : 0
  const ratioScore = Math.min(15, Math.log10(ratio + 1) * 10)

  // Content consistency score (max 10 points)
  const consistencyScore = (mediaAnalysis.consistencyScore / 100) * 10

  // Account type bonus (max 10 points)
  let accountTypeScore = 0
  if (profile.accountType === 'CREATOR') accountTypeScore = 8
  if (profile.accountType === 'BUSINESS') accountTypeScore = 10

  // Posting frequency score (max 5 points)
  // Ideal: 3-7 posts per week
  const idealFrequency = 5
  const frequencyDiff = Math.abs(mediaAnalysis.postingFrequency - idealFrequency)
  const frequencyScore = Math.max(0, 5 - frequencyDiff)

  const totalScore =
    followerScore +
    engagementScore +
    ratioScore +
    consistencyScore +
    accountTypeScore +
    frequencyScore

  return Math.min(100, Math.round(totalScore))
}

/**
 * Complete Instagram analytics fetch and analysis
 */
export async function getInstagramAnalytics(
  accessToken: string
): Promise<InstagramAnalytics> {
  // Fetch profile
  const profile = await fetchInstagramProfile(accessToken)

  // Fetch insights (may fail for personal accounts)
  const insights = await fetchInstagramInsights(profile.id, accessToken)

  // Fetch recent media
  const media = await fetchInstagramMedia(profile.id, accessToken, 50)

  // Analyze media
  const mediaAnalysis = analyzeInstagramMedia(media)

  // Combine metrics
  const metrics: InstagramMetrics = {
    followersCount: insights.followersCount || 0,
    followsCount: insights.followsCount || 0,
    mediaCount: profile.mediaCount,
    impressions: insights.impressions,
    reach: insights.reach,
    profileViews: insights.profileViews
  }

  // Calculate engagement rate
  const engagementRate = calculateEngagementRate(mediaAnalysis, metrics.followersCount)

  // Calculate influence score
  const influenceScore = calculateInfluenceScore(profile, metrics, mediaAnalysis, engagementRate)

  return {
    profile,
    metrics,
    mediaAnalysis,
    engagementRate: Math.round(engagementRate * 100) / 100,
    influenceScore
  }
}

/**
 * Save or update Instagram profile in database
 */
export async function saveInstagramProfile(userId: string, analytics: InstagramAnalytics) {
  const { profile, metrics, mediaAnalysis, engagementRate, influenceScore, contentScore } = analytics

  return prisma.socialProfile.upsert({
    where: {
      userId_platform: {
        userId,
        platform: 'instagram'
      }
    },
    create: {
      userId,
      platform: 'instagram',
      username: profile.username,
      profileUrl: `https://instagram.com/${profile.username}`,
      verified: profile.accountType === 'BUSINESS' || profile.accountType === 'CREATOR',
      followerCount: metrics.followersCount,
      followingCount: metrics.followsCount,
      engagementRate,
      contentScore,
      influenceScore,
      lastFetchedAt: new Date(),
      metrics: {
        accountType: profile.accountType,
        mediaCount: metrics.mediaCount,
        impressions: metrics.impressions,
        reach: metrics.reach,
        profileViews: metrics.profileViews,
        avgLikes: mediaAnalysis.avgLikes,
        avgComments: mediaAnalysis.avgComments,
        postTypes: mediaAnalysis.postTypes,
        postingFrequency: mediaAnalysis.postingFrequency,
        consistencyScore: mediaAnalysis.consistencyScore,
        bio: profile.biography,
        website: profile.website,
        profilePictureUrl: profile.profilePictureUrl
      }
    },
    update: {
      username: profile.username,
      profileUrl: `https://instagram.com/${profile.username}`,
      verified: profile.accountType === 'BUSINESS' || profile.accountType === 'CREATOR',
      followerCount: metrics.followersCount,
      followingCount: metrics.followsCount,
      engagementRate,
      contentScore,
      influenceScore,
      lastFetchedAt: new Date(),
      metrics: {
        accountType: profile.accountType,
        mediaCount: metrics.mediaCount,
        impressions: metrics.impressions,
        reach: metrics.reach,
        profileViews: metrics.profileViews,
        avgLikes: mediaAnalysis.avgLikes,
        avgComments: mediaAnalysis.avgComments,
        postTypes: mediaAnalysis.postTypes,
        postingFrequency: mediaAnalysis.postingFrequency,
        consistencyScore: mediaAnalysis.consistencyScore,
        bio: profile.biography,
        website: profile.website,
        profilePictureUrl: profile.profilePictureUrl
      }
    }
  })
}

/**
 * Sync Instagram data for a user
 */
export async function syncInstagramData(userId: string, accessToken: string): Promise<void> {
  try {
    // Update sync status to 'syncing'
    await prisma.dataSourceSync.upsert({
      where: {
        userId_source: {
          userId,
          source: 'instagram'
        }
      },
      create: {
        userId,
        source: 'instagram',
        status: 'syncing',
        syncFrequency: 'daily'
      },
      update: {
        status: 'syncing'
      }
    })

    // Fetch and analyze Instagram data
    const analytics = await getInstagramAnalytics(accessToken)

    // Save to database
    await saveInstagramProfile(userId, analytics)

    // Update sync status to 'completed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'instagram'
        }
      },
      data: {
        status: 'completed',
        lastSyncAt: new Date(),
        nextSyncAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        error: null
      }
    })

    console.log(`✓ Instagram sync completed for user ${userId}`)
  } catch (error) {
    console.error('Instagram sync error:', error)

    // Update sync status to 'failed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'instagram'
        }
      },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })

    throw error
  }
}
