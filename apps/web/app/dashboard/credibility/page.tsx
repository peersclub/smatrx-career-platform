import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import CredibilityDashboardClient from './credibility-client';

export default async function CredibilityDashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return <CredibilityDashboardClient user={session.user} />;
}
