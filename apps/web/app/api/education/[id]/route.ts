import { auth } from '@/lib/auth-helpers'
import {
  verifyEducationRecord,
  deleteEducationRecord
} from '@/lib/services/education-service'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * GET /api/education/[id]
 * Get a specific education record
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

    const education = await prisma.educationRecord.findUnique({
      where: { id: params.id }
    })

    if (!education) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 })
    }

    // Verify ownership
    if (education.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      education
    })
  } catch (error) {
    console.error('Get education error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch education record',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/education/[id]
 * Update education verification status
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
    const { verified, verificationSource } = body

    // Get education to verify ownership
    const education = await prisma.educationRecord.findUnique({
      where: { id: params.id }
    })

    if (!education) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 })
    }

    if (education.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update verification status
    const updated = await verifyEducationRecord(
      params.id,
      verified,
      verificationSource || 'manual_review'
    )

    return NextResponse.json({
      success: true,
      education: updated
    })
  } catch (error) {
    console.error('Update education error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update education record',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/education/[id]
 * Delete an education record
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

    // Get education to verify ownership
    const education = await prisma.educationRecord.findUnique({
      where: { id: params.id }
    })

    if (!education) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 })
    }

    if (education.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete education record
    await deleteEducationRecord(params.id)

    return NextResponse.json({
      success: true,
      message: 'Education record deleted successfully'
    })
  } catch (error) {
    console.error('Delete education error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete education record',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
