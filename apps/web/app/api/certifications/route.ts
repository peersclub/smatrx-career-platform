import { auth } from '@/lib/auth-helpers'
import {
  createCertification,
  getUserCertifications,
  calculateCertificationScore,
  getCertificationStatistics,
  getExpiringCertifications
} from '@/lib/services/certification-service'
import { NextResponse } from 'next/server'

/**
 * POST /api/certifications
 * Create a new certification record
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      metadata
    } = body

    // Validate required fields
    if (!name || !issuer || !issueDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, issuer, issueDate' },
        { status: 400 }
      )
    }

    // Create certification
    const certification = await createCertification(session.user.id, {
      name,
      issuer,
      issueDate: new Date(issueDate),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      credentialId,
      credentialUrl,
      metadata
    })

    return NextResponse.json({
      success: true,
      certification
    })
  } catch (error) {
    console.error('Create certification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create certification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/certifications
 * Get all certifications for authenticated user
 * Query params:
 * - ?score=true - Include certification score
 * - ?stats=true - Include statistics
 * - ?expiring=true - Get expiring certifications only
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
    const expiringOnly = searchParams.get('expiring') === 'true'

    let certifications
    if (expiringOnly) {
      certifications = await getExpiringCertifications(session.user.id, 90)
    } else {
      certifications = await getUserCertifications(session.user.id)
    }

    const response: any = {
      success: true,
      certifications,
      count: certifications.length
    }

    if (includeScore) {
      response.score = await calculateCertificationScore(session.user.id)
    }

    if (includeStats) {
      response.statistics = await getCertificationStatistics(session.user.id)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get certifications error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch certifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
