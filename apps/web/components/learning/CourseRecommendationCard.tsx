'use client';

import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { 
  ExternalLink, 
  Clock, 
  BarChart3, 
  Star, 
  BookOpen,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

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

interface CourseRecommendationCardProps {
  course: Course;
  index: number;
  onSave?: (course: Course) => void;
  onStart?: (course: Course) => void;
  isSaved?: boolean;
}

export default function CourseRecommendationCard({ 
  course, 
  index,
  onSave,
  onStart,
  isSaved = false
}: CourseRecommendationCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(course);
  };

  const handleStart = () => {
    window.open(course.url, '_blank');
    onStart?.(course);
  };

  const difficultyConfig = {
    Beginner: { color: 'bg-gray-800 text-gray-300', icon: '○' },
    Intermediate: { color: 'bg-gray-800 text-gray-300', icon: '◐' },
    Advanced: { color: 'bg-gray-800 text-gray-300', icon: '●' }
  };

  const providerLogos: Record<string, string> = {
    Coursera: '📚',
    Udemy: '🎓',
    'LinkedIn Learning': '💼',
    Pluralsight: '⚡',
    edX: '🎯',
    freeCodeCamp: '💻',
    'Khan Academy': '📖'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 hover:border-purple-500 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {providerLogos[course.provider] || '📚'}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400">{course.provider}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-colors ${
              saved 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            title={saved ? 'Saved' : 'Save course'}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Duration */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{course.duration}</span>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-0.5 rounded text-xs ${difficultyConfig[course.difficulty].color}`}>
              {course.difficulty}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-300">{course.rating.toFixed(1)}</span>
          </div>

          {/* Completion Time */}
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{course.estimatedCompletionWeeks}w</span>
          </div>
        </div>

        {/* Skills Covered */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Skills Covered
          </p>
          <div className="flex flex-wrap gap-2">
            {course.skillsCovered.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Button
            onClick={handleStart}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Start Course
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

