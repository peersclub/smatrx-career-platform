'use client';

import { Card, Button } from '@smatrx/ui';
import { 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  ArrowRight,
  Confetti
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompletionStepProps {
  user: {
    id: string;
    name?: string | null;
  };
  progressPercentage: number;
  onComplete: () => void;
}

export default function CompletionStep({ user, progressPercentage, onComplete }: CompletionStepProps) {
  const router = useRouter();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Personalized Career Insights',
      description: 'Get AI-powered recommendations based on your profile',
    },
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      description: 'See exactly what skills you need for your dream role',
    },
    {
      icon: Users,
      title: 'Industry Connections',
      description: 'Connect with professionals in your field',
    },
    {
      icon: Sparkles,
      title: 'Learning Pathways',
      description: 'Custom learning recommendations to reach your goals',
    },
  ];

  return (
    <div className="space-y-6 text-center">
      {/* Success Animation */}
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
        </div>
      </div>

      {/* Congratulations Message */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-3">
          🎉 Congratulations{user.name ? `, ${user.name}` : ''}!
        </h2>
        <p className="text-xl text-gray-400">
          You've completed {progressPercentage}% of your profile setup
        </p>
      </div>

      {/* What's Next */}
      <Card className="p-8 bg-gradient-to-b from-purple-900/20 to-transparent border-purple-700">
        <h3 className="text-2xl font-semibold mb-6">What's Next?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-left">
              <div className="flex items-start gap-3">
                <benefit.icon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium mb-1">{benefit.title}</h4>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onComplete}
            size="lg"
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/skills')}
            className="gap-2"
          >
            Explore Your Skills
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="p-4 hover:border-purple-500 transition-colors cursor-pointer">
          <h4 className="font-medium mb-1">📚 Browse Learning Paths</h4>
          <p className="text-sm text-gray-400">
            Discover courses to upskill
          </p>
        </Card>
        <Card className="p-4 hover:border-pink-500 transition-colors cursor-pointer">
          <h4 className="font-medium mb-1">🎯 Set Career Goals</h4>
          <p className="text-sm text-gray-400">
            Define your next milestone
          </p>
        </Card>
        <Card className="p-4 hover:border-cyan-500 transition-colors cursor-pointer">
          <h4 className="font-medium mb-1">👥 Join Community</h4>
          <p className="text-sm text-gray-400">
            Connect with peers
          </p>
        </Card>
      </div>

      {/* Footer Message */}
      <p className="text-sm text-gray-500 mt-8">
        Remember, you can always update your profile and import more skills from your{' '}
        <button
          onClick={() => router.push('/profile')}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          profile settings
        </button>
      </p>
    </div>
  );
}
