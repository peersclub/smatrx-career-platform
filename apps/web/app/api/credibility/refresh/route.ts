import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { calculateCredibilityScore } from '@/lib/services/credibility-scoring'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Recalculate credibility score
    const result = await calculateCredibilityScore(session.user.id)

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Credibility score refreshed successfully'
    })
  } catch (error) {
    console.error('Error refreshing credibility score:', error)
    return NextResponse.json(
      { error: 'Failed to refresh credibility score' },
      { status: 500 }
    )
  }
}
