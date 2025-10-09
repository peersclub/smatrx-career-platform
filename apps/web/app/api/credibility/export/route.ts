import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { getUserCredibilityScore } from '@/lib/services/credibility-scoring'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json' // json or pdf

    // Get credibility data
    const credibilityScore = await getUserCredibilityScore(session.user.id)
    
    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    const exportData = {
      user: {
        name: session.user.name,
        email: session.user.email
      },
      profile: {
        title: profile?.title,
        bio: profile?.bio,
        location: profile?.location
      },
      credibility: credibilityScore,
      exportedAt: new Date().toISOString()
    }

    if (format === 'json') {
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="credibility-report-${Date.now()}.json"`,
          'Content-Type': 'application/json'
        }
      })
    }

    // For PDF, return JSON for now (PDF generation would require a library like puppeteer)
    return NextResponse.json({
      message: 'PDF export coming soon. Here is your JSON export.',
      data: exportData
    })

  } catch (error) {
    console.error('Error exporting credibility data:', error)
    return NextResponse.json(
      { error: 'Failed to export credibility data' },
      { status: 500 }
    )
  }
}

