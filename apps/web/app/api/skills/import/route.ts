import { auth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { SimpleGitHubAnalyzer } from '@/lib/github-analyzer-simple';
import type { SkillLevel } from '@smatrx/core';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { source } = await request.json();

    // Create import record
    const skillImport = await prisma.skillImport.create({
      data: {
        userId: session.user.id,
        source,
        status: 'pending',
      },
    });

    // Handle different import sources
    switch (source) {
      case 'github':
        // Check if we have GitHub access token
        const account = await prisma.account.findFirst({
          where: {
            userId: session.user.id,
            provider: 'github',
          },
        });

        if (!account?.access_token) {
          return NextResponse.json({ 
            needsAuth: true,
            message: 'Please reconnect your GitHub account' 
          });
        }

        // Start async import process
        importFromGitHub(session.user.id, skillImport.id, account.access_token);
        break;

      case 'linkedin':
        // Check if we have LinkedIn access
        const linkedinAccount = await prisma.account.findFirst({
          where: {
            userId: session.user.id,
            provider: 'linkedin',
          },
        });

        if (!linkedinAccount) {
          await prisma.skillImport.update({
            where: { id: skillImport.id },
            data: {
              status: 'failed',
              error: 'Please connect your LinkedIn account first',
              completedAt: new Date(),
            },
          });
          return NextResponse.json({ 
            needsAuth: true,
            provider: 'linkedin',
            message: 'Please sign in with LinkedIn to import your professional skills' 
          });
        }

        // Start async import process
        importFromLinkedIn(session.user.id, skillImport.id);
        break;

      default:
        await prisma.skillImport.update({
          where: { id: skillImport.id },
          data: {
            status: 'failed',
            error: 'Unsupported import source',
            completedAt: new Date(),
          },
        });
    }

    console.log('Import started with ID:', skillImport.id);
    return NextResponse.json({ 
      importId: skillImport.id,
      status: 'started' 
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to start import' },
      { status: 500 }
    );
  }
}

async function importFromGitHub(userId: string, importId: string, accessToken: string) {
  try {
    console.log('Starting GitHub import for user:', userId);
    
    // Update status to processing
    await prisma.skillImport.update({
      where: { id: importId },
      data: { status: 'processing' },
    });

    // Create simple GitHub analyzer
    const analyzer = new SimpleGitHubAnalyzer(accessToken);
    
    // Analyze GitHub data with progress updates
    const analysisResult = await analyzer.analyze(async (progress, message) => {
      console.log(`Import progress: ${progress}% - ${message}`);
      // Update import progress
      await prisma.skillImport.update({
        where: { id: importId },
        data: {
          results: {
            progress,
            message,
          },
        },
      }).catch(err => console.error('Failed to update progress:', err));
    });

    // Ensure categories exist
    const categories = await ensureCategories();

    // Process skills from analysis
    const createdSkills: string[] = [];
    const updatedSkills: string[] = [];

    // Process programming languages
    for (const [language, count] of Object.entries(analysisResult.languages)) {
      const skill = await prisma.skill.upsert({
        where: { slug: language.toLowerCase().replace(/[\s+\/\.#]/g, '-') },
        create: {
          name: language,
          slug: language.toLowerCase().replace(/[\s+\/\.#]/g, '-'),
          categoryId: categories.programming.id,
          tags: ['programming', 'github'],
        },
        update: {},
      });

      // Calculate proficiency based on repo count
      const totalRepos = analysisResult.totalRepos;
      const percentage = (count / totalRepos) * 100;
      
      // Simple proficiency calculation
      const proficiencyScore = Math.min(100, 50 + (percentage * 2) + (language === analysisResult.primaryLanguage ? 20 : 0));
      const level = getSkillLevel(proficiencyScore);

      // Create or update user skill
      const existingSkill = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId,
            skillId: skill.id,
          },
        },
      });

      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId: skill.id,
          },
        },
        create: {
          userId,
          skillId: skill.id,
          level,
          source: 'github',
          proficiencyScore,
          lastUsed: new Date(),
          evidence: {
            repoCount: count,
            percentage,
            isPrimary: language === analysisResult.primaryLanguage,
            source: 'github',
            analyzedAt: new Date(),
          },
        },
        update: {
          level,
          proficiencyScore,
          source: 'github',
          lastUsed: new Date(),
          evidence: {
            repoCount: count,
            percentage,
            isPrimary: language === analysisResult.primaryLanguage,
            source: 'github',
            analyzedAt: new Date(),
          },
        },
      });

      if (existingSkill) {
        updatedSkills.push(language);
      } else {
        createdSkills.push(language);
      }
    }

    // Process frameworks
    for (const framework of analysisResult.frameworks) {
      const skill = await prisma.skill.upsert({
        where: { slug: framework.toLowerCase().replace(/[\s+\/\.#]/g, '-') },
        create: {
          name: framework,
          slug: framework.toLowerCase().replace(/[\s+\/\.#]/g, '-'),
          categoryId: categories.framework.id,
          tags: ['framework', 'tool', 'github'],
        },
        update: {},
      });

      // Set intermediate proficiency for detected frameworks
      const proficiencyScore = 70;
      const level = getSkillLevel(proficiencyScore);

      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId: skill.id,
          },
        },
        create: {
          userId,
          skillId: skill.id,
          level,
          source: 'github',
          proficiencyScore,
          lastUsed: new Date(),
          evidence: {
            source: 'github',
            framework: true,
          },
        },
        update: {
          level,
          proficiencyScore,
          source: 'github',
          lastUsed: new Date(),
          evidence: {
            source: 'github',
            framework: true,
          },
        },
      });

      createdSkills.push(framework);
    }

    // Mark import as completed
    await prisma.skillImport.update({
      where: { id: importId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        results: {
          languagesFound: Object.keys(analysisResult.languages).length,
          frameworksFound: analysisResult.frameworks.length,
          reposAnalyzed: analysisResult.totalRepos,
          createdSkills,
          updatedSkills,
          primaryLanguage: analysisResult.primaryLanguage,
        },
      },
    });

  } catch (error) {
    console.error('GitHub import error:', error);
    await prisma.skillImport.update({
      where: { id: importId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    });
  }
}

// Helper functions
async function ensureCategories() {
  const programming = await prisma.skillCategory.upsert({
    where: { slug: 'programming-languages' },
    create: {
      name: 'Programming Languages',
      slug: 'programming-languages',
    },
    update: {},
  });

  const framework = await prisma.skillCategory.upsert({
    where: { slug: 'frameworks-libraries' },
    create: {
      name: 'Frameworks & Libraries',
      slug: 'frameworks-libraries',
    },
    update: {},
  });

  return { programming, framework };
}



function getSkillLevel(proficiencyScore: number): SkillLevel {
  if (proficiencyScore >= 85) return 'expert';
  if (proficiencyScore >= 70) return 'advanced';
  if (proficiencyScore >= 50) return 'intermediate';
  return 'beginner';
}

async function importFromLinkedIn(userId: string, importId: string) {
  try {
    // Update status to processing
    await prisma.skillImport.update({
      where: { id: importId },
      data: { status: 'processing' },
    });

    // Note: LinkedIn's API is very restricted now. 
    // Full profile access requires expensive partnership.
    // We'll use the basic profile data from OAuth login
    
    // Get user's LinkedIn account data
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'linkedin',
      },
    });

    if (!account) {
      throw new Error('LinkedIn account not connected. Please sign in with LinkedIn first.');
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // LinkedIn API v2 has very limited access to skills
    // We'll extract basic professional skills based on common patterns
    const createdSkills: string[] = [];
    
    // Ensure categories exist
    const categories = await ensureCategories();
    const professionalCategory = await prisma.skillCategory.upsert({
      where: { slug: 'professional-skills' },
      create: {
        name: 'Professional Skills',
        slug: 'professional-skills',
      },
      update: {},
    });

    // Add some common professional skills based on LinkedIn profile
    // In a real implementation with full API access, we would fetch actual skills
    const professionalSkills = [
      'Leadership',
      'Communication',
      'Project Management',
      'Team Collaboration',
      'Problem Solving',
      'Strategic Planning',
    ];

    for (const skillName of professionalSkills) {
      const skill = await prisma.skill.upsert({
        where: { slug: skillName.toLowerCase().replace(/\s+/g, '-') },
        create: {
          name: skillName,
          slug: skillName.toLowerCase().replace(/\s+/g, '-'),
          categoryId: professionalCategory.id,
          tags: ['professional', 'linkedin', 'soft-skill'],
        },
        update: {},
      });

      // Create user skill with moderate proficiency
      const existingSkill = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId,
            skillId: skill.id,
          },
        },
      });

      if (!existingSkill) {
        await prisma.userSkill.create({
          data: {
            userId,
            skillId: skill.id,
            level: 'intermediate' as SkillLevel,
            source: 'linkedin',
            proficiencyScore: 60,
            evidence: {
              source: 'linkedin',
              importedAt: new Date(),
            },
          },
        });
        createdSkills.push(skillName);
      }
    }

    // If user has a title in their profile, extract skills from it
    if (user.profile?.title) {
      const titleSkills = extractSkillsFromTitle(user.profile.title);
      for (const skillName of titleSkills) {
        const skill = await prisma.skill.upsert({
          where: { slug: skillName.toLowerCase().replace(/\s+/g, '-') },
          create: {
            name: skillName,
            slug: skillName.toLowerCase().replace(/\s+/g, '-'),
            categoryId: categories.framework.id,
            tags: ['linkedin', 'extracted'],
          },
          update: {},
        });

        const existingSkill = await prisma.userSkill.findUnique({
          where: {
            userId_skillId: {
              userId,
              skillId: skill.id,
            },
          },
        });

        if (!existingSkill) {
          await prisma.userSkill.create({
            data: {
              userId,
              skillId: skill.id,
              level: 'advanced' as SkillLevel,
              source: 'linkedin',
              proficiencyScore: 75,
              evidence: {
                source: 'linkedin',
                fromTitle: true,
                title: user.profile.title,
              },
            },
          });
          createdSkills.push(skillName);
        }
      }
    }

    // Mark import as completed
    await prisma.skillImport.update({
      where: { id: importId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        results: {
          message: 'LinkedIn basic profile import completed. For full skills import, LinkedIn requires premium API access.',
          createdSkills,
          totalSkills: createdSkills.length,
          note: 'LinkedIn API v2 has limited access. Professional skills were added based on common patterns.',
        },
      },
    });

  } catch (error) {
    console.error('LinkedIn import error:', error);
    await prisma.skillImport.update({
      where: { id: importId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    });
  }
}

function extractSkillsFromTitle(title: string): string[] {
  const skills: string[] = [];
  const titleLower = title.toLowerCase();
  
  // Common technology keywords in titles
  const techPatterns = {
    'React': ['react', 'reactjs'],
    'Node.js': ['node', 'nodejs', 'node.js'],
    'Python': ['python'],
    'Java': ['java '],
    'JavaScript': ['javascript', 'js '],
    'TypeScript': ['typescript', 'ts '],
    'Angular': ['angular'],
    'Vue.js': ['vue', 'vuejs'],
    'AWS': ['aws', 'amazon web services'],
    'Azure': ['azure'],
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'DevOps': ['devops'],
    'Full Stack': ['full stack', 'fullstack'],
    'Frontend': ['frontend', 'front-end', 'front end'],
    'Backend': ['backend', 'back-end', 'back end'],
    'Mobile': ['mobile', 'ios', 'android'],
    'Machine Learning': ['machine learning', 'ml '],
    'Data Science': ['data scien'],
    'Cloud': ['cloud '],
    'Architect': ['architect'],
    'Manager': ['manager', 'lead', 'head of'],
  };

  for (const [skill, patterns] of Object.entries(techPatterns)) {
    if (patterns.some(pattern => titleLower.includes(pattern))) {
      skills.push(skill);
    }
  }

  return skills;
}
