'use client';

import { useState } from 'react';
import { Card, Button } from '@smatrx/ui';
import { FaGithub, FaLinkedin, FaStackOverflow, FaGitlab, FaBitbucket } from 'react-icons/fa';
import { SiLeetcode, SiHackerrank, SiCodewars, SiKaggle } from 'react-icons/si';
import { HiDocumentText } from 'react-icons/hi';
import { 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface SkillsStepProps {
  user: {
    id: string;
    name?: string | null;
  };
  connectedAccounts: string[];
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function SkillsStep({ 
  user, 
  connectedAccounts,
  onComplete, 
  onSkip, 
  onBack 
}: SkillsStepProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [importing, setImporting] = useState<string | null>(null);
  const [imported, setImported] = useState<string[]>([]);

  const availableImports = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Import from your repositories',
      icon: FaGithub,
      color: 'purple',
      available: true,
      connected: connectedAccounts.includes('github'),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Import from your profile',
      icon: FaLinkedin,
      color: 'blue',
      available: true,
      connected: connectedAccounts.includes('linkedin'),
    },
    {
      id: 'resume',
      name: 'Resume',
      description: 'Upload and analyze',
      icon: HiDocumentText,
      color: 'cyan',
      available: true,
      connected: true, // Always available
    },
  ];

  const comingSoonImports = [
    {
      name: 'Stack Overflow',
      icon: FaStackOverflow,
      color: 'orange',
      description: 'Validate expertise',
    },
    {
      name: 'LeetCode',
      icon: SiLeetcode,
      color: 'yellow',
      description: 'Coding proficiency',
    },
    {
      name: 'HackerRank',
      icon: SiHackerrank,
      color: 'green',
      description: 'Technical skills',
    },
    {
      name: 'GitLab',
      icon: FaGitlab,
      color: 'orange',
      description: 'Project contributions',
    },
    {
      name: 'Bitbucket',
      icon: FaBitbucket,
      color: 'blue',
      description: 'Code repositories',
    },
    {
      name: 'Codewars',
      icon: SiCodewars,
      color: 'red',
      description: 'Kata achievements',
    },
    {
      name: 'Kaggle',
      icon: SiKaggle,
      color: 'cyan',
      description: 'Data science skills',
    },
  ];

  const handleImport = async (source: string) => {
    setImporting(source);

    try {
      const response = await fetch('/api/skills/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.needsAuth) {
          if (source === 'linkedin') {
            window.location.href = '/auth/signin?callbackUrl=/onboarding&provider=linkedin';
          } else {
            window.location.href = '/api/auth/github-extended';
          }
          return;
        }

        // Mark as imported
        setImported([...imported, source]);
        showToast('success', `Successfully imported skills from ${source}`);
      }
    } catch (error) {
      showToast('error', 'Failed to import skills. Please try again.');
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Import Your Skills</h2>
        <p className="text-gray-400">
          Connect your accounts to automatically discover and validate your skills
        </p>
      </div>

      {/* Available Imports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {availableImports.map((source) => {
          const isImported = imported.includes(source.id);
          const colorClasses = {
            purple: 'bg-purple-900/20 border-purple-700 hover:border-purple-500',
            blue: 'bg-blue-900/20 border-blue-700 hover:border-blue-500',
            cyan: 'bg-cyan-900/20 border-cyan-700 hover:border-cyan-500',
          };

          return (
            <Card
              key={source.id}
              className={`p-6 transition-all cursor-pointer ${colorClasses[source.color as keyof typeof colorClasses]}`}
              onClick={() => !isImported && !importing && handleImport(source.id)}
            >
              <div className="text-center">
                <source.icon className={`w-12 h-12 mx-auto mb-3 text-${source.color}-500`} />
                <h3 className="font-semibold mb-1">{source.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{source.description}</p>
                
                {isImported ? (
                  <div className="flex items-center justify-center gap-2 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Imported</span>
                  </div>
                ) : importing === source.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Importing...</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!source.connected && source.id !== 'resume'}
                  >
                    {source.connected ? 'Import' : 'Connect First'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Coming Soon Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Coming Soon - More Validators</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {comingSoonImports.map((source) => (
            <Card
              key={source.name}
              className="p-4 bg-gray-900/50 border-gray-800 opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <source.icon className={`w-8 h-8 text-${source.color}-500/50`} />
                  <Lock className="w-4 h-4 absolute -bottom-1 -right-1 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{source.name}</p>
                  <p className="text-xs text-gray-500">{source.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8">
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
            onClick={onComplete}
            className="gap-2"
            disabled={imported.length === 0}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500 mt-4">
        You can always import more skills later from your{' '}
        <button
          onClick={() => router.push('/skills')}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          skills page
        </button>
      </p>
    </div>
  );
}
