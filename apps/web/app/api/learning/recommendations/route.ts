import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CourseRecommendation {
  title: string;
  provider: string;
  url: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsCovered: string[];
  rating: number;
  description: string;
  estimatedCompletionWeeks: number;
}

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
    const { skillGaps, targetRole, currentLevel } = body;

    if (!skillGaps || skillGaps.length === 0) {
      return NextResponse.json(
        { error: 'Skill gaps are required' },
        { status: 400 }
      );
    }

    // Fetch user profile for context
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    // Fetch user's current skills
    const currentSkills = await prisma.userSkill.findMany({
      where: { userId: session.user.id },
      include: { skill: true },
      take: 20,
    });

    const currentSkillNames = currentSkills.map(s => s.skill.name);

    // Generate course recommendations using OpenAI
    const prompt = `You are a career development advisor for Credably, a platform helping professionals advance their careers.

User Context:
- Current Role: ${profile?.title || 'Not specified'}
- Years of Experience: ${profile?.yearsExperience || 'Not specified'}
- Target Role: ${targetRole || 'Not specified'}
- Current Level: ${currentLevel || 'Intermediate'}
- Current Skills: ${currentSkillNames.join(', ')}
- Skill Gaps to Fill: ${skillGaps.join(', ')}

Task: Recommend 5-8 specific online courses that will help this user fill their skill gaps and reach their target role.

Requirements for each course:
1. Must be from reputable platforms: Coursera, Udemy, LinkedIn Learning, Pluralsight, edX, or freeCodeCamp
2. Must directly address one or more skill gaps
3. Must match the user's experience level
4. Should have high ratings (4.5+)
5. Include practical, hands-on learning
6. Provide a realistic URL format

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "courses": [
    {
      "title": "Course title",
      "provider": "Platform name",
      "url": "https://actual-or-realistic-url.com",
      "duration": "X hours/weeks",
      "difficulty": "Beginner|Intermediate|Advanced",
      "skillsCovered": ["skill1", "skill2"],
      "rating": 4.7,
      "description": "Brief 1-2 sentence description",
      "estimatedCompletionWeeks": 4
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a career development advisor. Return only valid JSON, no markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // Parse the response
    let recommendations;
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      recommendations = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from AI');
    }

    // Cache recommendations in database for future use
    try {
      await prisma.learningPath.create({
        data: {
          userId: session.user.id,
          name: `Learning Path for ${targetRole || 'Career Development'}`,
          description: `Recommended courses to fill skill gaps: ${skillGaps.join(', ')}`,
          targetRole: targetRole || null,
          estimatedDuration: recommendations.courses.reduce(
            (sum: number, c: CourseRecommendation) => sum + (c.estimatedCompletionWeeks || 4), 
            0
          ),
          status: 'not_started',
          recommendations: recommendations as any, // Store full recommendations
        },
      });
    } catch (dbError) {
      // Non-critical, just log
      console.error('Failed to cache recommendations:', dbError);
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations.courses,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error generating course recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve cached recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get most recent learning path
    const learningPath = await prisma.learningPath.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!learningPath) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: 'No cached recommendations found'
      });
    }

    return NextResponse.json({
      success: true,
      recommendations: (learningPath.recommendations as any)?.courses || [],
      learningPath: {
        id: learningPath.id,
        name: learningPath.name,
        createdAt: learningPath.createdAt,
      }
    });

  } catch (error) {
    console.error('Error fetching cached recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

