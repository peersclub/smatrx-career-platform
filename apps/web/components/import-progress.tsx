'use client';

import { useEffect, useState } from 'react';
import { Card } from '@smatrx/ui';
import { Badge } from '@smatrx/ui';
import { Loader2, CheckCircle, XCircle, Github, Linkedin, FileText } from 'lucide-react';

interface ImportProgressProps {
  importId: string;
  source: string;
  onComplete?: () => void;
}

export default function ImportProgress({ importId, source, onComplete }: ImportProgressProps) {
  const [importData, setImportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/skills/import/${importId}`);
        if (response.ok) {
          const data = await response.json();
          setImportData(data);
          
          if (data.status === 'completed' || data.status === 'failed') {
            onComplete?.();
          }
        } else {
          setError('Failed to fetch import progress');
        }
      } catch (err) {
        console.error('Error fetching import progress:', err);
        setError('Error fetching import progress');
      }
    };

    const interval = setInterval(fetchProgress, 1000);
    fetchProgress(); // Initial fetch

    return () => clearInterval(interval);
  }, [importId, onComplete]);

  const getSourceIcon = () => {
    switch (source) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'resume':
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    if (!importData) return <Loader2 className="w-5 h-5 animate-spin" />;
    
    switch (importData.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin text-purple-500" />;
    }
  };

  const getProgress = () => {
    if (!importData?.results?.progress) return 0;
    return importData.results.progress;
  };

  const getMessage = () => {
    if (!importData) return 'Starting import...';
    if (importData.error) return importData.error;
    if (importData.results?.message) return importData.results.message;
    
    switch (importData.status) {
      case 'pending':
        return 'Preparing to import...';
      case 'processing':
        return 'Analyzing your data...';
      case 'completed':
        return 'Import completed successfully!';
      case 'failed':
        return 'Import failed. Please try again.';
      default:
        return 'Processing...';
    }
  };

  const getResults = () => {
    if (!importData?.results || importData.status !== 'completed') return null;
    
    const results = importData.results;
    return (
      <div className="mt-4 space-y-2">
        {results.languagesFound > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Programming Languages:</span>
            <Badge variant="secondary">{results.languagesFound}</Badge>
          </div>
        )}
        {results.frameworksFound > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Frameworks & Libraries:</span>
            <Badge variant="secondary">{results.frameworksFound}</Badge>
          </div>
        )}
        {results.toolsFound > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Tools & Technologies:</span>
            <Badge variant="secondary">{results.toolsFound}</Badge>
          </div>
        )}
        {results.reposAnalyzed > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Repositories Analyzed:</span>
            <Badge variant="secondary">{results.reposAnalyzed}</Badge>
          </div>
        )}
        {results.primaryLanguage && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Primary Language:</span>
            <Badge>{results.primaryLanguage}</Badge>
          </div>
        )}
        {results.createdSkills?.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-400 mb-2">New Skills Added:</p>
            <div className="flex flex-wrap gap-2">
              {results.createdSkills.slice(0, 10).map((skill: string) => (
                <Badge key={skill} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {results.createdSkills.length > 10 && (
                <Badge variant="secondary" className="text-xs">
                  +{results.createdSkills.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <Card className="p-6 border-red-800 bg-red-900/20">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-400">{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3">
          {getSourceIcon()}
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 capitalize">{source} Import</h3>
          <p className="text-sm text-gray-400 mb-3">{getMessage()}</p>
          
          {importData?.status === 'processing' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{getProgress()}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          )}
          
          {getResults()}
        </div>
      </div>
    </Card>
  );
}
