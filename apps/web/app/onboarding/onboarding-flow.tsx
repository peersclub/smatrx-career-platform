'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@smatrx/ui';
import { 
  User, 
  Brain, 
  Target, 
  Settings, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Rocket
} from 'lucide-react';
import ProfileStep from './steps/profile-step';
import SkillsStep from './steps/skills-step';
import CareerGoalsStep from './steps/career-goals-step';
import PreferencesStep from './steps/preferences-step';
import CompletionStep from './steps/completion-step';

interface OnboardingFlowProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  progress: {
    profileCompleted: boolean;
    skillsImported: boolean;
    careerGoalsSet: boolean;
    preferencesSet: boolean;
  };
  progressPercentage: number;
  connectedAccounts: string[];
}

export default function OnboardingFlow({ 
  user, 
  progress, 
  progressPercentage,
  connectedAccounts 
}: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(
    !progress.profileCompleted ? 1 :
    !progress.skillsImported ? 2 :
    !progress.careerGoalsSet ? 3 :
    !progress.preferencesSet ? 4 : 5
  );

  const steps = [
    {
      id: 1,
      title: 'Complete Your Profile',
      description: 'Tell us about yourself and your professional background',
      icon: User,
      completed: progress.profileCompleted,
    },
    {
      id: 2,
      title: 'Import Your Skills',
      description: 'Connect your accounts to automatically import your skills',
      icon: Brain,
      completed: progress.skillsImported,
    },
    {
      id: 3,
      title: 'Set Career Goals',
      description: 'Define your career aspirations and target roles',
      icon: Target,
      completed: progress.careerGoalsSet,
    },
    {
      id: 4,
      title: 'Preferences',
      description: 'Set your work preferences and availability',
      icon: Settings,
      completed: progress.preferencesSet,
    },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleComplete = async () => {
    // Mark onboarding as complete
    await fetch('/api/onboarding/complete', {
      method: 'POST',
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Welcome to Credably
              </h1>
              <span className="text-sm text-gray-400">
                Complete your profile to get started
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Your Progress</span>
            <span className="text-sm font-semibold text-purple-400">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                ${step.completed 
                  ? 'bg-green-900/30 border-green-500 text-green-400' 
                  : currentStep === step.id
                  ? 'bg-purple-900/30 border-purple-500 text-purple-400'
                  : 'bg-gray-900/30 border-gray-700 text-gray-500'
                }
              `}>
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-full h-1 mx-2 transition-all
                  ${step.completed ? 'bg-green-500' : 'bg-gray-700'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <ProfileStep 
              user={user}
              onComplete={handleNext}
              onSkip={handleSkip}
            />
          )}
          {currentStep === 2 && (
            <SkillsStep
              user={user}
              connectedAccounts={connectedAccounts}
              onComplete={handleNext}
              onSkip={handleSkip}
              onBack={handlePrevious}
            />
          )}
          {currentStep === 3 && (
            <CareerGoalsStep
              user={user}
              onComplete={handleNext}
              onSkip={handleSkip}
              onBack={handlePrevious}
            />
          )}
          {currentStep === 4 && (
            <PreferencesStep
              user={user}
              onComplete={handleNext}
              onSkip={handleSkip}
              onBack={handlePrevious}
            />
          )}
          {currentStep === 5 && (
            <CompletionStep
              user={user}
              progressPercentage={progressPercentage}
              onComplete={handleComplete}
            />
          )}
        </div>

        {/* Motivational Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400 mb-2">
            <Sparkles className="inline-block w-4 h-4 mr-1 text-yellow-500" />
            Complete your profile to unlock personalized career insights
          </p>
          <p className="text-sm text-gray-500">
            Join thousands of professionals transforming their careers with Credably
          </p>
        </div>
      </div>
    </div>
  );
}
