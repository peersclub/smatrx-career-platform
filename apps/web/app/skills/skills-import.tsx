'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import ResumeUpload from '@/components/resume-upload';
import ImportProgress from '@/components/import-progress';

interface SkillsImportProps {
  userId: string;
  recentImports: Array<{
    id: string;
    source: string;
    status: string;
    startedAt: Date;
    completedAt: Date | null;
    error: string | null;
  }>;
}

export default function SkillsImport({ userId, recentImports }: SkillsImportProps) {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState<string | null>(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [activeImportId, setActiveImportId] = useState<string | null>(null);

  const handleImport = async (source: 'github' | 'linkedin' | 'resume') => {
    setIsImporting(source);

    try {
      const response = await fetch('/api/skills/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.needsAuth) {
          if (data.provider === 'linkedin') {
            // Redirect to sign in with LinkedIn
            window.location.href = '/auth/signin?callbackUrl=/skills&provider=linkedin';
          } else {
            window.location.href = '/api/auth/github-extended';
          }
          return;
        }

        // Set active import ID to show progress
        if (data.importId) {
          setActiveImportId(data.importId);
        }
      } else {
        console.error('Import failed');
        setIsImporting(null);
      }
    } catch (error) {
      console.error('Import error:', error);
      setIsImporting(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', className: 'bg-green-900/30 text-green-400 border-green-700' };
      case 'failed':
        return { text: 'Failed', className: 'bg-red-900/30 text-red-400 border-red-700' };
      case 'processing':
        return { text: 'Processing', className: 'bg-yellow-900/30 text-yellow-400 border-yellow-700' };
      default:
        return { text: 'Pending', className: 'bg-gray-900/30 text-gray-400 border-gray-700' };
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleRetry = (source: string) => {
    handleImport(source as 'github' | 'linkedin' | 'resume');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Import Skills</h2>
      
      {/* Active Import Progress */}
      {activeImportId && isImporting && (
        <div className="mb-6">
          <ImportProgress 
            importId={activeImportId} 
            source={isImporting}
            onComplete={() => {
              setActiveImportId(null);
              setIsImporting(null);
              router.refresh();
            }}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          className="p-6 hover:border-purple-500 transition-colors cursor-pointer"
          onClick={() => handleImport('github')}
        >
          <div className="text-center">
            <FaGithub className="w-16 h-16 mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold mb-1">GitHub</h3>
            <p className="text-sm text-gray-500 mb-4">
              Analyze your repositories and contributions
            </p>
            <Button 
              disabled={isImporting !== null}
              className="w-full"
            >
              {isImporting === 'github' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import from GitHub'
              )}
            </Button>
          </div>
        </Card>

        <Card 
          className="p-6 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => handleImport('linkedin')}
        >
          <div className="text-center">
            <FaLinkedin className="w-16 h-16 mx-auto mb-3 text-blue-500" />
            <h3 className="font-semibold mb-1">LinkedIn</h3>
            <p className="text-sm text-gray-500 mb-4">
              Import skills from your LinkedIn profile
            </p>
            <Button 
              disabled={isImporting !== null}
              className="w-full"
            >
              {isImporting === 'linkedin' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import from LinkedIn'
              )}
            </Button>
          </div>
        </Card>

        <Card 
          className="p-6 hover:border-cyan-500 transition-colors cursor-pointer"
          onClick={() => setShowResumeUpload(true)}
        >
          <div className="text-center">
            <HiDocumentText className="w-16 h-16 mx-auto mb-3 text-cyan-500" />
            <h3 className="font-semibold mb-1">Resume</h3>
            <p className="text-sm text-gray-500 mb-4">
              Extract skills from your resume
            </p>
            <Button 
              disabled={isImporting !== null}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowResumeUpload(true);
              }}
            >
              Upload Resume
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Imports */}
      {recentImports.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Imports</h3>
            <span className="text-sm text-gray-500">Last 5 imports</span>
          </div>
          <div className="space-y-3">
            {recentImports.map((imp) => {
              const statusLabel = getStatusLabel(imp.status);
              return (
                <div key={imp.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(imp.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{imp.source}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusLabel.className}`}>
                          {statusLabel.text}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(imp.startedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {imp.error && (
                      <span className="text-xs text-red-400 max-w-[200px] truncate" title={imp.error}>
                        {imp.error}
                      </span>
                    )}
                    {imp.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetry(imp.source)}
                        className="text-xs"
                        disabled={isImporting !== null}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload Your Resume</h2>
              <button
                onClick={() => setShowResumeUpload(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <ResumeUpload 
              onUploadComplete={(analysis) => {
                setShowResumeUpload(false);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
