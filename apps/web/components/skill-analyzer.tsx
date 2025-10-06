'use client';

import { useState } from 'react';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { Brain, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface SkillAnalyzerProps {
  onAnalysisComplete?: (analysis: any) => void;
}

export default function SkillAnalyzer({ onAnalysisComplete }: SkillAnalyzerProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/skills/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text-analysis',
          data: {
            text,
            context: 'general',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError('Failed to analyze skills. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-semibold">AI Skill Analyzer</h2>
      </div>

      <p className="text-gray-400 mb-4">
        Paste your resume, job description, or any text describing your skills and experience.
        Our AI will extract and analyze your skills.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full h-48 px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
        disabled={isAnalyzing}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {text.length > 0 && `${text.split(' ').length} words`}
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!text.trim() || isAnalyzing}
          className="gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Skills
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Detected Skills ({analysis.skills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skills?.map((skill: any, index: number) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm"
                >
                  {skill.name}
                  <span className="ml-2 text-xs text-gray-500">
                    {Math.round(skill.confidence)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {analysis.insights && (
            <div>
              <h3 className="font-semibold mb-2">Career Insights</h3>
              <div className="space-y-2 text-sm">
                {analysis.insights.strengths?.length > 0 && (
                  <div>
                    <span className="text-green-500">Strengths:</span>{' '}
                    {analysis.insights.strengths.join(', ')}
                  </div>
                )}
                {analysis.insights.opportunities?.length > 0 && (
                  <div>
                    <span className="text-cyan-500">Opportunities:</span>{' '}
                    {analysis.insights.opportunities.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {analysis.recommendations?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Recommended Skills to Learn</h3>
              <div className="space-y-2">
                {analysis.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{rec.skill}</span>
                    <span className="text-gray-500 ml-2">({rec.priority} priority)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
