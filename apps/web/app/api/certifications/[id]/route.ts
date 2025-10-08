import { auth } from '@/lib/auth-helpers'
import {
  verifyCertification,
  deleteCertification
} from '@/lib/services/certification-service'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * GET /api/certifications/[id]
 * Get a specific certification
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certification = await prisma.certification.findUnique({
      where: { id: params.id }
    })

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    // Verify ownership
    if (certification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      certification
    })
  } catch (error) {
    console.error('Get certification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch certification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/certifications/[id]
 * Update certification verification status
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { verified, verificationMethod } = body

    // Get certification to verify ownership
    const certification = await prisma.certification.findUnique({
      where: { id: params.id }
    })

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    if (certification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update verification status
    const updated = await verifyCertification(
      params.id,
      verified,
      verificationMethod || 'manual_review'
    )

    return NextResponse.json({
      success: true,
      certification: updated
    })
  } catch (error) {
    console.error('Update certification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update certification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/certifications/[id]
 * Delete a certification
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get certification to verify ownership
    const certification = await prisma.certification.findUnique({
      where: { id: params.id }
    })

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    if (certification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete certification
    await deleteCertification(params.id)

    return NextResponse.json({
      success: true,
      message: 'Certification deleted successfully'
    })
  } catch (error) {
    console.error('Delete certification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete certification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
