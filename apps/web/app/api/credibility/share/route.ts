import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

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

    // Check if user already has a share link
    const existingShare = await prisma.credibilityScore.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    if (!existingShare) {
      return NextResponse.json(
        { error: 'No credibility score found. Please refresh your score first.' },
        { status: 404 }
      )
    }

    // Update credibility score with share token (you might want a separate ShareLink table)
    // For now, we'll just return a shareable URL
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
      { error: 'Failed to generate share link' },
      { status: 500 }
    )
  }
}

