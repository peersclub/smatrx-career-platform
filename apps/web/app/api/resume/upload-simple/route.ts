import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-parser-final';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      bufferSize: buffer.length
    });

    let extractedText = '';

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      try {
        console.log('Attempting to parse PDF...');
        extractedText = await extractTextFromPDF(bytes); // Pass ArrayBuffer directly
        console.log('PDF parsed successfully, text length:', extractedText.length);
      } catch (error) {
        console.error('PDF parsing error:', error);
        return NextResponse.json({ 
          error: error instanceof Error ? error.message : 'Failed to parse PDF', 
          tip: 'Try using the AI Skill Analyzer to paste your resume text directly'
        }, { status: 400 });
      }
    } else if (file.type === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Could not extract enough text from the file' 
      }, { status: 400 });
    }

    // For now, let's do a simple skill extraction without OpenAI
    const skills = extractSkillsFromText(extractedText);
    
    // Create import record
    const importRecord = await prisma.skillImport.create({
      data: {
        userId: session.user.id,
        source: 'resume',
        status: 'processing',
      },
    });

    try {
      // Process and store skills
      const createdSkills = [];
      
      for (const skill of skills) {
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
            tags: ['resume', 'extracted'],
          },
          update: {},
        });

        // Create or update user skill
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
            level: 'intermediate',
            source: 'resume',
            proficiencyScore: 70,
            evidence: {
              source: 'resume',
              extractedFrom: file.name,
            },
          },
          update: {
            source: 'resume',
            lastUsed: new Date(),
          },
        });
        
        createdSkills.push(skill.name);
      }

      // Update import record
      await prisma.skillImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          results: {
            skillsFound: skills.length,
            createdSkills,
          },
        },
      });

      return NextResponse.json({
        success: true,
        skills: skills,
        message: `Successfully extracted ${skills.length} skills from your resume`,
      });

    } catch (error) {
      await prisma.skillImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          error: 'Failed to process skills',
          completedAt: new Date(),
        },
      });
      throw error;
    }
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process resume', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Simple skill extraction without AI
function extractSkillsFromText(text: string): Array<{ name: string; category: string }> {
  const skills: Array<{ name: string; category: string }> = [];
  
  // Common programming languages
  const programmingLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 
    'Rust', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Objective-C'
  ];
  
  // Frameworks and libraries
  const frameworks = [
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Rails', 'Laravel', 'Next.js', 'Gatsby', 'jQuery', 'Bootstrap', 'Tailwind',
    'Material-UI', 'Redux', 'MobX', 'GraphQL', 'REST API', 'FastAPI', 'NestJS'
  ];
  
  // Databases
  const databases = [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    'DynamoDB', 'Cassandra', 'Elasticsearch', 'Firebase', 'Supabase'
  ];
  
  // Cloud and DevOps
  const cloudDevOps = [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab',
    'GitHub Actions', 'Terraform', 'Ansible', 'CI/CD', 'Linux', 'Nginx', 'Apache'
  ];
  
  // Check for skills in text
  const textLower = text.toLowerCase();
  
  programmingLanguages.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push({ name: skill, category: 'Programming Languages' });
    }
  });
  
  frameworks.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push({ name: skill, category: 'Frameworks & Libraries' });
    }
  });
  
  databases.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push({ name: skill, category: 'Databases' });
    }
  });
  
  cloudDevOps.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push({ name: skill, category: 'Cloud & DevOps' });
    }
  });
  
  // Remove duplicates
  const uniqueSkills = Array.from(
    new Map(skills.map(s => [`${s.name}-${s.category}`, s])).values()
  );
  
  return uniqueSkills;
}
