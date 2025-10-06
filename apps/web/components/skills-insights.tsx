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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingVerification, setRequestingVerification] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    generateInsights();
  }, [skills]);

  const generateInsights = async () => {
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

  if (loading) {
    return <LoadingState message="Analyzing your skills..." size="lg" />;
  }

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
  
  // Ensure all properties exist
  const safeData = {
    skillStrength: data.skillStrength || { score: 0, label: 'Starting', description: 'Import skills to begin' },
    topSkills: data.topSkills || [],
    careerReadiness: {
      score: data.careerReadiness?.score || 0,
      readyFor: data.careerReadiness?.readyFor || [],
      gaps: data.careerReadiness?.gaps || []
    },
    recommendations: data.recommendations || [],
    industryComparison: data.industryComparison || { averageScore: 65, userScore: 0, percentile: 0 },
    verificationStatus: data.verificationStatus || { verified: 0, pending: 0, unverified: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Skills Strength Overview */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-400" />
              Skills Analysis
            </h3>
            <p className="text-gray-400 mb-4">{safeData.skillStrength.description}</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-purple-400">
                {safeData.skillStrength.score}%
              </div>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {safeData.skillStrength.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-2">Industry Percentile</div>
            <div className="text-3xl font-bold text-pink-400">
              Top {safeData.industryComparison.percentile}%
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills & Market Trends */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Skills & Market Trends
          </h3>
          <div className="space-y-4">
            {(safeData.topSkills || []).map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{skill.name}</h4>
                  <p className="text-sm text-gray-500">{skill.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={skill.marketDemand === 'high' ? 'default' : 'secondary'}
                    className={skill.marketDemand === 'high' ? 'bg-green-500' : ''}
                  >
                    {skill.marketDemand} demand
                  </Badge>
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{skill.growthTrend}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Career Readiness */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Career Readiness
          </h3>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Ready for next level</span>
              <span>{safeData.careerReadiness.score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${safeData.careerReadiness.score}%` }}
              />
            </div>
          </div>
          <div className="space-y-3">
            {safeData.careerReadiness.readyFor && safeData.careerReadiness.readyFor.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">You're ready for:</p>
                <div className="flex flex-wrap gap-2">
                  {safeData.careerReadiness.readyFor.map((role, idx) => (
                    <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {safeData.careerReadiness.gaps && safeData.careerReadiness.gaps.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Skills to develop:</p>
                <div className="flex flex-wrap gap-2">
                  {safeData.careerReadiness.gaps.map((gap, idx) => (
                    <Badge key={idx} variant="outline" className="text-orange-400 border-orange-400">
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
            <Shield className="w-5 h-5 text-green-500" />
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
          <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800">
            <div className="text-2xl font-bold text-green-400">{safeData.verificationStatus.verified}</div>
            <p className="text-sm text-gray-500">Verified</p>
          </div>
          <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
            <div className="text-2xl font-bold text-yellow-400">{safeData.verificationStatus.pending}</div>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="text-center p-4 bg-gray-900/20 rounded-lg border border-gray-800">
            <div className="text-2xl font-bold text-gray-400">{safeData.verificationStatus.unverified}</div>
            <p className="text-sm text-gray-500">Unverified</p>
          </div>
        </div>

        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
          <p className="text-sm text-blue-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Industry experts can verify your skills to boost credibility. Verified skills get 3x more visibility to recruiters.
          </p>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI-Powered Recommendations
        </h3>
        <div className="space-y-4">
          {(safeData.recommendations || []).map((rec, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
              <div className="flex-shrink-0">
                {rec.type === 'skill' && <Zap className="w-5 h-5 text-yellow-500" />}
                {rec.type === 'certification' && <Award className="w-5 h-5 text-blue-500" />}
                {rec.type === 'project' && <BarChart3 className="w-5 h-5 text-green-500" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-500">{rec.description}</p>
              </div>
              <Badge 
                variant={rec.priority === 'high' ? 'default' : 'secondary'}
                className={rec.priority === 'high' ? 'bg-red-500' : ''}
              >
                {rec.priority} priority
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-800">
          <p className="text-sm text-purple-300 mb-3">
            Want personalized learning paths based on your goals?
          </p>
          <Button variant="outline" className="w-full gap-2">
            Create Learning Plan <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
