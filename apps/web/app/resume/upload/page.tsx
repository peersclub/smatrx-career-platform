import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import ResumeUploadClient from './resume-upload-client';

export default async function ResumeUploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <ResumeUploadClient user={session.user} />
  );
}

