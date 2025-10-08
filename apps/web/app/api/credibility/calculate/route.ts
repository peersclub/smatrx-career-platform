import { auth } from '@/lib/auth-helpers'
import { calculateCredibilityScore, getUserCredibilityScore } from '@/lib/services/credibility-scoring'
import { NextResponse } from 'next/server'

/**
 * GET /api/credibility/calculate
 * Get user's credibility score (cached or calculate)
 */
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const forceRecalculate = searchParams.get('force') === 'true'

    const score = await getUserCredibilityScore(session.user.id, forceRecalculate)

    return NextResponse.json({
      success: true,
      score
    })
  } catch (error) {
    console.error('Error calculating credibility score:', error)
    return NextResponse.json(
      {
        error: 'Failed to calculate credibility score',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/credibility/calculate
 * Force recalculation of credibility score
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const score = await calculateCredibilityScore(session.user.id)

    return NextResponse.json({
      success: true,
      score,
      message: 'Credibility score recalculated successfully'
    })
  } catch (error) {
    console.error('Error recalculating credibility score:', error)
    return NextResponse.json(
      {
        error: 'Failed to recalculate credibility score',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
