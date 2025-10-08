import { auth } from '@/lib/auth-helpers'
import {
  getUserCareerSuggestions,
  generateCareerRecommendations,
  updateSuggestionStatus,
  updateResourceStatus
} from '@/lib/services/career-recommendations'
import { NextResponse } from 'next/server'

/**
 * GET /api/career/recommendations
 * Get user's career recommendations (cached or generate new)
 */
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const forceRegenerate = searchParams.get('regenerate') === 'true'

    const recommendations = await getUserCareerSuggestions(session.user.id, forceRegenerate)

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length
    })
  } catch (error) {
    console.error('Error fetching career recommendations:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch career recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/career/recommendations
 * Generate new career recommendations
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recommendations = await generateCareerRecommendations(session.user.id)

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length,
      message: 'Career recommendations generated successfully'
    })
  } catch (error) {
    console.error('Error generating career recommendations:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate career recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/career/recommendations
 * Update suggestion or resource status
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { suggestionId, resourceId, status } = body

    if (suggestionId) {
      await updateSuggestionStatus(suggestionId, status)
      return NextResponse.json({
        success: true,
        message: 'Suggestion status updated'
      })
    }

    if (resourceId) {
      await updateResourceStatus(resourceId, status)
      return NextResponse.json({
        success: true,
        message: 'Resource status updated'
      })
    }

    return NextResponse.json(
      { error: 'Must provide either suggestionId or resourceId' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating status:', error)
    return NextResponse.json(
      {
        error: 'Failed to update status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
