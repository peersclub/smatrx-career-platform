import { auth } from '@/lib/auth-helpers'
import { syncYouTubeData } from '@/lib/services/social-integrations/youtube'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * POST /api/social/youtube/sync
 * Sync YouTube data for authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Google account with access token (YouTube uses Google OAuth)
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google'
      }
    })

    if (!account || !account.access_token) {
      return NextResponse.json(
        {
          error: 'YouTube account not connected',
          message: 'Please connect your Google account to access YouTube data',
          action: 'connect_google'
        },
        { status: 400 }
      )
    }

    // Trigger sync (async process)
    await syncYouTubeData(session.user.id, account.access_token)

    return NextResponse.json({
      success: true,
      message: 'YouTube data synchronized successfully'
    })
  } catch (error) {
    console.error('YouTube sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync YouTube data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/social/youtube/sync
 * Get YouTube sync status for authenticated user
 */
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get sync status
    const syncStatus = await prisma.dataSourceSync.findUnique({
      where: {
        userId_source: {
          userId: session.user.id,
          source: 'youtube'
        }
      }
    })

    // Get YouTube profile data
    const youtubeProfile = await prisma.socialProfile.findUnique({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: 'youtube'
        }
      }
    })

    return NextResponse.json({
      syncStatus: syncStatus || null,
      profile: youtubeProfile || null,
      isConnected: youtubeProfile !== null
    })
  } catch (error) {
    console.error('Error fetching YouTube sync status:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
