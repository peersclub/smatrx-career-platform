import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skills } = await request.json();

    if (!skills || skills.length === 0) {
      return NextResponse.json({ error: 'No skills to verify' }, { status: 400 });
    }

    // Create verification requests for each skill
    const verificationRequests = await Promise.all(
      skills.map(async (skillId: string) => {
        // Check if skill exists and belongs to user
        const userSkill = await prisma.userSkill.findFirst({
          where: {
            id: skillId,
            userId: session.user.id,
          },
          include: {
            skill: true,
          },
        });

        if (!userSkill) {
          return null;
        }

        // Create or update verification request
        // Note: We'll need to add a VerificationRequest model to the schema
        // For now, we'll just update the skill's evidence
        return prisma.userSkill.update({
          where: { id: skillId },
          data: {
            evidence: {
              ...((userSkill.evidence as any) || {}),
              verificationRequested: true,
              verificationRequestedAt: new Date(),
            },
          },
        });
      })
    );

    const validRequests = verificationRequests.filter(Boolean);

    // In a real implementation, this would:
    // 1. Create verification request records
    // 2. Notify industry experts via email/notification system
    // 3. Add to a verification queue
    // 4. Track verification status

    // For now, we'll simulate the process
    console.log(`Verification requested for ${validRequests.length} skills by user ${session.user.id}`);

    // You could also send an email notification here
    // await sendVerificationRequestEmail(session.user, validRequests);

    return NextResponse.json({
      success: true,
      message: `Verification requested for ${validRequests.length} skills`,
      requestedSkills: validRequests.length,
    });

  } catch (error) {
    console.error('Verification request error:', error);
    return NextResponse.json(
      { error: 'Failed to request verification' },
      { status: 500 }
    );
  }
}
