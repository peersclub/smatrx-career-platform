import { NextResponse } from 'next/server';

export async function GET() {
  const env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'SET' : 'NOT SET',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'SET' : 'NOT SET',
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? 'SET' : 'NOT SET',
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
  };

  const callbackUrls = {
    github: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
    linkedin: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
    google: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  };

  const issues = [];
  
  if (!process.env.NEXTAUTH_URL) {
    issues.push('NEXTAUTH_URL is not set');
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    issues.push('NEXTAUTH_SECRET is not set');
  }
  
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    issues.push('GitHub OAuth credentials are missing');
  }
  
  if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
    issues.push('LinkedIn OAuth credentials are missing');
  }
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    issues.push('Google OAuth credentials are missing');
  }

  return NextResponse.json({
    environment: env,
    callbackUrls,
    issues,
    recommendations: [
      'Make sure your OAuth provider apps are configured with the correct callback URLs',
      'Ensure NEXTAUTH_URL matches your application URL',
      'Verify all OAuth credentials are properly set in your environment',
      'Check that your OAuth provider apps allow the callback URLs listed above'
    ]
  });
}
