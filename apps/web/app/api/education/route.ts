import { auth } from '@/lib/auth-helpers'
import {
  createEducationRecord,
  getUserEducation,
  calculateEducationScore,
  getEducationStatistics,
  getCurrentEducation,
  calculateEducationDuration
} from '@/lib/services/education-service'
import { NextResponse } from 'next/server'

/**
 * POST /api/education
 * Create a new education record
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      institutionName,
      degree,
      field,
      gpa,
      startDate,
      endDate,
      credentialId,
      metadata
    } = body

    // Validate required fields
    if (!institutionName || !degree || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: institutionName, degree, startDate' },
        { status: 400 }
      )
    }

    // Create education record
    const educationRecord = await createEducationRecord(session.user.id, {
      institutionName,
      degree,
      field,
      gpa: gpa ? parseFloat(gpa) : undefined,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      credentialId,
      metadata
    })

    return NextResponse.json({
      success: true,
      education: educationRecord
    })
  } catch (error) {
    console.error('Create education error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create education record',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/education
 * Get all education records for authenticated user
 * Query params:
 * - ?score=true - Include education score
 * - ?stats=true - Include statistics
 * - ?current=true - Get current education only
 * - ?duration=true - Include total education duration
 */
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeScore = searchParams.get('score') === 'true'
    const includeStats = searchParams.get('stats') === 'true'
    const currentOnly = searchParams.get('current') === 'true'
    const includeDuration = searchParams.get('duration') === 'true'

    let educationRecords
    if (currentOnly) {
      educationRecords = await getCurrentEducation(session.user.id)
    } else {
      educationRecords = await getUserEducation(session.user.id)
    }

    const response: any = {
      success: true,
      education: educationRecords,
      count: educationRecords.length
    }

    if (includeScore) {
      response.score = await calculateEducationScore(session.user.id)
    }

    if (includeStats) {
      response.statistics = await getEducationStatistics(session.user.id)
    }

    if (includeDuration) {
      response.totalYears = await calculateEducationDuration(session.user.id)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get education error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch education records',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
