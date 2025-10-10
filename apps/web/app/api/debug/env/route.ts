import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL ? 'SET ✅' : 'MISSING ❌',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING ❌',
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? 'SET ✅' : 'MISSING ❌',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'MISSING ❌',
    GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET ? 'SET ✅' : 'MISSING ❌',
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || 'MISSING ❌',
    LINKEDIN_CLIENT_SECRET: !!process.env.LINKEDIN_CLIENT_SECRET ? 'SET ✅' : 'MISSING ❌',
    NODE_ENV: process.env.NODE_ENV,
  };

  // Test database connection
  let dbStatus = 'UNKNOWN';
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'CONNECTED ✅';
  } catch (error) {
    dbStatus = `FAILED ❌: ${(error as Error).message}`;
  }

  return NextResponse.json({
    environment: envCheck,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}

