import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OnboardingFlow from './onboarding-flow';

export default async function OnboardingPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Fetch user's onboarding status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      skills: true,
      accounts: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Calculate onboarding progress
  const progress = {
    profileCompleted: !!(user.profile?.title && user.profile?.bio),
    skillsImported: user.skills.length > 0,
    careerGoalsSet: !!(user.profile?.careerStage && user.profile?.industries.length > 0),
    preferencesSet: !!(user.profile?.availability && user.profile?.remotePreference),
  };

  const totalSteps = Object.keys(progress).length;
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // If onboarding is complete, redirect to dashboard
  if (progressPercentage === 100 && user.profile?.onboardingCompleted) {
    redirect('/dashboard');
  }

  return (
    <OnboardingFlow 
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      progress={progress}
      progressPercentage={progressPercentage}
      connectedAccounts={user.accounts.map(acc => acc.provider)}
    />
  );
}
