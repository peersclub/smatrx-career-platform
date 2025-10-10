import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/learning/paths/[pathId]/resources
 * Track when a user accesses a resource
 * Body: { resourceId: string, action: 'view' | 'complete' }
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

    const body = await request.json();
    const { resourceId, action = 'view' } = body;

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
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

    // Get or create progress record
    let progress = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        pathId: params.pathId,
      },
    });

    if (!progress) {
      // Auto-create progress if user is accessing a resource
      progress = await prisma.progress.create({
        data: {
          userId: session.user.id,
          pathId: params.pathId,
          type: 'path',
          status: 'in-progress',
          percentage: 0,
          startedAt: new Date(),
        },
      });
    }

    // Parse resources from learning path
    const resources = (learningPath.recommendations as any)?.resources || [];
    const totalResources = resources.length;

    // Track resource access
    const currentMetadata = (progress.metadata as any) || {};
    const accessedResources = currentMetadata.accessedResources || [];
    const completedResources = currentMetadata.completedResources || [];

    // Add to accessed if not already there
    if (!accessedResources.includes(resourceId)) {
      accessedResources.push(resourceId);
    }

    // Add to completed if action is complete
    if (action === 'complete' && !completedResources.includes(resourceId)) {
      completedResources.push(resourceId);
    }

    // Calculate new percentage
    const newPercentage = totalResources > 0 
      ? Math.round((completedResources.length / totalResources) * 100)
      : 0;

    // Update progress
    const updatedProgress = await prisma.progress.update({
      where: { id: progress.id },
      data: {
        percentage: newPercentage,
        status: newPercentage === 100 ? 'completed' : 'in-progress',
        completedAt: newPercentage === 100 ? new Date() : null,
        metadata: {
          ...currentMetadata,
          accessedResources,
          completedResources,
          lastAccessedResource: resourceId,
          lastAccessedAt: new Date().toISOString(),
        },
      },
    });

    // Update learning path status
    if (newPercentage === 100) {
      await prisma.learningPath.update({
        where: { id: params.pathId },
        data: { status: 'completed' },
      });
    }

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      resourceTracked: resourceId,
      action,
      percentage: newPercentage,
      message: action === 'complete' 
        ? 'Resource marked as complete' 
        : 'Resource access tracked',
    });

  } catch (error) {
    console.error('Error tracking resource:', error);
    return NextResponse.json(
      { 
        error: 'Failed to track resource',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

