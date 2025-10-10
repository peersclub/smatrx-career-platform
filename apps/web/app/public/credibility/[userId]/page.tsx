import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PublicCredibilityView from './public-credibility-view';

interface PublicCredibilityPageProps {
  params: {
    userId: string;
  };
  searchParams: {
    token?: string;
  };
}

async function getPublicCredibilityData(userId: string, token?: string) {
  try {
    // Fetch comprehensive user data in parallel
    const [
      user,
      credibilityScore,
      profile,
      skills,
      education,
      certifications,
      githubProfile,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
        },
      }),
      prisma.credibilityScore.findUnique({
        where: { userId },
      }),
      prisma.profile.findUnique({
        where: { userId },
      }),
      prisma.userSkill.findMany({
        where: { userId },
        include: {
          skill: true,
        },
        orderBy: {
          proficiencyScore: 'desc',
        },
        take: 12, // Top 12 skills
      }),
      prisma.educationRecord.findMany({
        where: { userId },
        orderBy: {
          endDate: 'desc',
        },
      }),
      prisma.certification.findMany({
        where: { userId },
        orderBy: {
          issueDate: 'desc',
        },
      }),
      prisma.gitHubProfile.findUnique({
        where: { userId },
      }),
    ]);

    if (!user || !credibilityScore) {
      return null;
    }

    // TODO: Validate token if you implement proper share token system
    // For now, we'll allow public viewing with any token

    // Calculate additional metrics
    const totalSkills = skills.length;
    const verifiedSkills = skills.filter((s) => s.verified).length;
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiencyScore, 0) / skills.length)
      : 0;

    // Calculate profile completeness
    const completenessFactors = [
      !!profile?.title,
      !!profile?.company,
      !!profile?.bio,
      !!profile?.location,
      education.length > 0,
      certifications.length > 0,
      skills.length >= 5,
      !!githubProfile,
      user.emailVerified,
    ];
    const profileCompleteness = Math.round(
      (completenessFactors.filter(Boolean).length / completenessFactors.length) * 100
    );

    return {
      user: {
        name: user.name,
        image: user.image,
        emailVerified: !!user.emailVerified,
        memberSince: user.createdAt,
      },
      profile: {
        title: profile?.title,
        company: profile?.company,
        bio: profile?.bio,
        location: profile?.location,
        yearsExperience: profile?.yearsExperience,
        linkedinUrl: profile?.linkedinUrl,
      },
      credibilityScore: {
        overallScore: credibilityScore.overallScore,
        verificationLevel: credibilityScore.verificationLevel,
        breakdown: credibilityScore.breakdown as any,
        calculatedAt: credibilityScore.calculatedAt,
        educationScore: credibilityScore.educationScore,
        experienceScore: credibilityScore.experienceScore,
        technicalScore: credibilityScore.technicalScore,
        socialScore: credibilityScore.socialScore,
        certificationScore: credibilityScore.certificationScore,
      },
      skills: skills.map((s) => ({
        id: s.id,
        name: s.skill.name,
        category: s.skill.category,
        proficiencyScore: s.proficiencyScore,
        yearsExperience: s.yearsExperience,
        verified: s.verified,
        endorsements: s.endorsements,
        lastUsed: s.lastUsed,
      })),
      education: education.map((e) => ({
        id: e.id,
        degree: e.degree,
        field: e.field,
        institutionName: e.institutionName,
        startDate: e.startDate,
        endDate: e.endDate,
        current: !e.endDate || new Date(e.endDate) > new Date(), // Current if no end date or future date
        verified: e.verified,
      })),
      certifications: certifications.map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        credentialId: c.credentialId,
        credentialUrl: c.credentialUrl,
        verified: c.verified,
      })),
      githubProfile: githubProfile
        ? {
            username: githubProfile.username,
            profileUrl: githubProfile.profileUrl,
            totalRepos: githubProfile.totalRepos,
            totalStars: githubProfile.totalStars,
            totalContributions: githubProfile.totalContributions,
            topLanguages: githubProfile.topLanguages as string[],
          }
        : null,
      stats: {
        totalSkills,
        verifiedSkills,
        avgProficiency,
        profileCompleteness,
        totalEducation: education.length,
        totalCertifications: certifications.length,
      },
    };
  } catch (error) {
    console.error('Error fetching public credibility data:', error);
    return null;
  }
}

export default async function PublicCredibilityPage({
  params,
  searchParams,
}: PublicCredibilityPageProps) {
  const data = await getPublicCredibilityData(params.userId, searchParams.token);

  if (!data) {
    notFound();
  }

  return <PublicCredibilityView data={data} />;
}

