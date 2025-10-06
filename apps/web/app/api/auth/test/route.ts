import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  return NextResponse.json({
    providers: authOptions.providers.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
    })),
    callbackUrl: process.env.NEXTAUTH_URL + '/api/auth/callback/github',
    configured: {
      github: !!process.env.GITHUB_CLIENT_ID,
      google: !!process.env.GOOGLE_CLIENT_ID,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
    }
  });
}
