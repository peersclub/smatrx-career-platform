'use client';

import { useState } from 'react';
import { Card, Button } from '@smatrx/ui';
import { ArrowRight, ArrowLeft, Target, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CareerGoalsStepProps {
  user: {
    id: string;
  };
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function CareerGoalsStep({ user, onComplete, onSkip, onBack }: CareerGoalsStepProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    careerStage: '',
    targetRole: '',
    industries: [] as string[],
    skills: [] as string[],
    timeline: '',
  });

  const careerStages = [
    { value: 'student', label: 'Student / Recent Graduate' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'lead', label: 'Lead / Principal (10+ years)' },
    { value: 'executive', label: 'Executive / C-Level' },
  ];

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
    'Gaming', 'Media', 'Consulting', 'Startups', 'Enterprise',
  ];

  const timelineOptions = [
    { value: 'immediate', label: 'Immediately' },
    { value: '3months', label: 'Within 3 months' },
    { value: '6months', label: 'Within 6 months' },
    { value: '1year', label: 'Within 1 year' },
    { value: 'exploring', label: 'Just exploring' },
  ];

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            careerStage: formData.careerStage,
            targetRole: formData.targetRole,
            industries: formData.industries,
            careerTimeline: formData.timeline,
          },
        }),
      });

      if (response.ok) {
        showToast('success', 'Career goals saved!');
        onComplete();
      }
    } catch (error) {
      showToast('error', 'Failed to save career goals');
    } finally {
      setLoading(false);
    }
  };

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const isValid = formData.careerStage && formData.industries.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Define Your Career Goals</h2>
        <p className="text-gray-400">
          Help us understand where you want to go in your career journey
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Career Stage */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Current Career Stage <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {careerStages.map((stage) => (
                <button
                  key={stage.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, careerStage: stage.value })}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    formData.careerStage === stage.value
                      ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                      : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Role or Position
            </label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Senior Full Stack Engineer, Tech Lead, CTO"
            />
          </div>

          {/* Industries */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Industries of Interest <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    formData.industries.includes(industry)
                      ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                      : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium mb-3">
              When are you looking to make a change?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timelineOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, timeline: option.value })}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    formData.timeline === option.value
                      ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                      : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Motivational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-purple-900/20 border-purple-700">
          <Target className="w-6 h-6 text-purple-400 mb-2" />
          <h4 className="font-medium mb-1">Personalized Roadmap</h4>
          <p className="text-sm text-gray-400">
            Get a custom learning path based on your goals
          </p>
        </Card>
        <Card className="p-4 bg-pink-900/20 border-pink-700">
          <TrendingUp className="w-6 h-6 text-pink-400 mb-2" />
          <h4 className="font-medium mb-1">Market Insights</h4>
          <p className="text-sm text-gray-400">
            See demand and salary trends for your target role
          </p>
        </Card>
        <Card className="p-4 bg-cyan-900/20 border-cyan-700">
          <Zap className="w-6 h-6 text-cyan-400 mb-2" />
          <h4 className="font-medium mb-1">Skill Gap Analysis</h4>
          <p className="text-sm text-gray-400">
            Identify what skills you need to reach your goals
          </p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-gray-400"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
