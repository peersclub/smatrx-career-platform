'use client';

import { Card } from '@smatrx/ui';
import { Badge } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import {
  Shield,
  Award,
  Star,
  Crown,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
  Code,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Users,
  Target,
  Zap,
  Globe,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PublicCredibilityViewProps {
  data: {
    user: {
      name: string | null;
      image: string | null;
      emailVerified: boolean;
      memberSince: Date;
    };
    profile: {
      title: string | null | undefined;
      company: string | null | undefined;
      bio: string | null | undefined;
      location: string | null | undefined;
      yearsExperience: number | null | undefined;
      linkedinUrl: string | null | undefined;
    };
    credibilityScore: {
      overallScore: number;
      verificationLevel: string;
      breakdown: any;
      calculatedAt: Date;
      educationScore: number;
      experienceScore: number;
      technicalScore: number;
      socialScore: number;
      certificationScore: number;
    };
    skills: Array<{
      id: string;
      name: string;
      category: string | null;
      proficiencyScore: number;
      yearsExperience: number | null;
      verified: boolean;
      endorsements: number | null;
      lastUsed: Date | null;
    }>;
    education: Array<{
      id: string;
      degree: string;
      field: string | null;
      institutionName: string;
      startDate: Date | null;
      endDate: Date | null;
      current: boolean;
      verified: boolean;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      issueDate: Date;
      expiryDate: Date | null;
      credentialId: string | null;
      credentialUrl: string | null;
      verified: boolean;
    }>;
    githubProfile: {
      username: string;
      profileUrl: string | null;
      totalRepos: number;
      totalStars: number | null;
      totalContributions: number | null;
      topLanguages: string[];
    } | null;
    stats: {
      totalSkills: number;
      verifiedSkills: number;
      avgProficiency: number;
      profileCompleteness: number;
      totalEducation: number;
      totalCertifications: number;
    };
  };
}

const verificationLevelConfig = {
  basic: {
    label: 'Basic',
    color: 'bg-gray-800',
    textColor: 'text-gray-300',
    icon: Shield,
    description: 'Verified professional',
  },
  verified: {
    label: 'Verified',
    color: 'bg-gray-800',
    textColor: 'text-white',
    icon: Award,
    description: 'Highly verified professional',
  },
  premium: {
    label: 'Premium',
    color: 'bg-gray-800',
    textColor: 'text-white',
    icon: Star,
    description: 'Premium verified professional',
  },
  elite: {
    label: 'Elite',
    color: 'bg-gray-800',
    textColor: 'text-white',
    icon: Crown,
    description: 'Elite verified professional',
  },
};

const categoryIcons = {
  technical: Code,
  soft: Users,
  domain: BookOpen,
  tool: Zap,
  language: Globe,
};

export default function PublicCredibilityView({ data }: PublicCredibilityViewProps) {
  const verificationConfig =
    verificationLevelConfig[data.credibilityScore.verificationLevel as keyof typeof verificationLevelConfig] ||
    verificationLevelConfig.basic;
  const VerificationIcon = verificationConfig.icon;

  const breakdown = data.credibilityScore.breakdown || {};
  const scoreCategories = [
    { key: 'education', label: 'Education', score: data.credibilityScore.educationScore },
    { key: 'experience', label: 'Experience', score: data.credibilityScore.experienceScore },
    { key: 'technical', label: 'Technical', score: data.credibilityScore.technicalScore },
    { key: 'social', label: 'Social', score: data.credibilityScore.socialScore },
    { key: 'certifications', label: 'Certifications', score: data.credibilityScore.certificationScore },
  ];

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getMemberDuration = () => {
    const now = new Date();
    const memberSince = new Date(data.user.memberSince);
    const diffYears = now.getFullYear() - memberSince.getFullYear();
    const diffMonths = now.getMonth() - memberSince.getMonth();
    const totalMonths = diffYears * 12 + diffMonths;
    
    if (totalMonths < 1) return 'Less than a month';
    if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
    const years = Math.floor(totalMonths / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Credably
            </Link>
            <Button asChild variant="outline">
              <Link href="/auth/signin">
                Sign In <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Professional Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 mb-8 bg-gray-800/50 border-gray-700">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {data.user.image ? (
                  <img
                    src={data.user.image}
                    alt={data.user.name || 'User'}
                    className="w-32 h-32 rounded-full ring-4 ring-gray-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center ring-4 ring-gray-600">
                    <span className="text-5xl font-bold text-gray-300">
                      {data.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{data.user.name || 'Anonymous Professional'}</h1>
                    {data.profile.title && (
                      <div className="flex items-center gap-2 text-xl text-gray-300 mb-2">
                        <Briefcase className="w-5 h-5" />
                        <span>{data.profile.title}</span>
                        {data.profile.company && (
                          <span className="text-gray-500">@ {data.profile.company}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Verification Badge */}
                  <Badge className={`${verificationConfig.color} ${verificationConfig.textColor} flex items-center gap-2 px-4 py-2`}>
                    <VerificationIcon className="w-5 h-5" />
                    {verificationConfig.label}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                  {data.profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{data.profile.location}</span>
                    </div>
                  )}
                  {data.profile.yearsExperience && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{data.profile.yearsExperience} years experience</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Member for {getMemberDuration()}</span>
                  </div>
                </div>

                {/* Bio */}
                {data.profile.bio && (
                  <p className="text-gray-300 text-base mb-4 leading-relaxed">{data.profile.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex gap-3">
                  {data.user.emailVerified && (
                    <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Verified
                    </Badge>
                  )}
                  {data.githubProfile && (
                    <Badge 
                      variant="outline" 
                      className="bg-gray-800/50 text-gray-300 border-gray-700 flex items-center gap-2 cursor-pointer hover:border-purple-500"
                      onClick={() => data.githubProfile?.profileUrl && window.open(data.githubProfile.profileUrl, '_blank')}
                    >
                      <Github className="w-4 h-4" />
                      @{data.githubProfile.username}
                    </Badge>
                  )}
                  {data.profile.linkedinUrl && (
                    <Badge 
                      variant="outline" 
                      className="bg-gray-800/50 text-gray-300 border-gray-700 flex items-center gap-2 cursor-pointer hover:border-purple-500"
                      onClick={() => window.open(data.profile.linkedinUrl!, '_blank')}
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Credibility Score & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Credibility Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-gray-800/50 border-gray-700 h-full">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                Credibility Score
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Score Circle */}
                <div className="relative">
                  <svg className="w-56 h-56 transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(data.credibilityScore.overallScore / 100) * 565} 565`}
                      className="text-white transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white">{data.credibilityScore.overallScore}</div>
                      <div className="text-sm text-gray-400 mt-1">out of 100</div>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Verification Level</div>
                    <div className="text-2xl font-bold text-white">{verificationConfig.label}</div>
                    <div className="text-sm text-gray-500">{verificationConfig.description}</div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400 mb-1">Profile Completeness</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${data.stats.profileCompleteness}%` }}
                        />
                      </div>
                      <span className="text-white font-bold">{data.stats.profileCompleteness}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700 text-sm text-gray-500">
                    Last updated: {formatDate(data.credibilityScore.calculatedAt)}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 bg-gray-800/50 border-gray-700 h-full">
              <h3 className="text-lg font-bold mb-4">Profile Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total Skills</span>
                  <span className="text-2xl font-bold text-white">{data.stats.totalSkills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Verified Skills</span>
                  <span className="text-2xl font-bold text-white">{data.stats.verifiedSkills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Avg Proficiency</span>
                  <span className="text-2xl font-bold text-white">{data.stats.avgProficiency}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Education</span>
                  <span className="text-2xl font-bold text-white">{data.stats.totalEducation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Certifications</span>
                  <span className="text-2xl font-bold text-white">{data.stats.totalCertifications}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-8 mb-8 bg-gray-800/50 border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scoreCategories.map((category, idx) => {
                const categoryData = breakdown[category.key];
                const weight = categoryData?.weight || 0;

                return (
                  <div key={category.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium capitalize">{category.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-lg">{category.score}/100</span>
                        <span className="text-xs text-gray-500">({Math.round(weight * 100)}% weight)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className="bg-white h-3 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Skills & Expertise */}
        {data.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-8 mb-8 bg-gray-800/50 border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code className="w-6 h-6 text-purple-400" />
                Skills & Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.skills.map((skill) => {
                  const CategoryIcon = categoryIcons[skill.category as keyof typeof categoryIcons] || Target;
                  
                  return (
                    <div
                      key={skill.id}
                      className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-white">{skill.name}</span>
                        </div>
                        {skill.verified && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-white h-2 rounded-full"
                            style={{ width: `${skill.proficiencyScore}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{skill.proficiencyScore}% proficiency</span>
                          {skill.yearsExperience && (
                            <span>{skill.yearsExperience}y exp</span>
                          )}
                        </div>
                        {skill.endorsements && skill.endorsements > 0 && (
                          <div className="text-xs text-gray-500">
                            {skill.endorsements} endorsement{skill.endorsements > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Education & Certifications Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Education */}
          {data.education.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-6 bg-gray-800/50 border-gray-700 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  Education
                </h3>
                <div className="space-y-4">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-gray-700 pl-4 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-white">{edu.degree}</h4>
                        {edu.verified && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                      {edu.field && (
                        <p className="text-sm text-gray-400 mb-1">{edu.field}</p>
                      )}
                      <p className="text-sm text-gray-300 mb-1">{edu.institutionName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-6 bg-gray-800/50 border-gray-700 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Certifications
                </h3>
                <div className="space-y-4">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-white text-sm">{cert.name}</h4>
                        {cert.verified && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Issued: {formatDate(cert.issueDate)}
                        </p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* GitHub Stats */}
        {data.githubProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="p-8 mb-8 bg-gray-800/50 border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Github className="w-6 h-6 text-purple-400" />
                GitHub Contributions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {data.githubProfile.totalRepos}
                  </div>
                  <div className="text-sm text-gray-400">Repositories</div>
                </div>
                {data.githubProfile.totalStars !== null && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {data.githubProfile.totalStars}
                    </div>
                    <div className="text-sm text-gray-400">Stars Earned</div>
                  </div>
                )}
                {data.githubProfile.totalContributions !== null && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {data.githubProfile.totalContributions}
                    </div>
                    <div className="text-sm text-gray-400">Contributions</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {data.githubProfile.topLanguages?.length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Languages</div>
                </div>
              </div>
              
              {data.githubProfile.topLanguages && data.githubProfile.topLanguages.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-3">Top Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {data.githubProfile.topLanguages.slice(0, 8).map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="bg-gray-800 text-gray-300 border-gray-700"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.githubProfile.profileUrl && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(data.githubProfile!.profileUrl!, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View GitHub Profile
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Verification Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="p-8 mb-8 bg-gray-800/50 border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Verifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.user.emailVerified && (
                <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-sm font-semibold text-white">Email</div>
                  <div className="text-xs text-gray-400 mt-1">Verified</div>
                </div>
              )}
              {data.githubProfile && (
                <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-center">
                  <Github className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-sm font-semibold text-white">GitHub</div>
                  <div className="text-xs text-gray-400 mt-1">Connected</div>
                </div>
              )}
              {data.profile.linkedinUrl && (
                <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-center">
                  <Linkedin className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-sm font-semibold text-white">LinkedIn</div>
                  <div className="text-xs text-gray-400 mt-1">Connected</div>
                </div>
              )}
              {data.education.some((e) => e.verified) && (
                <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-center">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-sm font-semibold text-white">Education</div>
                  <div className="text-xs text-gray-400 mt-1">Verified</div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center p-12 bg-gradient-to-r from-purple-900/20 to-gray-800/30 rounded-2xl border border-purple-800/30"
        >
          <Shield className="w-16 h-16 mx-auto mb-6 text-purple-400" />
          <h3 className="text-3xl font-bold mb-4">Build Your Professional Credibility</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Join Credably to showcase your professional credibility, track your career growth, 
            and unlock new opportunities with verified credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/auth/signin">
                Get Started Free <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">
                Learn More <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Join 10,000+ verified professionals building their credibility
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Credably. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
