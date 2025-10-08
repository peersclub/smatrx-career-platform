import { auth } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy-load OpenAI client to avoid build-time initialization
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skills } = await request.json();

    if (!skills || skills.length === 0) {
      return NextResponse.json({
        skillStrength: {
          score: 0,
          label: 'Just Starting',
          description: 'Import your skills to get personalized insights'
        },
        topSkills: [],
        careerReadiness: {
          score: 0,
          readyFor: [],
          gaps: ['Programming Languages', 'Frameworks', 'Tools']
        },
        recommendations: [
          {
            type: 'skill',
            title: 'Import Your Skills',
            description: 'Connect GitHub, LinkedIn, or upload your resume to get started',
            priority: 'high'
          }
        ],
        industryComparison: {
          averageScore: 65,
          userScore: 0,
          percentile: 0
        },
        verificationStatus: {
          verified: 0,
          pending: 0,
          unverified: 0
        }
      });
    }

    // Create a detailed prompt for AI analysis
    const skillsSummary = skills.map((s: any) => 
      `${s.name} (${s.category}, ${s.level}, ${s.proficiencyScore}%)`
    ).join(', ');

    const prompt = `Analyze this developer's skills and provide career insights:

Skills: ${skillsSummary}

Provide a JSON response with:
1. skillStrength: overall assessment (score 0-100, label, description)
2. topSkills: top 3 skills with market demand (high/medium/low) and growth trend percentage
3. careerReadiness: score, roles they're ready for, skill gaps
4. recommendations: 3 actionable recommendations (type: skill/certification/project)
5. industryComparison: how they compare to industry average

Focus on practical, actionable insights for career growth.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a career advisor specializing in tech skills analysis. Provide practical, data-driven insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiInsights = JSON.parse(completion.choices[0].message.content || '{}');

    // Add verification status
    const verificationStatus = {
      verified: skills.filter((s: any) => s.verified).length,
      pending: 0,
      unverified: skills.filter((s: any) => !s.verified).length
    };

    return NextResponse.json({
      ...aiInsights,
      verificationStatus,
      industryComparison: {
        averageScore: 65,
        userScore: Math.round(skills.reduce((acc: number, s: any) => acc + s.proficiencyScore, 0) / skills.length),
        percentile: aiInsights.industryComparison?.percentile || 
          (skills.length > 10 ? 75 : skills.length > 5 ? 50 : 25)
      }
    });

  } catch (error) {
    console.error('Skills insights error:', error);
    
    // Return default insights on error
    return NextResponse.json({
      skillStrength: {
        score: 70,
        label: 'Growing',
        description: 'Your skills show strong potential'
      },
      topSkills: [],
      careerReadiness: {
        score: 60,
        readyFor: ['Software Developer'],
        gaps: ['Cloud Platforms', 'System Design']
      },
      recommendations: [
        {
          type: 'skill',
          title: 'Expand Your Stack',
          description: 'Learn complementary technologies',
          priority: 'medium'
        }
      ],
      industryComparison: {
        averageScore: 65,
        userScore: 70,
        percentile: 60
      },
      verificationStatus: {
        verified: 0,
        pending: 0,
        unverified: 0
      }
    });
  }
}
