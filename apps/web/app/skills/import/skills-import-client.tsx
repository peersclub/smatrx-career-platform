'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { 
  Github, 
  Linkedin, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SkillsImportClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function SkillsImportClient({ user }: SkillsImportClientProps) {
  const [importing, setImporting] = useState<string | null>(null);
  const [imported, setImported] = useState<Record<string, boolean>>({
    github: false,
    linkedin: false,
    resume: false
  });

  const handleImport = async (source: 'github' | 'linkedin' | 'resume') => {
    setImporting(source);
    
    // Simulate import process
    setTimeout(() => {
      setImported(prev => ({ ...prev, [source]: true }));
      setImporting(null);
    }, 2000);

    // TODO: Implement actual import logic
    console.log(`Importing from ${source}...`);
  };

  const importOptions = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'text-purple-400',
      borderColor: 'hover:border-purple-500',
      description: 'Import skills from your repositories and contributions',
      features: [
        'Programming languages used',
        'Frameworks and libraries',
        'Project complexity analysis',
        'Contribution consistency'
      ],
      action: 'Connect GitHub',
      comingSoon: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-400',
      borderColor: 'hover:border-blue-500',
      description: 'Sync skills, experience, and endorsements from your profile',
      features: [
        'Listed skills',
        'Endorsements',
        'Work experience',
        'Certifications'
      ],
      action: 'Connect LinkedIn',
      comingSoon: false
    },
    {
      id: 'resume',
      name: 'Resume/CV',
      icon: FileText,
      color: 'text-green-400',
      borderColor: 'hover:border-green-500',
      description: 'Upload your resume to extract skills automatically',
      features: [
        'Technical skills',
        'Soft skills',
        'Tools and technologies',
        'Industry experience'
      ],
      action: 'Upload Resume',
      comingSoon: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation user={user} variant="authenticated" />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Upload className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Import Your Skills</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect your accounts to automatically import and analyze your skills
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 p-6 bg-purple-900/20 border border-purple-800 rounded-xl max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  AI-Powered Skill Analysis
                </h3>
                <p className="text-gray-300">
                  Our AI will analyze your imported data to identify not just the skills you list, 
                  but also infer your proficiency levels, related skills, and growth areas. The more 
                  sources you connect, the more accurate your skill profile becomes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Import Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {importOptions.map((option, index) => {
              const Icon = option.icon;
              const isImporting = importing === option.id;
              const isImported = imported[option.id as keyof typeof imported];

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className={`p-8 h-full flex flex-col ${option.borderColor} transition-all duration-200`}>
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`w-12 h-12 ${option.color}`} />
                        {isImported && (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{option.name}</h3>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-6 flex-1">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-3">
                        What we'll import:
                      </p>
                      <ul className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    {option.comingSoon ? (
                      <Button 
                        disabled 
                        className="w-full"
                        variant="outline"
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleImport(option.id as 'github' | 'linkedin' | 'resume')}
                        disabled={isImporting || isImported}
                        className={`w-full ${
                          isImported 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        } text-white`}
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : isImported ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Imported
                          </>
                        ) : (
                          <>
                            {option.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}

                    {isImported && (
                      <Link 
                        href={`/skills?source=${option.id}`}
                        className="text-purple-400 hover:text-purple-300 text-sm text-center mt-3 flex items-center justify-center gap-1"
                      >
                        View imported skills
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <Card className="p-8 bg-gray-800/30 border-gray-700">
              <h3 className="text-xl font-bold mb-4">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-purple-400">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Import & Analyze</h4>
                  <p className="text-sm text-gray-400">
                    We'll analyze your data to identify skills and proficiency levels
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-purple-400">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Review & Confirm</h4>
                  <p className="text-sm text-gray-400">
                    Check the imported skills and make any adjustments needed
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-purple-400">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Get Recommendations</h4>
                  <p className="text-sm text-gray-400">
                    Receive personalized career insights and learning paths
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Manual Entry Option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400 mb-4">Prefer to add skills manually?</p>
            <Link href="/skills">
              <Button variant="outline">
                <LinkIcon className="w-4 h-4 mr-2" />
                Go to Skills Page
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

