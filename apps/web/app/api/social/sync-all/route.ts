import { auth } from '@/lib/auth-helpers'
import { syncTwitterData } from '@/lib/services/social-integrations/twitter'
import { syncInstagramData } from '@/lib/services/social-integrations/instagram'
import { syncYouTubeData } from '@/lib/services/social-integrations/youtube'
import { syncGitHubData } from '@/lib/services/social-integrations/github'
import { calculateCredibilityScore } from '@/lib/services/credibility-scoring'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * POST /api/social/sync-all
 * Sync all connected social media platforms and recalculate credibility score
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const results: any = {
      github: { status: 'skipped', reason: 'Not connected' },
      twitter: { status: 'skipped', reason: 'Not connected' },
      instagram: { status: 'skipped', reason: 'Not connected' },
      youtube: { status: 'skipped', reason: 'Not connected' }
    }

    // Get all connected accounts
    const accounts = await prisma.account.findMany({
      where: { userId }
    })

    const accountMap = accounts.reduce((acc, account) => {
      acc[account.provider] = account
      return acc
    }, {} as Record<string, any>)

    // Sync GitHub
    if (accountMap.github?.access_token) {
      try {
        await syncGitHubData(userId, accountMap.github.access_token)
        results.github = { status: 'success', message: 'GitHub data synced successfully' }
      } catch (error) {
        results.github = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Sync Twitter
    if (accountMap.twitter?.access_token) {
      try {
        await syncTwitterData(userId, accountMap.twitter.access_token)
        results.twitter = { status: 'success', message: 'Twitter data synced successfully' }
      } catch (error) {
        results.twitter = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Sync Instagram (via Facebook)
    if (accountMap.facebook?.access_token) {
      try {
        await syncInstagramData(userId, accountMap.facebook.access_token)
        results.instagram = { status: 'success', message: 'Instagram data synced successfully' }
      } catch (error) {
        results.instagram = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Sync YouTube (via Google)
    if (accountMap.google?.access_token) {
      try {
        await syncYouTubeData(userId, accountMap.google.access_token)
        results.youtube = { status: 'success', message: 'YouTube data synced successfully' }
      } catch (error) {
        results.youtube = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Count successful syncs
    const successCount = Object.values(results).filter((r: any) => r.status === 'success').length
    const errorCount = Object.values(results).filter((r: any) => r.status === 'error').length

    // Recalculate credibility score if at least one platform synced successfully
    let credibilityScore = null
    if (successCount > 0) {
      try {
        credibilityScore = await calculateCredibilityScore(userId)
      } catch (error) {
        console.error('Error recalculating credibility score:', error)
      }
    }

    return NextResponse.json({
      success: successCount > 0,
      message: `Synced ${successCount} platform(s) successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      results,
      credibilityScore,
      summary: {
        total: 4,
        synced: successCount,
        failed: errorCount,
        skipped: 4 - successCount - errorCount
      }
    })
  } catch (error) {
    console.error('Sync all error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync social media platforms',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/social/sync-all
 * Get sync status for all social media platforms
 */
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get all social profiles
    const socialProfiles = await prisma.socialProfile.findMany({
      where: { userId }
    })

    // Get all sync statuses
    const syncStatuses = await prisma.dataSourceSync.findMany({
      where: {
        userId,
        source: { in: ['github', 'twitter', 'instagram', 'youtube'] }
      }
    })

    // Get connected accounts
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { provider: true }
    })

    const connectedProviders = accounts.map(a => a.provider)

    // Map sync statuses
    const statusMap = syncStatuses.reduce((acc, status) => {
      acc[status.source] = status
      return acc
    }, {} as Record<string, any>)

    // Map profiles
    const profileMap = socialProfiles.reduce((acc, profile) => {
      acc[profile.platform] = profile
      return acc
    }, {} as Record<string, any>)

    // Get GitHub profile separately
    const githubProfile = await prisma.gitHubProfile.findUnique({
      where: { userId }
    })

    return NextResponse.json({
      platforms: {
        github: {
          connected: connectedProviders.includes('github'),
          synced: !!githubProfile,
          profile: githubProfile || null,
          syncStatus: statusMap.github || null
        },
        twitter: {
          connected: connectedProviders.includes('twitter'),
          synced: !!profileMap.twitter,
          profile: profileMap.twitter || null,
          syncStatus: statusMap.twitter || null
        },
        instagram: {
          connected: connectedProviders.includes('facebook'),
          synced: !!profileMap.instagram,
          profile: profileMap.instagram || null,
          syncStatus: statusMap.instagram || null
        },
        youtube: {
          connected: connectedProviders.includes('google'),
          synced: !!profileMap.youtube,
          profile: profileMap.youtube || null,
          syncStatus: statusMap.youtube || null
        }
      },
      summary: {
        totalPlatforms: 4,
        connected: [
          connectedProviders.includes('github'),
          connectedProviders.includes('twitter'),
          connectedProviders.includes('facebook'),
          connectedProviders.includes('google')
        ].filter(Boolean).length,
        synced: Object.keys(profileMap).length + (githubProfile ? 1 : 0)
      }
    })
  } catch (error) {
    console.error('Error fetching sync statuses:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sync statuses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
