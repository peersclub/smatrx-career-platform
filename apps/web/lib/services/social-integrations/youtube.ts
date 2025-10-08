/**
 * YouTube Integration Service
 *
 * Fetches and analyzes YouTube channel data for credibility scoring
 *
 * Features:
 * - YouTube Data API v3 integration
 * - Channel statistics (subscribers, views, videos)
 * - Video engagement analysis
 * - Content consistency tracking
 * - Influence calculation for content creators
 *
 * API Requirements:
 * - YouTube Data API v3 enabled in Google Cloud Console
 * - OAuth 2.0 credentials OR API key
 */

import { prisma } from '@/lib/prisma'

export interface YouTubeChannel {
  id: string
  title: string
  description: string
  customUrl?: string
  thumbnailUrl: string
  country?: string
  publishedAt: Date
}

export interface YouTubeMetrics {
  subscriberCount: number
  viewCount: number
  videoCount: number
  hiddenSubscriberCount: boolean
}

export interface YouTubeVideoAnalysis {
  totalVideos: number
  avgViews: number
  avgLikes: number
  avgComments: number
  avgEngagement: number
  uploadFrequency: number // videos per month
  consistencyScore: number // 0-100
  recentVideos: Array<{
    id: string
    title: string
    views: number
    likes: number
    comments: number
    publishedAt: Date
  }>
}

export interface YouTubeAnalytics {
  channel: YouTubeChannel
  metrics: YouTubeMetrics
  videoAnalysis: YouTubeVideoAnalysis
  engagementRate: number
  influenceScore: number
  contentScore?: number
}

/**
 * Fetch YouTube channel info using access token or API key
 */
export async function fetchYouTubeChannel(
  accessTokenOrApiKey: string,
  isAccessToken: boolean = true
): Promise<YouTubeChannel> {
  const authParam = isAccessToken
    ? `access_token=${accessTokenOrApiKey}`
    : `key=${accessTokenOrApiKey}`

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true&${authParam}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`YouTube API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()

  if (!data.items || data.items.length === 0) {
    throw new Error('No YouTube channel found for this account')
  }

  const channel = data.items[0]
  const snippet = channel.snippet

  return {
    id: channel.id,
    title: snippet.title,
    description: snippet.description,
    customUrl: snippet.customUrl,
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
    country: snippet.country,
    publishedAt: new Date(snippet.publishedAt)
  }
}

/**
 * Fetch YouTube channel statistics
 */
export async function fetchYouTubeStatistics(
  channelId: string,
  accessTokenOrApiKey: string,
  isAccessToken: boolean = true
): Promise<YouTubeMetrics> {
  const authParam = isAccessToken
    ? `access_token=${accessTokenOrApiKey}`
    : `key=${accessTokenOrApiKey}`

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&${authParam}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`YouTube API error: ${response.status} - ${error.error?.message}`)
  }

  const data = await response.json()
  const stats = data.items[0]?.statistics

  if (!stats) {
    throw new Error('No statistics available for this channel')
  }

  return {
    subscriberCount: parseInt(stats.subscriberCount || '0'),
    viewCount: parseInt(stats.viewCount || '0'),
    videoCount: parseInt(stats.videoCount || '0'),
    hiddenSubscriberCount: stats.hiddenSubscriberCount || false
  }
}

/**
 * Fetch recent YouTube videos
 */
export async function fetchYouTubeVideos(
  channelId: string,
  accessTokenOrApiKey: string,
  isAccessToken: boolean = true,
  limit: number = 50
): Promise<any[]> {
  const authParam = isAccessToken
    ? `access_token=${accessTokenOrApiKey}`
    : `key=${accessTokenOrApiKey}`

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${limit}&${authParam}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`YouTube API error: ${response.status} - ${error.error?.message}`)
  }

  const searchData = await response.json()
  const videoIds = searchData.items?.map((item: any) => item.id.videoId).join(',')

  if (!videoIds) {
    return []
  }

  // Fetch video statistics
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&${authParam}`
  )

  if (!statsResponse.ok) {
    return []
  }

  const statsData = await statsResponse.json()
  return statsData.items || []
}

/**
 * Analyze YouTube videos for engagement and content patterns
 */
export function analyzeYouTubeVideos(videos: any[]): YouTubeVideoAnalysis {
  if (videos.length === 0) {
    return {
      totalVideos: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      avgEngagement: 0,
      uploadFrequency: 0,
      consistencyScore: 0,
      recentVideos: []
    }
  }

  // Calculate averages
  const totalViews = videos.reduce((sum, v) => sum + parseInt(v.statistics.viewCount || '0'), 0)
  const totalLikes = videos.reduce((sum, v) => sum + parseInt(v.statistics.likeCount || '0'), 0)
  const totalComments = videos.reduce((sum, v) => sum + parseInt(v.statistics.commentCount || '0'), 0)

  const avgViews = Math.round(totalViews / videos.length)
  const avgLikes = Math.round(totalLikes / videos.length)
  const avgComments = Math.round(totalComments / videos.length)
  const avgEngagement = avgLikes + avgComments

  // Calculate upload frequency (videos per month)
  const timestamps = videos
    .map(v => new Date(v.snippet.publishedAt).getTime())
    .sort((a, b) => b - a)

  const timeSpanMonths = timestamps.length > 1
    ? (timestamps[0] - timestamps[timestamps.length - 1]) / (1000 * 60 * 60 * 24 * 30)
    : 1

  const uploadFrequency = videos.length / timeSpanMonths

  // Calculate consistency score
  const consistencyScore = calculateUploadConsistency(timestamps)

  // Get recent videos
  const recentVideos = videos.slice(0, 10).map(v => ({
    id: v.id,
    title: v.snippet.title,
    views: parseInt(v.statistics.viewCount || '0'),
    likes: parseInt(v.statistics.likeCount || '0'),
    comments: parseInt(v.statistics.commentCount || '0'),
    publishedAt: new Date(v.snippet.publishedAt)
  }))

  return {
    totalVideos: videos.length,
    avgViews,
    avgLikes,
    avgComments,
    avgEngagement,
    uploadFrequency: Math.round(uploadFrequency * 10) / 10,
    consistencyScore,
    recentVideos
  }
}

/**
 * Calculate upload consistency score (0-100)
 */
function calculateUploadConsistency(timestamps: number[]): number {
  if (timestamps.length < 3) return 0

  // Calculate gaps between uploads
  const gaps: number[] = []
  for (let i = 0; i < timestamps.length - 1; i++) {
    gaps.push(timestamps[i] - timestamps[i + 1])
  }

  // Calculate standard deviation
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length
  const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length
  const stdDev = Math.sqrt(variance)

  // Lower standard deviation = higher consistency
  const coefficientOfVariation = avgGap > 0 ? stdDev / avgGap : 1

  // Convert to 0-100 score
  const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 50))

  return Math.min(100, Math.round(consistencyScore))
}

/**
 * Calculate YouTube engagement rate
 */
export function calculateEngagementRate(
  videoAnalysis: YouTubeVideoAnalysis,
  subscriberCount: number
): number {
  if (subscriberCount === 0 || videoAnalysis.avgEngagement === 0) return 0

  // YouTube engagement = (avg likes + avg comments) / subscriber count * 100
  const engagementRate = (videoAnalysis.avgEngagement / subscriberCount) * 100
  return Math.min(100, engagementRate)
}

/**
 * Calculate YouTube influence score (0-100)
 *
 * Factors:
 * - Subscriber count (weighted logarithmically)
 * - Total view count
 * - Engagement rate (likes + comments per video)
 * - Upload consistency
 * - Video count (content volume)
 * - Views-per-subscriber ratio (content quality)
 */
export function calculateInfluenceScore(
  channel: YouTubeChannel,
  metrics: YouTubeMetrics,
  videoAnalysis: YouTubeVideoAnalysis,
  engagementRate: number
): number {
  // Subscriber score (logarithmic, max 30 points)
  const subscriberScore = Math.min(30, Math.log10(metrics.subscriberCount + 1) * 6)

  // Total views score (logarithmic, max 20 points)
  const viewScore = Math.min(20, Math.log10(metrics.viewCount + 1) * 2)

  // Engagement score (max 20 points)
  const engagementScore = Math.min(20, engagementRate * 4)

  // Upload consistency score (max 15 points)
  const consistencyScore = (videoAnalysis.consistencyScore / 100) * 15

  // Video count score (max 10 points, encourages regular content)
  const videoCountScore = Math.min(10, Math.log10(metrics.videoCount + 1) * 3)

  // Views-per-subscriber ratio (max 5 points, indicates content quality)
  const viewsPerSub = metrics.subscriberCount > 0
    ? metrics.viewCount / metrics.subscriberCount
    : 0
  const qualityScore = Math.min(5, Math.log10(viewsPerSub + 1) * 2)

  const totalScore =
    subscriberScore +
    viewScore +
    engagementScore +
    consistencyScore +
    videoCountScore +
    qualityScore

  return Math.min(100, Math.round(totalScore))
}

/**
 * Complete YouTube analytics fetch and analysis
 */
export async function getYouTubeAnalytics(
  accessTokenOrApiKey: string,
  isAccessToken: boolean = true
): Promise<YouTubeAnalytics> {
  // Fetch channel
  const channel = await fetchYouTubeChannel(accessTokenOrApiKey, isAccessToken)

  // Fetch statistics
  const metrics = await fetchYouTubeStatistics(channel.id, accessTokenOrApiKey, isAccessToken)

  // Fetch recent videos
  const videos = await fetchYouTubeVideos(channel.id, accessTokenOrApiKey, isAccessToken, 50)

  // Analyze videos
  const videoAnalysis = analyzeYouTubeVideos(videos)

  // Calculate engagement rate
  const engagementRate = calculateEngagementRate(videoAnalysis, metrics.subscriberCount)

  // Calculate influence score
  const influenceScore = calculateInfluenceScore(channel, metrics, videoAnalysis, engagementRate)

  return {
    channel,
    metrics,
    videoAnalysis,
    engagementRate: Math.round(engagementRate * 100) / 100,
    influenceScore
  }
}

/**
 * Save or update YouTube profile in database
 */
export async function saveYouTubeProfile(userId: string, analytics: YouTubeAnalytics) {
  const { channel, metrics, videoAnalysis, engagementRate, influenceScore, contentScore } = analytics

  const profileUrl = channel.customUrl
    ? `https://youtube.com/${channel.customUrl}`
    : `https://youtube.com/channel/${channel.id}`

  return prisma.socialProfile.upsert({
    where: {
      userId_platform: {
        userId,
        platform: 'youtube'
      }
    },
    create: {
      userId,
      platform: 'youtube',
      username: channel.customUrl || channel.id,
      profileUrl,
      verified: false, // YouTube verification is channel-specific
      followerCount: metrics.subscriberCount,
      followingCount: 0, // Not applicable to YouTube
      engagementRate,
      contentScore,
      influenceScore,
      lastFetchedAt: new Date(),
      metrics: {
        channelId: channel.id,
        channelTitle: channel.title,
        videoCount: metrics.videoCount,
        totalViews: metrics.viewCount,
        hiddenSubscribers: metrics.hiddenSubscriberCount,
        avgViews: videoAnalysis.avgViews,
        avgLikes: videoAnalysis.avgLikes,
        avgComments: videoAnalysis.avgComments,
        uploadFrequency: videoAnalysis.uploadFrequency,
        consistencyScore: videoAnalysis.consistencyScore,
        accountAge: Math.floor((Date.now() - channel.publishedAt.getTime()) / (1000 * 60 * 60 * 24 * 365)),
        description: channel.description,
        country: channel.country,
        thumbnailUrl: channel.thumbnailUrl
      }
    },
    update: {
      username: channel.customUrl || channel.id,
      profileUrl,
      followerCount: metrics.subscriberCount,
      engagementRate,
      contentScore,
      influenceScore,
      lastFetchedAt: new Date(),
      metrics: {
        channelId: channel.id,
        channelTitle: channel.title,
        videoCount: metrics.videoCount,
        totalViews: metrics.viewCount,
        hiddenSubscribers: metrics.hiddenSubscriberCount,
        avgViews: videoAnalysis.avgViews,
        avgLikes: videoAnalysis.avgLikes,
        avgComments: videoAnalysis.avgComments,
        uploadFrequency: videoAnalysis.uploadFrequency,
        consistencyScore: videoAnalysis.consistencyScore,
        accountAge: Math.floor((Date.now() - channel.publishedAt.getTime()) / (1000 * 60 * 60 * 24 * 365)),
        description: channel.description,
        country: channel.country,
        thumbnailUrl: channel.thumbnailUrl
      }
    }
  })
}

/**
 * Sync YouTube data for a user
 */
export async function syncYouTubeData(userId: string, accessToken: string): Promise<void> {
  try {
    // Update sync status to 'syncing'
    await prisma.dataSourceSync.upsert({
      where: {
        userId_source: {
          userId,
          source: 'youtube'
        }
      },
      create: {
        userId,
        source: 'youtube',
        status: 'syncing',
        syncFrequency: 'daily'
      },
      update: {
        status: 'syncing'
      }
    })

    // Fetch and analyze YouTube data
    const analytics = await getYouTubeAnalytics(accessToken, true)

    // Save to database
    await saveYouTubeProfile(userId, analytics)

    // Update sync status to 'completed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'youtube'
        }
      },
      data: {
        status: 'completed',
        lastSyncAt: new Date(),
        nextSyncAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        error: null
      }
    })

    console.log(`✓ YouTube sync completed for user ${userId}`)
  } catch (error) {
    console.error('YouTube sync error:', error)

    // Update sync status to 'failed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'youtube'
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
