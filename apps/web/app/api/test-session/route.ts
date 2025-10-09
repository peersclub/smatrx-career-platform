import { auth } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      hasSession: !!session,
      userId: session?.user?.id || null
    });
  } catch (error) {
    console.error('Session test error:', error);
    return NextResponse.json(
      { error: 'Failed to get session', details: error },
      { status: 500 }
    );
  }
}
