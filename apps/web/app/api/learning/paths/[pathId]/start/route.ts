import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/learning/paths/[pathId]/start
 * Start a learning path (create progress record)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { pathId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if learning path exists
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: params.pathId },
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      );
    }

    // Check if user already has progress for this path
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        pathId: params.pathId,
      },
    });

    if (existingProgress) {
      // Update existing progress to mark as started
      const updatedProgress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          startedAt: existingProgress.startedAt || new Date(),
          status: 'in-progress',
        },
      });

      return NextResponse.json({
        success: true,
        progress: updatedProgress,
        message: 'Learning path resumed',
        isNew: false,
      });
    }

    // Create new progress record
    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        pathId: params.pathId,
        type: 'path',
        status: 'in-progress',
        percentage: 0,
        startedAt: new Date(),
      },
    });

    // Update learning path status
    await prisma.learningPath.update({
      where: { id: params.pathId },
      data: { status: 'active' },
    });

    return NextResponse.json({
      success: true,
      progress,
      message: 'Learning path started successfully',
      isNew: true,
    });

  } catch (error) {
    console.error('Error starting learning path:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start learning path',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

