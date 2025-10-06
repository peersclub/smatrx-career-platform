import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { analyzeSkillsFromText } from '@/lib/ai/skill-analyzer';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import { extractTextFromPDF } from '@/lib/pdf-parser-simple';
import { Readable } from 'stream';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = '';

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      try {
        extractedText = await extractTextFromPDF(buffer);
      } catch (error) {
        console.error('PDF parsing error:', error);
        return NextResponse.json({ error: 'Failed to parse PDF. Please try uploading a text file.' }, { status: 400 });
      }
    } else if (file.type === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // For DOC/DOCX files, we'll use the text content if available
      // In a production app, you'd want to use a library like mammoth.js
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Could not extract enough text from the file' 
      }, { status: 400 });
    }

    // Create import record
    const importRecord = await prisma.skillImport.create({
      data: {
        userId: session.user.id,
        source: 'resume',
        status: 'processing',
        data: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        },
      },
    });

    try {
      // Analyze skills using OpenAI
      const analysis = await analyzeSkillsFromText(extractedText, 'resume');

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

      // Process and store skills
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
            tags: ['resume', 'ai-detected'],
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
            level: skill.level,
            source: 'resume',
            proficiencyScore: skill.confidence,
            evidence: {
              aiAnalysis: {
                confidence: skill.confidence,
                reason: skill.reason,
                source: 'resume',
              },
            },
          },
          update: {
            level: skill.level,
            proficiencyScore: Math.max(skill.confidence, 50), // Keep higher score
            source: 'resume',
          },
        });
      }

      // Update import record
      await prisma.skillImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          results: {
            skillsFound: analysis.skills.length,
            analysisId: analysisRecord.id,
          },
        },
      });

      return NextResponse.json({
        success: true,
        analysisId: analysisRecord.id,
        skills: analysis.skills,
        recommendations: analysis.recommendations,
        insights: analysis.careerInsights,
      });

    } catch (error) {
      console.error('Resume analysis error:', error);
      
      // Update import record with error
      await prisma.skillImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          error: 'Failed to analyze resume',
          completedAt: new Date(),
        },
      });

      return NextResponse.json(
        { error: 'Failed to analyze resume' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
