import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                SMATRX
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a>
                <a href="/skills" className="text-white">Skills</a>
                <a href="/goals" className="text-gray-400 hover:text-white">Goals</a>
                <a href="/learning" className="text-gray-400 hover:text-white">Learning</a>
                <a href="/progress" className="text-gray-400 hover:text-white">Progress</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="/profile" className="text-gray-400 hover:text-white">Profile</a>
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
