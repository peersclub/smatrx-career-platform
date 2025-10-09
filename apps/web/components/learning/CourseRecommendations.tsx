'use client';

import { useState } from 'react';
import { Button } from '@smatrx/ui';
import { Card } from '@smatrx/ui';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import CourseRecommendationCard from './CourseRecommendationCard';

interface Course {
  title: string;
  provider: string;
  url: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsCovered: string[];
  rating: number;
  description: string;
  estimatedCompletionWeeks: number;
}

interface CourseRecommendationsProps {
  skillGaps?: string[];
  targetRole?: string;
  currentLevel?: string;
}

export default function CourseRecommendations({ 
  skillGaps = [],
  targetRole = 'Software Engineer',
  currentLevel = 'Intermediate'
}: CourseRecommendationsProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/learning/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillGaps: skillGaps.length > 0 ? skillGaps : ['React', 'TypeScript', 'Node.js'],
          targetRole,
          currentLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recommendations');
      }

      setCourses(data.recommendations || []);
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCachedRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/learning/recommendations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load recommendations');
      }

      if (data.recommendations && data.recommendations.length > 0) {
        setCourses(data.recommendations);
        setHasGenerated(true);
      } else {
        // No cached recommendations, generate new ones
        await generateRecommendations();
      }
    } catch (err) {
      console.error('Error loading cached recommendations:', err);
      // If loading cached fails, generate new ones
      await generateRecommendations();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCourse = (course: Course) => {
    console.log('Saving course:', course.title);
    // TODO: Implement save to user's saved courses
  };

  const handleStartCourse = (course: Course) => {
    console.log('Starting course:', course.title);
    // TODO: Track course enrollment
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI-Powered Course Recommendations
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Personalized learning paths to fill your skill gaps
          </p>
        </div>

        {!hasGenerated && (
          <Button
            onClick={loadCachedRecommendations}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>
        )}
      </div>

      {/* Info Card */}
      {!hasGenerated && skillGaps.length > 0 && (
        <Card className="p-4 bg-purple-900/20 border-purple-800">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Ready to close your skill gaps?
              </h4>
              <p className="text-sm text-gray-300">
                Our AI will analyze your profile and recommend courses from top platforms like 
                Coursera, Udemy, and LinkedIn Learning to help you reach {targetRole}.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Skills to focus on: {skillGaps.slice(0, 3).join(', ')}
                {skillGaps.length > 3 && ` +${skillGaps.length - 3} more`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-red-900/20 border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Failed to generate recommendations
              </h4>
              <p className="text-sm text-gray-300">{error}</p>
              <Button
                onClick={generateRecommendations}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-gray-300 text-lg font-medium">
            Analyzing your profile...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Finding the best courses for you
          </p>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length > 0 && !isLoading && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Found {courses.length} personalized course recommendations
            </p>
            <Button
              onClick={generateRecommendations}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <CourseRecommendationCard
                key={`${course.provider}-${course.title}-${index}`}
                course={course}
                index={index}
                onSave={handleSaveCourse}
                onStart={handleStartCourse}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

