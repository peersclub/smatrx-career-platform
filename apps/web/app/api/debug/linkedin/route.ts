import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasClientId: !!process.env.LINKEDIN_CLIENT_ID,
    hasClientSecret: !!process.env.LINKEDIN_CLIENT_SECRET,
    clientIdLength: process.env.LINKEDIN_CLIENT_ID?.length || 0,
    clientSecretLength: process.env.LINKEDIN_CLIENT_SECRET?.length || 0,
    // Don't expose actual values for security
    clientIdPrefix: process.env.LINKEDIN_CLIENT_ID?.substring(0, 4) || 'not set',
  });
}
