import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
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

    // Generate a unique share token
    const shareToken = nanoid(16)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // Expires in 30 days

    // Check if user has a credibility score
    let credibilityScore = await prisma.credibilityScore.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    // If no score exists, calculate one first
    if (!credibilityScore) {
      try {
        await calculateCredibilityScore(session.user.id)
        credibilityScore = await prisma.credibilityScore.findUnique({
          where: { userId: session.user.id },
          select: { id: true }
        })
      } catch (calcError) {
        console.error('Error calculating credibility score:', calcError)
        return NextResponse.json(
          { error: 'Failed to calculate credibility score. Please ensure you have profile data.' },
          { status: 400 }
        )
      }
    }

    if (!credibilityScore) {
      return NextResponse.json(
        { error: 'Unable to generate credibility score. Please complete your profile first.' },
        { status: 400 }
      )
    }

    // Generate shareable URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002'
    const shareUrl = `${baseUrl}/public/credibility/${session.user.id}?token=${shareToken}`

    return NextResponse.json({
      success: true,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
      message: 'Share link generated successfully'
    })

  } catch (error) {
    console.error('Error generating share link:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate share link',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

