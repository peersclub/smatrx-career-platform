import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navigation from '@/components/navigation';
import SkillsImport from './skills-import';
import SkillsList from './skills-list';
import SkillAnalyzer from '@/components/skill-analyzer';
import SkillsInsights from '@/components/skills-insights';

export default async function SkillsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Fetch user skills
  const userSkills = await prisma.userSkill.findMany({
    where: { userId: session.user.id },
    include: {
      skill: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      proficiencyScore: 'desc',
    },
  });

  // Fetch recent imports
  const recentImports = await prisma.skillImport.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: 'desc' },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation user={session.user} variant="authenticated" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Your Skills</h1>

        {/* Import Section */}
        <SkillsImport 
          userId={session.user.id}
          recentImports={recentImports.map(imp => ({
            id: imp.id,
            source: imp.source,
            status: imp.status,
            startedAt: imp.startedAt,
            completedAt: imp.completedAt,
            error: imp.error,
          }))}
        />

        {/* AI Skill Analyzer */}
        <div className="mb-8">
          <SkillAnalyzer />
        </div>

        {/* Skills Insights Dashboard */}
        {userSkills.length > 0 && (
          <div className="mb-8">
            <SkillsInsights 
              skills={userSkills.map(us => ({
                id: us.id,
                name: us.skill.name,
                category: us.skill.category.name,
                level: us.level,
                proficiencyScore: us.proficiencyScore || 0,
                verified: us.verified,
                source: us.source,
              }))}
              userId={session.user.id}
            />
          </div>
        )}

        {/* Skills List */}
        <SkillsList 
          skills={userSkills.map(us => ({
            id: us.id,
            name: us.skill.name,
            category: us.skill.category.name,
            level: us.level,
            yearsExperience: us.yearsExperience || 0,
            source: us.source,
            verified: us.verified,
            proficiencyScore: us.proficiencyScore || 0,
            lastUsed: us.lastUsed,
          }))}
        />
      </main>
    </div>
  );
}
