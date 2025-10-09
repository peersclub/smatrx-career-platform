import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navigation from '@/components/navigation';
import DashboardContent from './dashboard-content';

async function getDashboardData(userId: string) {
  try {
    // Fetch user data in parallel
    const [skills, profile, goals] = await Promise.all([
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.profile.findUnique({
        where: { userId }
      }),
      // Goals aren't in schema yet, so we'll return empty for now
      Promise.resolve([])
    ])

    // Calculate progress percentage based on profile completeness
    const progressPercentage = profile ? 
      Math.round(
        ([
          profile.title,
          profile.bio,
          profile.yearsExperience,
          profile.targetRole,
        ].filter(Boolean).length / 4) * 100
      ) : 0

    return {
      skills: {
        total: skills.length,
        recent: skills.map(s => ({
          name: s.skill.name,
          proficiency: s.proficiencyScore || 50,
          level: s.level
        }))
      },
      goals: {
        total: 0,
        active: []
      },
      progress: {
        percentage: progressPercentage
      },
      learning: {
        hoursThisWeek: 0 // TODO: Calculate from learning activity
      },
      hasGitHub: false, // TODO: Add GitHub profile check when table exists
      hasLinkedIn: false, // TODO: Add LinkedIn profile check
      hasResume: skills.some(s => s.source === 'resume')
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Return empty state if there's an error
    return {
      skills: { total: 0, recent: [] },
      goals: { total: 0, active: [] },
      progress: { percentage: 0 },
      learning: { hoursThisWeek: 0 },
      hasGitHub: false,
      hasLinkedIn: false,
      hasResume: false
    }
  }
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const dashboardData = await getDashboardData(session.user.id);
  const userName = session.user.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation user={session.user} variant="authenticated" />
      <DashboardContent userName={userName} data={dashboardData} />
    </div>
  );
}
