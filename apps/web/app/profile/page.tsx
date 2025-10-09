import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navigation from '@/components/navigation';
import ProfileForm from './profile-form';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Fetch user profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation user={session.user} variant="authenticated" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <ProfileForm 
          user={session.user} 
          profile={profile ? {
            bio: profile.bio || undefined,
            title: profile.title || undefined,
            company: profile.company || undefined,
            location: profile.location || undefined,
            linkedinUrl: profile.linkedinUrl || undefined,
            githubUrl: profile.githubUrl || undefined,
            websiteUrl: profile.websiteUrl || undefined,
            yearsExperience: profile.yearsExperience || undefined,
            careerStage: profile.careerStage || undefined,
            industries: profile.industries,
            languages: profile.languages,
            availability: profile.availability || undefined,
            remotePreference: profile.remotePreference || undefined,
            salaryExpectation: profile.salaryExpectation as any,
          } : undefined} 
        />
      </main>
    </div>
  );
}
