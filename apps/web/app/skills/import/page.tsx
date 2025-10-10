import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import SkillsImportClient from './skills-import-client';

export default async function SkillsImportPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <SkillsImportClient user={session.user} />
  );
}

