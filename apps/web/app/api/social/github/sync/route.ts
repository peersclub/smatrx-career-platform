import { auth } from '@/lib/auth-helpers'
import { syncGitHubData } from '@/lib/services/social-integrations/github'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * POST /api/social/github/sync
 * Sync GitHub data for authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get GitHub account with access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'github'
      }
    })

    if (!account || !account.access_token) {
      return NextResponse.json(
        {
          error: 'GitHub account not connected',
          message: 'Please connect your GitHub account to sync data',
          action: 'connect_github'
        },
        { status: 400 }
      )
    }

    // Trigger sync (async process)
    await syncGitHubData(session.user.id, account.access_token)

    return NextResponse.json({
      success: true,
      message: 'GitHub data synchronized successfully'
    })
  } catch (error) {
    console.error('GitHub sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync GitHub data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/social/github/sync
 * Get GitHub sync status for authenticated user
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
          source: 'github'
        }
      }
    })

    // Get GitHub profile data
    const githubProfile = await prisma.gitHubProfile.findUnique({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({
      syncStatus: syncStatus || null,
      profile: githubProfile || null,
      isConnected: githubProfile !== null
    })
  } catch (error) {
    console.error('Error fetching GitHub sync status:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
