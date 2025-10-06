import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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
                <a href="/skills" className="text-gray-400 hover:text-white">Skills</a>
                <a href="/goals" className="text-gray-400 hover:text-white">Goals</a>
                <a href="/learning" className="text-gray-400 hover:text-white">Learning</a>
                <a href="/progress" className="text-gray-400 hover:text-white">Progress</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="/profile" className="text-white">Profile</a>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
