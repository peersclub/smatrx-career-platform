'use client';

import { useState, useEffect } from 'react';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { Badge } from '@smatrx/ui';
import { ErrorAlert } from '@/components/error-alert';
import { LoadingState } from '@/components/loading-state';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Zap, 
  Shield,
  Award,
  Users,
  BarChart3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  proficiencyScore: number;
  verified: boolean;
  source: string;
}

interface SkillsInsightsProps {
  skills: Skill[];
  userId: string;
}

interface InsightsData {
  skillStrength: {
    score: number;
    label: string;
    description: string;
  };
  topSkills: Array<{
    name: string;
    category: string;
    marketDemand: 'high' | 'medium' | 'low';
    growthTrend: number;
  }>;
  careerReadiness: {
    score: number;
    readyFor: string[];
    gaps: string[];
  };
  recommendations: Array<{
    type: 'skill' | 'certification' | 'project';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  industryComparison: {
    averageScore: number;
    userScore: number;
    percentile: number;
  };
  verificationStatus: {
    verified: number;
    pending: number;
    unverified: number;
  };
}

export default function SkillsInsights({ skills, userId }: SkillsInsightsProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestingVerification, setRequestingVerification] = useState(false);
  const { showToast } = useToast();

  // Don't auto-fetch on mount - use default insights instead
  // useEffect(() => {
  //   generateInsights();
  // }, [skills]);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/skills/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setError('Unable to generate insights. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const requestVerification = async () => {
    setRequestingVerification(true);
    try {
      const response = await fetch('/api/skills/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skills: skills.filter(s => !s.verified).map(s => s.id) 
        }),
      });

      if (response.ok) {
        showToast('success', 'Verification request sent! Industry experts will review your skills.');
      } else {
        throw new Error('Failed to send verification request');
      }
    } catch (error) {
      console.error('Failed to request verification:', error);
      showToast('error', 'Failed to send verification request. Please try again.');
    } finally {
      setRequestingVerification(false);
    }
  };

  // Removed automatic loading state - now uses default insights immediately
  // if (loading) {
  //   return <LoadingState message="Analyzing your skills..." size="lg" />;
  // }

  if (error) {
    return (
      <Card className="p-6">
        <ErrorAlert error={error} />
        <Button onClick={generateInsights} className="mt-4">
          Try Again
        </Button>
      </Card>
    );
  }

  // Fallback insights if API call fails
  const defaultInsights: InsightsData = {
    skillStrength: {
      score: Math.round(skills.reduce((acc, s) => acc + s.proficiencyScore, 0) / skills.length),
      label: skills.length > 10 ? 'Strong' : 'Growing',
      description: skills.length > 10 
        ? 'Your diverse skill set positions you well for senior roles'
        : 'Keep building your skills to unlock more opportunities'
    },
    topSkills: skills
      .sort((a, b) => b.proficiencyScore - a.proficiencyScore)
      .slice(0, 3)
      .map(s => ({
        name: s.name,
        category: s.category,
        marketDemand: s.proficiencyScore > 80 ? 'high' : 'medium',
        growthTrend: s.proficiencyScore > 80 ? 15 : 8
      })),
    careerReadiness: {
      score: Math.round(skills.filter(s => s.proficiencyScore > 70).length / skills.length * 100),
      readyFor: skills.some(s => s.name === 'TypeScript' && s.proficiencyScore > 70) 
        ? ['Senior Frontend Developer', 'Full Stack Engineer', 'Tech Lead']
        : ['Frontend Developer', 'Software Engineer'],
      gaps: ['Cloud Architecture', 'System Design', 'DevOps']
    },
    recommendations: [
      {
        type: 'skill',
        title: 'Learn Cloud Platforms',
        description: 'AWS or Azure skills are in high demand',
        priority: 'high'
      },
      {
        type: 'certification',
        title: 'Get AWS Certified',
        description: 'Validate your cloud expertise',
        priority: 'medium'
      }
    ],
    industryComparison: {
      averageScore: 65,
      userScore: Math.round(skills.reduce((acc, s) => acc + s.proficiencyScore, 0) / skills.length),
      percentile: 75
    },
    verificationStatus: {
      verified: skills.filter(s => s.verified).length,
      pending: 0,
      unverified: skills.filter(s => !s.verified).length
    }
  };

  const data = insights || defaultInsights;
  
  // Ensure all properties exist, with fallbacks to user's actual skills
  const safeData = {
    skillStrength: data.skillStrength || defaultInsights.skillStrength,
    topSkills: (data.topSkills && data.topSkills.length > 0) ? data.topSkills : defaultInsights.topSkills,
    careerReadiness: {
      score: data.careerReadiness?.score || defaultInsights.careerReadiness.score,
      readyFor: (data.careerReadiness?.readyFor && data.careerReadiness.readyFor.length > 0) 
        ? data.careerReadiness.readyFor 
        : defaultInsights.careerReadiness.readyFor,
      gaps: (data.careerReadiness?.gaps && data.careerReadiness.gaps.length > 0)
        ? data.careerReadiness.gaps
        : defaultInsights.careerReadiness.gaps
    },
    recommendations: (data.recommendations && data.recommendations.length > 0) 
      ? data.recommendations 
      : defaultInsights.recommendations,
    industryComparison: data.industryComparison || defaultInsights.industryComparison,
    verificationStatus: data.verificationStatus || defaultInsights.verificationStatus
  };

  return (
    <div className="space-y-6">
      {/* Skills Strength Overview */}
      <Card className="p-6 bg-gray-800/30 border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Brain className="w-8 h-8 text-gray-400" />
              Skills Analysis
            </h3>
            <p className="text-gray-400 mb-4">{safeData.skillStrength.description}</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-white">
                {safeData.skillStrength.score}%
              </div>
              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                {safeData.skillStrength.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-2">Industry Percentile</div>
            <div className="text-3xl font-bold text-white">
              Top {safeData.industryComparison.percentile}%
            </div>
          </div>
        </div>
        
        {/* Optional AI Enhancement Button */}
        {!insights && !loading && (
          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Get AI-Powered Insights
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Get enhanced recommendations and market insights (optional)
            </p>
          </div>
        )}
        
        {loading && (
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating AI insights...
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills & Market Trends */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Top Skills & Market Trends
          </h3>
          {safeData.topSkills && safeData.topSkills.length > 0 ? (
            <div className="space-y-4">
              {safeData.topSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div>
                    <h4 className="font-medium text-white">{skill.name}</h4>
                    <p className="text-sm text-gray-400">{skill.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                      {skill.marketDemand} demand
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+{skill.growthTrend}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-600 opacity-50" />
              <p className="text-sm text-gray-400 mb-2">No skills imported yet</p>
              <p className="text-xs text-gray-500">Import skills from GitHub, LinkedIn, or your resume to see market trends</p>
            </div>
          )}
        </Card>

        {/* Career Readiness */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" />
            Career Readiness
          </h3>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Ready for next level</span>
              <span className="text-white">{safeData.careerReadiness.score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${safeData.careerReadiness.score}%` }}
              />
            </div>
          </div>
          <div className="space-y-3">
            {safeData.careerReadiness.readyFor && safeData.careerReadiness.readyFor.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">You're ready for:</p>
                <div className="flex flex-wrap gap-2">
                  {safeData.careerReadiness.readyFor.map((role, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gray-800 text-white border-gray-700">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {safeData.careerReadiness.gaps && safeData.careerReadiness.gaps.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Skills to develop:</p>
                <div className="flex flex-wrap gap-2">
                  {safeData.careerReadiness.gaps.map((gap, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Verification Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Skill Verification Status
          </h3>
          <Button
            onClick={requestVerification}
            disabled={requestingVerification || safeData.verificationStatus.unverified === 0}
            size="sm"
            className="gap-2"
          >
            {requestingVerification ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Request Verification
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">{safeData.verificationStatus.verified}</div>
            <p className="text-sm text-gray-400">Verified</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-gray-300">{safeData.verificationStatus.pending}</div>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-gray-400">{safeData.verificationStatus.unverified}</div>
            <p className="text-sm text-gray-500">Unverified</p>
          </div>
        </div>

        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            Industry experts can verify your skills to boost credibility. Verified skills get 3x more visibility to recruiters.
          </p>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI-Powered Recommendations
        </h3>
        {safeData.recommendations && safeData.recommendations.length > 0 ? (
          <>
            <div className="space-y-4">
              {safeData.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors">
                  <div className="flex-shrink-0">
                    {rec.type === 'skill' && <Zap className="w-5 h-5 text-gray-400" />}
                    {rec.type === 'certification' && <Award className="w-5 h-5 text-gray-400" />}
                    {rec.type === 'project' && <BarChart3 className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-white">{rec.title}</h4>
                    <p className="text-sm text-gray-400">{rec.description}</p>
                  </div>
                  <Badge variant="outline" className={`${
                    rec.priority === 'high' 
                      ? 'bg-gray-800 text-white border-gray-700' 
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}>
                    {rec.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300 mb-3">
                Want personalized learning paths based on your goals?
              </p>
              <div className="flex justify-center">
                <Button variant="outline" className="gap-2">
                  Create Learning Plan <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-600 opacity-50" />
            <p className="text-sm text-gray-400 mb-2">No recommendations yet</p>
            <p className="text-xs text-gray-500">Import more skills to get AI-powered recommendations for career growth</p>
          </div>
        )}
      </Card>
    </div>
  );
}
