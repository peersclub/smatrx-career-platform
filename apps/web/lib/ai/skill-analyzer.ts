import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SkillAnalysisResult {
  skills: Array<{
    name: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number;
    reason: string;
  }>;
  recommendations: Array<{
    skill: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    resources: string[];
  }>;
  careerInsights: {
    strengths: string[];
    gaps: string[];
    opportunities: string[];
    suggestedRoles: Array<{
      title: string;
      matchScore: number;
      missingSkills: string[];
    }>;
  };
}

export async function analyzeSkillsFromText(
  text: string,
  context: 'resume' | 'linkedin' | 'general' = 'general'
): Promise<SkillAnalysisResult> {
  try {
    const systemPrompt = `You are an expert career advisor and skill analyst. 
    Analyze the provided text and extract technical skills, soft skills, and domain knowledge.
    Categorize skills appropriately and assess proficiency levels based on context clues.
    Be accurate and avoid hallucinating skills that aren't clearly indicated.`;

    const userPrompt = `Analyze this ${context} text and extract skills:

${text}

Provide a JSON response with:
1. skills: Array of detected skills with name, category, proficiency level, confidence score (0-100), and reason
2. recommendations: Suggested skills to learn based on current skills
3. careerInsights: Analysis of strengths, gaps, opportunities, and suggested career roles

Categories can include: Programming Languages, Frameworks & Libraries, Databases, Cloud & DevOps, 
Data Science & ML, Design & UX, Project Management, Soft Skills, Domain Knowledge, Tools & Software`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result as SkillAnalysisResult;
  } catch (error) {
    console.error('OpenAI skill analysis error:', error);
    throw new Error('Failed to analyze skills');
  }
}

export async function generateLearningPath(
  currentSkills: Array<{ name: string; level: string }>,
  targetRole: string,
  timeframe: number // months
): Promise<{
  milestones: Array<{
    month: number;
    skills: string[];
    projects: string[];
    resources: Array<{
      title: string;
      type: 'course' | 'book' | 'tutorial' | 'project';
      url?: string;
      duration: string;
    }>;
  }>;
  totalHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}> {
  try {
    const prompt = `Create a learning path for someone with these skills:
${currentSkills.map(s => `- ${s.name} (${s.level})`).join('\n')}

Target role: ${targetRole}
Timeframe: ${timeframe} months

Provide a month-by-month learning plan with specific skills to learn, 
projects to build, and resources (courses, books, tutorials).
Be specific and practical.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert career coach creating personalized learning paths. Provide practical, achievable plans with specific resources.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 2000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Learning path generation error:', error);
    throw new Error('Failed to generate learning path');
  }
}

export async function analyzeCareerReadiness(
  userSkills: Array<{ name: string; level: string; yearsExperience: number }>,
  targetRole: {
    title: string;
    requiredSkills: Array<{ name: string; level: string; importance: 'must-have' | 'nice-to-have' }>;
  }
): Promise<{
  readinessScore: number;
  strengths: Array<{ skill: string; analysis: string }>;
  gaps: Array<{ 
    skill: string; 
    currentLevel: string; 
    requiredLevel: string; 
    priority: 'high' | 'medium' | 'low';
    timeToLearn: string;
  }>;
  recommendations: string[];
  estimatedTimeToReady: number; // months
}> {
  try {
    const prompt = `Analyze career readiness for ${targetRole.title} role.

Current skills:
${userSkills.map(s => `- ${s.name}: ${s.level} (${s.yearsExperience} years)`).join('\n')}

Required skills:
${targetRole.requiredSkills.map(s => `- ${s.name}: ${s.level} (${s.importance})`).join('\n')}

Provide detailed analysis including readiness score (0-100), strengths, gaps, 
and time estimates to become ready.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert career advisor analyzing job readiness. Be realistic and specific in your assessments.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1500,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Career readiness analysis error:', error);
    throw new Error('Failed to analyze career readiness');
  }
}
