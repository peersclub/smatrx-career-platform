/**
 * Twitter/X Integration Service
 *
 * Fetches and analyzes Twitter profile data for credibility scoring
 *
 * Features:
 * - OAuth 2.0 authentication with PKCE
 * - Profile metrics (followers, following, tweets)
 * - Engagement analysis
 * - Content quality scoring (via AI)
 * - Influence calculation
 */

import { prisma } from '@/lib/prisma'

export interface TwitterProfile {
  id: string
  username: string
  name: string
  profileImageUrl: string
  verified: boolean
  bio?: string
  location?: string
  url?: string
  createdAt: Date
}

export interface TwitterMetrics {
  followersCount: number
  followingCount: number
  tweetCount: number
  listedCount: number // How many lists user is on
  likeCount?: number
  verifiedType?: 'blue' | 'business' | 'government' | 'none'
}

export interface TwitterAnalytics {
  profile: TwitterProfile
  metrics: TwitterMetrics
  engagementRate: number // Calculated engagement percentage
  influenceScore: number // 0-100 based on multiple factors
  contentScore?: number // AI-assessed content quality
}

/**
 * Fetch Twitter user data using OAuth access token
 */
export async function fetchTwitterProfile(accessToken: string): Promise<TwitterProfile> {
  const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,verified,verified_type,description,location,url,created_at', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const user = data.data

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    profileImageUrl: user.profile_image_url,
    verified: user.verified || user.verified_type !== 'none',
    bio: user.description,
    location: user.location,
    url: user.url,
    createdAt: new Date(user.created_at)
  }
}

/**
 * Fetch Twitter user metrics
 */
export async function fetchTwitterMetrics(userId: string, accessToken: string): Promise<TwitterMetrics> {
  const response = await fetch(
    `https://api.twitter.com/2/users/${userId}?user.fields=public_metrics,verified_type`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const metrics = data.data.public_metrics
  const verifiedType = data.data.verified_type

  return {
    followersCount: metrics.followers_count,
    followingCount: metrics.following_count,
    tweetCount: metrics.tweet_count,
    listedCount: metrics.listed_count,
    verifiedType: verifiedType === 'none' ? 'none' : verifiedType
  }
}

/**
 * Fetch recent tweets for engagement analysis
 */
export async function fetchRecentTweets(userId: string, accessToken: string, limit = 100) {
  const response = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=${limit}&tweet.fields=public_metrics,created_at`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Calculate engagement rate from recent tweets
 */
export function calculateEngagementRate(tweets: any[], followersCount: number): number {
  if (tweets.length === 0 || followersCount === 0) return 0

  const totalEngagement = tweets.reduce((sum, tweet) => {
    const metrics = tweet.public_metrics
    return sum + (metrics.like_count + metrics.retweet_count + metrics.reply_count + metrics.quote_count)
  }, 0)

  const avgEngagementPerTweet = totalEngagement / tweets.length
  const engagementRate = (avgEngagementPerTweet / followersCount) * 100

  return Math.min(100, engagementRate) // Cap at 100%
}

/**
 * Calculate Twitter influence score (0-100)
 *
 * Factors:
 * - Follower count (weighted logarithmically)
 * - Engagement rate
 * - Follower-to-following ratio
 * - Verification status
 * - Account age
 * - Listed count (how many lists)
 */
export function calculateInfluenceScore(
  metrics: TwitterMetrics,
  engagementRate: number,
  accountAge: number, // in years
  profile: TwitterProfile
): number {
  // Follower score (logarithmic, max 35 points)
  const followerScore = Math.min(35, Math.log10(metrics.followersCount + 1) * 7)

  // Engagement score (max 25 points)
  const engagementScore = Math.min(25, engagementRate * 2.5)

  // Follower-to-following ratio score (max 15 points)
  const ratio = metrics.followingCount > 0 ? metrics.followersCount / metrics.followingCount : 0
  const ratioScore = Math.min(15, Math.log10(ratio + 1) * 10)

  // Verification bonus (max 15 points)
  let verificationScore = 0
  if (metrics.verifiedType === 'blue') verificationScore = 10
  if (metrics.verifiedType === 'business') verificationScore = 12
  if (metrics.verifiedType === 'government') verificationScore = 15
  if (profile.verified && !metrics.verifiedType) verificationScore = 10

  // Account age score (max 5 points, 1 point per year, cap at 5)
  const ageScore = Math.min(5, accountAge)

  // Listed count score (max 5 points)
  const listedScore = Math.min(5, Math.log10(metrics.listedCount + 1) * 2)

  const totalScore = followerScore + engagementScore + ratioScore + verificationScore + ageScore + listedScore

  return Math.min(100, Math.round(totalScore))
}

/**
 * Analyze Twitter content quality using AI (optional, requires OpenAI)
 */
export async function analyzeContentQuality(tweets: any[], openaiApiKey?: string): Promise<number> {
  if (!openaiApiKey || tweets.length === 0) {
    return 0
  }

  try {
    // Extract tweet texts
    const tweetTexts = tweets.slice(0, 50).map(t => t.text).join('\n---\n')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content quality analyst. Analyze the quality of social media content based on clarity, professionalism, value, and engagement potential. Return only a score from 0-100.'
          },
          {
            role: 'user',
            content: `Analyze the quality of these tweets and provide a score (0-100):\n\n${tweetTexts}`
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      })
    })

    const data = await response.json()
    const scoreText = data.choices[0].message.content.trim()
    const score = parseInt(scoreText.match(/\d+/)?.[0] || '0')

    return Math.min(100, Math.max(0, score))
  } catch (error) {
    console.error('Error analyzing Twitter content:', error)
    return 0
  }
}

/**
 * Complete Twitter analytics fetch and analysis
 */
export async function getTwitterAnalytics(
  accessToken: string,
  openaiApiKey?: string
): Promise<TwitterAnalytics> {
  // Fetch profile
  const profile = await fetchTwitterProfile(accessToken)

  // Fetch metrics
  const metrics = await fetchTwitterMetrics(profile.id, accessToken)

  // Fetch recent tweets for engagement analysis
  const tweets = await fetchRecentTweets(profile.id, accessToken, 100)

  // Calculate engagement rate
  const engagementRate = calculateEngagementRate(tweets, metrics.followersCount)

  // Calculate account age
  const accountAgeYears = (Date.now() - profile.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)

  // Calculate influence score
  const influenceScore = calculateInfluenceScore(metrics, engagementRate, accountAgeYears, profile)

  // Optionally analyze content quality with AI
  let contentScore: number | undefined
  if (openaiApiKey) {
    contentScore = await analyzeContentQuality(tweets, openaiApiKey)
  }

  return {
    profile,
    metrics,
    engagementRate: Math.round(engagementRate * 100) / 100, // Round to 2 decimals
    influenceScore,
    contentScore
  }
}

/**
 * Save or update Twitter profile in database
 */
export async function saveTwitterProfile(userId: string, analytics: TwitterAnalytics) {
  const { profile, metrics, engagementRate, influenceScore, contentScore } = analytics

  return prisma.socialProfile.upsert({
    where: {
      userId_platform: {
        userId,
        platform: 'twitter'
      }
    },
    create: {
      userId,
      platform: 'twitter',
      username: profile.username,
      profileUrl: `https://twitter.com/${profile.username}`,
      verified: profile.verified,
      followerCount: metrics.followersCount,
      followingCount: metrics.followingCount,
      engagementRate,
      contentScore,
      influenceScore,
      lastFetchedAt: new Date(),
      metrics: {
        tweetCount: metrics.tweetCount,
        listedCount: metrics.listedCount,
        verifiedType: metrics.verifiedType,
        accountCreatedAt: profile.createdAt.toISOString(),
        bio: profile.bio,
        location: profile.location,
        profileImageUrl: profile.profileImageUrl
      }
    },
    update: {
      username: profile.username,
      profileUrl: `https://twitter.com/${profile.username}`,
      verified: profile.verified,
      followerCount: metrics.followersCount,
      followingCount: metrics.followingCount,
      engagementRate,
      contentScore,
      influenceScore,
      lastFetchedAt: new Date(),
      metrics: {
        tweetCount: metrics.tweetCount,
        listedCount: metrics.listedCount,
        verifiedType: metrics.verifiedType,
        accountCreatedAt: profile.createdAt.toISOString(),
        bio: profile.bio,
        location: profile.location,
        profileImageUrl: profile.profileImageUrl
      }
    }
  })
}

/**
 * Sync Twitter data for a user
 */
export async function syncTwitterData(userId: string, accessToken: string): Promise<void> {
  try {
    // Update sync status to 'syncing'
    await prisma.dataSourceSync.upsert({
      where: {
        userId_source: {
          userId,
          source: 'twitter'
        }
      },
      create: {
        userId,
        source: 'twitter',
        status: 'syncing',
        syncFrequency: 'daily'
      },
      update: {
        status: 'syncing'
      }
    })

    // Fetch and analyze Twitter data
    const openaiKey = process.env.OPENAI_API_KEY
    const analytics = await getTwitterAnalytics(accessToken, openaiKey)

    // Save to database
    await saveTwitterProfile(userId, analytics)

    // Update sync status to 'completed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'twitter'
        }
      },
      data: {
        status: 'completed',
        lastSyncAt: new Date(),
        nextSyncAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        error: null
      }
    })

    console.log(`✓ Twitter sync completed for user ${userId}`)
  } catch (error) {
    console.error('Twitter sync error:', error)

    // Update sync status to 'failed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'twitter'
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
