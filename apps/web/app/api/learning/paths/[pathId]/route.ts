import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/learning/paths/[pathId]
 * Fetch a single learning path with full details
 */
export async function GET(
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

    const learningPath = await prisma.learningPath.findUnique({
      where: { id: params.pathId },
      include: {
        progress: {
          where: { userId: session.user.id },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      );
    }

    // Check access: global paths or user's own paths
    if (learningPath.userId !== null && learningPath.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      path: {
        ...learningPath,
        userProgress: learningPath.progress[0] || null,
      },
    });

  } catch (error) {
    console.error('Error fetching learning path:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch learning path',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

