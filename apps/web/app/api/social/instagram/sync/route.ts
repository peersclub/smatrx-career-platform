import { auth } from '@/lib/auth-helpers'
import { syncInstagramData } from '@/lib/services/social-integrations/instagram'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * POST /api/social/instagram/sync
 * Sync Instagram data for authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Instagram/Facebook account with access token
    // Note: Instagram uses Facebook OAuth, so provider is 'facebook'
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'facebook'
      }
    })

    if (!account || !account.access_token) {
      return NextResponse.json(
        {
          error: 'Instagram account not connected',
          message: 'Please connect your Instagram account via Facebook first',
          action: 'connect_instagram'
        },
        { status: 400 }
      )
    }

    // Trigger sync (async process)
    await syncInstagramData(session.user.id, account.access_token)

    return NextResponse.json({
      success: true,
      message: 'Instagram data synchronized successfully'
    })
  } catch (error) {
    console.error('Instagram sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync Instagram data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/social/instagram/sync
 * Get Instagram sync status for authenticated user
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
          source: 'instagram'
        }
      }
    })

    // Get Instagram profile data
    const instagramProfile = await prisma.socialProfile.findUnique({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: 'instagram'
        }
      }
    })

    return NextResponse.json({
      syncStatus: syncStatus || null,
      profile: instagramProfile || null,
      isConnected: instagramProfile !== null
    })
  } catch (error) {
    console.error('Error fetching Instagram sync status:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
