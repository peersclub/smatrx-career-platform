import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/learning/paths
 * Fetch all curated learning paths
 * Query params:
 * - ?userProgress=true - Include user's progress on each path
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeUserProgress = searchParams.get('userProgress') === 'true';

    const SYSTEM_USER_ID = 'system-curated-paths';

    // Fetch all learning paths (curated + user's own)
    const learningPaths = await prisma.learningPath.findMany({
      where: {
        OR: [
          { userId: SYSTEM_USER_ID }, // Curated paths
          { userId: session.user.id }, // User's custom paths
        ],
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    // If user wants progress, fetch their progress records
    let userProgress: any = {};
    if (includeUserProgress) {
      const progressRecords = await prisma.progress.findMany({
        where: {
          userId: session.user.id,
          pathId: {
            in: learningPaths.map(p => p.id),
          },
        },
      });

      userProgress = progressRecords.reduce((acc, progress) => {
        if (progress.pathId) {
          acc[progress.pathId] = {
            status: progress.status,
            completed: progress.status === 'completed',
            percentage: progress.percentage,
            startedAt: progress.startedAt,
            completedAt: progress.completedAt,
          };
        }
        return acc;
      }, {} as Record<string, any>);
    }

    // Format response
    const formattedPaths = learningPaths.map(path => ({
      id: path.id,
      name: path.name,
      title: path.title,
      description: path.description,
      targetRole: path.targetRole,
      estimatedDuration: path.estimatedDuration,
      estimatedHours: path.estimatedHours,
      estimatedWeeks: path.estimatedWeeks,
      difficulty: path.difficulty,
      status: path.status,
      resources: path.recommendations, // This contains the structured resources
      createdAt: path.createdAt,
      updatedAt: path.updatedAt,
      userProgress: includeUserProgress ? userProgress[path.id] : undefined,
      isCurated: path.userId === SYSTEM_USER_ID,
    }));

    return NextResponse.json({
      success: true,
      paths: formattedPaths,
      count: formattedPaths.length,
    });

  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch learning paths',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/learning/paths
 * Create a new custom learning path
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      title,
      description,
      targetRole,
      estimatedDuration,
      difficulty,
      resources,
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Create learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        userId: session.user.id,
        name,
        title: title || name,
        description,
        targetRole: targetRole || null,
        estimatedDuration: estimatedDuration || null,
        difficulty: difficulty || null,
        status: 'not_started',
        recommendations: resources || null,
      },
    });

    return NextResponse.json({
      success: true,
      path: learningPath,
      message: 'Learning path created successfully',
    });

  } catch (error) {
    console.error('Error creating learning path:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create learning path',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

