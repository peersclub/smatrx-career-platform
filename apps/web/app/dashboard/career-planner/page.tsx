import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import CareerPlannerClient from './career-planner-client';

export default async function CareerPlannerPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return <CareerPlannerClient user={session.user} />;
}
