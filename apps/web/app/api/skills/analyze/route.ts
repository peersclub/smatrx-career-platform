import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { analyzeSkillsFromText, analyzeCareerReadiness } from '@/lib/ai/skill-analyzer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, data } = await request.json();

    switch (type) {
      case 'text-analysis': {
        // Analyze skills from text (resume, description, etc.)
        const { text, context } = data;
        const analysis = await analyzeSkillsFromText(text, context);

        // Store the analysis
        const analysisRecord = await prisma.skillAnalysis.create({
          data: {
            userId: session.user.id,
            type: 'comprehensive',
            results: analysis as any,
            recommendations: analysis.recommendations as any,
            marketInsights: {
              strengths: analysis.careerInsights.strengths,
              opportunities: analysis.careerInsights.opportunities,
            },
          },
        });

        // Create or update skills in database
        for (const skill of analysis.skills) {
          // Find or create category
          const category = await prisma.skillCategory.upsert({
            where: { 
              slug: skill.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
            },
            create: {
              name: skill.category,
              slug: skill.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            },
            update: {},
          });

          // Find or create skill
          const skillRecord = await prisma.skill.upsert({
            where: { 
              slug: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
            },
            create: {
              name: skill.name,
              slug: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              categoryId: category.id,
              tags: ['ai-detected'],
            },
            update: {},
          });

          // Create user skill
          await prisma.userSkill.upsert({
            where: {
              userId_skillId: {
                userId: session.user.id,
                skillId: skillRecord.id,
              },
            },
            create: {
              userId: session.user.id,
              skillId: skillRecord.id,
              level: skill.level,
              source: 'ai-analysis',
              proficiencyScore: skill.confidence,
              evidence: {
                aiAnalysis: {
                  confidence: skill.confidence,
                  reason: skill.reason,
                },
              },
            },
            update: {
              level: skill.level,
              proficiencyScore: skill.confidence,
            },
          });
        }

        return NextResponse.json({
          analysisId: analysisRecord.id,
          skills: analysis.skills,
          recommendations: analysis.recommendations,
          insights: analysis.careerInsights,
        });
      }

      case 'career-readiness': {
        // Analyze readiness for a specific role
        const { roleId } = data;
        
        // Fetch user skills
        const userSkills = await prisma.userSkill.findMany({
          where: { userId: session.user.id },
          include: { skill: true },
        });

        // Fetch role requirements
        const role = await prisma.careerRole.findUnique({
          where: { id: roleId },
          include: {
            requiredSkills: {
              include: { skill: true },
            },
          },
        });

        if (!role) {
          return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        const readiness = await analyzeCareerReadiness(
          userSkills.map(us => ({
            name: us.skill.name,
            level: us.level,
            yearsExperience: us.yearsExperience || 0,
          })),
          {
            title: role.title,
            requiredSkills: role.requiredSkills.map(rs => ({
              name: rs.skill.name,
              level: rs.level,
              importance: rs.importance as 'must-have' | 'nice-to-have',
            })),
          }
        );

        // Store the analysis
        const analysisRecord = await prisma.skillAnalysis.create({
          data: {
            userId: session.user.id,
            type: 'role-specific',
            results: readiness as any,
          },
        });

        // Create skill match record
        if (data.goalId) {
          await prisma.skillMatch.create({
            data: {
              analysisId: analysisRecord.id,
              goalId: data.goalId,
              matchScore: readiness.readinessScore,
              gaps: readiness.gaps as any,
              strengths: readiness.strengths as any,
              readiness: {
                score: readiness.readinessScore,
                timeToReady: readiness.estimatedTimeToReady,
              },
            },
          });
        }

        return NextResponse.json(readiness);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Skill analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skills' },
      { status: 500 }
    );
  }
}
