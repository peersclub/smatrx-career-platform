import { auth } from '@/lib/auth-helpers'
import { syncTwitterData } from '@/lib/services/social-integrations/twitter'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * POST /api/social/twitter/sync
 * Sync Twitter data for authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Twitter account with access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'twitter'
      }
    })

    if (!account || !account.access_token) {
      return NextResponse.json(
        {
          error: 'Twitter account not connected',
          message: 'Please connect your Twitter account first',
          action: 'connect_twitter'
        },
        { status: 400 }
      )
    }

    // Trigger sync (async process)
    await syncTwitterData(session.user.id, account.access_token)

    return NextResponse.json({
      success: true,
      message: 'Twitter data synchronized successfully'
    })
  } catch (error) {
    console.error('Twitter sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync Twitter data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/social/twitter/sync
 * Get Twitter sync status for authenticated user
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
          source: 'twitter'
        }
      }
    })

    // Get Twitter profile data
    const twitterProfile = await prisma.socialProfile.findUnique({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: 'twitter'
        }
      }
    })

    return NextResponse.json({
      syncStatus: syncStatus || null,
      profile: twitterProfile || null,
      isConnected: twitterProfile !== null
    })
  } catch (error) {
    console.error('Error fetching Twitter sync status:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
